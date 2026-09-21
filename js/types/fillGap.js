/* Vul het gaatje in. Werkt voor grammaticaregels (één regel, meerdere
 * voorbeeldzinnen), voor zinnen uit de oefeningen en voor liedjesregels. */

import { el, shuffle, speakerButton } from '../dom.js';
import { checkAnswer } from '../check.js';

/** Kiest deterministisch per beurt één voorbeeld uit een grammatica-atoom. */
const pickExample = atom => atom.examples[Math.floor(Math.random() * atom.examples.length)];

/** Splitst een zin rond het eerste ___ en geeft de twee helften terug. */
function splitGap(text) {
  const i = text.indexOf('___');
  if (i === -1) return [text, ''];
  return [text.slice(0, i), text.slice(i + 3)];
}

/** Maakt een zin met een gat op de plek van het antwoord. */
function gapify(sentence, answer) {
  if (sentence.includes('___')) return sentence;
  const re = new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return sentence.replace(re, '___');
}

export default {
  id: 'fillGap',
  label: 'Vul in',

  supports(item) {
    const a = item.atom;
    if (a.kind === 'grammar') return Array.isArray(a.examples) && a.examples.length > 0;
    if (a.kind === 'sentence' || a.kind === 'lyric') {
      return Array.isArray(a.blanks) && a.blanks.length > 0;
    }
    return false;
  },

  render(item, root, ctx) {
    const { atom } = item;

    let sentence, answers, options, hint, spoken;
    if (atom.kind === 'grammar') {
      const ex = pickExample(atom);
      sentence = ex.es;
      answers = [ex.answer];
      options = ex.options ?? null;
      hint = ex.nl ?? null;
      spoken = ex.es.replace('___', ex.answer);
    } else {
      const blank = atom.blanks[0];
      sentence = gapify(atom.es, blank.answer);
      answers = [blank.answer];
      options = blank.options ?? null;
      hint = atom.nl ?? null;
      spoken = atom.es;
    }

    const [before, after] = splitGap(sentence);
    let chosen = null;

    root.append(
      el('p', { class: 'q-instruction' },
        atom.kind === 'grammar' ? atom.rule : 'Vul het ontbrekende woord in'),
    );

    const gapNode = options
      ? el('span', { class: 'q-blank' }, '___')
      : el('input', {
          class: 'gap-input', type: 'text', lang: 'es',
          autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
          'aria-label': 'Ontbrekend woord',
          oninput: () => ctx.ready(gapNode.value.trim().length > 0),
          onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
        });

    root.append(el('div', { class: 'q-prompt q-prompt--sentence' },
      el('span', {}, before), gapNode, el('span', {}, after),
      speakerButton(spoken, ctx.speech)));

    if (hint) root.append(el('p', { class: 'q-hint' }, hint));

    if (options) {
      const list = el('div', { class: 'options options--compact' });
      for (const opt of shuffle(options)) {
        list.append(el('button', {
          class: 'option', type: 'button', dataset: { value: opt },
          onclick: () => {
            chosen = opt;
            gapNode.textContent = opt;
            gapNode.classList.add('is-filled');
            list.querySelectorAll('.option').forEach(b =>
              b.classList.toggle('is-selected', b.dataset.value === opt));
            ctx.ready(true);
          },
        }, opt));
      }
      root.append(list);

      return {
        focus() { list.querySelector('.option')?.focus(); },
        check: () => ({ correct: chosen === answers[0], expected: answers[0], note: null, given: chosen }),
        reveal({ correct }) {
          list.querySelectorAll('.option').forEach(b => {
            b.disabled = true;
            if (b.dataset.value === answers[0]) b.classList.add('is-correct');
            else if (b.dataset.value === chosen && !correct) b.classList.add('is-wrong');
          });
        },
      };
    }

    return {
      focus() { gapNode.focus(); },
      check() {
        const r = checkAnswer(gapNode.value, answers);
        return { ...r, given: gapNode.value };
      },
      reveal({ correct }) {
        gapNode.disabled = true;
        gapNode.classList.add(correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
