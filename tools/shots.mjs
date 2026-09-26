// Drive the running page over CDP: pose the character, wait a few frames, capture PNG.
// Usage: node tools/shots.mjs <url> <outdir> [preset]
//   preset 'all' (default) captures every pose in POSES.
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , url = 'http://localhost:8090/?hudless=1', outdir = 'docs/baseline', preset = 'all'] = process.argv;

// Fixed poses: [name, charX, charZ, yaw, pitch]
const POSES = [
  ['bedroom',    0.0, -6.5, -0.50,         0.12],
  ['hallway',    0.0, -0.6,  Math.PI,      0.18],
  ['bathroom',  -4.4, -0.8, -0.40,         0.20],
  ['kitchen',    4.6, -0.6, -2.40,         0.15],
  ['living',     0.3,  5.3,  0.40,         0.18],
  ['living-win', 0.5,  6.9,  Math.PI,      0.12],
];

const list = JSON.parse(execSync('curl -s http://localhost:29229/json').toString());
const browser = list.find(t => t.type === 'browser') ||
                JSON.parse(execSync('curl -s http://localhost:29229/json/version').toString());
const wsUrl = browser.webSocketDebuggerUrl;
const ws = new WebSocket(wsUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const mid = ++id;
  pending.set(mid, { res, rej });
  ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
});
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id); pending.delete(m.id);
    m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result);
  }
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

ws.onopen = async () => {
  try {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Network.enable', {}, sessionId);
    await send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
    await send('Emulation.setDeviceMetricsOverride',
      { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send('Page.navigate', { url }, sessionId);
    // wait until __dbg exists (module graph fully evaluated)
    for (let i = 0; i < 40; i++) {
      await sleep(1000);
      const r = await send('Runtime.evaluate', { expression: 'typeof window.__dbg', returnByValue: true }, sessionId);
      if (r.result?.value === 'object') break;
      if (i === 39) throw new Error('page never defined __dbg');
    }

    // ad-hoc pose: preset "x,z,yaw,pitch" captures a single custom shot
    if (preset.includes(',')) {
      const [x, z, yaw, pitch] = preset.split(',').map(Number);
      POSES.length = 0; POSES.push(['custom', x, z, yaw, pitch]);
    }

    const evalJs = async (expr) => {
      const r = await send('Runtime.evaluate', {
        expression: expr, awaitPromise: true, returnByValue: true }, sessionId);
      if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 800));
      return r.result?.value;
    };

    // dismiss the enter overlay without pointer lock
    await evalJs(`document.getElementById('enter').classList.add('hidden'); "ok"`);

    mkdirSync(outdir, { recursive: true });
    for (const [name, x, z, yaw, pitch] of POSES) {
      if (preset !== 'all' && preset !== name && name !== 'custom') continue;
      await evalJs(`__dbg.char.position.set(${x},0,${z}); __dbg.setYaw(${yaw}); __dbg.setPitch(${pitch}); "posed"`);
      await sleep(2600); // a few frames at software-GL rates
      const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
      writeFileSync(resolve(outdir, name + '.png'), Buffer.from(shot.data, 'base64'));
      console.log('shot', name);
    }

    // perf stats
    const stats = await evalJs(`JSON.stringify({
      calls: __dbg.renderer ? __dbg.renderer.info.render.calls : (window.__r ? window.__r.info.render.calls : -1),
      tris: __dbg.renderer ? __dbg.renderer.info.render.triangles : -1,
      geoms: __dbg.renderer ? __dbg.renderer.info.memory.geometries : -1,
      tex: __dbg.renderer ? __dbg.renderer.info.memory.textures : -1 })`);
    console.log('STATS', stats);
    await send('Target.closeTarget', { targetId });
    process.exit(0);
  } catch (e) { console.error('FAIL', e.message); process.exit(1); }
};
setTimeout(() => { console.error('global timeout'); process.exit(1); }, 120000);
