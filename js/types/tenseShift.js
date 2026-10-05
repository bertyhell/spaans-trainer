/* Zet om: je ziet een vorm in de ene tijd en typt dezelfde persoon in een
 * andere. "yo hablo (presente) → indefinido: hablé". Zo oefen je de tijden
 * naast elkaar in plaats van elk rijtje apart.
 *
 * Alleen enkelvoudige tijden aan beide kanten: "he hablado → futuro" is meer
 * hulpwerkwoord dan werkwoord. */

import { el, sample, accentBar } from '../dom.js';
import { conjugatedForm, verbTranslation, PERSON_LABELS, TENSE_LABELS } from '../data.js';
import { checkAnswer } from '../check.js';
import { otherForms } from './conjugation.js';

const SIMPLE = ['presente', 'indefinido', 'imperfecto', 'futuro', 'condicional', 'subjuntivo'];
const tenseShort = t => (TENSE_LABELS[t] ?? t).split(' · ')[0];

/** De tijden waaruit je dit item kan laten omzetten: een andere vorm, zonder spatie. */
export function sourceTenses(atom) {
  if (!SIMPLE.includes(atom.tense)) return [];
  return SIMPLE.filter(t => {
    if (t === atom.tense) return false;
    const f = conjugatedForm(atom.verb, t, atom.person);
    return f && !/\s/.test(f) && f !== atom.form;
  });
}

export default {
  id: 'tenseShift',
  label: 'Zet om',

  supports: item => item.atom.kind === 'conjugation' && !/\s/.test(item.atom.form)
    && sourceTenses(item.atom).length > 0,

  render(item, root, ctx) {
    const { atom } = item;
    const sources = sourceTenses(atom);
    // De presente kent iedereen het best: die is het liefst het vertrekpunt.
    const from = sources.includes('presente') && Math.random() < 0.5 ? 'presente' : sample(sources, 1)[0];
    const fromForm = conjugatedForm(atom.verb, from, atom.person);
    const person = PERSON_LABELS[atom.person];
    const nl = verbTranslation(atom.verb);

    root.append(
      el('p', { class: 'q-instruction' }, `Zet om naar de ${tenseShort(atom.tense)}`),
      el('div', { class: 'q-prompt shift-prompt' },
        el('span', { class: 'shift-person' }, person),
        el('span', { class: 'q-word', lang: 'es' }, fromForm),
        el('span', { class: 'shift-tense' }, tenseShort(from)),
        el('span', { class: 'shift-arrow', 'aria-hidden': 'true' }, '→'),
        el('span', { class: 'q-tense' }, tenseShort(atom.tense))),
      el('p', { class: 'q-hint' }, `(${[atom.verb, nl].filter(Boolean).join(' = ')})`),
    );

    const input = el('input', {
      class: 'answer-input', type: 'text',
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      lang: 'es', placeholder: `${person.split(' / ')[0]} …`, 'aria-label': `${person}, ${tenseShort(atom.tense)}`,
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    root.append(el('div', { class: 'input-wrap' }, input),
      accentBar(input, () => ctx.ready(input.value.trim().length > 0), ['á', 'é', 'í', 'ó', 'ú', 'ñ']));

    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, [atom.form], { rejectNear: otherForms(atom.verb, atom.form) });
        const stayed = !r.correct && checkAnswer(input.value, [fromForm]).correct;
        return {
          ...r,
          expected: `${fromForm} → ${atom.form}`,
          note: stayed ? `Dat is nog de ${tenseShort(from)}.` : r.note,
          given: input.value,
        };
      },
      reveal() { input.disabled = true; },
    };
  },
};
