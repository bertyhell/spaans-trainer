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

/* "e → ie": staat bij het werkwoord in de woordenschat. */
let changeCache = null;
const changeOf = verb => (changeCache ??= new Map(allAtoms()
  .filter(a => a.kind === 'vocab' && a.change?.includes('→')).map(a => [a.es, a.change]))).get(verb);

const ending = verb => verb.replace(/se$/, '').slice(-2);

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
    // Afleiders met dezelfde uitgang: anders wijs je het enige -ir-werkwoord
    // aan zonder iets over de klank te weten.
    const same = pool.filter(a => ending(a.verb) === ending(atom.verb));
    const options = shuffle([atom, ...sample(same.length >= OPTIONS - 1 ? same : pool, OPTIONS - 1)]);
    const change = changeOf(atom.verb);

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
          expected: `${showForms(atom.verb)}${change ? ` (${change})` : ''}`,
          note: chosen && !correct ? `${showForms(chosen.verb)} is ${chosen.type}.` : null,
          given: chosen?.verb,
        };
      },
      reveal() { opts.reveal(atom.verb); },
    };
  },
};
