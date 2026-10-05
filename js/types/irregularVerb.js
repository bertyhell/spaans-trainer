/* Welk werkwoord is niet regelmatig? Eén onregelmatig werkwoord tussen drie
 * regelmatige, in de tegenwoordige tijd.
 *
 * De drie regelmatige hebben dezelfde uitgang als het onregelmatige: bij
 * "pensar" staan dus drie andere -ar-werkwoorden. Anders wijs je gewoon het
 * enige -ir-werkwoord aan, en leer je niets over welke je moet onthouden.
 *
 * Hangt aan de es→nl-kant van het woord, anders komt dezelfde vraag voor
 * elk werkwoord twee keer zo vaak langs.
 *
 * Een schuifbord met twee kolommen (zie sortBoard.js), net als "hoort er niet
 * bij?": alle vier beginnen links bij regelmatig, het onregelmatige schuif je
 * naar rechts. */

import { el, shuffle, sample } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';
import { sortBoard } from '../sortBoard.js';

const OPTIONS = 4;
const COL_REGULAR = 0;
const COL_IRREGULAR = 1;

const ending = verb => verb.slice(-2);

let regularCache = null;
const regulars = () =>
  (regularCache ??= allAtoms().filter(a => a.kind === 'vocab' && a.regular === true));

/** "pensar → piensa (e → ie)", of zonder vervoeging in de data "pensar (e → ie)". */
function explain(atom) {
  const f = conjugatedForm(atom.es, 'presente', '3s');
  if (atom.change.startsWith('yo ')) return `${atom.es} → ${atom.change}`;
  return f ? `${atom.es} → ${f} (${atom.change})` : `${atom.es} (${atom.change})`;
}

export default {
  id: 'irregularVerb',
  label: 'Welk werkwoord is niet regelmatig?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'vocab' && a.regular === false && item.direction === 'es2nl';
  },

  render(item, root, ctx) {
    const { atom } = item;
    const pool = regulars().filter(o => o.es !== atom.es);
    const same = pool.filter(o => ending(o.es) === ending(atom.es));
    const others = sample(same.length >= OPTIONS - 1 ? same : pool, OPTIONS - 1);
    const options = shuffle([atom, ...others]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk werkwoord is niet regelmatig?'),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente). Schuif het werkwoord dat niet regelmatig is naar rechts.'),
    );

    // Alle vier beginnen bij "regelmatig"; het onregelmatige schuif je opzij.
    const sort = sortBoard({
      columns: [
        { id: 'regelmatig', label: 'regelmatig' },
        { id: 'onregelmatig', label: 'niet regelmatig' },
      ],
      items: options.map(o => ({
        name: o.es,
        lang: 'es',
        label: [
          o.es,
          // Pas bij het nakijken zichtbaar, net als bij "hoort er niet bij".
          el('span', { class: 'sort-nl', lang: 'nl' }, o.nl[0]),
        ],
      })),
      start: COL_REGULAR,
      onChange: () => ctx.ready(options.some((_, i) => sort.placed(i) === COL_IRREGULAR)),
    });
    root.append(sort.board);

    const column = o => (o === atom ? COL_IRREGULAR : COL_REGULAR);

    return {
      focus: sort.focus,
      check() {
        const moved = options.filter((_, i) => sort.placed(i) === COL_IRREGULAR);
        const wrong = moved.filter(o => o !== atom);
        const regular = o => {
          const form = conjugatedForm(o.es, 'presente', '3s');
          return `${o.es}${form ? ` → ${form}` : ''} is regelmatig.`;
        };
        return {
          correct: moved.length === 1 && moved[0] === atom,
          expected: explain(atom),
          note: wrong.length ? wrong.map(regular).join(' ') : null,
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
