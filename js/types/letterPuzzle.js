/* Letterpuzzel: je ziet het Nederlandse woord en legt het Spaanse uit
 * geschudde letters. Tussen herkennen en zelf schrijven in: de letters staan
 * er al, maar de volgorde en de spelling moet je zelf kennen.
 *
 * Accenten zitten op de tegels zelf (ó is een andere tegel dan o). Wie het
 * woord al wat kent (doos 3 en hoger), krijgt er een lokletter bij: liefst het
 * kale broertje van een letter met accent, zodat je moet kiezen. */

import { el, shuffle, speakerButton } from '../dom.js';
import { vocabPrompt } from '../data.js';
import { checkAnswer, expandVariants, stripAccents } from '../check.js';
import { showEmoji } from '../scheduler.js';
import * as storage from '../storage.js';
import * as audio from '../audio.js';

const MIN_LETTERS = 3;
const MAX_LETTERS = 10;
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/** "la camisa" → { article: "la", word: "camisa" }; null als het geen los woord is. */
export function puzzleWord(es) {
  const first = expandVariants(es)[0] ?? '';
  const m = first.match(/^(?:(el|la|los|las|un|una) )?(\p{Ll}+)$/u);
  if (!m) return null;
  const [, article = null, word] = m;
  const n = [...word].length;
  return n >= MIN_LETTERS && n <= MAX_LETTERS ? { article, word } : null;
}

/** De lokletter: o naast ó, n naast ñ, anders een klinker die er niet in zit. */
export function decoyLetter(word) {
  const letters = [...word];
  const marked = letters.find(ch => stripAccents(ch) !== ch || ch === 'ñ');
  if (marked) return marked === 'ñ' ? 'n' : stripAccents(marked);
  return shuffle(VOWELS.filter(v => !letters.includes(v)))[0] ?? null;
}

/**
 * Geschudde letters, eventueel met een lokletter. Nooit in de juiste volgorde,
 * tenzij dat niet anders kan (alle letters gelijk).
 */
export function scramble(word, { decoy = null } = {}) {
  const letters = [...word];
  const tiles = decoy ? [...letters, decoy] : letters;
  if (new Set(letters).size < 2) return shuffle(tiles);
  for (let tries = 0; tries < 20; tries++) {
    const out = shuffle(tiles);
    if (out.slice(0, letters.length).join('') !== word) return out;
  }
  // Pech gehad: draai dan gewoon om.
  return tiles.slice().reverse();
}

export default {
  id: 'letterPuzzle',
  label: 'Letterpuzzel',

  supports(item) {
    return item.atom.kind === 'vocab' && item.direction === 'nl2es' && Boolean(puzzleWord(item.atom.es));
  },

  render(item, root, ctx) {
    const { atom } = item;
    const { article, word } = puzzleWord(atom.es);
    const letters = [...word];
    const decoy = storage.getProgress(item.key).box >= 3 ? decoyLetter(word) : null;
    // Elke tegel een vaste index: een letter die twee keer voorkomt, springt
    // anders op de verkeerde plaats terug.
    const tiles = scramble(word, { decoy }).map((ch, i) => ({ ch, i }));
    const placed = [];
    let locked = false;

    root.append(
      el('p', { class: 'q-instruction' }, 'Leg het Spaanse woord'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word', lang: 'nl' }, vocabPrompt(atom, 'nl2es'))),
    );
    if (decoy) root.append(el('p', { class: 'q-hint' }, 'Eén letter is te veel.'));

    const slotRow = el('div', { class: 'letter-slots', role: 'group', 'aria-label': 'Jouw woord', lang: 'es' });
    const bankRow = el('div', { class: 'letter-bank', role: 'group', 'aria-label': 'Letters', lang: 'es' });
    const backspace = el('button', {
      class: 'tile letter-back', type: 'button', 'aria-label': 'Laatste letter weg',
      onclick: () => { if (placed.length) { placed.pop(); audio.tap(); redraw(); } },
    }, '⌫');
    root.append(
      el('div', { class: 'letter-line' },
        article ? el('span', { class: 'letter-article', lang: 'es' }, article) : null,
        slotRow),
      el('div', { class: 'letter-tray' }, bankRow, backspace),
    );

    function place(t) {
      if (locked || placed.includes(t) || placed.length >= letters.length) return;
      placed.push(t);
      audio.tap();
      redraw();
    }

    function redraw() {
      slotRow.replaceChildren(...letters.map((_, i) => {
        const t = placed[i];
        return el('button', {
          class: `letter-slot${t ? ' is-filled' : ''}`, type: 'button',
          disabled: !t || locked, 'aria-label': t ? `${t.ch}, tik om terug te leggen` : 'leeg',
          onclick: () => { placed.splice(i, 1); audio.tap(); redraw(); },
        }, t ? t.ch : '');
      }));
      bankRow.replaceChildren(...tiles.map(t => {
        const used = placed.includes(t);
        return el('button', {
          class: `tile letter-tile${used ? ' is-used' : ''}`, type: 'button',
          disabled: used || locked, onclick: () => place(t),
        }, t.ch);
      }));
      backspace.disabled = locked || !placed.length;
      ctx.ready(placed.length === letters.length);
    }
    redraw();

    // Met een echt toetsenbord typ je gewoon: de letter pakt de eerste vrije tegel.
    function onKey(e) {
      if (!root.contains(slotRow)) { document.removeEventListener('keydown', onKey); return; }
      if (locked || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Backspace') { e.preventDefault(); backspace.click(); return; }
      if (e.key === 'Enter' && placed.length === letters.length) { e.preventDefault(); ctx.submit(); return; }
      const t = e.key.length === 1 && tiles.find(x => x.ch === e.key.toLowerCase() && !placed.includes(x));
      if (t) { e.preventDefault(); place(t); }
    }
    document.addEventListener('keydown', onKey);

    const built = () => placed.map(t => t.ch).join('');

    return {
      focus() { bankRow.querySelector('.letter-tile:not(:disabled)')?.focus(); },
      check() {
        const given = built();
        // Streng op accenten, zoals bij Accenten: de tegels laten geen typfout toe,
        // dus wat niet exact is, is een keuze die niet klopt.
        const r = checkAnswer(given, [word], { strictAccents: true });
        const expected = article ? `${article} ${word}` : word;
        if (r.correct && !r.almost) return { correct: true, expected, note: null, given };
        const flat = s => stripAccents(s).replace(/ñ/g, 'n');
        const accentOnly = flat(given) === flat(word);
        return {
          correct: false, expected, given,
          note: accentOnly ? `Let op het accent: ${word}.` : null,
        };
      },
      reveal({ correct }) {
        locked = true;
        redraw();
        slotRow.classList.add(correct ? 'is-correct' : 'is-wrong');
        if (!correct) {
          slotRow.parentElement.after(el('p', { class: 'letter-fix', lang: 'es' }, `✓ ${article ? `${article} ` : ''}${word}`));
        }
        const sb = speakerButton(atom.es, ctx.speech);
        if (sb) root.querySelector('.q-prompt').append(sb);
      },
    };
  },
};
