/* Meerkeuzevragen uit de toetsen en het werkboek. Anders dan bij de
 * woordenschat liggen de opties vast: ze komen zo uit de toets. Alleen de
 * volgorde wisselt. */

import { el, speakerButton, optionList, splitGap, shuffleOptions } from '../dom.js';

export default {
  id: 'choice',
  label: 'Toetsvraag',

  supports: item => item.atom.kind === 'choice',

  render(item, root, ctx) {
    const { atom } = item;
    const [before, after] = splitGap(atom.prompt);
    const blank = after === null ? null : el('span', { class: 'q-blank' }, '___');

    root.append(el('p', { class: 'q-instruction' }, atom.instruction ?? 'Kies het juiste antwoord'));
    if (atom.context) root.append(el('p', { class: 'q-context', lang: 'es' }, atom.context));
    root.append(el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
      el('span', {}, before), blank, blank ? el('span', {}, after) : null));

    const opts = optionList(shuffleOptions(atom.options), {
      lang: 'es',
      compact: atom.options.every(o => o.length <= 12),
      onChoose: opt => {
        if (blank) { blank.textContent = opt; blank.classList.add('is-filled'); }
        ctx.ready(true);
      },
    });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({ correct: opts.chosen() === atom.answer, expected: atom.answer, note: null, given: opts.chosen() }),
      reveal() {
        opts.reveal(atom.answer);
        if (blank) blank.textContent = atom.answer;
        const full = blank ? `${before}${atom.answer}${after}` : null;
        const sb = full && speakerButton(full, ctx.speech);
        if (sb) blank.parentElement.append(sb);
      },
    };
  },
};
