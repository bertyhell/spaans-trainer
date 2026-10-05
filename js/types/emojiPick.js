/* Welk plaatje? Je ziet (en hoort) het Spaanse woord en tikt het juiste
 * plaatje aan. Snel en zonder Nederlands ertussen: het woord hangt rechtstreeks
 * aan wat het betekent.
 *
 * Twee woorden met hetzelfde plaatje (👕 voor la camiseta én la camisa) staan
 * nooit samen op het scherm: dan zijn er twee juiste antwoorden. */

import { el, shuffle, optionList, speakerButton } from '../dom.js';
import { allAtoms, siblings, shareGloss } from '../data.js';

const OPTIONS = 4;

let withEmoji = null;
const emojiVocab = () => (withEmoji ??= allAtoms().filter(a => a.kind === 'vocab' && a.emoji));

/** Drie afleiders, elk met een eigen plaatje. Eerst uit hetzelfde thema. */
export function emojiDistractors(atom) {
  const out = [];
  const used = new Set([atom.emoji]);
  const fits = o => o.emoji && !used.has(o.emoji) && !shareGloss(o, atom);
  const near = siblings(atom).filter(fits);
  const far = emojiVocab().filter(o => o.id !== atom.id && o.pos === atom.pos && fits(o));
  for (const o of [...shuffle(near), ...shuffle(far)]) {
    if (out.length >= OPTIONS - 1) break;
    if (used.has(o.emoji)) continue;
    used.add(o.emoji);
    out.push(o);
  }
  return out;
}

export default {
  id: 'emojiPick',
  label: 'Welk plaatje?',

  supports(item) {
    const a = item.atom;
    return a.kind === 'vocab' && item.direction === 'es2nl' && Boolean(a.emoji)
      && emojiDistractors(a).length >= OPTIONS - 1;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const options = shuffle([atom, ...emojiDistractors(atom)]);

    root.append(
      el('p', { class: 'q-instruction' }, 'Welk plaatje hoort erbij?'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-word', lang: 'es' }, atom.es),
        speakerButton(atom.es, ctx.speech)),
    );
    // De les start vanuit een tik, dus meteen uitspreken mag.
    if (ctx.speech.available()) setTimeout(() => ctx.speech.speak(atom.es), 250);

    const opts = optionList(options.map(o => ({
      value: o.id,
      label: [
        el('span', { class: 'emoji-big', 'aria-hidden': 'true' }, o.emoji),
        el('span', { class: 'emoji-gloss', lang: 'nl' }, o.nl[0]),
      ],
    })), { className: 'option--emoji', onChoose: () => ctx.ready(true) });
    opts.list.classList.add('options--emoji');
    // Zonder tekst heeft een knop geen naam voor een schermlezer: dan het
    // plaatje zelf, zoals de schermlezer het voorleest.
    opts.list.querySelectorAll('.option').forEach((b, i) => b.setAttribute('aria-label', options[i].emoji));
    root.append(opts.list);

    const byId = new Map(options.map(o => [o.id, o]));
    return {
      focus: opts.focus,
      check() {
        const chosen = byId.get(opts.chosen());
        return {
          correct: chosen?.id === atom.id,
          expected: `${atom.emoji} ${atom.es} = ${atom.nl[0]}`,
          note: chosen && chosen.id !== atom.id ? `${chosen.emoji} is ${chosen.es}.` : null,
          given: chosen ? `${chosen.emoji} ${chosen.nl[0]}` : null,
        };
      },
      reveal() {
        opts.reveal(atom.id);
        opts.list.querySelectorAll('.option').forEach((b, i) => b.setAttribute('aria-label', `${options[i].emoji} ${options[i].nl[0]}`));
      },
    };
  },
};
