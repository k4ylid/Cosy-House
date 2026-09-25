import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

/* ---------- tiny builders ---------- */
export const M = (c, r = 0.85, met = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: met, ...extra });

export function put(obj, x, y, z, rx = 0, ry = 0, rz = 0) {
  obj.position.set(x, y, z);
  if (rx || ry || rz) obj.rotation.set(rx, ry, rz);
  return obj;
}
export function box(w, h, d, mat, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = shadow; m.receiveShadow = true;
  return m;
}
export function cyl(rt, rb, h, mat, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
export function sph(r, mat, w = 20, h = 14) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, w, h), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
export function cap(r, len, mat) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
export function torus(r, t, mat, arc = Math.PI * 2) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 10, 28, arc), mat);
  m.castShadow = true;
  return m;
}
export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
export const texLoader = new THREE.TextureLoader();
export function imgTex(url) {
  const t = texLoader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- collision + walkable ---------- */
export const colliders = [];
export const walkable = [];
let OX = 0, OZ = 0;
export function setOrigin(x, z) { OX = x; OZ = z; }
export function addCol(x1, z1, x2, z2) {
  colliders.push({ x1: x1 + OX, z1: z1 + OZ, x2: x2 + OX, z2: z2 + OZ });
}
export function addWalk(x1, z1, x2, z2) {
  walkable.push({ x1, z1, x2, z2 });
}

/* ---------- shared materials ---------- */
export const WALL   = M(0xeee4d3, 0.95);
export const TRIM   = M(0xf7f2e6, 0.9);
export const WOOD   = M(0xa5713f, 0.75);
export const WOOD_D = M(0x7c5330, 0.8);
export const WOOD_L = M(0xc49a6b, 0.8);
export const CREAM  = M(0xe9e2d2, 0.95);
export const WHITE  = M(0xf3efe6, 0.9);
export const GREEN  = M(0x46543c, 0.95);
export const GREEN_L= M(0x6b7a52, 0.95);
export const DARK   = M(0x2b2b30, 0.6);
export const BRASS  = M(0xc79a5b, 0.45, 0.6);
export const TERRA  = M(0xa9613c, 0.9);
export const LEAF   = M(0x4f7a45, 0.85);
export const LEAF_D = M(0x3c6237, 0.85);
export const BLACK_M= M(0x1f1f22, 0.5, 0.3);

/* ---------- textures ---------- */
export const floorTex = canvasTex(512, 512, (g) => {
  g.fillStyle = '#9a6b42'; g.fillRect(0, 0, 512, 512);
  const rows = 8, rh = 512 / rows;
  for (let i = 0; i < rows; i++) {
    const shade = 0.85 + Math.random() * 0.3;
    g.fillStyle = `rgb(${150 * shade | 0},${104 * shade | 0},${64 * shade | 0})`;
    g.fillRect(0, i * rh, 512, rh - 2);
    g.fillStyle = 'rgba(60,38,20,0.5)';
    g.fillRect(0, i * rh + rh - 2, 512, 2);
    const seam = 60 + Math.random() * 300;
    g.fillRect(seam, i * rh, 2, rh - 2);
  }
});
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(4, 4);

export const tileTex = canvasTex(512, 512, (g) => {
  g.fillStyle = '#c9b8a4'; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = 'rgba(120,100,80,0.5)'; g.lineWidth = 3;
  for (let i = 0; i <= 4; i++) {
    g.beginPath(); g.moveTo(0, i * 128); g.lineTo(512, i * 128); g.stroke();
    g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, 512); g.stroke();
  }
  for (let i = 0; i < 2000; i++) {
    const v = 175 + Math.random() * 40;
    g.fillStyle = `rgba(${v},${v - 15},${v - 35},0.3)`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 4, 4);
  }
});
tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping;
tileTex.repeat.set(3, 3);

export const knitTex = canvasTex(256, 256, (g) => {
  g.fillStyle = '#d9c8a9'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(160,140,105,0.55)'; g.lineWidth = 5;
  for (let i = -256; i < 512; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 128, 256); g.stroke();
    g.beginPath(); g.moveTo(i + 128, 0); g.lineTo(i, 256); g.stroke();
  }
});
knitTex.wrapS = knitTex.wrapT = THREE.RepeatWrapping;
knitTex.repeat.set(2, 2);

export const rugTex = canvasTex(256, 256, (g) => {
  g.fillStyle = '#ded3bd'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    const v = 200 + Math.random() * 40;
    g.fillStyle = `rgba(${v},${v - 12},${v - 35},0.5)`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
});
rugTex.wrapS = rugTex.wrapT = THREE.RepeatWrapping;

export const geoRugTex = canvasTex(256, 256, (g) => {
  g.fillStyle = '#ddd4c2'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(150,130,105,0.7)'; g.lineWidth = 5;
  const s = 64;
  for (let y = -1; y < 5; y++)
    for (let x = -1; x < 5; x++) {
      g.beginPath();
      g.moveTo(x * s + s / 2, y * s);
      g.lineTo(x * s + s, y * s + s / 2);
      g.lineTo(x * s + s / 2, y * s + s);
      g.lineTo(x * s, y * s + s / 2);
      g.closePath(); g.stroke();
    }
});
geoRugTex.wrapS = geoRugTex.wrapT = THREE.RepeatWrapping;
geoRugTex.repeat.set(2, 2);

export const cityTex = canvasTex(512, 320, (g, w, h) => {
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#232a52'); sky.addColorStop(0.45, '#4a3f63');
  sky.addColorStop(0.72, '#8a5560'); sky.addColorStop(1, '#e0915b');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * w, y = h * 0.45 + Math.random() * h * 0.5;
    const r = 2 + Math.random() * 7;
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 2.4);
    gr.addColorStop(0, 'rgba(255,190,110,0.85)'); gr.addColorStop(1, 'rgba(255,190,110,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 2.4, 0, 7); g.fill();
  }
  g.fillStyle = '#181d33';
  let x = 0;
  while (x < w) {
    const bw = 24 + Math.random() * 46, bh = h * 0.28 + Math.random() * h * 0.34;
    g.fillRect(x, h - bh, bw, bh);
    g.fillStyle = '#ffd98a';
    for (let wy = h - bh + 6; wy < h - 8; wy += 12)
      for (let wx = x + 4; wx < x + bw - 4; wx += 10)
        if (Math.random() < 0.28) g.fillRect(wx, wy, 3, 4);
    g.fillStyle = '#181d33';
    x += bw + 3;
  }
});

export const posterTex = canvasTex(256, 340, (g, w, h) => {
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#e9efe9'); sky.addColorStop(1, '#b8c9c9');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  g.fillStyle = '#f0e6c8'; g.beginPath(); g.arc(w * 0.68, h * 0.22, 20, 0, 7); g.fill();
  const ridge = (baseY, amp, col) => {
    g.fillStyle = col; g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 8)
      g.lineTo(x, baseY - Math.abs(Math.sin(x * 0.045) + Math.sin(x * 0.013) * 0.7) * amp);
    g.lineTo(w, h); g.closePath(); g.fill();
  };
  ridge(h * 0.55, 46, '#9fb3bd');
  ridge(h * 0.72, 60, '#6f8a99');
  ridge(h * 0.92, 52, '#4d6673');
});

/* ---------- plants ---------- */
export function leafyPlant(s = 1, big = false) {
  const g = new THREE.Group();
  const pot = cyl(0.09 * s, 0.07 * s, 0.14 * s, TERRA);
  pot.position.y = 0.07 * s; g.add(pot);
  g.add(put(cyl(0.082 * s, 0.082 * s, 0.02 * s, M(0x4a3826, 1)), 0, 0.14 * s, 0));
  const n = big ? 7 : 5;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random();
    const leaf = sph(big ? 0.09 * s : 0.06 * s, Math.random() < 0.5 ? LEAF : LEAF_D);
    leaf.scale.set(1, big ? 0.35 : 0.55, 1.9);
    const r = big ? 0.06 : 0.04;
    leaf.position.set(Math.cos(a) * r * s, (0.2 + Math.random() * (big ? 0.16 : 0.08)) * s, Math.sin(a) * r * s);
    leaf.rotation.set(Math.random() * 0.6 - 0.3, a, Math.random() * 0.6 - 0.3);
    g.add(leaf);
  }
  return g;
}
export function trailingPothos(s = 1, len = 0.5) {
  const g = leafyPlant(s);
  for (let i = 0; i < 7; i++) {
    const leaf = sph(0.035 * s, Math.random() < 0.5 ? LEAF : LEAF_D);
    leaf.scale.set(1, 0.4, 1.7);
    leaf.position.set(
      Math.sin(i * 1.7) * 0.05 * s,
      -0.04 - (i / 7) * len,
      0.07 + i * 0.008
    );
    leaf.rotation.z = Math.sin(i * 2.2) * 0.7;
    g.add(leaf);
  }
  return g;
}
export function monstera() {
  const g = new THREE.Group();
  const pot = cyl(0.2, 0.15, 0.34, WHITE); pot.position.y = 0.17; g.add(pot);
  g.add(put(cyl(0.185, 0.185, 0.03, M(0x4a3826, 1)), 0, 0.34, 0));
  for (let i = 0; i < 7; i++) {
    const a = i * 0.9;
    const h = 0.45 + Math.random() * 0.45;
    const stem = cyl(0.012, 0.012, h, M(0x3d5c33, 0.9));
    stem.position.set(Math.cos(a) * 0.05, 0.34 + h / 2, Math.sin(a) * 0.05);
    stem.rotation.set(Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25);
    g.add(stem);
    const leaf = sph(0.14, i % 2 ? LEAF : LEAF_D);
    leaf.scale.set(1.15, 0.28, 1.35);
    leaf.position.set(Math.cos(a) * (0.1 + h * 0.12), 0.34 + h, Math.sin(a) * (0.1 + h * 0.12));
    leaf.rotation.set(-0.5, a, 0);
    g.add(leaf);
  }
  return g;
}

/* ---------- books / props ---------- */
export function bookRow(zStart, zEnd, y = 0.02) {
  const g = new THREE.Group();
  let z = zStart;
  const cols = [0xa0522d, 0x6b7a52, 0x8a5a6e, 0x4d6673, 0xb08b58, 0x7c5330, 0x9aa0a5];
  while (z < zEnd) {
    const bw = 0.03 + Math.random() * 0.025, bh = 0.16 + Math.random() * 0.09;
    g.add(put(box(0.16, bh, bw, M(cols[(Math.random() * cols.length) | 0], 0.9)),
      0, y + bh / 2, z + bw / 2, 0, 0, Math.random() < 0.12 ? 0.18 : 0));
    z += bw + 0.006;
  }
  return g;
}
export function bookStack(n = 3, s = 1) {
  const g = new THREE.Group();
  const cols = [0x8a4b3a, 0x4d6673, 0x6b7a52, 0xa0522d, 0xd9c8a9];
  for (let i = 0; i < n; i++)
    g.add(put(box(0.2 * s, 0.032 * s, 0.27 * s, M(cols[i % cols.length], 0.9)),
      0, 0.016 * s + i * 0.033 * s, 0, 0, Math.random() * 0.4 - 0.2, 0));
  return g;
}
export function candle(h = 0.1, r = 0.03) {
  const g = new THREE.Group();
  g.add(put(cyl(r, r, h, M(0xf0e6d0, 0.9)), 0, h / 2, 0));
  const flame = new THREE.Mesh(new THREE.SphereGeometry(r * 0.45, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xffb84d }));
  flame.scale.y = 1.7;
  put(flame, 0, h + r * 0.5, 0); g.add(flame);
  return g;
}
export function jar(w = 0.09, h = 0.15, labelCol = 0xc9b896) {
  const g = new THREE.Group();
  g.add(put(cyl(w / 2, w / 2, h, new THREE.MeshStandardMaterial({
    color: 0xd8cfc0, roughness: 0.15, transparent: true, opacity: 0.55 })), 0, h / 2, 0));
  g.add(put(cyl(w / 2 + 0.004, w / 2 + 0.004, 0.025, M(0x8a6f4d, 0.8)), 0, h + 0.012, 0));
  g.add(put(box(w * 0.8, h * 0.35, 0.005, M(labelCol, 0.9)), 0, h * 0.45, w / 2 + 0.001));
  return g;
}
export function bottle(w = 0.05, h = 0.16, col = 0x5d3a2a) {
  const g = new THREE.Group();
  g.add(put(cyl(w / 2, w / 2, h * 0.75, M(col, 0.4)), 0, h * 0.375, 0));
  g.add(put(cyl(w / 5, w / 5, h * 0.25, M(0x2b2b30, 0.6)), 0, h * 0.875, 0));
  return g;
}
export function towelRoll(w = 0.34, col = 0x6b7a52) {
  const g = new THREE.Group();
  g.add(put(box(w, 0.09, 0.24, M(col, 1)), 0, 0.045, 0));
  g.add(put(box(w, 0.018, 0.24, M(col + 0x0a0a0a, 1)), 0, 0.1, 0));
  return g;
}
export function photoFrame(w = 0.17, h = 0.22, tex = null, col = 0xd8cfc0) {
  const g = new THREE.Group();
  g.add(put(box(0.02, h, w, TRIM), 0, 0, 0));
  const img = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.05, h - 0.05),
    tex ? new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }) : M(col, 0.95));
  img.rotation.y = Math.PI / 2; img.position.x = 0.013;
  g.add(img);
  return g;
}
export function polaroid(tex, ry = 0) {
  const g = new THREE.Group();
  g.add(put(box(0.015, 0.24, 0.19, M(0xfaf6ec, 0.95)), 0, 0, 0));
  const img = new THREE.Mesh(new THREE.PlaneGeometry(0.155, 0.155),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
  img.position.set(-0.01, 0.02, 0); img.rotation.y = -Math.PI / 2;
  g.add(img);
  g.rotation.z = ry;
  return g;
}
export function globeLamp(r = 0.09) {
  const g = new THREE.Group();
  g.add(put(cyl(0.02, 0.03, 0.08, BRASS), 0, 0.04, 0));
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12),
    new THREE.MeshStandardMaterial({ color: 0xfff2dd, emissive: 0xffd9a0, emissiveIntensity: 1.4, roughness: 0.9 }));
  put(bulb, 0, 0.08 + r, 0); g.add(bulb);
  return g;
}
export function mirror(r = 0.3) {
  const g = new THREE.Group();
  const m = new Reflector(new THREE.CircleGeometry(r, 32), {
    clipBias: 0.003, textureWidth: 512, textureHeight: 512, color: 0xa8b0b8 });
  m.rotation.y = Math.PI / 2;
  const rim = torus(r + 0.005, 0.015, BRASS);
  rim.rotation.y = Math.PI / 2;
  g.add(m, rim);
  return g;
}

/* ---------- architecture: walls, windows, doors ---------- */
/*
 runWall(g, a, b, opts)
  a = [x1,z1], b = [x2,z2]  (axis-aligned)
  opts: h=3, t=0.12, mat, cuts=[{s: distance along wall, w, sillH=0, topH=2.1}]
 Emits box segments; 's' measured from a.
*/
export function runWall(g, a, b, opts = {}) {
  const { h = 3, t = 0.12, mat = WALL, cuts = [] } = opts;
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const ux = dx / len, uz = dz / len;
  const cuts2 = [...cuts].sort((c1, c2) => c1.s - c2.s);
  let cur = 0;
  const segs = [];
  for (const c of cuts2) {
    const c0 = c.s - c.w / 2, c1 = c.s + c.w / 2;
    if (c0 > cur) segs.push([cur, c0, 0, h]);
    if (c.sillH > 0) segs.push([c0, c1, 0, c.sillH]);
    if (c.topH < h) segs.push([c0, c1, c.topH, h]);
    cur = c1;
  }
  if (cur < len) segs.push([cur, len, 0, h]);
  for (const [s0, s1, y0, y1] of segs) {
    const sl = s1 - s0, sh = y1 - y0;
    if (sl <= 0 || sh <= 0) continue;
    const cx = a[0] + ux * (s0 + s1) / 2;
    const cz = a[1] + uz * (s0 + s1) / 2;
    const cy = (y0 + y1) / 2;
    const wall = Math.abs(ux) > 0.9 ? box(sl, sh, t, mat) : box(t, sh, sl, mat);
    put(wall, cx, cy, cz); g.add(wall);
  }
}

/*
 makeWindow(g, axis, at, center, w, sillH, topH, opts)
  axis 'x' → wall runs along x (window faces ±z); 'z' → wall along z (faces ±x)
  at: wall plane coord; center: coord along wall; side: +1 glass sits at at+side*0.15
*/
export function makeWindow(g, axis, at, center, w, sillH, topH, side = -1) {
  const fw = w, fh = topH - sillH, cy = (sillH + topH) / 2;
  const frameMat = M(0x4a3a2c, 0.7);
  const F = (ww, hh, dd, u, v, w2) => {
    const m = box(axis === 'x' ? ww : dd, hh, axis === 'x' ? dd : ww, frameMat);
    put(m, axis === 'x' ? u : w2, v, axis === 'x' ? w2 : u); g.add(m);
  };
  F(fw + 0.14, 0.08, 0.14, center, topH + 0.02, at);
  F(fw + 0.14, 0.08, 0.14, center, sillH - 0.02, at);
  F(0.08, fh, 0.14, center - fw / 2 - 0.02, cy, at);
  F(0.08, fh, 0.14, center + fw / 2 + 0.02, cy, at);
  F(0.05, fh, 0.08, center, cy, at - side * 0.03);
  F(fw, 0.05, 0.08, center, cy, at - side * 0.03);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh),
    new THREE.MeshBasicMaterial({ map: cityTex }));
  if (axis === 'x') { put(glass, center, cy, at + side * 0.15); if (side < 0) glass.rotation.y = Math.PI; }
  else { put(glass, at + side * 0.15, cy, center); glass.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2; }
  g.add(glass);
  const sill = axis === 'x' ? box(fw + 0.3, 0.06, 0.3, WOOD_L) : box(0.3, 0.06, fw + 0.3, WOOD_L);
  put(sill, axis === 'x' ? center : at - side * 0.12, sillH - 0.06, axis === 'x' ? at - side * 0.12 : center);
  g.add(sill);
  /* bamboo blind rolled at top */
  const blind = cyl(0.07, 0.07, fw, M(0xb08b58, 0.9));
  const bx = axis === 'x' ? center : at - side * 0.1;
  const bz = axis === 'x' ? at - side * 0.1 : center;
  put(blind, bx, topH - 0.02, bz, axis === 'x' ? 0 : Math.PI / 2, 0, axis === 'x' ? Math.PI / 2 : 0);
  g.add(blind);
  for (let i = 0; i < 4; i++) {
    const slat = axis === 'x' ? box(fw, 0.045, 0.02, M(0xc2a06a, 0.9)) : box(0.02, 0.045, fw, M(0xc2a06a, 0.9));
    put(slat, bx, topH - 0.1 - i * 0.055, bz); g.add(slat);
  }
}

/* door frame around an opening + optional open leaf */
export function doorFrame(g, axis, at, center, w = 0.9, h = 2.05, open = true) {
  const fm = WOOD;
  const F = (ww, hh, dd, u, v, w2) => {
    const m = box(axis === 'x' ? ww : dd, hh, axis === 'x' ? dd : ww, fm);
    put(m, axis === 'x' ? u : w2, v, axis === 'x' ? w2 : u); g.add(m);
  };
  F(0.09, h + 0.08, 0.2, center - w / 2 - 0.045, (h + 0.08) / 2, at);
  F(0.09, h + 0.08, 0.2, center + w / 2 + 0.045, (h + 0.08) / 2, at);
  F(w + 0.18, 0.09, 0.2, center, h + 0.035, at);
  if (open) {
    const leaf = box(axis === 'x' ? w : 0.04, h - 0.04, axis === 'x' ? 0.04 : w, M(0x8a6238, 0.8));
    const ang = 1.95;
    if (axis === 'x') {
      leaf.position.set(center - w / 2 + Math.cos(ang) * w / 2, h / 2, at - Math.sin(ang) * w / 2);
      leaf.rotation.y = ang;
    } else {
      leaf.position.set(at - Math.sin(ang) * w / 2, h / 2, center - w / 2 + Math.cos(ang) * w / 2);
      leaf.rotation.y = -ang + Math.PI;
    }
    g.add(leaf);
  }
}

/* closed decorative door (leads nowhere) */
export function fakeDoor(g, axis, at, center, inward = 1) {
  doorFrame(g, axis, at, center, 0.9, 2.05, false);
  const leaf = box(axis === 'x' ? 0.86 : 0.05, 2.0, axis === 'x' ? 0.05 : 0.86, M(0x8a6238, 0.8));
  if (axis === 'x') put(leaf, center, 1.0, at);
  else put(leaf, at, 1.0, center);
  g.add(leaf);
  const knob = sph(0.03, BLACK_M);
  if (axis === 'x') put(knob, center + 0.32, 1.0, at + inward * 0.05);
  else put(knob, at + inward * 0.05, 1.0, center + 0.32);
  g.add(knob);
}
