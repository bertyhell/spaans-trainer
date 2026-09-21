/* Welk woord hoort er niet bij? Het vreemde woord komt uit een ánder thema,
 * de rest uit hetzelfde. Goedkope afwisseling tussen de zwaardere vormen. */

import { el, shuffle, sample } from '../dom.js';
import { siblings, allAtoms } from '../data.js';

export default {
  id: 'oddOneOut',
  label: 'Welk woord hoort er niet bij?',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'vocab') return false;
    if (siblings(a).length < 2) return false;
    return allAtoms().some(o => o.kind === 'vocab' && o.theme !== a.theme);
  },

  render(item, root, ctx) {
    const { atom } = item;

    // Het atoom zelf plus twee themagenoten vormen de "horen bij elkaar"-groep.
    const family = [atom, ...sample(siblings(atom), 2)];
    const outsiders = allAtoms().filter(o => o.kind === 'vocab' && o.theme !== atom.theme);
    const odd = sample(outsiders, 1)[0];

    const options = shuffle([...family, odd]);
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk woord hoort er niet bij?'),
      el('p', { class: 'q-hint' }, 'De andere drie horen bij hetzelfde thema.'),
    );

    const list = el('div', { class: 'options' });
    for (const o of options) {
      list.append(el('button', {
        class: 'option', type: 'button', dataset: { value: o.id },
        onclick: () => {
          chosen = o.id;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === o.id));
          ctx.ready(true);
        },
      }, o.emoji ? `${o.emoji} ${o.es}` : o.es));
    }
    root.append(list);

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check: () => ({
        correct: chosen === odd.id,
        expected: `${odd.es} — hoort bij een ander thema`,
        note: null, given: chosen,
      }),
      reveal({ correct }) {
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === odd.id) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !correct) b.classList.add('is-wrong');
        });
      },
    };
  },
};
