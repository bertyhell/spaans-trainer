/* Opstart en schermbeheer. Houdt de DOM-bedrading op één plek, zodat de
 * modules eronder puur over oefenlogica gaan. */

import * as data from './data.js';
import * as storage from './storage.js';
import * as scheduler from './scheduler.js';
import * as speech from './speech.js';
import * as audio from './audio.js';
import { el, clear } from './dom.js';
import { Session, itemsForThemes } from './session.js';
import { MatchRound } from './matchRound.js';

const $ = sel => document.querySelector(sel);
const env = { speech };

const selected = new Set();
let session = null;
let instance = null;      // de actieve oefenvorm
let activeType = null;
let answered = false;
let match = null;
let matchPick = { left: null, right: null };

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
  $('#stat-xp').querySelector('b').textContent = storage.get().xp;
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

    for (const theme of group.themes) {
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
        el('span', { class: 'mastery', title: `${pct}% beheerst` },
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
      el('span', { class: 'mastery', title: `${groupPct}% beheerst` },
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

function syncGroupCheckbox(groupId) {
  const group = data.tree().find(g => g.id === groupId);
  if (!group) return;
  const box = $(`#un-${groupId}`);
  if (!box) return;
  const on = group.themes.filter(t => selected.has(t.id)).length;
  box.checked = on === group.themes.length;
  box.indeterminate = on > 0 && on < group.themes.length;
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
}

/* ------------------------------------------------------------------ */
/* Les                                                                 */
/* ------------------------------------------------------------------ */

function startLesson(themeIds) {
  audio.arm();
  speech.arm();

  const items = itemsForThemes(themeIds);
  session = new Session({ items, size: 12, env });

  if (!session.total) {
    toast('Geen oefeningen gevonden voor deze selectie.');
    return;
  }
  session._themes = themeIds;
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
  explain.textContent = atom.note ?? '';
  explain.hidden = !atom.note;

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
  const { streak, xp } = session.finish();
  audio.finish();

  $('#result-badge').textContent = session.perfect ? '🏆' : session.correctCount ? '🎉' : '💪';
  $('#result-title').textContent = session.perfect
    ? '¡Perfecto!'
    : session.correctCount / session.total >= 0.7 ? '¡Muy bien!' : '¡Sigue así!';
  $('#result-score').textContent = `${session.correctCount} van ${session.total} juist`;
  $('#result-correct').textContent = `${session.correctCount}/${session.total}`;
  $('#result-xp').textContent = `+${xp}`;
  $('#result-streak').textContent = streak.current;

  renderReview(session.results);
  refreshStats();
  renderTree();
  show('screen-result');
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

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

    const detail = el('div', { class: 'mistake-detail', hidden: true }, ...detailRows(r));
    const toggle = el('button', {
      class: 'mistake-toggle', type: 'button', 'aria-expanded': 'false',
      onclick: () => {
        const open = detail.hidden;
        detail.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
      },
    },
      el('span', { class: 'mistake-mark', 'aria-hidden': 'true' }, r.correct ? '✓' : '✗'),
      el('span', { class: 'mistake-text' },
        el('span', { class: 'mistake-q' }, q),
        el('span', { class: 'mistake-a' }, a)),
      el('span', { class: 'mistake-chevron', 'aria-hidden': 'true' }, '▾'));

    list.append(el('li', { class: `mistake${r.correct ? ' is-ok' : ''}` }, toggle, flag, detail));
  }
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
    default:
      if (a.es || a.nl) pairs.push([a.es ?? '', [].concat(a.nl ?? '').join(', ')]);
  }
  const rows = pairs.map(([es, nl]) => el('div', { class: 'mistake-pair' },
    el('span', { class: 'mistake-lang' }, '🇪🇸'), el('span', {}, es),
    el('span', { class: 'mistake-lang' }, '🇳🇱'), el('span', {}, nl)));
  if (!m.correct && m.given) {
    rows.push(el('p', { class: 'mistake-given' }, `Jouw antwoord: ${m.given}`));
  }
  if (m.note) rows.push(el('p', { class: 'mistake-note' }, m.note));
  return rows;
}

/* ------------------------------------------------------------------ */
/* Koppelronde                                                         */
/* ------------------------------------------------------------------ */

function startMatch() {
  audio.arm();
  const atoms = [...selected].flatMap(id => data.atomsForTheme(id)).filter(a => a.kind === 'vocab');
  match = new MatchRound({ atoms });
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
    setTimeout(() => {
      [l.node, r.node].forEach(n => n.classList.remove('is-wrong', 'is-selected'));
      matchPick = { left: null, right: null };
    }, 480);
  }
}

function finishMatch() {
  const { streak, xp } = match.finish();
  audio.finish();

  $('#result-badge').textContent = match.wrongAttempts === 0 ? '🏆' : '🎉';
  $('#result-title').textContent = match.wrongAttempts === 0 ? '¡Perfecto!' : '¡Muy bien!';
  $('#result-score').textContent = `${match.matched} woorden gekoppeld`;
  $('#result-correct').textContent = match.matched;
  $('#result-xp').textContent = `+${xp}`;
  $('#result-streak').textContent = streak.current;
  $('#mistakes-block').hidden = true;

  refreshStats();
  renderTree();
  show('screen-result');
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
/* Gemelde fouten                                                      */
/* ------------------------------------------------------------------ */

/** Alles wat je nodig hebt om de oefening in de data terug te vinden en te
 *  verbeteren: het volledige atoom plus de naam van het thema. */
function reportEntry(id) {
  const atom = data.getAtom(id);
  const reason = storage.getReportReason(id) || undefined;
  if (!atom) return { id, missing: true, reason };
  return { ...atom, themeLabel: data.getTheme(atom.theme)?.label, reason };
}

function reportLabel(atom) {
  switch (atom.kind) {
    case 'vocab': return [atom.es, atom.nl.join(', ')];
    case 'conjugation': return [`${atom.verb} · ${data.PERSON_LABELS[atom.person]}`, atom.form];
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
    const toggle = el('button', {
      class: 'mistake-toggle', type: 'button', 'aria-expanded': 'false',
      onclick: () => {
        const open = detail.hidden;
        detail.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
      },
    },
      el('span', { class: 'mistake-text' },
        el('span', { class: 'mistake-q' }, q),
        el('span', { class: 'mistake-a' }, a)),
      el('span', { class: 'mistake-chevron', 'aria-hidden': 'true' }, '▾'));
    const remove = el('button', {
      class: 'icon-btn icon-btn--sm', type: 'button',
      title: 'Melding verwijderen', 'aria-label': `Melding verwijderen: ${q}`,
      onclick: () => { storage.unreport(id); renderReports(); },
    }, '🗑️');
    list.append(el('li', { class: 'mistake' }, toggle, remove, reason, detail));
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
  $('#btn-quit-match').addEventListener('click', () => { renderTree(); refreshStats(); show('screen-start'); });

  $('#btn-home').addEventListener('click', () => show('screen-start'));
  $('#btn-again').addEventListener('click', () => {
    const themes = session?._themes ?? [...selected];
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
    if (!confirm('Alle voortgang, punten en streaks wissen?')) return;
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
    if (!$('#screen-lesson').classList.contains('is-active')) return;
    // De invoervelden bevestigen zelf op Enter (en roepen preventDefault aan).
    // Diezelfde toetsaanslag bubbelt hier naartoe, en `answered` staat dan al
    // op true: zonder deze test sloeg één Enter de uitslag meteen over.
    if (e.defaultPrevented) return;
    if (e.key === 'Enter' && answered) { e.preventDefault(); session.next(); nextQuestion(); return; }
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
