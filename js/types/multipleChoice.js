/* Meerkeuze. Afleiders komen uit hetzelfde thema, zodat de keuze echt over
 * betekenis gaat en niet over "welke hoort hier duidelijk niet thuis". */

import { el, shuffle, sample, speakerButton, optionList } from '../dom.js';
import { vocabAnswer, vocabPrompt, siblings } from '../data.js';
import { showEmoji } from '../scheduler.js';

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

    const options = shuffle([...new Set([correct, ...distractors])]);

    const prompt = vocabPrompt(atom, direction);
    root.append(
      el('p', { class: 'q-instruction' },
        direction === 'nl2es' ? 'Hoe zeg je dit in het Spaans?' : 'Wat betekent dit?'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word', lang: direction === 'nl2es' ? 'nl' : 'es' }, prompt),
        direction === 'es2nl' ? speakerButton(atom.es, ctx.speech) : null,
      ),
    );

    const opts = optionList(options, {
      lang: direction === 'nl2es' ? 'es' : 'nl',
      onChoose: () => ctx.ready(true),
    });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({ correct: answers.includes(opts.chosen()), expected: correct, note: null, given: opts.chosen() }),
      reveal() { opts.reveal(correct); },
    };
  },
};
