// Kuća Car, Supetar: what the renderer produced and where it stands in the model.
// Model coordinates are metres (kuca-supetar/NOTES.md): X = drawing left→right, Y = drawing
// bottom→top, Z up, ±0.00 = ground-floor finished floor (43.41 m n.m.), first floor +2.88.
// The points are copied from blender/sp_points.py; keep the two lists in step.

export const TITLE = 'Kuća Car · Supetar';
export const EYE = 1.6;                       // camera height above the point's floor (sp_points.EYE)

// Times of day: folder name, word, clock. The folder is the clock without the colon.
export const TIMES = [
  { id: '1500', n: 'Popodne', t: '15:00' },
  { id: '2000', n: 'Zalazak', t: '20:00' },
  { id: '2200', n: 'Noć', t: '22:00' },
];
export const DEFAULT_TIME = '2000';

// How a pano lies on the sphere. If a test render comes out mirrored or turned, change only this:
//   centre    - the model XY direction seen at the image centre (u = 0.5)
//   clockwise - true: u grows clockwise seen from above (to the right when you face the centre),
//               false: u grows anticlockwise (the image is mirrored left↔right)
export const PANO = { centre: [0, 1], clockwise: true };

// Compass in model XY (north arrow on the site plan: 24.7° above drawing-left).
export const NORTH = [-0.908, 0.418];
export const EAST = [0.418, 0.908];

// The two levels. Points whose floor z is >= split belong to the upper plan.
export const FLOORS = [
  { id: 'ground', n: 'Prizemlje', lvl: '±0,00' },
  { id: 'first', n: 'Kat', lvl: '+2,88' },
];
export const FLOOR_SPLIT = 2.0;            // garden stair landings (+1.06, +1.52) stay on the ground plan

// The plan renders (orthographic, straight down; image right = +X, image up = +Y).
// cx, cy = model point at the image centre; w, h = metres covered by the whole image.
// From blender/sp_ext.py PLAN_FRAME (ortho scale 24.4 m, 2400 × 1500 px).
export const PLAN = {
  ground: { cx: 2.2, cy: 4.6, w: 24.4, h: 15.25 },
  first: { cx: 2.2, cy: 4.6, w: 24.4, h: 15.25 },
};

// Building turntable: n frames, f_00 first. dir = 1: frames advance as the camera moves to its
// own right (anticlockwise seen from above), so dragging left advances. -1 flips the drag.
export const EXT = { n: 72, dir: 1, cols: 8 };                 // 5° apart; the viewer blends neighbours while turning

// The tour points. at = [x, y, floor z]; links = where a click or ↑ can step to;
// zone groups the room list; look = heading (degrees clockwise from model +Y, seen from above)
// the view opens toward when the point is entered from the list or plan. null = toward links[0].
// Optional marks: { <link id>: [x, y, z] } draws that link's ring somewhere other than the target's
// own spot, e.g. at the foot of the stairs for a point on the other floor (otherwise it is drawn on
// the upper floor plane and shows through the ceiling).
export const POINTS = [
  // ground floor ±0.00
  { id: 'boravak', n: 'Dnevni boravak', at: [1.25, 6.1, 0.0], zone: 'prizemlje', look: null, links: ['blagovaonica', 'boravak2', 'hodnik', 'uz_bazen'] },
  { id: 'boravak2', n: 'Sredina boravka', at: [3.3, 6.4, 0.0], zone: 'prizemlje', look: null, links: ['boravak', 'blagovaonica', 'hodnik'] },
  { id: 'blagovaonica', n: 'Blagovaonica', at: [2.9, 3.3, 0.0], zone: 'prizemlje', look: null, links: ['kuhinja', 'boravak', 'boravak2', 'hodnik', 'terasa_bazen'] },
  { id: 'kuhinja', n: 'Kuhinja', at: [2.0, 1.45, 0.0], zone: 'prizemlje', look: null, links: ['blagovaonica', 'terasa_bazen'] },
  { id: 'hodnik', n: 'Hodnik i stubište', at: [5.3, 6.7, 0.0], zone: 'prizemlje', look: null, links: ['boravak', 'hodnik3', 'predsoblje', 'dvoriste', 'kup1'], marks: { predsoblje: [6.25, 7.1, 0.0] } },
  { id: 'hodnik3', n: 'Hodnik uz stubište', at: [7.6, 6.1, 0.0], zone: 'prizemlje', look: null, links: ['hodnik', 'hodnik2', 'soba1'], marks: { soba1: [7.4, 5.4, 0.0] } },
  { id: 'hodnik2', n: 'Hodnik prema sobama', at: [10.0, 6.1, 0.0], zone: 'prizemlje', look: null, links: ['hodnik3', 'soba2'] },
  { id: 'kup1', n: 'Kupaonica', at: [5.1, 4.3, 0.0], zone: 'prizemlje', look: null, links: ['hodnik'] },
  { id: 'soba1', n: 'Spavaća soba 1', at: [8.1, 4.9, 0.0], zone: 'prizemlje', look: null, links: ['hodnik3', 'soba1b'], marks: { hodnik3: [7.4, 5.7, 0.0] } },
  { id: 'soba1b', n: 'Spavaća soba 1, uz prozor', at: [7.9, 1.2, 0.0], zone: 'prizemlje', look: null, links: ['soba1'] },
  { id: 'soba2', n: 'Spavaća soba 2', at: [11.6, 4.85, 0.0], zone: 'prizemlje', look: null, links: ['hodnik2', 'soba2b', 'kup2'], marks: { kup2: [12.0, 5.3, 0.0] } },
  { id: 'soba2b', n: 'Spavaća soba 2, uz prozor', at: [11.9, 1.3, 0.0], zone: 'prizemlje', look: null, links: ['soba2'] },
  { id: 'kup2', n: 'Kupaonica uz sobu 2', at: [12.15, 6.25, 0.0], zone: 'prizemlje', look: null, links: ['soba2'], marks: { soba2: [12.0, 5.3, 0.0] } },
  // first floor +2.88
  { id: 'predsoblje', n: 'Predsoblje i stubište', at: [11.2, 6.7, 2.88], zone: 'kat', look: null, links: ['hodnik', 'predsoblje3', 'soba4', 'ulaz'], marks: { hodnik: [10.4, 7.1, 2.56], soba4: [11.1, 5.9, 2.88] } },
  { id: 'predsoblje3', n: 'Hodnik na katu', at: [9.5, 6.1, 2.88], zone: 'kat', look: null, links: ['predsoblje', 'predsoblje2'] },
  { id: 'predsoblje2', n: 'Hodnik uz galeriju', at: [7.6, 6.1, 2.88], zone: 'kat', look: null, links: ['predsoblje3', 'galerija', 'soba3'], marks: { soba3: [5.8, 5.9, 2.88] } },
  { id: 'galerija', n: 'Galerija', at: [4.9, 6.15, 2.88], zone: 'kat', look: null, links: ['predsoblje2'] },
  { id: 'soba3', n: 'Spavaća soba 3', at: [5.35, 1.1, 2.88], zone: 'kat', look: null, links: ['predsoblje2', 'soba3b', 'terasa', 'kup3'], marks: { kup3: [8.1, 0.8, 2.88] } },
  { id: 'soba3b', n: 'Spavaća soba 3, uz prozor', at: [7.6, 1.2, 2.88], zone: 'kat', look: null, links: ['soba3'] },
  { id: 'kup3', n: 'Kupaonica uz sobu 3', at: [8.55, 1.15, 2.88], zone: 'kat', look: null, links: ['soba3'], marks: { soba3: [7.9, 0.8, 2.88] } },
  { id: 'soba4', n: 'Spavaća soba 4', at: [12.1, 4.7, 2.88], zone: 'kat', look: null, links: ['predsoblje', 'soba4b', 'kup4'], marks: { kup4: [9.85, 5.05, 2.88] } },
  { id: 'soba4b', n: 'Spavaća soba 4, uz prozor', at: [11.08, 1.0, 2.88], zone: 'kat', look: null, links: ['soba4'] },
  { id: 'kup4', n: 'Kupaonica uz sobu 4', at: [9.4, 4.75, 2.88], zone: 'kat', look: null, links: ['soba4'], marks: { soba4: [10.15, 5.05, 2.88] } },
  { id: 'terasa', n: 'Terasa', at: [3.4, 0.9, 2.88], zone: 'kat', look: null, links: ['soba3', 'terasa2'] },
  { id: 'terasa2', n: 'Kut terase', at: [2.6, -0.05, 2.88], zone: 'kat', look: 295, links: ['terasa'] },
  // outside: these open facing the house or the way on
  { id: 'bazen', n: 'Bazen', at: [-8.0, 4.4, 0.0], zone: 'okucnica', look: 89, links: ['uz_bazen', 'terasa_bazen', 'vrt', 'bazen_sjever', 'lezaljke'] },
  { id: 'uz_bazen', n: 'Između bazena i kuće', at: [-0.8, 5.0, 0.0], zone: 'okucnica', look: 270, links: ['bazen', 'boravak', 'terasa_bazen', 'vrt'] },
  { id: 'bazen_sjever', n: 'Kut uz lavandu', at: [-8.3, 9.0, 0.0], zone: 'okucnica', look: 106, links: ['bazen', 'vrt'] },
  { id: 'lezaljke', n: 'Kut za odmor', at: [-6.4, 1.6, 0.0], zone: 'okucnica', look: 77, links: ['bazen', 'terasa_bazen'] },
  { id: 'terasa_bazen', n: 'Blagovanje uz bazen', at: [-3.2, -0.4, 0.0], zone: 'okucnica', look: 62, links: ['bazen', 'lezaljke', 'kuhinja', 'staza2'] },
  { id: 'vrt', n: 'Vrt i lavanda', at: [-5.2, 10.4, 0.0], zone: 'okucnica', look: 128, links: ['bazen', 'bazen_sjever', 'uz_bazen', 'dvoriste'] },
  { id: 'dvoriste', n: 'Dvorište uz hodnik', at: [5.4, 9.3, 0.0], zone: 'okucnica', look: 90, links: ['vrt', 'hodnik', 'stube_istok'] },
  { id: 'stube_istok', n: 'Stube uz vrt', at: [10.2, 8.6, 1.52], zone: 'okucnica', look: 90, links: ['dvoriste', 'ulaz'], marks: { ulaz: [13.9, 8.6, 2.88] } },
  { id: 'staza2', n: 'Staza uz boravak', at: [4.5, -0.75, 0.0], zone: 'okucnica', look: 90, links: ['terasa_bazen', 'staza'] },
  { id: 'staza', n: 'Staza uz kuću', at: [9.0, -1.0, 0.0], zone: 'okucnica', look: 90, links: ['staza2', 'stube_zapad'] },
  { id: 'stube_zapad', n: 'Stube prema ulici', at: [14.6, -0.75, 1.06], zone: 'okucnica', look: 0, links: ['staza', 'ulaz'] },
  { id: 'ulaz', n: 'Ulazna vrata', at: [14.6, 6.8, 2.88], zone: 'okucnica', look: 270, links: ['predsoblje', 'parking', 'stube_istok', 'stube_zapad'], marks: { stube_istok: [14.0, 8.6, 2.88] } },
  { id: 'parking', n: 'Parking', at: [17.2, 4.2, 2.88], zone: 'okucnica', look: 273, links: ['ulaz', 'parking2'] },
  { id: 'parking2', n: 'Ulaz s ulice', at: [20.3, 6.0, 2.88], zone: 'okucnica', look: 270, links: ['parking'] },
];
export const ZONES = [
  { id: 'prizemlje', n: 'Prizemlje' },
  { id: 'kat', n: 'Kat' },
  { id: 'okucnica', n: 'Okućnica' },
];
export const START = 'bazen';

// Every file the viewer asks for. t = time id ('2000'), id = point id, i = frame number.
const pad2 = (i) => String(i).padStart(2, '0');
export const FILES = {
  pano: (t, id) => `pano/${t}/${id}.webp`,           // 4096 × 2048 equirectangular
  panoS: (t, id) => `pano/${t}/s/${id}.webp`,        // 1024 × 512 preview
  panoT: (t, id) => `pano/${t}/t/${id}.webp`,        // 320 × 160 thumbnail
  ext: (t, i) => `ext/${t}/f_${pad2(i)}.webp`,       // 2400 × 1500 turntable frame
  extS: (t, i) => `ext/${t}/s/f_${pad2(i)}.webp`,    // 600 × 375 preview
  extAtlas: (t) => `ext/${t}/s/atlas.webp`,          // all previews in one sheet, EXT.cols across (fewer files)
  plan: (f) => `plan/${f}.webp`,                     // 2400 px wide, aspect = PLAN[f].w / PLAN[f].h
  waterJson: 'water/water.json',                     // { "<id>": { u0, v0, u1, v1 } } in equirect UV, v = 0 at the top
  water: (t, id) => [`water/${t}/${id}.webm`, `water/${t}/${id}.mp4`],
};
