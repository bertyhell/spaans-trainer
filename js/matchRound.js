/* Woorden koppelen.
 *
 * Geen gewone vraag maar een eigen ronde: zes paren staan zichtbaar. Een goed
 * gekoppeld paar blijft groen staan; pas wanneer er twee paren gekoppeld zijn,
 * schuiven er twee nieuwe paren uit de voorraad in de vrije plaatsen — per kolom
 * willekeurig verdeeld, zodat je niet kunt raden waar het nieuwe woord staat.
 * De ronde loopt tot het doel bereikt is (standaard 30 gekoppelde woorden) of
 * tot de voorraad op is.
 *
 * Elk gekoppeld paar telt als een antwoord voor zijn Leitner-doos: de eerste
 * poging bepaalt goed of fout, latere pogingen op hetzelfde paar tellen niet
 * nog eens mee. */

import * as scheduler from './scheduler.js';
import * as storage from './storage.js';

const cell = (atom, dutch = false) =>
  ({ id: atom.id, text: dutch ? atom.nl[0] : atom.es, atom });

/* Twee woorden met dezelfde vertaling ("de bril" voor las gafas én los lentes)
 * mogen niet tegelijk op het bord: dan is er geen juist paar meer. */
const gloss = s => String(s).toLowerCase().replace(/^(de|het|een) /, '').trim();
const clash = (a, b) => a.nl.some(x => b.nl.some(y => gloss(x) === gloss(y)));

export const VISIBLE_ROWS = 6;
export const DEFAULT_TARGET = 30;

export class MatchRound {
  constructor({ atoms, target = DEFAULT_TARGET, visible = VISIBLE_ROWS }) {
    this.pool = scheduler.shuffle(atoms.filter(a => a.kind === 'vocab'));
    this.target = Math.min(target, this.pool.length);
    this.visible = Math.min(visible, this.pool.length);

    this.active = this.take(this.visible, []);
    // Twee losse, elk apart geschudde kolommen met vaste plaatsen. Een gekoppeld
    // paar wordt op zíjn plaats vervangen in plaats van alles opnieuw te
    // schudden: anders springt bij elk juist antwoord het hele scherm door
    // elkaar en ben je je oriëntatie kwijt. Omdat links en rechts onafhankelijk
    // geschud zijn, staat een nieuw paar toch niet op dezelfde hoogte.
    this.leftSlots = scheduler.shuffle(this.active);
    this.rightSlots = scheduler.shuffle(this.active);
    // Per ronde willekeurig: Nederlands links of rechts. Binnen een ronde blijft
    // dat vast, anders moet je bij elk woord opnieuw zoeken welke kant wat is.
    this.dutchLeft = Math.random() < 0.5;
    this.matched = 0;
    this.attempts = 0;
    this.wrongAttempts = 0;
    this.missedOnce = new Set();   // paren waar al eens fout op gegokt is
    this.pending = [];             // gekoppeld, maar plaats nog niet vervangen
  }

  /** Haalt tot n woorden uit de voorraad die met niets op het bord botsen. */
  take(n, onBoard) {
    const out = [];
    for (let i = 0; i < this.pool.length && out.length < n;) {
      const a = this.pool[i];
      if ([...onBoard, ...out].some(b => clash(a, b))) { i++; continue; }
      out.push(a);
      this.pool.splice(i, 1);
    }
    return out;
  }

  get finished() { return this.matched >= this.target || this.active.length === this.pending.length; }
  get accuracy() { return this.attempts ? this.matched / this.attempts : 0; }

  /** De twee kolommen. Vaste volgorde: alleen vervangen plaatsen veranderen. */
  columns() {
    return {
      left: this.leftSlots.map(a => cell(a, this.dutchLeft)),
      right: this.rightSlots.map(a => cell(a, !this.dutchLeft)),
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
        const a = this.active.find(x => x.id === id);
        if (!a) continue;
        scheduler.record(scheduler.itemKey(id, 'es2nl'), false);
        storage.recordAnswer(id, { correct: false, expected: `${a.es} = ${a.nl[0]}` }, 'es2nl');
      }
      storage.save();
      return { ok: false, atom: null, done: false, left: [], right: [] };
    }

    // Juist gekoppeld. Alleen wie foutloos bleef, klimt een doos (en werkt een
    // recente fout weg).
    const clean = !this.missedOnce.has(leftId);
    scheduler.record(scheduler.itemKey(leftId, 'es2nl'), clean);
    if (clean) storage.recordAnswer(leftId, { correct: true }, 'es2nl');
    storage.save();

    this.matched++;
    this.pending.push(leftId);

    const empty = { ok: true, atom, done: this.finished, left: [], right: [] };
    if (this.finished || (this.pending.length < 2 && this.pool.length)) return empty;

    // Twee paren gekoppeld (of de voorraad is op): vul de vrije plaatsen.
    const open = this.active.length - this.pending.length;
    const room = Math.max(0, this.target - this.matched - open);
    const freed = this.pending;
    const staying = this.active.filter(a => !freed.includes(a.id));
    const fresh = this.take(Math.min(room, freed.length), staying);
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
    const left = refill(this.leftSlots, this.dutchLeft);
    const right = refill(this.rightSlots, !this.dutchLeft);
    this.active = this.active.filter(a => !freed.includes(a.id)).concat(fresh);

    return { ok: true, atom, done: this.finished, left, right };
  }

  finish() {
    // Eén keer tellen, ook als stoppen en afronden elkaar kruisen.
    if (this.closed) return this.closed;
    const streak = storage.touchStreak();
    storage.addExercises(this.matched);
    storage.save();
    this.closed = { streak, done: this.matched, matched: this.matched, wrong: this.wrongAttempts };
    return this.closed;
  }
}
