/* Welk werkwoord verandert van klank in de tegenwoordige tijd? Eén
 * klankveranderaar tussen drie werkwoorden die hun stam houden.
 *
 * Hangt aan één atoom per werkwoord (de hij/zij-vorm), anders komt dezelfde
 * vraag zes keer zo vaak langs. Die vorm toont de klankverandering ook
 * zuiver: "tengo" of "digo" zou meer tonen dan alleen de klank. */

import { el, shuffle, sample, optionList } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';

const OPTIONS = 4;

/* Werkwoorden per soort, uit de indeling van de presente (de verbType-atomen
 * van tools/conjugate.mjs). Afleiders zijn volledig regelmatige werkwoorden:
 * poner (pongo) of salir (salgo) houden hun stamklinker, maar de vraag noemt
 * yo uitdrukkelijk, en daar veranderen ze wél. */
let byType = null;
let changes = null;
function index() {
  if (byType) return;
  byType = new Map();
  changes = new Map();
  for (const a of allAtoms()) {
    if (a.kind === 'verbType') {
      if (!byType.has(a.type)) byType.set(a.type, []);
      byType.get(a.type).push(a.verb);
    }
    // "e → ie": staat bij het woord in de woordenschat.
    if (a.kind === 'vocab' && a.change?.includes('→')) changes.set(a.es, a.change);
  }
}
const verbsOf = type => (index(), byType.get(type) ?? []);
const changeOf = verb => (index(), changes.get(verb) ?? null);

export default {
  id: 'stemChange',
  label: 'Welk werkwoord verandert van klank?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'conjugation' && a.tense === 'presente'
      && a.person === '3s' && verbsOf('klankveranderend').includes(a.verb);
  },

  render(item, root, ctx) {
    const { atom } = item;
    const options = shuffle([atom.verb, ...sample(verbsOf('regelmatig'), OPTIONS - 1)]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk werkwoord verandert van klank?'),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente), bij yo, tú, él en ellos.'),
    );

    const opts = optionList(options, { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    const showForm = verb => {
      const f = conjugatedForm(verb, 'presente', '3s');
      return f ? `${verb} → ${f}` : verb;
    };
    const change = changeOf(atom.verb);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        return {
          correct: chosen === atom.verb,
          expected: `${atom.verb} → ${atom.form}${change ? ` (${change})` : ''}`,
          note: chosen && chosen !== atom.verb ? `${showForm(chosen)} houdt zijn stam.` : null,
          given: chosen,
        };
      },
      reveal() { opts.reveal(atom.verb); },
    };
  },
};
