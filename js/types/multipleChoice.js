/* Meerkeuze. Afleiders komen uit hetzelfde thema, zodat de keuze echt over
 * betekenis gaat en niet over "welke hoort hier duidelijk niet thuis". */

import { el, shuffle, sample, speakerButton } from '../dom.js';
import { vocabAnswer, vocabPrompt, siblings } from '../data.js';

const OPTION_COUNT = 4;

export default {
  id: 'multipleChoice',
  label: 'Meerkeuze',

  supports(item) {
    if (item.atom.kind !== 'vocab') return false;
    // Zonder genoeg afleiders uit hetzelfde thema wordt het te makkelijk.
    return siblings(item.atom).length >= OPTION_COUNT - 1;
  },

  render(item, root, ctx) {
    const { atom, direction } = item;
    const answers = vocabAnswer(atom, direction);
    const correct = answers[0];

    const distractors = sample(siblings(atom), OPTION_COUNT - 1)
      .map(a => (direction === 'nl2es' ? a.es : a.nl[0]))
      .filter(d => !answers.includes(d));

    const options = shuffle([correct, ...distractors]);
    let chosen = null;

    const prompt = vocabPrompt(atom, direction);
    root.append(
      el('p', { class: 'q-instruction' },
        direction === 'nl2es' ? 'Hoe zeg je dit in het Spaans?' : 'Wat betekent dit?'),
      el('div', { class: 'q-prompt' },
        atom.emoji ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word' }, prompt),
        direction === 'es2nl' ? speakerButton(atom.es, ctx.speech) : null,
      ),
    );

    const list = el('div', { class: 'options' });
    for (const opt of options) {
      const btn = el('button', {
        class: 'option', type: 'button', dataset: { value: opt },
        onclick: () => {
          chosen = opt;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === opt));
          ctx.ready(true);
        },
      }, opt);
      list.append(btn);
    }
    root.append(list);

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check() {
        return { correct: answers.includes(chosen), expected: correct, note: null, given: chosen };
      },
      reveal({ correct: wasCorrect }) {
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === correct) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !wasCorrect) b.classList.add('is-wrong');
        });
      },
    };
  },
};
