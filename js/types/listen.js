/* Luisteroefeningen via de spraaksynthese van de browser.
 * Zonder Spaanse stem meldt supports() false en verdwijnen deze vormen
 * stilletjes uit de lessen. */

import { el, shuffle, sample } from '../dom.js';
import { siblings } from '../data.js';
import { checkAnswer } from '../check.js';

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
    return item.atom.kind === 'vocab' && speech.available();
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

    root.append(el('div', { class: 'accent-bar' }, ACCENT_KEYS.map(ch =>
      el('button', {
        class: 'accent-key', type: 'button', tabindex: '-1',
        onmousedown: e => e.preventDefault(),
        onclick: () => {
          input.value += ch;
          input.focus();
          ctx.ready(true);
        },
      }, ch))));

    return {
      focus() { input.focus(); },
      check() {
        const r = checkAnswer(input.value, [atom.es]);
        return { ...r, given: input.value };
      },
      reveal({ correct }) {
        input.disabled = true;
        input.classList.add(correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};

export const listenChoose = {
  id: 'listenChoose',
  label: 'Luister en kies',

  supports(item, { speech }) {
    return item.atom.kind === 'vocab'
      && speech.available()
      && siblings(item.atom).length >= 3;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const correct = atom.nl[0];
    const options = shuffle([correct, ...sample(siblings(atom), 3).map(a => a.nl[0])]);
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' }, 'Wat betekent wat je hoort?'),
      el('div', { class: 'q-prompt q-prompt--audio' }, player(atom.es, ctx.speech)),
    );

    const list = el('div', { class: 'options' });
    for (const opt of options) {
      list.append(el('button', {
        class: 'option', type: 'button', dataset: { value: opt },
        onclick: () => {
          chosen = opt;
          list.querySelectorAll('.option').forEach(b =>
            b.classList.toggle('is-selected', b.dataset.value === opt));
          ctx.ready(true);
        },
      }, opt));
    }
    root.append(list);

    return {
      focus() { list.querySelector('.option')?.focus(); },
      check: () => ({
        correct: atom.nl.includes(chosen),
        expected: `${atom.es} — ${correct}`, note: null, given: chosen,
      }),
      reveal({ correct: ok }) {
        list.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.dataset.value === correct) b.classList.add('is-correct');
          else if (b.dataset.value === chosen && !ok) b.classList.add('is-wrong');
        });
      },
    };
  },
};
