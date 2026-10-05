/* Luisteroefeningen via de spraaksynthese van de browser.
 * Zonder Spaanse stem meldt supports() false en verdwijnen deze vormen
 * stilletjes uit de lessen. */

import { el, shuffle, sample, accentBar, optionList } from '../dom.js';
import { siblings } from '../data.js';
import { checkAnswer } from '../check.js';
import { hintLadder } from '../hintLadder.js';

const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];

/** Grote afspeelknop; speelt meteen af bij het tonen van de vraag. */
function player(text, speech, label = 'Speel opnieuw af') {
  const btn = el('button', {
    class: 'play-big', type: 'button', 'aria-label': label,
    onclick: () => speech.speak(text),
  }, '🔊');
  // De les start vanuit een tik, dus autoplay is hier toegestaan.
  setTimeout(() => speech.speak(text), 250);
  return btn;
}

export const listenType = {
  id: 'listenType',
  label: 'Luister en typ',

  supports(item, { speech }) {
    // Een woord herkennen dat je hoort is de es→nl-kant, niet zelf produceren.
    return item.atom.kind === 'vocab' && item.direction === 'es2nl' && speech.available();
  },

  render(item, root, ctx) {
    const { atom } = item;

    root.append(
      el('p', { class: 'q-instruction' }, 'Wat hoor je? Typ het in het Spaans.'),
      el('div', { class: 'q-prompt q-prompt--audio' }, player(atom.es, ctx.speech)),
    );

    const input = el('input', {
      class: 'answer-input', type: 'text', lang: 'es',
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      placeholder: 'en español…', 'aria-label': 'Wat je hoort',
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    root.append(input);

    root.append(accentBar(input, () => ctx.ready(true), ACCENT_KEYS));
    const hint = hintLadder(atom.es);
    root.append(hint.node);

    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, [atom.es]);
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

export const listenChoose = {
  id: 'listenChoose',
  label: 'Luister en kies',

  supports(item, { speech }) {
    return item.atom.kind === 'vocab' && item.direction === 'es2nl'
      && speech.available()
      && siblings(item.atom).length >= 3;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const correct = atom.nl[0];
    const options = shuffle([...new Set([correct, ...sample(siblings(atom), 3).map(a => a.nl[0])])]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Wat betekent wat je hoort?'),
      el('div', { class: 'q-prompt q-prompt--audio' }, player(atom.es, ctx.speech)),
    );

    const opts = optionList(options, { onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({
        correct: atom.nl.includes(opts.chosen()),
        expected: `${atom.es} — ${correct}`, note: null, given: opts.chosen(),
      }),
      reveal() { opts.reveal(correct); },
    };
  },
};
