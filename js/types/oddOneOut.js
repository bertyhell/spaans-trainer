/* Welk woord hoort er niet bij? Het vreemde woord komt uit een ánder thema,
 * de rest uit hetzelfde. Goedkope afwisseling tussen de zwaardere vormen.
 *
 * Een schuifbord met twee kolommen (zie sortBoard.js): links het thema, waar
 * alle vier de woorden beginnen, rechts "ander". Het vreemde woord schuif je
 * naar rechts.
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
 * "zwemmen" en "schaatsen" allebei overal bij passen.
 *
 * Het vreemde woord moet er op betekenis uitspringen, niet op een indeling
 * die je moet kennen. Daarom:
 *   - komt het (behalve bij werkwoorden) uit een andere groep, niet alleen
 *     een ander thema: "vandaag" uit de dagen past evengoed bij de dagelijkse
 *     routine;
 *   - doen de grammaticathema's niet mee: "bijvoeglijke naamwoorden" is een
 *     woordsoort, geen onderwerp;
 *   - doen bijwoorden en zinnetjes niet mee: die thema's houden zelden echt
 *     samen ("antes de caminar" en "a su derecha" bij het reizen);
 *   - doen de restbakthema's niet mee (LOOSE). */

import { el, shuffle, sample } from '../dom.js';
import { sortBoard } from '../sortBoard.js';
import { siblings, allAtoms, getTheme } from '../data.js';
import { showEmoji } from '../scheduler.js';

const OPTIONS = 4;
const COL_THEME = 0;
const COL_OTHER = 1;

const wordClass = a => a.pos ?? 'other';

const isActivity = themeId => getTheme(themeId)?.activity === true;

/** Thema's die je meer verzamelen dan indelen: daar past bijna alles bij. */
const LOOSE = new Set(['reizen', 'dagelijkse-routine']);
const MEANINGLESS_GROUPS = new Set(['g-grammatica']);
const groupOf = themeId => getTheme(themeId)?.group;
/** Woorden die op betekenis nergens uitspringen: "llamado" (genoemd) is geen eigenschap. */
const EXCLUDED = new Set(['v.llamado-a']);

/** Mag dit woord meedoen, als gevraagd woord of als vreemde eend? */
function eligible(a) {
  if (a.kind !== 'vocab' || EXCLUDED.has(a.id)) return false;
  if (wordClass(a) === 'adv' || wordClass(a) === 'other') return false;
  if (LOOSE.has(a.theme) || MEANINGLESS_GROUPS.has(groupOf(a.theme))) return false;
  return wordClass(a) !== 'verb' || isActivity(a.theme);
}

/** Themagenoten van dezelfde woordsoort — de "horen bij elkaar"-groep. */
const family = atom => siblings(atom).filter(o => wordClass(o) === wordClass(atom) && eligible(o));

/** Woorden uit een ander thema, van dezelfde soort als het gevraagde woord.
 *  Per thema en woordsoort één keer berekend: supports() loopt voor elk item
 *  van een selectie, en anders telkens door de hele cursus. */
const outsiders = new Map();
function outsidersFor(atom) {
  const key = `${atom.theme}|${wordClass(atom)}`;
  if (!outsiders.has(key)) {
    // Werkwoorden zitten allemaal in één groep; daar volstaat een ander thema.
    const far = wordClass(atom) === 'verb'
      ? o => o.theme !== atom.theme
      : o => groupOf(o.theme) !== groupOf(atom.theme);
    outsiders.set(key, allAtoms().filter(o =>
      eligible(o) && wordClass(o) === wordClass(atom) && far(o)));
  }
  return outsiders.get(key);
}

export default {
  id: 'oddOneOut',
  label: 'Welk woord hoort er niet bij?',

  supports(item) {
    const a = item.atom;
    if (!eligible(a) || item.direction !== 'es2nl') return false;
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
      el('p', { class: 'q-hint' }, 'Schuif het woord dat niet bij het thema past naar rechts.'),
    );

    // Alle vier beginnen bij het thema; het vreemde schuif je naar "ander".
    const sort = sortBoard({
      columns: [
        { id: 'theme', label: theme?.label ?? 'thema' },
        { id: 'other', label: 'ander' },
      ],
      items: options.map(o => ({
        name: o.es,
        lang: 'es',
        label: [
          withEmoji ? el('span', { class: 'option-emoji' }, o.emoji) : null,
          o.es,
          // Pas bij het nakijken zichtbaar: tijdens de vraag zou het de vertaling
          // weggeven, achteraf is het precies wat je wil zien.
          el('span', { class: 'sort-nl', lang: 'nl' }, o.nl[0]),
        ],
      })),
      start: COL_THEME,
      onChange: () => ctx.ready(options.some((_, i) => sort.placed(i) === COL_OTHER)),
    });
    root.append(sort.board);

    const named = a => `${a.es} (${a.nl[0]})`;
    const oddTheme = getTheme(odd.theme)?.label;
    const column = o => (o === odd ? COL_OTHER : COL_THEME);

    return {
      focus: sort.focus,
      check() {
        const moved = options.filter((_, i) => sort.placed(i) === COL_OTHER);
        // Wat je fout aanwees, met vertaling: anders weet je wel welk woord het
        // was, maar niet waarom het jouwe er wél bij hoorde.
        const wrong = moved.filter(o => o !== odd);
        const notes = [
          ...wrong.map(o => `${named(o)} hoort wél bij "${theme?.label ?? 'dit thema'}".`),
          !moved.includes(odd) && wrong.length > 0
            ? `${named(odd)} hoort bij "${oddTheme ?? 'een ander thema'}".` : null,
        ].filter(Boolean);
        return {
          correct: moved.length === 1 && moved[0] === odd,
          expected: `${named(odd)} — hoort bij "${oddTheme ?? 'een ander thema'}"`,
          note: notes.length ? notes.join(' ') : null,
          given: moved.map(o => o.es).join(', ') || null,
        };
      },
      reveal() {
        options.forEach((o, i) => sort.reveal(i, {
          correct: sort.placed(i) === column(o),
          column: column(o),
          fix: `✓ ${o.es}`,
        }));
      },
    };
  },
};
