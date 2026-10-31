// Kabuk: sol ray / alt sekme, adres çubuğu yönlendirmesi, veri yükleme.
import { progress, caseStore } from './stores.js';
import { h, icon, metricsRow, focusTitle } from './ui.js';
import { setMetricsRow } from './blocks.js';
import { Strategy } from './math.js';
import { pathView, lessonView, examView } from './learn.js';
import { labView } from './lab.js';
import { practiceView, glossaryView, settingsView } from './practice.js';
import { masaView, journalView, ticketView, deskView } from './masa.js';
import { caseListView, caseView } from './cases.js';

setMetricsRow((m) => metricsRow(Strategy.metrics(m.legs)));

const TABS = [
  { id: 'yol', title: 'Yol', href: '#/yol', ic: 'yol' },
  { id: 'lab', title: 'Lab', href: '#/lab', ic: 'lab' },
  { id: 'masa', title: 'Masa', href: '#/masa', ic: 'masa' },
  { id: 'pratik', title: 'Pratik', href: '#/pratik', ic: 'pratik' },
  { id: 'sozluk', title: 'Sözlük', href: '#/sozluk', ic: 'sozluk' },
];

const root = document.getElementById('app');
const app = {
  units: [],
  findLesson(id) {
    for (const u of this.units) {
      const l = u.lessons.find((x) => x.id === id);
      if (l) return [u, l];
    }
    return null;
  },
  go(hash) { location.hash = hash; },
  render: () => render(),
  refreshRail: () => refreshBadges(),
};

const tabLink = (t, active) => h('a', { class: `tab ${active ? 'is-on' : ''}`, href: t.href, 'aria-current': active ? 'page' : null },
  icon(t.ic), h('span', null, t.title), t.id === 'pratik' && h('span', { class: 'badge', 'data-badge': '' }));

function refreshBadges() {
  const n = progress.dueKeys().length;
  document.querySelectorAll('[data-badge]').forEach((b) => {
    b.textContent = n > 99 ? '99+' : String(n);
    b.hidden = n === 0;
  });
}

function shell(active, content) {
  return h('div', { class: 'shell' },
    h('nav', { class: 'rail', 'aria-label': 'Ana menü' },
      h('a', { class: 'logo', href: '#/yol', 'aria-label': 'Opsiyon Ustası, ana sayfa' }, 'OPSİYON', h('br'), 'USTASI'),
      h('div', { class: 'tabs' }, TABS.map((t) => tabLink(t, t.id === active))),
      h('div', { class: 'rail-foot' },
        h('a', { class: `tab ${active === 'ayarlar' ? 'is-on' : ''}`, href: '#/ayarlar' }, icon('ayar'), h('span', null, 'Ayarlar')),
        h('p', { class: 'foot' }, 'Eğitim içindir, yatırım tavsiyesi değildir.'),
        h('a', { class: 'home-link', href: '/' }, 'corvus-tech.co'))),
    h('main', { class: 'content', id: 'content' }, content));
}

let currentView = null;
let firstRender = true;

function route() {
  const [path] = location.hash.replace(/^#\/?/, '').split('?');
  const parts = path.split('/').filter(Boolean);
  const [a, b, c] = parts;
  switch (a) {
    case undefined: case 'yol': return { tab: 'yol', view: () => pathView(app, b) };
    case 'ders': return { full: true, view: () => lessonView(app, b) };
    case 'sinav': return { full: true, view: () => examView(app, b) };
    case 'lab': return { tab: 'lab', view: () => labView() };
    case 'pratik': return { tab: 'pratik', view: () => practiceView(app) };
    case 'sozluk': return { tab: 'sozluk', view: () => glossaryView(app) };
    case 'ayarlar': return { tab: 'ayarlar', view: () => settingsView(app) };
    case 'masa':
      if (b === 'trade') return { tab: 'masa', view: () => deskView() };
      if (b === 'emir') return { tab: 'masa', view: () => ticketView() };
      if (b === 'gunluk') return { tab: 'masa', view: () => journalView() };
      if (b === 'vakalar') return { tab: 'masa', view: () => caseListView() };
      if (b === 'vaka') return { tab: 'masa', view: () => caseView(c) };
      return { tab: 'masa', view: () => masaView(app) };
    default: return { tab: 'yol', view: () => pathView(app) };
  }
}

const TITLES = { yol: 'Yol', lab: 'Lab', masa: 'Masa', pratik: 'Pratik', sozluk: 'Sözlük', ayarlar: 'Ayarlar' };

function render() {
  currentView?.cleanup?.();
  const r = route();
  let view = r.view();
  if (!view) {
    view = h('div', { class: 'page' }, h('div', { class: 'column stack' }, h('h1', { class: 'd-lg' }, 'BU SAYFA YOK'), h('a', { class: 'btn-primary as-link', href: '#/yol' }, 'Yola dön')));
  }
  currentView = view;
  document.title = r.full ? 'Ders · Opsiyon Ustası' : `${TITLES[r.tab] ?? 'Yol'} · Opsiyon Ustası`;
  root.replaceChildren(r.full ? h('div', { class: 'full' }, view) : shell(r.tab, view));
  scrollTo(0, 0);
  if (!firstRender) focusTitle(root);
  firstRender = false;
  refreshBadges();
}

addEventListener('opsiyon-kayit-hatasi', () => {
  if (document.querySelector('.save-warn')) return;
  const box = h('div', { class: 'save-warn', role: 'alert' },
    h('span', null, "İlerlemen kaydedilemedi. Tarayıcı depolaması dolu ya da kapalı olabilir. Gizli pencerede olabilirsin; normal pencereyi dene."),
    h('button', { type: 'button', class: 'link', onclick: () => box.remove() }, 'Kapat'));
  document.body.append(box);
});

async function boot() {
  try {
    const url = (f) => new URL(`../data/${f}`, import.meta.url);
    const [course, cases] = await Promise.all([
      fetch(url('course.json')).then((x) => { if (!x.ok) throw new Error(x.status); return x.json(); }),
      fetch(url('cases.json')).then((x) => { if (!x.ok) throw new Error(x.status); return x.json(); }),
    ]);
    app.units = course.sort((x, y) => x.order - y.order);
    caseStore.cases = cases.cases;
    addEventListener('hashchange', render);
    render();
  } catch {
    root.replaceChildren(h('div', { class: 'boot-error' },
      h('h1', { class: 'd-lg' }, 'DERSLER AÇILAMADI'),
      h('p', { class: 't-lead' }, 'İnternet bağlantını kontrol et, sonra sayfayı yenile.'),
      h('button', { type: 'button', class: 'btn-primary', onclick: () => location.reload() }, 'Yenile')));
  }
}

boot();
