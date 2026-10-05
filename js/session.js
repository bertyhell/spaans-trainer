/* De lesmotor.
 *
 * Kent geen enkele oefenvorm van binnen: hij trekt een item, vraagt het
 * register om een passende vorm, laat die zichzelf tekenen en verwerkt het
 * resultaat. Een nieuwe oefenvorm toevoegen vergt hier dus geen wijziging. */

import * as scheduler from './scheduler.js';
import * as storage from './storage.js';
import * as data from './data.js';
import { pickType, supportedFor } from './types/index.js';

/** Een fout beantwoorde vraag komt zoveel vragen later nog eens terug. */
export const RETRY_GAP = 3;
/** Hoogstens zoveel herkansingen per les: een les van twaalf mag niet uitdijen tot twintig. */
export const MAX_RETRIES = 4;

export class Session {
  constructor({ items, size = 12, env }) {
    this.env = env;
    // Eerst wegfilteren wat geen enkele oefenvorm aankan, dán pas trekken.
    // Andersom zou een les korter worden dan gevraagd omdat er achteraf
    // items uitvallen die de trekking al had opgebruikt.
    const eligible = items.filter(item => supportedFor(item, env).length > 0);
    this.queue = scheduler.drawLesson(eligible, size);
    this.questions = this.queue.length;   // zonder de herkansingen
    this.index = 0;
    this.results = [];
    this.recentTypes = [];
  }

  get total() { return this.queue.length; }
  get position() { return this.index + 1; }
  get done() { return this.index >= this.queue.length; }
  get current() { return this.queue[this.index] ?? null; }

  /** Kiest de oefenvorm voor de huidige vraag. Een herkansing komt bij
   *  voorkeur in een andere vorm: dezelfde knoppen nog eens aantikken leert weinig. */
  chooseType() {
    const item = this.current;
    if (!item) return null;
    const recent = item.retryOf ? [...this.recentTypes, item.retryOf.typeId] : this.recentTypes;
    const type = pickType(item, this.env, recent);
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

    // Een herkansing verschuift geen dozen: die reageerden al op het eerste
    // antwoord. Ze is er om het juiste antwoord meteen nog eens op te halen.
    if (item.retryOf) {
      storage.addExercises(1);
      const entry = this.entry(type, result, { retry: true });
      this.results.push(entry);
      item.retryOf.retryCorrect = result.correct;
      storage.save();
      return result;
    }

    // Recente fouten horen bij het atoom dat echt fout was: in een tabel is dat
    // niet noodzakelijk de persoon die getrokken werd.
    const perAtom = Array.isArray(result.perAtom) && result.perAtom.length ? result.perAtom : null;
    if (perAtom) {
      for (const p of perAtom) {
        scheduler.record(scheduler.itemKey(p.atomId, dir), p.correct);
        storage.recordAnswer(p.atomId, p, dir);
      }
      if (!perAtom.some(p => p.atomId === item.atomId)) scheduler.record(item.key, result.correct);
    } else {
      scheduler.record(item.key, result.correct);
      storage.recordAnswer(item.atomId, result, dir);
    }

    storage.addExercises(1);

    const entry = this.entry(type, result);
    this.results.push(entry);
    if (!result.correct) this.scheduleRetry(item, entry);
    storage.save();
    return result;
  }

  entry(type, result, extra = {}) {
    const item = this.current;
    return {
      index: this.index,
      atomId: item.atomId,
      atom: item.atom,
      typeId: type.id,
      correct: result.correct,
      almost: !!result.almost,
      expected: result.expected,
      note: result.note ?? null,
      given: result.given ?? null,
      ...extra,
    };
  }

  /** Zet een fout item een paar vragen verder nog eens in de rij, één keer. */
  scheduleRetry(item, entry) {
    if (this.queue.filter(q => q.retryOf).length >= MAX_RETRIES) return;
    const at = Math.min(this.queue.length, this.index + 1 + RETRY_GAP);
    this.queue.splice(at, 0, { ...item, retryOf: entry });
  }

  next() { this.index++; }

  /** De uitslagen die meetellen: herkansingen niet, die zijn oefening. */
  get scored() { return this.results.filter(r => !r.retry); }
  get correctCount() { return this.scored.filter(r => r.correct).length; }
  get mistakes() { return this.scored.filter(r => !r.correct || r.almost); }
  get perfect() { return this.questions > 0 && this.correctCount === this.questions; }

  /** Rondt de les af: streak bijwerken. */
  finish() {
    const streak = storage.touchStreak();
    storage.save();
    return { streak, done: this.results.length };
  }
}

/** Zoveel recente fouten komen in aanmerking voor een foutenles. */
const MISTAKE_POOL = 30;

/**
 * De oefenitems voor een foutenles: de recentste en vaakst gemaakte fouten
 * eerst, in de richting waarin het misliep. Zonder bekende richting geldt
 * dezelfde regel als in een gewone les: nl→es pas na es→nl.
 */
export function itemsForMistakes() {
  const mistakes = storage.getMistakes()
    .sort((a, b) => (b.count ?? 1) - (a.count ?? 1) || b.at - a.at)
    .slice(0, MISTAKE_POOL);
  const items = [];
  for (const m of mistakes) {
    const atom = data.getAtom(m.atomId);
    if (!atom) continue;
    for (const item of data.itemsFor([atom])) {
      if (m.direction && item.direction && item.direction !== m.direction) continue;
      if (!m.direction && item.direction === 'nl2es'
        && storage.getProgress(scheduler.itemKey(item.atomId, 'es2nl')).box <= 1) continue;
      items.push(item);
    }
  }
  return items;
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
