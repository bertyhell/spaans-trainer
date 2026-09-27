/* Welk woord hoort er niet bij? Het vreemde woord komt uit een ánder thema,
 * de rest uit hetzelfde. Goedkope afwisseling tussen de zwaardere vormen.
 *
 * Twee dingen mogen de vraag niet verraden. De vier woorden moeten van
 * dezelfde soort zijn — staat er één werkwoord tussen drie zelfstandige
 * naamwoorden, dan wijs je dat aan zonder een woord te kennen. En ze hebben
 * allemaal een emoji of geen van allen, want die ene kale knop valt net zo
 * hard op.
 *
 * Werkwoorden vragen we alleen tussen activiteitenthema's ("praten en
 * luisteren", "gaan en komen"). Thema's als "regelmatig op -ar" zou je aan de
 * uitgang herkennen, en hobby's, sport en vrije tijd lopen zo door elkaar dat
 * "zwemmen" en "schaatsen" allebei overal bij passen. */

import { el, shuffle, sample, optionList } from '../dom.js';
import { siblings, allAtoms, getTheme } from '../data.js';
import { showEmoji } from '../scheduler.js';

const OPTIONS = 4;

const wordClass = a => a.pos ?? 'other';

const isActivity = themeId => getTheme(themeId)?.activity === true;

/** Themagenoten van dezelfde woordsoort — de "horen bij elkaar"-groep. */
const family = atom => siblings(atom).filter(o => wordClass(o) === wordClass(atom));

/** Woorden uit een ander thema, van dezelfde soort als het gevraagde woord.
 *  Per thema en woordsoort één keer berekend: supports() loopt voor elk item
 *  van een selectie, en anders telkens door de hele cursus. */
const outsiders = new Map();
function outsidersFor(atom) {
  const key = `${atom.theme}|${wordClass(atom)}`;
  if (!outsiders.has(key)) {
    outsiders.set(key, allAtoms().filter(o =>
      o.kind === 'vocab' && o.theme !== atom.theme && wordClass(o) === wordClass(atom)
      && (wordClass(atom) !== 'verb' || isActivity(o.theme))));
  }
  return outsiders.get(key);
}

export default {
  id: 'oddOneOut',
  label: 'Welk woord hoort er niet bij?',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'vocab') return false;
    if (wordClass(a) === 'verb' && !isActivity(a.theme)) return false;
    if (family(a).length < OPTIONS - 2) return false;
    return outsidersFor(a).length > 0;
  },

  render(item, root, ctx) {
    const { atom } = item;

    const odd = sample(outsidersFor(atom), 1)[0];
    const options = shuffle([atom, ...sample(family(atom), OPTIONS - 2), odd]);
    // Alles of niets: één emoji tussen kale woorden is al een antwoord.
    const withEmoji = showEmoji(item.key) && options.every(o => o.emoji);

    const theme = getTheme(atom.theme);

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk woord hoort er niet bij?'),
      el('p', { class: 'q-hint' },
        `De andere drie horen bij het thema "${theme?.label ?? 'hetzelfde'}".`),
    );

    const opts = optionList(options.map(o => ({
      value: o.id,
      label: [
        el('span', { class: 'option-word', lang: 'es' },
          withEmoji ? el('span', { class: 'option-emoji' }, o.emoji) : null,
          o.es),
        // Pas bij het nakijken zichtbaar: tijdens de vraag zou het de vertaling
        // weggeven, achteraf is het precies wat je wil zien.
        el('span', { class: 'option-nl' }, o.nl[0]),
      ],
    })), { className: 'option--odd', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    const named = a => `${a.es} (${a.nl[0]})`;
    const oddTheme = getTheme(odd.theme)?.label;

    return {
      focus: opts.focus,
      check() {
        const picked = options.find(o => o.id === opts.chosen());
        return {
          correct: picked === odd,
          expected: `${named(odd)} — hoort bij "${oddTheme ?? 'een ander thema'}"`,
          // Benoem ook wat je fout aanwees, met vertaling: anders weet je wel
          // welk woord het was, maar niet waarom het jouwe er wél bij hoorde.
          note: picked && picked !== odd
            ? `${named(picked)} hoort wél bij "${theme?.label ?? 'dit thema'}".`
            : null,
          given: picked?.es ?? null,
        };
      },
      reveal() { opts.reveal(odd.id); },
    };
  },
};
