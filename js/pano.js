// Equirect panoramas drawn by one full-screen shader: every screen pixel becomes a model-space
// ray, the ray becomes the pano's (u, v) by the convention in data.js (PANO). Two layers
// crossfade for a step; an optional looping video is laid exactly over its UV box; images are
// decoded off the main thread and kept in a small LRU so a phone never holds more than it needs.
import { PANO } from './data.js';

const VS = `#version 300 es
in vec2 p; out vec2 q;
void main() { q = p; gl_Position = vec4(p, 0., 1.); }`;

const FS = `#version 300 es
precision highp float;
in vec2 q; out vec4 o;
uniform sampler2D pano, water;
uniform vec3 F, R, U;            // forward, right * tan(hfov/2), up * tan(vfov/2), model space
uniform float h0, sgn, alpha, wOn;
uniform vec4 box;                // water UV box: u0 v0 u1 v1 (v = 0 at the top)
const float PI = 3.141592653589793;
void main() {
  vec3 d = normalize(F + q.x * R + q.y * U);
  float u = 0.5 + sgn * (atan(d.x, d.y) - h0) / (2. * PI);
  float v = acos(clamp(d.z, -1., 1.)) / PI;
  float uA = fract(u);
  // explicit gradients from the continuous angle: the atan wrap (a jump of exactly 1 in u) is rounded away, so
  // neighbouring pixels never disagree about the mip level (the old per-pixel copy choice left dotted streaks)
  vec2 gx = vec2(dFdx(u), dFdx(v)), gy = vec2(dFdy(u), dFdy(v));
  gx.x -= round(gx.x); gy.x -= round(gy.x);
  vec3 c = textureGrad(pano, vec2(uA, v), gx, gy).rgb;
  if (wOn > .5) {
    float w = fract(box.z - box.x); if (w <= 0.) w = 1.;
    vec2 t = vec2(fract(uA - box.x) / w, (v - box.y) / (box.w - box.y));
    if (t.x >= 0. && t.x <= 1. && t.y >= 0. && t.y <= 1.) {
      vec2 e = clamp(min(t, 1. - t) / vec2(.04, .06), 0., 1.);
      c = mix(c, textureLod(water, t, 0.).rgb, smoothstep(0., 1., min(e.x, e.y)));
    }
  }
  o = vec4(c, alpha);
}`;

const H0 = Math.atan2(PANO.centre[0], PANO.centre[1]);
const SGN = PANO.clockwise ? 1 : -1;

// Camera basis for a view {yaw, pitch, fov (vertical, degrees), w, h}; yaw = heading clockwise from +Y.
export function basis(v) {
  const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
  const ty = Math.tan((v.fov * Math.PI) / 360), tx = (ty * v.w) / v.h;
  return { F: [sy * cp, cy * cp, sp], R: [cy, -sy, 0], U: [-sy * sp, -cy * sp, cp], tx, ty };
}

// Model point → screen px (or null when behind the camera). e = eye position.
export function project(b, v, e, P) {
  const d = [P[0] - e[0], P[1] - e[1], P[2] - e[2]];
  const z = d[0] * b.F[0] + d[1] * b.F[1] + d[2] * b.F[2];
  const len = Math.hypot(d[0], d[1], d[2]);
  if (z < 0.08 * len) return null;
  const x = (d[0] * b.R[0] + d[1] * b.R[1]) / (z * b.tx);
  const y = (d[0] * b.U[0] + d[1] * b.U[1] + d[2] * b.U[2]) / (z * b.ty);
  return [((x + 1) / 2) * v.w, ((1 - y) / 2) * v.h];
}

async function decode(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  const b = await r.blob();
  if (self.createImageBitmap) { try { return await createImageBitmap(b); } catch (e) { /* fall through */ } }
  const i = new Image(), s = URL.createObjectURL(b);
  i.src = s; await i.decode(); URL.revokeObjectURL(s);
  return i;
}

export function createPano(canvas, { dpr = 2, limits = { big: 3, small: 24 } } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('preglednik ne podržava WebGL 2');
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.bindAttribLocation(prog, 0, 'p'); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const U = Object.fromEntries(['pano', 'water', 'F', 'R', 'U', 'h0', 'sgn', 'alpha', 'wOn', 'box'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  gl.uniform1i(U.pano, 0); gl.uniform1i(U.water, 1); gl.uniform1f(U.h0, H0); gl.uniform1f(U.sgn, SGN);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const an = gl.getExtension('EXT_texture_filter_anisotropic');
  const maxAn = an ? Math.min(8, gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)) : 0;
  const blank = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blank);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

  const makeTex = (src, mips) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mips ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (mips) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, maxAn);
    } else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return t;
  };

  // ---------- textures: decode anywhere, upload when the frame allows, forget the oldest ----------
  const cache = new Map(), pinned = new Set();
  function get(url, big = false) {
    let e = cache.get(url);
    if (!e) {
      e = { url, big, tex: null, img: null, used: 0 };
      e.p = decode(url).then((img) => { e.img = img; return e; }, (err) => { cache.delete(url); throw err; });
      cache.set(url, e);
    }
    e.used = performance.now();
    return e;
  }
  function upload(e) {
    if (!e.tex && e.img) { e.tex = makeTex(e.img, true); if (e.img.close) e.img.close(); e.img = null; evict(); }
    return e.tex;
  }
  function evict() {
    for (const big of [true, false]) {
      const all = [...cache.values()].filter((e) => e.big === big && e.tex);
      let n = all.length;
      for (const e of all.filter((x) => !pinned.has(x)).sort((a, b) => a.used - b.used)) {
        if (n <= (big ? limits.big : limits.small)) break;
        gl.deleteTexture(e.tex); cache.delete(e.url); n--;
      }
    }
  }

  // ---------- water: a muted looping video, skipped without a word if its files are missing ----------
  const vids = document.getElementById('vids') || document.body;
  function water(urls, box) {
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    const w = { v, box, tex: null, ready: false, dead: false, fresh: false, poll: !('requestVideoFrameCallback' in v) };
    const list = urls.filter((u) => v.canPlayType(u.endsWith('.webm') ? 'video/webm; codecs="vp9"' : 'video/mp4; codecs="avc1.42E01E"'));
    let i = 0;
    const next = () => {
      if (w.dead) return;
      if (i >= list.length) { w.dead = true; v.remove(); return; }
      v.src = list[i++]; v.load(); v.play().catch(() => {});
    };
    v.addEventListener('error', next);
    v.addEventListener('playing', () => { w.ready = true; w.fresh = true; });
    if (!w.poll) { const cb = () => { w.fresh = true; if (!w.dead) v.requestVideoFrameCallback(cb); }; v.requestVideoFrameCallback(cb); }
    vids.appendChild(v); next();
    return w;
  }
  function dropWater(w) {
    if (!w || w.gone) return;
    w.dead = true; w.gone = true;
    v_stop(w.v);
    if (w.tex) gl.deleteTexture(w.tex);
  }
  const v_stop = (v) => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) { /* already gone */ } v.remove(); };
  function pumpWater(w) {                       // true when a new video frame went to the GPU
    if (!w || w.dead || !w.ready || w.v.readyState < 2 || (!w.fresh && !w.poll)) return false;
    w.fresh = false;
    if (!w.tex) {
      w.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, w.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    gl.bindTexture(gl.TEXTURE_2D, w.tex);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, w.v); } catch (e) { dropWater(w); return false; }
    return true;
  }

  // ---------- frame ----------
  function resize(w, h) {
    const r = Math.min(devicePixelRatio || 1, dpr);
    canvas.width = Math.round(w * r); canvas.height = Math.round(h * r);
  }
  // layers: [{ e: texture entry, w: water, alpha, fovK }] drawn in order, later ones blended over
  function draw(view, layers) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    for (const L of layers) {
      if (!L.e || !L.e.tex || L.alpha <= 0) continue;
      const b = basis({ ...view, fov: view.fov * (L.fovK || 1) });
      gl.uniform3f(U.F, b.F[0], b.F[1], b.F[2]);
      gl.uniform3f(U.R, b.R[0] * b.tx, b.R[1] * b.tx, 0);
      gl.uniform3f(U.U, b.U[0] * b.ty, b.U[1] * b.ty, b.U[2] * b.ty);
      gl.uniform1f(U.alpha, L.alpha);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, L.e.tex);
      const w = L.w && !L.w.dead && L.w.ready && L.w.tex ? L.w : null;
      gl.uniform1f(U.wOn, w ? 1 : 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, w ? w.tex : blank);
      if (w) gl.uniform4f(U.box, w.box.u0, w.box.v0, w.box.u1, w.box.v1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  return { gl, get, upload, pinned, water, dropWater, pumpWater, resize, draw };
}
