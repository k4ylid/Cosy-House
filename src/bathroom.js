import * as THREE from 'three';
import {
  M, put, box, cyl, sph, torus,
  setOrigin, addCol, addWalk,
  WALL, TRIM, WOOD, WOOD_D, WOOD_L, CREAM, WHITE, BRASS, DARK, GLOW,
  bathTileMat, woodFloorMat,
  leafyPlant, towelRoll, bottle, jar, candle, photoFrame,
  runWall, makeWindow, mirror, imgTex
} from './common.js';

/* Bathroom: world x[-7.5,-1.5] z[-4,1].
   Builds: north wall x[-7.5,-3] (east part shared w/ bedroom wall), south wall,
   west wall w/ window. East wall = hallway west wall (built by hallway). */
export function buildBathroom() {
  const g = new THREE.Group();
  setOrigin(0, 0);
  addWalk(-7.44, -3.94, -1.56, 0.94);

  const floor = box(6.3, 0.1, 5.3, bathTileMat(2.4, 2.0));
  put(floor, -4.5, -0.05, -1.5); g.add(floor);

  /* walls */
  runWall(g, [-7.5, -4], [-3, -4]);                       /* north */
  runWall(g, [-7.5, 1], [-1.5, 1]);                       /* south */
  runWall(g, [-7.5, 1], [-7.5, -4], {
    cuts: [{ s: 2.0, w: 1.2, sillH: 1.45, topH: 2.4 }]    /* west + window */
  });
  makeWindow(g, 'z', -7.5, 1 - 2.0, 1.2, 1.45, 2.4, -1);
  /* tile wainscot strip + crown beams */
  const tileWall = M(0xd9cbb0, 0.85);
  g.add(put(box(4.42, 1.1, 0.02, tileWall), -5.22, 0.55, -3.93));
  g.add(put(box(5.92, 1.1, 0.02, tileWall), -4.5, 0.55, 0.93));
  g.add(put(box(0.02, 1.1, 4.92, tileWall), -7.43, 0.55, -1.5));
  const edge = M(0xf4efe4, 0.9);
  g.add(put(box(4.6, 0.09, 0.14, edge), -5.25, 3.05, -4.06));
  g.add(put(box(6.2, 0.09, 0.14, edge), -4.5, 3.05, 1.06));
  g.add(put(box(0.14, 0.09, 5.2, edge), -7.56, 3.05, -1.5));

  /* ---------- vanity + round backlit mirror (north wall) ---------- */
  const van = new THREE.Group(); g.add(van);
  addCol(-5.65, -4, -4.35, -3.42);
  van.add(put(box(1.2, 0.72, 0.52, WOOD), -5, 0.4, -3.7));
  van.add(put(box(1.26, 0.05, 0.56, WOOD_L), -5, 0.79, -3.7));
  for (const dx of [-0.32, 0.32]) {
    van.add(put(box(0.54, 0.28, 0.02, WOOD_D), -5 + dx, 0.55, -3.43));
    van.add(put(sph(0.016, BRASS), -5 + dx, 0.55, -3.41));
  }
  /* basin + faucet */
  van.add(put(cyl(0.19, 0.15, 0.12, M(0xf4f1ea, 0.35)), -5, 0.85, -3.68));
  van.add(put(cyl(0.16, 0.16, 0.03, M(0xdcd6c8, 0.5)), -5, 0.885, -3.68));
  van.add(put(cyl(0.014, 0.014, 0.16, BRASS), -5, 0.88, -3.85));
  van.add(put(box(0.03, 0.03, 0.14, BRASS), -5, 0.955, -3.79));
  van.add(put(sph(0.012, BRASS), -5.1, 0.85, -3.85));
  van.add(put(sph(0.012, BRASS), -4.9, 0.85, -3.85));
  /* mirror + LED rim */
  const bMirror = mirror(0.33); bMirror.rotation.y = -Math.PI / 2;
  put(bMirror, -5, 1.62, -3.94); g.add(bMirror);
  const led = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.02, 8, 40),
    GLOW(0xffe6b8, 3));
  put(led, -5, 1.62, -3.95); g.add(led);
  const mirrorGlow = new THREE.PointLight(0xffe0b0, 2.6, 3, 2);
  put(mirrorGlow, -5, 1.62, -3.6); g.add(mirrorGlow);
  /* vanity clutter */
  van.add(put(bottle(0.06, 0.16, 0x7a8b5a), -5.48, 0.82, -3.6));
  van.add(put(bottle(0.05, 0.13, 0xc9a26a), -4.62, 0.82, -3.62));
  van.add(put(jar(0.08, 0.12, 0xd8cfc0), -4.5, 0.82, -3.8));
  van.add(put(candle(0.07, 0.025), -5.6, 0.82, -3.8));

  /* ---------- toilet + towel shelf ---------- */
  addCol(-4.1, -4, -3.35, -3.3);
  g.add(put(box(0.55, 0.42, 0.18, WHITE), -3.72, 0.85, -3.9));       /* tank */
  g.add(put(cyl(0.19, 0.24, 0.42, WHITE), -3.72, 0.21, -3.62));      /* bowl */
  g.add(put(torus(0.19, 0.045, M(0xe9e4d8, 0.6)), -3.72, 0.44, -3.62, Math.PI / 2, 0, 0)); /* seat */
  g.add(put(cyl(0.02, 0.02, 0.1, BRASS), -3.98, 0.9, -3.88));        /* flush */
  g.add(put(box(0.7, 0.04, 0.24, WOOD_L), -3.72, 1.52, -3.86));      /* shelf */
  g.add(put(towelRoll(0.3, 0x6b7a52), -3.9, 1.55, -3.86));
  g.add(put(towelRoll(0.26, 0xe9e2d2), -3.52, 1.55, -3.86));
  g.add(put(jar(0.09, 0.14, 0x8a6b4a), -3.72, 1.55, -3.86));
  g.add(put(box(0.7, 0.04, 0.24, WOOD_L), -3.72, 1.86, -3.86));
  g.add(put(towelRoll(0.3, 0xc9a26a), -3.6, 1.89, -3.86));
  const shelfPlant = leafyPlant(0.55); put(shelfPlant, -3.95, 1.89, -3.86); g.add(shelfPlant);

  /* ---------- glass shower (SW corner) ---------- */
  addCol(-7.4, -3.95, -6.0, -2.5);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xbfd4d8, roughness: 0.08, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
  g.add(put(box(1.5, 0.02, 1.4, M(0xcfc4ac, 0.8)), -6.65, 0.015, -3.25));   /* shower tray */
  g.add(put(box(0.03, 2.0, 1.4, glassMat), -5.95, 1.0, -3.25));             /* side panel */
  g.add(put(box(1.45, 2.0, 0.03, glassMat), -6.67, 1.0, -2.55));            /* front panel */
  for (const [w, d, x, z] of [[0.03, 0.03, -5.95, -2.55], [0.03, 0.03, -5.95, -3.95]])
    g.add(put(box(w, 2.05, d, DARK), x, 1.02, z));
  g.add(put(box(1.4, 0.05, 0.05, DARK), -6.68, 2.0, -2.55));
  g.add(put(cyl(0.02, 0.02, 0.3, DARK), -6.2, 1.1, -2.55));
  /* shower head + valve */
  g.add(put(cyl(0.015, 0.015, 0.4, BRASS), -7.3, 2.1, -3.4, 0, 0, Math.PI / 2));
  g.add(put(cyl(0.09, 0.09, 0.02, BRASS), -7.12, 2.1, -3.4, 0, 0, Math.PI / 2));
  g.add(put(cyl(0.05, 0.05, 0.03, M(0x3a3a40, 0.4, 0.7)), -7.42, 1.1, -3.25, 0, 0, Math.PI / 2));
  g.add(put(box(0.22, 0.02, 0.14, DARK), -6.9, 0.03, -3.3));
  /* corner shelf in shower */
  g.add(put(box(0.28, 0.02, 0.28, DARK), -7.3, 1.3, -3.8, 0, Math.PI / 4, 0));
  g.add(put(bottle(0.05, 0.14, 0x8ab5c9), -7.3, 1.32, -3.8));

  /* ---------- extras ---------- */
  /* towel ladder on south wall */
  for (let i = 0; i < 4; i++)
    g.add(put(cyl(0.012, 0.012, 0.55, WOOD_D), -2.6, 0.45 + i * 0.38, 0.93, 0, 0, Math.PI / 2 - 0.18));
  for (const sx of [-2.84, -2.36])
    g.add(put(cyl(0.014, 0.014, 1.55, WOOD_D), sx, 0.78, 0.95, -0.16, 0, 0));
  g.add(put(box(0.3, 0.5, 0.03, M(0xe9e2d2, 1)), -2.6, 1.15, 0.9, -0.16, 0, 0));
  /* bath mat */
  g.add(put(box(0.8, 0.02, 0.5, M(0xe4dcc8, 1)), -5, 0.011, -2.9));
  /* plant */
  const bp = leafyPlant(1.0); put(bp, -2.1, 0, -3.5); g.add(bp);
  addCol(-2.4, -3.8, -1.8, -3.2);
  /* small stool */
  addCol(-2.6, 0.1, -2.0, 0.7);
  g.add(put(cyl(0.2, 0.22, 0.06, WOOD_L), -2.3, 0.42, 0.4));
  for (const [dx, dz] of [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]])
    g.add(put(cyl(0.016, 0.014, 0.4, WOOD_D), -2.3 + dx, 0.2, 0.4 + dz));
  g.add(put(towelRoll(0.28, 0x6b7a52), -2.3, 0.45, 0.4));
  /* framed art (the source image) */
  const art = photoFrame(0.34, 0.44, imgTex('assets/bath-art.png'), 0xf4efe4);
  put(art, -6.2, 1.7, 0.92, 0, Math.PI / 2, 0); g.add(art);
  const art2 = photoFrame(0.2, 0.26, imgTex('assets/kitchen-art.png'), 0xd8cfc0);
  put(art2, -2.4, 1.8, 0.92, 0, Math.PI / 2, 0); g.add(art2);

  /* lights */
  /* lived-in: soap dispenser on the vanity + laundry basket in the corner */
  g.add(put(cyl(0.025, 0.028, 0.13, M(0x8ab5c9, 0.45)), -4.62, 0.95, -3.9));
  g.add(put(cyl(0.01, 0.013, 0.045, WHITE), -4.62, 1.02, -3.9));
  g.add(put(cyl(0.2, 0.16, 0.34, M(0xc9b896, 0.95)), -2.1, 0.17, 0.55));
  addCol(-2.35, 0.3, -1.85, 0.8);

  const warm = new THREE.PointLight(0xffd9a8, 8, 9, 2);
  warm.castShadow = true; warm.shadow.mapSize.set(1024, 1024);
  put(warm, -4.5, 2.55, -1.5); g.add(warm);

  return g;
}
