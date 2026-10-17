// The plan render read like a drawing: fitted to the screen, turned a quarter on a tall phone so
// the long side runs down the screen (north then points roughly up), drag / pinch / wheel to look
// closer, points as buttons, the current point with a cone of the view. The same class draws the
// small follow-map in the walk.
import { PLAN, FILES, POINTS, FLOOR_SPLIT, NORTH } from './data.js';

const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const floorOf = (p) => (p.at[2] >= FLOOR_SPLIT ? 'first' : 'ground');
export const portrait = () => innerHeight > innerWidth * 1.1;

export class PlanView {
  constructor(el, { mini = false, onPick = null, insets = () => [0, 0, 0, 0] } = {}) {
    Object.assign(this, { el, mini, onPick, insets, floor: null, s: 1, ox: 0, oy: 0, rot: 0, cur: null, yaw: 0, hfov: 1.6, sFit: 1 });
    this.img = document.createElement('img'); this.img.alt = ''; this.img.decoding = 'async'; this.img.draggable = false;
    this.svg = document.createElementNS(NS, 'svg');
    this.cone = document.createElementNS(NS, 'path'); this.cone.setAttribute('class', 'cone');
    this.svg.appendChild(this.cone);
    this.layer = document.createElement('div');
    el.append(this.img, this.svg, this.layer);
    if (!mini) this.gestures();
  }

  setFloor(f) {
    if (f === this.floor) return;
    this.floor = f; this.fr = PLAN[f];
    this.img.src = FILES.plan(f);
    this.layer.innerHTML = ''; this.svg.querySelectorAll('.dotm').forEach((n) => n.remove());
    this.dots = POINTS.filter((p) => floorOf(p) === f).map((p) => {
      if (this.mini) {
        const c = document.createElementNS(NS, 'circle'); c.setAttribute('class', 'dotm'); c.setAttribute('r', 3.6);
        this.svg.appendChild(c); return { p, el: c };
      }
      const b = document.createElement('button'); b.className = 'pt'; b.type = 'button';
      b.innerHTML = `<i></i><span>${p.n}</span>`; b.setAttribute('aria-label', 'Šetnja 360°: ' + p.n);
      b.onclick = () => this.onPick && this.onPick(p.id);
      this.layer.appendChild(b); return { p, el: b };
    });
    this.fitted = false;
  }

  // model metres → metres on the (possibly turned) sheet → screen px
  m(x, y) { const a = x - (this.fr.cx - this.fr.w / 2), b = this.fr.cy + this.fr.h / 2 - y; return this.rot ? [this.fr.h - b, a] : [a, b]; }
  sc(x, y) { const [a, b] = this.m(x, y); return [this.ox + this.s * a, this.oy + this.s * b]; }
  vec(dx, dy) { return this.rot ? [dy, dx] : [dx, -dy]; }

  fit() {
    const W = this.el.clientWidth, H = this.el.clientHeight, [t, r, b, l] = this.insets();
    this.rot = portrait() && this.fr.w > this.fr.h ? 90 : 0;
    const cw = this.rot ? this.fr.h : this.fr.w, ch = this.rot ? this.fr.w : this.fr.h;
    const aw = W - l - r, ah = H - t - b;
    this.s = this.sFit = Math.min(aw / cw, ah / ch);
    this.ox = l + (aw - cw * this.s) / 2; this.oy = t + (ah - ch * this.s) / 2;
    this.fitted = true; this.layout();
  }

  follow(x, y, animate = true) {           // mini map: keep the point in the middle at a fixed scale
    const W = this.el.clientWidth, H = this.el.clientHeight;
    this.rot = portrait() && this.fr.w > this.fr.h ? 90 : 0;
    this.s = W / (W < 150 ? 10 : 14);
    const [a, b] = this.m(x, y), tx = W / 2 - this.s * a, ty = H / 2 - this.s * b;
    cancelAnimationFrame(this.raf);
    if (!animate || !this.fitted) { this.ox = tx; this.oy = ty; this.fitted = true; this.layout(); return; }
    const x0 = this.ox, y0 = this.oy, t0 = performance.now();
    const step = (now) => {
      const k = clamp((now - t0) / 450, 0, 1), e = k * k * (3 - 2 * k);
      this.ox = x0 + (tx - x0) * e; this.oy = y0 + (ty - y0) * e; this.layout();
      if (k < 1) this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  setView(cur, yaw, hfov) { this.cur = cur; this.yaw = yaw; this.hfov = hfov; this.layout(); }

  layout() {
    if (!this.fr || !this.fitted) return;
    const { s, fr } = this;
    this.img.style.width = fr.w * s + 'px'; this.img.style.height = fr.h * s + 'px';
    this.img.style.transform = this.rot ? `translate(${this.ox + fr.h * s}px, ${this.oy}px) rotate(90deg)` : `translate(${this.ox}px, ${this.oy}px)`;
    this.layer.classList.toggle('lbls', s >= 28);
    for (const d of this.dots) {
      const [x, y] = this.sc(d.p.at[0], d.p.at[1]), on = this.cur === d.p.id;
      if (this.mini) { d.el.setAttribute('cx', x); d.el.setAttribute('cy', y); d.el.setAttribute('class', 'dotm' + (on ? ' cur' : '')); d.el.setAttribute('r', on ? 4.6 : 3.4); }
      else { d.el.style.transform = `translate(${x}px, ${y}px)`; d.el.classList.toggle('cur', on); }
    }
    const p = POINTS.find((q) => q.id === this.cur);
    if (p && floorOf(p) === this.floor) {
      const [x, y] = this.sc(p.at[0], p.at[1]), R = clamp(2.2 * s, 30, 64);
      let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
      for (let i = 0; i <= 12; i++) {
        const h = this.yaw - this.hfov / 2 + (this.hfov * i) / 12, [vx, vy] = this.vec(Math.sin(h), Math.cos(h));
        d += `L${(x + R * vx).toFixed(1)} ${(y + R * vy).toFixed(1)}`;
      }
      this.cone.setAttribute('d', d + 'Z'); this.cone.style.display = '';
    } else this.cone.style.display = 'none';
    this.onLayout && this.onLayout(this);
  }

  northAngle() { const [vx, vy] = this.vec(NORTH[0], NORTH[1]); return (Math.atan2(vx, -vy) * 180) / Math.PI; }

  zoomAt(k, px, py) {
    const s = clamp(this.s * k, this.sFit * 0.8, this.sFit * 8);
    k = s / this.s; this.s = s;
    this.ox = px - (px - this.ox) * k; this.oy = py - (py - this.oy) * k;
    this.layout();
  }

  gestures() {
    const el = this.el, pts = new Map();
    let g = null;
    const mid = () => { const [a, b] = [...pts.values()]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.hypot(a[0] - b[0], a[1] - b[1])]; };
    const at = (e) => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.pt')) return;
      pts.set(e.pointerId, at(e)); el.setPointerCapture(e.pointerId); el.classList.add('grab');
      g = pts.size === 2 ? { pinch: mid(), s: this.s, ox: this.ox, oy: this.oy } : { p: at(e), ox: this.ox, oy: this.oy };
    });
    el.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId) || !g) return;
      pts.set(e.pointerId, at(e));
      if (pts.size === 2 && g.pinch) {
        const [mx, my, d] = mid(), [mx0, my0, d0] = g.pinch;
        this.s = g.s; this.ox = g.ox + (mx - mx0); this.oy = g.oy + (my - my0);
        this.zoomAt(d / Math.max(1, d0), mx, my);
      } else if (g.p) {
        const [x, y] = at(e); this.ox = g.ox + x - g.p[0]; this.oy = g.oy + y - g.p[1]; this.layout();
      }
    });
    const up = (e) => {
      pts.delete(e.pointerId);
      if (!pts.size) { g = null; el.classList.remove('grab'); return; }
      const [q] = [...pts.values()]; g = { p: q, ox: this.ox, oy: this.oy };
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', (e) => { e.preventDefault(); const [x, y] = at(e); this.zoomAt(Math.exp(-e.deltaY * 0.0016), x, y); }, { passive: false });
    el.addEventListener('dblclick', (e) => { if (e.target.closest('.pt')) return; const [x, y] = at(e); this.zoomAt(1.8, x, y); });
  }
}
