/* Vervoegen zoals in een gesprek, niet zoals in een tabel.
 *
 * answerQuestion: iemand vraagt "¿Comiste ayer?" en jij antwoordt
 *   "Sí, ___ ayer." Het werkwoord springt van tú naar yo (of van vosotros
 *   naar nosotros) — precies wat je in een echt gesprek moet doen, en wat
 *   een vervoegingstabel nooit vraagt. De klassieke fout is de vorm uit de
 *   vraag herhalen; die staat daarom altijd tussen de opties.
 *
 * tenseContext: een tijdsaanduiding kiest de tijd. "Ayer yo ___ (comer)"
 *   vraagt de indefinido, "Hoy" de perfecto, "Antes" de imperfecto. Op A2
 *   is weten wélke tijd moeilijker dan de vorm zelf maken; de opties zijn
 *   dus dezelfde persoon in de andere tijden.
 *
 * Beide: kiezen in doos 1–2, daarna zelf typen. Alles wordt berekend uit de
 * vervoegingen, er is geen zin voor geschreven. */

import { el, shuffle, sample, optionList, accentBar } from '../dom.js';
import { conjugatedForm, verbTranslation, PERSON_LABELS, TENSE_LABELS } from '../data.js';
import { checkAnswer, stripAccents } from '../check.js';
import { getProgress } from '../storage.js';
import { hintLadder } from '../hintLadder.js';
import { otherForms, describeForm } from './conjugation.js';

const CHOOSE_UP_TO_BOX = 2;
const WORD_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];
const tenseShort = t => (TENSE_LABELS[t] ?? t).split(' · ')[0];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const cap = s => s[0].toUpperCase() + s.slice(1);

/** De vorm van dit werkwoord die iemand bedoelde, ook zonder accent: "comio" → comió. */
const meantForm = (atom, given) => {
  const g = stripAccents(String(given ?? '').trim().toLowerCase());
  return otherForms(atom.verb, atom.form).find(f => stripAccents(f.toLowerCase()) === g) ?? null;
};

/* Werkwoorden die zelden met yo of tú gebruikt worden (me gusta, llueve):
 * "¿Gustaste ayer?" leert niemand iets. */
const SKIP_VERBS = new Set(['gustar', 'encantar', 'doler', 'parecer', 'interesar', 'llover', 'nevar', 'haber', 'hacer falta']);

/* ------------------------------------------------------------------ */
/* Antwoord op de vraag                                                */
/* ------------------------------------------------------------------ */

/* Een tijdsaanduiding die bij de tijd past, zodat vraag en antwoord kloppen. */
const QUESTION_MARKERS = {
  presente: ['todos los días', 'a menudo', 'los fines de semana'],
  indefinido: ['ayer', 'el sábado pasado', 'anoche'],
  imperfecto: ['de pequeño', 'antes', 'en aquella época'],
  perfecto: ['hoy', 'esta semana', 'alguna vez'],
  futuro: ['mañana', 'el año que viene'],
  continuo: ['ahora', 'en este momento'],
};

/** Wie antwoordt op wie: tú → yo, vosotros → nosotros. */
const ASKED = { '1s': '2s', '1p': '2p' };

/** De vorm in de vraag, of null als dit item geen antwoordvorm is. */
export function questionForm(atom) {
  if (atom.kind !== 'conjugation' || !ASKED[atom.person] || !QUESTION_MARKERS[atom.tense]) return null;
  if (SKIP_VERBS.has(atom.verb)) return null;
  const asked = conjugatedForm(atom.verb, atom.tense, ASKED[atom.person]);
  return asked && asked !== atom.form ? asked : null;
}

export const answerQuestion = {
  id: 'answerQuestion',
  label: 'Antwoord op de vraag',

  supports: item => Boolean(questionForm(item.atom)),

  render(item, root, ctx) {
    const { atom } = item;
    const asked = questionForm(atom);
    let marker = pick(QUESTION_MARKERS[atom.tense]);
    if (marker === 'de pequeño' && atom.person === '1p') marker = 'de pequeños';
    // "No, no he comido alguna vez" zegt niemand; dan is het "nunca".
    const negative = marker !== 'alguna vez' && Math.random() < 0.3;
    const nl = verbTranslation(atom.verb);

    root.append(
      el('p', { class: 'q-instruction' }, 'Antwoord op de vraag'),
      el('div', { class: 'chat' },
        el('p', { class: 'chat-bubble chat-bubble--them', lang: 'es' }, `¿${cap(asked)} ${marker}?`),
        el('p', { class: 'chat-bubble chat-bubble--me', lang: 'es' },
          negative ? 'No, no ' : 'Sí, ',
          el('span', { class: 'q-blank chat-gap' }, '___'),
          ` ${marker}.`)),
      el('p', { class: 'q-hint' }, [`${atom.verb}${nl ? ` = ${nl}` : ''}`, tenseShort(atom.tense)].join(' · ')),
    );
    const gap = root.querySelector('.chat-gap');

    const note = given => {
      if (!given) return null;
      if (given.trim().toLowerCase() === asked.toLowerCase()) {
        return `Je herhaalt de vorm uit de vraag. Op ${PERSON_LABELS[ASKED[atom.person]].split(' / ')[0]} antwoord je met ${PERSON_LABELS[atom.person].split(' / ')[0]}: ${atom.form}.`;
      }
      const meant = meantForm(atom, given);
      return meant ? describeForm(atom.verb, meant) : null;
    };

    if (getProgress(item.key).box <= CHOOSE_UP_TO_BOX) {
      const third = conjugatedForm(atom.verb, atom.tense, atom.person === '1s' ? '3s' : '3p');
      const options = [...new Set([atom.form, asked, third].filter(Boolean))];
      for (const f of sample(otherForms(atom.verb, atom.form).filter(f => !/\s/.test(f) || /\s/.test(atom.form)), 6)) {
        if (options.length >= 4) break;
        if (!options.includes(f)) options.push(f);
      }
      const opts = optionList(shuffle(options), {
        lang: 'es', compact: options.every(o => o.length < 12),
        onChoose: v => { gap.textContent = v; gap.classList.add('is-filled'); ctx.ready(true); },
      });
      root.append(opts.list);
      return {
        focus: opts.focus,
        check() {
          const ok = opts.chosen() === atom.form;
          return { correct: ok, expected: atom.form, given: opts.chosen(), note: ok ? null : note(opts.chosen()) };
        },
        reveal() { opts.reveal(atom.form); gap.textContent = atom.form; },
      };
    }

    const input = typedInput(root, ctx, `${PERSON_LABELS[atom.person]}, ${atom.verb}`);
    const hint = hintLadder(atom.form);
    root.append(hint.node);
    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, [atom.form], { rejectNear: otherForms(atom.verb, atom.form) });
        return hint.apply({ ...r, given: input.value, note: r.correct ? r.note : note(input.value) ?? r.note });
      },
      reveal(result) { gap.textContent = atom.form; finishInput(input, hint, result); },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Welke tijd?                                                         */
/* ------------------------------------------------------------------ */

/* Tijdsaanduidingen die maar één tijd toelaten. De futuro doet niet mee:
 * "mañana voy" is evengoed juist, en dat kunnen we niet uitleggen in één
 * regel. */
const TENSE_MARKERS = {
  presente: ['Normalmente', 'Todos los días', 'Casi siempre', 'Cada semana'],
  indefinido: ['Ayer', 'El año pasado', 'Anoche', 'La semana pasada', 'En 2015'],
  imperfecto: ['Antes', 'En aquella época', 'Antes, cada verano,', 'Antiguamente'],
  perfecto: ['Hoy', 'Esta mañana', 'Este año', 'Esta semana', 'Últimamente'],
};
export const CONTEXT_TENSES = Object.keys(TENSE_MARKERS);

/** Waarom deze tijd: één regel onder een fout antwoord. */
const WHY = {
  presente: 'een gewoonte nu → presente',
  indefinido: 'een afgesloten moment in het verleden → indefinido',
  imperfecto: 'een gewoonte of beschrijving in het verleden → imperfecto',
  perfecto: 'een periode die nog niet voorbij is → perfecto',
};

const SUBJECT = { '1s': 'yo', '2s': 'tú', '3s': 'él', '1p': 'nosotros', '2p': 'vosotros', '3p': 'ellos' };

/** Dezelfde persoon in de andere tijden, zonder de vorm zelf. */
export function tenseAlternatives(atom) {
  return CONTEXT_TENSES.filter(t => t !== atom.tense)
    .map(t => ({ tense: t, form: conjugatedForm(atom.verb, t, atom.person) }))
    .filter(x => x.form && x.form !== atom.form);
}

export const tenseContext = {
  id: 'tenseContext',
  label: 'Welke tijd?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'conjugation' && CONTEXT_TENSES.includes(a.tense) && !SKIP_VERBS.has(a.verb)
      && tenseAlternatives(a).length >= 2;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const marker = pick(TENSE_MARKERS[atom.tense]);
    const nl = verbTranslation(atom.verb);
    // Valt de vorm in twee tijden samen (hablamos), dan is ze in beide juist:
    // tenseAlternatives laat zo'n gelijke vorm al weg.
    const accepted = [atom.form];

    root.append(
      el('p', { class: 'q-instruction' }, 'Welke tijd past bij de tijdsaanduiding?'),
      el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
        el('strong', { class: 'tense-marker' }, marker), el('span', {}, SUBJECT[atom.person]),
        el('span', { class: 'q-blank tense-gap' }, '___'),
        el('span', { class: 'q-infinitive' }, `(${atom.verb}).`)),
    );
    if (nl) root.append(el('p', { class: 'q-hint' }, `${atom.verb} = ${nl}`));
    const gap = root.querySelector('.tense-gap');
    const note = given => {
      const meant = meantForm(atom, given);
      const other = tenseAlternatives(atom).find(x => x.form === meant);
      return `„${marker.replace(/,$/, '')}”: ${WHY[atom.tense]}.${other ? ` ${other.form} is de ${tenseShort(other.tense)}.` : ''}`;
    };

    if (getProgress(item.key).box <= CHOOSE_UP_TO_BOX) {
      const options = [...new Set([atom.form, ...tenseAlternatives(atom).map(x => x.form)])];
      const opts = optionList(shuffle(options), {
        lang: 'es', compact: options.every(o => o.length < 12),
        onChoose: v => { gap.textContent = v; gap.classList.add('is-filled'); ctx.ready(true); },
      });
      root.append(opts.list);
      return {
        focus: opts.focus,
        check() {
          const ok = accepted.includes(opts.chosen());
          return { correct: ok, expected: atom.form, given: opts.chosen(), note: ok ? null : note(opts.chosen()) };
        },
        reveal() { opts.reveal(atom.form); gap.textContent = atom.form; },
      };
    }

    const input = typedInput(root, ctx, `${SUBJECT[atom.person]}, ${atom.verb}`);
    const hint = hintLadder(atom.form);
    root.append(hint.node);
    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, accepted, { rejectNear: otherForms(atom.verb, atom.form) });
        return hint.apply({ ...r, given: input.value, note: r.correct ? r.note : note(input.value) });
      },
      reveal(result) { gap.textContent = atom.form; finishInput(input, hint, result); },
    };
  },
};

/* ------------------------------------------------------------------ */

function typedInput(root, ctx, label) {
  const input = el('input', {
    class: 'answer-input', type: 'text', lang: 'es',
    autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
    placeholder: 'en español…', 'aria-label': label,
    oninput: () => ctx.ready(input.value.trim().length > 0),
    onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
  });
  root.append(input, accentBar(input, () => ctx.ready(input.value.trim().length > 0), WORD_KEYS));
  return input;
}

function finishInput(input, hint, { correct, almost }) {
  input.disabled = true;
  hint.disable();
  input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
}
