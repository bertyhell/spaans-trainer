/* Welk is welk? Twee woorden die je eerder door elkaar haalde, naast elkaar.
 *
 * Een fout antwoord dat zelf een ander woord uit de cursus is (preguntar voor
 * pedir), of een fout paar in de koppelronde, onthoudt de app als verward paar
 * (storage.recordConfusion). Komt een van beide woorden later terug, dan
 * vraagt deze vorm naar precies dat verschil — en toont daarna beide woorden
 * met hun betekenis, ezelsbrug en een voorbeeldzin. Twee keer na elkaar juist,
 * en het paar verdwijnt. */

import { el, shuffle, speakerButton, optionList } from '../dom.js';
import { getAtom, contextsFor } from '../data.js';
import { confusionsOf } from '../storage.js';

/** Het woord waarmee dit atoom het vaakst verward werd, of null. */
export function confusionPartner(atom) {
  for (const c of confusionsOf(atom.id)) {
    const other = getAtom(c.other);
    if (other?.kind === 'vocab') return other;
  }
  return null;
}

/** Eén kant van de vergelijking: woord, betekenis, steuntje. */
function side(atom, speech) {
  const example = contextsFor(atom)[0];
  return el('div', { class: 'contrast-side' },
    el('div', { class: 'contrast-word' },
      atom.emoji ? el('span', { 'aria-hidden': 'true' }, `${atom.emoji} `) : null,
      el('strong', { lang: 'es' }, atom.es), speakerButton(atom.es, speech)),
    el('div', { class: 'contrast-nl' }, atom.nl.join(', ')),
    atom.memo ? el('p', { class: 'contrast-memo' }, `💡 ${atom.memo}`) : null,
    example ? el('p', { class: 'contrast-example', lang: 'es' }, example.es) : null);
}

export default {
  id: 'confusionPair',
  label: 'Welk is welk?',

  supports(item) {
    return item.atom.kind === 'vocab' && Boolean(confusionPartner(item.atom));
  },

  render(item, root, ctx) {
    const { atom, direction } = item;
    const other = confusionPartner(atom);
    const toSpanish = direction === 'nl2es';
    const shown = a => (toSpanish ? a.es : a.nl[0]);
    const correct = shown(atom);

    root.append(
      el('p', { class: 'q-instruction' }, 'Niet verwarren! Welk woord is het?'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-word', lang: toSpanish ? 'nl' : 'es' }, toSpanish ? atom.nl[0] : atom.es),
        toSpanish ? null : speakerButton(atom.es, ctx.speech)),
      el('p', { class: 'q-hint' }, `Je haalde ${atom.es} en ${other.es} eerder door elkaar.`),
    );

    const opts = optionList(shuffle([correct, shown(other)]), { lang: toSpanish ? 'es' : 'nl', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({
        correct: opts.chosen() === correct, expected: correct, given: opts.chosen(), note: null,
        confusionWith: other.id,
      }),
      reveal() {
        opts.reveal(correct);
        root.append(el('div', { class: 'contrast' }, side(atom, ctx.speech), side(other, ctx.speech)));
      },
    };
  },
};
