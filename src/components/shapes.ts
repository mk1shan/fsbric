// Particle shape generators. Each returns Float32Array(N * 4): x, y, z, stitch (0..1).
// "stitch" marks points drawn in thread-yellow (repairs, seams, country markers).

const rand = (a = -1, b = 1) => a + Math.random() * (b - a);
const GRID = 0.085; // spacing between woven threads

// Irregular hole used by the torn + repaired fabric
const HOLE = { x: 0.25, y: 0.1 };
const holeR = (t: number) => 0.78 + 0.16 * Math.sin(3 * t) + 0.09 * Math.sin(7 * t + 1.3);

function weavePoint(size: number) {
  // Pick a point that sits on a warp or weft thread, so the cloud reads as woven fabric
  let x = rand(-size, size);
  let y = rand(-size, size);
  if (Math.random() < 0.5) y = Math.round(y / GRID) * GRID + rand(-0.006, 0.006);
  else x = Math.round(x / GRID) * GRID + rand(-0.006, 0.006);
  const z = 0.13 * Math.sin(x * 1.4) + 0.1 * Math.cos(y * 1.9);
  return [x, y, z];
}

export function tornFabric(N: number) {
  const out = new Float32Array(N * 4);
  let i = 0;
  while (i < N) {
    let [x, y, z] = weavePoint(1.75);
    const dx = x - HOLE.x, dy = y - HOLE.y;
    const d = Math.hypot(dx, dy);
    const t = Math.atan2(dy, dx);
    const r = holeR(t);
    if (d < r) continue; // the tear
    if (d < r + 0.22) {
      // frayed edge: threads curl outward and lift off the surface
      const f = 1 - (d - r) / 0.22;
      x += Math.cos(t) * f * rand(0, 0.12);
      y += Math.sin(t) * f * rand(0, 0.12);
      z += f * rand(-0.25, 0.25);
    }
    out.set([x, y, z, 0], i * 4);
    i++;
  }
  return out;
}

export function repairedFabric(N: number) {
  const out = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const [x, y, z] = weavePoint(1.75);
    const dx = x - HOLE.x, dy = y - HOLE.y;
    const inside = Math.hypot(dx, dy) < holeR(Math.atan2(dy, dx)) + 0.04;
    out.set([x, y, z + (inside ? 0.03 : 0), inside ? 1 : 0], i * 4);
  }
  return out;
}

// T-shirt silhouette
const SHIRT: [number, number][] = [
  [-0.38, 1.32], [-1.02, 1.16], [-1.78, 0.52], [-1.38, 0.06], [-0.95, 0.42],
  [-0.95, -1.42], [0.95, -1.42], [0.95, 0.42], [1.38, 0.06], [1.78, 0.52],
  [1.02, 1.16], [0.38, 1.32], [0.2, 1.12], [0, 1.06], [-0.2, 1.12],
];

function inPoly(x: number, y: number, p: [number, number][]) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

export function shirt(N: number) {
  const out = new Float32Array(N * 4);
  const edges = SHIRT.map((a, i) => [a, SHIRT[(i + 1) % SHIRT.length]] as const);
  const lens = edges.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((s, l) => s + l, 0);
  const curve = (x: number) => 0.28 * Math.cos(x * 0.9) - 0.2;

  let i = 0;
  // 22% of points trace the seams as a running stitch
  const seamCount = Math.floor(N * 0.22);
  while (i < seamCount) {
    let s = Math.random() * total;
    let k = 0;
    while (s > lens[k]) s -= lens[k++];
    const [a, b] = edges[k];
    const t = s / lens[k];
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    const dash = (s * 9) % 1 < 0.55 ? 1 : 0.15;
    out.set([x * 0.97, y * 0.97, curve(x) + 0.02, dash], i * 4);
    i++;
  }
  while (i < N) {
    const x = rand(-1.8, 1.8), y = rand(-1.45, 1.35);
    if (!inPoly(x, y, SHIRT)) continue;
    let px = x, py = y;
    if (Math.random() < 0.5) py = Math.round(y / GRID) * GRID;
    else px = Math.round(x / GRID) * GRID;
    out.set([px, py, curve(px) + rand(-0.015, 0.015), 0], i * 4);
    i++;
  }
  return out;
}

// Where Compreli operates (lat, lon)
const COUNTRIES: [number, number][] = [
  [7.9, 80.7],   // Sri Lanka
  [30.4, 69.3],  // Pakistan
  [21.0, 78.0],  // India
  [26.8, 30.8],  // Egypt
  [30.6, 36.2],  // Jordan
  [0.0, 37.9],   // Kenya
];

function latLon(lat: number, lon: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return [-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th)];
}

export function globe(N: number) {
  const out = new Float32Array(N * 4);
  const R = 1.55;
  const markerCount = Math.floor(N * 0.12);
  for (let i = 0; i < N; i++) {
    if (i < markerCount) {
      const [lat, lon] = COUNTRIES[i % COUNTRIES.length];
      const [x, y, z] = latLon(lat + rand(-2.6, 2.6), lon + rand(-2.6, 2.6), R * 1.012);
      out.set([x, y, z, 1], i * 4);
      continue;
    }
    // stitched globe: points sit on latitude or longitude threads
    let lat = rand(-90, 90), lon = rand(-180, 180);
    if (Math.random() < 0.5) lat = Math.round(lat / 10) * 10;
    else lon = Math.round(lon / 12) * 12;
    lat = Math.asin(Math.sin((lat * Math.PI) / 180)) * (180 / Math.PI);
    const [x, y, z] = latLon(lat, lon, R);
    out.set([x, y, z, 0], i * 4);
  }
  return out;
}

export function loop(N: number) {
  // (2,3) torus knot: one continuous thread with no end — the circular economy
  const out = new Float32Array(N * 4);
  const p = 2, q = 3, R = 1.15, r = 0.48;
  for (let i = 0; i < N; i++) {
    const t = Math.random() * Math.PI * 2;
    const rr = R + r * Math.cos(q * t);
    const cx = rr * Math.cos(p * t), cy = rr * Math.sin(p * t), cz = r * Math.sin(q * t);
    const a = Math.random() * Math.PI * 2;
    const tube = 0.11 * Math.sqrt(Math.random());
    const x = cx + tube * Math.cos(a) * Math.cos(p * t);
    const y = cy + tube * Math.cos(a) * Math.sin(p * t);
    const z = cz + tube * Math.sin(a);
    const stitch = (t * 30) % 1 < 0.3 ? 1 : 0;
    out.set([x, y, z, stitch], i * 4);
  }
  return out;
}

export function randoms(N: number) {
  const r = new Float32Array(N);
  for (let i = 0; i < N; i++) r[i] = Math.random();
  return r;
}
