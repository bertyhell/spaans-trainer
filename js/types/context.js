/* Een woord in een echte zin uit de cursus, in plaats van los.
 *
 * contextGap (nl→es): de zin met een gat waar het woord hoort, en het
 *   Nederlandse woord als steuntje. Nieuw of zwak (doos 1–2): kiezen uit vier;
 *   daarna zelf typen.
 * contextMeaning (es→nl): het woord staat gemarkeerd in de zin; wat betekent
 *   het hier?
 *
 * De zinnen komen uit de oefeningen, de dialogen, de grammaticavoorbeelden en
 * de leesteksten (zie data.contextsFor). Zo levert elk woord tientallen
 * nieuwe vragen op zonder dat er één zin bij geschreven moest worden. */

import { el, shuffle, sample, speakerButton, optionList, accentBar } from '../dom.js';
import { contextsFor, siblings, bareEs } from '../data.js';
import { checkAnswer, normalize, stripArticle, expandVariants } from '../check.js';
import { getProgress } from '../storage.js';
import { hintLadder } from '../hintLadder.js';

const OPTIONS = 4;
/** Tot en met deze doos kies je; daarna typ je zelf. */
const CHOOSE_UP_TO_BOX = 2;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/** De zin in drie stukken: voor, het woord, na. */
const split = ctx => [ctx.es.slice(0, ctx.at), ctx.surface, ctx.es.slice(ctx.at + ctx.surface.length)];

/** Hoe een ander woord in dit gat zou staan: kaal, en met dezelfde hoofdletter. */
function asGap(atom, surface) {
  const word = stripArticle(normalize(expandVariants(atom.es)[0]));
  return surface[0] !== surface[0].toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word;
}

/** Drie andere woorden van dezelfde soort uit het thema, zoals ze in het gat zouden staan. */
function gapDistractors(atom, surface) {
  const pool = siblings(atom).filter(o => o.kind === 'vocab');
  const same = pool.filter(o => o.pos === atom.pos);
  const out = [];
  for (const o of [...shuffle(same), ...shuffle(pool)]) {
    if (out.length >= OPTIONS - 1) break;
    const w = asGap(o, surface);
    if (w.toLowerCase() !== surface.toLowerCase() && !out.includes(w) && !/\s/.test(w) === !/\s/.test(surface)) out.push(w);
  }
  return out;
}

export const contextGap = {
  id: 'contextGap',
  label: 'Woord in een zin',

  supports(item) {
    return item.atom.kind === 'vocab' && item.direction === 'nl2es' && contextsFor(item.atom).length > 0;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const context = pick(contextsFor(atom));
    const [before, word, after] = split(context);
    const choose = getProgress(item.key).box <= CHOOSE_UP_TO_BOX;
    const distractors = choose ? gapDistractors(atom, word) : [];
    const useOptions = choose && distractors.length >= OPTIONS - 1;

    root.append(el('p', { class: 'q-instruction' }, 'Welk woord hoort in de zin?'));

    const gapNode = useOptions
      ? el('span', { class: 'q-blank' }, '___')
      : el('input', {
          class: 'gap-input', type: 'text', lang: 'es',
          autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
          'aria-label': `Het Spaanse woord voor ${atom.nl[0]}`,
          style: `width:${Math.max(7, word.length + 2)}ch`,
          oninput: () => ctx.ready(gapNode.value.trim().length > 0),
          onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
        });

    const prompt = el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
      el('span', {}, before), gapNode, el('span', {}, after));
    root.append(prompt,
      el('p', { class: 'q-hint' }, el('span', { class: 'context-cue' }, `(${atom.nl[0]})`),
        context.nl ? ` · ${context.nl}` : ''));

    const addSpeaker = () => {
      const sb = speakerButton(context.es, ctx.speech);
      if (sb) prompt.append(sb);
    };

    if (useOptions) {
      const options = shuffle([word, ...distractors]);
      const opts = optionList(options, {
        // In een raster van drie breekt een lang woord midden in: dan onder elkaar.
        compact: options.every(o => o.length <= 10), lang: 'es',
        onChoose: v => { gapNode.textContent = v; gapNode.classList.add('is-filled'); ctx.ready(true); },
      });
      root.append(opts.list);
      return {
        focus: opts.focus,
        check: () => ({ correct: opts.chosen() === word, expected: atom.es, given: opts.chosen(), note: null }),
        reveal() { opts.reveal(word); gapNode.textContent = word; addSpeaker(); },
      };
    }

    root.append(accentBar(gapNode, () => ctx.ready(gapNode.value.trim().length > 0), ['á', 'é', 'í', 'ó', 'ú', 'ñ']));
    const hint = hintLadder(word);
    root.append(hint.node);
    return {
      focus() { gapNode.focus(); },
      check() {
        const r = checkAnswer(gapNode.value, [word, bareEs(atom)]);
        return hint.apply({ ...r, expected: atom.es, note: r.correct ? r.note : `In deze zin: ${word}`, given: gapNode.value });
      },
      reveal({ correct, almost }) {
        gapNode.disabled = true;
        hint.disable();
        gapNode.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
        addSpeaker();
      },
    };
  },
};

export const contextMeaning = {
  id: 'contextMeaning',
  label: 'Wat betekent het woord hier?',

  supports(item) {
    return item.atom.kind === 'vocab' && item.direction === 'es2nl'
      && contextsFor(item.atom).length > 0 && siblings(item.atom).length >= OPTIONS - 1;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const context = pick(contextsFor(atom));
    const [before, word, after] = split(context);
    const correct = atom.nl[0];
    const options = [correct];
    const pool = siblings(atom);
    const same = pool.filter(o => o.pos === atom.pos);
    for (const o of [...sample(same, same.length), ...sample(pool, pool.length)]) {
      if (options.length >= OPTIONS) break;
      if (!options.includes(o.nl[0]) && !atom.nl.includes(o.nl[0])) options.push(o.nl[0]);
    }

    const translation = el('p', { class: 'q-hint', hidden: true }, context.nl ?? '');
    root.append(
      el('p', { class: 'q-instruction' }, 'Wat betekent het gemarkeerde woord in deze zin?'),
      el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
        el('span', {}, before), el('mark', { class: 'context-word' }, word), el('span', {}, after),
        speakerButton(context.es, ctx.speech)),
      translation,
    );

    const opts = optionList(shuffle(options), { lang: 'nl', onChoose: () => ctx.ready(true) });
    root.append(opts.list);
    return {
      focus: opts.focus,
      check: () => ({ correct: atom.nl.includes(opts.chosen()), expected: `${atom.es} — ${correct}`, given: opts.chosen(), note: null }),
      reveal() {
        opts.reveal(correct);
        translation.hidden = !context.nl;
      },
    };
  },
};
