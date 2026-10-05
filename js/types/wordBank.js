/* Bouw de zin met woordtegels — de klassieke Duolingo-beweging.
 * Tikken voegt een woord toe, nogmaals tikken haalt het weer weg.
 *
 * De tegels verraden de volgorde niet: geen hoofdletter op het eerste woord,
 * geen punt of vraagteken aan het laatste. En wie de zin al wat kent (doos 3
 * en hoger), krijgt er een of twee lokwoorden bij: een andere persoon van het
 * werkwoord, of het verkeerde lidwoord. */

import { el, shuffle, sample, speakerButton } from '../dom.js';
import { checkAnswer, isKnownWord } from '../check.js';
import { allAtoms, conjugationFamily, conjugationsOfForm } from '../data.js';
import * as storage from '../storage.js';
import * as audio from '../audio.js';

/** Losse woorden. */
export const tokenize = s => s.trim().split(/\s+/).filter(Boolean);

/** Een tegel zonder leestekens aan de randen: "¿Dónde" → "Dónde", "tal?" → "tal". */
export const bare = w => w.replace(/^[¿¡"«(]+|[.,;:!?"»)…]+$/g, '');

/* Woorden die ergens midden in een zin met een kleine letter staan. Wat daar
 * niet bij zit en met een hoofdletter begint, is een naam ("María", "Madrid"). */
let lowerWords = null;
function lowercaseWords() {
  if (!lowerWords) {
    lowerWords = new Set();
    for (const a of allAtoms()) {
      if (a.kind !== 'sentence' && a.kind !== 'dialogue') continue;
      for (const w of tokenize(a.es).slice(1).map(bare)) if (/^\p{Ll}/u.test(w)) lowerWords.add(w);
    }
  }
  return lowerWords;
}

/** Het eerste woord in kleine letters, tenzij het een naam is. */
const uncap = w => {
  const low = w.charAt(0).toLowerCase() + w.slice(1);
  return low !== w && (lowercaseWords().has(low) || isKnownWord(low)) ? low : w;
};

const ARTICLE_SWAP = { el: 'la', la: 'el', los: 'las', las: 'los', un: 'una', una: 'un' };

/** Lokwoorden die er net naast zitten. Nooit een woord dat al in de zin staat. */
function decoys(words, n) {
  const inSentence = new Set(words.map(w => w.toLowerCase()));
  const out = new Set();
  for (const w of shuffle(words)) {
    const low = w.toLowerCase();
    // Een vervoegde vorm: een andere persoon in dezelfde tijd.
    const conj = conjugationsOfForm(low)[0];
    if (conj) {
      const other = sample(conjugationFamily(conj).map(a => a.form)
        .filter(f => !f.includes(' ') && !inSentence.has(f.toLowerCase())), 1)[0];
      if (other) out.add(other);
    }
    if (ARTICLE_SWAP[low] && !inSentence.has(ARTICLE_SWAP[low])) out.add(ARTICLE_SWAP[low]);
    if (out.size >= n) break;
  }
  return [...out].slice(0, n);
}

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
    const words = tokenize(atom.es).map(bare).filter(Boolean);
    words[0] = uncap(words[0]);
    const extra = storage.getProgress(item.key).box >= 3 ? decoys(words, words.length > 5 ? 2 : 1) : [];
    const chosen = [];

    root.append(
      el('p', { class: 'q-instruction' }, 'Bouw de Spaanse zin'),
      el('div', { class: 'q-prompt q-prompt--sentence' },
        el('span', { class: 'q-word' }, atom.nl)),
    );
    if (extra.length) {
      root.append(el('p', { class: 'q-hint' },
        extra.length === 1 ? 'Eén tegel is te veel.' : `${extra.length} tegels zijn te veel.`));
    }

    const answerRow = el('div', { class: 'wordbank-answer', role: 'group', 'aria-label': 'Jouw zin' });
    const bankRow = el('div', { class: 'wordbank-bank', role: 'group', 'aria-label': 'Woorden' });
    root.append(answerRow, bankRow);

    // Tegels krijgen een vaste index, zodat dezelfde woordvorm twee keer kan
    // voorkomen zonder dat de verkeerde tegel terugspringt.
    const tiles = shuffle([...words, ...extra].map((w, i) => ({ w, i })));

    /** Tekent opnieuw en zet de focus terug waar je was: anders begint een
     *  toetsenbordgebruiker na elke tik weer vooraan. */
    function redraw(focusRow = null, focusAt = 0) {
      answerRow.replaceChildren(...chosen.map((t, i) =>
        el('button', {
          class: 'tile tile--placed', type: 'button', lang: 'es',
          onclick: () => {
            chosen.splice(chosen.indexOf(t), 1);
            audio.tap();
            redraw(answerRow, i);
          },
        }, t.w)));

      bankRow.replaceChildren(...tiles.map((t, i) => {
        const used = chosen.includes(t);
        return el('button', {
          class: `tile${used ? ' is-used' : ''}`, type: 'button', lang: 'es',
          disabled: used,
          onclick: () => { chosen.push(t); audio.tap(); redraw(bankRow, i); },
        }, t.w);
      }));

      if (focusRow) {
        const live = [...focusRow.children].filter(b => !b.disabled);
        const target = live.find(b => [...focusRow.children].indexOf(b) >= focusAt) ?? live.at(-1)
          ?? (focusRow === answerRow ? bankRow : answerRow).querySelector('.tile:not(:disabled)');
        target?.focus();
      }

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
        // Dezelfde controle als bij intypen: ¿ ¡ en komma's tellen niet mee.
        // Een typefout kan hier niet, de tegels liggen vast.
        const r = checkAnswer(built(), [atom.es], { rejectNear: [built()] });
        const used = chosen.filter(t => extra.includes(t.w) && !words.includes(t.w)).map(t => t.w);
        const note = !r.correct && used.length ? `${used.join(', ')} hoorde${used.length > 1 ? 'n' : ''} er niet bij.` : r.note;
        return { ...r, note, given: built() };
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
