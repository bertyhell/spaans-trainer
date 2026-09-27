/* Welk werkwoord is regelmatig, klankveranderend of onregelmatig? Eén
 * werkwoord van de gevraagde soort tussen drie van een andere soort, telkens
 * in de tegenwoordige tijd.
 *
 * Bij "verandert van klank?" zijn de afleiders enkel regelmatige werkwoorden:
 * een onregelmatige als tener (tienes) verandert óók van klank, en dan zijn
 * er twee goede antwoorden. */

import { el, shuffle, sample, optionList } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';

const OPTIONS = 4;

const QUESTIONS = {
  regelmatig: { q: 'Welk werkwoord is regelmatig?', others: ['klankveranderend', 'onregelmatig'] },
  klankveranderend: { q: 'Welk werkwoord verandert van klank?', others: ['regelmatig'] },
  onregelmatig: { q: 'Welk werkwoord is onregelmatig?', others: ['regelmatig', 'klankveranderend'] },
};

let verbTypeCache = null;
const verbTypes = () => (verbTypeCache ??= allAtoms().filter(a => a.kind === 'verbType'));

const presentForm = (verb, person) => conjugatedForm(verb, 'presente', person);

/** "pensar → pienso, piensa": yo en él tonen samen elke soort afwijking. */
const showForms = verb => {
  const forms = ['1s', '3s'].map(p => presentForm(verb, p)).filter(Boolean);
  return forms.length ? `${verb} → ${forms.join(', ')}` : verb;
};

export default {
  id: 'verbType',
  label: 'Welke soort werkwoord?',

  supports: item => item.atom.kind === 'verbType',

  render(item, root, ctx) {
    const { atom } = item;
    const { q, others } = QUESTIONS[atom.type];
    const pool = verbTypes().filter(a => others.includes(a.type));
    const options = shuffle([atom, ...sample(pool, OPTIONS - 1)]);

    root.append(
      el('p', { class: 'q-instruction' }, q),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente).'),
    );

    const opts = optionList(options.map(o => o.verb), { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = options.find(o => o.verb === opts.chosen());
        const correct = chosen?.verb === atom.verb;
        return {
          correct,
          expected: showForms(atom.verb),
          note: chosen && !correct ? `${showForms(chosen.verb)} is ${chosen.type}.` : null,
          given: chosen?.verb,
        };
      },
      reveal() { opts.reveal(atom.verb); },
    };
  },
};
