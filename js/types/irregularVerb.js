/* Welk werkwoord is niet regelmatig? Eén onregelmatig werkwoord tussen drie
 * regelmatige, in de tegenwoordige tijd.
 *
 * De drie regelmatige hebben dezelfde uitgang als het onregelmatige: bij
 * "pensar" staan dus drie andere -ar-werkwoorden. Anders wijs je gewoon het
 * enige -ir-werkwoord aan, en leer je niets over welke je moet onthouden.
 *
 * Hangt aan de es→nl-kant van het woord, anders komt dezelfde vraag voor
 * elk werkwoord twee keer zo vaak langs. */

import { el, shuffle, sample, optionList } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';

const OPTIONS = 4;

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
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente). De andere drie zijn regelmatig.'),
    );

    const opts = optionList(options.map(o => ({
      value: o.id,
      label: [
        el('span', { class: 'option-word', lang: 'es' }, o.es),
        // Pas bij het nakijken zichtbaar, net als bij "hoort er niet bij".
        el('span', { class: 'option-nl' }, o.nl[0]),
      ],
    })), { className: 'option--odd', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const picked = options.find(o => o.id === opts.chosen());
        const form = picked && conjugatedForm(picked.es, 'presente', '3s');
        return {
          correct: picked === atom,
          expected: explain(atom),
          note: picked && picked !== atom
            ? `${picked.es}${form ? ` → ${form}` : ''} is regelmatig.` : null,
          given: picked?.es ?? null,
        };
      },
      reveal() { opts.reveal(atom.id); },
    };
  },
};
