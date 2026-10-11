(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // manifesto: split words once (also used by reduced motion — just no animation)
  const man = document.querySelector('[data-manifesto]');
  if (man) {
    const wrapWords = (node, hot) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t.trim()) { frag.append(t); return; }
            const s = document.createElement('span');
            s.className = 'w' + (hot ? ' hot' : ''); s.textContent = t; frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrapWords(n, hot || n.classList.contains('hot'));
      });
    };
    wrapWords(man, false);
  }

  const LOC = document.documentElement.lang === 'tr' ? 'tr-TR' : 'en-US';
  const fmt = (v, dec) => (dec ? v : Math.round(v)).toLocaleString(LOC, { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  const setFinal = (el) => { el.textContent = fmt(+el.dataset.count, +(el.dataset.dec || 0)); };

  if (reduce || !window.gsap) {
    $$('[data-count]').forEach(setFinal);
    $$('[data-gem]').forEach((g) => g.classList.add('open'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // smooth scroll — weight, not float
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

  // ---------- hero intro: the take-off ----------
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('[data-hero-line]', { yPercent: 110, duration: 1.3, stagger: 0.12 })
    .from('[data-hero]', { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.45)
    .from('.ghost', { opacity: 0, scale: 1.08, duration: 2.2 }, 0)
    .from('[data-phone="c"]', { y: 260, opacity: 0, duration: 1.6 }, 0.35)
    .from('[data-phone="l"]', { y: 320, x: 160, rotate: 0, opacity: 0, duration: 1.7 }, 0.5)
    .from('[data-phone="r"]', { y: 320, x: -160, rotate: 0, opacity: 0, duration: 1.7 }, 0.5)
    .from('[data-hero-rc]', { y: -260, rotate: -30, opacity: 0, duration: 1.1, ease: 'bounce.out' }, 1.0)
    .from('[data-chip]', { scale: 0.6, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'back.out(2)' }, 1.3);

  // hero exit: phones spread and sink as you leave, ghost drifts
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
    .to('.ghost', { yPercent: -40, opacity: 0.2, ease: 'none' }, 0)
    .to('[data-phone="c"]', { y: 120, rotateX: 18, ease: 'none' }, 0)
    .to('[data-phone="l"]', { x: -90, y: 160, ease: 'none' }, 0)
    .to('[data-phone="r"]', { x: 90, y: 160, ease: 'none' }, 0)
    .to('[data-hero-rc]', { y: 120, rotate: 20, opacity: 0, ease: 'none' }, 0)
    .to('[data-chip]', { opacity: 0, y: -40, ease: 'none' }, 0);

  // ---------- pain ----------
  const words = $$('.manifesto .w');
  ScrollTrigger.create({
    trigger: man, start: 'top 78%', end: 'bottom 45%', scrub: true,
    onUpdate: (s) => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('lit', i < n)); },
  });
  gsap.from('[data-tab]', {
    y: -90, opacity: 0, rotate: () => gsap.utils.random(-10, 10), stagger: 0.07, duration: 0.45, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.desk', start: 'top 75%' },
  });
  // one sigh when the pile lands, then still
  gsap.fromTo('[data-tired]', { y: 0, rotate: 0 }, { y: 8, rotate: -4, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1, delay: 0.6, scrollTrigger: { trigger: '.desk', start: 'top 75%' } });

  // ---------- generic reveals ----------
  $$('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    gsap.from(el, { y: 14, duration: 0.4, ease: 'power2.out', immediateRender: false, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  // phones drift against the scroll — depth without WebGL
  $$('[data-par]').forEach((v) => {
    const back = v.querySelector('.back'), front = v.querySelector('.front, .phone, .wrapped');
    gsap.fromTo(front, { y: 80 }, { y: -60, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (back) gsap.fromTo(back, { y: 140 }, { y: -20, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // reels: fly in from the feed, shrink into the phone
  const rv = document.querySelector('[data-reels]');
  if (rv) {
    gsap.timeline({ scrollTrigger: { trigger: rv, start: 'top 85%', end: 'center 45%', scrub: 0.8 } })
      .from('[data-reel]', { x: (i) => [-260, 260, -220][i], y: (i) => [-120, -160, 160][i], rotate: (i) => [-30, 28, 22][i], opacity: 0, stagger: 0.12, ease: 'power3.out' })
      .from(rv.querySelector('.phone'), { scale: 0.9, ease: 'power2.out' }, 0);
  }

  // hidden gem: veil slides off when it reaches you
  $$('[data-gem]').forEach((g) => {
    gsap.from(g, { y: 30, rotate: 10, opacity: 0, duration: 0.45, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%' } });
    ScrollTrigger.create({ trigger: g, start: 'top 60%', onEnter: () => g.classList.add('open'), onLeaveBack: () => g.classList.remove('open') });
    g.addEventListener('click', () => g.classList.toggle('open'));
  });

  // floating chips + crew pop in one by one
  $$('.visual').forEach((v) => {
    const pops = v.querySelectorAll('[data-pop]');
    if (!pops.length) return;
    gsap.from(pops, { scale: 0.8, x: -12, opacity: 0, duration: 0.35, stagger: 0.08, ease: 'back.out(1.6)', scrollTrigger: { trigger: v, start: 'top 70%' } });
  });

  // wrapped card: flips up like a story
  const wr = document.querySelector('[data-wrapped]');
  if (wr) gsap.from(wr, { rotateY: -20, rotateX: 8, scale: 0.94, opacity: 0, duration: 0.5, ease: 'power3.out', transformPerspective: 1000, scrollTrigger: { trigger: wr, start: 'top 80%' } });

  // count-ups
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.fromTo(o, { v: 0 }, { v: end, duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v, dec)), onComplete: () => setFinal(el) }),
    });
  });

  // finale headline grows in
  gsap.from('.finale h2', { scale: 0.94, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '.finale', start: 'top 70%' } });

  // ---------- pointer craft (mouse only) ----------
  if (fine) {
    $$('.plan').forEach((c) => c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
    $$('.magnetic').forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
    const stage = document.querySelector('.stage');
    addEventListener('pointermove', (e) => {
      if (scrollY > innerHeight) return;
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      gsap.to(stage, { rotateY: dx * 6, rotateX: -dy * 5, duration: 1.2, ease: 'power3.out' });
    });
  }

  // route depends on layout after fonts/images settle
  ScrollTrigger.addEventListener('refresh', () => window.__route && window.__route.build());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
