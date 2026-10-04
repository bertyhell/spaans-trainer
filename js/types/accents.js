/* Zet de accenten terug. Het woord verschijnt kaal — jij herstelt de spelling.
 * Hier is de controle bewust streng: accenten zijn juist het onderwerp.
 *
 * Kaal betekent ook zonder ñ. Bij la caña of el otoño is de ñ het enige
 * teken: liet je die staan, dan stond het juiste antwoord al in de opgave. */

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
    const bare = stripAccents(atom.es).replace(/ñ/g, 'n').replace(/Ñ/g, 'N');

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
        // strictAccents: een accentfout is hier géén "bijna". Een "typfoutje"
        // evenmin: het woord staat al voorgevuld, dus "cana" voor "caña" is
        // de ñ vergeten, geen tikfout.
        const r = checkAnswer(input.value, [atom.es], { strictAccents: true });
        if (r.almost) return { correct: false, expected: atom.es, note: null, given: input.value };
        return { ...r, given: input.value };
      },
      reveal({ correct, almost }) {
        input.disabled = true;
        input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
