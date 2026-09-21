/* Woorden koppelen.
 *
 * Geen gewone vraag maar een eigen ronde: vijf paren staan zichtbaar, en zodra
 * je er een goed koppelt schuift er een nieuw paar uit de voorraad in de plaats.
 * De ronde loopt tot het doel bereikt is (standaard 40 gekoppelde woorden) of
 * tot de voorraad op is.
 *
 * Elk gekoppeld paar telt als een antwoord voor zijn Leitner-doos: de eerste
 * poging bepaalt goed of fout, latere pogingen op hetzelfde paar tellen niet
 * nog eens mee. */

import * as scheduler from './scheduler.js';
import * as storage from './storage.js';

export const VISIBLE_ROWS = 5;
export const DEFAULT_TARGET = 40;

export class MatchRound {
  constructor({ atoms, target = DEFAULT_TARGET, visible = VISIBLE_ROWS }) {
    this.pool = scheduler.shuffle(atoms.filter(a => a.kind === 'vocab'));
    this.target = Math.min(target, this.pool.length);
    this.visible = Math.min(visible, this.pool.length);

    this.active = this.pool.splice(0, this.visible);
    this.matched = 0;
    this.attempts = 0;
    this.wrongAttempts = 0;
    this.missedOnce = new Set();   // paren waar al eens fout op gegokt is
  }

  get finished() { return this.matched >= this.target || this.active.length === 0; }
  get accuracy() { return this.attempts ? this.matched / this.attempts : 0; }

  /** De twee kolommen, elk apart geschud zodat ze niet op één lijn staan. */
  columns() {
    return {
      left: scheduler.shuffle(this.active).map(a => ({ id: a.id, text: a.es, atom: a })),
      right: scheduler.shuffle(this.active).map(a => ({ id: a.id, text: a.nl[0], atom: a })),
    };
  }

  /**
   * Probeert twee kanten te koppelen.
   * @returns {{ok: boolean, atom: object|null, replacement: object|null, done: boolean}}
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
      return { ok: false, atom: null, replacement: null, done: false };
    }

    // Juist gekoppeld. Alleen wie foutloos bleef, klimt een doos.
    scheduler.record(scheduler.itemKey(leftId, 'es2nl'), !this.missedOnce.has(leftId));
    storage.save();

    this.matched++;
    const at = this.active.findIndex(a => a.id === leftId);
    const replacement = this.pool.shift() ?? null;
    if (replacement && this.matched < this.target) this.active[at] = replacement;
    else this.active.splice(at, 1);

    return { ok: true, atom, replacement, done: this.finished };
  }

  finish() {
    const streak = storage.touchStreak();
    const xp = this.matched * 5;
    storage.addXp(xp);
    storage.save();
    return { streak, xp, matched: this.matched, wrong: this.wrongAttempts };
  }
}
