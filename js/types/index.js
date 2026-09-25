/* Register van oefenvormen.
 *
 * Elke vorm voldoet aan hetzelfde contract, en dat is de enige plek waar je
 * moet zijn om er een toe te voegen:
 *
 *   id       unieke naam
 *   label    Nederlandse naam voor in de interface
 *   supports(item, env) -> boolean
 *            Kan dit atoom als deze vorm getoond worden? env bevat {speech}.
 *   render(item, root, ctx) -> instance
 *            ctx = {ready(bool), submit(), speech}
 *            instance = {focus(), check() -> result, reveal(result)}
 *
 * check() geeft {correct, expected, note, given, perAtom?} terug.
 */

import multipleChoice from './multipleChoice.js';
import typeAnswer from './typeAnswer.js';
import articlePicker from './articlePicker.js';
import fillGap from './fillGap.js';
import wordBank from './wordBank.js';
import accents from './accents.js';
import oddOneOut from './oddOneOut.js';
import stemChange from './stemChange.js';
import { conjugationGrid, conjugationSingle } from './conjugation.js';
import { listenType, listenChoose } from './listen.js';

export const TYPES = [
  multipleChoice,
  typeAnswer,
  articlePicker,
  accents,
  oddOneOut,
  stemChange,
  fillGap,
  wordBank,
  conjugationGrid,
  conjugationSingle,
  listenType,
  listenChoose,
];

export const byId = Object.fromEntries(TYPES.map(t => [t.id, t]));

/* Hoe vaak een vorm gekozen mag worden wanneer er meerdere passen.
 * Zelf intypen levert het meeste op, dus dat weegt zwaarder; de
 * vervoegingstabel is zwaar en komt daarom niet te vaak. */
const WEIGHTS = {
  typeAnswer: 3,
  multipleChoice: 2,
  fillGap: 3,
  wordBank: 2,
  listenType: 2,
  listenChoose: 2,
  conjugationSingle: 2,
  conjugationGrid: 1,
  articlePicker: 1,
  accents: 1,
  oddOneOut: 1,
  stemChange: 2,
};

/** Alle vormen waarin dit item getoond kan worden. */
export function supportedFor(item, env) {
  return TYPES.filter(t => {
    try { return t.supports(item, env); }
    catch { return false; }
  });
}

/**
 * Kiest een vorm voor dit item.
 * @param recent  laatst gebruikte vorm-id's; vermijdt drie keer hetzelfde.
 */
export function pickType(item, env, recent = []) {
  const candidates = supportedFor(item, env);
  if (!candidates.length) return null;

  const avoid = new Set(recent.slice(-2));
  const fresh = candidates.filter(t => !avoid.has(t.id));
  const pool = fresh.length ? fresh : candidates;

  const total = pool.reduce((s, t) => s + (WEIGHTS[t.id] ?? 1), 0);
  let r = Math.random() * total;
  for (const t of pool) {
    r -= WEIGHTS[t.id] ?? 1;
    if (r <= 0) return t;
  }
  return pool[pool.length - 1];
}
