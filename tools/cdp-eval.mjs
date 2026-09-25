// Minimal CDP eval client — evaluates JS in the first page target and prints console + result.
// Usage: node tools/cdp-eval.mjs '<expression>'  OR  node tools/cdp-eval.mjs -f file.js
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const list = JSON.parse(execSync('curl -s http://localhost:29229/json').toString());
const page = list.find(t => t.type === 'page');
if (!page) { console.error('no page'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const src = process.argv[2] === '-f'
  ? readFileSync(process.argv[3], 'utf8')
  : process.argv.slice(2).join(' ');

ws.onopen = () => {
  ws.send(JSON.stringify({ id: ++id, method: 'Runtime.evaluate',
    params: { expression: src, awaitPromise: true, returnByValue: true, userGesture: true } }));
};
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id === id) {
    if (m.result?.exceptionDetails) {
      console.error('EXC:', JSON.stringify(m.result.exceptionDetails, null, 1).slice(0, 2000));
    } else {
      console.log(JSON.stringify(m.result?.result?.value));
    }
    ws.close(); process.exit(0);
  }
};
ws.onerror = (e) => { console.error('WS ERR'); process.exit(1); };
setTimeout(() => { console.error('timeout'); process.exit(1); }, 20000);
