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

/* Welke unidades openstaan. 90 thema's op één scherm is onbruikbaar op een
 * telefoon, dus alles is dicht tot je een unidad opent. */
const expanded = new Set();

function renderTree() {
  const root = $('#theme-tree');
  clear(root);

  for (const unit of data.tree()) {
    const isOpen = expanded.has(unit.id);
    const themeRows = el('div', { class: 'unit-themes', hidden: !isOpen });

    for (const theme of unit.themes) {
      const keys = data.keysForTheme(theme.id);
      const pct = Math.round(scheduler.mastery(keys) * 100);

      const checkbox = el('input', {
        type: 'checkbox', class: 'row-check', id: `th-${theme.id}`,
        onchange: e => {
          e.target.checked ? selected.add(theme.id) : selected.delete(theme.id);
          syncUnitCheckbox(unit.id);
          refreshSelection();
        },
      });
      checkbox.checked = selected.has(theme.id);

      themeRows.append(el('div', { class: 'row row--theme', dataset: { unit: unit.id } },
        checkbox,
        el('label', { class: 'row-label', for: `th-${theme.id}` },
          el('span', { class: 'row-emoji' }, theme.emoji ?? '•'),
          el('span', { class: 'row-text' },
            el('span', { class: 'row-title' }, theme.label),
            el('span', { class: 'row-meta' }, `${theme.count} woorden`)),
        ),
        el('span', { class: 'mastery', title: `${pct}% beheerst` },
          el('span', { class: 'mastery-fill', style: `width:${pct}%` })),
        el('button', {
          class: 'row-go', type: 'button', 'aria-label': `Oefen ${theme.label} meteen`,
          onclick: () => startLesson([theme.id]),
        }, '▶'),
      ));
    }

    const unitCheck = el('input', {
      type: 'checkbox', class: 'row-check', id: `un-${unit.id}`,
      onchange: e => {
        for (const t of unit.themes) {
          e.target.checked ? selected.add(t.id) : selected.delete(t.id);
          const box = $(`#th-${t.id}`);
          if (box) box.checked = e.target.checked;
        }
        refreshSelection();
      },
    });

    const words = unit.themes.reduce((n, t) => n + t.count, 0);
    const unitPct = Math.round(
      scheduler.mastery(unit.themes.flatMap(t => data.keysForTheme(t.id))) * 100);

    const toggle = el('button', {
      class: 'unit-toggle', type: 'button',
      'aria-expanded': String(isOpen),
      'aria-label': `${unit.title}, ${unit.themes.length} onderdelen`,
      onclick: () => {
        isOpen ? expanded.delete(unit.id) : expanded.add(unit.id);
        renderTree();
      },
    },
      el('span', { class: 'unit-n' }, unit.n),
      el('span', { class: 'row-text' },
        el('span', { class: 'row-title' }, unit.title),
        el('span', { class: 'row-meta' },
          `${unit.themes.length} onderdelen · ${words} woorden`)),
      el('span', { class: 'mastery', title: `${unitPct}% beheerst` },
        el('span', { class: 'mastery-fill', style: `width:${unitPct}%` })),
      el('span', { class: `chevron${isOpen ? ' is-open' : ''}`, 'aria-hidden': 'true' }, '›'),
    );

    root.append(el('section', { class: 'unit' },
      el('div', { class: 'row row--unit' }, unitCheck, toggle),
      themeRows,
    ));

    // De aanvinkstatus moet een hertekening overleven: het vakje is een nieuw
    // DOM-element en staat standaard uit, ook al is de unidad wel geselecteerd.
    syncUnitCheckbox(unit.id);
  }
  refreshSelection();
}

function syncUnitCheckbox(unitId) {
  const unit = data.tree().find(u => u.id === unitId);
  if (!unit) return;
  const box = $(`#un-${unitId}`);
  if (!box) return;
  const on = unit.themes.filter(t => selected.has(t.id)).length;
  box.checked = on === unit.themes.length;
  box.indeterminate = on > 0 && on < unit.themes.length;
}

function refreshSelection() {
  const themes = [...selected];
  const atoms = themes.flatMap(id => data.atomsForTheme(id));
  const vocab = atoms.filter(a => a.kind === 'vocab').length;

  $('#btn-start').disabled = atoms.length === 0;
  // Koppelen heeft minstens twee kolommen van vijf nodig om zinvol te zijn.
  $('#btn-match').disabled = vocab < 5;

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
  const pct = (session.index / session.total) * 100;
  const bar = $('#lesson-progress');
  bar.style.width = `${pct}%`;
  bar.parentElement.setAttribute('aria-valuenow', Math.round(pct));

  setTimeout(() => instance.focus?.(), 60);
}

function doCheck() {
  if (answered) return;
  answered = true;

  const result = instance.check();
  session.submit(activeType, result);
  instance.reveal?.(result);

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

  const src = $('#feedback-src');
  src.textContent = atom.src ? `bron: ${atom.src.split('/').pop()}` : '';
  src.hidden = !atom.src;

  fb.hidden = false;

  const btn = $('#btn-check');
  btn.disabled = false;
  btn.textContent = session.position === session.total ? 'Afronden' : 'Volgende';
  btn.focus();
}

function finishLesson() {
  const { streak, xp } = session.finish();
  audio.finish();

  $('#result-badge').textContent = session.perfect ? '🏆' : session.correctCount ? '🎉' : '💪';
  $('#result-title').textContent = session.perfect
    ? '¡Perfecto!'
    : session.correctCount / session.total >= 0.7 ? '¡Muy bien!' : '¡Sigue así!';
  $('#result-score').textContent = `${session.correctCount} van ${session.total} juist`;
  $('#result-correct').textContent = session.correctCount;
  $('#result-xp').textContent = `+${xp}`;
  $('#result-streak').textContent = streak.current;

  const list = $('#mistakes-list');
  clear(list);
  const mistakes = session.mistakes;
  $('#mistakes-block').hidden = mistakes.length === 0;
  for (const m of mistakes) {
    const [q, a] = mistakeLines(m);
    list.append(el('li', { class: 'mistake' },
      el('span', { class: 'mistake-q' }, q),
      el('span', { class: 'mistake-a' }, a),
    ));
  }

  refreshStats();
  renderTree();
  show('screen-result');
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

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

function renderMatch() {
  const { left, right } = match.columns();
  const cols = { left: $('#match-left'), right: $('#match-right') };

  for (const side of ['left', 'right']) {
    clear(cols[side]);
    for (const cell of (side === 'left' ? left : right)) {
      cols[side].append(el('button', {
        class: 'match-cell', type: 'button', dataset: { id: cell.id, side },
        onclick: e => onMatchTap(side, cell.id, e.currentTarget),
      }, cell.text));
    }
  }

  $('#match-counter').textContent = `${match.matched}/${match.target}`;
  const pct = (match.matched / match.target) * 100;
  $('#match-progress').style.width = `${pct}%`;
}

function onMatchTap(side, id, node) {
  audio.tap();
  const col = side === 'left' ? '#match-left' : '#match-right';
  document.querySelectorAll(`${col} .match-cell`).forEach(b => b.classList.remove('is-selected'));
  node.classList.add('is-selected');
  matchPick[side] = { id, node };

  if (!matchPick.left || !matchPick.right) return;

  const l = matchPick.left, r = matchPick.right;
  const res = match.tryMatch(l.id, r.id);

  if (res.ok) {
    audio.correct();
    [l.node, r.node].forEach(n => n.classList.add('is-correct'));
    matchPick = { left: null, right: null };
    setTimeout(() => {
      if (res.done) return finishMatch();
      renderMatch();
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
    storage.report(session.current.atomId);
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

  $('#btn-export').addEventListener('click', async () => {
    const reports = storage.get().reports;
    if (!reports.length) return toast('Nog geen fouten gemeld.');
    try {
      await navigator.clipboard.writeText(reports.join('\n'));
      toast(`${reports.length} id's gekopieerd.`);
    } catch {
      toast(reports.join(', '));
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
