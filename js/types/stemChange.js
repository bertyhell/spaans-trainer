/* Welk werkwoord verandert van klank in de tegenwoordige tijd? Eén
 * klankveranderaar tussen drie werkwoorden die hun stam houden.
 *
 * Hangt aan één atoom per werkwoord (de hij/zij-vorm), anders komt dezelfde
 * vraag zes keer zo vaak langs. Die vorm toont de klankverandering ook
 * zuiver: "tengo" of "digo" zou meer tonen dan alleen de klank. */

import { el, shuffle, sample } from '../dom.js';
import { allAtoms } from '../data.js';

const OPTIONS = 4;

/** Werkwoorden die in de presente van klank veranderen, met hun wissel. */
const STEM_CHANGES = {
  pensar: 'e → ie', querer: 'e → ie', tener: 'e → ie', venir: 'e → ie',
  empezar: 'e → ie', entender: 'e → ie', preferir: 'e → ie', cerrar: 'e → ie',
  despertarse: 'e → ie', divertirse: 'e → ie',
  poder: 'o → ue', dormir: 'o → ue', volver: 'o → ue', encontrar: 'o → ue',
  costar: 'o → ue', acostarse: 'o → ue', doler: 'o → ue', contar: 'o → ue',
  pedir: 'e → i', decir: 'e → i', repetir: 'e → i', servir: 'e → i', vestirse: 'e → i',
  jugar: 'u → ue',
};

/* Afleiders: werkwoorden die hun stam houden. Volledig onregelmatige als ser,
 * ir of haber vallen weg — die veranderen wel, maar niet "van klank", en dan
 * klopt de vraag niet meer. */
const NO_CHANGE = [
  'hablar', 'comer', 'vivir', 'tomar', 'trabajar', 'estudiar', 'escribir', 'leer',
  'beber', 'comprar', 'llamar', 'mirar', 'abrir', 'aprender', 'bailar', 'cantar',
  'cocinar', 'escuchar', 'viajar', 'caminar', 'poner', 'hacer', 'salir', 'traer',
  'saber', 'conocer', 'ver', 'dar',
];

const presentForm = (verb, person) => allAtoms().find(a =>
  a.kind === 'conjugation' && a.tense === 'presente' && a.verb === verb && a.person === person);

export default {
  id: 'stemChange',
  label: 'Welk werkwoord verandert van klank?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'conjugation' && a.tense === 'presente'
      && a.person === '3s' && a.verb in STEM_CHANGES;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const options = shuffle([atom.verb, ...sample(NO_CHANGE, OPTIONS - 1)]);
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk werkwoord verandert van klank?'),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente), bij yo, tú, él en ellos.'),
    );

    const list = el('div', { class: 'options' });
    for (const verb of options) {
      list.append(el('button', {
        class: 'option', type: 'button', dataset: { value: verb },
        onclick: () => {
          chosen = verb;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === verb));
          ctx.ready(true);
        },
      }, verb));
    }
    root.append(list);

    const showForm = verb => {
      const f = presentForm(verb, '3s');
      return f ? `${verb} → ${f.form}` : verb;
    };

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check() {
        return {
          correct: chosen === atom.verb,
          expected: `${atom.verb} → ${atom.form} (${STEM_CHANGES[atom.verb]})`,
          note: chosen && chosen !== atom.verb
            ? `${showForm(chosen)} houdt zijn stam.` : null,
          given: chosen,
        };
      },
      reveal({ correct }) {
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === atom.verb) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !correct) b.classList.add('is-wrong');
        });
      },
    };
  },
};
