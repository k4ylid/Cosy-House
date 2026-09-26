import * as THREE from 'three';
import {
  M, put, box, cyl, sph,
  setOrigin, addCol, addWalk,
  WALL, TRIM, WOOD, WOOD_D, WOOD_L, CREAM, WHITE, GREEN, GREEN_L, BRASS, DARK, TERRA, GLOW,
  posterTex, woodFloorMat,
  corduroyMat, linenMat, fleeceMat, teddyMat,
  leafyPlant, trailingPothos, monstera, bookRow, bookStack, candle, jar, bottle,
  photoFrame, runWall, doorFrame, makeWindow, imgTex, placeModel
} from './common.js';

/* Living room: world x[-3,3] z[4,9].
   Builds north wall (shared w/ hallway, door at x=0), west/east walls,
   south wall w/ window. */
export function buildLiving() {
  const g = new THREE.Group();
  setOrigin(0, 0);
  addWalk(-2.98, 4.06, 2.98, 8.94);

  const floor = box(6.3, 0.1, 5.3, woodFloorMat(3.15, 2.65));
  put(floor, 0, -0.05, 6.5); g.add(floor);

  runWall(g, [-3, 4], [3, 4], { cuts: [{ s: 3, w: 0.9, sillH: 0, topH: 2.05 }] });
  doorFrame(g, 'x', 4, 0, 0.9, 2.05, true);
  runWall(g, [-3, 4], [-3, 9]);
  runWall(g, [3, 4], [3, 9]);
  runWall(g, [3, 9], [-3, 9], {
    cuts: [{ s: 2.1, w: 1.7, sillH: 0.9, topH: 2.45 }]       /* south window at x≈0.9 */
  });
  makeWindow(g, 'x', 9, 0.9, 1.7, 0.9, 2.45, 1);
  const edge = M(0xf4efe4, 0.9);
  g.add(put(box(6.3, 0.09, 0.14, edge), 0, 3.05, 3.94));
  g.add(put(box(6.3, 0.09, 0.14, edge), 0, 3.05, 9.06));
  g.add(put(box(0.14, 0.09, 5.3, edge), -3.06, 3.05, 6.5));
  g.add(put(box(0.14, 0.09, 5.3, edge), 3.06, 3.05, 6.5));

  /* ---------- sofa along west wall ---------- */
  addCol(-3, 5.0, -1.95, 7.3);
  const sofa = new THREE.Group(); g.add(sofa);
  const sofaMat = corduroyMat(1.6, 1.6, 0x9aab92);
  sofa.add(put(box(0.8, 0.28, 2.1, sofaMat), -2.55, 0.28, 6.15));
  sofa.add(put(box(0.22, 0.75, 2.1, sofaMat), -2.86, 0.75, 6.15));
  sofa.add(put(box(0.78, 0.5, 0.2, sofaMat), -2.58, 0.62, 5.15));
  sofa.add(put(box(0.78, 0.5, 0.2, sofaMat), -2.58, 0.62, 7.15));
  for (const dz of [-0.65, 0, 0.65]) {
    sofa.add(put(box(0.66, 0.18, 0.62, corduroyMat(0.7, 0.7, 0xaebca2)), -2.52, 0.5, 6.15 + dz));
    const back = box(0.16, 0.5, 0.62, corduroyMat(0.7, 0.7, 0xaebca2));
    put(back, -2.78, 0.82, 6.15 + dz, 0, 0, -0.12); sofa.add(back);
  }
  const pillow = (z, col, ry) => {
    const p = sph(0.16, linenMat(0.5, 0.5, col)); p.scale.set(0.45, 1, 1);
    p.position.set(-2.42, 0.68, z); p.rotation.set(0, 0, ry);
    sofa.add(p);
  };
  pillow(5.5, 0xc9a26a, 0.15); pillow(6.8, 0xe4dcc8, -0.1); pillow(6.5, 0x8a4b3a, 0.2);
  sofa.add(put(box(0.55, 0.05, 0.9, fleeceMat(0.8, 0.9)), -2.5, 0.62, 6.7, 0, 0, 0.06));

  /* ---------- coffee table + rug ---------- */
  const rug = box(2.4, 0.02, 1.9, teddyMat(2.2, 1.8));
  put(rug, -0.9, 0.012, 6.15); rug.receiveShadow = true; g.add(rug);
  addCol(-1.45, 5.45, -0.35, 6.85);
  g.add(put(box(1.05, 0.05, 0.55, WOOD_D), -0.9, 0.38, 6.15));
  g.add(put(box(0.98, 0.32, 0.48, WOOD), -0.9, 0.19, 6.15));
  g.add(put(bookStack(3, 0.8), -1.1, 0.43, 6.05));
  g.add(put(candle(0.08, 0.025), -0.7, 0.42, 6.3));
  g.add(put(cyl(0.09, 0.07, 0.05, M(0xc9a26a, 0.9)), -0.75, 0.43, 6.0));

  /* ---------- TV console + TV on east wall ---------- */
  addCol(2.45, 5.1, 3, 7.4);
  g.add(put(box(0.5, 0.45, 2.2, WOOD), 2.72, 0.24, 6.25));
  g.add(put(box(0.54, 0.04, 2.26, WOOD_L), 2.72, 0.49, 6.25));
  for (const dz of [-0.6, 0.2]) {
    g.add(put(box(0.02, 0.3, 0.85, M(0x6b4a2c, 0.85)), 2.46, 0.24, 6.25 + dz));
    g.add(put(sph(0.014, BRASS), 2.44, 0.24, 6.0 + dz));
  }
  /* TV panel */
  g.add(put(box(0.05, 0.85, 1.5, M(0x1c1c22, 0.5)), 2.93, 1.6, 6.25));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.78),
    new THREE.MeshStandardMaterial({ color: 0x0d1016, emissive: 0x141c2e, emissiveIntensity: 0.7, roughness: 0.35 }));
  put(screen, 2.9, 1.6, 6.25, 0, -Math.PI / 2, 0); g.add(screen);
  /* console clutter */
  g.add(put(bookStack(2, 0.7), 2.7, 0.52, 5.5));
  g.add(put(jar(0.08, 0.16, 0x8a6b4a), 2.7, 0.52, 7.0));
  const tvPlant = leafyPlant(0.6); put(tvPlant, 2.7, 0.52, 6.9); g.add(tvPlant);

  /* ---------- tall bookshelf NW corner ---------- */
  addCol(-3, 4.0, -2.3, 4.75);
  const bs = new THREE.Group(); g.add(bs);
  bs.add(put(box(0.62, 2.2, 0.05, WOOD_D), -2.65, 1.1, 4.08));
  for (const sx of [-2.94, -2.36])
    bs.add(put(box(0.05, 2.2, 0.62, WOOD_D), sx, 1.1, 4.4));
  for (let i = 0; i < 4; i++) {
    const sy = 0.3 + i * 0.5;
    bs.add(put(box(0.54, 0.035, 0.58, WOOD), -2.65, sy, 4.4));
    const row = bookRow(-0.22, 0.24, 0.02);
    row.rotation.y = Math.PI / 2;
    put(row, -2.65, sy + 0.02, 4.4); bs.add(row);
  }
  bs.add(put(box(0.66, 0.05, 0.66, WOOD_D), -2.65, 2.2, 4.4));
  bs.add(put(jar(0.07, 0.14, 0xc9a26a), -2.8, 2.3, 4.35));
  const bsPlant = trailingPothos(0.7, 0.6); put(bsPlant, -2.5, 2.3, 4.5); bs.add(bsPlant);

  /* ---------- poster above sofa ---------- */
  g.add(put(box(0.04, 1.15, 1.5, WOOD_D), -2.97, 1.85, 6.15));
  g.add(put(new THREE.Mesh(new THREE.PlaneGeometry(1.36, 1.0),
    new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.95 })), -2.94, 1.85, 6.15, 0, Math.PI / 2, 0));

  /* ---------- dining set by south window ---------- */
  addCol(0.2, 7.6, 1.7, 8.7);
  g.add(put(box(1.5, 0.05, 0.85, WOOD_L), 0.95, 0.73, 8.15));
  for (const [dx, dz] of [[-0.65, -0.33], [0.65, -0.33], [-0.65, 0.33], [0.65, 0.33]])
    g.add(put(box(0.06, 0.7, 0.06, WOOD_D), 0.95 + dx, 0.36, 8.15 + dz));
  g.add(put(candle(0.09, 0.022), 0.7, 0.76, 8.15));
  g.add(put(jar(0.08, 0.15, 0x7a8b5a), 1.15, 0.76, 8.2));
  g.add(put(bookStack(2, 0.65), 1.35, 0.76, 8.0));
  const dChair = (x, z, ry) => {
    const c = new THREE.Group();
    c.add(put(box(0.4, 0.05, 0.38, WOOD), 0, 0.44, 0));
    c.add(put(box(0.36, 0.03, 0.34, corduroyMat(0.5, 0.5, 0xb0a890)), 0, 0.475, 0));
    c.add(put(box(0.38, 0.55, 0.05, WOOD), 0, 0.92, -0.19, -0.12, 0, 0));
    for (const [dx, dz] of [[-0.16, -0.14], [0.16, -0.14], [-0.16, 0.14], [0.16, 0.14]])
      c.add(put(cyl(0.015, 0.013, 0.42, WOOD_D), dx, 0.21, dz));
    put(c, x, 0, z, 0, ry, 0); g.add(c);
  };
  dChair(0.5, 7.25, Math.PI);
  dChair(1.5, 7.25, Math.PI);
  /* pendant over table */
  g.add(put(cyl(0.008, 0.008, 0.7, DARK), 0.95, 2.8, 8.15));
  g.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12),
    GLOW(0xffd9a0, 2.8)),
    0.95, 2.42, 8.15));
  const dLight = new THREE.PointLight(0xffca8a, 5, 4.5, 2);
  put(dLight, 0.95, 2.3, 8.15); g.add(dLight);

  /* ---------- floor lamp + plants + art ---------- */
  addCol(-2.8, 7.5, -2.2, 8.1);
  g.add(put(cyl(0.11, 0.13, 0.03, BRASS), -2.5, 0.02, 7.8));
  g.add(put(cyl(0.015, 0.015, 1.45, BRASS), -2.5, 0.75, 7.8));
  g.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.24, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf2e2c4, emissive: 0xffca8a, emissiveIntensity: 2.4, roughness: 0.9, side: THREE.DoubleSide })),
    -2.5, 1.52, 7.8));
  const flLight = new THREE.PointLight(0xffc27a, 7, 5, 2);
  flLight.castShadow = true; flLight.shadow.mapSize.set(1024, 1024);
  put(flLight, -2.5, 1.5, 7.8); g.add(flLight);

  const bigLeaf = monstera(); put(bigLeaf, -2.4, 0, 8.55); g.add(bigLeaf);
  addCol(-2.7, 8.3, -2.1, 8.8);
  placeModel(g, 'potted_plant_04/potted_plant_04_1k.gltf', 2.5, 0, 4.6, 0.6, 1.15);
  addCol(2.2, 4.3, 2.8, 4.9);

  /* hero piece: mid-century lounge chair in SE corner facing the sofa */
  addCol(1.95, 8.1, 2.85, 8.85);
  placeModel(g, 'mid_century_lounge_chair/mid_century_lounge_chair_1k.gltf', 2.4, 0, 8.45, -2.4, 0.82);

  /* framed art on east wall + side table */
  const art = photoFrame(0.4, 0.5, imgTex('assets/living-art.png'), 0xf4efe4);
  put(art, 2.96, 1.7, 4.55, 0, Math.PI, 0); g.add(art);
  addCol(1.75, 5.0, 2.3, 5.6);
  g.add(put(cyl(0.24, 0.26, 0.05, WOOD_L), 2.05, 0.5, 5.3));
  g.add(put(cyl(0.03, 0.04, 0.46, WOOD_D), 2.05, 0.25, 5.3));
  g.add(put(jar(0.09, 0.14, 0xd8cfc0), 2.05, 0.53, 5.3));

  /* ceramic vase on the coffee table */
  placeModel(g, 'ceramic_vase_01/ceramic_vase_01_1k.gltf', -1.05, 0.405, 6.55, 0.9, 0.26);

  /* lived-in: remote on the sofa arm + throw blanket over the back */
  g.add(put(box(0.05, 0.022, 0.14, DARK), -2.58, 0.9, 5.18, 0, 0.2, 0));
  g.add(put(box(0.3, 0.05, 0.52, fleeceMat(0.5, 0.7, 0xd0a078)), -2.84, 1.12, 6.9, 0, 0, 0.14));

  /* ambient */
  const warm = new THREE.PointLight(0xffd9a8, 6, 10, 2);
  put(warm, 0, 2.6, 6.5); g.add(warm);

  return g;
}
