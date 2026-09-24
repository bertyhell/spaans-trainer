/* Leitner-planning.
 *
 * Elk oefenitem zit in een doos van 1 tot 5. Juist → een doos hoger,
 * fout → terug naar doos 1. De trekkans is omgekeerd evenredig met het
 * doosnummer, dus een item uit doos 1 komt vijf keer zo vaak langs als een
 * item uit doos 5. Geen vervaldatums: wie drie dagen overslaat krijgt geen
 * achterstand van 400 kaarten voorgeschoteld, er is gewoon altijd werk. */

import * as storage from './storage.js';

export const MAX_BOX = 5;

/** Aandeel van een les dat hoogstens uit nog nooit geziene items bestaat. */
const NEW_ITEM_SHARE = 0.4;

export const itemKey = (atomId, direction) =>
  direction ? `${atomId}:${direction}` : atomId;

export const weightForBox = box => 1 / Math.max(1, Math.min(MAX_BOX, box));

/** Beheersing van 0 tot 1, gebruikt voor de voortgangsbalkjes. */
export function mastery(keys) {
  if (!keys.length) return 0;
  const total = keys.reduce((sum, k) => {
    const { box, seen } = storage.getProgress(k);
    return sum + (seen === 0 ? 0 : (box - 1) / (MAX_BOX - 1));
  }, 0);
  return total / keys.length;
}

/** Na zoveel juiste antwoorden verdwijnt het hulp-emoji bij een vraag. */
export const EMOJI_HIDE_AFTER = 10;

/** Toont deze vraag nog een emoji als geheugensteun? */
export function showEmoji(key) {
  const { seen, wrong } = storage.getProgress(key);
  return seen - wrong < EMOJI_HIDE_AFTER;
}

/** Werkt de doos bij na een antwoord. Geeft de nieuwe staat terug. */
export function record(key, correct) {
  const p = storage.getProgress(key);
  const next = {
    box: correct ? Math.min(MAX_BOX, p.box + 1) : 1,
    seen: p.seen + 1,
    wrong: p.wrong + (correct ? 0 : 1),
    lastSeen: Date.now(),
  };
  storage.setProgress(key, next);
  return next;
}

/** Gewogen trekking zonder teruglegging. */
function sampleWeighted(candidates, n) {
  const pool = candidates.slice();
  const picked = [];
  while (picked.length < n && pool.length) {
    const total = pool.reduce((s, c) => s + c.weight, 0);
    let r = Math.random() * total;
    let idx = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) { idx = i; break; }
    }
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}

/**
 * Stelt een les samen uit de beschikbare oefenitems.
 *
 * @param items  [{atomId, direction, key}]
 * @param size   gewenst aantal vragen
 * @returns      hoogstens `size` items; korter als er te weinig zijn — nooit
 *               herhaling binnen dezelfde les, want dat voelt als opvulling.
 */
export function drawLesson(items, size = 12) {
  if (!items.length) return [];

  const seen = [];
  const fresh = [];
  for (const it of items) {
    const p = storage.getProgress(it.key);
    const entry = { ...it, progress: p, weight: weightForBox(p.box) };
    (p.seen === 0 ? fresh : seen).push(entry);
  }

  // Nieuwe items worden begrensd zodat herhaling niet verdrinkt in nieuw werk.
  const maxNew = Math.max(1, Math.round(size * NEW_ITEM_SHARE));
  const newPart = sampleWeighted(fresh, Math.min(maxNew, fresh.length));
  const reviewPart = sampleWeighted(seen, Math.min(size - newPart.length, seen.length));

  // Blijft er ruimte over doordat één kant op is, dan vult de andere kant aan.
  let lesson = [...reviewPart, ...newPart];
  if (lesson.length < size) {
    const used = new Set(lesson.map(l => l.key));
    const rest = [...fresh, ...seen].filter(x => !used.has(x.key));
    lesson = lesson.concat(sampleWeighted(rest, Math.min(size - lesson.length, rest.length)));
  }

  return shuffle(lesson);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
