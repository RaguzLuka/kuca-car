// The building on a turntable: EXT.n frames per time of day. Previews come first so a drag
// answers at once; full frames are streamed in from the one you are looking at outward.
// The position is continuous: between two frames the nearer one is drawn and the next one is
// laid over it at the fraction, so a drag turns the house smoothly instead of jumping 5° at a time.
// When the hand lets go the house glides and then settles on the nearest whole frame (sharpest).
import { EXT, FILES } from './data.js';

const loadImg = (src) => new Promise((res, rej) => {
  const i = new Image(); i.decoding = 'async';
  i.onload = () => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(() => res(i));
  i.onerror = () => rej(new Error(src)); i.src = src;
});
const TICKS = 36;                                    // dial marks, whatever the frame count

export class Turntable {
  constructor(el, dial) {
    Object.assign(this, { el, dial, n: EXT.n, p: 0, i: 0, t: null, sets: {}, active: false, last: null, busy: 0, v: 0 });
    this.cv = el.querySelector('canvas'); this.cx = this.cv.getContext('2d');
    const ticks = Math.min(TICKS, this.n);
    dial.innerHTML = Array.from({ length: ticks }, (_, k) => `<button type="button" aria-label="${Math.round((k * 360) / ticks)}°"><i></i></button>`).join('');
    dial.querySelectorAll('button').forEach((b, k) => (b.onclick = () => { this.stop(); this.ease((k * this.n) / ticks); }));
    this.gestures();
  }

  set(t) { this.t = t; this.pump(); this.draw(); }
  open() { this.active = true; this.pump(); this.draw(); }
  close() { this.active = false; this.stop(); }
  step(d) { this.stop(); this.ease(Math.round(this.p) + d * EXT.dir * (this.n / TICKS)); }
  show(k) { this.p = ((k % this.n) + this.n) % this.n; this.i = Math.round(this.p) % this.n; this.draw(); this.pump(); }
  set_(t) { return (this.sets[t] ||= { s: [], f: [], pend: new Set() }); }

  // turn to frame k along the short way round, eased (dial, arrow keys, settling after a glide)
  ease(k, ms = 260) {
    cancelAnimationFrame(this.raf);
    const n = this.n, from = this.p;
    let d = ((k - from) % n + n) % n; if (d > n / 2) d -= n;
    const t0 = performance.now();
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - u, 3);
      this.show(from + d * e);
      if (u < 1) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  // keep four requests in flight: the nearest missing preview, then the nearest missing full frame
  pump(previewsOnly = !this.active) {
    const S = this.set_(this.t), n = this.n;
    // the previews come as one sheet (EXT.cols across): cut it into frames once it is in; the single preview
    // files stay the fallback if the sheet is missing
    if (EXT.cols && !S.atlas) {
      const t = this.t;
      S.atlas = loadImg(FILES.extAtlas(t)).then((img) => {
        const w = img.naturalWidth / EXT.cols, h = img.naturalHeight / Math.ceil(n / EXT.cols);
        for (let k = 0; k < n; k++) {                    // a small canvas per frame: drawn like an image
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, (k % EXT.cols) * w, Math.floor(k / EXT.cols) * h, w, h, 0, 0, w, h);
          S.s[k] = c;
        }
        if (t === this.t) this.draw();
      }).catch(() => { S.noAtlas = true; if (t === this.t) this.pump(); });
    }
    while (this.busy < 4) {
      let pick = null;
      for (const full of previewsOnly ? [false] : [false, true]) {
        if (!full && EXT.cols && !S.noAtlas) continue;     // previews come from the sheet
        for (let d = 0; d < n && !pick; d++) {
          for (const k of [(this.i + d) % n, (this.i - d + n) % n]) {
            const key = (full ? 'f' : 's') + k;
            if (!(full ? S.f : S.s)[k] && !S.pend.has(key)) { pick = { k, full, key }; break; }
          }
        }
        if (pick) break;
      }
      if (!pick) return;
      const t = this.t; S.pend.add(pick.key); this.busy++;
      loadImg(pick.full ? FILES.ext(t, pick.k) : FILES.extS(t, pick.k))
        .then((img) => {
          (pick.full ? S.f : S.s)[pick.k] = img;
          const a = Math.floor(this.p) % this.n;
          if (t === this.t && (pick.k === a || pick.k === (a + 1) % this.n)) this.draw();
        })
        .catch(() => { (pick.full ? S.f : S.s)[pick.k] = null; })
        .finally(() => { this.busy--; S.pend.delete(pick.key); if (t === this.t) this.pump(); });
    }
  }

  draw() {
    if (!this.active) return;
    const W = this.el.clientWidth, H = this.el.clientHeight, r = Math.min(devicePixelRatio || 1, 3);
    if (this.cv.width !== Math.round(W * r) || this.cv.height !== Math.round(H * r)) { this.cv.width = Math.round(W * r); this.cv.height = Math.round(H * r); }
    const S = this.set_(this.t), n = this.n;
    const a = Math.floor(this.p) % n, b = (a + 1) % n, f = this.p - Math.floor(this.p);
    // both frames from the same tier while turning, so the blend never mixes a sharp and a soft frame
    const full = S.f[a] && (f < 0.02 || S.f[b]);
    const A = (full ? S.f[a] : S.s[a] || S.f[a]) || this.last;
    const B = f >= 0.02 ? (full ? S.f[b] : S.s[b] || S.f[b]) : null;
    const ticks = Math.min(TICKS, n), on = Math.round((this.p * ticks) / n) % ticks;
    this.dial.querySelectorAll('button').forEach((el, k) => el.classList.toggle('on', k === on));
    const c = this.cx;
    c.setTransform(r, 0, 0, r, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#e6e0d5';
    c.fillRect(0, 0, W, H);
    if (!A) return;
    this.last = A;
    const iw = A.naturalWidth || A.width, ih = A.naturalHeight || A.height, tall = H > W * 1.1;
    // show all of the plot on paper rather than crop the roof and the pool
    let k = Math.min(W / iw, H / ih);
    if (tall) k = Math.min(Math.max(W / iw, H / ih), (1.7 * W) / iw);   // phone held upright: crop the sides, not the house
    const dw = iw * k, dh = ih * k, x = (W - dw) / 2, y = (H - dh) / 2 - (tall ? H * 0.04 : 0);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    c.drawImage(A, x, y, dw, dh);
    if (B) { c.globalAlpha = f; c.drawImage(B, x, y, dw, dh); c.globalAlpha = 1; }
  }

  gestures() {
    const el = this.el;
    let g = null;
    this.stop = () => { cancelAnimationFrame(this.raf); this.v = 0; };
    // a full-width drag turns the house about 3/4 of the way round
    const stepPx = () => Math.max(4, Math.min(30, el.clientWidth / (this.n * 0.75)));
    el.addEventListener('pointerdown', (e) => {
      this.stop();
      g = { x: e.clientX, p: this.p, lx: e.clientX, lt: performance.now() };
      el.setPointerCapture(e.pointerId); el.classList.add('grab');
    });
    el.addEventListener('pointermove', (e) => {
      if (!g) return;
      const now = performance.now(), dt = Math.max(1, now - g.lt);
      this.v = 0.7 * this.v + 0.3 * ((-(e.clientX - g.lx) / stepPx()) * 1000 / dt) * EXT.dir;   // frames per second
      g.lx = e.clientX; g.lt = now;
      this.show(g.p + (-(e.clientX - g.x) / stepPx()) * EXT.dir);
    });
    const up = () => {
      if (!g) return;
      g = null; el.classList.remove('grab');
      if (performance.now() - (this.lastMove || 0) > 80) this.v *= 0.3;   // a hand that stopped before letting go
      this.v = Math.max(-40, Math.min(40, this.v));
      if (Math.abs(this.v) < 3) { this.ease(Math.round(this.p), 180); return; }
      let last = performance.now();
      const glide = (now) => {
        const dt = (now - last) / 1000; last = now;
        this.v *= Math.exp(-dt / 0.35);
        this.show(this.p + this.v * dt);
        if (Math.abs(this.v) > 2.5) this.raf = requestAnimationFrame(glide);
        else this.ease(Math.round(this.p + Math.sign(this.v) * 0.3), 220);
      };
      this.raf = requestAnimationFrame(glide);
    };
    el.addEventListener('pointermove', () => { if (g) this.lastMove = performance.now(); });
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }
}
