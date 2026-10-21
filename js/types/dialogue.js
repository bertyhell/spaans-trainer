/* Zinnen uit de dialogen van het boek: je hoort (of leest, zonder Spaanse
 * stem) een zin en kiest wat hij betekent. De afleiders komen uit dezelfde
 * dialoog, zodat het onderwerp je niet verraadt.
 *
 * Er was ook "wat volgt er?" (kies het antwoord op de vorige regel), maar de
 * afleiders uit hetzelfde gesprek passen vaak ook: dan toetste die vorm of je
 * de dialoog onthouden had, niet je Spaans. */

import { el, shuffle, sample, optionList } from '../dom.js';
import { dialogueLines, getText } from '../data.js';

/** Een regel met de spreker ervoor, zoals in het boek. */
const line = a => el('p', { class: 'dialogue-line', lang: 'es' },
  a.who ? el('span', { class: 'dialogue-who' }, `${a.who}: `) : null, a.es);

/** n andere regels van hetzelfde gesprek, elk met een andere tekst dan `key(atom)`
 *  en dan elkaar: twee keer "Sí." als knop is één knop te veel. */
function others(atom, n, key) {
  const seen = new Set([key(atom)]);
  const out = [];
  for (const a of sample(dialogueLines(atom.text), Infinity)) {
    if (out.length >= n) break;
    if (a.id === atom.id || seen.has(key(a))) continue;
    seen.add(key(a));
    out.push(a);
  }
  return out;
}

export const dialogueMeaning = {
  id: 'dialogueMeaning',
  label: 'Wat zeggen ze?',

  supports: item => item.atom.kind === 'dialogue' && dialogueLines(item.atom.text).length >= 4,

  render(item, root, ctx) {
    const { atom } = item;
    const listen = ctx.speech.available();
    const text = getText(atom.text);
    const options = shuffle([atom.nl, ...others(atom, 3, a => a.nl).map(a => a.nl)]);

    root.append(el('p', { class: 'q-instruction' },
      listen ? `Luister: wat betekent dit?` : 'Wat betekent deze zin?'));
    if (text?.title) root.append(el('p', { class: 'q-hint' }, `💬 ${text.title}`));

    if (listen) {
      const play = el('button', {
        class: 'play-big', type: 'button', 'aria-label': 'Speel opnieuw af',
        onclick: () => ctx.speech.speak(atom.es),
      }, '🔊');
      setTimeout(() => ctx.speech.speak(atom.es), 250);
      root.append(el('div', { class: 'q-prompt q-prompt--audio' }, play));
    } else {
      root.append(el('div', { class: 'q-prompt q-prompt--sentence' }, line(atom)));
    }

    const opts = optionList(options, { onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({
        correct: opts.chosen() === atom.nl,
        expected: `${atom.es} — ${atom.nl}`, note: null, given: opts.chosen(),
      }),
      reveal() {
        opts.reveal(atom.nl);
        // Na het antwoord ook de Spaanse tekst tonen: dan zie je wat je hoorde.
        if (listen) root.querySelector('.q-prompt').append(line(atom));
      },
    };
  },
};
