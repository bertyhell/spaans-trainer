/* Flashcards.
 *
 * Geen oefening met een juist of fout antwoord: je draait de kaart om en zegt
 * zelf of je het wist. Daarom telt een ronde niet mee voor de Leitner-dozen —
 * een eerlijk "gekend" en een hoopvol "gekend" zijn niet van elkaar te
 * onderscheiden, en de beheersing moet blijven kloppen.
 *
 * Een kaart die je nog niet kent, komt een paar kaarten later terug, tot je ze
 * wel kent. Woorden die je in de lessen moeilijk vindt (lage doos) komen eerst. */

import { shuffle } from './random.js';
import { itemKey } from './scheduler.js';
import * as storage from './storage.js';

export const DIRECTIONS = ['nl2es', 'es2nl'];
export const DEFAULT_SIZE = 20;
/* Hoeveel kaarten er tussen zitten voor een "nog niet" terugkomt. Direct
 * erna is te makkelijk: dan onthoud je de kaart, niet het woord. */
const REQUEUE_GAP = 4;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export class FlashDeck {
  /**
   * @param {object} opts
   * @param {object[]} opts.atoms   woordenschat-atomen
   * @param {string[]} opts.directions  'nl2es' en/of 'es2nl'
   */
  constructor({ atoms, directions, size = DEFAULT_SIZE }) {
    const dirs = directions.filter(d => DIRECTIONS.includes(d));
    if (!dirs.length) throw new Error('FlashDeck: minstens één richting nodig');

    // Beide richtingen aan: per kaart één van de twee, niet elk woord twee
    // keer — anders zie je het antwoord van de volgende kaart al staan.
    const cards = shuffle(atoms.filter(a => a.kind === 'vocab'))
      .map(atom => {
        const direction = pick(dirs);
        return { atom, direction, box: storage.getProgress(itemKey(atom.id, direction)).box };
      });
    // Stabiel sorteren: binnen dezelfde doos blijft de volgorde willekeurig.
    cards.sort((a, b) => a.box - b.box);

    this.queue = cards.slice(0, size);
    this.total = this.queue.length;
    this.known = 0;              // kaarten die (uiteindelijk) gekend zijn
    this.knownFirstTry = 0;
    this.flips = 0;
    this.missed = new Set();     // atoom-id's die al eens "nog niet" kregen
  }

  get current() { return this.queue[0] ?? null; }
  get done() { return this.queue.length === 0; }

  /** Zelfbeoordeling van de huidige kaart. */
  answer(known) {
    const card = this.queue.shift();
    if (!card) return;
    this.flips++;
    if (known) {
      this.known++;
      if (!this.missed.has(card.atom.id)) this.knownFirstTry++;
      return;
    }
    this.missed.add(card.atom.id);
    this.queue.splice(Math.min(REQUEUE_GAP, this.queue.length), 0, card);
  }
}

/** De gekozen richtingen, met beide aan als standaard. */
export function savedDirections() {
  const dirs = storage.get().settings.flashDirections;
  return Array.isArray(dirs) && dirs.some(d => DIRECTIONS.includes(d)) ? dirs : [...DIRECTIONS];
}

export function saveDirections(dirs) {
  storage.get().settings.flashDirections = dirs;
  storage.save();
}
