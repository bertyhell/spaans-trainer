/* El, la, los of las? Een minuscule oefening met een groot rendement:
 * het geslacht van een Spaans zelfstandig naamwoord moet je gewoon kennen. */

import { el, optionList } from '../dom.js';
import { showEmoji } from '../scheduler.js';
import { genderRule } from '../hints.js';

const FORMS = ['el', 'la', 'los', 'las'];

/* Het lidwoord zoals het in de woordenlijst staat, niet afgeleid uit het
 * geslacht: "el agua" is vrouwelijk maar krijgt toch el. */
const articleOf = atom => atom.es.match(/^(el|la|los|las)\s+/i)[1].toLowerCase();

/** Het kale woord, zonder lidwoord. */
const bareNoun = atom => atom.es.replace(/^(el|la|los|las)\s+/i, '');

export default {
  id: 'articlePicker',
  label: 'Lidwoord',

  supports(item) {
    const a = item.atom;
    // Herkennen, niet produceren: telt mee voor de es→nl-kant van het woord.
    return a.kind === 'vocab' && item.direction === 'es2nl'
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
      check() {
        const ok = opts.chosen() === correct;
        return {
          correct: ok, expected: `${correct} ${noun} = ${atom.nl[0]}`,
          note: ok ? null : genderRule(atom), given: opts.chosen(),
        };
      },
      reveal() { opts.reveal(correct); },
    };
  },
};
