/* Zelf intypen. De zwaarste oefenvorm en daarom de waardevolste. */

import { el, speakerButton } from '../dom.js';
import { vocabAnswer, vocabPrompt } from '../data.js';
import { checkAnswer } from '../check.js';
import { showEmoji } from '../scheduler.js';

/* Spaanse tekens die op een Nederlands toetsenbord lastig zijn. */
const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

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
    root.append(input);

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
