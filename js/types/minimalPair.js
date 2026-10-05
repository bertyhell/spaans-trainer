/* Welk woord hoor je? Twee woorden die één klank verschillen.
 *
 *   pero / perro, caro / carro   de r tegenover de rr
 *   papa / papá                  enkel de klemtoon
 *   hablo / habló                ik spreek tegenover hij sprak
 *
 * Vooral dat laatste is verraderlijk: het accent verandert persoon én tijd,
 * en in een gesprek hoor je enkel waar de klemtoon valt. De paren komen uit
 * de cursus zelf (data.minimalPartners); zonder Spaanse stem valt de vorm weg. */

import { el, shuffle, optionList } from '../dom.js';
import { minimalPartners, bareEs } from '../data.js';
import { describeForm } from './conjugation.js';

/** Het woord dat je hoort, en hoe het op de knop staat. */
function face(atom) {
  if (atom.kind === 'conjugation') return { es: atom.form, label: describeForm(atom.verb, atom.form) ?? atom.form };
  return { es: bareEs(atom), label: `${bareEs(atom)} — ${atom.nl[0]}` };
}

function partnerFace(partner, atom) {
  if (atom.kind === 'conjugation') return { es: partner.es, label: describeForm(atom.verb, partner.es) ?? partner.es };
  return { es: partner.es, label: `${partner.es} — ${partner.atom.nl[0]}` };
}

export default {
  id: 'minimalPair',
  label: 'Welk woord hoor je?',

  supports(item, { speech }) {
    const a = item.atom;
    if (!speech.available()) return false;
    if (a.kind === 'vocab' && item.direction !== 'es2nl') return false;
    return (a.kind === 'vocab' || a.kind === 'conjugation') && minimalPartners(a).length > 0;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const me = face(atom);
    const partners = minimalPartners(atom);
    const other = partnerFace(partners[Math.floor(Math.random() * partners.length)], atom);

    const play = rate => ctx.speech.speak(me.es, { rate });
    setTimeout(() => play(0.85), 250);
    root.append(
      el('p', { class: 'q-instruction' }, 'Welk woord hoor je? Let op de klemtoon en de r.'),
      el('div', { class: 'q-prompt q-prompt--audio' },
        el('button', { class: 'play-big', type: 'button', 'aria-label': 'Speel opnieuw af', onclick: () => play(0.85) }, '🔊'),
        el('button', { class: 'play-slow', type: 'button', 'aria-label': 'Speel traag af', onclick: () => play(0.55) }, '🐢')),
    );

    const options = shuffle([me, other]);
    const opts = optionList(options.map(o => ({ value: o.es, label: o.label })), { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({ correct: opts.chosen() === me.es, expected: me.label, given: opts.chosen(), note: null }),
      reveal() {
        opts.reveal(me.es);
        // Na het nakijken: beide nog eens beluisteren, naast elkaar.
        root.append(el('div', { class: 'pair-replay' }, options.map(o =>
          el('button', { class: 'btn btn--ghost pair-play', type: 'button', lang: 'es', onclick: () => ctx.speech.speak(o.es, { rate: 0.8 }) },
            `🔊 ${o.es}`))));
      },
    };
  },
};
