/* TripWalkers — the route. One orange line drawn by your scroll; the raccoon walks its head. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrap = document.querySelector('[data-route]');
  if (!wrap) return;
  const svg = wrap.querySelector('svg.route');
  const base = svg.querySelector('.route-base');
  const line = svg.querySelector('.route-line');
  const walker = document.querySelector('.walker');
  const nodes = [...wrap.querySelectorAll('[data-node]')];
  let total = 0, table = [], top = 0, lastLen = 0, lastX = 0;

  function anchor(el) {
    const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    return { x: r.left + r.width / 2 - w.left, y: r.top + r.height / 2 - w.top };
  }

  function build() {
    const W = wrap.offsetWidth, H = wrap.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const pts = nodes.map(anchor);
    const mobile = W < 760;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], dy = b.y - a.y;
      if (mobile) {
        d += ` C ${a.x + 26} ${a.y + dy * 0.35}, ${b.x - 26} ${b.y - dy * 0.35}, ${b.x} ${b.y}`;
      } else {
        // leave each stop downward, swing across, arrive from above: a subway line, not a zig-zag
        const sw = Math.abs(b.x - a.x) < 4 ? (i % 2 ? 70 : -70) : 0;
        d += ` C ${a.x + sw} ${a.y + dy * 0.45}, ${b.x - sw} ${b.y - dy * 0.45}, ${b.x} ${b.y}`;
      }
    }
    base.setAttribute('d', d);
    line.setAttribute('d', d);
    total = line.getTotalLength();
    line.style.strokeDasharray = `${total} ${total}`;
    table = [];
    for (let l = 0; l <= total; l += 6) table.push([l, line.getPointAtLength(l).y]);
    table.push([total, line.getPointAtLength(total).y]);
    nodes.forEach((n) => { n._len = lenAtY(anchor(n).y); });
    top = wrap.getBoundingClientRect().top + scrollY;
    update(true);
  }

  function lenAtY(y) {
    let lo = 0, hi = table.length - 1;
    if (y <= table[0][1]) return 0;
    if (y >= table[hi][1]) return total;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; table[m][1] < y ? (lo = m) : (hi = m); }
    const [l0, y0] = table[lo], [l1, y1] = table[hi];
    return l0 + (l1 - l0) * ((y - y0) / Math.max(1e-6, y1 - y0));
  }

  function update(force) {
    if (!total) return;
    const head = reduce ? total : lenAtY(scrollY + innerHeight * 0.62 - top);
    if (!force && Math.abs(head - lastLen) < 0.5) return;
    line.style.strokeDashoffset = total - head;
    const p = line.getPointAtLength(head);
    const q = line.getPointAtLength(Math.min(total, head + 2));
    const dir = q.x - p.x;
    if (Math.abs(dir) > 0.2) walker.classList.toggle('flip', dir < 0);
    walker.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    walker.classList.toggle('moving', Math.abs(head - lastLen) > 1 && head > 0 && head < total);
    walker.classList.toggle('arrived', head >= total - 1);
    clearTimeout(update._t);
    update._t = setTimeout(() => walker.classList.remove('moving'), 160);
    nodes.forEach((n) => n.classList.toggle('on', head >= n._len - 2));
    lastLen = head; lastX = p.x;
  }

  addEventListener('scroll', () => update(), { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 120); });
  if (document.fonts) document.fonts.ready.then(build);
  addEventListener('load', build);
  window.__route = { build, update };
  build();
})();
