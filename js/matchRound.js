/* Woorden koppelen.
 *
 * Geen gewone vraag maar een eigen ronde: zes paren staan zichtbaar. Een goed
 * gekoppeld paar blijft groen staan; pas wanneer er twee paren gekoppeld zijn,
 * schuiven er twee nieuwe paren uit de voorraad in de vrije plaatsen — per kolom
 * willekeurig verdeeld, zodat je niet kunt raden waar het nieuwe woord staat.
 * De ronde loopt tot het doel bereikt is (standaard 40 gekoppelde woorden) of
 * tot de voorraad op is.
 *
 * Elk gekoppeld paar telt als een antwoord voor zijn Leitner-doos: de eerste
 * poging bepaalt goed of fout, latere pogingen op hetzelfde paar tellen niet
 * nog eens mee. */

import * as scheduler from './scheduler.js';
import * as storage from './storage.js';

const cell = (atom, dutch = false) =>
  ({ id: atom.id, text: dutch ? atom.nl[0] : atom.es, atom });

export const VISIBLE_ROWS = 6;
export const DEFAULT_TARGET = 40;

export class MatchRound {
  constructor({ atoms, target = DEFAULT_TARGET, visible = VISIBLE_ROWS }) {
    this.pool = scheduler.shuffle(atoms.filter(a => a.kind === 'vocab'));
    this.target = Math.min(target, this.pool.length);
    this.visible = Math.min(visible, this.pool.length);

    this.active = this.pool.splice(0, this.visible);
    // Twee losse, elk apart geschudde kolommen met vaste plaatsen. Een gekoppeld
    // paar wordt op zíjn plaats vervangen in plaats van alles opnieuw te
    // schudden: anders springt bij elk juist antwoord het hele scherm door
    // elkaar en ben je je oriëntatie kwijt. Omdat links en rechts onafhankelijk
    // geschud zijn, staat een nieuw paar toch niet op dezelfde hoogte.
    this.leftSlots = scheduler.shuffle(this.active);
    this.rightSlots = scheduler.shuffle(this.active);
    this.matched = 0;
    this.attempts = 0;
    this.wrongAttempts = 0;
    this.missedOnce = new Set();   // paren waar al eens fout op gegokt is
    this.pending = [];             // gekoppeld, maar plaats nog niet vervangen
  }

  get finished() { return this.matched >= this.target || this.active.length === this.pending.length; }
  get accuracy() { return this.attempts ? this.matched / this.attempts : 0; }

  /** De twee kolommen. Vaste volgorde: alleen vervangen plaatsen veranderen. */
  columns() {
    return {
      left: this.leftSlots.map(cell),
      right: this.rightSlots.map(a => cell(a, true)),
    };
  }

  /**
   * Probeert twee kanten te koppelen.
   * @returns {{ok: boolean, atom: object|null, done: boolean,
   *            left: {index: number, cell: object|null}[],
   *            right: {index: number, cell: object|null}[]}}
   *   left/right: plaatsen die nu een nieuw woord krijgen (leeg zolang er nog
   *   geen twee paren gekoppeld zijn). cell is null wanneer de voorraad op is:
   *   dan blijft het gekoppelde woord gewoon groen staan.
   */
  tryMatch(leftId, rightId) {
    this.attempts++;
    const atom = this.active.find(a => a.id === leftId);

    if (leftId !== rightId) {
      this.wrongAttempts++;
      this.missedOnce.add(leftId);
      this.missedOnce.add(rightId);
      // Een misgreep zet beide woorden meteen terug naar doos 1.
      for (const id of [leftId, rightId]) {
        if (this.active.some(a => a.id === id)) {
          scheduler.record(scheduler.itemKey(id, 'es2nl'), false);
        }
      }
      storage.save();
      return { ok: false, atom: null, done: false, left: [], right: [] };
    }

    // Juist gekoppeld. Alleen wie foutloos bleef, klimt een doos.
    scheduler.record(scheduler.itemKey(leftId, 'es2nl'), !this.missedOnce.has(leftId));
    storage.save();

    this.matched++;
    this.pending.push(leftId);

    const empty = { ok: true, atom, done: this.finished, left: [], right: [] };
    if (this.finished || (this.pending.length < 2 && this.pool.length)) return empty;

    // Twee paren gekoppeld (of de voorraad is op): vul de vrije plaatsen.
    const open = this.active.length - this.pending.length;
    const room = Math.max(0, this.target - this.matched - open);
    const fresh = this.pool.splice(0, Math.min(room, this.pending.length));
    const freed = this.pending;
    this.pending = [];

    const refill = (slots, dutch) => {
      const idx = scheduler.shuffle(freed.map(id => slots.findIndex(a => a.id === id)));
      const newbies = scheduler.shuffle(fresh);
      return idx.map((index, i) => {
        const a = newbies[i] ?? null;
        if (a) slots[index] = a;
        return { index, cell: a ? cell(a, dutch) : null };
      });
    };
    const left = refill(this.leftSlots, false);
    const right = refill(this.rightSlots, true);
    this.active = this.active.filter(a => !freed.includes(a.id)).concat(fresh);

    return { ok: true, atom, done: this.finished, left, right };
  }

  finish() {
    const streak = storage.touchStreak();
    const xp = this.matched * 5;
    storage.addXp(xp);
    storage.save();
    return { streak, xp, matched: this.matched, wrong: this.wrongAttempts };
  }
}
