/* Zeg het hardop. De enige oefening waarin je zelf Spaans spreekt.
 *
 * speakWord     je ziet het Nederlandse woord en zegt het in het Spaans
 * speakSentence je hoort en ziet een zin uit een dialoog of oefening, en
 *               zegt hem na (schaduwen)
 *
 * Alleen als de browser kan luisteren én je het in de instellingen aanzette
 * (zie js/recognition.js). Kan je even niet praten, dan sla je de vraag over
 * zonder dat het als fout telt — en vraagt de les het niet meer. */

import { el } from '../dom.js';
import { checkAnswer, normalize, stripAccents, levenshtein } from '../check.js';
import { numberWords } from '../numerals.js';
import * as recognition from '../recognition.js';

const usable = env => recognition.enabled() && !env.noSpeaking;

/** Woorden om te vergelijken: zonder accenten en leestekens, cijfers voluit
 *  ("tengo 2 hermanos" → "tengo dos hermanos"). */
export function spokenWords(s) {
  return stripAccents(normalize(s)).replace(/[.!?"«»—–-]/g, ' ').split(/\s+/).filter(Boolean)
    .flatMap(w => (/^\d+$/.test(w) && Number(w) < 1000000 ? stripAccents(numberWords(Number(w))).split(' ') : [w]));
}

/** Hoeveel van de zin juist gezegd is, 0–1: woordafstand t.o.v. de lengte. */
export function sentenceScore(expected, heard) {
  const a = spokenWords(expected);
  const b = spokenWords(heard);
  if (!a.length) return 0;
  // Levenshtein op woordniveau: elk woord wordt één "letter".
  const ids = new Map();
  const code = w => String.fromCharCode(0x4e00 + (ids.has(w) ? ids.get(w) : ids.set(w, ids.size).get(w)));
  const d = levenshtein(a.map(code).join(''), b.map(code).join(''));
  return Math.max(0, 1 - d / a.length);
}

/** De microfoonknop met wat er gehoord werd eronder. */
function micPanel(ctx, onHeard) {
  const status = el('p', { class: 'mic-status', 'aria-live': 'polite' }, 'Tik op de microfoon en spreek.');
  let session = null;
  const btn = el('button', {
    class: 'mic-btn', type: 'button', 'aria-label': 'Spreek',
    onclick: () => {
      if (session) { session.stop(); return; }
      ctx.speech.stop?.();
      btn.classList.add('is-listening');
      status.textContent = 'Ik luister…';
      session = recognition.listen();
      session.done
        .then(heard => { status.textContent = `Ik hoorde: „${heard[0]}”`; onHeard(heard); })
        .catch(code => {
          status.textContent = recognition.errorText(code);
          if (code === 'not-allowed' || code === 'service-not-allowed') ctx.skip?.({ noSpeaking: true, quiet: true });
        })
        .finally(() => { session = null; btn.classList.remove('is-listening'); });
    },
  }, '🎤');
  const skip = el('button', {
    class: 'link-btn', type: 'button',
    onclick: () => ctx.skip?.({ noSpeaking: true }),
  }, 'Ik kan nu niet spreken — overslaan');
  return { node: el('div', { class: 'mic-panel' }, btn, status, skip), stop: () => session?.stop() };
}

export const speakWord = {
  id: 'speakWord',
  label: 'Zeg het in het Spaans',

  supports(item, env) {
    return usable(env) && item.atom.kind === 'vocab' && item.direction === 'nl2es';
  },

  render(item, root, ctx) {
    const { atom } = item;
    let heard = [];
    root.append(
      el('p', { class: 'q-instruction' }, 'Zeg dit in het Spaans'),
      el('div', { class: 'q-prompt' },
        atom.emoji ? el('span', { class: 'q-emoji' }, atom.emoji) : null,
        el('span', { class: 'q-word', lang: 'nl' }, atom.nl[0])),
    );
    const mic = micPanel(ctx, h => { heard = h; ctx.ready(true); });
    root.append(mic.node);

    return {
      focus() {},
      check() {
        mic.stop();
        // Eén van de alternatieven van de herkenner volstaat; accenten hoor je niet.
        const hit = heard.map(h => ({ h, r: checkAnswer(h, [atom.es], { ignoreAccents: true }) })).find(x => x.r.correct);
        if (hit) return { ...hit.r, given: hit.h };
        return { correct: false, expected: atom.es, given: heard[0] ?? '', note: null };
      },
      reveal() { ctx.speech.speak(atom.es); },
    };
  },
};

/** Vanaf deze score telt een zin als juist; daaronder als "bijna" tot ALMOST. */
const FULL = 1;
const ALMOST = 0.8;

export const speakSentence = {
  id: 'speakSentence',
  label: 'Zeg het na',

  supports(item, env) {
    const a = item.atom;
    return usable(env) && (a.kind === 'dialogue' || a.kind === 'sentence')
      && typeof a.es === 'string' && !a.es.includes('___') && a.es.split(/\s+/).length <= 14;
  },

  render(item, root, ctx) {
    const { atom } = item;
    let heard = [];
    root.append(
      el('p', { class: 'q-instruction' }, 'Luister en zeg de zin na'),
      el('div', { class: 'q-prompt q-prompt--sentence' },
        el('span', { lang: 'es' }, atom.es),
        el('button', { class: 'speaker', type: 'button', 'aria-label': 'Speel af', onclick: () => ctx.speech.speak(atom.es) }, '🔊')),
    );
    if (atom.nl) root.append(el('p', { class: 'q-hint' }, atom.nl));
    setTimeout(() => ctx.speech.speak(atom.es), 250);
    const mic = micPanel(ctx, h => { heard = h; ctx.ready(true); });
    root.append(mic.node);

    return {
      focus() {},
      check() {
        mic.stop();
        const best = heard.map(h => ({ h, score: sentenceScore(atom.es, h) })).sort((x, y) => y.score - x.score)[0];
        if (!best) return { correct: false, expected: atom.es, given: '', note: null };
        if (best.score >= FULL) return { correct: true, expected: atom.es, given: best.h, note: null };
        if (best.score >= ALMOST) {
          return { correct: true, almost: true, expected: atom.es, given: best.h,
            note: `¡Casi! Ik hoorde: „${best.h}”` };
        }
        return { correct: false, expected: atom.es, given: best.h, note: `Ik hoorde: „${best.h}”` };
      },
      reveal() {},
    };
  },
};
