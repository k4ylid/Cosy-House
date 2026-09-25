import * as THREE from 'three';
import { Reflector } from './vendor/Reflector.js';
import {
  M, put, box, cyl, sph, cap, torus,
  setOrigin, addCol, cityTex,
  WALL, TRIM, WOOD, WOOD_D, WOOD_L, CREAM, WHITE, GREEN, GREEN_L,
  DARK, BRASS,
  floorTex, knitTex, rugTex, posterTex,
  leafyPlant, trailingPothos, monstera, bookRow, imgTex,
  runWall, doorFrame
} from './common.js';

export function buildBedroom() {
  /* local coords: x[-3,3] z[-2.5,2.5] → world z[-9,-4] */
  const room = new THREE.Group();
  room.position.z = -6.5;
  setOrigin(0, -6.5);

  /* ---------- shell ---------- */
  const floor = box(6, 0.1, 5, new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 }));
  put(floor, 0, -0.05, 0); room.add(floor);

  const winX1 = 0.7, winX2 = 2.3, winY1 = 1.3, winY2 = 2.5;
  runWall(room, [-3, -2.5], [3, -2.5], {
    cuts: [{ s: (winX1 + winX2) / 2 + 3, w: winX2 - winX1, sillH: winY1, topH: winY2 }]
  });
  const wallLeft  = box(0.1, 3, 5.1, WALL); put(wallLeft, -3.05, 1.5, 0); room.add(wallLeft);
  const wallRight = box(0.1, 3, 5.1, WALL); put(wallRight, 3.05, 1.5, 0); room.add(wallRight);
  /* south wall shared with hallway — door at x=0 */
  runWall(room, [-3, 2.5], [1.5, 2.5], { cuts: [{ s: 3, w: 0.9, sillH: 0, topH: 2.05 }] });
  doorFrame(room, 'x', 2.5, 0, 0.9, 2.05, true);
  /* east wall gap x∈[1.5,3] covered by kitchen north wall */

  /* window dressing (back wall) */
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(winX2 - winX1, winY2 - winY1),
    new THREE.MeshBasicMaterial({ map: cityTex }));
  put(glass, (winX1 + winX2) / 2, (winY1 + winY2) / 2, -2.68);
  room.add(glass);

  const frameMat = M(0x4a3a2c, 0.7);
  const fw = winX2 - winX1, fh = winY2 - winY1, wcx = (winX1 + winX2) / 2, wcy = (winY1 + winY2) / 2;
  room.add(put(box(fw + 0.14, 0.08, 0.14, frameMat), wcx, winY2 + 0.02, -2.56));
  room.add(put(box(fw + 0.14, 0.08, 0.14, frameMat), wcx, winY1 - 0.02, -2.56));
  room.add(put(box(0.08, fh, 0.14, frameMat), winX1 - 0.02, wcy, -2.56));
  room.add(put(box(0.08, fh, 0.14, frameMat), winX2 + 0.02, wcy, -2.56));
  room.add(put(box(0.05, fh, 0.08, frameMat), wcx, wcy, -2.58));
  room.add(put(box(fw, 0.05, 0.08, frameMat), wcx, wcy, -2.58));
  const sill = box(fw + 0.3, 0.06, 0.3, WOOD_L);
  put(sill, wcx, winY1 - 0.06, -2.42); room.add(sill);
  const blind = cyl(0.07, 0.07, fw, M(0xb08b58, 0.9));
  put(blind, wcx, winY2 - 0.02, -2.44, 0, 0, Math.PI / 2); room.add(blind);
  for (let i = 0; i < 4; i++)
    room.add(put(box(fw, 0.045, 0.02, M(0xc2a06a, 0.9)), wcx, winY2 - 0.1 - i * 0.055, -2.44));

  /* crown-moulding edge beams on the 3 solid walls */
  const edge = M(0xf4efe4, 0.9);
  room.add(put(box(6.2, 0.09, 0.14, edge), 0, 3.045, -2.56));
  room.add(put(box(0.12, 0.09, 5.3, edge), -3.11, 3.045, 0));
  room.add(put(box(0.12, 0.09, 5.3, edge), 3.11, 3.045, 0));

  /* ---------- bed ---------- */
  const bed = new THREE.Group(); room.add(bed);
  addCol(-0.25, -2.4, 1.95, -0.7);
  bed.add(put(box(0.08, 1.0, 1.6, WOOD), -0.12, 0.55, -1.55));
  bed.add(put(box(2.0, 0.34, 1.6, WOOD), 0.85, 0.19, -1.55));
  bed.add(put(box(1.92, 0.24, 1.5, CREAM), 0.87, 0.5, -1.55));
  const duvet = box(1.45, 0.12, 1.56, new THREE.MeshStandardMaterial({ color: 0x46543c, roughness: 1 }));
  put(duvet, 1.0, 0.63, -1.55); bed.add(duvet);
  const throwKnit = box(0.62, 0.07, 1.62, new THREE.MeshStandardMaterial({ map: knitTex, roughness: 1 }));
  put(throwKnit, 1.5, 0.68, -1.55); bed.add(throwKnit);
  bed.add(put(box(0.66, 0.05, 1.58, M(0xf0e9dc, 1)), 0.06, 0.62, -1.55));
  const pil = (x, z, mat, ry = 0) => {
    const p = sph(0.21, mat); p.scale.set(1.15, 0.5, 0.85);
    p.position.set(x, 0.72, z); p.rotation.set(-0.35, ry, 0);
    bed.add(p);
  };
  pil(0.12, -1.98, GREEN); pil(0.12, -1.15, GREEN);
  pil(0.3, -1.9, CREAM, 0.2); pil(0.3, -1.28, M(0xcfc5ae, 1), -0.15);
  const plush = new THREE.Group();
  plush.add(put(sph(0.085, M(0xf0e4d0, 1)), 0, 0.09, 0));
  plush.add(put(sph(0.065, M(0xf0e4d0, 1)), 0, 0.2, 0));
  plush.add(put(sph(0.022, M(0xf0e4d0, 1)), -0.05, 0.26, 0));
  plush.add(put(sph(0.022, M(0xf0e4d0, 1)), 0.05, 0.26, 0));
  plush.add(put(sph(0.011, M(0x2b2b30, 0.5)), -0.022, 0.21, 0.058));
  plush.add(put(sph(0.011, M(0x2b2b30, 0.5)), 0.022, 0.21, 0.058));
  put(plush, 0.62, 0.66, -1.28, -0.2, 0.4, 0); bed.add(plush);
  for (const dx of [0.35, 1.0]) {
    bed.add(put(box(0.58, 0.2, 0.03, WOOD_L), dx, 0.21, -0.74));
    bed.add(put(sph(0.018, DARK), dx, 0.21, -0.71));
  }
  bed.add(put(box(0.5, 0.26, 0.03, M(0x241c14, 1)), 1.6, 0.22, -0.74));
  const cubbyGlow = new THREE.PointLight(0xffc98a, 2.2, 1.6, 2);
  put(cubbyGlow, 1.6, 0.24, -0.68); bed.add(cubbyGlow);
  for (let i = 0; i < 6; i++)
    bed.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0 })),
      1.44 + Math.random() * 0.32, 0.15 + Math.random() * 0.14, -0.72 - Math.random() * 0.04));

  /* nightstand + alarm clock */
  bed.add(put(box(0.5, 0.48, 0.42, WOOD), -0.62, 0.24, -1.95));
  bed.add(put(box(0.52, 0.03, 0.44, WOOD_L), -0.62, 0.5, -1.95));
  const alarmClock = cyl(0.055, 0.055, 0.03, M(0xe8ddc9, 0.7));
  put(alarmClock, -0.68, 0.56, -1.98, Math.PI / 2, 0, 0); bed.add(alarmClock);
  bed.add(put(sph(0.015, BRASS), -0.68, 0.63, -1.98));
  bed.add(put(box(0.22, 0.04, 0.16, M(0x8a4b3a, 0.9)), -0.5, 0.54, -1.9));
  addCol(-0.9, -2.2, -0.35, -1.7);

  /* ---------- desk + chair + shelves ---------- */
  const desk = new THREE.Group(); room.add(desk);
  addCol(-3.0, -1.95, -2.25, 0.45);
  desk.add(put(box(0.62, 0.05, 2.15, WOOD_L), -2.66, 0.73, -0.7));
  desk.add(put(box(0.56, 0.7, 0.05, WOOD), -2.66, 0.36, -1.7));
  desk.add(put(box(0.56, 0.7, 0.05, WOOD), -2.66, 0.36, 0.28));
  desk.add(put(box(0.05, 0.36, 0.58, DARK), -2.8, 1.02, -1.35));
  desk.add(put(new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x11141c, emissive: 0x18213a, emissiveIntensity: 0.9, roughness: 0.4 })),
    -2.77, 1.02, -1.35, 0, Math.PI / 2, 0));
  desk.add(put(box(0.16, 0.1, 0.05, DARK), -2.8, 0.82, -1.35));
  desk.add(put(box(0.22, 0.02, 0.24, DARK), -2.8, 0.76, -1.35));
  desk.add(put(box(0.34, 0.025, 0.13, M(0xd8d2c4, 0.8)), -2.5, 0.765, -1.2));
  desk.add(put(cyl(0.045, 0.035, 0.1, M(0x7a4b32, 0.85)), -2.5, 0.81, -0.72));
  desk.add(put(box(0.24, 0.015, 0.32, M(0xf0ead8, 0.95)), -2.5, 0.758, -0.3));
  const pencilCup = cyl(0.04, 0.035, 0.11, M(0x5d6b57, 0.9));
  desk.add(put(pencilCup, -2.82, 0.81, 0.1));
  for (let i = 0; i < 4; i++)
    desk.add(put(cyl(0.005, 0.005, 0.16, M(0xd9a648, 0.8)),
      -2.82 + (i - 1.5) * 0.014, 0.9, 0.1 + (i % 2) * 0.012, 0.1 * i, 0, 0.08));
  desk.add(put(cyl(0.09, 0.11, 0.03, BRASS), -2.85, 0.775, -0.55));
  desk.add(put(cyl(0.015, 0.015, 0.34, BRASS), -2.85, 0.92, -0.55, 0, 0, -0.35));
  desk.add(put(new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.14, 20, 1, true), BRASS), -2.78, 1.1, -0.55, 0, 0, 0.5));
  desk.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0 })), -2.74, 1.06, -0.55));
  const lampLight = new THREE.PointLight(0xffb46b, 13, 6, 2);
  lampLight.castShadow = true; lampLight.shadow.mapSize.set(1024, 1024);
  put(lampLight, -2.6, 1.12, -0.55); room.add(lampLight);
  const deskPlant = leafyPlant(0.9); put(deskPlant, -2.8, 0.76, 0.28); desk.add(deskPlant);

  const chair = new THREE.Group();
  chair.add(put(cyl(0.27, 0.28, 0.07, M(0xe6e2d8, 0.9)), 0, 0.47, 0));
  chair.add(put(box(0.07, 0.55, 0.42, M(0xe6e2d8, 0.9)), 0.26, 0.82, 0, 0, 0, -0.12));
  chair.add(put(cyl(0.03, 0.03, 0.4, M(0x9aa0a5, 0.5, 0.7)), 0, 0.24, 0));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    chair.add(put(box(0.3, 0.03, 0.05, M(0x9aa0a5, 0.5, 0.7)), Math.cos(a) * 0.15, 0.05, Math.sin(a) * 0.15, 0, -a, 0));
    chair.add(put(sph(0.028, DARK), Math.cos(a) * 0.29, 0.028, Math.sin(a) * 0.29));
  }
  put(chair, -1.85, 0, -0.75, 0, 0.35, 0); room.add(chair);
  addCol(-2.15, -1.05, -1.55, -0.45);

  const shelfZs = [[-1.25, 0.35], [-1.25, 0.1], [-0.9, 0.35]];
  const shelfYs = [1.5, 1.95, 2.4];
  for (let i = 0; i < 3; i++) {
    const [z1, z2] = shelfZs[i];
    room.add(put(box(0.26, 0.04, z2 - z1, WOOD_L), -2.85, shelfYs[i], (z1 + z2) / 2));
    room.add(put(bookRow(z1 + 0.05, z2 - 0.25, 0.02), -2.88, shelfYs[i], 0));
  }
  const shelfPothos = trailingPothos(0.85, 0.55);
  put(shelfPothos, -2.85, 1.97, 0.02); room.add(shelfPothos);
  const globeLampM = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 12),
    new THREE.MeshStandardMaterial({ color: 0xfff2dd, emissive: 0xffd9a0, emissiveIntensity: 1.4, roughness: 0.9 }));
  put(globeLampM, -2.85, 2.51, 0.28); room.add(globeLampM);
  const globeLight = new THREE.PointLight(0xffca8a, 4, 3.5, 2);
  put(globeLight, -2.75, 2.5, 0.28); room.add(globeLight);
  const shelfPlant = leafyPlant(0.7); put(shelfPlant, -2.85, 2.42, -0.5); room.add(shelfPlant);

  room.add(put(box(0.04, 1.25, 1.0, WOOD_D), -2.99, 1.95, -1.9));
  room.add(put(new THREE.Mesh(new THREE.PlaneGeometry(0.86, 1.12),
    new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.95 })), -2.965, 1.95, -1.9, 0, Math.PI / 2, 0));

  const photoCols = [0xd8cfc0, 0xc9b8a0, 0xb8c4c9];
  photoCols.forEach((c, i) => {
    room.add(put(box(0.02, 0.22, 0.17, TRIM), -2.99, 1.12, -0.5 + i * 0.28));
    room.add(put(new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.17),
      M(c, 0.95)), -2.975, 1.12, -0.5 + i * 0.28, 0, Math.PI / 2, 0));
  });

  for (const [sy, sw] of [[1.8, 0.8], [2.2, 0.65]]) {
    room.add(put(box(sw, 0.04, 0.24, WOOD_L), -0.85, sy, -2.42));
  }
  const cornerBooks = bookRow(-0.35, 0.25, 0.02);
  cornerBooks.rotation.y = Math.PI / 2; put(cornerBooks, -0.85, 1.82, -2.42); room.add(cornerBooks);
  const cornerPothos = trailingPothos(0.8, 0.75);
  put(cornerPothos, -0.55, 2.22, -2.42); room.add(cornerPothos);
  const cornerPlant = leafyPlant(0.65); put(cornerPlant, -1.05, 1.82, -2.42); room.add(cornerPlant);
  const cornerCandle = cyl(0.025, 0.025, 0.09, M(0xf0e6d0, 0.9));
  put(cornerCandle, -0.62, 1.86, -2.42); room.add(cornerCandle);
  room.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xffca7a })), -0.62, 1.92, -2.42));

  /* ---------- wardrobe + mirror + polaroids ---------- */
  const ward = new THREE.Group(); room.add(ward);
  addCol(2.3, -0.6, 3.0, 1.5);
  ward.add(put(box(0.62, 2.15, 2.0, WHITE), 2.68, 1.075, 0.45));
  ward.add(put(box(0.66, 0.06, 2.04, TRIM), 2.68, 2.18, 0.45));
  ward.add(put(box(0.03, 2.0, 0.98, M(0xe4ddcd, 0.9)), 2.36, 1.06, -0.05));
  const mirror = new Reflector(new THREE.PlaneGeometry(0.86, 1.86), {
    clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color: 0xa8b0b8
  });
  put(mirror, 2.35, 1.06, -0.05, 0, -Math.PI / 2, 0);
  ward.add(mirror);
  ward.add(put(box(0.03, 2.0, 0.94, M(0xefe9da, 0.9)), 2.36, 1.06, 0.97));
  const mannTex = imgTex('assets/mannequin-photo.jpg');
  const roomTex = imgTex('assets/room-art.png');
  const bedArtTex = imgTex('assets/living-art.png');
  const mkPolaroid = (tex, x, y, z, ry = 0) => {
    const g = new THREE.Group();
    g.add(put(box(0.015, 0.24, 0.19, M(0xfaf6ec, 0.95)), 0, 0, 0));
    const img = new THREE.Mesh(new THREE.PlaneGeometry(0.155, 0.155),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
    img.position.set(-0.01, 0.02, 0); img.rotation.y = -Math.PI / 2;
    g.add(img); put(g, x, y, z, 0, 0, ry);
    return g;
  };
  ward.add(mkPolaroid(mannTex, 2.35, 1.62, 0.62, -0.06));
  ward.add(mkPolaroid(roomTex, 2.35, 1.3, 1.02, 0.08));
  ward.add(mkPolaroid(bedArtTex, 2.35, 0.98, 0.7, -0.1));
  const basket = cyl(0.17, 0.14, 0.2, M(0x9a7448, 0.95));
  put(basket, 2.68, 2.31, 0.9); ward.add(basket);
  const wardPothos = trailingPothos(0.9, 1.15);
  put(wardPothos, 2.68, 2.21, -0.15); ward.add(wardPothos);

  /* ---------- rug, coffee table, cushion, plants, lamps ---------- */
  const rugShape = new THREE.Shape();
  const rw = 1.6, rd = 1.15, rr = 0.28;
  rugShape.moveTo(-rw + rr, -rd);
  rugShape.lineTo(rw - rr, -rd); rugShape.quadraticCurveTo(rw, -rd, rw, -rd + rr);
  rugShape.lineTo(rw, rd - rr); rugShape.quadraticCurveTo(rw, rd, rw - rr, rd);
  rugShape.lineTo(-rw + rr, rd); rugShape.quadraticCurveTo(-rw, rd, -rw, rd - rr);
  rugShape.lineTo(-rw, -rd + rr); rugShape.quadraticCurveTo(-rw, -rd, -rw + rr, -rd);
  const rug = new THREE.Mesh(new THREE.ShapeGeometry(rugShape, 24),
    new THREE.MeshStandardMaterial({ map: rugTex, roughness: 1 }));
  put(rug, 0, 0.015, 1.25, -Math.PI / 2, 0, 0); rug.receiveShadow = true;
  room.add(rug);

  const table = new THREE.Group(); room.add(table);
  addCol(0.0, 0.78, 0.72, 1.5);
  table.add(put(cyl(0.36, 0.36, 0.045, WOOD_L), 0.36, 0.42, 1.14));
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3 + 0.5;
    table.add(put(cyl(0.018, 0.014, 0.4, WOOD_D), 0.36 + Math.cos(a) * 0.24, 0.2, 1.14 + Math.sin(a) * 0.24));
  }
  table.add(put(box(0.2, 0.03, 0.26, M(0x8a4b3a, 0.9)), 0.28, 0.46, 1.08, 0, 0.3, 0));
  table.add(put(box(0.17, 0.025, 0.22, M(0x4d6673, 0.9)), 0.29, 0.487, 1.09, 0, 0.45, 0));
  table.add(put(cyl(0.03, 0.03, 0.12, M(0xf0e6d0, 0.9)), 0.5, 0.505, 1.22));
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xffb84d }));
  flame.scale.y = 1.7;
  table.add(put(flame, 0.5, 0.585, 1.22));
  const candleLight = new THREE.PointLight(0xff9e4d, 2.6, 2.6, 2);
  put(candleLight, 0.5, 0.66, 1.22); room.add(candleLight);

  const cushion = sph(0.3, GREEN_L);
  cushion.scale.set(1, 0.42, 1);
  put(cushion, -0.85, 0.13, 1.6, 0, 0.4, 0); room.add(cushion);
  addCol(-1.15, 1.3, -0.55, 1.9);

  const bigPlant = monstera(); put(bigPlant, 1.35, 0, 2.1); room.add(bigPlant);
  addCol(1.05, 1.8, 1.65, 2.4);
  const plant2 = leafyPlant(1.3); put(plant2, -2.4, 0, 1.9); room.add(plant2);
  addCol(-2.7, 1.6, -2.1, 2.2);

  const fl = new THREE.Group(); room.add(fl);
  addCol(1.9, -0.15, 2.2, 0.25);
  fl.add(put(cyl(0.11, 0.13, 0.03, BRASS), 2.05, 0.02, 0.05));
  fl.add(put(cyl(0.015, 0.015, 1.42, BRASS), 2.05, 0.74, 0.05));
  fl.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.22, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf2e2c4, emissive: 0xffca8a, emissiveIntensity: 0.9, roughness: 0.9, side: THREE.DoubleSide })),
    2.05, 1.5, 0.05));
  const flLight = new THREE.PointLight(0xffc27a, 9, 5.5, 2);
  flLight.castShadow = true; flLight.shadow.mapSize.set(1024, 1024);
  put(flLight, 2.05, 1.45, 0.05); room.add(flLight);

  const jarG = new THREE.Group(); room.add(jarG);
  addCol(-0.55, -0.7, -0.15, -0.3);
  jarG.add(put(box(0.34, 0.34, 0.34, new THREE.MeshStandardMaterial({
    color: 0xd8cfc0, roughness: 0.2, transparent: true, opacity: 0.3 })), -0.35, 0.18, -0.5));
  for (let i = 0; i < 9; i++)
    jarG.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0 })),
      -0.35 + (Math.random() - 0.5) * 0.24, 0.07 + Math.random() * 0.24, -0.5 + (Math.random() - 0.5) * 0.24));
  const jarLight = new THREE.PointLight(0xffca7a, 2, 1.9, 2);
  put(jarLight, -0.35, 0.3, -0.5); room.add(jarLight);

  /* windowsill plants */
  const sillP1 = leafyPlant(0.75); put(sillP1, 0.95, winY1 - 0.03, -2.42); room.add(sillP1);
  const sillP2 = trailingPothos(0.7, 0.5); put(sillP2, 2.05, winY1 - 0.03, -2.42); room.add(sillP2);
  const sillP3 = leafyPlant(0.6); put(sillP3, 1.55, winY1 - 0.03, -2.42); room.add(sillP3);

  return room;
}
