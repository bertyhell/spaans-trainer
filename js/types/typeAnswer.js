/* Zelf intypen. De zwaarste oefenvorm en daarom de waardevolste. */

import { el, speakerButton, accentBar, FLAGS } from '../dom.js';
import { vocabAnswer, vocabPrompt, synonymsOf } from '../data.js';
import { checkAnswer } from '../check.js';
import { showEmoji } from '../scheduler.js';
import { hintLadder } from '../hintLadder.js';

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
    const hint = hintLadder(answers[0]);
    root.append(hint.node);

    return {
      focus() { input.focus(); },
      check() {
        // Accenten zijn enkel in het Spaans leerstof.
        const r = checkAnswer(input.value, answers, { ignoreAccents: !toSpanish });
        if (!r.correct && toSpanish) {
          // Een ander Spaans woord voor hetzelfde ("los lentes" voor "de bril")
          // is niet fout. Wel tonen welk woord we zochten.
          const syn = synonymsOf(atom, { gloss: atom.nl[0] })
            .find(o => checkAnswer(input.value, [o.es]).correct);
          if (syn) {
            return hint.apply({ correct: true, expected: atom.es, given: input.value,
              note: `Ook juist! ${syn.es} betekent ook „${atom.nl[0]}”. Hier zochten we: ${atom.es}` });
          }
        }
        return hint.apply({ ...r, given: input.value });
      },
      reveal({ correct, almost }) {
        input.disabled = true;
        hint.disable();
        input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
