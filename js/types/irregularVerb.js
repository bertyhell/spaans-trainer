/* Welk werkwoord is niet regelmatig? Eén onregelmatig werkwoord tussen drie
 * regelmatige, in de tegenwoordige tijd.
 *
 * De drie regelmatige hebben dezelfde uitgang als het onregelmatige: bij
 * "pensar" staan dus drie andere -ar-werkwoorden. Anders wijs je gewoon het
 * enige -ir-werkwoord aan, en leer je niets over welke je moet onthouden.
 *
 * Hangt aan de es→nl-kant van het woord, anders komt dezelfde vraag voor
 * elk werkwoord twee keer zo vaak langs. */

import { el, shuffle, sample } from '../dom.js';
import { allAtoms } from '../data.js';

const OPTIONS = 4;

const ending = verb => verb.slice(-2);

const regulars = () => allAtoms().filter(a => a.kind === 'vocab' && a.regular === true);

const presentForm = (verb, person) => allAtoms().find(a =>
  a.kind === 'conjugation' && a.tense === 'presente' && a.verb === verb && a.person === person);

/** "pensar → piensa (e → ie)", of zonder vervoeging in de data "pensar (e → ie)". */
function explain(atom) {
  const f = presentForm(atom.es, '3s');
  if (atom.change.startsWith('yo ')) return `${atom.es} → ${atom.change}`;
  return f ? `${atom.es} → ${f.form} (${atom.change})` : `${atom.es} (${atom.change})`;
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
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk werkwoord is niet regelmatig?'),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente). De andere drie zijn regelmatig.'),
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
        el('span', { class: 'option-word' }, o.es),
        // Pas bij het nakijken zichtbaar, net als bij "hoort er niet bij".
        el('span', { class: 'option-nl' }, o.nl[0]),
      ));
    }
    root.append(list);

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check() {
        const picked = options.find(o => o.id === chosen);
        const form = picked && presentForm(picked.es, '3s');
        return {
          correct: chosen === atom.id,
          expected: explain(atom),
          note: picked && picked !== atom
            ? `${picked.es}${form ? ` → ${form.form}` : ''} is regelmatig.` : null,
          given: chosen,
        };
      },
      reveal({ correct }) {
        list.classList.add('is-revealed');
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === atom.id) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !correct) b.classList.add('is-wrong');
        });
      },
    };
  },
};
