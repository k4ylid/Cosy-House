new Promise((res) => {
  const d = window.__dbg;
  d.char.position.set(0, 0, 5.5);
  d.setYaw(0); d.setPitch(0.15);
  const log = [];
  window.dispatchEvent(new KeyboardEvent('keydown', {code:'KeyW'}));
  const iv = setInterval(() => {
    log.push([+d.char.position.x.toFixed(2), +d.char.position.z.toFixed(2)]);
    if (log.length >= 24) {
      clearInterval(iv);
      window.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyW'}));
      res(JSON.stringify(log));
    }
  }, 500);
})
