/* Klemtoon: tik op de lettergreep die de klemtoon krijgt. Het accentteken
 * verraadt het soms, en dat is precies de regel die je moet leren; bij de
 * andere woorden moet je de regel zelf toepassen. De uitspraak komt pas na
 * het antwoord, anders hoor je het antwoord. */

import { el, speakerButton, markSelected } from '../dom.js';

export default {
  id: 'stressTap',
  label: 'Klemtoon',

  supports: item => item.atom.kind === 'stress',

  render(item, root, ctx) {
    const { atom } = item;
    let chosen = null;

    root.append(el('p', { class: 'q-instruction' }, 'Tik op de lettergreep met de klemtoon'));

    const row = el('div', { class: 'syllables', lang: 'es', role: 'group', 'aria-label': atom.es });
    atom.syllables.forEach((syl, i) => {
      row.append(el('button', {
        class: 'option syllable', type: 'button', dataset: { value: String(i) },
        'aria-label': `lettergreep ${i + 1}: ${syl}`, 'aria-pressed': 'false',
        onclick: () => {
          chosen = i;
          markSelected(row, String(i));
          ctx.ready(true);
        },
      }, syl));
    });
    root.append(el('div', { class: 'q-prompt' }, row));
    if (atom.nl) root.append(el('p', { class: 'q-hint' }, atom.nl));

    const marked = atom.syllables.map((s, i) => (i === atom.stressed ? s.toUpperCase() : s)).join('·');

    return {
      focus() { row.querySelector('.syllable')?.focus(); },
      check: () => ({
        correct: chosen === atom.stressed, expected: marked, note: null,
        given: chosen === null ? null : atom.syllables[chosen],
      }),
      reveal() {
        row.querySelectorAll('.syllable').forEach((b, i) => {
          b.disabled = true;
          if (i === atom.stressed) b.classList.add('is-correct');
          else if (i === chosen) b.classList.add('is-wrong');
        });
        const sb = speakerButton(atom.es, ctx.speech);
        if (sb) row.parentElement.append(sb);
      },
    };
  },
};
