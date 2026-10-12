// Ortak hareket dili (TripWalkers sayfasıyla aynı gramer): Lenis ağırlığı, maskeden çıkan başlık,
// kaydırdıkça yanan manifesto, sayaçlar, mıknatıs düğme. Hero oyuncağı her ürünün hero.js'inde.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const man = document.querySelector('[data-manifesto]');
  if (man) {
    const wrap = (node, hot) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t.trim()) { frag.append(t); return; }
            const s = document.createElement('span');
            s.className = 'w' + (hot ? ' hot' : ''); s.textContent = t; frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n, hot || n.classList.contains('hot'));
      });
    };
    wrap(man, false);
  }

  const LOC = document.documentElement.lang === 'tr' ? 'tr-TR' : 'en-US';
  const fmt = (v) => Math.round(v).toLocaleString(LOC);
  const setFinal = (el) => { el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || ''); };

  if (reduce || !window.gsap) {
    $$('[data-count]').forEach(setFinal);
    $$('.manifesto .w').forEach((w) => w.classList.add('lit'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: -40, duration: 1.0 });
    }));
  }

  // giriş kısa tutuldu (hakem: 150–400 ms ölçütü); başlık maskeden çıkar, gerisi arkasından
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('[data-hero-line]', { yPercent: 110, duration: 0.6, stagger: 0.08 })
    .from('[data-hero]', { y: 16, opacity: 0, duration: 0.4, stagger: 0.05 }, 0.2)
    .from('[data-hero-phone]', { y: 160, opacity: 0, duration: 0.7 }, 0.15);

  gsap.to('[data-hero-phone]', { y: 120, rotateX: 16, ease: 'none', transformPerspective: 1200, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });

  if (man) {
    const words = $$('.manifesto .w');
    ScrollTrigger.create({
      trigger: man, start: 'top 78%', end: 'bottom 45%', scrub: true,
      onUpdate: (s) => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('lit', i < n)); },
    });
  }

  $$('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    gsap.from(el, { y: 18, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  $$('.stop .visual .phone').forEach((p) => {
    gsap.fromTo(p, { y: 70 }, { y: -50, ease: 'none', scrollTrigger: { trigger: p.closest('.stop'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.fromTo(o, { v: 0 }, { v: end, duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v) + (el.dataset.suffix || '')), onComplete: () => setFinal(el) }),
    });
  });

  gsap.from('.finale h2', { scale: 0.94, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '.finale', start: 'top 70%' } });

  if (fine) {
    $$('.magnetic').forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
})();
