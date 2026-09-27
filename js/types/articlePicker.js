/* El, la, los of las? Een minuscule oefening met een groot rendement:
 * het geslacht van een Spaans zelfstandig naamwoord moet je gewoon kennen. */

import { el, optionList } from '../dom.js';
import { showEmoji } from '../scheduler.js';

const FORMS = ['el', 'la', 'los', 'las'];

const articleOf = atom =>
  atom.number === 'pl' ? (atom.gender === 'f' ? 'las' : 'los')
                       : (atom.gender === 'f' ? 'la' : 'el');

/** Het kale woord, zonder lidwoord. */
const bareNoun = atom => atom.es.replace(/^(el|la|los|las)\s+/i, '');

export default {
  id: 'articlePicker',
  label: 'Lidwoord',

  supports(item) {
    const a = item.atom;
    return a.kind === 'vocab'
      && Boolean(a.gender) && Boolean(a.number)
      && /^(el|la|los|las)\s+/i.test(a.es);   // enkel echte zelfstandige naamwoorden
  },

  render(item, root, ctx) {
    const { atom } = item;
    const correct = articleOf(atom);
    const noun = bareNoun(atom);

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk lidwoord hoort hierbij?'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word', lang: 'es' },
          el('span', { class: 'q-blank' }, '___'), ' ', noun),
      ),
      el('p', { class: 'q-hint' }, atom.nl[0]),
    );

    const opts = optionList(FORMS, { compact: true, lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({
        correct: opts.chosen() === correct, expected: `${correct} ${noun}`,
        note: `${correct} ${noun} = ${atom.nl[0]}`, given: opts.chosen(),
      }),
      reveal() { opts.reveal(correct); },
    };
  },
};
