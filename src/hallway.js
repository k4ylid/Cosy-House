import * as THREE from 'three';
import {
  M, put, box, cyl, sph,
  setOrigin, addCol, addWalk,
  WALL, TRIM, WOOD, WOOD_D, WOOD_L, CREAM, WHITE, GREEN, BRASS, DARK,
  floorTex, rugTex,
  leafyPlant, trailingPothos, bookRow, bookStack, candle, jar, towelRoll,
  photoFrame, runWall, doorFrame, fakeDoor, globeLamp, mirror, imgTex
} from './common.js';

/* Hallway hub: world x[-1.5,1.5] z[-4,4] — doors to bath/kitchen on sides,
   bedroom north (z=-4) and living south (z=4) are shared walls built elsewhere. */
export function buildHallway() {
  const g = new THREE.Group();
  setOrigin(0, 0);
  addWalk(-1.44, -3.94, 1.44, 3.94);

  const floor = box(3.1, 0.1, 8.3, new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 }));
  put(floor, 0, -0.05, 0); g.add(floor);

  /* west wall (bath door) / east wall (kitchen door) */
  runWall(g, [-1.5, -4], [-1.5, 4], { cuts: [{ s: 2.25, w: 0.9, sillH: 0, topH: 2.05 }] });
  runWall(g, [1.5, 4], [1.5, -4], { cuts: [{ s: 5.75, w: 0.9, sillH: 0, topH: 2.05 }] });
  doorFrame(g, 'z', -1.5, -1.75, 0.9, 2.05, true);
  doorFrame(g, 'z', 1.5, -1.75, 0.9, 2.05, true);
  /* decorative closet doors further along */
  fakeDoor(g, 'z', -1.44, 2.6, 1);
  fakeDoor(g, 'z', 1.44, 2.6, -1);

  /* wainscot + crown beams */
  const wainscot = M(0xf0ead9, 0.95);
  for (const sx of [-1, 1]) {
    g.add(put(box(0.03, 0.9, 8.0, wainscot), sx * 1.44, 0.45, 0));
    g.add(put(box(0.05, 0.06, 8.0, TRIM), sx * 1.43, 0.93, 0));
    g.add(put(box(0.12, 0.09, 8.3, M(0xf4efe4, 0.9)), sx * 1.55, 3.05, 0));
  }

  /* runner rug */
  const runner = box(0.95, 0.02, 5.6, new THREE.MeshStandardMaterial({ map: rugTex, roughness: 1 }));
  put(runner, 0, 0.012, 0.3); runner.receiveShadow = true; g.add(runner);

  /* console cabinet against west wall + round mirror above */
  const console_ = new THREE.Group(); g.add(console_);
  addCol(-1.5, 0.15, -1.02, 1.15);
  console_.add(put(box(0.42, 0.78, 0.95, WOOD_D), -1.27, 0.42, 0.65));
  console_.add(put(box(0.46, 0.04, 1.0, WOOD_L), -1.27, 0.83, 0.65));
  for (let i = 0; i < 2; i++)
    console_.add(put(box(0.03, 0.3, 0.42, WOOD), -1.045, 0.28 + i * 0.34, 0.65));
  console_.add(put(sph(0.016, BRASS), -1.02, 0.45, 0.45));
  console_.add(put(sph(0.016, BRASS), -1.02, 0.45, 0.85));
  const hallMirror = mirror(0.34);
  put(hallMirror, -1.44, 1.7, 0.65); g.add(hallMirror);
  g.add(put(torusFrame(0.36), -1.43, 1.7, 0.65));
  console_.add(put(candle(0.1, 0.024), -1.27, 0.85, 0.3));
  console_.add(put(jar(0.09, 0.22, 0x8a6b4a), -1.28, 0.85, 0.95));
  console_.add(put(bookStack(2, 0.7), -1.27, 0.85, 0.58));
  const consoleGlow = new THREE.PointLight(0xffc98a, 1.6, 1.6, 2);
  put(consoleGlow, -1.2, 1.05, 0.3); g.add(consoleGlow);

  /* photo gallery east wall */
  const phTex = [imgTex('assets/bath-art.png'), imgTex('assets/kitchen-art.png'), imgTex('assets/living-art.png')];
  [[0.5, 1.55, 0.17, 0.22], [1.0, 1.78, 0.13, 0.17], [1.45, 1.5, 0.2, 0.15], [2.0, 1.72, 0.15, 0.2]]
    .forEach(([z, y, w, h], i) => {
      const f = photoFrame(w, h, phTex[i % 3], [0xd8cfc0, 0xb8c4c9, 0xc9b8a0][i % 3]);
      put(f, 1.45, y, z, 0, Math.PI, 0); g.add(f);
    });

  /* small bench near south end */
  addCol(0.6, 3.0, 1.3, 3.5);
  g.add(put(box(0.55, 0.07, 0.32, WOOD_L), 0.95, 0.42, 3.25));
  g.add(put(box(0.5, 0.4, 0.05, WOOD_D), 0.95, 0.21, 3.42));
  g.add(put(box(0.5, 0.4, 0.05, WOOD_D), 0.95, 0.21, 3.08));
  g.add(put(box(0.5, 0.05, 0.26, CREAM), 0.95, 0.48, 3.25));

  /* plants + hooks */
  const hp = leafyPlant(1.15); put(hp, -1.0, 0, -3.55); g.add(hp);
  addCol(-1.3, -3.85, -0.7, -3.25);
  for (let i = 0; i < 3; i++) {
    g.add(put(cyl(0.014, 0.014, 0.06, BRASS), -1.44, 1.72, -2.6 + i * 0.3, Math.PI / 2, 0, 0));
  }
  const hat = new THREE.Group();
  hat.add(put(cyl(0.16, 0.16, 0.02, M(0xc9b28a, 1)), 0, 0, 0));
  hat.add(put(sph(0.09, M(0xc9b28a, 1)), 0, 0.05, 0));
  put(hat, -1.4, 1.64, -2.6, 0.1, 0, 0.12); g.add(hat);

  /* globe wall lamps along hall */
  for (const [x, z] of [[-1.42, 3.4], [1.42, -0.2]]) {
    const lamp = globeLamp(0.075); put(lamp, x, 2.05, z); g.add(lamp);
    const l = new THREE.PointLight(0xffca8a, 2.5, 3.4, 2);
    put(l, x * 0.9, 2.05, z); g.add(l);
  }

  function torusFrame(r) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 10, 40), BRASS);
    m.rotation.y = Math.PI / 2;
    return m;
  }

  return g;
}
