import * as THREE from 'three';
import {
  M, put, box, cyl, sph, torus,
  setOrigin, addCol, addWalk,
  WALL, TRIM, WOOD, WOOD_D, WOOD_L, CREAM, WHITE, GREEN, BRASS, DARK, GLOW,
  woodFloorMat, marbleMat, corduroyMat, hessianMat,
  leafyPlant, trailingPothos, bookRow, jar, bottle, candle, towelRoll,
  photoFrame, runWall, makeWindow, imgTex
} from './common.js';

/* Kitchen + dining: world x[1.5,7.5] z[-4,1].
   Builds north wall (shared w/ bedroom for x<3), south wall, east wall w/ window.
   West wall = hallway east wall (built by hallway). */
export function buildKitchen() {
  const g = new THREE.Group();
  setOrigin(0, 0);
  addWalk(1.56, -3.94, 7.44, 0.94);

  const floor = box(6.3, 0.1, 5.3, woodFloorMat(3.15, 2.65));
  put(floor, 4.5, -0.05, -1.5); g.add(floor);

  runWall(g, [1.5, -4], [7.5, -4]);                          /* north */
  runWall(g, [1.5, 1], [7.5, 1]);                            /* south */
  runWall(g, [7.5, 1], [7.5, -4], {
    cuts: [{ s: 3.0, w: 1.5, sillH: 1.1, topH: 2.45 }]       /* east + window */
  });
  makeWindow(g, 'z', 7.5, 1 - 3.0, 1.5, 1.1, 2.45, 1);
  const edge = M(0xf4efe4, 0.9);
  g.add(put(box(6.2, 0.09, 0.14, edge), 4.5, 3.05, -4.06));
  g.add(put(box(6.2, 0.09, 0.14, edge), 4.5, 3.05, 1.06));
  g.add(put(box(0.14, 0.09, 5.2, edge), 7.56, 3.05, -1.5));

  const cabMat = M(0xf0ead9, 0.85), knobMat = BRASS;

  /* ---------- north counter run (x 2.4..6.9, z -3.7..-3.15) ---------- */
  addCol(2.4, -4, 6.9, -3.15);
  g.add(put(box(4.5, 0.8, 0.58, cabMat), 4.65, 0.4, -3.5));
  g.add(put(box(4.56, 0.05, 0.62, marbleMat(1.8, 0.62)), 4.65, 0.84, -3.5));
  for (let i = 0; i < 5; i++) {
    const cx = 2.85 + i * 0.9;
    g.add(put(box(0.82, 0.6, 0.02, M(0xe6ddc9, 0.9)), cx, 0.42, -3.19));
    g.add(put(sph(0.015, knobMat), cx, 0.62, -3.17));
  }
  /* stove on north counter */
  g.add(put(box(0.62, 0.02, 0.5, DARK), 5.3, 0.87, -3.48));
  for (const [dx, dz] of [[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]])
    g.add(put(cyl(0.09, 0.09, 0.015, M(0x1c1c22, 0.5)), 5.3 + dx, 0.885, -3.48 + dz));
  for (let i = 0; i < 4; i++)
    g.add(put(cyl(0.02, 0.02, 0.03, DARK), 5.05 + i * 0.16, 0.88, -3.2, 0, 0, Math.PI / 2));
  /* kettle + board + jars */
  const kettle = new THREE.Group();
  kettle.add(put(sph(0.09, M(0x8a9095, 0.4, 0.8)), 0, 0.09, 0));
  kettle.add(put(cyl(0.012, 0.012, 0.12, DARK), 0.09, 0.1, 0, 0, 0, -0.5));
  kettle.add(put(torus(0.05, 0.01, DARK), 0, 0.16, 0));
  put(kettle, 4.55, 0.87, -3.5); g.add(kettle);
  g.add(put(box(0.28, 0.02, 0.4, WOOD_D), 3.7, 0.87, -3.45, 0, 0.2, 0));
  g.add(put(jar(0.09, 0.2, 0xC9A86B), 2.75, 0.87, -3.55));
  g.add(put(jar(0.07, 0.16, 0x9a7448), 2.95, 0.87, -3.62));
  g.add(put(bottle(0.05, 0.2, 0x5d6b57), 3.15, 0.87, -3.55));
  /* open shelves above north counter */
  for (const [sy, x1, x2] of [[1.45, 2.9, 4.6], [1.85, 3.2, 4.4]]) {
    g.add(put(box(x2 - x1, 0.035, 0.24, WOOD_L), (x1 + x2) / 2, sy, -3.84));
    for (const bx of [x1 + 0.06, x2 - 0.06])
      g.add(put(box(0.03, 0.1, 0.2, WOOD_D), bx, sy - 0.06, -3.84));
  }
  g.add(put(jar(0.08, 0.18, 0xd8cfc0), 3.1, 1.47, -3.85));
  g.add(put(jar(0.06, 0.13, 0x8a6b4a), 3.35, 1.47, -3.85));
  g.add(put(bottle(0.05, 0.18, 0x7a8b5a), 3.6, 1.47, -3.85));
  g.add(put(cyl(0.07, 0.06, 0.12, M(0xc9a26a, 0.9)), 3.95, 1.53, -3.85));
  g.add(put(sph(0.05, M(0x8ab5c9, 0.9)), 4.3, 1.5, -3.85));
  const pothosK = trailingPothos(0.8, 0.6); put(pothosK, 4.5, 1.87, -3.85); g.add(pothosK);
  g.add(put(jar(0.07, 0.15, 0xcfc4ac), 3.5, 1.87, -3.85));
  const shelfBooks = bookRow(-0.3, 0.3, 0.02);
  shelfBooks.rotation.y = Math.PI / 2;
  put(shelfBooks, 3.9, 1.87, -3.85); g.add(shelfBooks);

  /* ---------- east counter run (x 6.9..7.35, z -3.6..0.5) + sink ---------- */
  addCol(6.85, -3.7, 7.5, 0.55);
  g.add(put(box(0.58, 0.8, 4.1, cabMat), 7.12, 0.4, -1.55));
  g.add(put(box(0.62, 0.05, 4.16, marbleMat(0.62, 2.0)), 7.1, 0.84, -1.55));
  for (let i = 0; i < 4; i++) {
    g.add(put(box(0.02, 0.6, 0.9, M(0xe6ddc9, 0.9)), 6.82, 0.42, -3.2 + i * 1.05));
    g.add(put(sph(0.015, knobMat), 6.8, 0.62, -3.2 + i * 1.05));
  }
  /* sink under window */
  g.add(put(box(0.42, 0.16, 0.7, M(0xb9bec2, 0.35, 0.8)), 7.05, 0.78, -2.0));
  g.add(put(box(0.36, 0.14, 0.6, M(0x2e3134, 0.6)), 7.05, 0.82, -2.0));
  g.add(put(cyl(0.016, 0.016, 0.3, BRASS), 7.32, 1.0, -2.0));
  g.add(put(box(0.2, 0.03, 0.04, BRASS), 7.22, 1.14, -2.0));
  g.add(put(cyl(0.012, 0.012, 0.07, BRASS), 7.14, 1.1, -2.0));
  /* faucet handles */
  g.add(put(sph(0.014, BRASS), 7.32, 0.88, -2.25));
  g.add(put(sph(0.014, BRASS), 7.32, 0.88, -1.75));
  /* counter clutter */
  g.add(put(bottle(0.05, 0.16, 0x8ab5c9), 7.05, 0.87, -0.5));
  g.add(put(jar(0.08, 0.14, 0xd8cfc0), 7.1, 0.87, -0.9));
  const kPlant = leafyPlant(0.7); put(kPlant, 7.1, 0.87, -3.15); g.add(kPlant);
  g.add(put(towelRoll(0.24, 0xe9e2d2), 7.05, 0.87, 0.1));
  /* fruit bowl */
  g.add(put(cyl(0.16, 0.11, 0.08, M(0x9a7448, 0.9)), 7.05, 0.9, -1.2));
  for (const [dx, dz, c] of [[-0.05, 0, 0xd97742], [0.06, 0.04, 0xd9a648], [0, -0.05, 0xc94f3f]])
    g.add(put(sph(0.045, M(c, 0.6)), 7.05 + dx, 0.95, -1.2 + dz));

  /* ---------- fridge (west end of north wall) ---------- */
  addCol(1.7, -4, 2.45, -3.15);
  g.add(put(box(0.72, 1.85, 0.68, M(0xe8e4da, 0.5)), 2.05, 0.93, -3.55));
  g.add(put(box(0.03, 0.8, 0.06, M(0x9aa0a5, 0.5, 0.7)), 1.72, 1.15, -3.35));
  g.add(put(box(0.72, 0.02, 0.68, M(0xd0cabc, 0.6)), 2.05, 1.25, -3.55));
  /* magnet notes */
  g.add(put(box(0.1, 0.12, 0.005, M(0xf4d06a, 0.9)), 2.15, 1.35, -3.2));
  g.add(put(box(0.08, 0.1, 0.005, M(0x8ab5c9, 0.9)), 1.95, 1.5, -3.2));

  /* ---------- dining table + chairs + pendant ---------- */
  addCol(3.7, -1.5, 4.9, -0.1);
  g.add(put(cyl(0.62, 0.62, 0.05, WOOD_L), 4.3, 0.74, -0.8));
  g.add(put(cyl(0.05, 0.07, 0.7, WOOD_D), 4.3, 0.37, -0.8));
  g.add(put(cyl(0.32, 0.36, 0.04, WOOD_D), 4.3, 0.03, -0.8));
  /* tabletop: bowl + candle + jar */
  g.add(put(cyl(0.12, 0.09, 0.07, M(0xc9a26a, 0.9)), 4.05, 0.8, -0.7));
  g.add(put(candle(0.09, 0.022), 4.55, 0.77, -0.9));
  g.add(put(sph(0.05, M(0xd97742, 0.7)), 4.0, 0.86, -0.72));
  const mkChair = (x, z, ry) => {
    const c = new THREE.Group();
    c.add(put(box(0.4, 0.05, 0.38, WOOD), 0, 0.45, 0));
    c.add(put(box(0.36, 0.025, 0.34, corduroyMat(0.5, 0.5, 0xbcae96)), 0, 0.475, 0));
    c.add(put(box(0.4, 0.5, 0.05, WOOD), 0, 0.95, -0.19, -0.15, 0, 0));
    for (const [dx, dz] of [[-0.17, -0.15], [0.17, -0.15], [-0.17, 0.15], [0.17, 0.15]])
      c.add(put(cyl(0.015, 0.013, 0.44, WOOD_D), dx, 0.22, dz));
    put(c, x, 0, z, 0, ry, 0); g.add(c);
  };
  mkChair(3.4, -0.8, Math.PI / 2);
  mkChair(5.2, -0.8, -Math.PI / 2);
  mkChair(4.3, 0.2, Math.PI);
  /* pendant lamp */
  g.add(put(cyl(0.008, 0.008, 0.85, DARK), 4.3, 2.75, -0.8));
  g.add(put(new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.16, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.6, side: THREE.DoubleSide })),
    4.3, 2.32, -0.8));
  g.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10),
    GLOW(0xffd9a0, 2.8)), 4.3, 2.26, -0.8));
  const pendant = new THREE.PointLight(0xffca8a, 7, 5, 2);
  pendant.castShadow = true; pendant.shadow.mapSize.set(1024, 1024);
  put(pendant, 4.3, 2.2, -0.8); g.add(pendant);

  /* rug + art + trash */
  g.add(put(box(1.5, 0.02, 0.7, hessianMat(1.5, 0.7, 0xb09468)), 6.0, 0.011, -1.9));
  const art = photoFrame(0.36, 0.46, imgTex('assets/kitchen-art.png'), 0xf4efe4);
  put(art, 3.4, 1.7, 0.92, 0, Math.PI / 2, 0); g.add(art);
  const art2 = photoFrame(0.18, 0.24, imgTex('assets/room-art.png'), 0xd8cfc0);
  put(art2, 4.15, 1.65, 0.92, 0, Math.PI / 2, 0); g.add(art2);
  addCol(1.8, 0.2, 2.4, 0.8);
  g.add(put(cyl(0.14, 0.11, 0.32, M(0x8a9095, 0.5, 0.6)), 2.1, 0.16, 0.5));
  const flour = leafyPlant(1.2); put(flour, 6.9, 0, 0.4); g.add(flour);
  addCol(6.6, 0.1, 7.3, 0.7);
  /* windowsill herbs */
  const herb1 = leafyPlant(0.55); put(herb1, 7.32, 1.1, -2.5); g.add(herb1);
  const herb2 = leafyPlant(0.5); put(herb2, 7.32, 1.1, -1.55); g.add(herb2);

  /* ambient */
  const warm = new THREE.PointLight(0xffe2bc, 5, 9, 2);
  put(warm, 4.5, 2.6, -1.5); g.add(warm);

  /* lived-in: mug + open magazine on the dining table */
  g.add(put(cyl(0.032, 0.028, 0.075, M(0x8ab5c9, 0.7)), 4.55, 0.8, -0.55));
  g.add(put(box(0.2, 0.005, 0.28, M(0xe9e2d2, 1)), 4.05, 0.768, -0.98, 0, 0.35, 0));

  return g;
}
