/* Een vervoegde vorm herkennen, in twee gedaantes.
 *
 * tenseSpot: "hablaré" — welke tijd is dat? Je herkent de tijd aan de uitgang,
 *   en dat is precies wat je bij lezen en luisteren nodig hebt.
 * personSpot: "hablamos" — wie doet het?
 *
 * Een vorm die in meerdere tijden of personen bestaat (hablamos is presente én
 * indefinido, hablaba is yo én él) mag nooit een afleider opleveren die ook
 * juist is: die tijden en personen vallen uit de opties. */

import { el, shuffle, sample, optionList } from '../dom.js';
import { conjugatedForm, verbTranslation, PERSON_LABELS, PERSON_ORDER, TENSE_LABELS } from '../data.js';
import { describeForm } from './conjugation.js';

/* estar + gerundio en de perfecto verraden zich door hun hulpwerkwoord. */
const SPOT_TENSES = ['presente', 'indefinido', 'imperfecto', 'futuro', 'condicional', 'subjuntivo'];

const tensesWith = (verb, form) =>
  SPOT_TENSES.filter(t => PERSON_ORDER.some(p => conjugatedForm(verb, t, p) === form));

const prompt = (atom, root, instruction) => root.append(
  el('p', { class: 'q-instruction' }, instruction),
  el('div', { class: 'q-prompt' },
    el('span', { class: 'q-word', lang: 'es' }, atom.form),
    el('span', { class: 'q-translation' },
      `(${[atom.verb, verbTranslation(atom.verb)].filter(Boolean).join(' = ')})`)),
);

export const tenseSpot = {
  id: 'tenseSpot',
  label: 'Welke tijd?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'conjugation' && SPOT_TENSES.includes(a.tense)
      && tensesWith(a.verb, a.form).length === 1;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const others = SPOT_TENSES.filter(t => t !== atom.tense
      && PERSON_ORDER.some(p => conjugatedForm(atom.verb, t, p)));
    const options = shuffle([atom.tense, ...sample(others, 3)]);

    prompt(atom, root, 'In welke tijd staat deze vorm?');
    const opts = optionList(options.map(t => ({ value: t, label: TENSE_LABELS[t] })),
      { onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        const ok = chosen === atom.tense;
        return {
          correct: ok, given: chosen && TENSE_LABELS[chosen],
          expected: `${atom.form} = ${PERSON_LABELS[atom.person]}, ${TENSE_LABELS[atom.tense]}`,
          note: ok || !chosen ? null
            : `In de ${TENSE_LABELS[chosen].split(' · ')[0]} zou het ${conjugatedForm(atom.verb, chosen, atom.person) ?? '…'} zijn.`,
        };
      },
      reveal() { opts.reveal(atom.tense); },
    };
  },
};

export const personSpot = {
  id: 'personSpot',
  label: 'Wie doet het?',

  supports: item => item.atom.kind === 'conjugation' && !/\s/.test(item.atom.form),

  render(item, root, ctx) {
    const { atom } = item;
    // Personen met dezelfde vorm (yo hablaba = él hablaba) zijn ook juist:
    // die tonen we niet, anders kies je "fout" terwijl je gelijk hebt.
    const same = PERSON_ORDER.filter(p => conjugatedForm(atom.verb, atom.tense, p) === atom.form);
    const options = PERSON_ORDER.filter(p => p === atom.person || !same.includes(p));

    prompt(atom, root, 'Wie doet het?');
    root.append(el('p', { class: 'q-hint' }, TENSE_LABELS[atom.tense]));
    const opts = optionList(options.map(p => ({ value: p, label: PERSON_LABELS[p] })),
      { compact: true, lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        const ok = chosen === atom.person;
        const theirs = chosen && conjugatedForm(atom.verb, atom.tense, chosen);
        return {
          correct: ok, given: chosen && PERSON_LABELS[chosen],
          expected: `${PERSON_LABELS[atom.person]} ${atom.form}`,
          note: ok || !chosen ? null
            : [theirs ? `${PERSON_LABELS[chosen]}: ${theirs}.` : null, describeForm(atom.verb, atom.form)]
              .filter(Boolean).join(' '),
        };
      },
      reveal() { opts.reveal(atom.person); },
    };
  },
};
