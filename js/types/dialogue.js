/* Zinnen uit de dialogen van het boek, in twee gedaantes.
 *
 * dialogueMeaning: je hoort (of leest, zonder Spaanse stem) een zin en kiest
 *   wat hij betekent. De afleiders komen uit dezelfde dialoog, zodat het
 *   onderwerp je niet verraadt.
 * dialogueReply: je ziet wat de ander zegt en kiest wat er in het gesprek
 *   volgt — de beweging die je in een echt gesprek moet maken. */

import { el, shuffle, sample, speakerButton, optionList } from '../dom.js';
import { dialogueLines, getText } from '../data.js';

/** Een regel met de spreker ervoor, zoals in het boek. */
const line = (a, extra = null) => el('p', { class: 'dialogue-line', lang: 'es' },
  a.who ? el('span', { class: 'dialogue-who' }, `${a.who}: `) : null, a.es, extra);

/** n andere regels van hetzelfde gesprek, elk met een andere tekst dan `key(atom)`
 *  en dan elkaar: twee keer "Sí." als knop is één knop te veel. */
function others(atom, n, key, exclude = []) {
  const seen = new Set([key(atom), ...exclude.map(key)]);
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

export const dialogueReply = {
  id: 'dialogueReply',
  label: 'Wat volgt er?',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'dialogue' || a.line < 2) return false;
    const lines = dialogueLines(a.text);
    return lines.length >= 5 && lines.some(l => l.line === a.line - 1 && l.who !== a.who);
  },

  render(item, root, ctx) {
    const { atom } = item;
    const lines = dialogueLines(atom.text);
    const prev = lines.find(l => l.line === atom.line - 1);
    // Afleiders: andere regels, maar niet de vorige (die staat al op het scherm).
    const options = shuffle([atom.es, ...others(atom, 3, a => a.es, [prev]).map(l => l.es)]);
    const text = getText(atom.text);

    root.append(el('p', { class: 'q-instruction' }, `Wat antwoordt ${atom.who || 'de ander'}?`));
    if (text?.title) root.append(el('p', { class: 'q-hint' }, `💬 ${text.title}`));
    root.append(el('div', { class: 'q-prompt q-prompt--sentence' },
      line(prev, speakerButton(prev.es, ctx.speech))));
    root.append(el('p', { class: 'q-hint' }, prev.nl));

    const opts = optionList(options, { lang: 'es', onChoose: () => ctx.ready(true) });
    root.append(opts.list);

    return {
      focus: opts.focus,
      check: () => ({
        correct: opts.chosen() === atom.es,
        expected: `${atom.es} — ${atom.nl}`, note: null, given: opts.chosen(),
      }),
      reveal() {
        opts.reveal(atom.es);
        const sb = speakerButton(atom.es, ctx.speech);
        if (sb) root.querySelector('.q-prompt').append(line(atom, sb));
      },
    };
  },
};
