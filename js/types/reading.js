/* Leesbegrip: een tekst uit het boek met een vraag erover. De tekst staat
 * bij elke vraag opnieuw, want je krijgt de vragen niet na elkaar.
 * Elk gekend woord in de tekst is aantikbaar voor zijn betekenis (js/gloss.js). */

import { el, speakerButton, optionList, shuffleOptions } from '../dom.js';
import { getText } from '../data.js';
import { glossedParagraph } from '../gloss.js';

export default {
  id: 'reading',
  label: 'Lezen',

  supports: item => item.atom.kind === 'reading' && Boolean(getText(item.atom.text)?.es),

  render(item, root, ctx) {
    const { atom } = item;
    const text = getText(atom.text);

    root.append(
      el('p', { class: 'q-instruction' }, 'Lees de tekst en beantwoord de vraag'),
      el('details', { class: 'reading', open: true },
        el('summary', { class: 'reading-title', lang: 'es' }, text.title,
          speakerButton(text.es, ctx.speech)),
        el('div', { class: 'reading-text', lang: 'es', tabindex: '0' },
          text.es.split(/\n{2,}/).map(glossedParagraph))),
      el('p', { class: 'q-hint' }, 'Tik op een woord voor de betekenis.'),
      el('div', { class: 'q-prompt q-prompt--sentence' }, el('strong', {}, atom.q)),
    );

    const opts = optionList(shuffleOptions(atom.options), { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({ correct: opts.chosen() === atom.answer, expected: atom.answer, note: null, given: opts.chosen() }),
      reveal() { opts.reveal(atom.answer); },
    };
  },
};
