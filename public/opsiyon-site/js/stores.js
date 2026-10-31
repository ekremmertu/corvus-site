// İlerleme, günlük ve vaka kararları tarayıcıda durur (localStorage); sunucuya gitmez.
import { Fmt } from './fmt.js';
import { Strategy } from './math.js';

const KEYS = { progress: 'opsiyon.progress.v1', journal: 'opsiyon.journal.v1', cases: 'opsiyon.cases.v1' };
const DAY = 86_400_000;

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null'); } catch { return null; }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    if (typeof dispatchEvent === 'function') dispatchEvent(new Event('opsiyon-kayit-hatasi'));
    return false;
  }
}

const nowMs = () => Date.now();

export const PASS_MARK = 0.8;
const INTERVALS = [1, 3, 7, 21, 60];

const emptyProgress = () => ({
  completedLessons: [], quizScores: {}, examBest: {}, missed: [], lastLessonID: null,
  unlockAll: false, reviews: {}, ticketCorrect: 0, ticketTotal: 0,
});

export const progress = {
  data: { ...emptyProgress(), ...(read(KEYS.progress) ?? {}) },
  save() { write(KEYS.progress, this.data); },
  isUnlocked(unit, units) {
    if (this.data.unlockAll || unit.order === 0) return true;
    const prev = units.find((u) => u.order === unit.order - 1);
    return !prev || (this.data.examBest[prev.id] ?? 0) >= PASS_MARK;
  },
  isDone(id) { return this.data.completedLessons.includes(id); },
  doneCount(unit) { return unit.lessons.filter((l) => this.isDone(l.id)).length; },
  examPassed(unit) { return (this.data.examBest[unit.id] ?? 0) >= PASS_MARK; },
  markOpened(id) { this.data.lastLessonID = id; this.save(); },
  finishLesson(id, score, missedIdx) {
    if (!this.isDone(id)) this.data.completedLessons.push(id);
    this.data.quizScores[id] = score;
    for (const i of missedIdx) {
      const key = `${id}#${i}`;
      if (!this.data.missed.includes(key)) this.data.missed.push(key);
    }
    this.save();
  },
  scheduleLesson(id, count, missedIdx) {
    for (let i = 0; i < count; i++) {
      const key = `${id}#${i}`;
      if (this.data.reviews[key]) continue;
      const box = missedIdx.includes(i) ? 0 : 1;
      this.data.reviews[key] = { box, due: nowMs() + INTERVALS[box] * DAY };
    }
    this.save();
  },
  ensureScheduled(keys) {
    let changed = false;
    for (const k of keys) {
      if (!this.data.reviews[k]) { this.data.reviews[k] = { box: 0, due: nowMs() }; changed = true; }
    }
    if (changed) this.save();
  },
  isDue(key) { return (this.data.reviews[key]?.due ?? Infinity) <= nowMs(); },
  dueKeys() {
    return Object.entries(this.data.reviews).filter(([, v]) => v.due <= nowMs()).sort((a, b) => a[1].due - b[1].due).map(([k]) => k);
  },
  recordTicket(correct) { this.data.ticketTotal += 1; if (correct) this.data.ticketCorrect += 1; this.save(); },
  recordExam(id, score) { this.data.examBest[id] = Math.max(this.data.examBest[id] ?? 0, score); this.save(); },
  recordPractice(key, correct) {
    if (key.startsWith('gen')) return;
    this.data.missed = this.data.missed.filter((k) => k !== key);
    if (!correct) this.data.missed.push(key);
    const box = correct ? Math.min((this.data.reviews[key]?.box ?? 0) + 1, INTERVALS.length - 1) : 0;
    this.data.reviews[key] = { box, due: nowMs() + INTERVALS[box] * DAY };
    this.save();
  },
  setUnlockAll(on) { this.data.unlockAll = on; this.save(); },
  reset() { this.data = emptyProgress(); this.save(); },
  nextLesson(units) {
    const id = this.data.lastLessonID;
    if (id && !this.isDone(id)) {
      for (const u of units) {
        const l = u.lessons.find((x) => x.id === id);
        if (l && this.isUnlocked(u, units)) return [u, l];
      }
    }
    for (const u of units) {
      if (!this.isUnlocked(u, units)) continue;
      const l = u.lessons.find((x) => !this.isDone(x.id));
      if (l) return [u, l];
    }
    return null;
  },
};

export const SOURCES = { desk: 'Trade Masası', paper: 'Deneme hesabı', real: 'Gerçek hesap' };
export const SOURCE_SHORT = { desk: 'Masa', paper: 'Deneme', real: 'Gerçek' };
export const EMOTIONS = ['Sakin', 'Korku', 'FOMO', 'İntikam', 'Açgözlülük', 'Can sıkıntısı'];
export const MISTAKES = ['Hata yok', 'Analiz hatası', 'Uygulama hatası', 'Şans (kötü/iyi)'];
export const START_BALANCE = 10_000;

function computeStats(entries) {
  const s = { count: entries.length, wins: 0, avgWin: 0, avgLoss: 0, total: 0, adherence: 0, winRate: 0, expectancy: 0 };
  if (!entries.length) return s;
  const w = entries.filter((e) => e.pnl > 0);
  const l = entries.filter((e) => e.pnl <= 0);
  const sum = (xs) => xs.reduce((a, e) => a + e.pnl, 0);
  s.wins = w.length;
  s.avgWin = w.length ? sum(w) / w.length : 0;
  s.avgLoss = l.length ? -sum(l) / l.length : 0;
  s.total = sum(entries);
  s.adherence = entries.filter((e) => e.followedPlan).length / entries.length;
  s.winRate = s.wins / s.count;
  s.expectancy = s.winRate * s.avgWin - (1 - s.winRate) * s.avgLoss;
  return s;
}

const savedJournal = read(KEYS.journal);

export const journal = {
  entries: savedJournal?.entries ?? [],
  deskBalance: savedJournal?.deskBalance ?? START_BALANCE,
  save() { write(KEYS.journal, { entries: this.entries, deskBalance: this.deskBalance }); },
  add(e) {
    this.entries.unshift({ id: crypto.randomUUID(), date: nowMs(), grade: null, ...e });
    if (e.source === 'desk') this.deskBalance += e.pnl;
    this.save();
  },
  remove(id) { this.entries = this.entries.filter((e) => e.id !== id); this.save(); },
  resetDesk() { this.deskBalance = START_BALANCE; this.save(); },
  reset() { this.entries = []; this.deskBalance = START_BALANCE; this.save(); },
  stats(source = null, last = null) {
    let es = this.entries.filter((e) => !source || e.source === source);
    if (last) es = es.slice(0, last);
    return computeStats(es);
  },
};

export const GATE = { desk: 30, paper: 30, ticket: 20, adherence: 0.8 };

export function readinessGate(units) {
  const core = units.filter((u) => u.order <= 7);
  const exams = core.filter((u) => progress.examPassed(u)).length;
  const desk = journal.stats('desk', GATE.desk);
  const paper = journal.stats('paper', GATE.paper);
  const items = [
    { title: 'K0–K7 sınavları', detail: `${exams} / ${core.length} geçildi`, done: core.length > 0 && exams === core.length },
    { title: 'Emir fişi', detail: `${progress.data.ticketCorrect} / ${GATE.ticket} doğru emir`, done: progress.data.ticketCorrect >= GATE.ticket },
    { title: 'Trade Masası', detail: `${desk.count} / ${GATE.desk} trade · plana uyum ${Fmt.pct(desk.adherence)}`, done: desk.count >= GATE.desk && desk.adherence >= GATE.adherence },
    { title: 'Deneme hesabı', detail: `${paper.count} / ${GATE.paper} trade günlükte · plana uyum ${Fmt.pct(paper.adherence)}`, done: paper.count >= GATE.paper && paper.adherence >= GATE.adherence },
  ];
  return { items, passed: items.every((i) => i.done), doneCount: items.filter((i) => i.done).length };
}

// Vakalar

function nyOffset(utcMs) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
  }).formatToParts(new Date(utcMs));
  const g = (t) => Number(parts.find((p) => p.type === t).value);
  return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - utcMs;
}

function nyTime(y, m, d, hh, mm) {
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const first = guess - nyOffset(guess);
  return guess - nyOffset(first);
}

export function marketOpen(date) {
  const [y, m, d] = date.split('-').map(Number);
  const cur = new Date(Date.UTC(y, m - 1, d));
  do { cur.setUTCDate(cur.getUTCDate() + 1); } while (cur.getUTCDay() === 0 || cur.getUTCDay() === 6);
  return nyTime(cur.getUTCFullYear(), cur.getUTCMonth() + 1, cur.getUTCDate(), 9, 30);
}

export function marketClose(date) {
  const [y, m, d] = date.split('-').map(Number);
  return nyTime(y, m, d, 16, 0);
}

export const trDate = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Intl.DateTimeFormat('tr-TR', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(Date.UTC(y, m - 1, d)));
};

export const trDeadline = (ms) => new Intl.DateTimeFormat('tr-TR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
export const trMoment = (ms) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ms));

const savedCases = read(KEYS.cases);

export const caseStore = {
  cases: [],
  decisions: savedCases?.decisions ?? {},
  live: savedCases?.live ?? {},
  fetching: new Set(),
  fetchError: null,
  save() { write(KEYS.cases, { decisions: this.decisions, live: this.live }); },
  decision(c) { return this.decisions[c.id] ?? null; },
  lock(c, choice, reason) {
    if (this.decisions[c.id]) return;
    const t = nowMs();
    this.decisions[c.id] = { choice, reason, lockedAt: t, onTime: c.kind === 'live' ? t < marketOpen(c.decision.date) : true };
    this.save();
  },
  replay(c) {
    if (c.kind === 'live') return;
    delete this.decisions[c.id];
    this.save();
  },
  reset() { this.decisions = {}; this.live = {}; this.save(); },
  closes(c) { return this.live[c.id] ?? { closes: {}, manual: false, fetchedAt: null }; },
  resolvedClose(c) { return c.live ? this.closes(c).closes[c.live.resolve_date] ?? null : null; },
  sessions(c) {
    if (!c.live) return [];
    return Object.entries(this.closes(c).closes)
      .filter(([k]) => k > c.decision.date && k <= c.live.resolve_date)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, close]) => ({ date, close }));
  },
  setManualClose(c, date, close) {
    const l = this.closes(c);
    this.live[c.id] = { ...l, closes: { ...l.closes, [date]: close }, manual: true };
    this.fetchError = null;
    this.save();
  },
  async fetchCloses(c) {
    if (!c.live || this.fetching.has(c.id)) return;
    this.fetching.add(c.id);
    this.fetchError = null;
    try {
      const q = new URLSearchParams({ symbol: c.live.yahoo, from: c.decision.date, to: c.live.resolve_date });
      const res = await fetch(`/api/opsiyon-kapanis?${q}`);
      if (!res.ok) throw new Error(String(res.status));
      const got = await res.json();
      const l = this.closes(c);
      this.live[c.id] = { ...l, closes: { ...l.closes, ...got.closes }, fetchedAt: nowMs() };
      this.save();
      if (nowMs() >= marketClose(c.live.resolve_date) && this.resolvedClose(c) === null) {
        this.fetchError = 'Vade kapanışı henüz gelmedi. Biraz sonra tekrar dene ya da kapanışı elle gir.';
      }
    } catch {
      this.fetchError = 'Kapanış çekilemedi (internet ya da kaynak). Kapanışı elle girebilirsin.';
    } finally {
      this.fetching.delete(c.id);
    }
  },
};

export const CaseMath = {
  livePnl: (ch, close, scale) => Strategy.pnlAtExpiry(ch.legs, close * scale),
  headline(c, choiceId) {
    const ch = c.choices.find((x) => x.id === choiceId);
    if (!ch || !ch.legs.length) return null;
    if (c.kind === 'live') {
      const close = caseStore.resolvedClose(c);
      return close === null ? null : CaseMath.livePnl(ch, close, c.live.scale);
    }
    return c.exits?.[c.exits.length - 1]?.pnl[choiceId] ?? null;
  },
  deadline: (c) => trDeadline(marketOpen(c.decision.date)),
  costText(ch) {
    if (!ch.legs.length) return 'Para yok';
    return ch.cost >= 0 ? `Ödersin ${Fmt.money(ch.cost, { signed: false })}` : `Alırsın ${Fmt.money(-ch.cost, { signed: false })}`;
  },
  parseClose(s) {
    const t = s.trim();
    const v = Number(t.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(t) ? t.replaceAll('.', '').replace(',', '.') : t);
    return Number.isFinite(v) && v > 100 ? v : null;
  },
};

// Yedek

export function exportBackup() {
  return JSON.stringify({ surum: 1, tarih: new Date().toISOString(), progress: progress.data, journal: { entries: journal.entries, deskBalance: journal.deskBalance }, cases: { decisions: caseStore.decisions, live: caseStore.live } }, null, 2);
}

export function importBackup(text) {
  const d = JSON.parse(text);
  if (d?.surum !== 1 || !d.progress || !d.journal || !d.cases) throw new Error('Yedek dosyası değil');
  progress.data = { ...emptyProgress(), ...d.progress };
  journal.entries = d.journal.entries ?? [];
  journal.deskBalance = d.journal.deskBalance ?? START_BALANCE;
  caseStore.decisions = d.cases.decisions ?? {};
  caseStore.live = d.cases.live ?? {};
  progress.save(); journal.save(); caseStore.save();
}
