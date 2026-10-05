/* Welke zin klopt? Dezelfde zin drie keer, twee keer met een fout erin van
 * zoek-de-fout (lidwoord of vervoeging). Lichter dan zoek de fout: je hoeft
 * het woord niet aan te wijzen, alleen te zien dat iets niet klopt. */

import { el, shuffle, optionList, speakerButton } from '../dom.js';
import { corruptionsFor, corruptedWords } from './spotError.js';

/** Tot twee verschillende foute versies van de zin. */
export function wrongSentences(atom) {
  const out = new Map();
  for (const c of shuffle(corruptionsFor(atom))) {
    for (const w of shuffle(c.wrongs)) {
      const s = corruptedWords(atom, c, w).join(' ');
      if (s !== atom.es && !out.has(s)) { out.set(s, c.note(w)); break; }
    }
    if (out.size >= 2) break;
  }
  // Eén fout met meerdere vervangingen: "yo comes" en "yo comemos".
  if (out.size < 2) {
    for (const c of corruptionsFor(atom)) {
      for (const w of c.wrongs) {
        const s = corruptedWords(atom, c, w).join(' ');
        if (s !== atom.es && !out.has(s)) out.set(s, c.note(w));
        if (out.size >= 2) break;
      }
      if (out.size >= 2) break;
    }
  }
  return [...out].map(([text, note]) => ({ text, note }));
}

export default {
  id: 'pickSentence',
  label: 'Welke zin klopt?',

  supports: item => wrongSentences(item.atom).length >= 2,

  render(item, root, ctx) {
    const { atom } = item;
    const wrongs = wrongSentences(atom);
    const options = shuffle([{ text: atom.es, note: null }, ...wrongs]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Welke zin is juist?'),
      atom.nl ? el('p', { class: 'q-hint' }, atom.nl) : null,
    );

    const opts = optionList(options.map(o => o.text), { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        const hit = options.find(o => o.text === chosen);
        return { correct: chosen === atom.es, expected: atom.es, note: hit?.note ?? null, given: chosen };
      },
      reveal() {
        opts.reveal(atom.es);
        const sb = speakerButton(atom.es, ctx.speech);
        if (sb) opts.list.after(el('div', { class: 'wordbank-play' }, sb));
      },
    };
  },
};
