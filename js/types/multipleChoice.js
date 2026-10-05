/* Meerkeuze. Afleiders komen uit hetzelfde thema, zodat de keuze echt over
 * betekenis gaat en niet over "welke hoort hier duidelijk niet thuis".
 *
 * Kent je het woord al wat (doos 3 en hoger), dan komen er woorden bij die
 * erop lijken (caro / carro / cara) en woorden waarmee je het eerder
 * verwarde. Dan volstaat het niet meer om het onderwerp te herkennen: je moet
 * het woord echt lezen. */

import { el, shuffle, sample, speakerButton, optionList } from '../dom.js';
import { vocabAnswer, vocabPrompt, siblings, lookalikes, getAtom, bareEs } from '../data.js';
import { showEmoji } from '../scheduler.js';
import { getProgress, confusionsOf } from '../storage.js';

const OPTION_COUNT = 4;
/** Vanaf deze doos komen de lastige afleiders erbij. */
export const TRICKY_FROM_BOX = 3;
const MAX_TRICKY = 2;

/** Verwarde en gelijkende woorden, verwarde eerst. Een gelijkend woord moet
 *  van dezelfde soort zijn ("zeven" tussen kledingstukken verraadt zichzelf),
 *  en twee letters verschil telt pas bij een langer woord. */
export function trickyDistractors(atom) {
  const confused = confusionsOf(atom.id).map(c => getAtom(c.other)).filter(o => o?.kind === 'vocab');
  const me = bareEs(atom);
  // la bota / las botas: hetzelfde woord in het meervoud is geen lookalike.
  const plural = (a, b) => b === `${a}s` || b === `${a}es`;
  const alike = lookalikes(atom)
    .filter(l => l.atom.pos === atom.pos && (l.distance === 1 || me.length >= 6))
    .filter(l => !plural(me, bareEs(l.atom)) && !plural(bareEs(l.atom), me))
    .map(l => l.atom);
  const seen = new Set();
  return [...confused, ...alike].filter(o => !seen.has(o.id) && seen.add(o.id));
}

const hasArticle = a => /^(el|la|los|las) /i.test(a.es);
const shuffleInPlace = arr => arr.splice(0, arr.length, ...shuffle(arr));

export default {
  id: 'multipleChoice',
  label: 'Meerkeuze',

  supports(item) {
    if (item.atom.kind !== 'vocab') return false;
    // Zonder genoeg afleiders uit hetzelfde thema wordt het te makkelijk.
    return siblings(item.atom).length >= OPTION_COUNT - 1;
  },

  render(item, root, ctx) {
    const { atom, direction } = item;
    const answers = vocabAnswer(atom, direction);
    const correct = answers[0];

    // Eerst afleiders van dezelfde woordsoort (en bij zelfstandige naamwoorden
    // ook met een lidwoord): één werkwoord tussen drie dingen wijst zichzelf aan.
    const shown = a => (direction === 'nl2es' ? a.es : a.nl[0]);
    const pool = siblings(atom);
    const alike = pool.filter(o => o.pos === atom.pos && hasArticle(o) === hasArticle(atom));
    const options = [correct];
    if (getProgress(item.key).box >= TRICKY_FROM_BOX) {
      for (const o of trickyDistractors(atom)) {
        if (options.length > MAX_TRICKY) break;
        const d = shown(o);
        if (!options.includes(d) && !answers.includes(d)) options.push(d);
      }
    }
    for (const o of [...sample(alike, alike.length), ...sample(pool, pool.length)]) {
      if (options.length >= OPTION_COUNT) break;
      const d = shown(o);
      if (!options.includes(d) && !answers.includes(d)) options.push(d);
    }
    shuffleInPlace(options);

    const prompt = vocabPrompt(atom, direction);
    root.append(
      el('p', { class: 'q-instruction' },
        direction === 'nl2es' ? 'Hoe zeg je dit in het Spaans?' : 'Wat betekent dit?'),
      el('div', { class: 'q-prompt' },
        atom.emoji && showEmoji(item.key) ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word', lang: direction === 'nl2es' ? 'nl' : 'es' }, prompt),
        direction === 'es2nl' ? speakerButton(atom.es, ctx.speech) : null,
      ),
    );

    const opts = optionList(options, {
      lang: direction === 'nl2es' ? 'es' : 'nl',
      onChoose: () => ctx.ready(true),
    });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({ correct: answers.includes(opts.chosen()), expected: correct, note: null, given: opts.chosen() }),
      reveal() { opts.reveal(correct); },
    };
  },
};
