// Yol, kademe, ders ve sınav ekranları.
import { progress, PASS_MARK } from './stores.js';
import { Fmt, up } from './fmt.js';
import { generate } from './questions.js';
import { SplitMix, randomSeed } from './rng.js';
import { h, label, stamp, card, primary, ghost, icon, iconButton, go, live, confirmDialog, focusTitle } from './ui.js';
import { renderBlock, isVisual, questionCard } from './blocks.js';
import { labDrawer } from './lab.js';

export const WIDE = matchMedia('(min-width: 1100px)');

const nextCard = (app) => {
  const next = progress.nextLesson(app.units);
  if (next) {
    const [u, l] = next;
    return h('a', { class: 'next-card', href: `#/ders/${l.id}` },
      h('div', { class: 'next-meta' }, `SIRADAKİ · KADEME ${u.order} · ${u.lessons.indexOf(l) + 1}/${u.lessons.length} · ${l.minutes} DK`),
      h('div', { class: 'next-title' }, up(l.title)),
      h('div', { class: 'next-goal' }, l.goal),
      h('div', { class: 'next-go' }, 'Derse başla', icon('ileri')));
  }
  const unit = app.units.find((u) => !progress.examPassed(u));
  if (unit) {
    return h('a', { class: 'next-card', href: `#/sinav/${unit.id}` },
      h('div', { class: 'next-meta' }, 'SIRADAKİ · KADEME SINAVI'),
      h('div', { class: 'next-title' }, up(unit.title)),
      h('div', { class: 'next-goal' }, unit.order >= 8 ? '%80 ile yolu bitirirsin.' : '%80 ile sonraki kademe açılır.'),
      h('div', { class: 'next-go' }, 'Sınava gir', icon('ileri')));
  }
  return stamp('USTA', 'brand', 'xl');
};

function subtitle(u, open, done, passed) {
  if (!open) return 'Önceki kademenin sınavıyla açılır';
  const best = progress.data.examBest[u.id];
  return `${done}/${u.lessons.length} ders${best !== undefined ? ` · sınav ${Fmt.pct(best)}` : ''}${passed ? ' · geçti' : ''}`;
}

function unitRow(u, app, selected) {
  const open = progress.isUnlocked(u, app.units);
  const done = progress.doneCount(u);
  const passed = progress.examPassed(u);
  const body = [
    h('span', { class: `rung ${passed ? 'is-passed' : open ? 'is-open' : 'is-locked'}` }, 'K', h('b', null, String(u.order))),
    h('span', { class: 'row-t' }, h('span', { class: 'row-title' }, u.title), h('span', { class: 'row-sub' }, subtitle(u, open, done, passed))),
    icon(open ? 'ileri' : 'kilit', 'c-dim'),
  ];
  if (!open) return h('div', { class: 'row is-locked-row', 'aria-disabled': 'true' }, body);
  return h('a', { class: `row ${open && !passed ? 'is-current' : ''} ${selected ? 'is-selected' : ''}`, href: `#/yol/${u.id}`, 'aria-current': selected ? 'true' : null }, body);
}

function unitDetail(u) {
  const allDone = progress.doneCount(u) === u.lessons.length;
  return h('div', { class: 'stack' },
    h('h2', { class: 'd-lg' }, up(u.title)),
    label(`Kademe ${u.order} · ${u.lessons.length} ders`),
    h('p', { class: 't-lead' }, u.tagline),
    h('div', { class: 'stack-s' }, u.lessons.map((l, i) => {
      const done = progress.isDone(l.id);
      return h('a', { class: 'row', href: `#/ders/${l.id}` },
        h('span', { class: `lesson-n ${done ? 'is-done' : ''}` }, String(i + 1)),
        h('span', { class: 'row-t' }, h('span', { class: 'row-title' }, l.title), h('span', { class: 'row-sub' }, `${l.minutes} dk · ${l.pages.length} sayfa · ${l.quiz.length} soru`)),
        icon(done ? 'tik' : 'ileri', done ? 'c-profit' : 'c-dim'));
    })),
    card({ class: 'exam-card' },
      h('div', { class: 'd-sm' }, 'KADEME SINAVI'),
      h('p', { class: 't-card' }, `12 soru: havuzdan rastgele 8 soru + rakamları her girişte değişen 4 hesap sorusu. %80 ve üstü ${u.order >= 8 ? 'yolu bitirir' : 'sonraki kademeyi açar'}.${allDone ? '' : ' Önce dersleri bitirmen önerilir.'}`),
      ghost('Sınava gir', () => go(`#/sinav/${u.id}`), 'wide brand-line')));
}

export function pathView(app, unitId) {
  const units = app.units;
  const current = units.find((u) => progress.isUnlocked(u, units) && !progress.examPassed(u)) ?? units[units.length - 1];
  const chosen = units.find((u) => u.id === unitId && progress.isUnlocked(u, units));
  const selected = chosen ?? current;
  const fresh = progress.data.completedLessons.length === 0 && !progress.data.unlockAll;
  return h('div', { class: `path ${chosen ? 'has-unit' : ''}` },
    h('section', { class: 'path-master stack' },
      h('h1', { class: 'd-xl' }, 'SIFIRDAN', h('br'), 'USTAYA'),
      nextCard(app),
      h('div', { class: 'stack-s' }, units.map((u) => unitRow(u, app, u === selected))),
      fresh && h('div', { class: 'phone-note' },
        h('p', null, 'Telefonda ilerledin mi? Web ilerlemesi telefonla paylaşılmaz, burada baştan başlar.'),
        h('button', { type: 'button', class: 'link', onclick: () => { progress.setUnlockAll(true); app.render(); } }, 'Tüm kademeleri aç')),
      h('p', { class: 'foot' }, 'Bu uygulama eğitim içindir, yatırım tavsiyesi değildir. Örneklerdeki fiyatlar modelden üretilmiştir.')),
    h('section', { class: 'path-detail' },
      chosen && h('a', { class: 'back only-narrow', href: '#/yol' }, icon('geri'), 'Yol'),
      unitDetail(selected)));
}

function pageLayout(lesson, index, ctx, wide) {
  const blocks = lesson.pages[index].blocks;
  const title = index === 0 && h('header', { class: 'lesson-title' },
    h('h1', { class: 'd-xl' }, up(lesson.title)),
    h('p', { class: 'goal' }, icon('hedef', 'c-brand'), lesson.goal));
  const hasVisual = blocks.some(isVisual);
  const hasText = blocks.some((b) => !isVisual(b));
  if (wide && hasVisual && hasText) {
    return h('div', { class: 'lesson-page' }, title,
      h('div', { class: 'two-col' },
        h('div', { class: 'col-text' }, blocks.filter((b) => !isVisual(b)).map((b) => renderBlock(b, ctx))),
        h('div', { class: 'col-vis' }, blocks.filter(isVisual).map((b) => renderBlock(b, ctx)))));
  }
  return h('div', { class: 'lesson-page narrow' }, title, h('div', { class: 'col-text' }, blocks.map((b) => renderBlock(b, ctx))));
}

export function lessonView(app, lessonId) {
  const found = app.findLesson(lessonId);
  if (!found) return null;
  const [unit, lesson] = found;
  progress.markOpened(lesson.id);
  const initial = Number(new URLSearchParams(location.hash.split('?')[1] ?? '').get('s') ?? 0);
  const quizStart = lesson.pages.length;
  const total = lesson.pages.length + lesson.quiz.length + 1;
  let index = Number.isInteger(initial) && initial >= 0 && initial < total ? initial : 0;
  const answers = {};
  const picks = {};
  const drillResults = {};
  let drillNext = null;
  let drillStarted = false;
  let drawer = null;

  const isDone = () => index === total - 1;
  const isQuiz = () => index >= quizStart && !isDone();
  const pageHasDrill = () => index < quizStart && lesson.pages[index].blocks.some((b) => b.t === 'drill');

  const closeLesson = () => go(`#/yol/${unit.id}`);
  const bar = h('div', { class: 'progress-bar', role: 'progressbar', 'aria-valuenow': index + 1, 'aria-valuemin': 1, 'aria-valuemax': total });
  const hintQuestion = h('span', { class: 'hint-q' }, h('kbd', null, '1–4'), ' şık · ');
  const main = h('main', { class: 'lesson-main', id: 'lesson-main', tabindex: '-1' });
  const foot = h('footer', { class: 'lesson-foot' });

  const footerTitle = () => {
    if (isDone()) return 'Yola dön';
    if (isQuiz()) return answers[index - quizStart] === undefined ? 'Bir cevap seç' : 'Devam';
    return index === quizStart - 1 ? 'Mini sınava geç' : 'Devam';
  };
  const canAdvance = () => !isQuiz() || answers[index - quizStart] !== undefined;

  const paintBar = () => {
    bar.setAttribute('aria-valuenow', index + 1);
    bar.setAttribute('aria-label', `İlerleme ${index + 1} / ${total}`);
    bar.replaceChildren(...Array.from({ length: total }, (_, i) => h('i', { class: i <= index ? 'on' : '' })));
  };

  const paintFoot = () => {
    const kids = [];
    if (index > 0 && !isDone() && !drillStarted) kids.push(iconButton('geri', 'Önceki sayfa', () => step(-1), 'foot-back'));
    const inProgress = pageHasDrill() && drillResults[index] === undefined;
    const retry = pageHasDrill() && drillResults[index]?.isSolid === false;
    if (drillNext) kids.push(primary(drillNext.title, drillNext.action));
    else if (inProgress || retry) kids.push(h('button', { type: 'button', class: 'btn-quiet', onclick: advance }, inProgress ? 'Antrenmanı atla' : footerTitle()));
    else kids.push(primary(footerTitle(), advance, { enabled: canAdvance() }));
    foot.replaceChildren(h('div', { class: 'foot-inner' }, kids));
  };

  const drillLink = (page) => ({
    saved: drillResults[page],
    onFinished: (r) => { drillResults[page] = r; paintFoot(); },
    onRestart: () => { delete drillResults[page]; paintFoot(); },
    onStartedChange: (v) => { drillStarted = v; paintFoot(); },
    onNextReady: (n) => { drillNext = n; paintFoot(); },
  });

  const openLab = (preset) => {
    drawer?.close();
    drawer = labDrawer(preset, () => { drawer = null; });
  };

  const paintMain = () => {
    if (index < quizStart) {
      main.replaceChildren(pageLayout(lesson, index, { openLab, drillLink: drillLink(index) }, WIDE.matches));
    } else if (isQuiz()) {
      const qi = index - quizStart;
      main.replaceChildren(h('div', { class: 'lesson-page narrow' }, h('div', { class: 'col-text' },
        h('h1', { class: 'd-md' }, `SORU ${qi + 1} / ${lesson.quiz.length}`),
        questionCard(lesson.quiz[qi], { label: 'Mini sınav', initial: picks[qi] ?? null, onAnswer: (ok, i) => { answers[qi] = ok; picks[qi] = i; paintFoot(); } }))));
    } else {
      const correct = Object.values(answers).filter(Boolean).length;
      main.replaceChildren(h('div', { class: 'done' },
        stamp(`${correct} / ${lesson.quiz.length}`, correct === lesson.quiz.length ? 'profit' : 'brand', 'xl pop'),
        h('h1', { class: 'd-lg' }, 'Ders bitti.'),
        h('p', { class: 't-lead' }, `Mini sınavda ${correct} doğru.`),
        h('p', { class: 't-dim' }, 'Bu dersin soruları 3, 7, 21 ve 60 gün sonra tekrar karşına çıkacak. Unutmamanın yolu bu.'),
        correct < lesson.quiz.length && h('p', { class: 't-card' }, 'Yanlış yaptığın sorular yarın Pratik sekmesinde seni bekliyor.')));
    }
    main.scrollTop = 0;
    main.focus({ preventScroll: true });
  };

  const paint = () => {
    paintBar();
    paintMain();
    paintFoot();
    hintQuestion.hidden = !main.querySelector('.qcard');
    if (index < quizStart) history.replaceState(null, '', `#/ders/${lesson.id}${index ? `?s=${index}` : ''}`);
  };

  function step(d) {
    index = Math.max(0, Math.min(total - 1, index + d));
    drillNext = null;
    drillStarted = false;
    paint();
  }

  function advance() {
    if (isDone()) { closeLesson(); return; }
    if (index === total - 2) {
      const correct = Object.values(answers).filter(Boolean).length;
      const missed = lesson.quiz.map((_, i) => i).filter((i) => answers[i] === false);
      progress.finishLesson(lesson.id, lesson.quiz.length ? correct / lesson.quiz.length : 1, missed);
      progress.scheduleLesson(lesson.id, lesson.quiz.length, missed);
    }
    step(1);
  }

  const onKey = (e) => {
    if (document.querySelector('dialog[open]')) return;
    if (e.key === 'Escape') {
      if (drawer) { drawer.close(); return; }
      closeLesson();
      return;
    }
    if (drawer || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t.matches?.('input,textarea,select,[role="slider"]')) return;
    const onControl = t.matches?.('button,a');
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && !onControl)) {
      const btn = foot.querySelector('.btn-primary:not([disabled])');
      if (btn) { e.preventDefault(); btn.click(); }
    } else if (e.key === 'ArrowLeft') {
      if (index > 0 && !isDone() && !drillStarted) { e.preventDefault(); step(-1); }
    } else if (/^[1-4]$/.test(e.key)) {
      const open = main.querySelector('.qcard:not(.answered)');
      if (open) { e.preventDefault(); open.pick(Number(e.key) - 1); }
    }
  };

  const onWide = () => { if (index < quizStart) paintMain(); };

  const el = h('div', { class: 'lesson' },
    h('header', { class: 'lesson-head' },
      h('div', { class: 'head-row' },
        label(`Kademe ${unit.order} · ders ${unit.lessons.indexOf(lesson) + 1} / ${unit.lessons.length}`),
        h('span', { class: 'key-hint only-hover' }, h('kbd', null, '←'), h('kbd', null, '→'), ' sayfa · ', hintQuestion, h('kbd', null, 'Esc'), ' kapat'),
        iconButton('kapat', 'Dersi kapat', closeLesson)),
      bar),
    main, foot);

  document.addEventListener('keydown', onKey);
  WIDE.addEventListener('change', onWide);
  el.cleanup = () => {
    document.removeEventListener('keydown', onKey);
    WIDE.removeEventListener('change', onWide);
    drawer?.close();
  };
  paint();
  return el;
}

export function examView(app, unitId) {
  const unit = app.units.find((u) => u.id === unitId);
  if (!unit) return null;
  const seed = randomSeed();
  const rng = new SplitMix(seed);
  const questions = rng.shuffle([
    ...rng.shuffle(unit.exam).slice(0, 8),
    ...generate({ level: unit.order, count: 4, seed: seed + 1n, preferLevel: unit.order }),
  ]);
  let index = 0;
  const answers = {};
  let finished = false;
  const score = () => (questions.length ? Object.values(answers).filter(Boolean).length / questions.length : 0);

  const leave = () => {
    const back = () => go(`#/yol/${unit.id}`);
    if (finished || Object.keys(answers).length === 0) back();
    else confirmDialog('Sınavdan çıkarsan cevapların sayılmaz.', 'Sınavdan çık', back);
  };
  const onKey = (e) => {
    if (document.querySelector('dialog[open]')) return;
    if (e.key === 'Escape') { e.preventDefault(); leave(); return; }
    if (e.target.matches?.('input,textarea')) return;
    if (/^[1-4]$/.test(e.key)) host.querySelector('.qcard:not(.answered)')?.pick(Number(e.key) - 1);
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && !e.target.matches?.('button,a'))) host.querySelector('.btn-primary:not([disabled])')?.click();
  };

  const host = live((redraw) => {
    if (finished) {
      const ok = score() >= PASS_MARK;
      return h('div', { class: 'exam' }, h('div', { class: 'done' },
        stamp(ok ? 'GEÇTİ' : 'TEKRAR', ok ? 'profit' : 'loss', 'xl pop'),
        h('h1', { class: 'd-huge' }, Fmt.pct(score())),
        h('p', { class: 't-lead' }, ok ? (unit.order >= 8 ? 'Bütün kademeleri bitirdin. Sırada Masa\'daki sahaya çıkış kapısı var.' : 'Sonraki kademe açıldı.') : '%80 gerekiyor. Bu kademenin derslerine dön, sonra yeni sorularla tekrar dene.'),
        primary(ok ? 'Yola dön' : 'Derslere dön', () => go(`#/yol/${unit.id}`)),
        !ok && ghost('Tekrar dene', () => app.render(), 'wide')));
    }
    const nextBtn = primary('Bir cevap seç', () => {
      if (index + 1 < questions.length) index += 1;
      else { progress.recordExam(unit.id, score()); finished = true; }
      redraw();
      focusTitle(host);
      scrollTo(0, 0);
    }, { enabled: false });
    return h('div', { class: 'exam' },
      h('div', { class: 'head-row' }, label(`${unit.title} · sınav`), iconButton('kapat', 'Sınavı kapat', leave)),
      h('h1', { class: 'd-md' }, `SORU ${index + 1} / ${questions.length}`),
      questionCard(questions[index], {
        label: 'Sınav',
        onAnswer: (ok) => { answers[index] = ok; nextBtn.disabled = false; nextBtn.textContent = index + 1 < questions.length ? 'Devam' : 'Sonucu gör'; },
      }),
      nextBtn);
  });
  document.addEventListener('keydown', onKey);
  host.cleanup = () => document.removeEventListener('keydown', onKey);
  return host;
}
