/* Klopt het? Eén bewering, twee knoppen. Een snel tussendoortje voor
 * woordenschat ("la corbata = de das"), vervoegingen ("comíamos = nosotros,
 * imperfecto") en soorten werkwoorden ("tener is onregelmatig").
 *
 * Een bewering die niet klopt, mag nooit toevallig toch kloppen: hablamos is
 * presente én indefinido, dus "hablamos = nosotros, indefinido" wordt nooit als
 * fout getoond. Tussen klankveranderend en onregelmatig kiezen we evenmin: tener
 * (tienes) verandert ook van klank. */

import { el, optionList, speakerButton } from '../dom.js';
import {
  siblings, synonymsOf, conjugatedForm, verbTranslation, PERSON_LABELS, PERSON_ORDER, TENSE_LABELS,
} from '../data.js';

const tenseShort = t => (TENSE_LABELS[t] ?? t).split(' · ')[0];
/* Een samengestelde tijd verraadt zich door haar hulpwerkwoord: "ha escrito"
 * als futuro aanbieden is geen vraag. Wissel dus enkel binnen dezelfde soort. */
const COMPOUND = new Set(['perfecto', 'continuo']);
const conjClaim = (person, tense) => `${PERSON_LABELS[person]} · ${tenseShort(tense)}`;
const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/** Een foute bewering voor dit item, of null als er geen veilige bestaat. */
function falseClaim(atom, rnd) {
  if (atom.kind === 'vocab') {
    // Ook niet wat een synoniem betekent: el aseo deelt "het toilet" met el
    // baño, dus "el aseo = de badkamer" is niet zomaar fout.
    const near = new Set([...atom.nl, ...synonymsOf(atom).flatMap(o => o.nl)]);
    const pool = siblings(atom).filter(o => o.nl?.length && !near.has(o.nl[0]));
    const alike = pool.filter(o => o.pos === atom.pos);
    const o = pick(alike.length ? alike : pool, rnd);
    return o ? { claim: o.nl[0], note: `${o.nl[0]} is ${o.es}.` } : null;
  }
  if (atom.kind === 'conjugation') {
    const { verb, tense, person, form } = atom;
    const options = [
      ...PERSON_ORDER.filter(p => p !== person).map(p => [p, tense]),
      ...Object.keys(TENSE_LABELS).filter(t => t !== tense && COMPOUND.has(t) === COMPOUND.has(tense))
        .map(t => [person, t]),
    ].filter(([p, t]) => {
      const other = conjugatedForm(verb, t, p);
      return other && other !== form;
    });
    if (!options.length) return null;
    const [p, t] = pick(options, rnd);
    return { claim: conjClaim(p, t), note: `${conjClaim(p, t)} is ${conjugatedForm(verb, t, p)}.` };
  }
  if (atom.kind === 'verbType') {
    const wrong = atom.type === 'regelmatig' ? pick(['klankveranderend', 'onregelmatig'], rnd) : 'regelmatig';
    return { claim: wrong, note: null };
  }
  return null;
}

function trueClaim(atom) {
  if (atom.kind === 'vocab') return atom.nl[0];
  if (atom.kind === 'conjugation') return conjClaim(atom.person, atom.tense);
  if (atom.kind === 'verbType') return atom.type;
  return null;
}

const subject = atom => (atom.kind === 'conjugation' ? atom.form : atom.kind === 'verbType' ? atom.verb : atom.es);
const joiner = atom => (atom.kind === 'verbType' ? 'is' : '=');
const sentence = (atom, claim) => `${subject(atom)} ${joiner(atom)} ${claim}`;

/**
 * Een bewering over dit item: de helft van de keren klopt ze.
 * @returns {{subject: string, joiner: string, claim: string, truth: boolean,
 *            expected: string, note: string|null}|null}
 */
export function statementFor(item, rnd = Math.random) {
  const { atom } = item;
  const right = trueClaim(atom);
  if (right == null) return null;
  const wrong = rnd() < 0.5 ? falseClaim(atom, rnd) : null;
  return {
    subject: subject(atom),
    joiner: joiner(atom),
    claim: wrong ? wrong.claim : right,
    truth: !wrong,
    expected: sentence(atom, right),
    note: wrong?.note ?? null,
  };
}

export default {
  id: 'trueFalse',
  label: 'Klopt het?',

  supports(item) {
    const a = item.atom;
    if (a.kind === 'vocab') return item.direction === 'es2nl' && siblings(a).length > 0;
    return a.kind === 'conjugation' || a.kind === 'verbType';
  },

  render(item, root, ctx) {
    const { atom } = item;
    const s = statementFor(item);
    const hint = atom.kind === 'conjugation' || atom.kind === 'verbType'
      ? [atom.verb, verbTranslation(atom.verb)].filter(Boolean).join(' = ')
      : null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Klopt het?'),
      el('div', { class: 'q-prompt tf-statement' },
        el('span', { class: 'q-word', lang: 'es' }, s.subject),
        el('span', { class: 'tf-joiner' }, s.joiner),
        el('span', { class: 'q-word tf-claim', lang: atom.kind === 'vocab' ? 'nl' : null }, s.claim),
        atom.kind === 'vocab' ? speakerButton(atom.es, ctx.speech) : null),
      ...(hint ? [el('p', { class: 'q-hint' }, `(${hint})`)] : []),
    );

    const opts = optionList([
      { value: 'true', label: [el('span', { class: 'tf-icon', 'aria-hidden': 'true' }, '✓'), ' Klopt'] },
      { value: 'false', label: [el('span', { class: 'tf-icon', 'aria-hidden': 'true' }, '✗'), ' Klopt niet'] },
    ], { compact: true, className: 'option--tf', onChoose: () => ctx.ready(true) });
    opts.list.classList.add('options--tf');
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        return {
          correct: chosen === String(s.truth),
          expected: s.expected,
          note: s.note,
          given: chosen == null ? null : `${sentence(atom, s.claim)}: ${chosen === 'true' ? 'klopt' : 'klopt niet'}`,
        };
      },
      reveal() { opts.reveal(String(s.truth)); },
    };
  },
};
