/* El, la, los of las? Een minuscule oefening met een groot rendement:
 * het geslacht van een Spaans zelfstandig naamwoord moet je gewoon kennen. */

import { el } from '../dom.js';
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
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk lidwoord hoort hierbij?'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word' },
          el('span', { class: 'q-blank' }, '___'), ' ', noun),
      ),
      el('p', { class: 'q-hint' }, atom.nl[0]),
    );

    const list = el('div', { class: 'options options--compact' });
    for (const form of FORMS) {
      list.append(el('button', {
        class: 'option', type: 'button', dataset: { value: form },
        onclick: () => {
          chosen = form;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === form));
          ctx.ready(true);
        },
      }, form));
    }
    root.append(list);

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check: () => ({ correct: chosen === correct, expected: `${correct} ${noun}`, note: null, given: chosen }),
      reveal({ correct: ok }) {
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === correct) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !ok) b.classList.add('is-wrong');
        });
      },
    };
  },
};
