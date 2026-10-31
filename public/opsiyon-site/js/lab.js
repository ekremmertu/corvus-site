// Laboratuvar: strateji kur, fiyatı oynat, zamanı erit, IV'yi değiştir. Sayfa olarak da ders içi yan çekmece olarak da açılır.
import { Fmt } from './fmt.js';
import { LabModel, TEMPLATES, presetFromTemplate } from './desk.js';
import { COMMISSION } from './math.js';
import { h, label, live, card, toggle, metricsRow, iconButton, legTitle } from './ui.js';
import { payoffChart } from './charts.js';

export function labBody({ preset = null, onClose = null } = {}) {
  let template = preset ? null : TEMPLATES[0];
  let model = new LabModel(preset ?? presetFromTemplate(template));

  const root = live(() => {
    const pay = payoffChart({
      height: matchMedia('(max-height: 820px)').matches ? 250 : 320,
      get: () => ({ legs: model.legs, range: model.range, spot: model.spot, today: model.today, skew: model.skew, skewRef: model.entrySpot, cost: model.cost }),
      setSpot: (v) => { model.spot = v; panels.forEach((p) => p.redraw()); },
    });

    const metricsSlot = live(() => metricsRow(model.metrics));
    const greeksGrid = live(() => {
      const g = model.greeks;
      const greek = (name, value, note) => h('div', { class: 'greek' }, h('div', { class: 'greek-n' }, name), h('div', { class: 'greek-v num' }, value), h('div', { class: 'foot' }, note));
      return [label('Pozisyon Greeks (şimdi)'), h('div', { class: 'grid-2' },
        greek('Delta', Fmt.signed(g.delta, 1), `Hisse 1 $ artınca ≈ ${Fmt.money(g.delta)}`),
        greek('Gamma', Fmt.signed(g.gamma, 2), "Delta'nın 1 $'daki değişimi"),
        greek('Theta', Fmt.money(g.theta, { digits: 2 }), '1 gün geçince'),
        greek('Vega', Fmt.money(g.vega, { digits: 2 }), 'IV 1 puan artınca'))];
    }, { class: 'stack-s' });
    const legsBox = live((redraw) => {
      const m = model.metrics;
      return [
        h('div', { class: 'head-row' }, label('Bacaklar'), h('span', { class: 'num c-muted' }, `Net: ${m.netPremium >= 0 ? 'ödenen' : 'alınan'} ${Fmt.money(Math.abs(m.netPremium), { signed: false })}`)),
        model.legs.map((l) => h('div', { class: 'leg' },
          h('button', {
            type: 'button', class: `side ${l.qty > 0 ? 'buy' : 'sell'}`,
            'aria-label': l.qty > 0 ? 'Alış, satışa çevir' : 'Satış, alışa çevir',
            onclick: () => { model.flip(l.id); refresh(); redraw(); },
          }, l.qty > 0 ? 'AL' : 'SAT'),
          h('div', { class: 'leg-t' }, h('div', { class: 't-bold sm' }, legTitle(l)), h('div', { class: 'foot' }, l.kind === 'stock' ? `giriş ${Fmt.price(l.strike)}` : `prim ${Fmt.price(l.premium)}`)),
          l.kind !== 'stock' && [
            h('span', { class: 'step-cap' }, 'Strike'),
            h('button', { type: 'button', class: 'step-btn', 'aria-label': "Strike'ı 1 azalt", onclick: () => { model.shiftStrike(l.id, -1); refresh(); redraw(); } }, '−'),
            h('button', { type: 'button', class: 'step-btn', 'aria-label': "Strike'ı 1 artır", onclick: () => { model.shiftStrike(l.id, 1); refresh(); redraw(); } }, '+'),
          ])),
        h('div', { class: 'foot' }, 'Strike değişince prim, girişteki fiyat/IV/vadeye göre motordan yeniden hesaplanır.'),
      ];
    }, { class: 'stack-s' });
    const footnote = live(() => {
      let t = 'Kesikli mavi çizgi: bugünkü teorik değer (Black-Scholes). Düz çizgi: vade günü.';
      if (model.isMultiExpiry) t += " Çok vadeli pozisyonda düz çizgi ön vadenin bittiği günü gösterir; arka bacak o gün modelden (aynı IV ile) fiyatlanır. Gerçekte arka vadenin IV'si değişir ve sonuç farklı olur.";
      t += model.skewOn ? " Skew açık: düşük strike'ların IV'si daha yüksek." : " Skew kapalı: tüm strike'lar aynı IV; gerçek piyasada farklıdır.";
      return h('p', { class: 'foot' }, t);
    });

    const panels = [metricsSlot, greeksGrid];
    function refresh() {
      pay.update();
      metricsSlot.redraw();
      greeksGrid.redraw();
      footnote.redraw();
    }

    const sliderRow = (title, valueText, min, max, step, get, set) => {
      const value = h('span', { class: 'num slider-v' }, valueText());
      const titleEl = h('span', { class: 't-semi c-muted' }, title);
      const input = h('input', {
        type: 'range', min, max, step, value: get(), 'aria-label': title,
        oninput: (e) => { set(Number(e.target.value)); value.textContent = valueText(); refresh(); },
      });
      const row = h('div', { class: 'slider-row' }, h('div', { class: 'head-row' }, titleEl, value), input);
      row.sync = () => { input.value = get(); value.textContent = valueText(); };
      return row;
    };
    const daysRow = sliderRow(model.isMultiExpiry ? 'Ön vadeye kalan' : 'Vadeye kalan', () => `${Math.trunc(model.daysLeft)} gün`, 0, Math.max(model.entryDays, 1), 1, () => model.daysLeft, (v) => { model.daysLeft = v; });
    const ivRow = sliderRow('IV (örtük oynaklık)', () => Fmt.pct(model.iv), 0.05, 1.2, 0.01, () => model.iv, (v) => { model.iv = v; });

    const clock = card(null,
      h('div', { class: 'head-row' }, label('Zaman eritici'), h('button', { type: 'button', class: 'link', onclick: () => { model.resetClock(); daysRow.sync(); ivRow.sync(); refresh(); } }, 'Başa sar')),
      daysRow, ivRow);

    const costOn = () => `Gidiş-dönüş masraf: ${Fmt.money(-model.cost, { digits: 2 })} (örnek: ${Fmt.price(COMMISSION)}/kontrat)`;
    const realism = card(null, label('Gerçekçilik'),
      toggle('IV skew', "Düşük strike'lar daha pahalı (put skew)", model.skewOn, (on) => { model.setSkew(on); refresh(); legsBox.redraw(); }),
      toggle('Makas + komisyon', model.costsOn ? costOn() : 'Açınca eğriler masraf kadar aşağı iner', model.costsOn, (on, sub) => {
        model.costsOn = on;
        sub.textContent = on ? costOn() : 'Açınca eğriler masraf kadar aşağı iner';
        sub.classList.toggle('c-loss', on);
        refresh();
      }));

    const templates = h('div', { class: 'tpl-list', role: 'list' }, TEMPLATES.map((t) => h('button', {
      type: 'button', class: `tpl ${template === t ? 'is-on' : ''}`, 'aria-pressed': template === t ? 'true' : 'false',
      onclick: () => {
        const x = root.querySelector('.tpl-list').scrollLeft;
        template = t;
        model = new LabModel(presetFromTemplate(t));
        root.redraw();
        root.querySelector('.tpl-list').scrollLeft = x;
        root.querySelector('.tpl.is-on').scrollIntoView({ inline: 'nearest', block: 'nearest' });
      },
    }, h('span', { class: 'tpl-n' }, t.name), h('span', { class: 'tpl-s' }, t.note))));

    return h('div', { class: 'lab-grid' },
      h('header', { class: 'lab-head head-row' },
        h('h1', { class: 'd-md' }, 'LABORATUVAR'),
        onClose && iconButton('kapat', 'Laboratuvarı kapat', onClose)),
      h('div', { class: 'lab-tpl' }, label('Strateji'), templates),
      h('div', { class: 'lab-chart stack' }, card(null, pay.el), metricsSlot),
      h('div', { class: 'lab-side stack' }, clock, greeksGrid, legsBox, realism, footnote));
  }, { class: 'lab' });
  return root;
}

export function labDrawer(preset, onGone) {
  let closed = false;
  const prev = document.activeElement;
  const behind = document.getElementById('app');
  const close = () => {
    if (closed) return;
    closed = true;
    behind.inert = false;
    scrim.remove();
    onGone?.();
    prev?.focus?.();
  };
  const panel = h('aside', { class: 'drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Laboratuvar', tabindex: '-1' }, labBody({ preset, onClose: close }));
  const scrim = h('div', { class: 'scrim', onclick: (e) => { if (e.target === scrim) close(); } }, panel);
  behind.inert = true;
  document.body.append(scrim);
  panel.focus();
  return { close };
}

export function labView() {
  return h('div', { class: 'page wide' }, labBody());
}
