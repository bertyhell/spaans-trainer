/* Zelf intypen. De zwaarste oefenvorm en daarom de waardevolste. */

import { el, speakerButton, accentBar, FLAGS } from '../dom.js';
import { vocabAnswer, vocabPrompt } from '../data.js';
import { checkAnswer } from '../check.js';
import { showEmoji } from '../scheduler.js';

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
        el('span', { class: 'q-word', lang: toSpanish ? 'nl' : 'es' }, vocabPrompt(atom, direction)),
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
    if (toSpanish) root.append(accentBar(input, () => ctx.ready(input.value.trim().length > 0)));

    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, answers);
        return { ...r, given: input.value };
      },
      reveal({ correct, almost }) {
        input.disabled = true;
        input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
