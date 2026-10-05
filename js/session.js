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
/** Een nieuw woord wordt zoveel vragen vóór zijn eerste vraag voorgesteld. */
export const INTRO_LEAD = 2;

/** Is dit woord nog nooit gevraagd, in geen van beide richtingen? */
function isNewWord(item) {
  if (item.atom.kind !== 'vocab') return false;
  return ['nl2es', 'es2nl'].every(dir => storage.getProgress(scheduler.itemKey(item.atomId, dir)).seen === 0);
}

/**
 * Zet voor elk nieuw woord een kennismakingskaart in de rij, een paar vragen
 * vóór de vraag zelf. Meteen erna vragen toetst enkel het kortetermijngeheugen;
 * helemaal geen kaart betekent raden naar een woord dat je nooit zag.
 */
export function withIntros(queue, lead = INTRO_LEAD) {
  const introduced = new Set();
  const introFor = item => {
    if (!item || introduced.has(item.atomId) || !isNewWord(item)) return [];
    introduced.add(item.atomId);
    return [{ ...item, intro: true }];
  };
  const out = [];
  for (let i = 0; i < lead; i++) out.push(...introFor(queue[i]));
  queue.forEach((item, i) => {
    out.push(...introFor(queue[i + lead]));
    out.push(item);
  });
  return out;
}

export class Session {
  constructor({ items, size = 12, env, intros = true }) {
    // Een eigen kopie: een les kan een vorm uitschakelen (bv. geen microfoon)
    // zonder dat de volgende les dat erft.
    this.env = { ...env };
    // Eerst wegfilteren wat geen enkele oefenvorm aankan, dán pas trekken.
    // Andersom zou een les korter worden dan gevraagd omdat er achteraf
    // items uitvallen die de trekking al had opgebruikt.
    const eligible = items.filter(item => supportedFor(item, env).length > 0);
    this.queue = scheduler.drawLesson(eligible, size);
    this.questions = this.queue.length;   // zonder de herkansingen en kennismakingen
    if (intros && !env.forceType) this.queue = withIntros(this.queue);
    this.index = 0;
    this.results = [];
    this.recentTypes = [];
  }

  get total() { return this.queue.length; }
  get position() { return this.index + 1; }
  get done() { return this.index >= this.queue.length; }
  get current() { return this.queue[this.index] ?? null; }

  /** De vragen in de rij, zonder kennismakingskaarten — voor teller en balk. */
  get questionEntries() { return this.queue.map((q, i) => ({ q, i })).filter(({ q }) => !q.intro); }
  /** Het hoeveelste vraag dit is (een kaart telt mee met de vraag erna). */
  get questionNumber() {
    return this.queue.slice(0, this.index + 1).filter(q => !q.intro).length + (this.current?.intro ? 1 : 0);
  }
  get isLast() { return this.queue.slice(this.index + 1).every(q => q.intro); }

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
    this.noteConfusion(item, result);

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
      // Met een hint juist: gezien, maar de doos blijft staan.
      scheduler.record(item.key, result.correct, { hold: Boolean(result.hinted) });
      storage.recordAnswer(item.atomId, result, dir);
    }

    storage.addExercises(1);

    const entry = this.entry(type, result);
    this.results.push(entry);
    if (!result.correct) this.scheduleRetry(item, entry);
    storage.save();
    return result;
  }

  /**
   * Een fout antwoord dat zelf een ander woord uit de cursus is, onthouden we
   * als verward paar. Een "welk is welk?"-vraag werkt het paar bij.
   */
  noteConfusion(item, result) {
    if (result.confusionWith) {
      storage.resolveConfusion(item.atomId, result.confusionWith, result.correct && !result.almost);
      return;
    }
    if (result.correct || typeof result.given !== 'string') return;
    const other = data.confusedWith(item.atom, result.given, item.direction);
    if (other) storage.recordConfusion(item.atomId, other.id);
  }

  /** Slaat de huidige vraag over zonder iets te bewaren (bv. geen microfoon). */
  skip() {
    if (!this.current?.intro && !this.current?.retryOf) this.questions = Math.max(0, this.questions - 1);
    this.index++;
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
      hinted: !!result.hinted,
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

/** Vanaf zoveel geoefende items is een gemengde herhaling zinvol. */
export const REVIEW_MIN = 20;

/**
 * Een herhaling over alle thema's heen: enkel wat je al eens zag. De planner
 * kiest daaruit wat het langst wacht en het zwakst zit; door elkaar oefenen
 * blijft beter hangen dan thema per thema.
 */
export function itemsForReview() {
  return data.itemsFor(data.allAtoms()).filter(item => storage.getProgress(item.key).seen > 0);
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
