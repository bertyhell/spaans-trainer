/* Welk woord hoort er niet bij? Het vreemde woord komt uit een ánder thema,
 * de rest uit hetzelfde. Goedkope afwisseling tussen de zwaardere vormen.
 *
 * Twee dingen mogen de vraag niet verraden. De vier woorden moeten van
 * dezelfde soort zijn — staat er één werkwoord tussen drie zelfstandige
 * naamwoorden, dan wijs je dat aan zonder een woord te kennen. En ze hebben
 * allemaal een emoji of geen van allen, want die ene kale knop valt net zo
 * hard op. */

import { el, shuffle, sample } from '../dom.js';
import { siblings, allAtoms, getTheme } from '../data.js';

const OPTIONS = 4;

const wordClass = a => a.pos ?? 'other';

/** Themagenoten van dezelfde woordsoort — de "horen bij elkaar"-groep. */
const family = atom => siblings(atom).filter(o => wordClass(o) === wordClass(atom));

/** Woorden uit een ander thema, van dezelfde soort als het gevraagde woord. */
const outsidersFor = atom => allAtoms().filter(o =>
  o.kind === 'vocab' && o.theme !== atom.theme && wordClass(o) === wordClass(atom));

export default {
  id: 'oddOneOut',
  label: 'Welk woord hoort er niet bij?',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'vocab') return false;
    if (family(a).length < OPTIONS - 2) return false;
    return outsidersFor(a).length > 0;
  },

  render(item, root, ctx) {
    const { atom } = item;

    const odd = sample(outsidersFor(atom), 1)[0];
    const options = shuffle([atom, ...sample(family(atom), OPTIONS - 2), odd]);
    // Alles of niets: één emoji tussen kale woorden is al een antwoord.
    const withEmoji = options.every(o => o.emoji);

    const theme = getTheme(atom.theme);
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk woord hoort er niet bij?'),
      el('p', { class: 'q-hint' },
        `De andere drie horen bij het thema "${theme?.label ?? 'hetzelfde'}".`),
    );

    const list = el('div', { class: 'options' });
    for (const o of options) {
      list.append(el('button', {
        class: 'option option--odd', type: 'button', dataset: { value: o.id },
        onclick: () => {
          chosen = o.id;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === o.id));
          ctx.ready(true);
        },
      },
        el('span', { class: 'option-word' },
          withEmoji ? el('span', { class: 'option-emoji' }, o.emoji) : null,
          o.es),
        // Pas bij het nakijken zichtbaar: tijdens de vraag zou het de vertaling
        // weggeven, achteraf is het precies wat je wil zien.
        el('span', { class: 'option-nl' }, o.nl[0]),
      ));
    }
    root.append(list);

    const named = a => `${a.es} (${a.nl[0]})`;
    const oddTheme = getTheme(odd.theme)?.label;

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check() {
        const picked = options.find(o => o.id === chosen);
        return {
          correct: chosen === odd.id,
          expected: `${named(odd)} — hoort bij "${oddTheme ?? 'een ander thema'}"`,
          // Benoem ook wat je fout aanwees, met vertaling: anders weet je wel
          // welk woord het was, maar niet waarom het jouwe er wél bij hoorde.
          note: picked && picked !== odd
            ? `${named(picked)} hoort wél bij "${theme?.label ?? 'dit thema'}".`
            : null,
          given: chosen,
        };
      },
      reveal({ correct }) {
        list.classList.add('is-revealed');
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === odd.id) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !correct) b.classList.add('is-wrong');
        });
      },
    };
  },
};
