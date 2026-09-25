import { execSync } from 'node:child_process';
const browser = JSON.parse(execSync('curl -s http://localhost:29229/json/version').toString());
const ws = new WebSocket(browser.webSocketDebuggerUrl);
let id = 0; const pending = new Map(); const events = [];
const send = (m, p = {}, s) => new Promise((res, rej) => { const i = ++id; pending.set(i, {res,rej}); ws.send(JSON.stringify({id:i,method:m,params:p,sessionId:s})); });
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
  else if (m.method === 'Runtime.exceptionThrown') events.push('EXC ' + JSON.stringify(m.params.exceptionDetails).slice(0, 1200));
  else if (m.method) events.push(m.method + ' ' + JSON.stringify(m.params).slice(0, 300));
};
ws.onopen = async () => {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Runtime.enable', {}, sessionId);
  await send('Page.enable', {}, sessionId);
  await send('Log.enable', {}, sessionId);
  await send('Page.navigate', { url: process.argv[2] || 'http://localhost:8090/?touch=1' }, sessionId);
  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const r = await send('Runtime.evaluate', { expression: 'JSON.stringify({dbg:typeof window.__dbg,img:document.querySelectorAll("canvas").length})', returnByValue: true }, sessionId);
    console.log(`t=${(i+1)*3}s`, r.result?.value);
    if (typeof r.result?.value === 'string' && r.result.value.includes('"dbg":"object"')) break;
  }
  console.log('EVENTS\n' + events.filter(e => !/^(Page\.|Target\.|Network\.|Runtime\.executionContext)/.test(e)).slice(0,20).join('\n'));
  await send('Target.closeTarget', { targetId });
  process.exit(0);
};
setTimeout(() => { console.error('timeout'); process.exit(1); }, 90000);
