/* Opstart en schermbeheer. Houdt de DOM-bedrading op één plek, zodat de
 * modules eronder puur over oefenlogica gaan. */

import * as data from './data.js';
import * as storage from './storage.js';
import * as scheduler from './scheduler.js';
import * as speech from './speech.js';
import * as audio from './audio.js';
import { el, clear, speakerButton, FLAGS } from './dom.js';
import { Session, itemsForThemes } from './session.js';
import { MatchRound } from './matchRound.js';
import * as flashcards from './flashcards.js';

const $ = sel => document.querySelector(sel);
const env = { speech };

const selected = new Set();
let session = null;
let instance = null;      // de actieve oefenvorm
let activeType = null;
let answered = false;
let match = null;
let matchPick = { left: null, right: null };
let lastMode = 'lesson';   // bepaalt wat 'Nog een les' opnieuw start
let lastLesson = null;     // { themes, mistakes } van de laatste les

/* ------------------------------------------------------------------ */
/* Schermen                                                            */
/* ------------------------------------------------------------------ */

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('is-active', s.id === id));
  window.scrollTo(0, 0);
}

function toast(msg, ms = 2200) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  t.classList.add('is-visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    t.classList.remove('is-visible');
    setTimeout(() => { t.hidden = true; }, 250);
  }, ms);
}

function refreshStats() {
  $('#stat-streak').querySelector('b').textContent = storage.currentStreak();
  $('#stat-done').querySelector('b').textContent = storage.get().exercisesDone;
}

/* ------------------------------------------------------------------ */
/* Startscherm: de boom met unidades en thema's                        */
/* ------------------------------------------------------------------ */

/* Welke groepen openstaan. 74 thema's op één scherm is onbruikbaar op een
 * telefoon, dus alles is dicht tot je een groep opent. */
const expanded = new Set();

function renderTree() {
  const root = $('#theme-tree');
  clear(root);

  for (const group of data.tree()) {
    const isOpen = expanded.has(group.id);
    const themeRows = el('div', { class: 'unit-themes', hidden: !isOpen });

    let section = null;
    for (const theme of group.themes) {
      // Thema's met een `section` krijgen een tussenkopje, bv. per tijd bij
      // de vervoegingen. Het vakje ervoor selecteert de hele sectie.
      if (theme.section && theme.section !== section) {
        section = theme.section;
        const members = group.themes.filter(t => t.section === section);
        const sectionId = `se-${group.id}-${members[0].id}`;
        themeRows.append(el('div', { class: 'row row--section' },
          el('input', {
            type: 'checkbox', class: 'row-check', id: sectionId,
            dataset: { themes: members.map(t => t.id).join(' ') },
            onchange: e => {
              for (const t of members) {
                e.target.checked ? selected.add(t.id) : selected.delete(t.id);
                const box = $(`#th-${t.id}`);
                if (box) box.checked = e.target.checked;
              }
              syncGroupCheckbox(group.id);
              refreshSelection();
            },
          }),
          el('label', { class: 'row-label', for: sectionId }, sectionText(section))));
      }

      const keys = data.keysForTheme(theme.id);
      const pct = Math.round(scheduler.mastery(keys) * 100);

      const checkbox = el('input', {
        type: 'checkbox', class: 'row-check', id: `th-${theme.id}`,
        onchange: e => {
          e.target.checked ? selected.add(theme.id) : selected.delete(theme.id);
          syncGroupCheckbox(group.id);
          refreshSelection();
        },
      });
      checkbox.checked = selected.has(theme.id);

      themeRows.append(el('div', { class: 'row row--theme', dataset: { group: group.id } },
        checkbox,
        el('label', { class: 'row-label', for: `th-${theme.id}` },
          el('span', { class: 'row-emoji' }, theme.emoji ?? '•'),
          el('span', { class: 'row-text' },
            el('span', { class: 'row-title' }, theme.label),
            el('span', { class: 'row-meta' }, `${theme.count} ${theme.noun}`)),
        ),
        el('span', { class: 'mastery', title: `${pct}% beheerst`, role: 'img', 'aria-label': `${pct}% beheerst` },
          el('span', { class: 'mastery-fill', style: `width:${pct}%` })),
        el('button', {
          class: 'row-go', type: 'button', 'aria-label': `Oefen ${theme.label} meteen`,
          onclick: () => startLesson([theme.id]),
        }, '▶'),
      ));
    }

    const groupCheck = el('input', {
      type: 'checkbox', class: 'row-check', id: `un-${group.id}`,
      onchange: e => {
        for (const t of group.themes) {
          e.target.checked ? selected.add(t.id) : selected.delete(t.id);
          const box = $(`#th-${t.id}`);
          if (box) box.checked = e.target.checked;
        }
        syncGroupCheckbox(group.id);
        refreshSelection();
      },
    });

    const total = data.countForThemes(group.themes.map(t => t.id));
    const groupPct = Math.round(
      scheduler.mastery(group.themes.flatMap(t => data.keysForTheme(t.id))) * 100);

    const toggle = el('button', {
      class: 'unit-toggle', type: 'button',
      'aria-expanded': String(isOpen),
      'aria-label': `${group.title}, ${group.themes.length} onderdelen`,
      onclick: () => {
        isOpen ? expanded.delete(group.id) : expanded.add(group.id);
        renderTree();
      },
    },
      el('span', { class: 'unit-n' }, group.emoji ?? '•'),
      el('span', { class: 'row-text' },
        el('span', { class: 'row-title' }, group.title),
        el('span', { class: 'row-meta' },
          `${group.themes.length} onderdelen · ${total.count} ${total.noun}`)),
      el('span', { class: 'mastery', title: `${groupPct}% beheerst`, role: 'img', 'aria-label': `${groupPct}% beheerst` },
        el('span', { class: 'mastery-fill', style: `width:${groupPct}%` })),
      el('span', { class: `chevron${isOpen ? ' is-open' : ''}`, 'aria-hidden': 'true' }, '›'),
    );

    root.append(el('section', { class: 'unit' },
      el('div', { class: 'row row--unit' }, groupCheck, toggle),
      themeRows,
    ));

    // De aanvinkstatus moet een hertekening overleven: het vakje is een nieuw
    // DOM-element en staat standaard uit, ook al is de groep wel geselecteerd.
    syncGroupCheckbox(group.id);
  }
  refreshSelection();
}

/** "Presente (tegenwoordige tijd: ik spreek)" → titel met de vertaling eronder. */
function sectionText(section) {
  const [, title, sub] = section.match(/^(.*?)\s*(?:\((.*)\))?$/);
  return el('span', { class: 'row-text' },
    el('span', { class: 'row-title' }, title),
    sub ? el('span', { class: 'row-meta' }, sub) : null);
}

function syncGroupCheckbox(groupId) {
  const group = data.tree().find(g => g.id === groupId);
  if (!group) return;
  const box = $(`#un-${groupId}`);
  if (!box) return;
  setTristate(box, group.themes.map(t => t.id));

  for (const sectionBox of document.querySelectorAll(`.row-check[id^="se-${groupId}-"]`)) {
    setTristate(sectionBox, sectionBox.dataset.themes.split(' '));
  }
}

function setTristate(box, themeIds) {
  const on = themeIds.filter(id => selected.has(id)).length;
  box.checked = on === themeIds.length;
  box.indeterminate = on > 0 && on < themeIds.length;
}

function refreshSelection() {
  const themes = [...selected];
  const atoms = themes.flatMap(id => data.atomsForTheme(id));
  const vocab = atoms.filter(a => a.kind === 'vocab').length;

  $('#btn-start').disabled = atoms.length === 0;
  // Koppelen heeft minstens twee kolommen van vijf nodig om zinvol te zijn.
  $('#btn-match').disabled = vocab < 6;

  $('#selection-summary').textContent = atoms.length === 0
    ? 'Niets geselecteerd'
    : `${themes.length} ${themes.length === 1 ? 'onderdeel' : 'onderdelen'} · ${atoms.length} oefeningen`;
  $('#btn-flash').disabled = vocab === 0;
}

/* ------------------------------------------------------------------ */
/* Les                                                                 */
/* ------------------------------------------------------------------ */

function startLesson(themeIds, { items = itemsForThemes(themeIds), mistakes = false } = {}) {
  audio.arm();
  speech.arm();

  session = new Session({ items, size: 12, env });

  if (!session.total) {
    toast('Geen oefeningen gevonden voor deze selectie.');
    return;
  }
  lastLesson = { themes: themeIds, mistakes };
  // Een foutenles hangt niet aan thema's. Het beheersingskaartje toont dan de
  // aangevinkte onderdelen, of anders de onderdelen waar de fouten uit komen.
  trackMastery(mistakes
    ? (selected.size ? [...selected] : [...new Set(session.queue.map(i => i.atom.theme))])
    : themeIds);
  show('screen-lesson');
  nextQuestion();
}

function nextQuestion() {
  if (session.done) return finishLesson();

  answered = false;
  activeType = session.chooseType();
  if (!activeType) { session.next(); return nextQuestion(); }

  const root = $('#question-root');
  clear(root);
  root.className = `question question--${activeType.id}`;

  $('#feedback').hidden = true;
  $('#lesson-actionbar').className = 'actionbar';
  const btn = $('#btn-check');
  btn.textContent = 'Controleer';
  btn.disabled = true;

  const ctx = {
    speech,
    ready: on => { if (!answered) btn.disabled = !on; },
    submit: () => { if (!answered && !btn.disabled) doCheck(); },
  };

  instance = activeType.render(session.current, root, ctx);
  // Vóór het antwoord bepalen: recordAnswer kan de fout straks wissen.
  $('#prev-mistake').hidden = !storage.get().mistakes[session.current.atomId];

  $('#lesson-counter').textContent = `${session.position}/${session.total}`;
  renderLessonProgress();

  setTimeout(() => instance.focus?.(), 60);
}

// Eén segment per vraag: groen = juist, rood = fout, geel = overgeslagen,
// grijs = nog te doen.
function renderLessonProgress() {
  const bar = $('#lesson-progress');
  clear(bar);
  const byIndex = new Map(session.results.map(r => [r.index, r]));
  for (let i = 0; i < session.total; i++) {
    const r = byIndex.get(i);
    const state = r ? (r.correct ? 'ok' : 'no') : i < session.index ? 'skip' : i === session.index ? 'current' : 'todo';
    bar.append(el('span', { class: `progress-seg progress-seg--${state}` }));
  }
  const pct = (session.results.length / session.total) * 100;
  bar.parentElement.setAttribute('aria-valuenow', Math.round(pct));
}

function doCheck() {
  if (answered) return;
  answered = true;

  // Het toetsenbord van de telefoon staat precies over de actiebalk, dus over
  // de uitslag. Eerst wegklappen, anders lijkt het alsof er niets gebeurt.
  document.activeElement?.blur?.();

  const result = instance.check();
  session.submit(activeType, result);
  instance.reveal?.(result);
  renderLessonProgress();

  result.correct ? audio.correct() : audio.incorrect();
  showFeedback(result);
}

function showFeedback(result) {
  const atom = session.current.atom;
  const fb = $('#feedback');

  $('#lesson-actionbar').className = `actionbar actionbar--${result.correct ? 'ok' : 'no'}`;
  $('#feedback-icon').textContent = result.correct ? '✓' : '✗';
  $('#feedback-title').textContent = result.correct
    ? pick(['¡Muy bien!', '¡Perfecto!', '¡Olé!', '¡Genial!'])
    : 'Niet juist';

  $('#feedback-answer').textContent = result.correct ? '' : `Juist antwoord: ${result.expected}`;
  $('#feedback-answer').hidden = result.correct;

  const note = $('#feedback-note');
  note.textContent = result.note ?? '';
  note.hidden = !result.note;

  const explain = $('#feedback-explain');
  const explanation = explainFor(atom);
  explain.textContent = explanation ?? '';
  explain.hidden = !explanation;

  // Grammatica-uitleg alleen bij een fout: wie het goed had, weet het al.
  // Dichtgeklapt, want de actiebalk is klein; één tik en je leest de regel.
  const grammar = !result.correct && data.grammarFor(atom);
  const g = $('#feedback-grammar');
  g.hidden = !grammar;
  g.open = false;
  if (grammar) {
    $('#feedback-grammar-title').textContent =
      `Uitleg: ${grammar.title}${grammar.ref ? ` (grammatica ${grammar.ref})` : ''}`;
    $('#feedback-grammar-body').textContent = grammar.body;
  }

  const label = data.sourceLabel(atom);
  const src = $('#feedback-src');
  src.textContent = label ? `bron: ${label}` : '';
  src.hidden = !label;

  fb.hidden = false;

  const btn = $('#btn-check');
  btn.disabled = false;
  btn.textContent = session.position === session.total ? 'Afronden' : 'Volgende';
  btn.focus();

  // Bij een lange zinsoefening staat de uitslag onder de vouw; zonder deze
  // sprong lijkt het alsof er niets gebeurd is.
  fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function finishLesson() {
  lastMode = 'lesson';
  const { done } = session.finish();
  audio.finish();

  $('#result-badge').textContent = session.perfect ? '🏆' : session.correctCount ? '🎉' : '💪';
  $('#result-title').textContent = session.perfect
    ? '¡Perfecto!'
    : session.correctCount / session.total >= 0.7 ? '¡Muy bien!' : '¡Sigue así!';
  $('#result-score').textContent = `${session.correctCount} van ${session.total} juist`;
  $('#result-correct').textContent = `${session.correctCount}/${session.total}`;
  $('#result-done').textContent = `+${done}`;
  showMasteryGain();

  renderReview(session.results);
  refreshStats();
  renderTree();
  show('screen-result');
}

/** Beheersing van de huidige selectie, 0 tot 1. */
let masteryThemes = [];
let masteryBefore = 0;
const themesMastery = () =>
  scheduler.mastery(masteryThemes.flatMap(id => data.keysForTheme(id)));
function trackMastery(themeIds) {
  masteryThemes = themeIds;
  masteryBefore = themesMastery();
}

/** Hoeveel de beheersing van de geoefende onderdelen deze les steeg. */
function showMasteryGain() {
  const after = themesMastery();
  const delta = (after - masteryBefore) * 100;
  const sign = delta < 0 ? '−' : '+';
  const pct = (n, digits) => n.toLocaleString('nl-BE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  $('#result-mastery').textContent = `${sign}${pct(Math.abs(delta), 2)}%`;
  $('#result-mastery-total').textContent = `naar ${pct(after * 100, 1)}%`;
  const card = $('#result-mastery-card');
  const complete = after >= 1 && masteryBefore < 1;
  card.classList.remove('mastered');
  if (complete) {
    void card.offsetWidth; // herstart de animatie
    card.classList.add('mastered');
    setTimeout(() => { audio.mastered(); confetti(card); }, 700);
  }
}

/** Confetti die uit het beheersingskaartje spat. */
function confetti(origin) {
  if (prefersReducedMotion()) return;
  const r = origin.getBoundingClientRect();
  const colors = ['#2e9e5b', '#f2c94c', '#eb5757', '#2f80ed', '#bb6bd9', '#f2994a'];
  for (let i = 0; i < 80; i++) {
    const bit = el('span', { class: 'confetti' });
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 180;
    bit.style.left = `${r.left + r.width / 2}px`;
    bit.style.top = `${r.top + r.height / 2}px`;
    bit.style.background = pick(colors);
    bit.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    bit.style.setProperty('--dy', `${Math.sin(angle) * dist - 60}px`);
    bit.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    document.body.append(bit);
    bit.addEventListener('animationend', () => bit.remove());
  }
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/** Wat er onder de uitslag staat: een opmerking, of bij een toets- of
 *  leesvraag de vertaling of de reden waarom het antwoord klopt. */
function explainFor(atom) {
  if (atom.note) return atom.note;
  if (['choice', 'reading', 'stress'].includes(atom.kind) && atom.nl) return atom.nl;
  return null;
}

/**
 * Het overzicht na afloop. Alles komt erin, niet alleen de fouten: een woord
 * dat je nét goed had wil je ook nog eens zien, en een fout in de oefendata
 * valt even vaak op bij een juist antwoord. Vandaar per regel een vlagje.
 */
function renderReview(results) {
  const list = $('#mistakes-list');
  clear(list);
  $('#mistakes-block').hidden = results.length === 0;

  // Zelfde volgorde als in de les, zodat je elke oefening terugvindt.
  const items = [];
  for (const r of results) {
    const [q, a] = mistakeLines(r);
    const flagged = storage.isReported(r.atomId);

    const flag = el('button', {
      class: `flag${flagged ? ' is-on' : ''}`, type: 'button',
      title: 'Fout in deze oefening melden',
      'aria-label': `Fout melden bij ${q}`,
      'aria-pressed': String(flagged),
      onclick: () => {
        const on = storage.toggleReport(r.atomId);
        flag.classList.toggle('is-on', on);
        flag.setAttribute('aria-pressed', String(on));
        toast(on ? 'Genoteerd — na te kijken via Instellingen.' : 'Melding ingetrokken.');
      },
    }, '⚠️');

    const li = reviewRow({
      mark: r.correct ? '✓' : '✗', markLabel: r.correct ? 'juist' : 'fout',
      q, a, className: `mistake${r.correct ? ' is-ok' : ''}`,
      detail: el('div', { class: 'mistake-detail', hidden: true }, ...detailRows(r)),
      extras: [flag],
    });
    list.append(li);
    items.push({ li, correct: r.correct });
  }
  revealReview(items);
}

/** Eén uitklapbare regel in een overzicht: vraag en antwoord, details eronder. */
function reviewRow({ mark = null, markLabel = null, q, a, detail, extras = [], className = 'mistake' }) {
  const toggle = el('button', {
    class: 'mistake-toggle', type: 'button', 'aria-expanded': 'false',
    onclick: () => {
      const open = detail.hidden;
      detail.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    },
  },
    mark != null ? el('span', { class: 'mistake-mark', 'aria-hidden': 'true' }, mark) : null,
    markLabel ? el('span', { class: 'sr-only' }, `${markLabel}: `) : null,
    el('span', { class: 'mistake-text' },
      el('span', { class: 'mistake-q' }, q),
      el('span', { class: 'mistake-a' }, a)),
    el('span', { class: 'mistake-chevron', 'aria-hidden': 'true' }, '▾'));
  return el('li', { class: className }, toggle, ...extras, detail);
}

const prefersReducedMotion = () =>
  document.body.classList.contains('reduce-motion')
  || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Laat het overzicht regel per regel verschijnen: elke juiste regel springt
 * erin met een belletje, een fout komt er gewoon stil bij. Zo voelt elk goed
 * antwoord nog eens als een kleine overwinning. De regels staan al in de lijst
 * (onzichtbaar), zodat de pagina niet verspringt tijdens het onthullen.
 */
let revealRun = 0;
function revealReview(items) {
  const run = ++revealRun;
  if (prefersReducedMotion() || !items.some(i => i.correct)) return;

  for (const { li } of items) li.classList.add('is-pending');
  let i = 0;
  let streak = 0;
  const next = () => {
    // Nieuwe les gestart of scherm verlaten: de rest stil tonen.
    if (run !== revealRun || !$('#screen-result').classList.contains('is-active')) {
      for (const { li } of items) li.classList.remove('is-pending');
      return;
    }
    const { li, correct } = items[i++];
    li.classList.remove('is-pending');
    if (correct) {
      li.classList.add('is-arriving');
      audio.chime(streak++);
    }
    if (i < items.length) setTimeout(next, correct ? 260 : 90);
  };
  // Eerst het slotdeuntje laten uitklinken.
  setTimeout(next, 700);
}

/* Een foutregel moet op zichzelf iets bijbrengen. "la bufanda → la bufanda"
 * zegt niets, dus tonen we altijd beide talen. */
function mistakeLines(m) {
  const a = m.atom;
  switch (a.kind) {
    case 'vocab':
      return [a.es, a.nl[0]];
    case 'conjugation':
      return [`${a.verb} · ${data.PERSON_LABELS[a.person]}`, a.form];
    case 'grammar':
      return [a.rule, m.expected];
    case 'choice':
      return [a.prompt.replace('___', '…'), a.answer];
    case 'reading':
      return [a.q, a.answer];
    case 'dialogue':
      return [a.es, a.nl];
    case 'stress':
      return [a.es, m.expected];
    default:
      return [a.nl ?? a.rule ?? a.es ?? '', m.expected];
  }
}

/* Uitgeklapt: de volledige Spaanse en Nederlandse versie, plus wat je zelf
 * antwoordde als het fout was. */
function detailRows(m) {
  const a = m.atom;
  const pairs = [];
  switch (a.kind) {
    case 'vocab':
      pairs.push([a.es, a.nl.join(', ')]);
      break;
    case 'sentence':
      pairs.push([a.es, a.nl]);
      break;
    case 'conjugation':
      pairs.push([`${data.PERSON_LABELS[a.person]} ${a.form}`, `${a.verb} · ${a.tense}`]);
      break;
    case 'grammar':
      for (const ex of a.examples ?? []) pairs.push([ex.es.replace('___', ex.answer), ex.nl]);
      break;
    case 'choice':
      pairs.push([a.prompt.includes('___') ? a.prompt.replace('___', a.answer) : `${a.prompt} ${a.answer}`, a.nl ?? '']);
      break;
    case 'reading':
      pairs.push([data.getText(a.text)?.title ?? '', `${a.q} → ${a.answer}`]);
      break;
    case 'stress':
      pairs.push([a.syllables.join('·'), a.nl ?? '']);
      break;
    default:
      if (a.es || a.nl) pairs.push([a.es ?? '', [].concat(a.nl ?? '').join(', ')]);
  }
  const rows = pairs.map(([es, nl]) => el('div', { class: 'mistake-pair' },
    el('span', { class: 'mistake-lang' }, '🇪🇸'), el('span', {}, es),
    el('span', { class: 'mistake-lang' }, '🇧🇪'), el('span', {}, nl)));
  if (a.kind === 'conjugation') rows.push(conjugationTable(a));
  if (!m.correct && m.given) {
    rows.push(el('p', { class: 'mistake-given' }, `Jouw antwoord: ${m.given}`));
  }
  if (m.note) rows.push(el('p', { class: 'mistake-note' }, m.note));
  return rows;
}

/** Het hele rijtje van dit werkwoord in deze tijd, met de geoefende persoon gemarkeerd. */
function conjugationTable(atom) {
  const byPerson = new Map(data.conjugationFamily(atom).map(f => [f.person, f.form]));
  return el('div', { class: 'mistake-conj' },
    ...data.PERSON_ORDER.filter(p => byPerson.has(p)).map(p =>
      el('div', { class: `mistake-conj-row${p === atom.person ? ' is-current' : ''}` },
        el('span', { class: 'mistake-conj-person' }, data.PERSON_LABELS[p]),
        el('span', {}, byPerson.get(p)))));
}

/* ------------------------------------------------------------------ */
/* Koppelronde                                                         */
/* ------------------------------------------------------------------ */

function startMatch() {
  audio.arm();
  const atoms = [...selected].flatMap(id => data.atomsForTheme(id)).filter(a => a.kind === 'vocab');
  match = new MatchRound({ atoms });
  trackMastery([...selected]);
  matchPick = { left: null, right: null };
  show('screen-match');
  renderMatch();
}

const matchCol = side => $(side === 'left' ? '#match-left' : '#match-right');

const matchButton = (side, cell) => el('button', {
  class: 'match-cell', type: 'button', dataset: { id: cell.id, side },
  onclick: e => onMatchTap(side, cell.id, e.currentTarget),
}, cell.text);

function renderMatch() {
  const cols = match.columns();
  for (const side of ['left', 'right']) {
    matchCol(side).replaceChildren(...cols[side].map(c => matchButton(side, c)));
  }
  updateMatchProgress();
}

/* Vervangt één plaats. De rest van de kolom blijft staan waar ze stond. */
function replaceMatchCell(side, index, cell) {
  const col = matchCol(side);
  const old = col.children[index];
  if (!old || !cell) return;
  const btn = matchButton(side, cell);
  btn.classList.add('is-new');
  old.replaceWith(btn);
}

function updateMatchProgress() {
  $('#match-counter').textContent = `${match.matched}/${match.target}`;
  $('#match-progress').style.width = `${(match.matched / match.target) * 100}%`;
}

function onMatchTap(side, id, node) {
  audio.tap();
  const col = side === 'left' ? '#match-left' : '#match-right';
  // Nog eens op het gekozen woord tikken maakt de keuze ongedaan.
  if (matchPick[side]?.node === node) {
    node.classList.remove('is-selected');
    matchPick[side] = null;
    return;
  }
  document.querySelectorAll(`${col} .match-cell`).forEach(b => b.classList.remove('is-selected'));
  node.classList.add('is-selected');
  matchPick[side] = { id, node };

  if (!matchPick.left || !matchPick.right) return;

  const l = matchPick.left, r = matchPick.right;
  const res = match.tryMatch(l.id, r.id);

  if (res.ok) {
    audio.correct();
    [l.node, r.node].forEach(n => { n.classList.add('is-correct'); n.classList.remove('is-selected'); n.disabled = true; });
    matchPick = { left: null, right: null };
    updateMatchProgress();
    // Laatste paar: wacht tot het uitgegrijsd is (zie match-fade in de css),
    // zodat je het volledig grijze bord nog even ziet.
    if (res.done) return setTimeout(finishMatch, 1400);
    setTimeout(() => {
      for (const s of res.left) replaceMatchCell('left', s.index, s.cell);
      for (const s of res.right) replaceMatchCell('right', s.index, s.cell);
    }, 320);
  } else {
    audio.incorrect();
    [l.node, r.node].forEach(n => n.classList.add('is-wrong'));
    // Meteen vrijgeven: wie snel een nieuw woord tikt, mag die keuze niet
    // kwijtraken wanneer het rode flitsje straks verdwijnt.
    matchPick = { left: null, right: null };
    setTimeout(() => {
      [l.node, r.node].forEach(n => {
        n.classList.remove('is-wrong');
        if (matchPick.left?.node !== n && matchPick.right?.node !== n) n.classList.remove('is-selected');
      });
    }, 480);
  }
}

function finishMatch() {
  lastMode = 'match';
  const { done } = match.finish();
  audio.finish();

  $('#result-badge').textContent = match.wrongAttempts === 0 ? '🏆' : '🎉';
  $('#result-title').textContent = match.wrongAttempts === 0 ? '¡Perfecto!' : '¡Muy bien!';
  $('#result-score').textContent = `${match.matched} woorden gekoppeld`;
  $('#result-correct').textContent = match.matched;
  $('#result-done').textContent = `+${done}`;
  showMasteryGain();
  $('#mistakes-block').hidden = true;

  refreshStats();
  renderTree();
  show('screen-result');
}

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */

let flash = null;       // de lopende FlashDeck
let flashCard = null;   // { node, flipped, revealed, leaving } van de kaart op tafel

/* Hoe ver je een kaart moet wegvegen voor ze telt, in pixels. */
const SWIPE = 90;
const LANG_NAMES = { nl: 'Nederlands', es: 'Español' };

const selectedVocab = () =>
  [...selected].flatMap(id => data.atomsForTheme(id)).filter(a => a.kind === 'vocab');

function renderFlashSettings() {
  const dirs = flashcards.savedDirections();
  document.querySelectorAll('.flash-dirs .chip').forEach(chip =>
    chip.setAttribute('aria-pressed', String(dirs.includes(chip.dataset.dir))));
}

function toggleFlashSettings(open = $('#flash-settings').hidden) {
  $('#flash-settings').hidden = !open;
  $('#btn-flash-settings').setAttribute('aria-expanded', String(open));
}

function toggleFlashDirection(dir) {
  const dirs = flashcards.savedDirections();
  const next = dirs.includes(dir) ? dirs.filter(d => d !== dir) : [...dirs, dir];
  if (!next.length) return toast('Minstens één richting moet aan staan.');
  flashcards.saveDirections(next);
  renderFlashSettings();
  if (!flash || flash.done || !flashCard) return;
  // Nog niet omgedraaid: de kaart op tafel mag meteen mee veranderen.
  flash.setDirections(next, { keepCurrent: flashCard.revealed });
  if (!flashCard.revealed) nextFlashCard();
}

function startFlash() {
  speech.arm();
  const atoms = selectedVocab();
  if (!atoms.length) return;
  flash = new flashcards.FlashDeck({ atoms, directions: flashcards.savedDirections() });
  renderFlashSettings();
  toggleFlashSettings(false);
  show('screen-flash');
  nextFlashCard();
}

function nextFlashCard() {
  updateFlashProgress();
  if (flash.done) return finishFlash();

  const hint = $('#flash-hint');
  hint.hidden = false;
  hint.textContent = 'Tik op de kaart om ze om te draaien.';
  $('#btn-flash-flip').hidden = false;
  $('#flash-grade').hidden = true;
  $('#flash-end').hidden = true;

  const node = flashCardNode(flash.current);
  flashCard = { node, flipped: false, revealed: false, leaving: false };
  $('#flash-stage').replaceChildren(node);
  $('#flash-live').textContent = faceText(flash.current, 'front');
  $('#btn-flash-flip').focus({ preventScroll: true });
}

function updateFlashProgress() {
  $('#flash-counter').textContent = `${flash.known}/${flash.total}`;
  const pct = flash.total ? (flash.known / flash.total) * 100 : 0;
  $('#flash-progress').style.width = `${pct}%`;
  $('#flash-progress').parentElement.setAttribute('aria-valuenow', Math.round(pct));
}

/** Welke taal op welke kant staat. */
const faceLangs = card => (card.direction === 'nl2es' ? ['nl', 'es'] : ['es', 'nl']);

function faceText(card, side) {
  const lang = faceLangs(card)[side === 'front' ? 0 : 1];
  return lang === 'es' ? card.atom.es : card.atom.nl.join(', ');
}

function flashFace(side, lang, atom) {
  const words = lang === 'es' ? [atom.es] : atom.nl;
  const flag = el('span', { class: 'flashcard-flag', html: FLAGS[lang] });
  const face = el('div', { class: `flashcard-face flashcard-face--${side}` },
    el('span', { class: 'flashcard-lang' }, flag, LANG_NAMES[lang]),
    lang === 'nl' && atom.emoji ? el('span', { class: 'flashcard-emoji', 'aria-hidden': 'true' }, atom.emoji) : null,
    el('span', { class: 'flashcard-word', lang }, words[0]),
    words.length > 1 ? el('span', { class: 'flashcard-alt', lang }, `ook: ${words.slice(1).join(', ')}`) : null,
    lang === 'es' ? speakerButton(atom.es, speech) : null,
  );
  // De achterkant is onzichtbaar maar staat wel in de DOM: zonder inert kan
  // je er met Tab of een schermlezer het antwoord uit halen.
  face.inert = side === 'back';
  return face;
}

function flashCardNode(card) {
  const [front, back] = faceLangs(card);
  const node = el('div', { class: 'flashcard is-entering' },
    el('div', { class: 'flashcard-inner' },
      flashFace('front', front, card.atom),
      flashFace('back', back, card.atom)),
    el('span', { class: 'flashcard-stamp flashcard-stamp--known', 'aria-hidden': 'true' }, '✓ Gekend'),
    el('span', { class: 'flashcard-stamp flashcard-stamp--again', 'aria-hidden': 'true' }, '✗ Nog niet'),
  );
  node.addEventListener('animationend', () => node.classList.remove('is-entering'), { once: true });
  bindFlashGestures(node);
  return node;
}

/* Tikken draait om; na het omdraaien kan je de kaart ook wegvegen: naar
 * rechts is gekend, naar links nog niet. */
function bindFlashGestures(node) {
  let drag = null;
  const setDrag = dx => {
    node.style.setProperty('--drag', `${dx}px`);
    node.style.setProperty('--tilt', `${dx / 18}deg`);
    node.dataset.lean = dx > SWIPE / 2 ? 'known' : dx < -SWIPE / 2 ? 'again' : '';
  };

  node.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest('.speaker') || flashCard?.leaving) return;
    drag = { x: e.clientX, dx: 0, moved: false };
    node.setPointerCapture(e.pointerId);
  });
  node.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x;
    if (Math.abs(drag.dx) > 6) drag.moved = true;
    if (!drag.moved || !flashCard.revealed) return;
    node.classList.add('is-dragging');
    setDrag(drag.dx);
  });
  const end = e => {
    if (!drag) return;
    const { dx, moved } = drag;
    drag = null;
    node.classList.remove('is-dragging');
    if (flashCard.revealed && Math.abs(dx) > SWIPE) return gradeFlash(dx > 0);
    setDrag(0);
    if (!moved && e.type === 'pointerup') flipFlashCard();
  };
  node.addEventListener('pointerup', end);
  node.addEventListener('pointercancel', end);
}

function flipFlashCard() {
  if (!flashCard || flashCard.leaving) return;
  const { node } = flashCard;
  const card = flash.current;
  flashCard.flipped = !flashCard.flipped;
  node.classList.toggle('is-flipped', flashCard.flipped);
  node.querySelector('.flashcard-face--front').inert = flashCard.flipped;
  node.querySelector('.flashcard-face--back').inert = !flashCard.flipped;
  $('#flash-live').textContent = faceText(card, flashCard.flipped ? 'back' : 'front');

  if (flashCard.revealed) return;
  flashCard.revealed = true;
  $('#flash-hint').textContent = 'Wist je het? Veeg naar rechts of links, of kies hieronder.';
  $('#btn-flash-flip').hidden = true;
  $('#flash-grade').hidden = false;
  // Het Spaanse antwoord hoor je meteen: zo oefen je ook de uitspraak.
  if (card.direction === 'nl2es') speech.speak(card.atom.es);
}

function gradeFlash(known) {
  if (!flashCard?.revealed || flashCard.leaving) return;
  flashCard.leaving = true;
  const { node } = flashCard;
  flash.answer(known);
  updateFlashProgress();

  node.dataset.lean = known ? 'known' : 'again';
  node.style.setProperty('--drag', known ? '130%' : '-130%');
  node.style.setProperty('--tilt', known ? '16deg' : '-16deg');
  node.classList.add('is-leaving');
  setTimeout(nextFlashCard, prefersReducedMotion() ? 0 : 300);
}

function finishFlash() {
  flashCard = null;
  speech.stop();
  audio.finish();
  storage.touchStreak();
  storage.save();
  refreshStats();

  const { total, knownFirstTry } = flash;
  const perfect = knownFirstTry === total;
  const missed = [...flash.missed].map(id => data.getAtom(id));

  $('#flash-hint').hidden = true;
  $('#btn-flash-flip').hidden = true;
  $('#flash-grade').hidden = true;
  $('#flash-end').hidden = false;
  $('#flash-live').textContent = '';

  $('#flash-stage').replaceChildren(el('div', { class: 'flash-done' },
    el('div', { class: 'result-badge' }, perfect ? '🏆' : '🎉'),
    el('h2', { class: 'result-title' }, perfect ? '¡Perfecto!' : '¡Muy bien!'),
    el('p', { class: 'result-score' }, `${knownFirstTry} van ${total} meteen gekend`),
    missed.length ? el('section', { class: 'mistakes' },
      el('h3', { class: 'mistakes-title' }, 'Nog eens bekijken'),
      el('ul', { class: 'mistakes-list' }, missed.map(atom =>
        el('li', { class: 'mistake' },
          el('span', { class: 'mistake-text' },
            el('span', { lang: 'es' }, atom.es),
            el('span', { class: 'mistake-a', lang: 'nl' }, atom.nl[0])))))) : null,
  ));
  $('#btn-flash-restart').focus({ preventScroll: true });
}

function onFlashKey(e) {
  if (e.key === 'Escape' && !$('#flash-settings').hidden) { toggleFlashSettings(false); return; }
  if (!flashCard || flashCard.leaving || !$('#flash-settings').hidden) return;
  // Een knop met focus reageert zelf al op Enter en spatie.
  if (['Enter', ' '].includes(e.key) && document.activeElement?.tagName === 'BUTTON') return;
  if ([' ', 'Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); flipFlashCard(); return; }
  if (!flashCard.revealed) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); gradeFlash(true); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); gradeFlash(false); }
}

/* ------------------------------------------------------------------ */
/* Instellingen                                                        */
/* ------------------------------------------------------------------ */

function openSettings() {
  const s = storage.get().settings;
  $('#set-sound').checked = s.sound !== false;
  $('#set-speech').checked = s.speech !== false;
  $('#set-motion').checked = s.reducedMotion === true;
  const n = storage.get().reports.length;
  $('#reports-count').textContent = n ? `(${n})` : '';
  const nm = storage.getMistakes().length;
  $('#mistakes-count').textContent = nm ? `(${nm})` : '';

  $('#speech-status').textContent = speech.available()
    ? ''
    : ' — geen Spaanse stem gevonden op dit toestel';

  const prog = storage.get().progress;
  const boxes = Object.values(prog);
  const mastered = boxes.filter(b => b[0] >= 4).length;
  $('#progress-info').textContent = boxes.length
    ? `${boxes.length} items geoefend, ${mastered} goed beheerst.`
    : 'Nog niets geoefend.';

  show('screen-settings');
}

/* ------------------------------------------------------------------ */
/* Recente fouten                                                      */
/* ------------------------------------------------------------------ */

function renderRecentMistakes() {
  const items = storage.getMistakes()
    .map(m => ({ ...m, atom: data.getAtom(m.atomId), correct: false }))
    .filter(m => m.atom);
  const list = $('#recent-list');
  clear(list);
  $('#recent-info').textContent = items.length
    ? `${items.length} ${items.length === 1 ? 'oefening' : 'oefeningen'}. Een fout verdwijnt na ${storage.MISTAKE_CLEAR_AFTER} keer na elkaar juist.`
    : 'Geen recente fouten. ¡Muy bien!';
  $('#btn-mistakes-clear').disabled = !items.length;
  $('#btn-mistakes-practice').disabled = !items.length;

  for (const m of items) {
    const [q, a] = mistakeLines(m);
    list.append(reviewRow({
      mark: `${m.streak}/${storage.MISTAKE_CLEAR_AFTER}`,
      markLabel: `${m.streak} van ${storage.MISTAKE_CLEAR_AFTER} keer juist`,
      q, a,
      detail: el('div', { class: 'mistake-detail', hidden: true }, ...detailRows(m)),
    }));
  }
}

/** Een les met enkel de oefeningen uit de recente fouten. */
function startMistakesLesson() {
  const atoms = storage.getMistakes().map(m => data.getAtom(m.atomId)).filter(Boolean);
  startLesson([], { items: data.itemsFor(atoms), mistakes: true });
}

function openRecentMistakes() {
  renderRecentMistakes();
  show('screen-mistakes');
}

/* ------------------------------------------------------------------ */
/* Gemelde fouten                                                      */
/* ------------------------------------------------------------------ */

/** Alles wat je nodig hebt om de oefening in de data terug te vinden en te
 *  verbeteren: het volledige atoom plus de naam van het thema. */
function reportEntry(id) {
  const atom = data.getAtom(id);
  const reason = storage.getReportReason(id) || undefined;
  if (!atom) return { id, missing: true, reason };
  const theme = data.getTheme(atom.theme);
  const themeLabel = theme && [theme.section, theme.label].filter(Boolean).join(' · ');
  return { ...atom, themeLabel, reason };
}

function reportLabel(atom) {
  switch (atom.kind) {
    case 'vocab': return [atom.es, atom.nl.join(', ')];
    case 'conjugation': return [`${atom.verb} · ${data.PERSON_LABELS[atom.person]}`, atom.form];
    case 'choice': return [atom.prompt, atom.answer];
    case 'reading': return [atom.q, atom.answer];
    default: return [atom.es ?? atom.rule ?? atom.id, Array.isArray(atom.nl) ? atom.nl.join(', ') : (atom.nl ?? '')];
  }
}

function renderReports() {
  const ids = storage.get().reports;
  const list = $('#reports-list');
  clear(list);
  $('#reports-info').textContent = ids.length
    ? `${ids.length} ${ids.length === 1 ? 'oefening' : 'oefeningen'} gemeld. Tik op een regel voor alle gegevens.`
    : 'Nog geen fouten gemeld. Meld een fout met ⚠️ tijdens of na een les.';
  $('#btn-export').disabled = !ids.length;
  $('#btn-reports-clear').disabled = !ids.length;

  for (const id of ids) {
    const entry = reportEntry(id);
    const [q, a] = entry.missing ? [id, '(niet meer in de cursus)'] : reportLabel(entry);
    const detail = el('pre', { class: 'report-json', hidden: true }, JSON.stringify(entry, null, 2));
    const reason = el('textarea', {
      class: 'report-reason', rows: 2, maxlength: 500,
      placeholder: 'Wat is er mis? (optioneel)',
      'aria-label': `Reden voor melding: ${q}`,
      onchange: e => {
        storage.setReportReason(id, e.target.value);
        detail.textContent = JSON.stringify(reportEntry(id), null, 2);
      },
    });
    reason.value = storage.getReportReason(id);
    const remove = el('button', {
      class: 'icon-btn icon-btn--sm', type: 'button',
      title: 'Melding verwijderen', 'aria-label': `Melding verwijderen: ${q}`,
      onclick: () => { storage.unreport(id); renderReports(); },
    }, '🗑️');
    list.append(reviewRow({ q, a, detail, extras: [remove, reason] }));
  }
}

function openReports() {
  renderReports();
  show('screen-reports');
}

function applyMotionPreference() {
  document.body.classList.toggle('reduce-motion', storage.get().settings.reducedMotion === true);
}

/* ------------------------------------------------------------------ */
/* Opstarten                                                           */
/* ------------------------------------------------------------------ */

function wire() {
  $('#btn-start').addEventListener('click', () => startLesson([...selected]));
  $('#btn-match').addEventListener('click', startMatch);
  $('#btn-check').addEventListener('click', () => (answered ? (session.next(), nextQuestion()) : doCheck()));

  $('#btn-quit').addEventListener('click', () => { speech.stop(); renderTree(); refreshStats(); show('screen-start'); });
  $('#btn-quit-match').addEventListener('click', () => {
    // Wat je al gekoppeld hebt telt mee, ook als je vroeger stopt.
    if (match?.matched) match.finish();
    renderTree(); refreshStats(); show('screen-start');
  });

  $('#btn-flash').addEventListener('click', startFlash);
  document.querySelectorAll('.flash-dirs .chip').forEach(chip =>
    chip.addEventListener('click', () => toggleFlashDirection(chip.dataset.dir)));
  $('#btn-flash-settings').addEventListener('click', () => toggleFlashSettings());
  // Tik buiten het paneeltje: dicht.
  document.addEventListener('pointerdown', e => {
    if ($('#flash-settings').hidden || e.target.closest('#flash-settings, #btn-flash-settings')) return;
    toggleFlashSettings(false);
  });
  $('#btn-flash-flip').addEventListener('click', flipFlashCard);
  $('#btn-flash-known').addEventListener('click', () => gradeFlash(true));
  $('#btn-flash-again').addEventListener('click', () => gradeFlash(false));
  $('#btn-flash-restart').addEventListener('click', startFlash);
  const leaveFlash = () => { speech.stop(); flashCard = null; show('screen-start'); };
  $('#btn-quit-flash').addEventListener('click', leaveFlash);
  $('#btn-flash-home').addEventListener('click', leaveFlash);

  $('#btn-home').addEventListener('click', () => show('screen-start'));
  $('#btn-again').addEventListener('click', () => {
    if (lastMode === 'match') return selected.size ? startMatch() : show('screen-start');
    if (lastLesson?.mistakes) return startMistakesLesson();
    const themes = lastLesson?.themes ?? [...selected];
    themes.length ? startLesson(themes) : show('screen-start');
  });

  $('#btn-report').addEventListener('click', () => {
    if (!session?.current) return;
    const id = session.current.atomId;
    const reason = prompt('Wat is er mis met deze oefening? (optioneel)', storage.getReportReason(id));
    if (reason === null) return;
    storage.report(id);
    storage.setReportReason(id, reason);
    toast('Genoteerd — je kan dit later nakijken via Instellingen.');
  });

  $('#btn-settings').addEventListener('click', openSettings);
  $('#btn-settings-close').addEventListener('click', () => { renderTree(); show('screen-start'); });

  $('#set-sound').addEventListener('change', e => { storage.get().settings.sound = e.target.checked; storage.save(); });
  $('#set-speech').addEventListener('change', e => { storage.get().settings.speech = e.target.checked; storage.save(); });
  $('#set-motion').addEventListener('change', e => {
    storage.get().settings.reducedMotion = e.target.checked;
    storage.save();
    applyMotionPreference();
  });

  $('#btn-reports').addEventListener('click', openReports);
  $('#btn-mistakes').addEventListener('click', openRecentMistakes);
  $('#btn-mistakes-close').addEventListener('click', openSettings);
  $('#btn-mistakes-practice').addEventListener('click', startMistakesLesson);
  $('#btn-mistakes-clear').addEventListener('click', () => {
    if (!storage.getMistakes().length) return;
    if (!confirm('Alle recente fouten wissen?')) return;
    storage.clearMistakes();
    renderRecentMistakes();
    toast('Recente fouten gewist.');
  });
  $('#btn-reports-close').addEventListener('click', openSettings);

  $('#btn-reports-clear').addEventListener('click', () => {
    if (!storage.get().reports.length) return;
    if (!confirm('Alle gemelde fouten wissen?')) return;
    storage.clearReports();
    renderReports();
    toast('Meldingen gewist.');
  });

  $('#btn-export').addEventListener('click', async () => {
    const reports = storage.get().reports;
    if (!reports.length) return toast('Nog geen fouten gemeld.');
    const json = JSON.stringify(reports.map(reportEntry), null, 2);
    try {
      await navigator.clipboard.writeText(json);
      toast(`${reports.length} ${reports.length === 1 ? 'melding' : 'meldingen'} gekopieerd.`);
    } catch {
      toast('Kopiëren lukte niet.');
      console.log(json);
    }
  });

  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Alle voortgang, oefeningen en streaks wissen?')) return;
    storage.resetAll();
    selected.clear();
    renderTree();
    refreshStats();
    applyMotionPreference();
    toast('Voortgang gewist.');
    show('screen-start');
  });

  // Toetsenbord op de desktop: Enter bevestigt, cijfers kiezen een optie.
  document.addEventListener('keydown', e => {
    if ($('#screen-flash').classList.contains('is-active')) return onFlashKey(e);
    if (!$('#screen-lesson').classList.contains('is-active')) return;
    // De invoervelden bevestigen zelf op Enter (en roepen preventDefault aan).
    // Diezelfde toetsaanslag bubbelt hier naartoe, en `answered` staat dan al
    // op true: zonder deze test sloeg één Enter de uitslag meteen over.
    if (e.defaultPrevented) return;
    // Op het verbeterscherm gaan pijltje rechts en onder ook naar de volgende.
    if (answered && ['Enter', 'ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); session.next(); nextQuestion(); return; }
    // Enter op een optie kiest ze én bevestigt meteen, anders moest je na de
    // pijltjes nog naar de knop "Controleer".
    if (e.key === 'Enter' && !answered && document.activeElement?.matches('#question-root .option')) {
      e.preventDefault();
      document.activeElement.click();
      if (!$('#btn-check').disabled) doCheck();
      return;
    }
    // Pijltjes lopen rond door de opties en kiezen meteen. De lijst is soms één
    // kolom, soms een raster, dus links/boven en rechts/onder betekenen hetzelfde.
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step && !answered && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      const opts = [...document.querySelectorAll('#question-root .option:not(:disabled)')];
      if (!opts.length) return;
      e.preventDefault();
      const n = opts.length;
      const current = opts.indexOf(document.activeElement);
      const target = opts[current < 0 ? (step > 0 ? 0 : n - 1) : (current + step + n) % n];
      target.focus();
      target.click();
      return;
    }
    if (/^[1-9]$/.test(e.key) && !answered) {
      const opts = document.querySelectorAll('#question-root .option');
      const target = opts[Number(e.key) - 1];
      if (target && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); target.click(); }
    }
  });
}

async function boot() {
  try {
    data.init();
  } catch (err) {
    document.body.innerHTML =
      '<p style="padding:2rem;font:1rem system-ui">Oefendata niet gevonden. Is <code>data/course.js</code> aanwezig?</p>';
    console.error(err);
    return;
  }

  storage.load();
  // Voortgang uit een ander tabblad: boom en tellers bijwerken.
  storage.watch(() => { renderTree(); refreshStats(); });
  applyMotionPreference();
  wire();
  renderTree();
  refreshStats();

  // De stemmenlijst komt asynchroon binnen; daarna kunnen luisteroefeningen mee.
  await speech.init();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline is optioneel */ });
  }
}

boot();
