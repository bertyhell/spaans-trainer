/* Dictee: je hoort een zin uit de cursus en schrijft hem op. Luisteren,
 * spellen en woordgrenzen horen in één beweging. Alleen met een Spaanse stem.
 *
 * Bij een fout zie je welke woorden niet klopten, niet enkel "fout": een
 * zin van acht woorden met één vergeten accent moet je niet helemaal opnieuw
 * hoeven te vergelijken. */

import { el, accentBar } from '../dom.js';
import { checkAnswer, normalize, stripAccents } from '../check.js';

const words = s => normalize(s).split(' ').filter(Boolean);
const MIN_WORDS = 3;
const MAX_WORDS = 10;

/** Langste gemeenschappelijke deelrij van woorden; wat buiten valt is fout of vergeten. */
export function wordDiff(given, expected) {
  const a = words(given);
  const b = words(expected);
  const same = (x, y) => stripAccents(x) === stripAccents(y);
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      L[i][j] = same(a[i], b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    }
  }
  const missed = [];
  const accents = [];
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && same(a[i], b[j])) {
      if (a[i] !== b[j]) accents.push(b[j]);
      i++; j++;
    } else if (i < a.length && L[i + 1][j] >= L[i][j + 1]) i++;
    else { missed.push(b[j]); j++; }
  }
  return { missed, accents };
}

function noteFor(given, expected) {
  const { missed, accents } = wordDiff(given, expected);
  const parts = [];
  if (missed.length) parts.push(`Fout of vergeten: ${missed.join(', ')}`);
  if (accents.length) parts.push(`Let op het accent: ${accents.join(', ')}`);
  return parts.length ? `${parts.join('. ')}.` : null;
}

export default {
  id: 'dictation',
  label: 'Dictee',

  supports(item, { speech }) {
    const a = item.atom;
    if (a.kind !== 'sentence' && a.kind !== 'dialogue') return false;
    if (!speech.available()) return false;
    const n = words(a.es).length;
    return n >= MIN_WORDS && n <= MAX_WORDS;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const play = (rate) => ctx.speech.speak(atom.es, rate ? { rate } : undefined);

    root.append(
      el('p', { class: 'q-instruction' }, 'Dictee: schrijf op wat je hoort'),
      el('div', { class: 'q-prompt q-prompt--audio' },
        el('button', { class: 'play-big', type: 'button', 'aria-label': 'Speel opnieuw af', onclick: () => play() }, '🔊'),
        el('button', { class: 'play-slow', type: 'button', 'aria-label': 'Speel traag af', onclick: () => play(0.6) }, '🐢')),
    );
    setTimeout(() => play(), 250);

    const input = el('textarea', {
      class: 'answer-input answer-input--long', lang: 'es', rows: 2,
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      placeholder: 'en español…', 'aria-label': 'Wat je hoort',
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    root.append(input, accentBar(input, () => ctx.ready(input.value.trim().length > 0)));

    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, [atom.es]);
        const note = r.correct && !r.almost ? null : noteFor(input.value, atom.es) ?? r.note;
        return { ...r, note, given: input.value };
      },
      reveal({ correct, almost }) {
        input.disabled = true;
        input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
        if (atom.nl) root.append(el('p', { class: 'q-hint' }, atom.nl));
      },
    };
  },
};
