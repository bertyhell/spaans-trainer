/* Sorteer werkwoorden: regelmatig, klankveranderend of onregelmatig. Vijf
 * werkwoorden onder elkaar; elk schuif je opzij naar de juiste kolom (zie
 * sortBoard.js).
 *
 * Elk werkwoord is een eigen verbType-atoom en telt apart mee, net als de
 * vakjes van de vervoegingstabel. */

import { el, shuffle, sample } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';
import { sortBoard } from '../sortBoard.js';

const ROWS = 5;
const COLUMNS = ['regelmatig', 'klankveranderend', 'onregelmatig'];
const COLUMN_LABELS = { regelmatig: 'regelmatig', klankveranderend: 'klank­veranderend', onregelmatig: 'onregelmatig' };

let verbTypeCache = null;
const verbTypes = () => (verbTypeCache ??= allAtoms().filter(a => a.kind === 'verbType'));

/** "pensar → pienso, piensa": yo en él tonen samen elke soort afwijking. */
const showForms = verb => {
  const forms = ['1s', '3s'].map(p => conjugatedForm(verb, 'presente', p)).filter(Boolean);
  return forms.length ? `${verb} → ${forms.join(', ')}` : verb;
};

/** Het getrokken werkwoord plus minstens één van elke andere soort. */
function pickVerbs(atom) {
  const pool = verbTypes().filter(a => a.verb !== atom.verb);
  const picked = [atom];
  for (const type of COLUMNS) {
    if (type === atom.type) continue;
    picked.push(...sample(pool.filter(a => a.type === type), 1));
  }
  const rest = pool.filter(a => !picked.includes(a));
  picked.push(...sample(rest, ROWS - picked.length));
  return shuffle(picked);
}

export default {
  id: 'verbSort',
  label: 'Sorteer de werkwoorden',

  supports: item => item.atom.kind === 'verbType',

  render(item, root, ctx) {
    const verbs = pickVerbs(item.atom);

    root.append(
      el('p', { class: 'q-instruction' }, 'Schuif elk werkwoord naar de juiste kolom'),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente).'),
    );

    const sort = sortBoard({
      columns: COLUMNS.map(c => ({ id: c, label: COLUMN_LABELS[c] })),
      items: verbs.map(a => ({ name: a.verb, lang: 'es' })),
      onChange: n => ctx.ready(n === verbs.length),
    });
    root.append(sort.board);

    return {
      focus: sort.focus,

      check() {
        const per = verbs.map((atom, i) => {
          const given = COLUMNS[sort.placed(i)] ?? null;
          return { atomId: atom.id, verb: atom.verb, correct: given === atom.type, given, expected: atom.type };
        });
        const wrong = per.filter(p => !p.correct);
        return {
          correct: !wrong.length,
          expected: per.map(p => `${p.verb}: ${p.expected}`).join(' · '),
          note: wrong.length ? wrong.map(p => `${showForms(p.verb)} is ${p.expected}.`).join(' ') : null,
          given: per.map(p => `${p.verb}: ${p.given ?? '—'}`).join(' · '),
          perAtom: per,
        };
      },

      reveal(result) {
        verbs.forEach((atom, i) => {
          const p = result.perAtom?.find(x => x.atomId === atom.id);
          sort.reveal(i, { correct: p?.correct, column: COLUMNS.indexOf(atom.type), fix: `✓ ${atom.verb}` });
        });
      },
    };
  },
};
