/* Welk werkwoord is regelmatig, klankveranderend of onregelmatig? Eén
 * werkwoord van de gevraagde soort tussen drie van een andere soort, telkens
 * in de tegenwoordige tijd.
 *
 * Bij "verandert van klank?" zijn de afleiders enkel regelmatige werkwoorden:
 * een onregelmatige als tener (tienes) verandert óók van klank, en dan zijn
 * er twee goede antwoorden.
 *
 * Een schuifbord met twee kolommen (zie sortBoard.js), net als "hoort er niet
 * bij?": alle vier beginnen links, het gevraagde werkwoord schuif je naar
 * rechts. */

import { el, shuffle, sample } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';
import { sortBoard } from '../sortBoard.js';

const OPTIONS = 4;
const COL_OTHER = 0;
const COL_ASKED = 1;

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
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente). Schuif het naar rechts.'),
    );

    // Links de andere soort(en), rechts de gevraagde. "niet regelmatig" als er
    // twee andere soorten tussen zitten.
    const sort = sortBoard({
      columns: [
        { id: others.length === 1 ? others[0] : 'ander', label: others.length === 1 ? others[0] : `niet ${atom.type}` },
        { id: atom.type, label: atom.type },
      ],
      items: options.map(o => ({ name: o.verb, lang: 'es' })),
      start: COL_OTHER,
      onChange: () => ctx.ready(options.some((_, i) => sort.placed(i) === COL_ASKED)),
    });
    root.append(sort.board);

    const column = o => (o === atom ? COL_ASKED : COL_OTHER);

    return {
      focus: sort.focus,
      check() {
        const moved = options.filter((_, i) => sort.placed(i) === COL_ASKED);
        const wrong = moved.filter(o => o !== atom);
        return {
          correct: moved.length === 1 && moved[0] === atom,
          expected: `${showForms(atom.verb)}${change ? ` (${change})` : ''}`,
          note: wrong.length ? wrong.map(o => `${showForms(o.verb)} is ${o.type}.`).join(' ') : null,
          given: moved.map(o => o.verb).join(', ') || null,
        };
      },
      reveal() {
        options.forEach((o, i) => sort.reveal(i, {
          correct: sort.placed(i) === column(o),
          column: column(o),
          fix: `✓ ${o.verb}`,
        }));
      },
    };
  },
};
