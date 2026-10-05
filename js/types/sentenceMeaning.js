/* Wat betekent de zin? Een Spaanse zin, vier Nederlandse vertalingen. De
 * afleiders komen uit hetzelfde thema, zodat ze over hetzelfde gaan en je
 * de zin echt moet lezen. */

import { el, shuffle, sample, optionList, speakerButton } from '../dom.js';
import { siblings } from '../data.js';

const OPTIONS = 4;

/** Drie andere vertalingen uit het thema, of minder als er geen zijn. */
export function meaningDistractors(atom) {
  const seen = new Set([atom.nl]);
  const out = [];
  for (const o of shuffle(siblings(atom))) {
    if (typeof o.nl !== 'string' || seen.has(o.nl) || o.es === atom.es) continue;
    seen.add(o.nl);
    out.push(o.nl);
  }
  return out.slice(0, OPTIONS - 1);
}

export default {
  id: 'sentenceMeaning',
  label: 'Wat betekent de zin?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'sentence' && typeof a.nl === 'string' && a.nl.length > 0
      && meaningDistractors(a).length >= OPTIONS - 1;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const options = shuffle([atom.nl, ...sample(meaningDistractors(atom), OPTIONS - 1)]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Wat betekent deze zin?'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-sentence', lang: 'es' }, atom.es),
        speakerButton(atom.es, ctx.speech)),
    );

    const opts = optionList(options, { lang: 'nl', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        return { correct: chosen === atom.nl, expected: atom.nl, note: null, given: chosen };
      },
      reveal() { opts.reveal(atom.nl); },
    };
  },
};
