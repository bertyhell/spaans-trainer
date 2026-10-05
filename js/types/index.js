/* Register van oefenvormen.
 *
 * Elke vorm voldoet aan hetzelfde contract, en dat is de enige plek waar je
 * moet zijn om er een toe te voegen:
 *
 *   id       unieke naam
 *   label    Nederlandse naam voor in de interface
 *   supports(item, env) -> boolean
 *            Kan dit atoom als deze vorm getoond worden? env bevat {speech},
 *            en bij het testen soms {forceType} (zie pickType).
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
import irregularVerb from './irregularVerb.js';
import verbType from './verbType.js';
import verbSort from './verbSort.js';
import { conjugationGrid, conjugationSingle, conjugationType } from './conjugation.js';
import { tenseSpot, personSpot } from './conjugationSpot.js';
import dictation from './dictation.js';
import dialogueOrder from './dialogueOrder.js';
import agreement from './agreement.js';
import { listenType, listenChoose } from './listen.js';
import choice from './choice.js';
import reading from './reading.js';
import { dialogueMeaning, dialogueReply } from './dialogue.js';
import stressTap from './stressTap.js';
import spotError from './spotError.js';
import letterPuzzle from './letterPuzzle.js';
import emojiPick from './emojiPick.js';
import trueFalse from './trueFalse.js';
import plural from './plural.js';
import tenseShift from './tenseShift.js';
import sentenceMeaning from './sentenceMeaning.js';
import pickSentence from './pickSentence.js';
import { getProgress } from '../storage.js';

export const TYPES = [
  multipleChoice,
  typeAnswer,
  articlePicker,
  accents,
  oddOneOut,
  irregularVerb,
  verbType,
  verbSort,
  fillGap,
  wordBank,
  conjugationGrid,
  conjugationSingle,
  conjugationType,
  tenseSpot,
  personSpot,
  agreement,
  listenType,
  dictation,
  listenChoose,
  choice,
  reading,
  dialogueMeaning,
  dialogueReply,
  dialogueOrder,
  stressTap,
  spotError,
  letterPuzzle,
  emojiPick,
  trueFalse,
  plural,
  tenseShift,
  sentenceMeaning,
  pickSentence,
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
  conjugationType: 2,
  tenseSpot: 1,
  personSpot: 1,
  agreement: 2,
  dictation: 1,
  dialogueOrder: 1,
  articlePicker: 1,
  accents: 1,
  oddOneOut: 1,
  irregularVerb: 2,
  verbType: 1,
  verbSort: 1,
  spotError: 2,
  letterPuzzle: 2,
  emojiPick: 2,
  // Raden lukt hier de helft van de keren: een tussendoortje, niet meer.
  trueFalse: 1,
  plural: 1,
  tenseShift: 2,
  sentenceMeaning: 2,
  pickSentence: 1,
  // Deze vormen zijn de enige voor hun soort atoom: het gewicht doet er dan
  // niet toe, behalve bij een dialoogregel, waar antwoorden net iets meer oplevert.
  choice: 1,
  reading: 1,
  dialogueMeaning: 2,
  dialogueReply: 3,
  stressTap: 1,
};

/* Eerst herkennen, dan zelf maken. Een nieuw of pas fout beantwoord item
 * (doos 1–2) krijgt vaker een vorm waarin je het juiste antwoord ziet staan;
 * een item dat je al goed kent (doos 4–5) vaker een vorm waarin je het zelf
 * moet opschrijven. Vormen zonder `mode` zitten ertussenin. */
const RECOGNIZE = new Set([
  'multipleChoice', 'articlePicker', 'oddOneOut', 'irregularVerb', 'verbType', 'verbSort',
  'listenChoose', 'conjugationSingle', 'dialogueMeaning', 'dialogueReply', 'stressTap',
  'tenseSpot', 'personSpot', 'dialogueOrder', 'emojiPick', 'trueFalse', 'sentenceMeaning', 'pickSentence',
]);
const PRODUCE = new Set([
  'typeAnswer', 'listenType', 'conjugationGrid', 'conjugationType', 'accents', 'agreement', 'dictation', 'plural', 'tenseShift',
]);

export const modeOf = typeId => (RECOGNIZE.has(typeId) ? 'recognize' : PRODUCE.has(typeId) ? 'produce' : null);

/** Het gewicht van een vorm voor een item in deze doos. */
export function weightFor(typeId, box) {
  const base = WEIGHTS[typeId] ?? 1;
  const mode = modeOf(typeId);
  if (box <= 2 && mode === 'recognize') return base * 2;
  if (box >= 4 && mode === 'produce') return base * 2;
  if (box >= 4 && mode === 'recognize') return base / 2;
  return base;
}

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
  // ?type=<id> in de adresbalk: om één vorm na te kijken zonder te moeten wachten tot ze langskomt.
  const forced = env.forceType && candidates.find(t => t.id === env.forceType);
  if (forced) return forced;

  const avoid = new Set(recent.slice(-2));
  const fresh = candidates.filter(t => !avoid.has(t.id));
  const pool = fresh.length ? fresh : candidates;

  const { box } = getProgress(item.key);
  const total = pool.reduce((s, t) => s + weightFor(t.id, box), 0);
  let r = Math.random() * total;
  for (const t of pool) {
    r -= weightFor(t.id, box);
    if (r <= 0) return t;
  }
  return pool[pool.length - 1];
}
