/* Bouw de zin met woordtegels — de klassieke Duolingo-beweging.
 * Tikken voegt een woord toe, nogmaals tikken haalt het weer weg. */

import { el, shuffle, speakerButton } from '../dom.js';
import { normalize } from '../check.js';

/** Losse woorden, leestekens blijven aan het woord plakken. */
const tokenize = s => s.trim().split(/\s+/).filter(Boolean);

export default {
  id: 'wordBank',
  label: 'Zin bouwen',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'sentence' && a.kind !== 'lyric') return false;
    const n = tokenize(a.es).length;
    return n >= 3 && n <= 9;   // korter is triviaal, langer past niet op een gsm
  },

  render(item, root, ctx) {
    const { atom } = item;
    const words = tokenize(atom.es);
    const chosen = [];

    root.append(
      el('p', { class: 'q-instruction' }, 'Bouw de Spaanse zin'),
      el('div', { class: 'q-prompt q-prompt--sentence' },
        el('span', { class: 'q-word' }, atom.nl)),
    );

    const answerRow = el('div', { class: 'wordbank-answer', 'aria-label': 'Jouw zin' });
    const bankRow = el('div', { class: 'wordbank-bank' });
    root.append(answerRow, bankRow);

    // Tegels krijgen een vaste index, zodat dezelfde woordvorm twee keer kan
    // voorkomen zonder dat de verkeerde tegel terugspringt.
    const tiles = shuffle(words.map((w, i) => ({ w, i })));

    function redraw() {
      answerRow.replaceChildren(...chosen.map(t =>
        el('button', {
          class: 'tile tile--placed', type: 'button',
          onclick: () => {
            chosen.splice(chosen.indexOf(t), 1);
            redraw();
          },
        }, t.w)));

      bankRow.replaceChildren(...tiles.map(t => {
        const used = chosen.includes(t);
        return el('button', {
          class: `tile${used ? ' is-used' : ''}`, type: 'button',
          disabled: used,
          onclick: () => { chosen.push(t); redraw(); },
        }, t.w);
      }));

      ctx.ready(chosen.length > 0);
    }
    redraw();

    // Reserveer vooraf genoeg hoogte voor de volledige zin, zodat de woordbank
    // niet verspringt wanneer het antwoord naar een nieuwe regel overloopt.
    // Meet zowel de juiste als de geschudde volgorde en neem de hoogste.
    function reserveHeight() {
      if (!answerRow.isConnected) { window.removeEventListener('resize', reserveHeight); return; }
      const saved = [...answerRow.children];
      answerRow.style.minHeight = '';
      let max = 0;
      for (const order of [words.map((w, i) => ({ w, i })), tiles]) {
        answerRow.replaceChildren(...order.map(t =>
          el('button', { class: 'tile tile--placed', type: 'button', tabindex: -1, style: 'visibility:hidden' }, t.w)));
        max = Math.max(max, answerRow.getBoundingClientRect().height);
      }
      answerRow.replaceChildren(...saved);
      answerRow.style.minHeight = `${Math.ceil(max)}px`;
    }
    requestAnimationFrame(reserveHeight);
    window.addEventListener('resize', reserveHeight);

    const built = () => chosen.map(t => t.w).join(' ');

    return {
      focus() { bankRow.querySelector('.tile:not(.is-used)')?.focus(); },
      check() {
        const correct = normalize(built()) === normalize(atom.es);
        return { correct, expected: atom.es, note: null, given: built() };
      },
      reveal({ correct }) {
        answerRow.classList.add(correct ? 'is-correct' : 'is-wrong');
        [...answerRow.children, ...bankRow.children].forEach(b => { b.disabled = true; });
        const sb = speakerButton(atom.es, ctx.speech);
        if (sb) answerRow.after(el('div', { class: 'wordbank-play' }, sb));
      },
    };
  },
};
