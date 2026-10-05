/* Meerkeuze. Afleiders komen uit hetzelfde thema, zodat de keuze echt over
 * betekenis gaat en niet over "welke hoort hier duidelijk niet thuis". */

import { el, shuffle, sample, speakerButton, optionList } from '../dom.js';
import { vocabAnswer, vocabPrompt, siblings } from '../data.js';
import { showEmoji } from '../scheduler.js';

const OPTION_COUNT = 4;

const hasArticle = a => /^(el|la|los|las) /i.test(a.es);
const shuffleInPlace = arr => arr.splice(0, arr.length, ...shuffle(arr));

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

    // Eerst afleiders van dezelfde woordsoort (en bij zelfstandige naamwoorden
    // ook met een lidwoord): één werkwoord tussen drie dingen wijst zichzelf aan.
    const shown = a => (direction === 'nl2es' ? a.es : a.nl[0]);
    const pool = siblings(atom);
    const alike = pool.filter(o => o.pos === atom.pos && hasArticle(o) === hasArticle(atom));
    const options = [correct];
    for (const o of [...sample(alike, alike.length), ...sample(pool, pool.length)]) {
      if (options.length >= OPTION_COUNT) break;
      const d = shown(o);
      if (!options.includes(d) && !answers.includes(d)) options.push(d);
    }
    shuffleInPlace(options);

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
