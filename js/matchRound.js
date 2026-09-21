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

const cell = (atom, dutch = false) =>
  ({ id: atom.id, text: dutch ? atom.nl[0] : atom.es, atom });

export const VISIBLE_ROWS = 5;
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
  }

  get finished() { return this.matched >= this.target || this.active.length === 0; }
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
   *            left: {index: number, cell: object|null}|null,
   *            right: {index: number, cell: object|null}|null}}
   *   left/right wijzen de plaatsen aan die vrijkwamen, met wat er nu staat —
   *   null wanneer de voorraad op is en de plaats leeg blijft.
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
      return { ok: false, atom: null, done: false, left: null, right: null };
    }

    // Juist gekoppeld. Alleen wie foutloos bleef, klimt een doos.
    scheduler.record(scheduler.itemKey(leftId, 'es2nl'), !this.missedOnce.has(leftId));
    storage.save();

    this.matched++;
    const at = this.active.findIndex(a => a.id === leftId);
    const li = this.leftSlots.findIndex(a => a.id === leftId);
    const ri = this.rightSlots.findIndex(a => a.id === leftId);

    const replacement = this.matched < this.target ? (this.pool.shift() ?? null) : null;
    if (replacement) {
      this.active[at] = replacement;
      this.leftSlots[li] = replacement;
      this.rightSlots[ri] = replacement;
    } else {
      this.active.splice(at, 1);
      this.leftSlots.splice(li, 1);
      this.rightSlots.splice(ri, 1);
    }

    return {
      ok: true, atom, done: this.finished,
      left: { index: li, cell: replacement ? cell(replacement) : null },
      right: { index: ri, cell: replacement ? cell(replacement, true) : null },
    };
  }

  finish() {
    const streak = storage.touchStreak();
    const xp = this.matched * 5;
    storage.addXp(xp);
    storage.save();
    return { streak, xp, matched: this.matched, wrong: this.wrongAttempts };
  }
}
