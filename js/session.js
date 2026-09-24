/* De lesmotor.
 *
 * Kent geen enkele oefenvorm van binnen: hij trekt een item, vraagt het
 * register om een passende vorm, laat die zichzelf tekenen en verwerkt het
 * resultaat. Een nieuwe oefenvorm toevoegen vergt hier dus geen wijziging. */

import * as scheduler from './scheduler.js';
import * as storage from './storage.js';
import * as data from './data.js';
import { pickType, supportedFor } from './types/index.js';

export const XP_PER_CORRECT = 10;
export const XP_PERFECT_BONUS = 50;

export class Session {
  constructor({ items, size = 12, env }) {
    this.env = env;
    // Eerst wegfilteren wat geen enkele oefenvorm aankan, dán pas trekken.
    // Andersom zou een les korter worden dan gevraagd omdat er achteraf
    // items uitvallen die de trekking al had opgebruikt.
    const eligible = items.filter(item => supportedFor(item, env).length > 0);
    this.queue = scheduler.drawLesson(eligible, size);
    this.index = 0;
    this.results = [];
    this.recentTypes = [];
    this.xpEarned = 0;
  }

  get total() { return this.queue.length; }
  get position() { return this.index + 1; }
  get done() { return this.index >= this.queue.length; }
  get current() { return this.queue[this.index] ?? null; }

  /** Kiest de oefenvorm voor de huidige vraag. */
  chooseType() {
    const item = this.current;
    if (!item) return null;
    const type = pickType(item, this.env, this.recentTypes);
    if (type) this.recentTypes.push(type.id);
    return type;
  }

  /**
   * Verwerkt een antwoord: werkt de Leitner-dozen bij en houdt de uitslag bij.
   * Een vervoegingstabel beoordeelt zes atomen tegelijk; die krijgen elk hun
   * eigen doos, zodat je niet alle zes opnieuw moet doen voor één foute vorm.
   */
  submit(type, result) {
    const item = this.current;
    const dir = item.direction;

    if (Array.isArray(result.perAtom) && result.perAtom.length) {
      for (const p of result.perAtom) {
        scheduler.record(scheduler.itemKey(p.atomId, dir), p.correct);
      }
    } else {
      scheduler.record(item.key, result.correct);
    }

    if (result.correct) {
      this.xpEarned += XP_PER_CORRECT;
      storage.addXp(XP_PER_CORRECT);
    }

    this.results.push({
      index: this.index,
      atomId: item.atomId,
      atom: item.atom,
      typeId: type.id,
      correct: result.correct,
      expected: result.expected,
      note: result.note ?? null,
      given: result.given ?? null,
    });
    storage.save();
    return result;
  }

  next() { this.index++; }

  get correctCount() { return this.results.filter(r => r.correct).length; }
  get mistakes() { return this.results.filter(r => !r.correct); }
  get perfect() { return this.total > 0 && this.correctCount === this.total; }

  /** Rondt de les af: streak bijwerken en eventuele bonus toekennen. */
  finish() {
    const streak = storage.touchStreak();
    let bonus = 0;
    if (this.perfect) {
      bonus = XP_PERFECT_BONUS;
      this.xpEarned += bonus;
      storage.addXp(bonus);
    }
    storage.save();
    return { streak, bonus, xp: this.xpEarned };
  }
}

/**
 * Bouwt de itemlijst voor een selectie van thema's.
 *
 * Een woord produceren (nl→es) is veel lastiger dan het herkennen (es→nl), en
 * je kan het pas als je de vertaling ooit gezien hebt. De nl→es-richting doet
 * dus pas mee zodra es→nl van datzelfde woord een keer juist beantwoord is —
 * anders zit je te raden naar een woord dat de app je nooit getoond heeft.
 */
export function itemsForThemes(themeIds) {
  const atoms = themeIds.flatMap(id => data.atomsForTheme(id));
  return data.itemsFor(atoms).filter(item => {
    if (item.direction !== 'nl2es') return true;
    const seen = storage.getProgress(scheduler.itemKey(item.atomId, 'es2nl'));
    return seen.box > 1;
  });
}
