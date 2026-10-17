// Kuća Car · the way in: list A360 (css/gate.css). The ground-floor plan of A010 is drawn in ink, a
// parallel rule slides over it and leaves the plan render (plan/ground.webp) behind, then rests as the
// scale; the black "broj nacrta" cell of the title block is the way in, and the same rule crosses the
// screen once more to hand the sheet over to the walk. Model metres as in data.js: X = drawing left to
// right, Y = drawing bottom to top, ±0,00 = ground floor. The walls are lifted from A010 (its poché);
// the dimension chains, levels and room labels are A010's own numbers, placed where A010 puts them.
import { POINTS as TOUR_POINTS, START, NORTH, TIMES } from './data.js';

export function initGate() {
  const WALLS = {"rects":[[630,1180,665,1240],[635,1110,665,1180],[630,945,665,1110],[5,935,480,940],[630,935,1380,945],[0,925,480,935],[630,925,1385,935],[630,910,1380,925],[-5,900,480,925],[460,815,465,900],[455,810,465,815],[550,800,560,810],[570,800,1380,810],[550,790,1380,800],[565,780,1385,790],[440,770,485,810],[565,770,1380,780],[1155,765,1175,770],[1250,765,1380,770],[1250,760,1260,765],[-5,745,40,900],[0,740,35,745],[1335,735,1380,765],[1335,725,1385,735],[1335,705,1380,725],[1335,695,1385,705],[1250,690,1255,760],[1250,685,1260,690],[1335,685,1380,695],[1250,680,1380,685],[845,675,860,770],[1005,670,1080,675],[1005,665,1090,670],[845,660,995,675],[1000,660,1085,665],[1300,645,1330,655],[1340,645,1380,680],[1340,640,1385,645],[1300,610,1310,645],[1300,600,1330,610],[25,575,35,735],[1155,570,1170,765],[1340,570,1380,640],[1250,560,1380,570],[555,555,695,570],[1250,555,1320,560],[1335,555,1385,560],[440,550,485,570],[550,550,695,555],[780,550,1030,570],[1110,550,1170,570],[1250,550,1385,555],[440,545,490,550],[535,545,700,550],[755,545,1035,550],[1090,545,1170,550],[1250,545,1380,550],[440,540,470,545],[475,540,565,545],[680,540,780,545],[970,540,990,545],[1020,540,1120,545],[540,535,555,540],[760,535,770,540],[1090,535,1105,540],[1340,505,1380,545],[1340,495,1385,505],[1340,475,1380,495],[1340,465,1385,475],[440,460,465,540],[1340,455,1380,465],[1340,445,1385,455],[430,415,465,460],[15,405,25,565],[0,395,35,400],[440,365,465,415],[605,365,620,545],[440,300,470,365],[440,290,465,300],[600,290,620,365],[440,285,600,290],[605,285,620,290],[440,275,620,285],[455,270,620,275],[440,265,450,275],[455,265,465,270],[0,250,40,395],[-5,200,40,250],[440,195,465,265],[450,180,455,195],[-5,100,5,105],[25,100,40,105],[-5,55,40,100],[0,50,40,55],[440,45,465,115],[605,45,620,270],[970,45,985,540],[0,40,45,50],[50,40,100,45],[435,40,470,45],[605,40,625,45],[970,40,990,45],[1340,40,1380,445],[340,25,475,40],[535,25,680,40],[1175,25,1380,40],[0,20,160,40],[340,15,835,25],[1025,15,1380,25],[0,0,165,20],[335,0,475,15],[535,0,680,15],[840,0,1015,40],[1175,0,1380,15],[440,-5,475,0],[535,-5,570,0],[600,-5,680,0],[840,-5,920,0],[935,-5,1015,0],[1175,-5,1255,0]],"segs":[[630,1240,665,1240],[630,1180,635,1180],[630,1110,635,1110],[665,945,1380,945],[5,940,480,940],[0,935,5,935],[1380,935,1385,935],[-5,925,0,925],[1380,925,1385,925],[630,910,1380,910],[40,900,460,900],[465,900,480,900],[455,815,460,815],[440,810,455,810],[465,810,485,810],[550,810,560,810],[570,810,1380,810],[560,800,570,800],[550,790,565,790],[1380,790,1385,790],[1380,780,1385,780],[440,770,485,770],[565,770,845,770],[860,770,1155,770],[1175,770,1250,770],[1170,765,1175,765],[1260,765,1335,765],[1255,760,1260,760],[-5,745,0,745],[35,745,40,745],[0,740,35,740],[25,735,35,735],[1380,735,1385,735],[1380,725,1385,725],[1380,705,1385,705],[1380,695,1385,695],[1255,690,1260,690],[1260,685,1335,685],[1250,680,1340,680],[860,675,995,675],[1005,675,1080,675],[1080,670,1090,670],[1000,665,1005,665],[1085,665,1090,665],[845,660,995,660],[1000,660,1085,660],[1300,655,1330,655],[1310,645,1330,645],[1380,645,1385,645],[1380,640,1385,640],[1310,610,1330,610],[1300,600,1330,600],[25,575,35,575],[440,570,485,570],[555,570,695,570],[780,570,1030,570],[1110,570,1155,570],[1250,570,1340,570],[15,565,25,565],[1320,560,1335,560],[1380,560,1385,560],[550,555,555,555],[1320,555,1335,555],[485,550,490,550],[535,550,550,550],[695,550,700,550],[755,550,780,550],[1030,550,1035,550],[1090,550,1110,550],[1380,550,1385,550],[470,545,475,545],[490,545,535,545],[565,545,605,545],[620,545,680,545],[700,545,755,545],[780,545,970,545],[990,545,1020,545],[1035,545,1090,545],[1120,545,1170,545],[1250,545,1340,545],[465,540,470,540],[475,540,540,540],[555,540,565,540],[680,540,760,540],[770,540,780,540],[985,540,990,540],[1020,540,1090,540],[1105,540,1120,540],[540,535,555,535],[760,535,770,535],[1090,535,1105,535],[1380,505,1385,505],[1380,495,1385,495],[1380,475,1385,475],[1380,465,1385,465],[430,460,440,460],[1380,455,1385,455],[1380,445,1385,445],[430,415,440,415],[15,405,25,405],[0,400,35,400],[35,395,40,395],[465,365,470,365],[600,365,605,365],[465,300,470,300],[465,290,605,290],[600,285,605,285],[450,275,455,275],[465,270,605,270],[450,265,455,265],[-5,250,0,250],[-5,200,40,200],[440,195,450,195],[455,195,465,195],[450,180,455,180],[440,115,465,115],[-5,105,5,105],[25,105,40,105],[5,100,25,100],[-5,55,0,55],[40,50,45,50],[50,45,100,45],[435,45,440,45],[465,45,470,45],[620,45,625,45],[985,45,990,45],[45,40,50,40],[100,40,160,40],[340,40,435,40],[470,40,475,40],[535,40,605,40],[625,40,680,40],[840,40,970,40],[990,40,1015,40],[1175,40,1340,40],[475,25,535,25],[680,25,835,25],[1025,25,1175,25],[160,20,165,20],[335,15,340,15],[475,15,535,15],[680,15,835,15],[1025,15,1175,15],[0,0,165,0],[335,0,440,0],[570,0,600,0],[920,0,935,0],[1255,0,1380,0],[440,-5,475,-5],[535,-5,570,-5],[600,-5,680,-5],[840,-5,920,-5],[935,-5,1015,-5],[1175,-5,1255,-5],[-5,925,-5,745],[-5,250,-5,200],[-5,105,-5,55],[0,935,0,925],[0,745,0,740],[0,400,0,250],[0,55,0,0],[5,940,5,935],[5,105,5,100],[15,565,15,405],[25,735,25,575],[25,565,25,405],[25,105,25,100],[35,745,35,740],[35,735,35,575],[35,400,35,395],[40,900,40,745],[40,395,40,200],[40,105,40,50],[45,50,45,40],[50,45,50,40],[100,45,100,40],[160,40,160,20],[165,20,165,0],[335,15,335,0],[340,40,340,15],[430,460,430,415],[435,45,435,40],[440,810,440,770],[440,570,440,460],[440,415,440,195],[440,115,440,45],[440,0,440,-5],[450,275,450,265],[450,195,450,180],[455,815,455,810],[455,275,455,265],[455,195,455,180],[460,900,460,815],[465,900,465,810],[465,540,465,365],[465,300,465,290],[465,270,465,195],[465,115,465,45],[470,545,470,540],[470,365,470,300],[470,45,470,40],[475,545,475,540],[475,40,475,25],[475,15,475,-5],[480,940,480,900],[485,810,485,770],[485,570,485,550],[490,550,490,545],[535,550,535,545],[535,40,535,25],[535,15,535,-5],[540,540,540,535],[550,810,550,790],[550,555,550,550],[555,570,555,555],[555,540,555,535],[560,810,560,800],[565,790,565,770],[565,545,565,540],[570,810,570,800],[570,0,570,-5],[600,365,600,285],[600,0,600,-5],[605,545,605,365],[605,290,605,285],[605,270,605,40],[620,545,620,45],[625,45,625,40],[630,1240,630,1180],[630,1110,630,910],[635,1180,635,1110],[665,1240,665,945],[680,545,680,540],[680,40,680,25],[680,15,680,-5],[695,570,695,550],[700,550,700,545],[755,550,755,545],[760,540,760,535],[770,540,770,535],[780,570,780,550],[780,545,780,540],[835,25,835,15],[840,40,840,-5],[845,770,845,660],[860,770,860,675],[920,0,920,-5],[935,0,935,-5],[970,545,970,40],[985,540,985,45],[990,545,990,540],[990,45,990,40],[995,675,995,660],[1000,665,1000,660],[1005,675,1005,665],[1015,40,1015,-5],[1020,545,1020,540],[1025,25,1025,15],[1030,570,1030,550],[1035,550,1035,545],[1080,675,1080,670],[1085,665,1085,660],[1090,670,1090,665],[1090,550,1090,545],[1090,540,1090,535],[1105,540,1105,535],[1110,570,1110,550],[1120,545,1120,540],[1155,770,1155,570],[1170,765,1170,545],[1175,770,1175,765],[1175,40,1175,25],[1175,15,1175,-5],[1250,770,1250,680],[1250,570,1250,545],[1255,760,1255,690],[1255,0,1255,-5],[1260,765,1260,760],[1260,690,1260,685],[1300,655,1300,600],[1310,645,1310,610],[1320,560,1320,555],[1330,655,1330,645],[1330,610,1330,600],[1335,765,1335,685],[1335,560,1335,555],[1340,680,1340,570],[1340,545,1340,40],[1380,945,1380,935],[1380,925,1380,910],[1380,810,1380,790],[1380,780,1380,735],[1380,725,1380,705],[1380,695,1380,645],[1380,640,1380,560],[1380,550,1380,505],[1380,495,1380,475],[1380,465,1380,455],[1380,445,1380,0],[1385,935,1385,925],[1385,790,1385,780],[1385,735,1385,725],[1385,705,1385,695],[1385,645,1385,640],[1385,560,1385,550],[1385,505,1385,495],[1385,475,1385,465],[1385,455,1385,445]]};

  // the walk's points: look is a heading in degrees, or the point it opens toward (data.js: null = links[0])
  const POINTS = TOUR_POINTS.map((p) => ({ id: p.id, n: p.n, at: p.at, look: p.look ?? p.links[0] }));
  const PT = Object.fromEntries(POINTS.map((p) => [p.id, p]));
  const Q = new URLSearchParams(location.search);
  const FIRST = PT[Q.get('p')] ? Q.get('p') : START; // the tour opens here (tour.js does the same)
  // what the invitation says about where the walk begins (others: „s točke …”)
  const WHERE = { bazen: 'od bazena, kroz vrt u kuću' };

  // ground.webp: orthographic, straight down, 24.4 × 15.25 m around (2.2, 4.6)
  const R = { x0: -10.0, x1: 14.4, y0: -3.025, y1: 12.225 };
  const NEED = { x0: -8.4, x1: 13.95 };             // along X the phone may crop to this, never less

  const POOL = { x0: -4.77, x1: -1.77, y0: 2.12, y1: 9.10, ledge: 7.9, rim: 0.25 };
  const STAIR = { x0: 6.0, x1: 9.92, y0: 6.66, y1: 7.68, n: 15 };
  const TREES = [[1.9, -2.25, 1.55, 10], [8.95, 11.25, 1.3, 40], [-9.0, -2.45, 1.35, 75], [-7.3, 11.7, 1.05, 20]];
  // k.č. 967/10 as A010 draws it, a closed heavy dashed polygon (it runs past the render on three sides)
  const PROP = [[-9.30, 12.18], [21.6, 12.87], [21.3, -4.05], [-7.67, -3.93]];
  const LEVELS = [[2.25, 5.95, '+0,00'], [6.75, 1.0, '+0,00'], [3.72, 10.19, '+0,00'], [4.5, -2.01, '+1,20'], [13.55, -1.6, '+1,06']];
  const SECTIONS = [{ n: '1', y: 2.46 }, { n: '2', y: 7.21 }, { n: '3', x: 10.28 }];
  // A010's room labels: number, name, floor area. wx, wy = the room's extent in metres (the lettering
  // must fit inside it); s = a shorter name for small scales; pp = where it sits on the upright phone plan,
  // pm = most lines there (the walk's points crowd the living room), pw = the width left there beside a walk
  // point (pwo: false = for the ink drawing only).
  const ROOMS = [
    { n: '1', t: 'Kuh., blag. i dn.boravak', s: 'Boravak', a: '34,39', at: [2.1, 4.7], pp: [3.95, 4.5], pm: 1, wx: 4.0, wy: 8.6 },
    { n: '2', t: 'Ostava', a: '3,22', at: [5.3, 1.6], wx: 1.4, wy: 2.45 },
    { n: '3', t: 'Kup. 1', a: '3,64', at: [5.4, 3.55], pp: [5.4, 3.5], pw: 1.1, wx: 1.4, wy: 2.4 },
    { n: '4', t: 'Hodnik', a: '10,89', at: [8.85, 6.08], rot: true, wx: 8.75, wy: 1.2 },
    { n: '5', t: 'Spavaća soba 1', s: 'Soba 1', a: '17,67', at: [8.25, 3.15], pp: [8.3, 2.95], wx: 3.5, wy: 5.0 },
    { n: '6', t: 'Spavaća soba 2', s: 'Soba 2', a: '17,97', at: [11.4, 3.15], pp: [11.45, 2.95], wx: 3.55, wy: 5.0 },
    { n: '7', t: 'Kup. 2', a: '3,40', at: [12.95, 6.95], pw: 0.8, pwo: false, wx: 0.9, wy: 2.0 },
    { n: '16', t: 'Tehnika', a: '2,82', at: [10.2, 7.22], wx: 1.7, wy: 1.0 },
  ];

  // dimension chains, cm, as on A010. side 't' = above the plan (model +Y), 'l' = left of it (model -X)
  const DIMS = [
    { side: 't', row: 2, at: [0, 1381] },
    { side: 't', row: 1, at: [0, 480, 570, 1381] },
    { side: 't', row: 0, at: [15, 40, 440, 465, 844, 859, 1156, 1171, 1341, 1366], fine: true },
    { side: 'l', row: 1, at: [0, 940] },
    { side: 'l', row: 0, at: [0, 102, 202, 395, 745, 940] },
  ];
  // chains drawn inside the plan: across the pool to the house, and along the pool
  const INDIMS = [
    { axis: 'x', c: 5.82, at: [-500, -475, -175, -150, 0] },
    { axis: 'y', c: -2.12, at: [210, 910] },
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const $ = (id) => document.getElementById(id);
  const field = $('field'), plot = $('plot'), ink = $('ink'), mark = $('mark'), rbox = $('rbox'), cover = $('cover');
  const f1 = (n) => Math.round(n * 10) / 10;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  function el(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in a) e.setAttribute(k, a[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(s, a, parent) { const t = el('text', a, parent); t.textContent = s; return t; }
  let G = null;

  // Fit the plan to the field. Upright fields get it turned 90° clockwise (north then points up) and take
  // the full width; on a short phone the far ends of the plot are cropped, never the house or the pool.
  function geom() {
    const fw = field.clientWidth, fh = field.clientHeight;
    const port = fw < fh * 1.05, desk = fw >= 640;
    const gap = desk ? 15 : 14;
    const M = port ? { t: 0, r: 0, b: 25, l: 0 }                       // chains inside, the scale under it
      : { t: 16 + (desk ? 3 : 2) * gap, r: 40, b: 12, l: 16 + (desk ? 2 : 1) * gap };
    const aw = fw - M.l - M.r, ah = fh - M.t - M.b;
    const SX = R.x1 - R.x0, SY = R.y1 - R.y0, V = { ...R };
    let s;
    if (port) {
      s = Math.min(aw / SY, ah / (NEED.x1 - NEED.x0));
      const vx = Math.min(SX, ah / s), mid = (NEED.x0 + NEED.x1) / 2;
      V.x0 = clamp(mid - vx / 2, R.x0, R.x1 - vx); V.x1 = V.x0 + vx;
    } else s = Math.min(aw / SX, ah / SY);
    const W = (port ? V.y1 - V.y0 : V.x1 - V.x0) * s, H = (port ? V.x1 - V.x0 : V.y1 - V.y0) * s;
    // upright: when the plan cannot take the full width, its chains go outside it, as on A010
    const cin = port && aw - W < 34, grp = port && !cin ? W + 30 : W;
    const ox = Math.round(M.l + (aw - grp) / 2), oy = Math.round(M.t + (ah - H) / 2);
    const P = port ? (x, y) => [ox + (y - V.y0) * s, oy + (x - V.x0) * s] : (x, y) => [ox + (x - V.x0) * s, oy + (V.y1 - y) * s];
    const D = port ? (dx, dy) => [dy, dx] : (dx, dy) => [dx, -dy];   // model direction -> sheet direction
    const inV = (x, y, pad = 0) => x >= V.x0 + pad && x <= V.x1 - pad && y >= V.y0 + pad && y <= V.y1 - pad;
    return { fw, fh, port, desk, gap, M, s, V, W, H, ox, oy, P, D, inV, cin };
  }

  const pth = (pts, close) => 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L') + (close ? 'Z' : '');
  function rectPts(x0, y0, x1, y1) { const P = G.P; return [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]; }

  // a dimension chain: the architect's slash ticks, the number above the line in its reading direction
  function chain(g, a, b, ticks, labels, opt = {}) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const vert = Math.abs(uy) > Math.abs(ux), ex = 5;
    let d = `M${f1(a[0] - ux * ex)} ${f1(a[1] - uy * ex)}L${f1(b[0] + ux * ex)} ${f1(b[1] + uy * ex)}`;
    const pts = ticks.map((t) => [a[0] + dx * t, a[1] + dy * t]);
    for (const p of pts) {
      d += `M${f1(p[0] - uy * 3.5)} ${f1(p[1] + ux * 3.5)}L${f1(p[0] + uy * 3.5)} ${f1(p[1] - ux * 3.5)}`;
      d += `M${f1(p[0] - 2.6)} ${f1(p[1] + 2.6)}L${f1(p[0] + 2.6)} ${f1(p[1] - 2.6)}`;
    }
    if (opt.halo) el('path', { d, class: 'u' }, g);
    el('path', { d }, g);
    const fs = opt.fs || 9;
    for (let i = 0; i < labels.length; i++) {
      const p = pts[i], q = pts[i + 1], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const s = String(labels[i]);
      if (len < s.length * fs * .5 + 2 && opt.fine) continue;            // too short to letter: ticks only
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, cls = opt.halo ? 'halo' : '';
      if (vert) txt(s, { x: f1(mx - 3), y: f1(my), 'text-anchor': 'middle', transform: `rotate(-90 ${f1(mx - 3)} ${f1(my)})`, 'font-size': fs, class: cls }, g);
      else txt(s, { x: f1(mx), y: f1(my - 3), 'text-anchor': 'middle', 'font-size': fs, class: cls }, g);
    }
  }

  // A010's chains around the plan: above it and left of it on a wide sheet. On a phone the plan takes
  // the full width, so the two chains along the house's length are drawn just inside its right edge.
  function chainsOut(g) {
    const { P, port, gap, desk, ox, W } = G;
    for (const c of DIMS) {
      const m0 = c.at[0] / 100, m1 = c.at[c.at.length - 1] / 100, span = m1 - m0;
      let ticks = c.at.map((v) => (v / 100 - m0) / span), labels = c.at.slice(1).map((v, i) => v - c.at[i]);
      let a, b;
      if (port) continue;                          // drawn on the plan itself: chainsRight()
      const row = c.row - (desk ? 0 : 1);
      if (row < 0) continue;
      const off = 14 + row * gap;
      if (c.side === 't') { a = P(m0, R.y1); b = P(m1, R.y1); a = [a[0], a[1] - off]; b = [b[0], b[1] - off]; }
      else {
        a = P(R.x0, m1); b = P(R.x0, m0); a = [a[0] - off, a[1]]; b = [b[0] - off, b[1]];
        ticks = ticks.map((t) => 1 - t).reverse(); labels = labels.slice().reverse();
      }
      chain(g, a, b, ticks, labels, { fine: c.fine || !desk, fs: desk ? 9.5 : 9 });
    }
  }

  function chainsRight(g) {
    const { P, ox, W } = G;
    for (const c of DIMS) {
      if (c.side !== 't' || c.row === 0) continue;
      const m0 = c.at[0] / 100, m1 = c.at[c.at.length - 1] / 100;
      const x = G.cin ? ox + W - (c.row === 2 ? 10 : 25) : ox + W + (c.row === 2 ? 28 : 14);
      const ticks = c.at.map((v) => (v / 100 - m0) / (m1 - m0)), labels = c.at.slice(1).map((v, i) => v - c.at[i]);
      chain(g, [x, P(m0, 0)[1]], [x, P(m1, 0)[1]], ticks, labels, { halo: G.cin, fs: 9 });
    }
  }

  function chainsIn(g) {
    for (const c of INDIMS) {
      const m0 = c.at[0] / 100, m1 = c.at[c.at.length - 1] / 100;
      let a = c.axis === 'x' ? G.P(m0, c.c) : G.P(c.c, m0), b = c.axis === 'x' ? G.P(m1, c.c) : G.P(c.c, m1);
      let ticks = c.at.map((v) => (v / 100 - m0) / (m1 - m0)), labels = c.at.slice(1).map((v, i) => v - c.at[i]);
      const vertical = Math.abs(b[1] - a[1]) > Math.abs(b[0] - a[0]);
      if ((vertical && b[1] > a[1]) || (!vertical && b[0] < a[0])) {
        const t = a; a = b; b = t; ticks = ticks.map((t) => 1 - t).reverse(); labels = labels.slice().reverse();
      }
      chain(g, a, b, ticks, labels, { fine: true, fs: 9 });
    }
  }

  // A010's room label: number, name, floor area. It is lettered in full where it fits inside the room;
  // otherwise on one line, then with the shorter name, then the number alone. On the render only the name
  // stays, with a paper halo.
  function roomLabel(g, r, over) {
    const rot = G.port && r.rot, at = G.port && r.pp ? r.pp : r.at, c = G.P(at[0], at[1]), fs = G.desk ? 9.5 : 9, lh = fs * 1.22;
    const along = G.port && r.pw && !(over && r.pwo === false) ? r.pw : G.port !== !!rot ? r.wy : r.wx, across = G.port !== !!rot ? r.wx : r.wy;
    const room = along * G.s - 6, tall = across * G.s - 4, most = G.port && r.pm ? r.pm : 3;
    const tries = over ? (G.s < 20 && r.s ? [[r.s]] : [[r.t], r.s && [r.s]]) : [[r.n, r.t, `P = ${r.a} m²`], [`${r.n} ${r.t}`], r.s && [`${r.n} ${r.s}`], [r.n]];
    const a = { class: 'room' };
    if (rot) a.transform = `rotate(-90 ${f1(c[0])} ${f1(c[1])})`;
    const gg = el('g', a, g);
    for (const [k, lines] of tries.entries()) {
      if (!lines || lines.length > most || (lines.length * lh > tall && lines.length > 1)) continue;
      gg.textContent = '';
      const ts = lines.map((s, i) => txt(s, { x: f1(c[0]), y: f1(c[1] + (i - (lines.length - 1) / 2) * lh + fs * .35), 'font-size': fs,
        class: 'halo' + (!over && lines.length === 3 && i === 0 ? ' n' : '') }, gg));
      if (Math.max(...ts.map((t) => t.getComputedTextLength())) <= room || (!over && k === tries.length - 1)) return;
    }
    gg.remove();
  }

  // The plan. 'paper' = the ink drawing before the render; 'over' = what stays drawn on the render.
  function planLayer(g, paper) {
    const P = G.P, s = G.s;
    if (paper) {                                     // walls: A010's poché, then its outline
      let d = '';
      for (const r of WALLS.rects) d += pth(rectPts(r[0] / 100, r[1] / 100, r[2] / 100, r[3] / 100), true);
      el('path', { d, class: 'poche' }, g);
    }
    let d = '';
    for (const q of WALLS.segs) d += pth([P(q[0] / 100, q[1] / 100), P(q[2] / 100, q[3] / 100)]);
    el('path', { d, class: 'wall' }, g);

    if (paper) {
      const p = POOL;                                // the pool: rim, water, the shallow ledge
      el('path', { d: pth(rectPts(p.x0 - p.rim, p.y0 - p.rim, p.x1 + p.rim, p.y1 + p.rim), true), class: 'thin' }, g);
      el('path', { d: pth(rectPts(p.x0, p.y0, p.x1, p.y1), true), class: 'water' }, g);
      el('path', { d: pth([P(p.x0, p.ledge), P(p.x1, p.ledge)]), class: 'thin', 'stroke-dasharray': '3 2' }, g);
      const st = STAIR;                              // the stair: treads, walking line, arrow
      let sd = pth(rectPts(st.x0, st.y0, st.x1, st.y1), true);
      for (let k = 1; k < st.n; k++) { const x = st.x0 + (st.x1 - st.x0) * k / st.n; sd += pth([P(x, st.y0), P(x, st.y1)]); }
      const ym = (st.y0 + st.y1) / 2, a = P(st.x0 + .15, ym), b = P(st.x1 - .25, ym);
      sd += pth([a, b]);
      el('path', { d: sd, class: 'thin' }, g);
      const [ux, uy] = G.D(1, 0), ah = 4.5;
      el('path', { d: pth([[b[0] + ux * ah, b[1] + uy * ah], [b[0] - uy * 2.4, b[1] + ux * 2.4], [b[0] + uy * 2.4, b[1] - ux * 2.4]], true), class: 'poche' }, g);
      let td = '';                                   // olive trees as A010 draws them: a crown, five boughs
      for (const [x, y, r, rot] of TREES) {
        const c = P(x, y), rp = r * s;
        td += `M${f1(c[0] + rp)} ${f1(c[1])}A${f1(rp)} ${f1(rp)} 0 1 0 ${f1(c[0] - rp)} ${f1(c[1])}A${f1(rp)} ${f1(rp)} 0 1 0 ${f1(c[0] + rp)} ${f1(c[1])}`;
        for (let k = 0; k < 5; k++) {
          const an = (rot + k * 72) * Math.PI / 180, cx = Math.cos(an), sy = Math.sin(an), m = [c[0] + cx * rp * .5, c[1] + sy * rp * .5];
          td += pth([[c[0] + cx * rp * .1, c[1] + sy * rp * .1], m, [c[0] + Math.cos(an - .28) * rp * .82, c[1] + Math.sin(an - .28) * rp * .82]]);
          td += pth([m, [c[0] + Math.cos(an + .3) * rp * .74, c[1] + Math.sin(an + .3) * rp * .74]]);
        }
      }
      el('path', { d: td, class: 'tree', 'clip-path': 'url(#cR)' }, g);   // a crown may run past the plan's edge
      // the plot boundary, k.č. 967/10: a closed dashed polygon clipped to the plan; it lifts off with the ink
      if (!G.port) el('path', { d: pth(PROP.map((q) => P(q[0], q[1])), true), class: 'prop', 'clip-path': 'url(#cR)' }, g);
      if (G.desk) {                                  // sections 1-1, 2-2, 3-3
        for (const sc of SECTIONS) {
          const a = sc.y != null ? P(-3.35, sc.y) : P(sc.x, -2.8), b = sc.y != null ? P(14.1, sc.y) : P(sc.x, 12.0);
          const sg = el('g', { class: 'sect' }, g);
          el('path', { d: pth([a, b]) }, sg);
          const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
          for (const [q, sn] of [[a, -1], [b, 1]]) {
            el('path', { d: pth([[q[0] - uy * 6, q[1] + ux * 6], [q[0] + uy * 6, q[1] - ux * 6]]), class: 'sbar' }, g);
            txt(sc.n, { x: f1(q[0] + ux * sn * 9 - uy * 9), y: f1(q[1] + uy * sn * 9 + ux * 9 + 3), 'text-anchor': 'middle', 'font-weight': 600 }, sg);
          }
        }
        chainsIn(el('g', { class: 'dim' }, g));
      }
      for (const [x, y, t] of LEVELS) {              // levels: the circle-cross, a leader, the height on it
        if (!G.inV(x, y, .3)) continue;
        const c = P(x, y), lg = el('g', { class: 'lvl' }, g), r = 3.6, left = !G.port && x > 12.5;
        el('circle', { cx: f1(c[0]), cy: f1(c[1]), r }, lg);
        el('path', { d: `M${f1(c[0] + (left ? r + 2 : -r - 2))} ${f1(c[1])}H${f1(c[0] + (left ? -r - 22 : r + 22))}M${f1(c[0])} ${f1(c[1] - r - 2)}V${f1(c[1] + r + 2)}` }, lg);
        txt(t, { x: f1(c[0] + (left ? -r - 3 : r + 3)), y: f1(c[1] - 3), 'text-anchor': left ? 'end' : 'start', class: 'halo' }, lg);
      }
    }
    if (G.port && G.cin) chainsRight(el('g', { class: 'dim' }, g));
    if (paper) startMark(g, false);
    for (const r of ROOMS) roomLabel(g, r, !paper);
    const pr = G.desk ? 3.1 : 2.6;                   // the walk's points on this floor
    for (const p of POINTS) {
      if (p.at[2] >= 2 || p.id === FIRST || !G.inV(p.at[0], p.at[1], .15)) continue;
      const c = P(p.at[0], p.at[1]);
      el('circle', { cx: f1(c[0]), cy: f1(c[1]), r: pr, class: 'wpt' }, g);
    }
  }

  let PROG = 0;                                      // how far the rule has travelled over the plan, 0..1
  const refs = {};
  function build() {
    if (!field.clientWidth || !field.clientHeight) return;   // not laid out yet: the next resize builds it
    G = geom();
    const { fw, fh, port, s, W, H, ox, oy, P } = G;
    for (const sv of [ink, mark]) { sv.setAttribute('viewBox', `0 0 ${fw} ${fh}`); sv.textContent = ''; }
    // the render in its window, turned with the plan
    Object.assign(rbox.style, { left: ox + 'px', top: oy + 'px', width: f1(W) + 'px', height: f1(H) + 'px' });
    const iw = (R.x1 - R.x0) * s, ih = (R.y1 - R.y0) * s, c = P((R.x0 + R.x1) / 2, (R.y0 + R.y1) / 2);
    Object.assign(cover.style, { width: f1(iw) + 'px', height: f1(ih) + 'px', left: f1(c[0] - ox - iw / 2) + 'px',
      top: f1(c[1] - oy - ih / 2) + 'px', transform: port ? 'rotate(90deg)' : 'none' });

    const defs = el('defs', {}, ink);
    const pat = el('pattern', { id: 'hatch', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 5, stroke: 'var(--hatch)', 'stroke-width': 1 }, pat);
    refs.ahead = el('rect', {}, el('clipPath', { id: 'cAhead' }, defs));
    refs.behind = el('rect', {}, el('clipPath', { id: 'cBehind' }, defs));
    el('rect', { x: ox, y: oy, width: f1(W), height: f1(H) }, el('clipPath', { id: 'cR' }, defs));

    planLayer(el('g', { 'clip-path': 'url(#cAhead)', class: 'paper' }, ink), true);
    planLayer(el('g', { 'clip-path': 'url(#cBehind)', class: 'over' }, ink), false);
    el('rect', { x: ox + .5, y: oy + .5, width: f1(W - 1), height: f1(H - 1), class: 'frm' }, ink);
    chainsOut(el('g', { class: 'dim' }, ink));
    if (port && !G.cin) chainsRight(el('g', { class: 'dim' }, ink));
    north();
    refs.ruler = ruler();
    const mdefs = el('defs', {}, mark);
    refs.mbehind = el('rect', {}, el('clipPath', { id: 'mBehind' }, mdefs));
    startMark(el('g', { 'clip-path': 'url(#mBehind)' }, mark), true);
    setP(PROG);
  }

  // BINARH's north arrow: a circle and one heavy bar from its centre toward north, an S beside it
  function north() {
    const { port, ox, oy, s, desk, M, H } = G, r = desk ? 15 : 12.5;
    const c = port ? [ox + r + 11, oy + r + 22] : [ox - M.l / 2, oy + H - 1.6 * s];
    const [nx, ny] = G.D(NORTH[0], NORTH[1]);
    const g = el('g', { class: 'nar' }, ink);
    el('circle', { cx: f1(c[0]), cy: f1(c[1]), r }, g);
    const px = -ny, py = nx, w = 1.6;
    el('path', { d: pth([[c[0] + px * w, c[1] + py * w], [c[0] + nx * r + px * w, c[1] + ny * r + py * w], [c[0] + nx * r - px * w, c[1] + ny * r - py * w], [c[0] - px * w, c[1] - py * w]], true) }, g);
    txt('S', { x: f1(c[0] + nx * (r + 7)), y: f1(c[1] + ny * (r + 7) + 3.2), 'text-anchor': 'middle', class: 'halo' }, g);
  }

  // the heading the walk opens toward at a point, in model XY
  function lookDir(p) {
    if (typeof p.look === 'number') { const a = p.look * Math.PI / 180; return [Math.sin(a), Math.cos(a)]; }
    const q = PT[p.look]; const dx = q.at[0] - p.at[0], dy = q.at[1] - p.at[1], L = Math.hypot(dx, dy) || 1;
    return [dx / L, dy / L];
  }
  const onPlan = (p) => p.at[2] < 2 && G.inV(p.at[0], p.at[1], .4);

  // where the walk begins: the point's ring, A010's entrance triangle pointing the way the view opens,
  // the field of view as two thin rays with an arc, lettered like A010's notes
  function startMark(g, on) {
    const p = PT[FIRST];
    if (!onPlan(p)) return;
    const { P, D, desk, port } = G, c = P(p.at[0], p.at[1]);
    const [ux, uy] = D(...lookDir(p)), vx = -uy, vy = ux;
    const gg = el('g', { class: 'start' + (on ? ' on' : '') }, g);
    const half = 36 * Math.PI / 180, rr = desk ? 74 : 48, rot = (a) => [ux * Math.cos(a) - uy * Math.sin(a), ux * Math.sin(a) + uy * Math.cos(a)];
    const [ax, ay] = rot(-half), [bx, by] = rot(half), ra = rr * .78;
    let d = `M${f1(c[0] + ax * 7)} ${f1(c[1] + ay * 7)}L${f1(c[0] + ax * rr)} ${f1(c[1] + ay * rr)}M${f1(c[0] + bx * 7)} ${f1(c[1] + by * 7)}L${f1(c[0] + bx * rr)} ${f1(c[1] + by * rr)}`;
    d += `M${f1(c[0] + ax * ra)} ${f1(c[1] + ay * ra)}A${f1(ra)} ${f1(ra)} 0 0 1 ${f1(c[0] + bx * ra)} ${f1(c[1] + by * ra)}`;
    el('path', { d, class: 'ray u' }, gg); el('path', { d, class: 'ray' }, gg);
    el('circle', { cx: f1(c[0]), cy: f1(c[1]), r: desk ? 4 : 3.4, class: 'tri' }, gg);
    const t0 = desk ? 7 : 6, t1 = desk ? 20 : 17, hb = desk ? 6 : 5;
    el('path', { class: 'tri', d: pth([[c[0] + ux * t1, c[1] + uy * t1], [c[0] + ux * t0 + vx * hb, c[1] + uy * t0 + vy * hb], [c[0] + ux * t0 - vx * hb, c[1] + uy * t0 - vy * hb]], true) }, gg);
    // lettered as A010 letters its notes; on a wide sheet it stands off on a leader, like VANJSKI TUŠ
    const lab = el('g', { class: 'lab' }, gg);
    const x0 = port ? c[0] + 15 : Math.max(c[0] - 44, G.ox + 6), y0 = port ? c[1] + 3 : c[1] - 50;
    txt('POČETAK ŠETNJE', { x: f1(x0), y: f1(y0), class: 'halo' }, lab);
    txt(p.n, { x: f1(x0), y: f1(y0 + 12.5), class: 'halo nm' }, lab);
    if (!port) el('path', { class: 'lead', d: `M${f1(x0 - 2)} ${f1(y0 + 17)}H${f1(x0 + 26)}L${f1(c[0] - 3)} ${f1(c[1] - 5)}` }, lab);
    if (on) refs.lab = lab;
  }

  // The parallel rule: a band with metre ticks on its leading edge. It slides along the plan, leaves the
  // render behind it, and comes to rest on the plan's far edge as the drawing's scale.
  const BAND = 7;
  function ruler() {
    const { port, s, W, H } = G, cross = port ? W : H, n = Math.floor(cross / s + 1e-6);
    const g = el('g', { class: 'ruler' }, ink);
    if (port) el('rect', { class: 'band', x: -5.5, y: .5, width: f1(cross + 11), height: BAND }, g);
    else el('rect', { class: 'band', x: .5, y: -5.5, width: BAND, height: f1(cross + 11) }, g);
    let d = '';
    for (let k = 0; k <= n; k++) {
      const len = k % 5 === 0 ? 6 : 3, q = k * s;
      d += port ? `M${f1(q)} ${BAND + .5}v${len}` : `M${BAND + .5} ${f1(H - q)}h${len}`;
      if (k % 5 === 0) {
        const lab = k === 15 ? '15 m' : String(k);
        if (port) txt(lab, { x: f1(q), y: BAND + 16, 'text-anchor': k === 0 ? 'start' : k === 15 ? 'end' : 'middle' }, g);
        else txt(lab, { x: BAND + 10, y: f1(H - q + 3) }, g);
      }
    }
    for (let k = 0; k < n; k++) { const q = (k + .5) * s; d += port ? `M${f1(q)} ${BAND - 1.5}v2` : `M${BAND - 1.5} ${f1(H - q)}h2`; }
    el('path', { d }, g);
    return g;
  }

  function setP(p) {
    PROG = p;
    if (!G) return;
    const { port, ox, oy, W, H } = G, cut = (port ? H : W) * p, set = (r, x, y, w, h) => { r.setAttribute('x', f1(x)); r.setAttribute('y', f1(y)); r.setAttribute('width', f1(Math.max(0, w))); r.setAttribute('height', f1(Math.max(0, h))); };
    refs.ruler.classList.toggle('rest', p >= 1);
    const F = 2000;
    if (port) {
      set(refs.ahead, -F, oy + cut, G.fw + 2 * F, G.fh + F); set(refs.behind, ox, oy, W, cut);
      set(refs.mbehind, -F, -F, G.fw + 2 * F, oy + cut + F);
      rbox.style.clipPath = `inset(0 0 ${f1((1 - p) * 100)}% 0)`;
      refs.ruler.setAttribute('transform', `translate(${ox} ${f1(oy + cut)})`);
    } else {
      set(refs.ahead, ox + cut, -F, G.fw + F, G.fh + 2 * F); set(refs.behind, ox, oy, cut, H);
      set(refs.mbehind, -F, -F, ox + cut + F, G.fh + 2 * F);
      rbox.style.clipPath = `inset(0 ${f1((1 - p) * 100)}% 0 0)`;
      refs.ruler.setAttribute('transform', `translate(${f1(ox + cut)} ${oy})`);
    }
  }

  const still = Q.has('sweep') ? clamp(+Q.get('sweep') || 0, 0, 1) : null;    // ?sweep=0 holds the bare drawing
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gate = $('gate'), sheet = $('sheet'), side = $('side'), go = $('go'), statusEl = $('status'), status2 = $('status2');
  const wipe = $('wipe'), view = $('view');
  let app = null;
  const ents = [...document.querySelectorAll('.ent')];
  const T0 = performance.now();

  // the invitation names where the tour will actually open (a shared ?p= link opens elsewhere)
  $('inv').textContent = `Šetnja kreće ${WHERE[FIRST] || `s točke „${PT[FIRST].n}”`}.`;
  $('npts').textContent = POINTS.length;

  build();
  if (!G) requestAnimationFrame(() => G || build());       // the field had no size yet
  let raf = 0;
  addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (!gate.classList.contains('leaving')) build(); }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!gate.classList.contains('leaving')) build(); });

  // frames from rAF, with a timer behind it so a throttled frame clock cannot hold the rule
  function animate(dur, fn) {
    const t0 = performance.now(); let id = 0;
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur); fn(t);
      if (t < 1) { const my = ++id; requestAnimationFrame(() => my === id && step()); setTimeout(() => my === id && step(), 40); }
    };
    step();
  }
  let SW = true;                                     // the opening sweep may still run
  const inOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // the rule goes over the plan once the render is in hand, and not before the drawing has been seen
  function sweep() {
    if (still != null) { setP(still); return; }
    if (calm) { setP(1); return; }
    const wait = Math.max(0, 700 - (performance.now() - T0));
    setTimeout(() => animate(1900, (t) => SW && setP(inOut(t))), wait);
  }
  (cover.decode ? cover.decode() : Promise.resolve()).then(sweep, sweep);

  // The stamp. tour.js reports its steps through progress(); each step inks a third of the cell, from the
  // left, over the still hatch. The inked copy of the lettering mirrors #status, which tour.js writes.
  const STEPS = { 'Učitavam…': .34, 'Učitavam šetnju…': .67 };
  function mirror() {
    const t = statusEl.textContent;
    status2.textContent = t;
    go.classList.toggle('err', /^Greška/.test(t));
  }
  new MutationObserver(mirror).observe(statusEl, { childList: true, characterData: true, subtree: true });
  function progress(t) { statusEl.textContent = t; if (t in STEPS) go.style.setProperty('--fill', STEPS[t]); }
  function ready(a) {
    app = a;
    statusEl.textContent = 'Uđi u kuću';
    go.style.setProperty('--fill', 1);
    go.disabled = false;
    for (const b of ents) b.disabled = false;
  }

  // the days the tour has, and the aerial inset (wide sheets only, after the plan is up)
  $('ntimes').textContent = TIMES.length;
  $('wtimes').textContent = TIMES.map((t) => t.n.toLowerCase()).join(' · ');
  addEventListener('load', () => {
    const a = $('a050');
    if (getComputedStyle(a).display !== 'none') {
      const im = a.querySelector('img');
      im.onload = () => im.classList.add('in');
      setTimeout(() => { im.src = im.dataset.src; }, 150);
    }
  });

  // The hand-over. The sheet's lettering lifts off, the plan leans in toward the point where the walk
  // begins, and the same parallel rule crosses the screen once more, leaving the walk behind it.
  // Everything moves by transform and opacity through the Web Animations API, so it runs on the
  // compositor while tour.js sets the walk up underneath.
  const DUR = { all: 1150, lift: 240, wipeAt: 330, wipe: 820 };
  let anims = [];
  function begin(mode) {
    // the walk is set up behind the still-opaque sheet: the mode, the first point, its view
    if (app) app.begin(mode);
  }
  function done() {
    gate.classList.add('gone');
    wipe.classList.remove('on');
    if (gate.contains(document.activeElement)) view.focus({ preventScroll: true });
  }
  function wipeBand(vw, vh, port, s, from) {
    // the rule as it crosses: a paper band with metre ticks on its leading edge, at the plan's new scale
    wipe.textContent = '';
    const w = port ? vw : 26, h = port ? 26 : vh;
    wipe.setAttribute('width', w); wipe.setAttribute('height', h); wipe.setAttribute('viewBox', `0 0 ${w} ${h}`);
    el('rect', port ? { x: -2, y: .5, width: vw + 4, height: BAND } : { x: .5, y: -2, width: BAND, height: vh + 4 }, wipe);
    let d = '';
    const n0 = Math.floor(-from / s) - 1, n1 = Math.ceil(((port ? vw : vh) - from) / s) + 1;
    for (let k = n0; k <= n1; k++) {
      const q = f1(from + k * s), len = k % 5 === 0 ? 6 : 3;
      d += port ? `M${q} ${BAND + .5}v${len}` : `M${BAND + .5} ${q}h${len}`;
    }
    el('path', { d }, wipe);
    wipe.classList.add('on');
  }
  function leave(mode = 'setnja', freeze = null) {
    if (gate.classList.contains('leaving')) return;
    gate.classList.add('leaving');
    SW = false;
    begin(mode);
    const vw = innerWidth, vh = innerHeight;
    anims = [];
    if (calm) {
      anims.push(gate.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease', fill: 'forwards' }));
    } else {
      const port = G.port, fr = field.getBoundingClientRect(), p = PT[FIRST];
      // A point upstairs or off this plan, or the plan and outside views: the sheet stays as it is and the
      // rule alone crosses it. The walk from a point on this plan: the plan leans in first.
      const lean = mode === 'setnja' && onPlan(p);
      let k = 1, tx = 0, ty = 0;
      if (lean) {
        const lift = { duration: DUR.lift, easing: 'ease-in', fill: 'forwards' };
        // 1. lift: the ink and the border; the render grows over the title block, which goes more slowly;
        //    the start mark stays until the rule passes it
        anims.push(side.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, easing: 'ease', fill: 'forwards' }));
        for (const e of [ink, document.querySelector('.frame')]) anims.push(e.animate([{ opacity: 1 }, { opacity: 0 }], lift));
        if (refs.lab) anims.push(refs.lab.animate([{ opacity: 1 }, { opacity: 0 }], lift));
        if (PROG < 1) {
          refs.mbehind.setAttribute('height', 99999); refs.mbehind.setAttribute('width', 99999);
          anims.push(rbox.animate([{ clipPath: rbox.style.clipPath }, { clipPath: port ? 'inset(0 0 0% 0)' : 'inset(0 0% 0 0)' }], lift));
        }
        // 2. lean in: the render is scaled until it covers the screen (a little more, never past 2.4×, so a
        //    2400 px render stays sharp on a 3× phone), toward the start point, clamped so no paper shows
        k = clamp(Math.max(vw / G.W, vh / G.H) * 1.12, 1.3, 2.4);
        const c = G.P(p.at[0], p.at[1]);
        const fit = (v0, o, len, cc, view) => {               // translate along one axis
          if (len * k < view) return view / 2 - v0 - (o + len / 2) * k;
          return clamp(view / 2 - v0 - cc * k, view - v0 - (o + len) * k, -v0 - o * k);
        };
        tx = fit(fr.left, G.ox, G.W, c[0], vw); ty = fit(fr.top, G.oy, G.H, c[1], vh);
        anims.push(plot.animate([{ transform: 'translate(0px, 0px) scale(1)' },
          { transform: `translate(${f1(tx)}px, ${f1(ty)}px) scale(${k.toFixed(3)})` }], { duration: DUR.all, easing: 'cubic-bezier(.5, 0, .2, 1)', fill: 'forwards' }));
      }
      // 3. the rule crosses the screen in the direction it crossed the plan; the sheet is cut away behind it
      const span = port ? vh : vw, A = port ? 'Y' : 'X', from = port ? fr.left + tx + G.ox * k : fr.top + ty + G.oy * k;
      wipeBand(vw, vh, port, G.s * k, port ? from : fr.top + ty + (G.oy + G.H) * k);
      const wo = { duration: DUR.wipe, delay: DUR.wipeAt, easing: 'cubic-bezier(.55, 0, .3, 1)', fill: 'both' };
      anims.push(gate.animate([{ transform: `translate${A}(0px)` }, { transform: `translate${A}(${span}px)` }], wo));
      anims.push(sheet.animate([{ transform: `translate${A}(0px)` }, { transform: `translate${A}(${-span}px)` }], wo));
      anims.push(wipe.animate([{ transform: `translate${A}(${-BAND - 1}px)` }, { transform: `translate${A}(${span - BAND - 1}px)` }], wo));
    }
    if (freeze != null) { for (const a of anims) { a.pause(); a.currentTime = freeze * (calm ? 300 : DUR.all); } return; }
    Promise.all(anims.map((a) => a.finished)).then(done);
  }
  go.addEventListener('click', () => { if (!go.disabled) leave('setnja'); });
  for (const b of ents) b.addEventListener('click', () => { if (!b.disabled) leave(b.dataset.m); });

  function skip() { begin(Q.get('m') || 'setnja'); done(); }
  return { progress, ready, skip };
}
