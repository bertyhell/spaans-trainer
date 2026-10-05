/* Zet het gesprek in de juiste volgorde: vier opeenvolgende regels uit een
 * dialoog, door elkaar. Tik ze aan in de volgorde waarin ze gezegd worden;
 * nog eens tikken haalt een regel terug. Elke regel telt voor zijn eigen doos,
 * net als een vakje in de vervoegingstabel.
 *
 * De sprekers staan er pas na het nakijken bij: ze wisselen elkaar af, dus
 * met hun namen erbij leg je de puzzel zonder de zinnen te begrijpen. */

import { el, shuffle } from '../dom.js';
import { dialogueLines, getText } from '../data.js';

const WINDOW = 4;

/** Vier opeenvolgende regels rond dit atoom, het atoom zelf op een willekeurige plek. */
function windowFor(atom) {
  const lines = dialogueLines(atom.text);
  const at = lines.findIndex(l => l.id === atom.id);
  const lo = Math.max(0, at - WINDOW + 1);
  const hi = Math.min(at, lines.length - WINDOW);
  const start = lo + Math.floor(Math.random() * (hi - lo + 1));
  return lines.slice(start, start + WINDOW);
}

const label = a => [a.who ? el('span', { class: 'dialogue-who' }, `${a.who}: `) : null, a.es];

export default {
  id: 'dialogueOrder',
  label: 'Zet in volgorde',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'dialogue') return false;
    const lines = dialogueLines(a.text);
    // Zelfde tekst twee keer in het venster ("Sí."): dan is de volgorde niet eenduidig.
    return lines.length >= WINDOW && new Set(lines.map(l => l.es)).size === lines.length;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const lines = windowFor(atom);
    const bank = shuffle(lines);
    const chosen = [];
    const text = getText(atom.text);

    root.append(el('p', { class: 'q-instruction' }, 'Tik de zinnen aan in de volgorde van het gesprek'));
    if (text?.title) root.append(el('p', { class: 'q-hint' }, `💬 ${text.title}`));

    const answer = el('ol', { class: 'order-answer', 'aria-label': 'Jouw volgorde' });
    const rest = el('div', { class: 'order-bank', role: 'group', 'aria-label': 'Zinnen' });
    root.append(answer, rest);

    function redraw(focusAt = null) {
      answer.replaceChildren(...chosen.map((l, i) => el('li', {},
        el('button', {
          class: 'option order-line is-placed', type: 'button', lang: 'es',
          onclick: () => { chosen.splice(i, 1); redraw(0); },
        }, label(l)))));
      rest.replaceChildren(...bank.filter(l => !chosen.includes(l)).map((l, i) =>
        el('button', {
          class: 'option order-line', type: 'button', lang: 'es',
          onclick: () => { chosen.push(l); redraw(i); },
        }, label(l))));
      if (focusAt != null) {
        const btns = [...rest.children, ...answer.querySelectorAll('button')];
        (btns[Math.min(focusAt, rest.children.length - 1)] ?? btns[0])?.focus();
      }
      ctx.ready(chosen.length === lines.length);
    }
    redraw();

    return {
      focus() { rest.querySelector('button')?.focus(); },
      check() {
        const per = lines.map((l, i) => ({
          atomId: l.id, correct: chosen[i] === l, expected: l.es, given: chosen[i]?.es ?? null, note: null,
        }));
        const ok = per.every(p => p.correct);
        return {
          correct: ok,
          expected: lines.map((l, i) => `${i + 1}. ${l.es}`).join(' '),
          given: chosen.map(l => l.es).join(' / '),
          note: ok ? null : `${per.filter(p => !p.correct).length} van de ${lines.length} zinnen staan op de verkeerde plaats.`,
          perAtom: per,
        };
      },
      reveal(result) {
        answer.classList.add(result.correct ? 'is-correct' : 'is-wrong', 'is-revealed');
        [...answer.querySelectorAll('button')].forEach((b, i) => {
          b.disabled = true;
          b.classList.add(chosen[i] === lines[i] ? 'is-correct' : 'is-wrong');
          if (chosen[i] !== lines[i]) b.after(el('span', { class: 'order-fix', lang: 'es' }, `✓ ${lines[i].es}`));
        });
      },
    };
  },
};
