// BlokBom! hero — blok yağmuru. Oyunun parçaları yukarıdan düşer, boşluk bırakmadan en alçak yere yerleşir,
// satır GERÇEKTEN dolunca patlar (zorla patlatma yok — hakem 12.10). Zemin = ilk ekranın altı, patlama görünür.
// Dokununca o sütuna parça düşer. Hareket azaltılmışsa tek kare statik tahta çizilir.
(() => {
  const cv = document.querySelector('[data-blocks]');
  if (!cv) return;
  const hero = cv.closest('.hero');
  const scoreEl = document.querySelector('[data-score]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = cv.getContext('2d');
  const COLORS = ['#A78BFA', '#F472B6', '#38BDF8', '#34D399', '#FB923C', '#FFD23F'];
  // [x, y] — y=0 parçanın alt satırı; her satırda en az bir hücre var (temizlemede kayma güvenli)
  const SHAPES = [
    [[0, 0]], [[0, 0], [1, 0]], [[0, 0], [1, 0], [2, 0]], [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [2, 0], [0, 1], [1, 1]],
  ];

  let floorY, resetT = 0, W, H, dpr, cell, cols, offX, maxRows, grid, falling, flashes, parts, sprites, score = 0, shown = 0, spawnT = 0, running = false, last = 0;
  const mobile = () => W < 760;

  function sprite(color) {
    const s = Math.round(cell * dpr), c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d'), p = Math.max(1.5, s * 0.05), r = s * 0.18, w = s - p * 2;
    const grad = g.createLinearGradient(0, p, 0, s - p);
    grad.addColorStop(0, shade(color, 0.22)); grad.addColorStop(1, shade(color, -0.12));
    g.fillStyle = grad; g.beginPath(); g.roundRect(p, p, w, w, r); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.38)'; g.lineWidth = Math.max(1, s * 0.035);
    g.beginPath(); g.moveTo(p + r, p + g.lineWidth); g.lineTo(s - p - r, p + g.lineWidth); g.stroke();
    g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(p + r * 0.6, s - p - s * 0.1, w - r * 1.2, s * 0.06);
    return c;
  }
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16), f = (v) => Math.max(0, Math.min(255, Math.round(v + (k > 0 ? (255 - v) * k : v * k))));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  }

  function setup() {
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height; floorY = Math.min(H, innerHeight); dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cell = mobile() ? 28 : 40;
    cols = Math.floor(W / cell); offX = (W - cols * cell) / 2;
    maxRows = Math.max(5, Math.floor((floorY * (mobile() ? 0.26 : 0.3)) / cell));
    grid = []; falling = []; flashes = []; parts = [];
    sprites = COLORS.map(sprite);
    for (let i = 0; i < cols * 1.1; i++) instantDrop();
    draw(0);
  }

  const height = (c) => { for (let r = grid.length - 1; r >= 0; r--) if (grid[r][c]) return r + 1; return 0; };
  const widthOf = (sh) => Math.max(...sh.map((p) => p[0])) + 1;
  const topOf = (sh) => Math.max(...sh.map((p) => p[1]));
  const landRowAt = (sh, col) => Math.max(...sh.map(([dx, dy]) => height(col + dx) - dy));

  // otomatik yerleşim: birkaç rastgele parçayı her sütunda dener; altında boşluk (delik) bırakmayan,
  // en alçak yeri seçer → satırlar kendiliğinden dolar. Dokunulan sütunda ise parça olduğu gibi düşer.
  const holesAt = (sh, col, lr) => {
    let n = 0;
    for (let x = 0; x < widthOf(sh); x++) {
      const ys = sh.filter((p) => p[0] === x).map((p) => p[1]);
      n += lr + Math.min(...ys) - height(col + x);
    }
    return n;
  };
  function pick(hint) {
    const color = (Math.random() * COLORS.length) | 0;
    if (hint != null) {
      const sh = SHAPES[(Math.random() * SHAPES.length) | 0];
      return { sh, col: Math.max(0, Math.min(cols - widthOf(sh), hint)), color };
    }
    const pool = [SHAPES[0], SHAPES[1]];
    for (let i = 0; i < 4; i++) pool.push(SHAPES[(Math.random() * SHAPES.length) | 0]);
    let best = null, opts = [];
    for (const sh of pool) for (let c = 0; c <= cols - widthOf(sh); c++) {
      const lr = landRowAt(sh, c), k = holesAt(sh, c, lr) * 100 + lr * 4 - sh.length;
      if (best === null || k < best) { best = k; opts = [{ sh, col: c }]; } else if (k === best) opts.push({ sh, col: c });
    }
    const o = opts[(Math.random() * opts.length) | 0];
    return { sh: o.sh, col: o.col, color };
  }
  function reserve(p) {
    p.landRow = landRowAt(p.sh, p.col);
    for (const [dx, dy] of p.sh) {
      const r = p.landRow + dy;
      while (grid.length <= r) grid.push(new Array(cols).fill(null));
      grid[r][p.col + dx] = { c: p.color, landed: false, p };
    }
  }
  function settle(p) {
    for (const [dx, dy] of p.sh) { const cellObj = grid[p.landRow + dy][p.col + dx]; if (cellObj) cellObj.landed = true; }
    score += p.sh.length;
    checkRows();
  }
  function instantDrop() { const p = pick(); reserve(p); settle(p); flushFlashes(true); }

  function checkRows() {
    grid.forEach((row) => {
      if (row.every((c) => c && c.landed) && !flashes.some((f) => f.row === row)) flashes.push({ row, t: 0 });
    });
    // dokunuşlarla delik kalıp tahta taşarsa: zorla satır patlatmak yerine tahta sönüp baştan başlar
    if (!resetT && Math.max(0, ...Array.from({ length: cols }, (_, c) => height(c))) > maxRows) resetT = 0.6;
  }
  function removeRow(row) {
    const r = grid.indexOf(row);
    if (r < 0) return;
    const y = floorY - (r + 1) * cell;
    row.forEach((c, i) => { if (c && Math.random() < (mobile() ? 0.9 : 0.5)) burst(offX + i * cell + cell / 2, y + cell / 2, c.c); });
    grid.splice(r, 1);
    falling.forEach((p) => { if (p.landRow > r) p.landRow -= 1; });
    score += cols * 10;
    if (scoreEl) { scoreEl.classList.remove('pop'); void scoreEl.offsetWidth; scoreEl.classList.add('pop'); }
  }
  function flushFlashes(all) {
    flashes = flashes.filter((f) => { if (all || f.t >= 0.42) { removeRow(f.row); return false; } return true; });
  }
  function burst(x, y, c) {
    for (let i = 0; i < 2; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 520, vy: -Math.random() * 520 - 120, life: 0.9, c, s: cell * (0.25 + Math.random() * 0.25) });
  }

  function spawn(hint) {
    const p = pick(hint);
    reserve(p);
    p.y = -(topOf(p.sh) + 1) * cell - Math.random() * 120; p.vy = hint != null ? 700 : 160 + Math.random() * 160;
    falling.push(p);
  }

  function step(dt) {
    spawnT -= dt;
    const gap = mobile() ? 0.5 : 0.3;
    if (!resetT && spawnT <= 0 && falling.length < (mobile() ? 2 : 4)) { spawn(); spawnT = gap * (0.7 + Math.random() * 0.6); }
    falling = falling.filter((p) => {
      p.vy = Math.min(p.vy + 2400 * dt, 2200); p.y += p.vy * dt;
      const target = floorY - p.landRow * cell;
      if (p.y >= target) { p.y = target; settle(p); return false; }
      return true;
    });
    if (resetT > 0 && (resetT -= dt) <= 0) { resetT = 0; grid = []; falling = []; flashes = []; }
    flashes.forEach((f) => (f.t += dt));
    flushFlashes(false);
    parts = parts.filter((q) => { q.vy += 1400 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt; return q.life > 0; });
    if (scoreEl && shown !== score) { shown += Math.max(1, Math.ceil((score - shown) * 0.2)); if (shown > score) shown = score; scoreEl.textContent = shown.toLocaleString(document.documentElement.lang); }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = resetT > 0 ? resetT / 0.6 : 1;
    for (let r = 0; r < grid.length; r++) {
      const y = floorY - (r + 1) * cell, row = grid[r];
      for (let c = 0; c < cols; c++) { const o = row[c]; if (o && o.landed) ctx.drawImage(sprites[o.c], offX + c * cell, y, cell, cell); }
      const f = flashes.find((q) => q.row === row);
      if (f) { ctx.fillStyle = `rgba(255,255,255,${0.85 * Math.sin(Math.min(1, f.t / 0.42) * Math.PI)})`; ctx.fillRect(offX, y + 2, cols * cell, cell - 4); }
    }
    for (const p of falling) for (const [dx, dy] of p.sh) ctx.drawImage(sprites[p.color], offX + (p.col + dx) * cell, p.y - (dy + 1) * cell, cell, cell);
    ctx.globalAlpha = 1;
    for (const q of parts) { ctx.globalAlpha = Math.max(0, q.life / 0.9); ctx.drawImage(sprites[q.c], q.x - q.s / 2, q.y - q.s / 2, q.s, q.s); }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    step(dt); draw();
    requestAnimationFrame(loop);
  }
  const start = () => { if (running || reduce) return; running = true; last = 0; requestAnimationFrame(loop); };
  const stop = () => { running = false; };

  setup();
  if (scoreEl) scoreEl.textContent = (shown = score).toLocaleString(document.documentElement.lang);
  if (reduce) return;

  new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : hero.getBoundingClientRect().bottom > 0 && start()));
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const r = hero.getBoundingClientRect();
    spawn(Math.floor((e.clientX - r.left - offX) / cell));
  });
  let rt, lastW = W;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (Math.abs(hero.getBoundingClientRect().width - lastW) > 40) { lastW = hero.getBoundingClientRect().width; setup(); } }, 200); });
})();
