(function () {
  const D = window.DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const lvl = id => D.LEVELS.find(l => l.id === id);
  const nf = (n, d) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 }).format(n);
  const money = m => !isFinite(m) ? '–' : (Math.abs(m) >= 1000 ? nf(m / 1000, 2) + ' Mrd. $' : nf(m, m < 10 ? 1 : 0) + ' Mio. $');
  const people = m => !isFinite(m) ? '–' : (m >= 1000 ? nf(m / 1000, 2) + ' Mrd.' : nf(m, m < 10 ? 1 : 0) + ' Mio.');
  const chip = id => `<button class="chip" data-level="${id}" title="${lvl(id).name}">${id} · ${lvl(id).short}</button>`;

  /* ---------- Tabs ---------- */
  const tabs = $$('.tabs [role=tab]');
  function showTab(name) {
    if (!$('#' + name)) name = 'rechner';
    tabs.forEach(t => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    $$('main > section').forEach(s => { s.hidden = s.id !== name; });
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
  }
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
  function goLevel(id) {
    showTab('ebenen');
    const el = $('#lvl-' + id);
    if (el) { el.open = true; el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-level]');
    if (c) goLevel(+c.dataset.level);
  });

  /* ---------- Rückwärts-Rechner ---------- */
  const KEY = 'rtc.calc.v1';
  let st = { arch: 'event', gross: 400, budget: 150, ticket: 8, rental: 50 };
  const advancedOf = a => { const A = D.ARCHETYPES[a]; return { opening: A.opening * 100, conv: A.conv * 100, diRate: A.diRate * 100, freq: A.freq, cpm: A.cpm }; };
  Object.assign(st, advancedOf(st.arch));
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && D.ARCHETYPES[s.arch]) Object.assign(st, s); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  function field(id, label, unit, step) {
    return `<label class="f"><span>${label}</span><span class="inp"><input type="number" id="${id}" min="0" step="${step || 'any'}" inputmode="decimal"><em>${unit}</em></span></label>`;
  }

  function buildRechner() {
    $('#rechner').innerHTML = `
      <div class="grid2">
        <div class="panel">
          <h2>1 · Ziel festlegen</h2>
          <label class="f"><span>Filmtyp</span>
            <select id="arch">${Object.entries(D.ARCHETYPES).map(([k, a]) => `<option value="${k}">${a.name}</option>`).join('')}</select>
          </label>
          <p class="hint" id="archDesc"></p>
          ${field('gross', 'Ziel-Einspiel weltweit', 'Mio. $')}
          ${field('budget', 'Produktionsbudget', 'Mio. $')}
          ${field('ticket', 'Ø Ticketpreis weltweit', '$', '0.5')}
          <details class="adv">
            <summary>Modellannahmen anpassen</summary>
            <p class="hint">Faustwerte. Je realistischer deine Annahmen, desto besser das Ergebnis.</p>
            ${field('opening', 'Opening-Anteil am Gesamteinspiel', '%')}
            ${field('conv', 'Anteil „Definite Interest“, der tatsächlich kauft', '%')}
            ${field('diRate', 'Anteil Erreichter, die „Definite Interest“ bekommen', '%')}
            ${field('freq', 'Ø Kontakte pro erreichter Person', '×')}
            ${field('cpm', 'Ø Kosten pro 1.000 Kontakte (CPM)', '$')}
            ${field('rental', 'Anteil des Einspiels beim Studio', '%')}
          </details>
        </div>
        <div id="rOut"></div>
      </div>`;
    $('#arch').value = st.arch;
    ['gross', 'budget', 'ticket', 'opening', 'conv', 'diRate', 'freq', 'cpm', 'rental'].forEach(k => {
      const el = $('#' + k);
      el.value = st[k];
      el.addEventListener('input', () => { st[k] = parseFloat(el.value) || 0; save(); renderResult(); });
    });
    $('#arch').addEventListener('change', e => {
      st.arch = e.target.value;
      Object.assign(st, advancedOf(st.arch));
      ['opening', 'conv', 'diRate', 'freq', 'cpm'].forEach(k => { $('#' + k).value = st[k]; });
      save(); renderResult();
    });
    renderResult();
  }

  function renderResult() {
    const A = D.ARCHETYPES[st.arch];
    $('#archDesc').textContent = A.desc;
    const ok = st.gross > 0 && st.ticket > 0 && st.opening > 0 && st.conv > 0 && st.diRate > 0 && st.rental > 0;
    if (!ok) { $('#rOut').innerHTML = '<div class="panel"><p class="hint">Bitte alle Werte größer als 0 eingeben.</p></div>'; return; }
    const r = Calc.compute({
      gross: st.gross, ticket: st.ticket, budget: st.budget, opening: st.opening / 100,
      conv: st.conv / 100, diRate: st.diRate / 100, freq: st.freq, cpm: st.cpm, rental: st.rental / 100
    }, A.shares);

    const steps = [
      { n: 'Ergebnis', v: money(st.gross), d: `So viel soll der Film weltweit einspielen.`, lv: [] },
      { n: 'Besucher', v: people(r.admissions), d: `Einspiel ÷ Ø Ticketpreis. Jeder dieser Menschen musste vorher aus „kenne ich nicht“ zu „ich gehe“ gebracht werden.`, lv: [10] },
      { n: 'Laufzeit (verdient)', v: people(r.legsAdm), d: `${nf(100 - st.opening)} % der Besucher kommen nach dem Eröffnungswochenende. Das Publikum entscheidet das (Mundpropaganda), nicht die Werbung.`, lv: [11] },
      { n: 'Opening (gekauft)', v: people(r.openAdm), d: `${nf(st.opening)} % kommen im Eröffnungswochenende. Das ist die Zahl, die Marketing direkt beeinflusst.`, lv: [5, 10] },
      { n: 'Kaufabsicht („Definite Interest“)', v: people(r.diPool), d: `Nur ${nf(st.conv)} % der Menschen mit festem Interesse kaufen tatsächlich. Also braucht man deutlich mehr Interessierte als Käufer.`, lv: [4, 7, 10] },
      { n: 'Nötige Reichweite', v: people(r.reach), d: `Nur ${nf(st.diRate)} % der Erreichten entwickeln feste Absicht. Hier entscheiden Trailer-Qualität, Konzept und Zielgruppen-Passung.`, lv: [1, 2, 3, 6, 8] },
      { n: 'Kontakte gesamt', v: people(r.impressions), d: `Reichweite × ${nf(st.freq)} Kontakte pro Person (Frequenz).`, lv: [5] },
      { n: 'Paid-Media-Kosten', v: money(r.paid), d: `Kontakte × CPM von ${nf(st.cpm)} $.`, lv: [5] },
      { n: 'Gesamtes Marketingbudget (P&A)', v: money(r.pa), d: `Paid Media macht ${nf(A.shares[4])} % des Budgets aus; der Rest verteilt sich auf die übrigen Ebenen (siehe unten).`, lv: [2, 3, 4, 6, 7, 8, 9, 10, 11] },
      { n: 'Ursprung', v: 'Konzept & IP', d: `Davor stehen Greenlight, Besetzung und Idee. Sie bestimmen, wie hoch die Interessens-Rate (${nf(st.diRate)} %) überhaupt sein kann.`, lv: [1] }
    ];

    const maxShare = Math.max(...A.shares);
    const bars = D.LEVELS.map((L, i) => {
      const s = A.shares[i];
      const val = r.byLevel[i];
      return `<li><span class="bl">${chip(L.id)}</span>
        <span class="bar"><i style="width:${s / maxShare * 100}%"></i></span>
        <span class="bv">${L.id === 1 ? 'im Produktionsbudget' : nf(s) + ' % · ' + money(val)}</span></li>`;
    }).join('');

    const ratioTxt = isFinite(r.paRatio) ? `${nf(r.paRatio * 100)} % des Produktionsbudgets` : '–';
    const covers = st.gross >= r.breakEven;
    const verdict = covers
      ? `Das Ziel-Einspiel deckt Produktions- und Marketingkosten allein im Kino (Studio-Anteil ${nf(st.rental)} %).`
      : `Allein im Kino deckt das Ziel nicht alle Kosten. Es fehlen ${money(r.breakEven - st.gross)} Einspiel oder Erlöse aus Heimkino, Streaming und Merchandise.`;

    $('#rOut').innerHTML = `
      <div class="panel">
        <h2>2 · Rückwärts-Kette: was muss passieren?</h2>
        <ol class="cascade">${steps.map((s, i) => `
          <li style="--i:${i}">
            <div class="cn">${s.n}</div>
            <div class="cv">${s.v}</div>
            <div class="cd">${s.d}</div>
            ${s.lv.length ? `<div class="chips">${s.lv.map(chip).join('')}</div>` : ''}
          </li>`).join('')}
        </ol>
      </div>
      <div class="panel">
        <h2>3 · Budget nach Ebene</h2>
        <ul class="bars">${bars}</ul>
        <p class="hint">Verteilung für „${A.name}“ (Faustwerte).</p>
      </div>
      <div class="panel">
        <h2>4 · Einordnung</h2>
        <ul class="facts">
          <li><b>Marketing im Verhältnis zum Film:</b> ${ratioTxt}. Bei großen Studiofilmen wird oft grob die Hälfte bis das Ganze des Produktionsbudgets für Marketing angesetzt.</li>
          <li><b>Kino-Break-even:</b> ${money(r.breakEven)} Einspiel nötig bei ${nf(st.rental)} % Studio-Anteil. ${verdict}</li>
          <li><b>Hebel Trailer:</b> Ein Trailer, der die Interessens-Rate um 20 % erhöht, spart rund ${money(r.saving)} Paid Media für dasselbe Ergebnis.</li>
        </ul>
        <button class="btn" id="copy">Zusammenfassung kopieren</button>
      </div>`;
    $('#copy').addEventListener('click', () => {
      const txt = `Reverse Trailer Campaign – ${A.name}\n` + steps.map(s => `${s.n}: ${s.v}`).join('\n') +
        `\nKino-Break-even: ${money(r.breakEven)}`;
      const done = () => { $('#copy').textContent = 'Kopiert ✓'; };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => {});
    });
  }

  /* ---------- Ebenen ---------- */
  function buildEbenen() {
    const funnelRow = L => D.FUNNEL.map(f => `<span class="fn ${L.funnel.includes(f) ? 'on' : ''}">${f}</span>`).join('');
    $('#ebenen').innerHTML = `
      <div class="intro">
        <h2>Die 11 Ebenen des Filmmarketings</h2>
        <p>Jede Ebene löst ein anderes Hindernis auf dem Weg vom Unbekannten zum Kinobesuch. Ein Hit entsteht selten durch eine Ebene, sondern weil mehrere zusammen wirken. Klicke eine Ebene auf, um den Mechanismus zu sehen.</p>
      </div>` +
      D.PHASES.map(P => `
        <h3 class="phase">${P.name}<small>${P.sub}</small></h3>` +
        D.LEVELS.filter(L => L.phase === P.id).map(L => `
        <details class="card" id="lvl-${L.id}">
          <summary>
            <span class="num">${L.id}</span>
            <span class="sm"><b>${L.name}</b><span>${L.kurz}</span></span>
            <span class="time">${L.zeit}</span>
          </summary>
          <div class="body">
            <div class="fnrow">${funnelRow(L)}</div>
            <h4>Warum es wirkt</h4><p>${L.warum}</p>
            <div class="cols">
              <div><h4>Taktiken</h4><ul>${L.taktiken.map(x => `<li>${x}</li>`).join('')}</ul></div>
              <div><h4>Woran man es misst</h4><ul>${L.kpis.map(x => `<li>${x}</li>`).join('')}</ul></div>
            </div>
            <h4>Beispiele</h4><ul>${L.beispiele.map(x => `<li>${x}</li>`).join('')}</ul>
            <p class="risk"><b>Risiko:</b> ${L.risiko}</p>
          </div>
        </details>`).join('')).join('');
  }

  /* ---------- Zeitleiste ---------- */
  let rev = true;
  const dateKey = 'rtc.release.v1';
  let release = (() => {
    try { const v = localStorage.getItem(dateKey); if (v) return v; } catch (e) {}
    const d = new Date(); d.setDate(d.getDate() + 365);
    return d.toISOString().slice(0, 10);
  })();
  const dayLabel = d => d === 0 ? 'Start' : (d < 0 ? 'T' + d : 'T+' + d) + ' Tage';
  const humanOffset = d => {
    const a = Math.abs(d);
    if (a < 21) return `${a} Tage ${d < 0 ? 'vorher' : 'danach'}`;
    if (a < 120) return `${nf(a / 7)} Wochen ${d < 0 ? 'vorher' : 'danach'}`;
    return `${nf(a / 30.4)} Monate ${d < 0 ? 'vorher' : 'danach'}`;
  };
  function buildZeit() {
    $('#zeit').innerHTML = `
      <div class="intro">
        <h2>Zeitleiste: vom Ergebnis rückwärts</h2>
        <p>Der Start entscheidet nicht allein; er ist das Ergebnis jahrelanger Vorarbeit. Trage dein Startdatum ein und lies die Schritte rückwärts: Was musste wann passiert sein, damit das Eröffnungswochenende funktioniert?</p>
      </div>
      <div class="bar-ctl">
        <label class="f inline"><span>Kinostart</span><input type="date" id="rel"></label>
        <button class="btn ghost" id="flip"></button>
      </div>
      <ol class="tl" id="tlList"></ol>`;
    $('#rel').value = release;
    $('#rel').addEventListener('change', e => {
      if (e.target.value) { release = e.target.value; try { localStorage.setItem(dateKey, release); } catch (x) {} renderTl(); }
    });
    $('#flip').addEventListener('click', () => { rev = !rev; renderTl(); });
    renderTl();
  }
  function renderTl() {
    $('#flip').textContent = rev ? 'Rückwärts (Ergebnis → Ursprung) · umschalten' : 'Chronologisch (Ursprung → Ergebnis) · umschalten';
    const base = new Date(release + 'T12:00:00');
    let list = D.MILESTONES.slice().sort((a, b) => a.d - b.d);
    if (rev) list.reverse();
    $('#tlList').innerHTML = list.map(m => {
      const dt = new Date(base); dt.setDate(dt.getDate() + m.d);
      return `<li class="${m.key ? 'key' : ''} ${m.d === 0 ? 'zero' : ''}">
        <div class="when"><b>${dt.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}</b><span>${m.d === 0 ? 'Eröffnung' : humanOffset(m.d)}</span></div>
        <div class="what"><h4>${m.t}</h4><p>${m.txt}</p><div class="chips">${m.levels.map(chip).join('')}</div></div>
      </li>`;
    }).join('');
  }

  /* ---------- Fallstudien ---------- */
  let cur = D.CASES[0].id;
  const heat = lv => lv.map((v, i) => `<i class="h${v}" title="${lvl(i + 1).name}: ${['nicht genutzt', 'schwach', 'stark', 'zentral'][v]}">${i + 1}</i>`).join('');
  function buildFaelle() {
    $('#faelle').innerHTML = `
      <div class="intro">
        <h2>Fallstudien, rückwärts erzählt</h2>
        <p>Jeder Fall beginnt beim Ergebnis und geht Schritt für Schritt zurück zum Ursprung. Die Reihe zeigt, welche der 11 Ebenen stark genutzt wurden (je dunkler, desto zentraler).</p>
      </div>
      <div class="panel scroll">
        <table class="matrix"><thead><tr><th>Film</th>${D.LEVELS.map(L => `<th title="${L.name}">${L.id}</th>`).join('')}</tr></thead>
        <tbody>${D.CASES.map(c => `<tr data-case="${c.id}"><th><button class="link" data-case="${c.id}">${c.title}</button></th>${c.lv.map((v, i) => `<td class="h${v}" title="${lvl(i + 1).name}"></td>`).join('')}</tr>`).join('')}</tbody></table>
        <p class="legend"><i class="h0"></i> nicht genutzt <i class="h1"></i> schwach <i class="h2"></i> stark <i class="h3"></i> zentral</p>
      </div>
      <div id="caseOut"></div>`;
    $$('#faelle [data-case]').forEach(b => b.addEventListener('click', () => { cur = b.dataset.case; renderCase(); $('#caseOut').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    renderCase();
  }
  function renderCase() {
    const c = D.CASES.find(x => x.id === cur);
    $$('#faelle tbody tr').forEach(tr => tr.classList.toggle('sel', tr.dataset.case === cur));
    $('#caseOut').innerHTML = `
      <div class="panel">
        <p class="eyebrow">${c.type} · ${c.year}</p>
        <h2>${c.title}</h2>
        <dl class="nums">
          <div><dt>Budget</dt><dd>${c.zahlen.budget}</dd></div>
          <div><dt>Marketing</dt><dd>${c.zahlen.marketing}</dd></div>
          <div><dt>Einspiel</dt><dd>${c.zahlen.einspiel}</dd></div>
        </dl>
        <div class="heat">${heat(c.lv)}</div>
        <ol class="cascade">${c.kette.map((k, i) => `
          <li style="--i:${i}"><div class="cn">${k[0]}</div><div class="cd">${k[1]}</div></li>`).join('')}</ol>
        <p class="lesson"><b>Was man mitnimmt:</b> ${c.lehre}</p>
      </div>`;
  }

  /* ---------- Warum es wirkt ---------- */
  function buildWarum() {
    $('#warum').innerHTML = `
      <div class="intro">
        <h2>Warum Filmmarketing funktioniert</h2>
        <p>Kurz gesagt: Ein Film ist ein Produkt, das man nicht probieren kann, das nur wenige Tage „frisch“ ist und das gemeinsam erlebt wird. Marketing löst genau diese Eigenschaften auf mehreren Ebenen gleichzeitig.</p>
      </div>
      <h3 class="phase">Neun Wirkmechanismen</h3>
      <div class="grid3">${D.PRINZIPIEN.map((p, i) => `
        <article class="card flat"><span class="num">${i + 1}</span><h4>${p.t}</h4><p>${p.txt}</p><div class="chips">${p.levels.map(chip).join('')}</div></article>`).join('')}
      </div>
      <h3 class="phase">Fünf Barrieren, fünf Antworten<small>Warum man mehrere Ebenen braucht</small></h3>
      <div class="panel scroll">
        <table class="bt"><thead><tr><th>Einwand</th><th>Funnel-Stufe</th><th>Gelöst durch</th></tr></thead>
        <tbody>${D.BARRIEREN.map(b => `<tr><td><b>${b.b}</b></td><td>${b.f}</td><td>${b.txt}<div class="chips">${b.fix.map(chip).join('')}</div></td></tr>`).join('')}</tbody></table>
      </div>
      <h3 class="phase">Wo Marketing an Grenzen stößt</h3>
      <div class="panel">
        <ul class="facts">
          <li><b>Opening lässt sich kaufen, Laufzeit nicht.</b> Marketing kann Menschen ins Kino bringen, aber nicht zum Weitererzählen. Ob der Film hält, was die Kampagne verspricht, entscheidet den Multiplikator.</li>
          <li><b>Verwässerte Botschaft verbrennt Geld.</b> Siehe Fallstudie „John Carter“: viel Reichweite, aber unklares Versprechen.</li>
          <li><b>Die Ebenen bedingen einander.</b> Ein starker Trailer macht jeden Media-Euro wirksamer; ein schwacher macht jeden teurer.</li>
        </ul>
      </div>`;
  }

  /* ---------- Start ---------- */
  buildRechner(); buildEbenen(); buildZeit(); buildFaelle(); buildWarum();
  showTab((location.hash || '#rechner').slice(1));
  window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));
})();
