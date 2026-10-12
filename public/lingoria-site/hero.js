// Lingoria hero — deyim yağmuru. İngilizce deyim kartları düşer, zemine ve telefona çarpıp yığılır.
// Kartı tut, fırlat: bırakınca döner ve anlamı görünür. Basit 2B fizik (dikdörtgen çarpışma, açı yalnız görüntü).
// Yığın yüksekliği sınırlı (PILE): kartlar yazının üstüne kule yapmasın diye fazlası yana kayıp yere iner.
// Hareket azaltılmışsa kartlar hazır yığın olarak durur, dokununca yalnız anlam döner.
(() => {
  const world = document.querySelector('[data-idiom-world]');
  if (!world) return;
  const hero = world.closest('.hero');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let data = [];
  try { data = JSON.parse(world.dataset.idioms); } catch { return; }

  const G = 2200, cards = [];
  let PILE = 170, W, H, mobile, running = false, last = 0, spawnQ = [];

  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // zemin = ilk ekranın altı (hero ekrandan uzun olabilir; yığın görünmeyen yerde kalmasın)
  function measure() { const r = world.getBoundingClientRect(); W = r.width; H = Math.min(r.height, innerHeight); mobile = W < 760; }

  function make(d, i) {
    const el = document.createElement('div');
    el.className = 'ic' + (i % 4 === 1 ? ' alt' : i % 4 === 3 ? ' cream' : '');
    el.innerHTML = '<span class="e"></span><span class="m"></span>';
    el.firstChild.textContent = d.en; el.lastChild.textContent = d.m;
    el.style.transform = 'translate3d(-9999px,0,0)';
    world.append(el);
    const c = { el, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, tilt: (Math.random() - 0.5) * 8, w: el.offsetWidth, h: el.offsetHeight, held: false, flipT: 0 };
    return c;
  }
  // kartlar yazı bloğunun altından doğar: açılışta başlığın üstünden geçmesinler (hakem 2. tur)
  const spawnY = () => { const cp = hero.querySelector('.copy'); return cp ? cp.getBoundingClientRect().bottom - world.getBoundingClientRect().top + 8 : 0; };
  function drop(c) {
    c.x = Math.random() * Math.max(1, W - c.w); c.y = Math.min(spawnY(), H - c.h - 60) - Math.random() * 30;
    c.el.animate([{ opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }], { duration: reduce ? 0 : 260, easing: 'ease-out' });
    c.vx = (Math.random() - 0.5) * 160; c.vy = 0; c.rot = (Math.random() - 0.5) * 50; c.vr = (Math.random() - 0.5) * 220;
    cards.push(c);
  }
  function resize(c) { const cx = c.x + c.w / 2; c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; c.x = cx - c.w / 2; }
  function flip(c, on) { c.el.classList.toggle('flip', on); resize(c); c.flipT = on ? 4 : 0; }

  function collide(a, b, bStatic) {
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ox <= 0 || oy <= 0 || a.ghost > 0 || b.ghost > 0) return;
    const aMov = !a.held, bMov = !bStatic && !b.held;
    if (!aMov && !bMov) return;
    const share = aMov && bMov ? 0.5 : 1;
    const floorPair = a.y + a.h > H - 3 && b.y + b.h > H - 3;
    if (oy < ox && !floorPair) {
      const aAbove = a.y + a.h / 2 < b.y + b.h / 2, s = aAbove ? -1 : 1;
      if (aMov) { a.y += s * oy * share; if (aAbove ? a.vy > 0 : a.vy < 0) { a.vy *= -0.15; a.vx *= 0.9; a.rest = aAbove; } }
      if (bMov) { b.y -= s * oy * share; if (!aAbove ? b.vy > 0 : b.vy < 0) { b.vy *= -0.15; b.vx *= 0.9; b.rest = !aAbove; } }
    } else {
      const aLeft = a.x + a.w / 2 < b.x + b.w / 2, s = aLeft ? -1 : 1;
      if (aMov) { a.x += s * ox * share; a.vx = s * Math.abs(a.vx) * 0.4; }
      if (bMov) { b.x -= s * ox * share; b.vx = -s * Math.abs(b.vx) * 0.4; }
    }
  }

  function step(dt) {
    if (spawnQ.length && (step.t = (step.t || 0) - dt) <= 0) { drop(spawnQ.shift()); step.t = 0.22; }
    for (const c of cards) {
      c.rest = false;
      if (c.ghost > 0) c.ghost -= dt;
      if (c.flipT > 0 && (c.flipT -= dt) <= 0 && !c.held) flip(c, false);
      if (c.held) continue;
      c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
      if (c.x < 0) { c.x = 0; c.vx = Math.abs(c.vx) * 0.5; }
      if (c.x + c.w > W) { c.x = W - c.w; c.vx = -Math.abs(c.vx) * 0.5; }
      if (c.y + c.h > H) { c.y = H - c.h; c.vy = c.vy > 260 ? -c.vy * 0.25 : 0; c.vx *= 0.86; c.rest = true; }
    }
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) collide(cards[i], cards[j], false);
      }
    }
    for (const c of cards) {
      if (c.held) continue;
      c.x = Math.max(0, Math.min(W - c.w, c.x));
      c.rot = Math.max(-28, Math.min(28, c.rot));
      if (c.y + c.h > H) c.y = H - c.h;
      if (c.rest && c.y < H - PILE && !(c.ghost > 0)) { c.ghost = 0.45; c.vx = (Math.random() < 0.5 ? -1 : 1) * (260 + Math.random() * 200); c.vy = -120; }
      if (c.rest) { c.vr *= 0.6; c.rot += (c.tilt - c.rot) * Math.min(1, dt * 10); if (Math.abs(c.vx) < 8) c.vx = 0; }
      else c.vr *= 0.995;
    }
  }
  function render() { for (const c of cards) c.el.style.transform = `translate3d(${c.x}px,${c.y}px,0) rotate(${c.rot}deg)`; }

  function loop(t) {
    if (!running) return;
    const dt = Math.min(0.033, (t - (last || t)) / 1000); last = t;
    step(dt); render();
    requestAnimationFrame(loop);
  }
  const start = () => { if (running) return; running = true; last = 0; requestAnimationFrame(loop); };
  const stop = () => { running = false; };

  function init() {
    measure();
    PILE = mobile ? 110 : 170;
    const n = mobile ? 5 : 10;
    shuffle(data.slice()).slice(0, n).forEach((d, i) => spawnQ.push(make(d, i)));
    if (reduce) {
      while (spawnQ.length) drop(spawnQ.shift());
      for (let i = 0; i < 600; i++) step(1 / 60);
      render();
    }
  }

  // #idioms bölümündeki erişilebilir kartlar: düğme, Enter/Space ile de döner
  document.querySelectorAll('.icard').forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')));

  // tut-fırlat (işaretçi olayları: fare + dokunma tek yol)
  let grab = null;
  world.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.ic'); if (!el) return;
    const c = cards.find((q) => q.el === el); if (!c) return;
    if (reduce) { flip(c, !el.classList.contains('flip')); render(); return; }
    e.preventDefault(); el.setPointerCapture(e.pointerId);
    const b = world.getBoundingClientRect();
    grab = { c, dx: e.clientX - b.left - c.x, dy: e.clientY - b.top - c.y, hist: [[e.clientX, e.clientY, performance.now()]], sx: e.clientX, sy: e.clientY };
    c.held = true; c.vx = c.vy = 0; el.classList.add('held');
  });
  world.addEventListener('pointermove', (e) => {
    if (!grab) return;
    const b = world.getBoundingClientRect(), c = grab.c;
    c.x = e.clientX - b.left - grab.dx; c.y = e.clientY - b.top - grab.dy;
    c.rot += ((e.clientX - grab.hist[grab.hist.length - 1][0]) * 0.4 - c.rot) * 0.2;
    grab.hist.push([e.clientX, e.clientY, performance.now()]); if (grab.hist.length > 6) grab.hist.shift();
    if (!running) render();
  });
  const release = (e) => {
    if (!grab) return;
    const c = grab.c, h = grab.hist, a = h[0], z = h[h.length - 1], dtm = Math.max(16, z[2] - a[2]);
    const moved = Math.hypot(e.clientX - grab.sx, e.clientY - grab.sy) > 6;
    c.held = false; c.el.classList.remove('held');
    if (moved) {
      c.vx = Math.max(-3200, Math.min(3200, ((z[0] - a[0]) / dtm) * 1000));
      c.vy = Math.max(-3200, Math.min(3200, ((z[1] - a[1]) / dtm) * 1000));
      c.vr = c.vx * 0.25;
      flip(c, true);
    } else { flip(c, !c.el.classList.contains('flip')); c.vy = -520; c.vr = (Math.random() - 0.5) * 400; }
    grab = null;
  };
  world.addEventListener('pointerup', release);
  // tarayıcı dikey kaydırmayı devraldı: kartı olduğu yerde bırak, fırlatma/çevirme yok
  world.addEventListener('pointercancel', () => { if (!grab) return; grab.c.held = false; grab.c.el.classList.remove('held'); grab = null; });

  // yazı tipi yüklenmeden ölçülen kart genişliği yanlış olur
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    init();
    if (reduce) return;
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : hero.getBoundingClientRect().bottom > 0 && start()));
  });
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { measure(); cards.forEach((c) => { c.x = Math.min(c.x, W - c.w); c.y = Math.min(c.y, H - c.h); }); if (reduce) render(); }, 150); });
})();
