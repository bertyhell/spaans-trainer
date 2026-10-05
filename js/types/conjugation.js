/* Vervoegingen, in twee gedaantes.
 *
 * conjugationGrid toont alle zes personen tegelijk — dat is precies hoe de
 * tabellen in de cursus eruitzien, en veel efficiënter dan zes losse vragen.
 * Elk vakje wordt apart beoordeeld en telt apart mee in zijn eigen Leitner-doos.
 *
 * conjugationSingle vraagt één vorm, met de andere personen als afleiders.
 */

import { el, shuffle, sample, optionList } from '../dom.js';
import { conjugationFamily, conjugatedForm, verbForms, verbTranslation, PERSON_LABELS, PERSON_ORDER, TENSE_LABELS } from '../data.js';
import { checkAnswer } from '../check.js';
import { mastery, itemKey } from '../scheduler.js';

const tenseLabel = t => TENSE_LABELS[t] ?? t;
const tenseShort = t => tenseLabel(t).split(' · ')[0];

/** Alle andere vormen van dit werkwoord, in alle tijden. "hablo" voor "habló"
 *  is dan geen accentfoutje maar een andere tijd. */
export const otherForms = (verb, form) => verbForms(verb).filter(f => f !== form);

/** "habló = él / ella, pretérito indefinido" — wie of wanneer een vorm is. */
export function describeForm(verb, form) {
  const hits = [];
  for (const tense of Object.keys(TENSE_LABELS)) {
    const persons = PERSON_ORDER.filter(p => conjugatedForm(verb, tense, p) === form);
    if (persons.length) hits.push(`${persons.map(p => PERSON_LABELS[p]).join(' of ')}, ${tenseShort(tense)}`);
  }
  return hits.length ? `${form} = ${hits.slice(0, 2).join('; ')}` : null;
}

/** "(spreken)" achter de infinitief, of niets als het woord niet bekend is. */
const translation = verb => {
  const nl = verbTranslation(verb);
  return nl ? el('span', { class: 'q-translation' }, `(${nl})`) : null;
};

/** Hoeveel vakjes je zelf invult: 1 bij een nieuw werkwoord, 6 als je het
 *  helemaal beheerst. De rest staat al ingevuld als steuntje. */
const blanksFor = (family, dir) =>
  Math.max(1, Math.min(family.length,
    1 + Math.round(mastery(family.map(a => itemKey(a.id, dir))) * (family.length - 1))));

export const conjugationGrid = {
  id: 'conjugationGrid',
  label: 'Vervoegingstabel',

  /** Alleen zinvol wanneer het hele rijtje van zes bestaat. */
  supports(item) {
    return item.atom.kind === 'conjugation' && conjugationFamily(item.atom).length === 6;
  },

  render(item, root, ctx) {
    const family = conjugationFamily(item.atom);
    const byPerson = new Map(family.map(a => [a.person, a]));
    const inputs = new Map();
    // De getrokken persoon is altijd een open vakje: anders wordt het item dat
    // de planner koos nooit beoordeeld en blijft het eeuwig "nieuw".
    const others = shuffle(family.map(a => a.person).filter(p => p !== item.atom.person));
    const blanks = new Set([item.atom.person, ...others]
      .slice(0, blanksFor(family, item.direction)));

    root.append(
      el('p', { class: 'q-instruction' }, 'Vervoeg dit werkwoord volledig'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-word', lang: 'es' }, item.atom.verb),
        translation(item.atom.verb),
        el('span', { class: 'q-tense' }, tenseLabel(item.atom.tense)),
      ),
    );

    const grid = el('div', { class: 'conj-grid' });
    PERSON_ORDER.forEach((person, i) => {
      const atom = byPerson.get(person);
      if (!atom) return;
      if (!blanks.has(person)) {
        grid.append(el('label', { class: 'conj-row' },
          el('span', { class: 'conj-person' }, PERSON_LABELS[person]),
          el('input', { class: 'conj-input is-given', type: 'text', lang: 'es',
            value: atom.form, readonly: true, tabindex: '-1',
            'aria-label': PERSON_LABELS[person] })));
        return;
      }
      const input = el('input', {
        class: 'conj-input', type: 'text',
        autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
        lang: 'es', 'aria-label': PERSON_LABELS[person],
        oninput: () => ctx.ready([...inputs.values()].some(x => x.value.trim())),
        onkeydown: e => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const next = PERSON_ORDER.slice(i + 1).find(p => inputs.has(p));
          if (next) inputs.get(next).focus();
          else ctx.submit();
        },
      });
      inputs.set(person, input);
      grid.append(el('label', { class: 'conj-row' },
        el('span', { class: 'conj-person' }, PERSON_LABELS[person]),
        input));
    });
    root.append(grid);

    return {
      focus() { inputs.values().next().value?.focus(); },

      check() {
        // Elke open persoon krijgt zijn eigen uitslag; de vraag als geheel is
        // pas juist als ze allemaal kloppen. Voorgegeven vakjes tellen niet mee.
        const per = [];
        for (const [person, input] of inputs) {
          const atom = byPerson.get(person);
          const r = checkAnswer(input.value, [atom.form], { rejectNear: otherForms(atom.verb, atom.form) });
          per.push({ atomId: atom.id, person, ...r, given: input.value });
        }
        const allOk = per.every(p => p.correct);
        const note = per.map(p => p.note).filter(Boolean)[0] ?? null;
        return {
          correct: allOk,
          almost: allOk && per.some(p => p.almost),
          expected: family.map(a => a.form).join(' · '),
          note,
          perAtom: per,
        };
      },

      reveal(result) {
        for (const p of result.perAtom ?? []) {
          const input = inputs.get(p.person);
          if (!input) continue;
          input.disabled = true;
          input.classList.add(p.almost ? 'is-almost' : p.correct ? 'is-correct' : 'is-wrong');
          if (!p.correct || p.almost) {
            input.after(el('span', { class: `conj-fix${p.almost ? ' is-almost' : ''}` },
              byPerson.get(p.person).form));
          }
        }
      },
    };
  },
};

export const conjugationSingle = {
  id: 'conjugationSingle',
  label: 'Vervoeging',

  supports: item => item.atom.kind === 'conjugation',

  render(item, root, ctx) {
    const { atom } = item;
    const family = conjugationFamily(atom);
    // Twee andere personen uit dezelfde tijd en dezelfde persoon uit een andere
    // tijd: zo volstaat de uitgang alleen niet om het juiste antwoord te vinden.
    const persons = [...new Set(family.map(a => a.form))].filter(f => f !== atom.form);
    const tenses = [...new Set(Object.keys(TENSE_LABELS)
      .filter(t => t !== atom.tense)
      .map(t => conjugatedForm(atom.verb, t, atom.person))
      .filter(f => f && f !== atom.form && !persons.includes(f) && !f.includes(' ')))];
    const picked = [...sample(tenses, 1), ...sample(persons, 3)].slice(0, 3);
    const options = shuffle([atom.form, ...picked]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Kies de juiste vorm'),
      el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
        el('span', { class: 'q-person' }, PERSON_LABELS[atom.person]),
        el('span', { class: 'q-blank' }, '___'),
        el('span', { class: 'q-infinitive' }, `(${atom.verb})`),
      ),
      el('p', { class: 'q-hint' },
        [verbTranslation(atom.verb), tenseLabel(atom.tense)].filter(Boolean).join(' · ')),
    );

    const opts = optionList([...new Set(options)], { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        const ok = chosen === atom.form;
        return { correct: ok, expected: atom.form, given: chosen,
          note: ok || !chosen ? null : describeForm(atom.verb, chosen) };
      },
      reveal() { opts.reveal(atom.form); },
    };
  },
};
