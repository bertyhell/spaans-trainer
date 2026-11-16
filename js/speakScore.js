/* Hoe goed werd een zin nagezegd? Vergevingsgezind, en per woord.
 *
 * Twee bronnen:
 *
 *   wat Whisper hoorde  vergeleken op klank, niet op spelling: de herkende
 *                       tekst gaat door dezelfde klankschrift als de zin, en
 *                       klanken die een leerder (of een klein model) makkelijk
 *                       verwart tellen als gelijk — b/v/β, s/θ/z, ll/y, r/ɾ …
 *                       "a ver" voor "haber" is dan gewoon juist.
 *   bewijs in het geluid  Whisper krijgt de verwachte zin voorgelegd en zegt per
 *                       token hoe waarschijnlijk het is bij dit geluid, en bij
 *                       stilte. Het verschil (in log-kans) is hoeveel het geluid
 *                       dat woord steunt, los van hoe gewoon het woord is: een
 *                       zeldzame vervoeging die je goed zegt, scoort hoog; een
 *                       woord dat je niet zei, rond nul.
 *
 * Geijkt met tools/check-voice.mjs op nagemaakte leerders (zie de README): van
 * de juist gezegde inhoudswoorden telt 99 % als goed, ook met een zwaar accent;
 * van de niet gezegde wordt 90 % als fout aangeduid.
 *
 * Het oordeel weegt woorden naar hun lengte in lettergrepen, zodat een
 * vergeten "de" minder telt dan een vergeten "estantería". */

import { analyze } from './phonetic.js';
import { speakable } from './check.js';

/** Langere zinnen zijn eerder een geheugentest dan een uitspraakoefening. */
const MAX_WORDS = 14;

/** Wat er in de spreekmodus nagezegd wordt, of null als dit atoom niet past. */
export function sayText(atom) {
  if (atom.kind === 'vocab') return speakable(atom.es) || null;
  if ((atom.kind === 'sentence' || atom.kind === 'dialogue') && typeof atom.es === 'string'
    && !atom.es.includes('___') && atom.es.split(/\s+/).length <= MAX_WORDS) return atom.es;
  return null;
}

/** Bewijs (log-kans met geluid min zonder) vanaf waar een woord gezegd is, of bijna. */
export const EVIDENCE_OK = 2;
export const EVIDENCE_CLOSE = 1;
/** Zoveel van de klanken van een woord moet Whisper teruggehoord hebben. */
export const MATCH_OK = 0.7;
export const MATCH_CLOSE = 0.5;
/** Zoveel van de zin (gewogen) moet goed zijn: juist, of bijna. Juist mag geen
 *  enkel inhoudswoord (twee lettergrepen of meer) missen, bijna hoogstens één. */
export const PASS = 0.8;
export const ALMOST = 0.6;

/* Klanken die we niet uit elkaar houden. Eén teken per klank. */
const SIMPLE = {
  b: 'b', β: 'b', v: 'b', p: 'p', d: 'd', ð: 'd', t: 't', ɡ: 'g', ɣ: 'g', g: 'g', k: 'k',
  θ: 's', s: 's', z: 's', f: 'f', x: 'h', h: 'h', χ: 'h',
  ʎ: 'y', ʝ: 'y', j: 'i', w: 'u', l: 'l', ɾ: 'r', r: 'r',
  m: 'm', n: 'n', ŋ: 'n', ɲ: 'ñ', a: 'a', e: 'e', ɛ: 'e', i: 'i', o: 'o', u: 'u',
};
const AFFRICATES = [['tʃ', 'c'], ['dʒ', 'y']];

/** Klankschrift → lijst vereenvoudigde klanken. */
export function simplePhones(ipaText) {
  let s = ipaText.replace(/[ˈˌ.ː\s]/g, '');
  for (const [from, to] of AFFRICATES) s = s.split(from).join(to);
  return [...s].map(c => SIMPLE[c] ?? (c === 'c' || c === 'y' ? c : '')).filter(Boolean);
}

/** De woorden van een zin met hun klanken en gewicht, en waar ze in de tekst staan. */
export function expectedWords(text) {
  const out = [];
  let pos = 0;
  for (const t of analyze(text, { mode: 'ipa' })) {
    const at = text.indexOf(t.text, pos);
    const start = at >= 0 ? at : pos;
    pos = start + t.text.length;
    if (t.spoken == null) continue;
    const phones = simplePhones(t.ipa);
    const syllables = Math.max(1, (t.ipa.match(/\./g) ?? []).length + 1);
    out.push({ text: t.text, ipa: t.ipa, phones, weight: syllables, start, end: pos });
  }
  return out;
}

/**
 * Lijnt de verwachte klanken uit op de gehoorde (Levenshtein met spoor) en
 * telt per verwacht woord hoeveel klanken teruggevonden werden.
 * @returns {number[]} per woord het aandeel teruggevonden klanken, 0–1
 */
export function phoneMatch(words, heardPhones) {
  const exp = [];
  words.forEach((w, wi) => w.phones.forEach(p => exp.push({ p, wi })));
  const n = exp.length;
  const m = heardPhones.length;
  const D = Array.from({ length: n + 1 }, (_, i) => {
    const row = new Uint16Array(m + 1);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= m; j++) D[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sub = D[i - 1][j - 1] + (exp[i - 1].p === heardPhones[j - 1] ? 0 : 1);
      D[i][j] = Math.min(sub, D[i - 1][j] + 1, D[i][j - 1] + 1);
    }
  }
  const hits = new Array(words.length).fill(0);
  let i = n;
  let j = m;
  // Terug door de tabel, van achteren. Bij gelijke kosten liever een verwachte
  // klank overslaan: dan vallen de overeenkomsten zo vroeg mogelijk in de zin.
  // Wie halverwege stopt, mist zo het einde, en niet een woord in het midden.
  while (i > 0 && j > 0) {
    const same = exp[i - 1].p === heardPhones[j - 1];
    if (D[i][j] === D[i - 1][j] + 1) i--;
    else if (same && D[i][j] === D[i - 1][j - 1]) {
      hits[exp[i - 1].wi]++;
      i--; j--;
    } else if (D[i][j] === D[i][j - 1] + 1) j--;
    else { i--; j--; }
  }
  return words.map((w, wi) => (w.phones.length ? hits[wi] / w.phones.length : 1));
}

/**
 * Per woord de gemiddelde log-kans uit de gedwongen doorgang.
 * @param tokens  [{start, end}] posities van de tokens in de tekst (Tokenizer.encode)
 * @param perToken log-kans per token
 */
export function forcedPerWord(words, tokens, perToken) {
  return words.map(w => {
    const own = [];
    tokens.forEach((t, k) => {
      // Een token hoort bij het woord waarin zijn eerste echte teken valt.
      const mid = Math.max(t.start, Math.min(t.end - 1, t.start + 1));
      if (mid >= w.start && mid < w.end) own.push(perToken[k]);
    });
    return own.length ? own.reduce((a, b) => a + b, 0) / own.length : null;
  });
}

/** Goed, bijna of gemist, voor één woord. Zonder bewijs (null) telt enkel de klank. */
export function wordState(match, evidence) {
  if (evidence == null) return match >= MATCH_OK ? 'ok' : match >= 0.4 ? 'close' : 'miss';
  if ((match >= MATCH_OK && evidence >= 0) || evidence >= EVIDENCE_OK) return 'ok';
  if (evidence >= EVIDENCE_CLOSE || (match >= MATCH_CLOSE && evidence >= 0)) return 'close';
  return 'miss';
}

/**
 * Het oordeel.
 * @param text      de zin die nagezegd moest worden
 * @param heard     wat Whisper hoorde
 * @param evidence  per woord het bewijs uit forcedPerWord (log-kans met geluid
 *                  min zonder), of null
 * @returns {{verdict: 'ok'|'almost'|'wrong', score: number,
 *            words: {text, ipa, state: 'ok'|'close'|'miss'}[], heardIpa: string}}
 */
export function judge(text, heard, evidence = null) {
  const words = expectedWords(text);
  const heardIpa = heard ? analyze(heard, { mode: 'ipa' }).filter(t => t.spoken != null).map(t => t.ipa).join(' ') : '';
  const match = phoneMatch(words, simplePhones(heardIpa));
  let got = 0;
  let total = 0;
  const out = words.map((w, i) => {
    const ev = evidence?.[i] ?? null;
    const state = wordState(match[i], ev);
    got += w.weight * (state === 'ok' ? 1 : state === 'close' ? 0.5 : 0);
    total += w.weight;
    return { text: w.text, ipa: w.ipa, state, match: match[i], evidence: ev, weight: w.weight };
  });
  const score = total ? got / total : 0;
  const missedContent = out.filter(w => w.state === 'miss' && w.weight >= 2).length;
  // Niets gehoord is nooit juist, hoe waarschijnlijk de zin ook is.
  const verdict = !heard?.trim() ? 'wrong'
    : score >= PASS && !missedContent ? 'ok'
    : score >= ALMOST && missedContent <= 1 ? 'almost'
    : 'wrong';
  return { verdict, score, words: out, heardIpa: heardIpa ? `[${heardIpa}]` : '' };
}
