// Kuća Car, Supetar, shown the way 3D Estate shows a house before it is built: path-traced 360°
// panoramas you step between, the plan with where you stand and look, the building turning on
// its turntable, each in four times of day. Everything on screen is a render; this file moves you.
import { POINTS, TIMES, DEFAULT_TIME, START, EYE, FILES, FLOORS, ZONES } from './data.js';
import { createPano, basis, project } from './pano.js';
import { PlanView, floorOf, portrait } from './plan.js';
import { Turntable } from './turntable.js';

const $ = (s) => document.querySelector(s);
const P = Object.fromEntries(POINTS.map((p) => [p.id, p]));
const FL = Object.fromEntries(FLOORS.map((f) => [f.id, f]));
const D = Math.PI / 180;
const touch = matchMedia('(pointer: coarse)').matches;
const Q = new URLSearchParams(location.search);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const ease = (t) => t * t * (3 - 2 * t);
const headingTo = (a, b) => Math.atan2(b.at[0] - a.at[0], b.at[1] - a.at[1]);
const markAt = (from, id) => (from.marks && from.marks[id]) || P[id].at;   // where the ring for a link is drawn
const headTo = (from, at) => Math.atan2(at[0] - from.at[0], at[1] - from.at[1]);
const lookOf = (p) => (p.look != null ? p.look * D : headingTo(p, P[p.links[0]]));
const levelOf = (p) => (p.zone === 'okucnica' ? 'Okućnica · ' + FL[floorOf(p)].lvl : `${FL[floorOf(p)].n} ${FL[floorOf(p)].lvl}`);

export async function start(progress) {
  let time = TIMES.some((t) => t.id === Q.get('t')) ? Q.get('t') : DEFAULT_TIME;
  let mode = null, cur = null, fade = null, dirty = true, token = 0, want = null, fovSet = false;
  let sway = null;                              // the way in: the first view swings slowly to either side
  const view = { yaw: 0, pitch: 0, fov: 72, w: innerWidth, h: innerHeight };
  const hist = [], uploads = [];
  const defFov = () => (portrait() ? 92 : 72);
  const hfov = () => 2 * Math.atan(Math.tan((view.fov * D) / 2) * (view.w / view.h));
  view.fov = defFov();

  const pano = createPano($('#view'), { dpr: +Q.get('dpr') || 3 });
  pano.resize(view.w, view.h);
  const A = { e: null, w: null, alpha: 1, fovK: 1 }, B = { e: null, w: null, alpha: 0, fovK: 1 };
  const layers = [A, B];
  let waterBox = {};

  // ---------- moving between points ----------
  // how: 'step' (a ring or ↑: turn toward it and push forward), 'back' (↓: keep the heading, pull back),
  //      'jump' (list or plan: crossfade, open at the point's own view), 'time' (same point, other light)
  async function go(id, how = 'jump', yaw = null) {
    const p = P[id];
    if (!p || (cur && cur.id === id && how !== 'time')) return;
    const my = ++token, t = time;
    const slow = setTimeout(() => bar(true), 150);
    let e;
    try { e = await pano.get(FILES.panoS(t, id)).p; }
    catch (err) { clearTimeout(slow); bar(false); if (my === token) hint('Panorama nije dostupna: ' + p.n, 2600); return; }
    clearTimeout(slow); bar(false);
    if (my !== token) return;
    if (fade) finish();
    pano.upload(e);
    const from = cur;
    if (from && (how === 'step' || how === 'jump')) hist.push(from.id);
    cur = p;
    let y1 = view.yaw, p1 = view.pitch;
    if (how === 'step' && from) { y1 = view.yaw + wrap(headingTo(from, p) - view.yaw); p1 = clamp(view.pitch, -0.2, 0.2) * 0.3; }
    else if (how === 'jump' || !from) { y1 = view.yaw + wrap(lookOf(p) - view.yaw); p1 = 0; }
    if (yaw != null) y1 = yaw;
    const w = waterBox[id] ? pano.water(FILES.water(t, id), waterBox[id]) : null;
    const full = pano.get(FILES.pano(t, id), true);
    want = { e: full, p, t };
    full.p.catch(() => { if (want && want.e === full) { want = null; pin(); neighbours(); } });
    if (!A.e || how === 'first' || mode !== 'setnja') {
      pano.dropWater(A.w); Object.assign(A, { e: full.tex ? full : e, w, alpha: 1, fovK: 1 });
      view.yaw = y1; view.pitch = p1;
    } else {
      Object.assign(B, { e: full.tex ? full : e, w, alpha: 0, fovK: 1 });
      fade = { t: 0, how, dur: how === 'time' ? 0.55 : how === 'jump' ? 0.6 : 0.75, y0: view.yaw, y1, p0: view.pitch, p1 };
    }
    pin(); here(); buildMarks(); mini(true); keepUrl(); dirty = true;
    if (mode === 'tlocrt') { if (plan.floor !== floorOf(p)) showFloor(floorOf(p)); else plan.setView(p.id, y1, hfov()); }
  }

  function finish() {
    if (!fade) return;
    view.yaw = fade.y1; view.pitch = fade.p1;
    pano.dropWater(A.w);
    Object.assign(A, { e: B.e, w: B.w, alpha: 1, fovK: 1 });
    Object.assign(B, { e: null, w: null, alpha: 0, fovK: 1 });
    fade = null; pin(); dirty = true;
  }

  function pin() { pano.pinned.clear(); for (const L of layers) if (L.e) pano.pinned.add(L.e); if (want) pano.pinned.add(want.e); }

  // after the full frame is in: the previews of every linked point, and of this point at the other hours
  function neighbours() {
    const list = cur.links.map((l) => FILES.panoS(time, l)).concat(TIMES.filter((x) => x.id !== time).map((x) => FILES.panoS(x.id, cur.id)));
    for (const u of list) pano.get(u).p.then((e) => uploads.push(e), () => {});
  }

  function stepForward() {
    if (!cur || mode !== 'setnja') return;
    let best = null, bd = 60 * D;
    for (const l of cur.links) { const d = Math.abs(wrap(headTo(cur, markAt(cur, l)) - view.yaw)); if (d <= bd) { bd = d; best = l; } }
    if (best) go(best, 'step'); else hint('Ovim smjerom nema prolaza. Okreni se ili dodirni krug na podu.', 2200);
  }
  function stepBack() {
    if (!cur || mode !== 'setnja' || !hist.length) return;
    go(hist.pop(), 'back');
  }

  function setTime(t) {
    if (t === time) return;
    time = t;
    document.querySelectorAll('#times button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.t === t));
    tt.set(t);
    if (cur) go(cur.id, 'time');
    rooms();
    keepUrl();
  }

  // ---------- rings on the floor where each linked point stands ----------
  const svg = $('#marks'), tip = $('#tip'), NS = 'http://www.w3.org/2000/svg';
  let marks = [], hover = null, next = null;
  function buildMarks() {
    svg.innerHTML = ''; marks = []; hover = null; next = null; cv.classList.remove('over'); tip.classList.remove('on');
    for (const id of cur.links) {
      const q = P[id], at = markAt(cur, id), dist = Math.hypot(at[0] - cur.at[0], at[1] - cur.at[1]);
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = '<path class="under"/><path class="ring"/><circle class="ctr" r="2"/>';
      svg.appendChild(g);
      marks.push({ q, at, g, R: clamp(0.045 * dist, 0.28, 0.9), poly: null, c: null, top: 0 });
    }
  }
  function placeMarks() {
    svg.style.opacity = fade ? 0 : 1;
    if (fade || !cur) { tip.classList.remove('on'); return; }
    const b = basis(view), e = [cur.at[0], cur.at[1], cur.at[2] + EYE];
    next = null; let bd = 60 * D;
    for (const m of marks) {
      const d = Math.abs(wrap(headTo(cur, m.at) - view.yaw)); if (d <= bd) { bd = d; next = m; }
      const poly = [];
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * 2 * Math.PI, s = project(b, view, e, [m.at[0] + m.R * Math.cos(a), m.at[1] + m.R * Math.sin(a), m.at[2]]);
        if (!s) { poly.length = 0; break; }
        poly.push(s);
      }
      const c = poly.length && project(b, view, e, m.at);
      m.poly = poly.length && c ? poly : null; m.c = c;
      m.g.style.display = m.poly ? '' : 'none';
      if (!m.poly) continue;
      const d2 = 'M' + poly.map((s) => s[0].toFixed(1) + ' ' + s[1].toFixed(1)).join('L') + 'Z';
      m.g.children[0].setAttribute('d', d2); m.g.children[1].setAttribute('d', d2);
      m.g.children[2].setAttribute('cx', c[0].toFixed(1)); m.g.children[2].setAttribute('cy', c[1].toFixed(1));
      m.top = Math.min(...poly.map((s) => s[1]));
    }
    for (const m of marks) { m.g.classList.toggle('hot', m === hover); m.g.classList.toggle('next', m === next); }
    const t = hover || (touch ? next : null);
    if (t && t.poly) {
      const other = floorOf(t.q) !== floorOf(cur);
      tip.firstChild.innerHTML = t.q.n + (other ? `<small>${FL[floorOf(t.q)].n} ${FL[floorOf(t.q)].lvl}</small>` : '');
      tip.style.transform = `translate(${t.c[0].toFixed(1)}px, ${(t.top - 2).toFixed(1)}px) translate(-50%, -100%)`;
      tip.classList.add('on');
    } else tip.classList.remove('on');
  }
  const inPoly = (poly, x, y) => {
    let k = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) k = !k;
    }
    return k;
  };
  function hit(x, y) {
    let best = null, bd = Infinity;
    for (const m of marks) {
      if (!m.poly) continue;
      const d = Math.hypot(x - m.c[0], y - m.c[1]);
      if ((inPoly(m.poly, x, y) || d < 26) && d < bd) { bd = d; best = m; }
    }
    return best;
  }

  // ---------- look: drag, pinch, wheel, keys, with a little glide after a flick ----------
  const cv = $('#view'), pts = new Map(), vel = { y: 0, p: 0 }, keys = { l: 0, r: 0 };
  let drag = null, spin = 0;
  const radPx = () => (2 * Math.tan((view.fov * D) / 2)) / view.h;
  cv.addEventListener('pointerdown', (e) => {
    pts.set(e.pointerId, [e.clientX, e.clientY]); cv.setPointerCapture(e.pointerId); cv.classList.add('grab');
    vel.y = vel.p = 0; hintOff();
    if (pts.size === 2) { const [a, b] = [...pts.values()]; drag = { pinch: Math.hypot(a[0] - b[0], a[1] - b[1]), fov: view.fov, moved: 99 }; }
    else drag = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, lt: performance.now(), t0: performance.now(), moved: 0 };
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drag) {
      if (e.pointerType !== 'mouse') return;
      const h = hit(e.clientX, e.clientY);
      if (h !== hover) { hover = h; cv.classList.toggle('over', !!h); dirty = true; }
      return;
    }
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2 && drag.pinch) {
      const [a, b] = [...pts.values()];
      view.fov = clamp((drag.fov * drag.pinch) / Math.max(1, Math.hypot(a[0] - b[0], a[1] - b[1])), 40, 95); fovSet = true; dirty = true; return;
    }
    if (drag.pinch) return;
    const k = radPx(), dx = e.clientX - drag.lx, dy = e.clientY - drag.ly, now = performance.now(), dt = Math.max(8, now - drag.lt) / 1000;
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y));
    view.yaw -= dx * k; view.pitch = clamp(view.pitch + dy * k, -85 * D, 85 * D);
    vel.y = 0.7 * vel.y + 0.3 * ((-dx * k) / dt); vel.p = 0.7 * vel.p + 0.3 * ((dy * k) / dt);
    drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now; dirty = true;
  });
  const up = (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size) { const [q] = [...pts.values()]; drag = { x: q[0], y: q[1], lx: q[0], ly: q[1], lt: performance.now(), t0: 0, moved: 99 }; return; }
    cv.classList.remove('grab');
    const d = drag; drag = null;
    if (!d || e.type === 'pointercancel') return;
    if (d.moved < 7 && performance.now() - d.t0 < 600) { vel.y = vel.p = 0; const h = hit(e.clientX, e.clientY); if (h) go(h.q.id, 'step'); return; }
    if (performance.now() - d.lt > 80) vel.y = vel.p = 0;
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', () => { if (hover) { hover = null; cv.classList.remove('over'); dirty = true; } });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); view.fov = clamp(view.fov * Math.exp(e.deltaY * 0.0012), 40, 95); fovSet = true; dirty = true; }, { passive: false });

  let ttKey = 0;
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || sway) return;
    const k = e.key;
    if (k === 'Escape') { rooms(false); return; }
    if (mode === 'zgrada' && (k === 'ArrowLeft' || k === 'ArrowRight')) {
      e.preventDefault(); const now = performance.now();
      if (now - ttKey > 55) { tt.step(k === 'ArrowRight' ? 1 : -1); ttKey = now; }
      return;
    }
    if (mode !== 'setnja') return;
    if (k === 'ArrowLeft') keys.l = 1; else if (k === 'ArrowRight') keys.r = 1;
    else if (k === 'ArrowUp') { if (!e.repeat) stepForward(); } else if (k === 'ArrowDown') { if (!e.repeat) stepBack(); }
    else if (k === '+' || k === '=') { view.fov = clamp(view.fov - 6, 40, 95); fovSet = true; }
    else if (k === '-' || k === '_') { view.fov = clamp(view.fov + 6, 40, 95); fovSet = true; }
    else return;
    e.preventDefault(); hintOff(); dirty = true;
  });
  addEventListener('keyup', (e) => { if (e.key === 'ArrowLeft') keys.l = 0; else if (e.key === 'ArrowRight') keys.r = 0; });
  addEventListener('blur', () => { keys.l = keys.r = 0; });

  // ---------- the frame loop: draws only when something moved ----------
  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (mode !== 'setnja') return;
    if (sway && cur && !fade) {
      if (sway.y0 == null) sway.y0 = view.yaw;
      sway.t += dt; view.yaw = sway.y0 + 0.3 * Math.sin((sway.t / 44) * 2 * Math.PI); dirty = true;
    }
    spin += ((keys.r - keys.l) * 1.35 - spin) * Math.min(1, dt * 7);
    if (Math.abs(spin) > 0.002) { view.yaw += spin * dt; dirty = true; } else spin = 0;
    if (!drag && (Math.abs(vel.y) > 0.005 || Math.abs(vel.p) > 0.005)) {
      view.yaw += vel.y * dt; view.pitch = clamp(view.pitch + vel.p * dt, -85 * D, 85 * D);
      const k = Math.exp(-dt / 0.28); vel.y *= k; vel.p *= k; dirty = true;
    }
    if (fade) {
      fade.t = Math.min(1, fade.t + dt / fade.dur);
      const t = fade.t, k = ease(t), turn = ease(Math.min(1, t * 1.6));
      view.yaw = fade.y0 + (fade.y1 - fade.y0) * turn; view.pitch = fade.p0 + (fade.p1 - fade.p0) * turn;
      if (fade.how === 'step') { A.fovK = 1 - 0.3 * k; B.fovK = 1 + 0.12 * (1 - k); B.alpha = ease(clamp((t - 0.2) / 0.7, 0, 1)); }
      else if (fade.how === 'back') { A.fovK = 1 + 0.2 * k; B.fovK = 1 - 0.08 * (1 - k); B.alpha = ease(clamp((t - 0.1) / 0.75, 0, 1)); }
      else B.alpha = k;
      dirty = true;
      if (t >= 1) finish();
    } else if (want && (want.e.img || want.e.tex) && want.p === cur && want.t === time) {
      pano.upload(want.e);                    // full resolution in, the preview out
      if (A.e && A.e.url === FILES.panoS(want.t, want.p.id)) A.e = want.e;
      want = null; pin(); neighbours(); dirty = true;
    } else if (uploads.length) pano.upload(uploads.shift());
    if (pano.pumpWater(A.w)) dirty = true;
    if (B.w && pano.pumpWater(B.w)) dirty = true;
    if (!dirty) return;
    dirty = false;
    pano.draw(view, layers);
    placeMarks();
    if (miniPlan.floor) miniPlan.setView(cur && cur.id, view.yaw, hfov());
  }

  // ---------- the plates ----------
  const hintEl = $('#hint');
  let hintT = 0;
  function hint(text, ms = 0) { clearTimeout(hintT); hintEl.textContent = text; hintEl.classList.toggle('off', !text); if (ms) hintT = setTimeout(hintOff, ms); }
  function hintOff() { clearTimeout(hintT); hintEl.classList.add('off'); }
  const walkHint = () => hint(touch ? 'Povuci za pogled · dodirni krug na podu za korak' : 'Povuci za pogled · klik na krug za korak · ← → okret · ↑ naprijed · ↓ natrag', 7000);
  const bar = (on) => $('#bar').classList.toggle('on', on);

  function here() {
    $('#room').textContent = cur.n; $('#lvl').textContent = levelOf(cur);
    $('#minifl').textContent = FL[floorOf(cur)].n + ' ' + FL[floorOf(cur)].lvl;
    document.querySelectorAll('#rooms button').forEach((b) => b.setAttribute('aria-current', b.dataset.id === cur.id));
  }
  const roomsEl = $('#rooms'), hereBtn = $('#here');
  function rooms(open) {
    if (open === undefined) {                 // rebuild (time changed or first draw), keep open state
      roomsEl.innerHTML = ZONES.map((z) => `<h3><span class="k">${z.n}</span></h3>` + POINTS.filter((p) => p.zone === z.id).map((p) =>
        `<button type="button" data-id="${p.id}" aria-current="${!!cur && cur.id === p.id}"><img src="${FILES.panoS(time, p.id)}" alt="" loading="lazy"><span>${p.n}</span></button>`).join('')).join('');
      return;
    }
    roomsEl.classList.toggle('on', open); hereBtn.setAttribute('aria-expanded', open);
    if (open) hintOff();
  }
  roomsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { rooms(false); go(b.dataset.id, 'jump'); } });
  hereBtn.onclick = () => rooms(!roomsEl.classList.contains('on'));
  cv.addEventListener('pointerdown', () => rooms(false));

  $('#times').innerHTML = TIMES.map((t) => `<button type="button" data-t="${t.id}" aria-pressed="${t.id === time}"><b>${t.n}</b><small>${t.t}</small></button>`).join('');
  $('#times').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setTime(b.dataset.t); });
  $('#floors').innerHTML = FLOORS.map((f) => `<button type="button" data-f="${f.id}" aria-pressed="false"><b>${f.n}</b><small>${f.lvl}</small></button>`).join('');
  $('#floors').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showFloor(b.dataset.f); });
  document.querySelectorAll('#modes button').forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));

  // ---------- plan, small plan, turntable ----------
  const small = () => innerWidth <= 640;
  const plan = new PlanView($('#planview'), { onPick: (id) => setMode('setnja', id, 'jump'), insets: () => (small() ? [74, 12, 120, 12] : innerHeight <= 520 ? [58, 12, 60, 12] : [88, 28, 88, 28]) });
  const north = $('#north');
  north.innerHTML = '<svg viewBox="-24 -24 48 48" aria-hidden="true"><circle r="14" class="nc"/><path class="nn" d="M0 -14 L4.5 4 L0 1 L-4.5 4 Z"/></svg><span>N</span>';
  plan.onLayout = (pv) => {
    const a = pv.northAngle();
    north.querySelector('.nn').setAttribute('transform', `rotate(${a.toFixed(1)})`);
    const n = north.querySelector('span'); n.style.left = 24 + 20 * Math.sin(a * D) + 'px'; n.style.top = 24 - 20 * Math.cos(a * D) + 'px';
    const L = [1, 2, 5, 10, 20].find((m) => m * pv.s >= 46) || 20;
    $('#scale i').style.width = L * pv.s + 'px'; $('#scale span').textContent = L + ' m';
  };
  function showFloor(f) {
    plan.setFloor(f); plan.fit(); plan.setView(cur && cur.id, view.yaw, hfov());
    document.querySelectorAll('#floors button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === f));
  }
  const miniPlan = new PlanView($('#minimap'), { mini: true });
  function mini(animate) {
    if (!cur) return;
    miniPlan.setFloor(floorOf(cur));
    if ($('#minimap').clientWidth) miniPlan.follow(cur.at[0], cur.at[1], animate);
  }
  $('#minimap').onclick = () => setMode('tlocrt');
  $('#minimap').onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMode('tlocrt'); } };
  const tt = new Turntable($('#aer'), $('#dial'));

  function setMode(m, id, how) {
    mode = m;
    document.body.className = document.body.className.replace(/\bm-\S+/g, '').trim() + ' m-' + m;
    document.querySelectorAll('#modes button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === m));
    rooms(false); hover = null; cv.classList.remove('over');
    if (m === 'setnja') {
      tt.close(); dirty = true;
      if (id) go(id, how || 'jump'); else if (!cur) go(P[Q.get('p')] ? Q.get('p') : START, 'first');
      mini(false);
      walkHint();
    } else if (m === 'tlocrt') {
      tt.close(); const c = cur || P[Q.get('p')]; showFloor(c ? floorOf(c) : 'ground');
      hint(touch ? 'Dodirni točku za šetnju 360° · raširi prste za uvećanje' : 'Klikni točku za šetnju 360° · kotačić za uvećanje', 5000);
    } else {
      tt.set(time); tt.open();
      hint(touch ? 'Povuci lijevo-desno za okretanje zgrade' : 'Povuci ili ← → za okretanje zgrade', 5000);
    }
    keepUrl();
  }

  let urlT = 0;
  function keepUrl() {
    clearTimeout(urlT);
    urlT = setTimeout(() => {
      const u = new URLSearchParams(location.search);
      u.set('m', mode); u.set('t', time);
      if (cur) { u.set('p', cur.id); u.set('h', Math.round(((view.yaw / D) % 360 + 360) % 360)); }
      history.replaceState(null, '', '?' + u.toString().replace(/%2C/g, ','));
    }, 500);
  }
  cv.addEventListener('pointerup', keepUrl);
  addEventListener('keyup', keepUrl);

  addEventListener('resize', () => {
    view.w = innerWidth; view.h = innerHeight;
    if (!fovSet) view.fov = defFov();
    pano.resize(view.w, view.h); dirty = true;
    if (mode === 'tlocrt') plan.fit();
    if (mode === 'zgrada') tt.draw();
    mini(false);
  });

  // ---------- what the first screen needs; the rest comes behind it ----------
  progress('Učitavam…');
  waterBox = await fetch(FILES.waterJson).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  const first = P[Q.get('p')] ? Q.get('p') : START;
  progress('Učitavam šetnju…');
  await pano.get(FILES.panoS(time, first)).p;
  rooms();
  requestAnimationFrame(frame);
  window.dbg = { go, setMode, setTime, stepForward, stepBack, view, get cur() { return cur; }, get hist() { return hist; }, get layers() { return layers; }, get marks() { return marks; }, tt, plan, miniPlan };
  return {
    begin(mode) {                             // the mode the way in chose (list A360), else ?m=
      const ok = (m) => ['setnja', 'tlocrt', 'zgrada'].includes(m);
      const m = ok(mode) ? mode : ok(Q.get('m')) ? Q.get('m') : 'setnja';
      setMode(m);
      go(first, 'first', Q.has('h') ? (+Q.get('h') || 0) * D : null);   // supersedes the default one setMode asked for
      setTimeout(() => tt.set(time), 1200);     // turntable previews, quietly
    },
    sway(on) { sway = on ? { t: 0, y0: null } : null; },
    enter() { sway = null; keepUrl(); if (mode === 'setnja') walkHint(); },   // the title is gone: the walk is yours
  };
}
