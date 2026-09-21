/* Vervoegingen, in twee gedaantes.
 *
 * conjugationGrid toont alle zes personen tegelijk — dat is precies hoe de
 * tabellen in de cursus eruitzien, en veel efficiënter dan zes losse vragen.
 * Elk vakje wordt apart beoordeeld en telt apart mee in zijn eigen Leitner-doos.
 *
 * conjugationSingle vraagt één vorm, met de andere personen als afleiders.
 */

import { el, shuffle, sample } from '../dom.js';
import { conjugationFamily, PERSON_LABELS, PERSON_ORDER, TENSE_LABELS } from '../data.js';
import { checkAnswer } from '../check.js';

const tenseLabel = t => TENSE_LABELS[t] ?? t;

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

    root.append(
      el('p', { class: 'q-instruction' }, 'Vervoeg dit werkwoord volledig'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-word' }, item.atom.verb),
        el('span', { class: 'q-tense' }, tenseLabel(item.atom.tense)),
      ),
    );

    const grid = el('div', { class: 'conj-grid' });
    PERSON_ORDER.forEach((person, i) => {
      const atom = byPerson.get(person);
      if (!atom) return;
      const input = el('input', {
        class: 'conj-input', type: 'text',
        autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
        lang: 'es', 'aria-label': PERSON_LABELS[person],
        oninput: () => ctx.ready([...inputs.values()].some(x => x.value.trim())),
        onkeydown: e => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const next = PERSON_ORDER[i + 1];
          if (next && inputs.has(next)) inputs.get(next).focus();
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
      focus() { inputs.get('1s')?.focus(); },

      check() {
        // Elke persoon krijgt zijn eigen uitslag; de vraag als geheel is pas
        // juist als alle zes kloppen.
        const others = p => family.filter(a => a.person !== p).map(a => a.form);
        const per = [];
        for (const [person, input] of inputs) {
          const atom = byPerson.get(person);
          const r = checkAnswer(input.value, [atom.form], { rejectNear: others(person) });
          per.push({ atomId: atom.id, person, ...r, given: input.value });
        }
        const allOk = per.every(p => p.correct);
        const note = per.map(p => p.note).filter(Boolean)[0] ?? null;
        return {
          correct: allOk,
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
          input.classList.add(p.correct ? 'is-correct' : 'is-wrong');
          if (!p.correct) {
            input.after(el('span', { class: 'conj-fix' }, byPerson.get(p.person).form));
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
    const others = family.filter(a => a.id !== atom.id).map(a => a.form);
    const options = shuffle([atom.form, ...sample(others, Math.min(3, others.length))]);
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Kies de juiste vorm'),
      el('div', { class: 'q-prompt q-prompt--sentence' },
        el('span', { class: 'q-person' }, PERSON_LABELS[atom.person]),
        el('span', { class: 'q-blank' }, '___'),
        el('span', { class: 'q-infinitive' }, `(${atom.verb})`),
      ),
      el('p', { class: 'q-hint' }, tenseLabel(atom.tense)),
    );

    const list = el('div', { class: 'options' });
    for (const form of options) {
      list.append(el('button', {
        class: 'option', type: 'button', dataset: { value: form },
        onclick: () => {
          chosen = form;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === form));
          ctx.ready(true);
        },
      }, form));
    }
    root.append(list);

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check: () => ({ correct: chosen === atom.form, expected: atom.form, note: null, given: chosen }),
      reveal({ correct }) {
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === atom.form) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !correct) b.classList.add('is-wrong');
        });
      },
    };
  },
};
