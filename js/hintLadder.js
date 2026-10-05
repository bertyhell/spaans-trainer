/* Een hint bij het intypen, in twee stappen.
 *
 *   1. de eerste letter van elk woord en hoeveel letters er volgen: c _ _ _ _ _ _
 *   2. om de andere letter erbij:                                   c _ r _ a _ a
 *
 * Wie een hint nodig had en dan juist antwoordt, krijgt geen fout — maar het
 * woord schuift ook niet op naar een hogere doos (zie scheduler.record). Zo
 * blijf je in de oefening in plaats van op te geven, en komt het woord toch
 * snel terug. Lidwoorden staan er meteen volledig: die zijn niet de vraag. */

import { el } from './dom.js';
import { speakable } from './check.js';

const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'het', 'een']);
export const MAX_HINTS = 2;

/** Het patroon voor een antwoord op dit hintniveau (1 of 2), als tekst. */
export function hintPattern(answer, level) {
  const words = speakable(answer).split(/\s+/).filter(Boolean);
  return words.map((w, wi) => {
    if (ARTICLES.has(w.toLowerCase()) && wi < words.length - 1) return w;
    let letter = 0;
    return [...w].map(ch => {
      if (!/\p{L}/u.test(ch)) return ch;
      const show = letter === 0 || (level >= 2 && letter % 2 === 0);
      letter++;
      return show ? ch : '_';
    }).join(' ');
  }).join('   ');
}

/**
 * Een hintknop met het patroon eronder.
 * @returns {{node, level(): number, apply(result), disable()}}
 */
export function hintLadder(answer) {
  let level = 0;
  const pattern = el('p', { class: 'hint-pattern', lang: 'es', 'aria-live': 'polite', hidden: true });
  const btn = el('button', {
    class: 'hint-btn', type: 'button',
    onclick: () => {
      if (level >= MAX_HINTS) return;
      level++;
      pattern.textContent = hintPattern(answer, level);
      pattern.hidden = false;
      btn.textContent = level < MAX_HINTS ? '💡 Nog een hint' : '💡 Meer hints zijn er niet';
      btn.disabled = level >= MAX_HINTS;
    },
  }, '💡 Hint');

  return {
    node: el('div', { class: 'hint-ladder' }, btn, pattern),
    level: () => level,
    /** Zet een juist antwoord met hint om in "juist, met hint". */
    apply(result) {
      if (!level || !result.correct) return result;
      return { ...result, almost: true, hinted: true,
        note: result.note ?? `Met ${level === 1 ? 'een hint' : 'twee hints'} — dit woord komt sneller terug.` };
    },
    disable() { btn.disabled = true; },
  };
}
