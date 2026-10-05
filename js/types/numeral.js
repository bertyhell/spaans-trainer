/* Getallen, uren, data en prijzen — elke keer een ander voorbeeld.
 *
 * numeralWrite  (maken)     je ziet 345, een klok, 15/3 of 12,50 € en typt het
 *                           voluit in het Spaans
 * numeralListen (herkennen) je hoort het en typt het in cijfers — de vaardigheid
 *                           die je aan de kassa of de telefoon nodig hebt
 * numeralRead   (herkennen) je leest het voluit en kiest de cijfers, met
 *                           verraderlijke buren: sesenta of setenta, siete
 *                           menos cuarto of 7:45
 *
 * Zie js/numerals.js voor het rekenwerk. */

import { el, shuffle, optionList, accentBar } from '../dom.js';
import { checkAnswer } from '../check.js';
import { generate, isDigits, confusables, DIGIT_PLACEHOLDER } from '../numerals.js';
import { hintLadder } from '../hintLadder.js';

const isNumeral = item => item.atom.kind === 'numeral';

const WRITE_PROMPT = {
  number: 'Schrijf het getal voluit',
  year: 'Lees het jaartal voor: schrijf het voluit',
  time: '¿Qué hora es? Schrijf het uur voluit',
  date: '¿Qué fecha es? Schrijf de datum voluit',
  price: '¿Cuánto cuesta? Schrijf de prijs voluit',
};

/** Een wijzerplaat als inline SVG, met het uur ook in cijfers voor een schermlezer. */
export function clockFace([h, m]) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '-50 -50 100 100');
  svg.setAttribute('class', 'clock');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Klok: ${h}:${String(m).padStart(2, '0')}`);
  const add = (tag, attrs) => {
    const n = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
    return n;
  };
  add('circle', { r: 46, class: 'clock-rim' });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const long = i % 3 === 0;
    add('line', {
      x1: Math.sin(a) * (long ? 34 : 38), y1: -Math.cos(a) * (long ? 34 : 38),
      x2: Math.sin(a) * 42, y2: -Math.cos(a) * 42, class: long ? 'clock-tick clock-tick--long' : 'clock-tick',
    });
  }
  const hand = (deg, len, cls) => {
    const a = (deg * Math.PI) / 180;
    add('line', { x1: 0, y1: 0, x2: Math.sin(a) * len, y2: -Math.cos(a) * len, class: cls });
  };
  hand(((h % 12) + m / 60) * 30, 22, 'clock-hand clock-hand--hour');
  hand(m * 6, 34, 'clock-hand clock-hand--minute');
  add('circle', { r: 3, class: 'clock-pin' });
  return svg;
}

/** Wat je ziet: een klok voor een uur, anders groot in cijfers. */
function shownValue(sample) {
  if (sample.kind === 'time') {
    return el('div', { class: 'q-prompt q-prompt--clock' }, clockFace(sample.value),
      el('span', { class: 'clock-digital' }, sample.display));
  }
  return el('div', { class: 'q-prompt' }, el('span', { class: 'q-word q-number' }, sample.display));
}

function textInput(ctx, { lang, placeholder, label, inputmode = null }) {
  const input = el('input', {
    class: 'answer-input', type: 'text', lang, inputmode,
    autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
    placeholder, 'aria-label': label,
    oninput: () => ctx.ready(input.value.trim().length > 0),
    onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
  });
  return input;
}

const mark = (input, { correct, almost }) => {
  input.disabled = true;
  input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
};

export const numeralWrite = {
  id: 'numeralWrite',
  label: 'Schrijf voluit',

  supports: isNumeral,

  render(item, root, ctx) {
    const sample = generate(item.atom);
    root.append(el('p', { class: 'q-instruction' }, WRITE_PROMPT[sample.kind]), shownValue(sample));

    const input = textInput(ctx, { lang: 'es', placeholder: 'en español…', label: 'Voluit in het Spaans' });
    const hint = hintLadder(sample.words);
    root.append(input, accentBar(input, () => ctx.ready(input.value.trim().length > 0), ['á', 'é', 'í', 'ó', 'ú', 'ñ']), hint.node);

    return {
      focus() { input.focus(); },
      check() {
        let r = checkAnswer(input.value, [sample.words, ...sample.accepted]);
        if (!r.correct && sample.digital?.length && checkAnswer(input.value, sample.digital).correct) {
          r = { correct: true, almost: true, note: `Klopt, maar na het halfuur tel je meestal af: ${sample.words}.` };
        }
        return hint.apply({ ...r, expected: `${sample.display} = ${sample.words}`, given: input.value });
      },
      reveal(result) {
        mark(input, result);
        hint.disable();
        // Na afloop: hoor hoe het klinkt.
        ctx.speech.speak(sample.words);
      },
    };
  },
};

export const numeralListen = {
  id: 'numeralListen',
  label: 'Luister en schrijf in cijfers',

  supports: (item, { speech }) => isNumeral(item) && speech.available(),

  render(item, root, ctx) {
    const sample = generate(item.atom);
    const play = rate => ctx.speech.speak(sample.words, { rate });
    setTimeout(() => play(0.9), 250);

    root.append(
      el('p', { class: 'q-instruction' }, 'Wat hoor je? Schrijf het in cijfers.'),
      el('div', { class: 'q-prompt q-prompt--audio' },
        el('button', { class: 'play-big', type: 'button', 'aria-label': 'Speel opnieuw af', onclick: () => play(0.9) }, '🔊'),
        el('button', { class: 'play-slow', type: 'button', 'aria-label': 'Speel traag af', onclick: () => play(0.6) }, '🐢')),
    );
    const input = textInput(ctx, {
      lang: 'nl', placeholder: `bv. ${DIGIT_PLACEHOLDER[sample.kind]}`, label: 'In cijfers',
      inputmode: sample.kind === 'number' || sample.kind === 'year' ? 'numeric' : 'decimal',
    });
    root.append(input);

    return {
      focus() { input.focus(); },
      check() {
        const correct = isDigits(sample, input.value);
        return { correct, expected: `${sample.display} — ${sample.words}`, given: input.value, note: null };
      },
      reveal(result) { mark(input, result); },
    };
  },
};

export const numeralRead = {
  id: 'numeralRead',
  label: 'Lees en kies',

  supports: isNumeral,

  render(item, root, ctx) {
    const sample = generate(item.atom);
    const options = shuffle([sample.display, ...confusables(sample)]);
    root.append(
      el('p', { class: 'q-instruction' }, 'Welk getal staat er?'),
      el('div', { class: 'q-prompt q-prompt--sentence' }, el('strong', { lang: 'es' }, sample.words)),
    );
    const opts = optionList(options, { compact: true, onChoose: () => ctx.ready(true) });
    root.append(opts.list);
    return {
      focus: opts.focus,
      check: () => ({ correct: opts.chosen() === sample.display, expected: `${sample.words} = ${sample.display}`, given: opts.chosen(), note: null }),
      reveal() { opts.reveal(sample.display); ctx.speech.speak(sample.words); },
    };
  },
};
