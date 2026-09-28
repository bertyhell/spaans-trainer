/* Zet de accenten terug. Het woord verschijnt kaal — jij herstelt de spelling.
 * Hier is de controle bewust streng: accenten zijn juist het onderwerp. */

import { el, speakerButton, accentBar } from '../dom.js';
import { stripAccents, checkAnswer } from '../check.js';
import { showEmoji } from '../scheduler.js';

const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];

export default {
  id: 'accents',
  label: 'Accenten',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'vocab') return false;
    // Alleen zinvol als het woord écht accenten of een ñ bevat.
    return stripAccents(a.es) !== a.es || /ñ/.test(a.es);
  },

  render(item, root, ctx) {
    const { atom } = item;
    // De ñ blijft staan: die hoor je, en anders wordt het giswerk.
    const bare = stripAccents(atom.es);

    root.append(
      el('p', { class: 'q-instruction' }, 'Zet de accenten op hun plaats'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word q-word--bare', lang: 'es' }, bare),
        speakerButton(atom.es, ctx.speech),
      ),
      el('p', { class: 'q-hint' }, atom.nl[0]),
    );

    const input = el('input', {
      class: 'answer-input', type: 'text', lang: 'es', value: bare,
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      'aria-label': 'Woord met accenten',
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    root.append(input);

    root.append(accentBar(input, () => ctx.ready(true), ACCENT_KEYS));

    return {
      focus() {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      },
      check() {
        // strictAccents: een accentfout is hier géén "bijna".
        const r = checkAnswer(input.value, [atom.es], { strictAccents: true });
        return { ...r, given: input.value };
      },
      reveal({ correct, almost }) {
        input.disabled = true;
        input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
