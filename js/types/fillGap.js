/* Vul het gaatje in. Werkt voor grammaticaregels (één regel, meerdere
 * voorbeeldzinnen), voor zinnen uit de oefeningen en voor liedjesregels. */

import { el, shuffle, speakerButton, optionList } from '../dom.js';
import { checkAnswer } from '../check.js';

/** Kiest deterministisch per beurt één voorbeeld uit een grammatica-atoom. */
const pickExample = atom => atom.examples[Math.floor(Math.random() * atom.examples.length)];

/** Splitst een zin rond het eerste ___ en geeft de twee helften terug. */
function splitGap(text) {
  const i = text.indexOf('___');
  if (i === -1) return [text, ''];
  return [text.slice(0, i), text.slice(i + 3)];
}

/** Maakt een zin met een gat op de plek van het antwoord. Geen \b: dat kent
 *  geen accenten, en "está" of "compré" zouden dan nooit een gat krijgen. */
function gapify(sentence, answer) {
  if (sentence.includes('___')) return sentence;
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Eerst met exact dezelfde hoofdletters: "La" in "…la pared. La ponemos" is
  // de tweede, niet de eerste.
  for (const flags of ['u', 'iu']) {
    const re = new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, flags);
    if (re.test(sentence)) return sentence.replace(re, '___');
  }
  return sentence.replace(answer, '___');
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

    let sentence, answers, options, hint, spoken, cue = null;
    if (atom.kind === 'grammar') {
      const ex = pickExample(atom);
      sentence = ex.es;
      answers = [ex.answer, ...(ex.alt ?? [])];
      options = ex.options ?? null;
      hint = ex.nl ?? null;
      spoken = ex.es.replace('___', ex.answer);
    } else {
      const blank = atom.blanks[0];
      sentence = gapify(atom.es, blank.answer);
      answers = [blank.answer, ...(blank.alt ?? [])];
      options = blank.options ?? null;
      hint = atom.nl ?? null;
      spoken = atom.es;
      // Het werkwoord (en de persoon) dat in het gat moet: "(levantarse)".
      cue = blank.hint ?? null;
    }

    const [before, after] = splitGap(sentence);

    root.append(
      el('p', { class: 'q-instruction' },
        atom.kind === 'grammar' ? atom.rule : atom.instruction ?? 'Vul het ontbrekende woord in'),
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

    root.append(el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
      el('span', {}, before), gapNode,
      cue ? el('span', { class: 'q-infinitive' }, ` (${cue})`) : null,
      el('span', {}, after),
      speakerButton(spoken, ctx.speech)));

    if (hint) root.append(el('p', { class: 'q-hint' }, hint));

    if (options) {
      const opts = optionList(shuffle(options), {
        compact: true, lang: 'es',
        onChoose: opt => {
          gapNode.textContent = opt;
          gapNode.classList.add('is-filled');
          ctx.ready(true);
        },
      });
      root.append(opts.list);

      return {
        focus: opts.focus,
        check: () => ({ correct: answers.includes(opts.chosen()), expected: answers[0], note: null, given: opts.chosen() }),
        reveal() { opts.reveal(answers[0]); },
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
