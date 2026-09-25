import * as THREE from 'three';
import {
  M, put, box, cyl, sph, cap, torus,
  colliders, walkable, addWalk
} from './common.js';
import { buildBedroom } from './bedroom.js';
import { buildHallway } from './hallway.js';
import { buildBathroom } from './bathroom.js';
import { buildKitchen } from './kitchen.js';
import { buildLiving } from './living.js';

/* ============================================================
   COZY HOUSE — walkable 3D home stitched from the images.
   Bedroom N · hallway hub · bathroom W · kitchen E · living S
   ============================================================ */

const app = document.getElementById('app');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1520);
scene.fog = new THREE.Fog(0x1a1520, 16, 42);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 80);

/* ---------- house ---------- */
const slab = box(16, 0.24, 19, M(0xd8cfc0, 0.9));
put(slab, 0, -0.17, 0); scene.add(slab);

scene.add(buildBedroom());   /* its own addCol offsets via setOrigin */
scene.add(buildHallway());
scene.add(buildBathroom());
scene.add(buildKitchen());
scene.add(buildLiving());

/* walkable union: room rects are registered by their builders;
   bedroom + door bridges added here (world coords) */
addWalk(-2.98, -8.94, 2.98, -4.06);                 /* bedroom */
addWalk(-0.4, -4.14, 0.4, -3.86);                   /* bedroom door */
addWalk(-0.4, 3.86, 0.4, 4.14);                     /* living door */
addWalk(-1.64, -2.18, -1.36, -1.32);                /* bathroom door */
addWalk(1.36, -2.18, 1.64, -1.32);                  /* kitchen door */

/* ---------- global light + dust ---------- */
scene.add(new THREE.HemisphereLight(0xfff1dd, 0x4a4038, 0.5));
const dusk = new THREE.DirectionalLight(0x8890c8, 0.7);
put(dusk, 1.5, 4.5, -14);
dusk.target.position.set(0.4, 0.8, 0);
dusk.castShadow = true;
dusk.shadow.mapSize.set(2048, 2048);
dusk.shadow.camera.left = -10; dusk.shadow.camera.right = 10;
dusk.shadow.camera.top = 10; dusk.shadow.camera.bottom = -10;
scene.add(dusk, dusk.target);

const dustGeo = new THREE.BufferGeometry();
const dustN = 260, dustPos = new Float32Array(dustN * 3);
const rooms = [[-3, 3, -9, -4], [-1.5, 1.5, -4, 4], [-7.5, -1.5, -4, 1], [1.5, 7.5, -4, 1], [-3, 3, 4, 9]];
for (let i = 0; i < dustN; i++) {
  const r = rooms[i % rooms.length];
  dustPos[i * 3] = r[0] + Math.random() * (r[1] - r[0]);
  dustPos[i * 3 + 1] = Math.random() * 2.8;
  dustPos[i * 3 + 2] = r[2] + Math.random() * (r[3] - r[2]);
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
  color: 0xffe4b0, size: 0.018, transparent: true, opacity: 0.5,
  blending: THREE.AdditiveBlending, depthWrite: false
}));
scene.add(dust);

/* ============================================================
   MANNEQUIN  (white segmented figure, ~1.7 m)
   ============================================================ */
const skin = M(0xeef0f2, 0.38, 0.04);
const seamMat = M(0x7d848a, 0.7);

const char = new THREE.Group();          // root at ground
const body = new THREE.Group();          // bobs while walking
char.add(body);

const pelvis = cap(0.14, 0.1, skin); pelvis.scale.set(1.18, 1, 0.82);
put(pelvis, 0, 1.0, 0); body.add(pelvis);
const torso = cap(0.155, 0.34, skin); torso.scale.set(1.18, 1, 0.78);
put(torso, 0, 1.28, 0); body.add(torso);
body.add(put(torus(0.148, 0.008, seamMat), 0, 1.1, 0, Math.PI / 2));
body.add(put(cyl(0.042, 0.05, 0.09, skin), 0, 1.51, 0));
body.add(put(torus(0.05, 0.006, seamMat), 0, 1.5, 0, Math.PI / 2));
const head = sph(0.115, skin); head.scale.set(0.92, 1.24, 1.0);
put(head, 0, 1.645, 0); body.add(head);

function arm(side) {
  const p = new THREE.Group();
  p.position.set(0.235 * side, 1.415, 0);
  p.add(put(sph(0.062, skin), 0, 0, 0));
  p.add(put(torus(0.055, 0.006, seamMat), 0, -0.01, 0, 0, 0, side * 0.5));
  const up = cap(0.048, 0.2, skin); up.position.y = -0.16; p.add(up);
  p.add(put(torus(0.042, 0.005, seamMat), 0, -0.3, 0, Math.PI / 2));
  const fore = cap(0.042, 0.2, skin); fore.position.y = -0.42; p.add(fore);
  const hand = sph(0.048, skin); hand.scale.set(0.8, 1.3, 0.9);
  hand.position.y = -0.57; p.add(hand);
  p.rotation.z = side * 0.08;
  return p;
}
function leg(side) {
  const p = new THREE.Group();
  p.position.set(0.105 * side, 0.97, 0);
  p.add(put(torus(0.062, 0.006, seamMat), 0, -0.02, 0, Math.PI / 2));
  const thigh = cap(0.066, 0.3, skin); thigh.position.y = -0.22; p.add(thigh);
  p.add(put(torus(0.055, 0.006, seamMat), 0, -0.44, 0, Math.PI / 2));
  const shin = cap(0.052, 0.3, skin); shin.position.y = -0.64; p.add(shin);
  const foot = box(0.1, 0.07, 0.24, skin);
  foot.position.set(0, -0.9, 0.055); p.add(foot);
  return p;
}
const armL = arm(-1), armR = arm(1), legL = leg(-1), legR = leg(1);
char.add(armL, armR, legL, legR);

char.position.set(0, 0, -0.6);           /* spawn: hallway, facing bedroom */
char.rotation.y = Math.PI;
scene.add(char);

/* ============================================================
   CONTROLS + COLLISION + LOOP
   ============================================================ */
const keys = {};
let yaw = Math.PI, pitch = 0.32, firstPerson = false;
let vy = 0, grounded = true, phase = 0, bobBlend = 0;

const isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
  || new URLSearchParams(location.search).has('touch');

const enterEl = document.getElementById('enter');
const hudEl = document.getElementById('hud');
const hintEl = document.getElementById('hint');
const joyEl = document.getElementById('joy');
const knobEl = document.getElementById('joyknob');
const tbtns = document.getElementById('tbtns');

enterEl.addEventListener('click', () => {
  if (isTouchDevice) {
    enterEl.classList.add('hidden');
    hudEl.classList.add('visible');
    tbtns.classList.add('visible');
    hintEl.textContent = 'left thumb walk · right thumb look · buttons run / jump / cam';
    hintEl.classList.add('visible');
  } else {
    renderer.domElement.requestPointerLock();
  }
});

let joyId = null, lookId = null, joyX = 0, joyY = 0, runTouch = false;
let joyBaseX = 0, joyBaseY = 0, lookLastX = 0, lookLastY = 0;
const JOY_R = 55;

if (isTouchDevice) {
  addEventListener('pointerdown', (e) => {
    if (e.target instanceof Element && (e.target.closest('.tbtn') || e.target.closest('#enter'))) return;
    if (e.clientX < innerWidth * 0.45 && joyId === null) {
      joyId = e.pointerId; joyBaseX = e.clientX; joyBaseY = e.clientY;
      joyEl.style.display = 'block';
      joyEl.style.left = e.clientX + 'px'; joyEl.style.top = e.clientY + 'px';
      knobEl.style.transform = 'translate(-50%,-50%)';
    } else if (lookId === null) {
      lookId = e.pointerId; lookLastX = e.clientX; lookLastY = e.clientY;
    }
  });
  addEventListener('pointermove', (e) => {
    if (e.pointerId === joyId) {
      let jx = e.clientX - joyBaseX, jy = e.clientY - joyBaseY;
      const d = Math.hypot(jx, jy);
      if (d > JOY_R) { jx *= JOY_R / d; jy *= JOY_R / d; }
      joyX = jx / JOY_R; joyY = jy / JOY_R;
      knobEl.style.transform = `translate(calc(-50% + ${jx}px), calc(-50% + ${jy}px))`;
    } else if (e.pointerId === lookId) {
      yaw -= (e.clientX - lookLastX) * 0.0055;
      pitch += (e.clientY - lookLastY) * 0.0055;
      pitch = Math.max(-0.25, Math.min(1.15, pitch));
      lookLastX = e.clientX; lookLastY = e.clientY;
    }
  });
  const endTouch = (e) => {
    if (e.pointerId === joyId) { joyId = null; joyX = joyY = 0; joyEl.style.display = 'none'; }
    else if (e.pointerId === lookId) lookId = null;
  };
  addEventListener('pointerup', endTouch);
  addEventListener('pointercancel', endTouch);
  addEventListener('contextmenu', (e) => e.preventDefault());

  const bindBtn = (id, fn) => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); fn(el); });
  };
  bindBtn('btn-jump', () => { if (grounded) { vy = 4.6; grounded = false; } });
  bindBtn('btn-run', (el) => { runTouch = !runTouch; el.classList.toggle('on', runTouch); });
  bindBtn('btn-cam', () => { firstPerson = !firstPerson; });
}
document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === renderer.domElement;
  enterEl.classList.toggle('hidden', locked);
  hudEl.classList.toggle('visible', locked);
  hintEl.classList.toggle('visible', locked);
});
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== renderer.domElement) return;
  yaw -= e.movementX * 0.0026;
  pitch += e.movementY * 0.0026;
  pitch = Math.max(-0.25, Math.min(1.15, pitch));
});
addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'KeyV') firstPerson = !firstPerson;
  if (e.code === 'Space' && grounded) { vy = 4.6; grounded = false; }
});
addEventListener('keyup', (e) => keys[e.code] = false);
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ---------- collision: walkable union + furniture AABBs ---------- */
const CHAR_R = 0.26;
function inWalkable(x, z, pad = 0) {
  for (const r of walkable)
    if (x > r.x1 - pad && x < r.x2 + pad && z > r.z1 - pad && z < r.z2 + pad) return true;
  return false;
}
function collide(p) {
  for (let it = 0; it < 2; it++) {
    for (const c of colliders) {
      const x1 = c.x1 - CHAR_R, x2 = c.x2 + CHAR_R;
      const z1 = c.z1 - CHAR_R, z2 = c.z2 + CHAR_R;
      if (p.x > x1 && p.x < x2 && p.z > z1 && p.z < z2) {
        const dxl = p.x - x1, dxr = x2 - p.x, dzl = p.z - z1, dzr = z2 - p.z;
        const m = Math.min(dxl, dxr, dzl, dzr);
        if (m === dxl) p.x = x1; else if (m === dxr) p.x = x2;
        else if (m === dzl) p.z = z1; else p.z = z2;
      }
    }
  }
}

/* room labels for HUD */
const ROOM_NAMES = [
  [-3, 3, -9, -4, 'Bedroom'], [-1.5, 1.5, -4, 4, 'Hallway'],
  [-7.5, -1.5, -4, 1, 'Bathroom'], [1.5, 7.5, -4, 1, 'Kitchen'],
  [-3, 3, 4, 9, 'Living Room']
];
let curRoom = '';
function roomLabel(x, z) {
  for (const r of ROOM_NAMES)
    if (x > r[0] && x < r[1] && z > r[2] && z < r[3]) return r[4];
  return curRoom;
}

const clock = new THREE.Clock();
const headPos = new THREE.Vector3();
const camPos = new THREE.Vector3();
const desired = new THREE.Vector3();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  /* --- movement --- */
  let ix = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joyX;
  let iz = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0) - joyY;
  const mag = Math.min(1, Math.hypot(ix, iz));
  if (mag > 0.01) { ix /= Math.hypot(ix, iz); iz /= Math.hypot(ix, iz); }
  const moving = mag > 0.12;
  const spd = (keys.ShiftLeft || keys.ShiftRight || runTouch ? 3.3 : 1.65) * mag;

  const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
  let dx = 0, dz = 0;
  if (moving) {
    dx = fx * iz + (-fz) * ix;
    dz = fz * iz + (fx) * ix;
    const l = Math.hypot(dx, dz); dx /= l; dz /= l;
    const step = spd * dt;
    /* per-axis slide along walls/doorframes */
    const nx = char.position.x + dx * step;
    if (inWalkable(nx + Math.sign(dx) * CHAR_R * 0.9, char.position.z)) char.position.x = nx;
    const nz = char.position.z + dz * step;
    if (inWalkable(char.position.x, nz + Math.sign(dz) * CHAR_R * 0.9)) char.position.z = nz;
  }
  collide(char.position);

  /* jump/gravity */
  if (!grounded) {
    vy -= 12 * dt;
    char.position.y += vy * dt;
    if (char.position.y <= 0) { char.position.y = 0; vy = 0; grounded = true; }
  }

  /* --- character pose --- */
  const targetYaw = moving ? Math.atan2(dx, dz) : char.rotation.y;
  let dyaw = targetYaw - char.rotation.y;
  while (dyaw > Math.PI) dyaw -= Math.PI * 2;
  while (dyaw < -Math.PI) dyaw += Math.PI * 2;
  char.rotation.y += dyaw * Math.min(1, dt * 12);

  bobBlend += ((moving ? 1 : 0) - bobBlend) * Math.min(1, dt * 8);
  phase += dt * (4.4 + spd * 1.6) * bobBlend;
  const sw = Math.sin(phase) * 0.62 * bobBlend;
  legL.rotation.x = sw; legR.rotation.x = -sw;
  armL.rotation.x = -sw * 0.85; armR.rotation.x = sw * 0.85;
  body.position.y = Math.abs(Math.cos(phase)) * 0.045 * bobBlend;
  body.scale.y = 1 + Math.sin(t * 1.8) * 0.006;
  armL.rotation.z = -0.08 - bobBlend * 0.06;
  armR.rotation.z = 0.08 + bobBlend * 0.06;

  /* room label */
  const rl = roomLabel(char.position.x, char.position.z);
  if (rl !== curRoom && rl) {
    curRoom = rl;
    if (!isTouchDevice) hintEl.textContent = curRoom + ' — WASD walk · Shift run · Space jump · V camera';
  }

  /* --- camera --- */
  headPos.set(char.position.x, char.position.y + 1.55, char.position.z);
  if (firstPerson) {
    char.visible = false;
    const vd = new THREE.Vector3(
      -Math.sin(yaw) * Math.cos(-pitch), Math.sin(-pitch), -Math.cos(yaw) * Math.cos(-pitch));
    camera.position.copy(headPos).addScaledVector(new THREE.Vector3(fx, 0, fz), 0.12);
    camera.lookAt(camera.position.clone().add(vd));
  } else {
    char.visible = true;
    const dist = 2.7;
    desired.set(
      headPos.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      headPos.y + Math.sin(pitch) * dist,
      headPos.z + Math.cos(yaw) * Math.cos(pitch) * dist
    );
    /* pull camera toward head until it sits inside the house */
    camPos.copy(desired);
    for (let i = 0; i < 20 && !inWalkable(camPos.x, camPos.z, -0.1); i++)
      camPos.lerp(headPos, 0.12);
    camPos.x = Math.max(-7.4, Math.min(7.4, camPos.x));
    camPos.z = Math.max(-8.9, Math.min(8.9, camPos.z));
    camPos.y = Math.max(0.28, Math.min(2.95, camPos.y));
    camera.position.copy(camPos);
    camera.lookAt(headPos.x, headPos.y - 0.15, headPos.z);
  }

  /* --- ambient animation --- */
  const dp = dust.geometry.attributes.position.array;
  for (let i = 0; i < dustN; i++) {
    dp[i * 3 + 1] += 0.028 * dt;
    dp[i * 3] += Math.sin(t * 0.4 + i) * 0.0006;
    if (dp[i * 3 + 1] > 2.9) dp[i * 3 + 1] = 0.05;
  }
  dust.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
window.__dbg = { char, camera, inWalkable, walkable, colliders,
  setYaw: (v) => { yaw = v; }, setPitch: (v) => { pitch = v; },
  getYaw: () => yaw };
renderer.setAnimationLoop(animate);
