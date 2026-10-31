// Ekran yapı taşları: DOM yardımcısı, zengin metin, düğme, damga, ikonlar.
import { Fmt } from './fmt.js';

export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'value') el.value = v;
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, kids);
  return el;
}

function append(el, kids) {
  for (const kid of kids) {
    if (kid === null || kid === undefined || kid === false) continue;
    if (Array.isArray(kid)) append(el, kid);
    else el.append(kid instanceof Node ? kid : String(kid));
  }
}

const FOCUSABLE = 'a[href],button,input,select,textarea,[tabindex="0"]';

/** İçini kendisi yeniden çizen kutu; klavye odağı yeniden çizimde kaybolmaz. */
/** Ekran değişince klavye ve ekran okuyucu yeni başlıktan devam etsin. */
export function focusTitle(root = document) {
  const t = [...root.querySelectorAll('h1, h2')].find((x) => x.getClientRects().length);
  if (!t) return;
  t.tabIndex = -1;
  t.focus({ preventScroll: true });
}

export function live(render, props = {}) {
  const host = h('div', props);
  const redraw = () => {
    const active = document.activeElement;
    const at = host.contains(active) ? [...host.querySelectorAll(FOCUSABLE)].indexOf(active) : -1;
    const was = at >= 0 ? active.textContent : null;
    const kids = [];
    append({ append: (x) => kids.push(x) }, [render(redraw)]);
    host.replaceChildren(...kids);
    if (at >= 0) {
      const all = [...host.querySelectorAll(FOCUSABLE)];
      (all[at]?.textContent === was ? all[at] : all.find((x) => x.textContent === was) ?? all[at])?.focus({ preventScroll: true });
    }
  };
  host.redraw = redraw;
  redraw();
  return host;
}

const nb = (s) => s.replaceAll(' $', ' $');

/** Yalnız **kalın** ve *italik*; ham HTML asla yorumlanmaz. */
export function rich(md, tag = 'span', cls = null) {
  const el = h(tag, { class: cls });
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/gs;
  let last = 0;
  const text = (s) => {
    s.split('\n').forEach((part, i) => {
      if (i) el.append(h('br'));
      if (part) el.append(nb(part));
    });
  };
  for (const m of md.matchAll(re)) {
    text(md.slice(last, m.index));
    el.append(m[1] !== undefined ? h('strong', null, nb(m[1])) : h('em', null, nb(m[2])));
    last = m.index + m[0].length;
  }
  text(md.slice(last));
  return el;
}

export const pnlClass = (v) => (v >= 0.5 ? 'c-profit' : v <= -0.5 ? 'c-loss' : 'c-muted');

/** replaceChildren gibi, ama false/null yazıya dönüşmez. */
export function fill(el, ...kids) {
  el.replaceChildren();
  append(el, kids);
}

export const label = (text, cls = '') => h('div', { class: `label ${cls}` }, text);

export function stamp(text, tone = 'brand', size = '') {
  return h('span', { class: `stamp tone-${tone} ${size}` }, text);
}

export function primary(title, onClick, { enabled = true, id = null } = {}) {
  return h('button', { type: 'button', class: 'btn-primary', disabled: !enabled, onclick: onClick, id }, title);
}

export function ghost(title, onClick, cls = '') {
  return h('button', { type: 'button', class: `btn-ghost ${cls}`, onclick: onClick }, title);
}

export function chip(title, selected, onClick, cls = '') {
  return h('button', { type: 'button', class: `chip ${selected ? 'is-on' : ''} ${cls}`, 'aria-pressed': selected ? 'true' : 'false', onclick: onClick }, title);
}

export const card = (props, ...kids) => {
  const { class: cls = '', ...rest } = props ?? {};
  return h('div', { class: `card ${cls}`, ...rest }, ...kids);
};

export const stat = (t, v, cls = '') => h('div', { class: 'stat' }, h('div', { class: 'stat-t' }, t), h('div', { class: `stat-v ${cls}` }, v));

export const toggle = (titleText, sub, on, onChange) => {
  const subEl = h('span', { class: 'toggle-sub' }, sub);
  const input = h('input', { type: 'checkbox', role: 'switch', onchange: (e) => onChange(e.target.checked, subEl) });
  input.checked = on;
  return h('label', { class: 'toggle' }, h('span', { class: 'toggle-text' }, h('span', { class: 'toggle-title' }, titleText), subEl), input, h('span', { class: 'toggle-track', 'aria-hidden': 'true' }));
};

const PATHS = {
  yol: 'M5 21V4m0 0h13l-3 4 3 4H5',
  lab: 'M4 4v16h16M7 15c3 0 3-7 6-7s3 4 6 4',
  masa: 'M3 8h18M3 8l2-4h14l2 4M5 8v12M19 8v12M3 14h18',
  pratik: 'M12 3l2.4 2.1 3.2-.3.7 3.1 2.7 1.7-1.3 2.9 1.3 2.9-2.7 1.7-.7 3.1-3.2-.3L12 21l-2.4-2.1-3.2.3-.7-3.1-2.7-1.7 1.3-2.9L3 8.6l2.7-1.7.7-3.1 3.2.3zM8.5 12l2.4 2.4 4.6-4.8',
  sozluk: 'M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2zM5 18a2 2 0 012-2h12M9 8h6',
  ayar: 'M4 7h9m4 0h3M4 17h3m4 0h9M13 4.5v5h4v-5zM7 14.500v5h4v-5z',
  kilit: 'M6 11h12v9H6zM8.500 11V7.500a3.500 3.500 0 017 0V11',
  ileri: 'M9 5l7 7-7 7',
  geri: 'M15 5l-7 7 7 7',
  kapat: 'M6 6l12 12M18 6L6 18',
  tik: 'M5 12.500l4.500 4.500L19 7.500',
  hedef: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 5a4 4 0 100 8 4 4 0 000-8zm0 3.200a.800.800 0 100 1.600.800.800 0 000-1.600z',
  dikkat: 'M12 4L2.500 20h19zM12 10v5m0 2.500v.500',
  kaydirac: 'M4 7h10m4 0h2M4 17h2m4 0h10M16 4.500v5M8 14.500v5',
  dalga: 'M12 12v.01M8.500 8.500a5 5 0 000 7M15.500 8.500a5 5 0 010 7M5.500 5.500a9 9 0 000 13M18.500 5.500a9 9 0 010 13',
  saat: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.500V12l3 2',
  yenile: 'M20 11a8 8 0 10-2.300 6.300M20 5v6h-6',
};

export function icon(name, cls = '') {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 24 24');
  el.setAttribute('class', `ico ${cls}`);
  el.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', PATHS[name]);
  el.append(p);
  return el;
}

export function iconButton(name, title, onClick, cls = '') {
  return h('button', { type: 'button', class: `icon-btn ${cls}`, 'aria-label': title, title, onclick: onClick }, icon(name));
}

export function confirmDialog(message, yes, onYes) {
  const dlg = h('dialog', { class: 'dialog' },
    h('p', null, message),
    h('div', { class: 'dialog-row' },
      h('button', { type: 'button', class: 'btn-ghost', onclick: () => dlg.close() }, 'Vazgeç'),
      h('button', { type: 'button', class: 'btn-danger', onclick: () => { dlg.close(); onYes(); } }, yes)));
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

export function legTitle(l) {
  if (l.kind === 'stock') return `${Math.abs(l.qty)} hisse`;
  const base = `${Math.abs(l.qty)}× ${Fmt.num(l.strike, l.strike === Math.round(l.strike) ? 0 : 1)} ${l.kind === 'call' ? 'call' : 'put'}`;
  return l.extraDays > 0 ? `${base} · +${Math.trunc(l.extraDays)} gün` : base;
}

export function metricsRow(m) {
  const be = m.breakevens.map((v) => Fmt.num(v, 2)).join(' · ');
  const cell = (t, v, cls) => h('div', { class: 'stat' }, h('div', { class: 'stat-t' }, t), h('div', { class: `stat-v sm ${cls}` }, v));
  return h('div', { class: 'metrics' },
    cell('Maks zarar', Fmt.money(m.maxLoss), 'c-loss'),
    cell('Başa baş', be ? `${be} $` : '—', ''),
    cell('Maks kâr', Fmt.money(m.maxProfit), 'c-profit'));
}

export const go = (hash) => { location.hash = hash; };
