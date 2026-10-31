// Masa merkezi, Günlük, Emir Fişi ve Trade Masası.
import { Fmt, low, up } from './fmt.js';
import { progress, journal, caseStore, CaseMath, readinessGate, GATE, SOURCES, SOURCE_SHORT, EMOTIONS, MISTAKES, marketClose } from './stores.js';
import { DeskSession, TEMPLATES, THESES, DESK_SKEW, TICKET_ACTIONS, generateTicket, gradeTicket, ticketQuote } from './desk.js';
import { COMMISSION } from './math.js';
import { randomSeed } from './rng.js';
import { h, rich, label, stamp, card, primary, chip, stat, live, go, icon, metricsRow, legTitle, pnlClass, confirmDialog, toggle, focusTitle } from './ui.js';
import { chainBlock } from './blocks.js';
import { payoffChart, deskPathChart } from './charts.js';

export function masaView(app) {
  const casesCard = () => {
    const liveCase = caseStore.cases.find((c) => c.kind === 'live' && !caseStore.decision(c) && Date.now() < marketClose(c.live.resolve_date));
    const played = caseStore.cases.filter((c) => caseStore.decision(c)).length;
    return h('a', { class: `card link-card span-2 ${liveCase ? 'is-live' : ''}`, href: '#/masa/vakalar' },
      h('div', { class: 'head-row' }, h('h2', { class: 'd-sm' }, 'VAKALAR'), h('span', { class: 'num c-muted' }, `${played} / ${caseStore.cases.length}`, icon('ileri', 'c-dim'))),
      h('p', { class: 't-card' }, 'Gerçek piyasa günleri: Volmageddon, Mart 2020, GameStop, yen şoku, gümrük şoku. O gün sen olsan ne yapardın?'),
      liveCase && h('div', { class: 'live-line c-brand' }, icon('dalga'), `Canlı vaka açık · son kilit ${CaseMath.deadline(liveCase)}`));
  };
  const deskCard = () => {
    const s = journal.stats('desk');
    const broke = journal.deskBalance < 1000;
    return card(null,
      h('div', { class: 'head-row' }, h('h2', { class: 'd-sm' }, 'TRADE MASASI'), h('span', { class: 'num big' }, Fmt.money(journal.deskBalance, { signed: false }))),
      h('p', { class: 't-card' }, 'Hayali bir hisse, akan zaman. Planla, gün gün ilerle, bilanço ve şok günlerini yaşa, kapat ya da vadeye taşı. Sonunda süreç karnesi.'),
      h('div', { class: 'grid-3' }, stat('Trade', String(s.count)), stat('Kazanma', s.count ? Fmt.pct(s.winRate) : '—'), stat('Plana uyum', s.count ? Fmt.pct(s.adherence) : '—')),
      broke
        ? [h('p', { class: 't-semi c-loss' }, 'Sanal hesap eridi. Bu da bir ders: boyut kuralı neden var?'),
          primary('Hesabı sıfırla', () => confirmDialog("Sanal hesap 10.000 $'a döner. Günlük kayıtların silinmez.", 'Hesabı sıfırla', () => { journal.resetDesk(); app.render(); }))]
        : primary(activeDesk?.finished ? 'Karneni tamamla' : activeDesk?.opened ? "Süren trade'e dön" : s.count === 0 ? "İlk trade'i planla" : 'Yeni senaryo', () => go('#/masa/trade')));
  };
  const linkCard = (href, title, value, text) => h('a', { class: 'card link-card', href },
    h('div', { class: 'head-row' }, h('h2', { class: 'd-sm' }, title), h('span', { class: 'num c-muted' }, value, icon('ileri', 'c-dim'))),
    h('p', { class: 't-card' }, text));
  const gate = () => {
    const g = readinessGate(app.units);
    return card({ class: g.passed ? 'is-passed' : '' },
      h('div', { class: 'head-row' }, h('h2', { class: 'd-sm' }, 'SAHAYA ÇIKIŞ KAPISI'), h('span', { class: `num big ${g.passed ? 'c-profit' : 'c-muted'}` }, `${g.doneCount} / ${g.items.length}`)),
      h('p', { class: 't-card' }, 'Gerçek parayla ilk kontrattan önce bu dördü tamam olsun. K8 · Sahaya Çıkış kademesi nedenini anlatır.'),
      g.items.map((i) => h('div', { class: 'gate-item' },
        h('span', { class: `gate-dot ${i.done ? 'is-done' : ''}` }, i.done ? icon('tik') : null, h('span', { class: 'sr-only' }, i.done ? 'Tamam' : 'Eksik')),
        h('div', null, h('div', { class: 't-bold sm' }, i.title), h('div', { class: 'foot-m' }, i.detail)))),
      g.passed && [stamp('1 KONTRATA HAZIRSIN', 'profit', 'lg'), h('p', { class: 't-semi c-muted' }, "Tanımlı risk, likit sembol, hesabın %1–2'si. İlk 10 gerçek trade'de büyütme yok.")]);
  };
  return h('div', { class: 'page wide' }, h('div', { class: 'stack' },
    h('h1', { class: 'd-xl' }, 'MASA'),
    h('div', { class: 'masa-grid' },
      casesCard(),
      deskCard(),
      gate(),
      linkCard('#/masa/emir', 'EMİR FİŞİ', `${progress.data.ticketCorrect} doğru`, 'Gerçek ekranda nasıl emir girilir: Buy to Open mı Sell to Close mu, limit fiyat, Day mi GTC mi.'),
      linkCard('#/masa/gunluk', 'GÜNLÜK', `${journal.stats().count} kayıt`, "Masadaki, deneme hesabındaki ve gerçek trade'lerin tek yerde. Kazanma oranı, beklenen değer, plana uyum."))));
}

const backTo = (href, title) => h('a', { class: 'back', href }, icon('geri'), title);

export function journalView() {
  let filter = null;
  let adding = false;
  const host = live((redraw) => {
    const s = journal.stats(filter);
    const list = journal.entries.filter((e) => !filter || e.source === filter);
    return h('div', { class: 'journal' },
      backTo('#/masa', 'Masa'),
      h('h1', { class: 'd-lg' }, 'GÜNLÜK'),
      h('div', { class: 'journal-grid' },
        h('div', { class: 'stack' },
          h('div', { class: 'chips' },
            chip('Hepsi', !filter, () => { filter = null; redraw(); }),
            Object.keys(SOURCES).map((src) => chip(SOURCE_SHORT[src], filter === src, () => { filter = src; redraw(); }))),
          h('div', { class: 'grid-3' },
            stat('Trade', String(s.count)),
            stat('Kazanma', s.count ? Fmt.pct(s.winRate) : '—'),
            stat('Plana uyum', s.count ? Fmt.pct(s.adherence) : '—', s.count && s.adherence >= GATE.adherence ? 'c-profit' : ''),
            stat('Ort. kazanç', s.count ? Fmt.money(s.avgWin) : '—', s.count ? pnlClass(s.avgWin) : ''),
            stat('Ort. kayıp', s.count ? Fmt.money(-s.avgLoss) : '—', s.count ? pnlClass(-s.avgLoss) : ''),
            stat('Beklenen', s.count ? Fmt.money(s.expectancy) : '—', s.count ? pnlClass(s.expectancy) : '')),
          h('p', { class: 'foot' }, "Beklenen değer = kazanma% × ort. kazanç − kayıp% × ort. kayıp. 30 trade'den azsa rakamlar gürültüdür; sonuç değil süreç (plana uyum) önce gelir."),
          adding ? journalForm(() => { adding = false; redraw(); focusTitle(host); }) : primary('Deneme / gerçek trade ekle', () => { adding = true; redraw(); })),
        h('div', { class: 'stack-s' },
          list.length === 0 && card(null, h('p', { class: 't-card' }, journal.entries.length ? 'Bu filtrede kayıt yok. "Hepsi"ne dönebilirsin.' : "Henüz kayıt yok. Trade Masası'nda bir trade bitir ya da deneme hesabındaki trade'ini buradan ekle.")),
          list.map((e) => h('article', { class: 'card entry' },
            h('div', { class: 'head-row' }, h('div', { class: 't-bold sm' }, `${e.symbol} · ${e.strategy}`), h('div', { class: `num big ${pnlClass(e.pnl)}` }, Fmt.money(e.pnl))),
            h('div', { class: 'foot-m' }, `${SOURCES[e.source]} · ${new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(new Date(e.date))} · tez: ${low(e.thesis)}`),
            h('div', { class: 'tags' },
              h('span', { class: `tag ${e.followedPlan ? 'c-profit' : 'c-loss'}` }, e.followedPlan ? 'Plana uydu' : (e.planNote ?? 'Plana uymadı')),
              h('span', { class: 'tag c-muted' }, e.emotion),
              e.mistake !== 'Hata yok' && h('span', { class: 'tag c-warn' }, e.mistake),
              e.grade && h('span', { class: `tag ${e.grade === 'A' ? 'c-profit' : e.grade === 'B' ? 'c-warn' : 'c-loss'}` }, `Süreç ${e.grade}`),
              h('button', { type: 'button', class: 'link quiet', onclick: () => confirmDialog('Bu kayıt silinsin mi?', 'Sil', () => { journal.remove(e.id); redraw(); focusTitle(host); }) }, 'Sil')),
            e.note && h('p', { class: 'foot' }, e.note))))));
  }, { class: 'page wide' });
  return host;
}

function parseNumber(s) {
  let t = s.trim().replace('−', '-').replace('$', '');
  if (t.includes(',')) t = t.replaceAll('.', '').replace(',', '.');
  const v = Number(t.trim());
  return t.trim() && Number.isFinite(v) ? v : null;
}

function journalForm(done) {
  const f = { source: 'paper', thesis: THESES[0].name, followed: null, emotion: '', mistake: '' };
  const field = (lab, input) => h('label', { class: 'form-f' }, h('span', { class: 't-semi c-muted' }, lab), input);
  const select = (values, cur, on) => {
    const el = h('select', { class: 'field', onchange: (e) => { on(e.target.value); sync(); } },
      cur === '' && h('option', { value: '' }, 'Seç'), values.map((v) => h('option', { value: v }, v)));
    el.value = cur;
    return el;
  };
  const symbol = h('input', { class: 'field', placeholder: 'Sembol (ör. SPY)', autocapitalize: 'characters', oninput: () => sync() });
  const strategy = h('input', { class: 'field', placeholder: 'Strateji (ör. bull put spread)' });
  const pnl = h('input', { class: 'field', inputmode: 'text', placeholder: 'Zarar için eksi: -120', oninput: () => sync() });
  const risk = h('input', { class: 'field', inputmode: 'decimal', placeholder: 'İsteğe bağlı' });
  const note = h('textarea', { class: 'field', rows: 2, placeholder: 'Ne öğrendin?' });
  const hint = h('p', { class: 'foot', role: 'status' });
  const save = primary('Kaydet', () => {
    journal.add({
      source: f.source, symbol: symbol.value.trim().toUpperCase(), strategy: strategy.value.trim() || '—', thesis: f.thesis,
      pnl: parseNumber(pnl.value) ?? 0, maxRisk: parseNumber(risk.value) ?? 0, followedPlan: f.followed, emotion: f.emotion, mistake: f.mistake, note: note.value.trim(),
    });
    done();
  }, { enabled: false });
  const sync = () => {
    const missing = [];
    if (!symbol.value.trim()) missing.push('sembol');
    if (parseNumber(pnl.value) === null) missing.push(pnl.value.trim() ? 'sonuç sayı olmalı (kazanç 150, zarar -120)' : 'sonuç');
    if (!f.emotion) missing.push('duygu');
    if (!f.mistake) missing.push('hata türü');
    if (f.followed === null) missing.push('plana uyup uymadığın');
    save.disabled = missing.length > 0;
    hint.textContent = missing.length ? `Kaydetmek için: ${missing.join(', ')}.` : '';
  };
  const seg = live((redraw) => [
    chip(SOURCES.paper, f.source === 'paper', () => { f.source = 'paper'; redraw(); }),
    chip(SOURCES.real, f.source === 'real', () => { f.source = 'real'; redraw(); }),
  ], { class: 'chips' });
  const followed = live((redraw) => [
    chip('Uydum', f.followed === true, () => { f.followed = true; redraw(); sync(); }),
    chip('Uymadım', f.followed === false, () => { f.followed = false; redraw(); sync(); }),
  ], { class: 'chips' });
  sync();
  return card({ class: 'form' },
    h('div', { class: 't-title' }, 'Trade ekle'),
    seg,
    h('div', { class: 'grid-2' },
      field('Sembol', symbol), field('Strateji', strategy),
      field('Tez', select(THESES.map((t) => t.name), f.thesis, (v) => { f.thesis = v; })),
      field('Sonuç $', pnl), field('Maks risk $', risk),
      field('Duygu', select(EMOTIONS, f.emotion, (v) => { f.emotion = v; })),
      field('Hata türü', select(MISTAKES, f.mistake, (v) => { f.mistake = v; }))),
    h('div', { class: 'form-f' }, h('span', { class: 't-semi c-muted' }, 'Plana uydun mu?'), followed),
    field('Not', note),
    h('div', { class: 'row-actions' }, h('button', { type: 'button', class: 'btn-ghost', onclick: done }, 'Vazgeç'), save),
    hint);
}

export function ticketView() {
  const emptyOrder = () => ({ action: null, kind: null, strike: 0, qty: 1, type: null, price: 0, tif: null });
  let task = generateTicket(randomSeed());
  let order = emptyOrder();
  let result = null;
  const host = live((redraw) => {
    const field = (title, ...kids) => h('div', { class: 'form-f' }, h('span', { class: 't-semi c-muted' }, title), ...kids);
    const set = (k, v) => () => { if (result) return; order[k] = v; redraw(); };
    const q = order.strike > 0 && order.kind ? ticketQuote(task.chain, order.kind, order.strike) : null;
    const complete = order.action && order.kind && order.strike > 0 && order.type && order.tif;
    const lock = result !== null;
    const stepBtn = (t, d) => h('button', { type: 'button', class: 'step-btn wide', disabled: lock, onclick: () => { order.price = Math.max(0, Math.round((order.price + d) * 100) / 100); redraw(); } }, t);

    const ticket = card({ class: `form ${lock ? 'is-locked' : ''}` },
      field('İşlem', h('div', { class: 'grid-2 tight' }, Object.entries(TICKET_ACTIONS).map(([k, t]) => chip(t, order.action === k, set('action', k))))),
      field('Opsiyon', h('div', { class: 'chips' }, chip('Call', order.kind === 'call', set('kind', 'call')), chip('Put', order.kind === 'put', set('kind', 'put')))),
      field('Strike', h('div', { class: 'chips' }, task.chain.strikes.map((k) => chip(Fmt.num(k, 0), order.strike === k, set('strike', k))))),
      field('Adet (kontrat)', h('div', { class: 'qty-row' },
        h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Azalt', disabled: lock, onclick: () => { order.qty = Math.max(1, order.qty - 1); redraw(); } }, '−'),
        h('span', { class: 't-semi' }, `${order.qty} kontrat = ${order.qty * 100} hisse`),
        h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Artır', disabled: lock, onclick: () => { order.qty = Math.min(20, order.qty + 1); redraw(); } }, '+'))),
      field('Emir türü', h('div', { class: 'chips' }, [['market', 'Market'], ['limit', 'Limit'], ['stop', 'Stop']].map(([k, t]) => chip(t, order.type === k, set('type', k))))),
      order.type && order.type !== 'market' && field(order.type === 'stop' ? 'Stop fiyatı' : 'Limit fiyatı',
        h('div', { class: 'price-row' }, h('span', { class: 'num price-v' }, Fmt.price(order.price)), stepBtn('−0,05', -0.05), stepBtn('−0,01', -0.01), stepBtn('+0,01', 0.01), stepBtn('+0,05', 0.05)),
        q ? h('div', { class: 'chips' }, chip(`Bid ${Fmt.num(q.bid)}`, false, set('price', q.bid)), chip(`Mid ${Fmt.num(q.mid)}`, false, set('price', q.mid)), chip(`Ask ${Fmt.num(q.ask)}`, false, set('price', q.ask)))
          : h('p', { class: 'foot' }, 'Bid, mid ve ask düğmeleri için önce opsiyon ve strike seç.')),
      field('Geçerlilik', h('div', { class: 'chips' }, chip('Day · bugün', order.tif === 'day', set('tif', 'day')), chip('GTC · iptale kadar', order.tif === 'gtc', set('tif', 'gtc')))),
      h('p', { class: 'foot' }, 'Örnek ekran. Gerçek emir gitmez.'));

    const feedback = result && (() => {
      const ok = result.every((c) => c.ok);
      return card({ class: 'stack-s ticket-feedback' },
        stamp(ok ? 'EMİR DOĞRU' : `${result.filter((c) => !c.ok).length} HATA`, ok ? 'profit' : 'loss', 'lg pop'),
        result.map((c) => h('div', { class: 'check-line' }, h('span', { class: c.ok ? 'c-profit' : 'c-loss' }, icon(c.ok ? 'tik' : 'kapat'), h('span', { class: 'sr-only' }, c.ok ? 'Doğru' : 'Yanlış')), h('span', { class: c.ok ? 't-dim' : '' }, c.text))),
        ok && h('p', { class: 'foot' }, 'Gerçek aracı kurum ekranında da önce özet ("Review order") gelir: işlem, adet, net tutar ve tahmini komisyonu orada bir kez daha kontrol et.'));
    })();

    return h('div', { class: 'stack' },
      backTo('#/masa', 'Masa'),
      h('h1', { class: 'd-lg' }, 'EMRİ SEN GİR'),
      label(`${progress.data.ticketCorrect} doğru / ${progress.data.ticketTotal} emir`),
      h('div', { class: 'ticket-grid' },
        h('div', { class: 'stack' },
          card(null, rich(task.prompt, 'p', 't-task'), h('p', { class: 'foot' }, `Sembol XYZ · vade ${task.expiry}`)),
          chainBlock(task.chain)),
        h('div', { class: 'stack' }, feedback, ticket,
          h('div', { class: 'sticky-submit' }, primary(result ? 'Sıradaki görev' : complete ? 'Emri gönder' : 'Önce fişi doldur', () => {
            if (result) {
              task = generateTicket(randomSeed());
              order = emptyOrder();
              result = null;
              redraw();
              focusTitle(host);
              scrollTo(0, 0);
            } else {
              result = gradeTicket(task, order);
              progress.recordTicket(result.every((c) => c.ok));
              redraw();
              document.querySelector('.ticket-feedback').scrollIntoView({ block: 'center' });
            }
          }, { enabled: result !== null || Boolean(complete) })))));
  }, { class: 'page wide' });
  return host;
}

// Trade Masası

const factCell = (t, v) => h('div', { class: 'stat' }, h('div', { class: 'stat-t' }, t), h('div', { class: 'stat-v' }, v));
const noteCell = (t, v, note) => h('div', { class: 'stat' }, h('div', { class: 'stat-t' }, t), h('div', { class: 'stat-v' }, v), h('div', { class: 'foot' }, note));

function deskPlan(session, onChange) {
  let spot = session.scenario.start.spot;
  const sc = session.scenario;
  const pay = payoffChart({
    height: 280,
    get: () => ({ legs: session.sizedLegs, range: session.rangeFor(session.sizedLegs), spot, today: { days: sc.days, iv: sc.start.iv, rate: 0.045 }, skew: DESK_SKEW, skewRef: sc.start.spot }),
    setSpot: (v) => { spot = v; },
  });
  const stepTitle = (n, t) => h('div', { class: 'step-title' }, h('span', { class: 'step-n round' }, n), h('h2', { class: 'd-xs' }, up(t)));

  const market = card(null,
    h('div', { class: 'head-row baseline' }, h('div', { class: 'market-t' }, h('span', { class: 'd-md' }, sc.symbol), h('span', { class: 'num big' }, Fmt.price(sc.start.spot))), h('span', { class: 'foot' }, 'hayali hisse')),
    h('div', { class: 'grid-3' }, factCell('IV', Fmt.pct(sc.start.iv)), factCell('IV rank', String(sc.ivRank)), factCell('Vade', `${sc.days} gün`)),
    h('p', { class: 'foot' }, 'IV rank: IV şu an son bir yılın neresinde (0 en düşük, 100 en yüksek).'),
    h('p', { class: `t-semi ${sc.earningsDay === null ? 'c-muted' : 'c-warn'}` }, sc.earningsDay === null ? 'Vade içinde bilanço yok.' : `Vade içinde bilanço var: ${sc.earningsDay}. gün. IV öncesinde şişer, sonrasında çöker.`));
  const chain = chainBlock({ S: sc.start.spot, days: sc.days, iv: sc.start.iv, r: 0.045, skew: DESK_SKEW, strikes: [-2, -1, 0, 1, 2].map((i) => sc.roundStrike(sc.start.spot + i * sc.strikeStep * 2)) });

  const thesis = live((redraw) => THESES.map((t) => chip(t.name, session.thesisPicked && session.thesis === t, () => { session.thesis = t; session.thesisPicked = true; redraw(); onChange.goBtn(); })), { class: 'chips' });

  const sizing = live((redraw) => {
    const m = session.planMetrics;
    const over = session.riskShare > DeskSession.riskRule;
    const slider = (title, key, cls, sign) => {
      const value = h('span', { class: `num big ${cls}` }, `${sign}${Fmt.num(session[key], 0)} $`);
      const cap = Math.max(50, session.planRisk * 1.5, session[key] * 1.5);
      return h('div', { class: 'slider-row' },
        h('div', { class: 'head-row' }, h('span', { class: 't-semi c-muted' }, title), value),
        h('input', { type: 'range', min: 10, max: cap, step: 10, value: session[key], 'aria-label': title, oninput: (e) => { session[key] = Number(e.target.value); value.textContent = `${sign}${Fmt.num(session[key], 0)} $`; } }));
    };
    const setContracts = (n) => { session.contracts = n; session.resetPlan(); pay.update(); redraw(); onChange.goBtn(); };
    return card(null,
      h('div', { class: 'qty-row' },
        h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Azalt', onclick: () => setContracts(Math.max(1, session.contracts - 1)) }, '−'),
        h('span', { class: 'qty-mid' }, h('span', { class: 't-bold' }, `${session.contracts} set`), h('span', { class: 'foot' }, '1 set = stratejinin bütün bacakları bir kez')),
        h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Artır', onclick: () => setContracts(Math.min(10, session.contracts + 1)) }, '+')),
      metricsRow(m),
      h('div', { class: 'head-row' }, h('span', { class: 't-semi c-muted' }, session.unlimitedRisk ? 'Stres zararı (hisse %25 ters)' : 'Risk (maks zarar)'), h('span', { class: `num ${over ? 'c-loss' : ''}` }, `${Fmt.money(-session.planRisk)} · hesabın ${Fmt.pct(session.riskShare, 1)}`)),
      over && h('p', { class: 't-semi c-loss' }, "Kural: trade başına hesabın en fazla %5'i (yaygın %1–5 pratiği). Bu boyut kuralı aşıyor; karnede not düşer."),
      session.unlimitedRisk && h('p', { class: 't-semi c-warn' }, 'Sınırsız riskli pozisyon. Gerçek hesapta en yüksek onay seviyesi ve marjin ister; kötü bir günde hesabı silebilir.'),
      slider('Kâr al: K/Z bu seviyeye gelince kapat', 'takeProfit', 'c-profit', '+'),
      slider('Zarar kes: zarar bu seviyeye gelince kapat', 'stopLoss', 'c-loss', '−'));
  });

  const legsBox = live((redraw) => session.legs.map((l) => h('div', { class: 'leg' },
    h('span', { class: `side ${l.qty > 0 ? 'buy' : 'sell'}` }, l.qty > 0 ? 'AL' : 'SAT'),
    h('div', { class: 'leg-t' }, h('div', { class: 't-bold sm' }, legTitle(l)), h('div', { class: 'foot' }, l.kind === 'stock' ? `giriş ${Fmt.price(l.strike)}` : `orta fiyat ${Fmt.price(l.premium)}`)),
    l.kind !== 'stock' && h('span', { class: 'step-cap' }, 'Strike'),
    l.kind !== 'stock' && ['−', '+'].map((t, i) => h('button', {
      type: 'button', class: 'step-btn', 'aria-label': i ? "Strike'ı artır" : "Strike'ı azalt",
      onclick: () => { session.shift(l.id, i ? 1 : -1); pay.update(); sizing.redraw(); onChange.goBtn(); redraw(); },
    }, t)))), { class: 'stack-s' });

  const templates = live((redraw) => TEMPLATES.map((t) => chip(t.name, session.template === t, () => {
    session.choose(t);
    legsBox.redraw(); pay.update(); sizing.redraw(); onChange.goBtn(); redraw();
  }, 'pill')), { class: 'chips wrap' });

  const goSlot = live(() => primary(!session.thesisPicked ? 'Önce tezini seç' : session.canAfford ? 'İşleme gir' : 'Hesap yetmiyor: stratejiyi değiştir', () => { session.open(); onChange.opened(); }, { enabled: Boolean(session.thesisPicked && session.canAfford) }), { class: 'sticky-submit' });
  onChange.goBtn = () => goSlot.redraw();

  return h('div', { class: 'stack' },
    backTo('#/masa', 'Masa'),
    h('h1', { class: 'd-lg' }, 'PLANLA'),
    label(`Trade Masası · hesap ${Fmt.money(session.balance, { signed: false })}`),
    h('div', { class: 'plan-grid' },
      h('div', { class: 'stack' }, market, stepTitle('1', 'Tezin ne?'), thesis, stepTitle('2', 'Strateji ve strike'), templates, legsBox, chain),
      h('div', { class: 'stack' }, card(null, pay.el), stepTitle('3', 'Boyut ve çıkış planı'), sizing, goSlot,
        h('p', { class: 'foot' }, `Fiyatlar modelden üretilir (Black-Scholes + basit skew). Dolum ortanın biraz aleyhine olur ve kontrat başına ${Fmt.price(COMMISSION)} örnek komisyon düşülür. Eğitim içindir, yatırım tavsiyesi değildir.`))));
}

function planMarker(session, pos) {
  const dot = h('i', { style: `left:${(session.lastPos ?? pos) * 100}%` });
  session.lastPos = pos;
  requestAnimationFrame(() => requestAnimationFrame(() => { dot.style.left = `${pos * 100}%`; }));
  return h('div', { class: 'plan-bar', 'aria-hidden': 'true' }, dot);
}

function deskRun(session, redrawAll) {
  const sc = session.scenario;
  const d = session.today;
  const pnl = session.liquidationPnL;
  const [hitTP, hitSL] = [pnl >= session.takeProfit, pnl <= -session.stopLoss];
  const hit = hitTP || hitSL;
  const g = session.greeks;
  const span = session.takeProfit + session.stopLoss;
  const pos = Math.min(Math.max((pnl + session.stopLoss) / Math.max(span, 1), 0), 1);

  const act = (f) => () => { f(); redrawAll(); if (!hit) document.getElementById('plan-close')?.focus({ preventScroll: true }); };
  return h('div', { class: 'run-grid' },
    h('div', { class: 'stack run-main' },
      h('h1', { class: 'label' }, `${sc.symbol} · gün ${session.day} / ${sc.days} · vadeye ${session.daysLeft} gün`),
      h('div', { class: 'run-price' },
        h('span', { class: 'd-lg' }, Fmt.price(d.spot)),
        h('span', { class: `num big ${pnlClass(d.spot - sc.start.spot)}` }, Fmt.signedPct(d.spot / sc.start.spot - 1)),
        h('span', { class: 'run-iv' }, h('span', { class: 'stat-t' }, 'IV'), h('span', { class: 'num big c-today' }, Fmt.pct(d.iv)))),
      card({ class: 'tight' }, deskPathChart(session)),
      card({ class: 'run-events' }, label('Olaylar'), h('div', { class: 'stack-xs' }, [...session.events].reverse().slice(0, 6).map((e) => h('p', { class: 'foot-m' }, e))))),
    h('div', { class: 'stack sticky-col' },
      card({ class: 'run-board' },
        h('div', { class: 'board' }, h('div', null, label('Şimdi kapatırsan'), h('div', { class: `board-v ${pnlClass(pnl)}` }, Fmt.money(pnl))),
          hitTP ? stamp('KÂR AL', 'profit', 'pop') : hitSL ? stamp('ZARAR KES', 'loss', 'pop') : null),
        planMarker(session, pos),
        h('div', { class: 'head-row' }, h('span', { class: 'mini c-loss' }, `Zarar kes −${Fmt.num(session.stopLoss, 0)} $`), h('span', { class: 'mini c-profit' }, `Kâr al +${Fmt.num(session.takeProfit, 0)} $`)),
        hit && h('p', { class: 't-semi c-warn' }, 'Planın şimdi KAPAT diyor. Devam edersen karnede "plana uymadı" yazar.')),
      h('div', { class: 'grid-3 run-greeks' },
        noteCell('Delta', Fmt.signed(g.delta, 0), 'Hisse 1 $ artınca K/Z değişimi'),
        noteCell('Theta/gün', Fmt.money(g.theta), '1 gün geçince'),
        noteCell('Vega', Fmt.money(g.vega), 'IV 1 puan artınca')),
      h('div', { class: 'run-actions' },
        hit
          ? primary('Planın: kapat', act(() => session.close()), { id: 'plan-close' })
          : h('div', { class: 'run-row' }, h('button', { type: 'button', class: 'btn-second', onclick: act(() => session.advance(5)) }, '+5 GÜN'), primary('1 gün ilerle', act(() => session.advance(1)))),
        h('button', { type: 'button', class: 'link quiet center', onclick: hit ? act(() => session.advance(1)) : act(() => session.close()) }, hit ? 'Yine de 1 gün ilerle' : 'Pozisyonu şimdi kapat'))));
}

function deskReport(session, onDone) {
  const f = { emotion: null, mistake: null };
  const syncSave = () => {
    const ok = f.emotion && f.mistake;
    saveBtn.disabled = !ok;
    saveBtn.textContent = ok ? 'Kaydet, yeni senaryo' : 'Önce duygunu ve hatanı seç';
  };
  const note = h('textarea', { class: 'field', rows: 2, placeholder: 'Kısa not: ne öğrendin?' });
  const pickers = live((redraw) => [
    h('div', { class: 't-semi c-muted' }, 'Nasıl hissettin?'),
    h('div', { class: 'grid-3 tight' }, EMOTIONS.map((e) => chip(e, f.emotion === e, () => { f.emotion = e; redraw(); syncSave(); }))),
    h('div', { class: 't-semi c-muted' }, 'Hata türü'),
    h('div', { class: 'grid-2 tight' }, MISTAKES.map((m) => chip(m, f.mistake === m, () => { f.mistake = m; redraw(); syncSave(); }))),
  ], { class: 'stack-s' });
  const grade = session.grade;
  const saveBtn = primary('', () => {
    journal.add({
      source: 'desk', symbol: session.scenario.symbol, strategy: session.template.name, thesis: session.thesis.name,
      pnl: Math.round(session.finalPnL * 100) / 100, maxRisk: session.entryRisk, followedPlan: session.planOK && session.sizeOK,
      planNote: session.sizeOK ? (session.planOK ? null : 'Çıkış planına uymadı') : session.planOK ? 'Boyut kuralı aşıldı' : 'Boyut ve çıkış planına uymadı',
      emotion: f.emotion, mistake: f.mistake, note: note.value.trim(), grade,
    });
    onDone();
  });
  syncSave();
  return h('div', { class: 'column-wide stack' },
    h('h1', { class: 'label' }, `Karne · ${session.scenario.symbol} · ${session.template.name}`),
    h('div', { class: 'head-row report-head' },
      h('div', null, h('div', { class: `d-xl ${pnlClass(session.finalPnL)}` }, Fmt.money(session.finalPnL)), h('div', { class: 't-semi c-muted' }, `Yeni hesap: ${Fmt.money(session.balance + session.finalPnL, { signed: false })}`)),
      h('div', { class: 'report-stamp' }, stamp(`SÜREÇ ${grade}`, grade === 'A' ? 'profit' : grade === 'B' ? 'warn' : 'loss', 'xl pop'), h('div', { class: 'foot' }, 'sonuçtan bağımsız'))),
    card(null, h('ul', { class: 'bullets' }, session.lessons.map((l) => h('li', null, l)))),
    card(null, label('Günlüğe yaz'), pickers, note),
    saveBtn,
    h('details', { class: 'card' }, h('summary', { class: 't-semi' }, 'Tüm olaylar'), h('div', { class: 'stack-xs pad-t' }, session.events.map((e) => h('p', { class: 'foot-m' }, e)))));
}

let activeDesk = null;
addEventListener('beforeunload', (e) => { if (activeDesk?.opened) e.preventDefault(); });

export function deskView() {
  if (!activeDesk || (!activeDesk.opened && activeDesk.balance !== journal.deskBalance)) activeDesk = new DeskSession(randomSeed(), journal.deskBalance);
  let session = activeDesk;
  const phaseOf = () => (session.finished ? 'report' : session.opened ? 'run' : 'plan');
  let phase = phaseOf();
  const sync = () => {
    host.redraw();
    const now = phaseOf();
    if (now !== phase) { phase = now; focusTitle(host); scrollTo(0, 0); }
  };
  const hooks = { opened: sync, goBtn: () => {} };
  const host = live(() => {
    if (session.finished) return deskReport(session, () => { session = new DeskSession(randomSeed(), journal.deskBalance); activeDesk = session; sync(); });
    if (session.opened) return deskRun(session, sync);
    return deskPlan(session, hooks);
  }, { class: 'page wide' });
  return host;
}
