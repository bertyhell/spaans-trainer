/* Zelf intypen. De zwaarste oefenvorm en daarom de waardevolste. */

import { el, speakerButton } from '../dom.js';
import { vocabAnswer, vocabPrompt } from '../data.js';
import { checkAnswer } from '../check.js';
import { showEmoji } from '../scheduler.js';

/* Spaanse tekens die op een Nederlands toetsenbord lastig zijn. */
const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

/* Vlaggetje in het invoerveld: welke taal moet je typen? SVG i.p.v. emoji,
   want vlag-emoji tonen niet op Windows. */
const FLAGS = {
  es: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></svg>',
  nl: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#000"/><rect x="1" width="1" height="2" fill="#FDDA24"/><rect x="2" width="1" height="2" fill="#EF3340"/></svg>',
};

export default {
  id: 'typeAnswer',
  label: 'Zelf intypen',

  supports: item => item.atom.kind === 'vocab',

  render(item, root, ctx) {
    const { atom, direction } = item;
    const answers = vocabAnswer(atom, direction);
    const toSpanish = direction === 'nl2es';

    root.append(
      el('p', { class: 'q-instruction' },
        toSpanish ? 'Typ dit in het Spaans' : 'Typ dit in het Nederlands'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word' }, vocabPrompt(atom, direction)),
        !toSpanish ? speakerButton(atom.es, ctx.speech) : null,
      ),
    );

    const input = el('input', {
      class: 'answer-input',
      type: 'text',
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      lang: toSpanish ? 'es' : 'nl',
      placeholder: toSpanish ? 'en español…' : 'in het Nederlands…',
      'aria-label': 'Jouw antwoord',
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    const flag = el('span', { class: 'input-flag', title: toSpanish ? 'Spaans' : 'Nederlands' });
    flag.innerHTML = FLAGS[toSpanish ? 'es' : 'nl'];
    root.append(el('div', { class: 'input-wrap' }, input, flag));

    // Accentbalkje: alleen nuttig wanneer er Spaans getypt moet worden.
    if (toSpanish) {
      root.append(el('div', { class: 'accent-bar' }, ACCENT_KEYS.map(ch =>
        el('button', {
          class: 'accent-key', type: 'button', tabindex: '-1',
          onmousedown: e => e.preventDefault(),   // focus niet stelen
          onclick: () => {
            const s = input.selectionStart ?? input.value.length;
            const e2 = input.selectionEnd ?? s;
            input.value = input.value.slice(0, s) + ch + input.value.slice(e2);
            input.setSelectionRange(s + 1, s + 1);
            input.focus();
            ctx.ready(input.value.trim().length > 0);
          },
        }, ch))));
    }

    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, answers);
        return { ...r, given: input.value };
      },
      reveal({ correct }) {
        input.disabled = true;
        input.classList.add(correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
