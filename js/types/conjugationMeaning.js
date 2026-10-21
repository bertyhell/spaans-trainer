/* Wat betekent de vorm? "comí" — ik at, wij aten, ik zal eten of ik drink?
 *
 * De afleiders komen van hetzelfde werkwoord in een andere persoon of tijd, en
 * één van een ander werkwoord in dezelfde persoon en tijd. Zo moet je de
 * uitgang én het werkwoord herkennen.
 *
 * Nooit een afleider die ook juist is: een Spaanse vorm met meerdere
 * betekenissen (fui = ik was én ik ging, hablamos = wij spreken én wij
 * spraken) laat al die vertalingen weg, en tijden waarvan het Nederlands
 * overlapt (comí = ik at, maar ook ik heb gegeten) staan nooit naast elkaar. */

import { el, shuffle, sample, optionList, speakerButton } from '../dom.js';
import { conjugatedForm, conjugationsOfForm, siblings, PERSON_ORDER } from '../data.js';
import { dutchMeaning, TENSE_GROUP } from '../dutch.js';
import { describeForm } from './conjugation.js';

const OPTIONS = 4;

/** Afleiders als { nl, es }: de Nederlandse betekenis en de Spaanse vorm erbij. */
export function meaningOptions(atom) {
  const correct = dutchMeaning(atom.verb, atom.tense, atom.person);
  if (!correct) return null;
  const taken = new Set(conjugationsOfForm(atom.form)
    .map(a => dutchMeaning(a.verb, a.tense, a.person)).filter(Boolean));
  taken.add(correct);

  const option = (verb, tense, person) => {
    const nl = dutchMeaning(verb, tense, person);
    const es = conjugatedForm(verb, tense, person);
    return nl && es && es !== atom.form && !taken.has(nl) ? { nl, es } : null;
  };
  const persons = PERSON_ORDER.filter(p => p !== atom.person)
    .map(p => option(atom.verb, atom.tense, p)).filter(Boolean);
  const tenses = Object.keys(TENSE_GROUP).filter(t => TENSE_GROUP[t] !== TENSE_GROUP[atom.tense])
    .map(t => option(atom.verb, t, atom.person)).filter(Boolean);
  const verbs = siblings(atom)
    .filter(a => a.verb !== atom.verb && a.tense === atom.tense && a.person === atom.person)
    .map(a => option(a.verb, a.tense, a.person)).filter(Boolean);

  // Eén ander werkwoord, één andere tijd, de rest andere personen.
  const out = [];
  for (const o of [...sample(verbs, 1), ...sample(tenses, 1), ...shuffle(persons), ...shuffle(tenses)]) {
    if (out.length >= OPTIONS - 1) break;
    if (!out.some(x => x.nl === o.nl)) out.push(o);
  }
  return { correct, distractors: out };
}

export default {
  id: 'conjugationMeaning',
  label: 'Wat betekent de vorm?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'conjugation' && (meaningOptions(a)?.distractors.length ?? 0) >= OPTIONS - 2;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const { correct, distractors } = meaningOptions(atom);
    const esOf = new Map(distractors.map(d => [d.nl, d.es]));
    const options = shuffle([correct, ...distractors.map(d => d.nl)]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Wat betekent deze vorm?'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-word', lang: 'es' }, atom.form),
        speakerButton(atom.form, ctx.speech)),
    );
    const opts = optionList(options, { lang: 'nl', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        const ok = chosen === correct;
        return {
          correct: ok, expected: correct, given: chosen,
          note: ok || !chosen ? null
            : [`"${chosen}" is ${esOf.get(chosen)}.`, describeForm(atom.verb, atom.form)].join(' '),
        };
      },
      reveal() { opts.reveal(correct); },
    };
  },
};
