/* Klankschrift voor het Spaans: van gewone tekst naar IPA.
 *
 * Spaans schrijft bijna zoals het klinkt, dus een handvol regels volstaat:
 * letters → klanken, lettergrepen, klemtoon, en dan de klanken die van hun
 * buren afhangen (de zachte b/d/g, de n die m of ŋ wordt). Uit dezelfde
 * analyse komen twee uitvoervormen:
 *
 *   ipa(text)       voor de leerder: [ˈko.mo te ˈʎa.mas] — klemtoonteken vóór
 *                   de lettergreep, lettergrepen gescheiden door een punt.
 *   phonemes(text)  voor de stem (js/voice): dezelfde klanken in de schrijfwijze
 *                   van espeak-ng, waarop de Piper-stem getraind is —
 *                   "kˈomo te ʎˈamas?". Daar staat het klemtoonteken vlak vóór
 *                   de klinker, en volgen we espeak ook in zijn eigenaardigheden
 *                   (ɛ vóór n + medeklinker, bijklemtoon), want dat is wat de
 *                   stem kent. Waar espeak zich vergist (pingüino als "pin-gu-i-no")
 *                   volgen we het Spaans.
 *
 * Wat niet als gewoon Spaans gelezen wordt — cijfers, afkortingen, leenwoorden,
 * buitenlandse namen — schrijft spoken() eerst uit zoals een Spanjaard het zegt.
 * Castiliaans: c/z als [θ], ll als [ʎ]. */

import { numberWords } from './numerals.js';

/* ------------------------------------------------------------------ */
/* 1. Uitschrijven: wat er hardop gezegd wordt                          */
/* ------------------------------------------------------------------ */

/** Leenwoorden en namen, zoals ze in Spanje klinken, in Spaanse spelling. */
const RESPELL = {
  // leenwoorden
  shock: 'chok', shorts: 'chors', camping: 'cámpin', footing: 'fútin', jazz: 'yas',
  döner: 'dóner', sándwich: 'sángüich', sandwich: 'sángüich', whatsapp: 'guásap', wifi: 'güífi',
  pizza: 'pítsa', pizzas: 'pítsas', hobby: 'jóbi', show: 'chou', web: 'güeb', email: 'iméil',
  ok: 'okéi', okay: 'okéi', iphone: 'áifon', facebook: 'féisbuk', instagram: 'ínstagram',
  hámster: 'jámster', hamster: 'jámster', marketing: 'márketin', parking: 'párkin',
  // namen
  the: 'de', grill: 'gril', mary: 'méri', peter: 'píter', jan: 'yan', wright: 'rráit',
  roquefort: 'rokefór', mozart: 'mózart', quant: 'cuant', rubens: 'rúbens',
  graham: 'gráam', bell: 'bel', karl: 'carl', bergoglio: 'bergóllo', neil: 'níl',
  armstrong: 'ármstron', patxi: 'pachi', fundació: 'fundasió', tàpies: 'tápies',
  madonna: 'madona', michael: 'máikel', jackson: 'yákson', ikea: 'ikéa', francfort: 'fráncfort',
  méxico: 'méjico', mexicano: 'mejicano', mexicana: 'mejicana', mexicanos: 'mejicanos',
  mexicanas: 'mejicanas', texas: 'tejas', oaxaca: 'oajaca',
};

/** Afkortingen; de punt hoort bij het woord. */
const ABBREVIATIONS = {
  'sr.': 'señor', 'sra.': 'señora', 'srta.': 'señorita', 'sres.': 'señores', 'sras.': 'señoras',
  'dr.': 'doctor', 'dra.': 'doctora', 'd.': 'don', 'dña.': 'doña', 'ud.': 'usted', 'uds.': 'ustedes',
  'vd.': 'usted', 'vds.': 'ustedes', 'etc.': 'etcétera', 'avda.': 'avenida', 'c/': 'calle',
  'n.º': 'número', 'nº': 'número', 'pág.': 'página', 'tel.': 'teléfono', 'p.': 'página',
  'km': 'kilómetros', 'kg': 'kilos', 'cm': 'centímetros', 'min': 'minutos', 'h': 'horas',
  'ee.uu.': 'estados unidos', 'ee. uu.': 'estados unidos',
};

/** Hoofdletterwoorden die je letter per letter zegt. De rest (AVE, SUR) is een gewoon woord. */
const SPELLED = new Set(['dni', 'ue', 'tv', 'ong', 'cd', 'dvd', 'bbc', 'usa', 'pc', 'nif', 'eso', 'bbva']);
const LETTER_NAMES = {
  a: 'a', b: 'be', c: 'ce', d: 'de', e: 'e', f: 'efe', g: 'ge', h: 'hache', i: 'i', j: 'jota',
  k: 'ka', l: 'ele', m: 'eme', n: 'ene', ñ: 'eñe', o: 'o', p: 'pe', q: 'cu', r: 'erre', s: 'ese',
  t: 'te', u: 'u', v: 'uve', w: 'uve doble', x: 'equis', y: 'i griega', z: 'zeta',
};
/** Losse letters die ook een Spaans woord zijn. */
const LETTER_WORDS = new Set(['a', 'e', 'o', 'u', 'y']);

const ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100 };
function romanValue(s) {
  if (!/^[IVXLC]+$/.test(s)) return null;
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]];
    n += v < (ROMAN[s[i + 1]] ?? 0) ? -v : v;
  }
  return n;
}
const ORDINALS = ['', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo'];

/** Woorden waarvoor een getal zijn telvorm houdt: "uno de mayo", niet "un de mayo". */
const NOT_NOUNS = new Set(['de', 'del', 'y', 'o', 'a', 'al', 'en', 'por', 'para', 'con', 'menos', 'más', 'que', 'es', 'son', 'veces']);
/** Mannelijke woorden op -a: "veintiún días", niet "veintiuna". */
const MASC_A = new Set(['día', 'días', 'mapa', 'mapas', 'problema', 'problemas', 'idioma', 'idiomas', 'tema', 'temas', 'programa', 'programas', 'clima', 'sistema', 'planeta', 'sofá']);

/** Een getal voluit, met "un"/"una" en "-cientas" naargelang het woord erna. */
function cardinal(n, next) {
  const nextWord = next?.toLowerCase();
  const noun = nextWord && /^\p{L}/u.test(nextWord) && !NOT_NOUNS.has(nextWord);
  if (!noun || n > 999999) return n > 999999 ? millions(n) : numberWords(n);
  let words = numberWords(n, { noun: true });
  if (/as?$/.test(nextWord) && !MASC_A.has(nextWord)) {
    words = words.replace(/\bun$/, 'una').replace(/veintiún$/, 'veintiuna').replace(/ientos\b/g, 'ientas');
  }
  return words;
}

function millions(n) {
  const m = Math.floor(n / 1e6);
  const rest = n % 1e6;
  const head = m === 1 ? 'un millón' : `${numberWords(m, { noun: true })} millones`;
  return rest ? `${head} ${numberWords(rest)}` : head;
}

/** Een getal zoals het in de tekst staat: 1875, 1.000, 2,5, 10. */
function numberToken(tok, next) {
  if (/^\d{1,3}(\.\d{3})+$/.test(tok)) return cardinal(Number(tok.replace(/\./g, '')), next);
  const dec = tok.match(/^(\d+),(\d+)$/);
  if (dec) return `${numberWords(Number(dec[1]))} coma ${dec[2].split('').map(d => numberWords(Number(d))).join(' ')}`;
  const time = tok.match(/^(\d{1,2}):(\d{2})$/);
  if (time) {
    const [h, m] = [Number(time[1]), Number(time[2])];
    const hour = h === 1 ? 'una' : numberWords(h);
    return m === 0 ? hour : m === 15 ? `${hour} y cuarto` : m === 30 ? `${hour} y media` : `${hour} y ${numberWords(m)}`;
  }
  const ord = tok.match(/^(\d+)\.?([ºª])$/);
  if (ord) {
    const w = ORDINALS[Number(ord[1])] ?? numberWords(Number(ord[1]));
    return ord[2] === 'ª' ? w.replace(/o$/, 'a') : w;
  }
  const n = Number(tok);
  return Number.isInteger(n) ? cardinal(n, next) : tok;
}

/* Symbolen die als woord gelezen worden. */
const SYMBOLS = { '€': 'euros', '%': 'por ciento', '&': 'y', '+': 'más', '@': 'arroba', '°': 'grados', $: 'dólares' };

/* Woord-, getal- en leestekentokens. Een woord mag een punt bevatten
 * (afkortingen), een getal een punt, komma of dubbelpunt in het midden. */
const TOKEN = /(\d+(?:[.,:]\d+)*\.?[ºª]|\d+(?:[.,:]\d+)*|[\p{L}\p{M}]+(?:['’.][\p{L}\p{M}]+)*\.?|[€%&+@°$]|[.,;:!?¡¿…«»"“”()—–-]+)/gu;
const PUNCT = /^[.,;:!?¡¿…«»"“”()—–-]+$/;

/**
 * Splitst een tekst in de stukken die je ziet, elk met wat er hardop
 * gezegd wordt.
 * @returns {{text: string, spoken: string|null, punct?: string}[]}
 *          spoken is null voor een leesteken; punct is dan wat de stem ermee
 *          doet: ',' (korte pauze), '.', '?', '!' of '' (niets).
 */
export function tokens(text) {
  const raw = [];
  // Afkortingen met spaties en schuine strepen eerst, ze vallen anders uiteen.
  const src = String(text ?? '').replace(/\bEE\.\s?UU\./g, 'EE.UU.').replace(/\b[Cc]\//g, 'C/ ');
  for (const m of src.matchAll(TOKEN)) raw.push(m[0]);

  const out = [];
  for (let i = 0; i < raw.length; i++) {
    let tok = raw[i];
    const nextTok = raw.slice(i + 1).find(t => !PUNCT.test(t));
    const prev = out.filter(o => o.spoken).at(-1)?.spoken?.split(' ').at(-1);

    if (PUNCT.test(tok)) {
      out.push({ text: tok, spoken: null, punct: punctFor(tok) });
      continue;
    }
    if (/^\d/.test(tok)) {
      out.push({ text: tok, spoken: numberToken(tok, nextTok) });
      continue;
    }
    if (SYMBOLS[tok]) {
      out.push({ text: tok, spoken: SYMBOLS[tok] });
      continue;
    }
    const lower = tok.toLowerCase();
    if (ABBREVIATIONS[lower] || (tok === 'C/' && ABBREVIATIONS['c/'])) {
      out.push({ text: tok, spoken: ABBREVIATIONS[lower] ?? ABBREVIATIONS['c/'] });
      continue;
    }
    // Een punt aan het eind die geen afkorting is, is een leesteken.
    if (tok.endsWith('.') && tok.length > 1) {
      raw.splice(i + 1, 0, '.');
      tok = tok.slice(0, -1);
    }
    out.push({ text: tok, spoken: wordToken(tok, prev) });
  }
  return out;
}

function punctFor(tok) {
  if (/[?]/.test(tok)) return '?';
  if (/[!]/.test(tok)) return '!';
  if (/[.…]/.test(tok)) return '.';
  if (/[,;:—–()]/.test(tok)) return ',';
  return '';
}

/** Eén woord uit de tekst, uitgeschreven. */
function wordToken(tok, prev) {
  const lower = tok.toLowerCase();
  // A2, B1: het niveau.
  const level = tok.match(/^([A-Za-z])(\d+)$/);
  if (level) return `${LETTER_NAMES[level[1].toLowerCase()]} ${numberWords(Number(level[2]))}`;
  // Romeinse cijfers: "siglo XX" → veinte, "Carlos V" → quinto.
  const roman = romanValue(tok);
  if (roman && (/^siglos?$/.test(prev ?? '') || tok.length > 1)) {
    return /^siglos?$/.test(prev ?? '') || roman > 10 ? numberWords(roman) : ORDINALS[roman];
  }
  // Losse hoofdletter: de M, señor X.
  if (/^\p{Lu}$/u.test(tok) && !LETTER_WORDS.has(lower)) return LETTER_NAMES[lower] ?? lower;
  if (/^\p{Lu}{2,}$/u.test(tok) && SPELLED.has(lower)) return [...lower].map(c => LETTER_NAMES[c] ?? c).join(' ');
  if (RESPELL[lower]) return RESPELL[lower];
  return lower.replace(/['’]/g, '');
}

/** De tekst zoals hij uitgesproken wordt: "Tengo 25 años." → "tengo veinticinco años". */
export const spoken = text => tokens(text).filter(t => t.spoken).map(t => t.spoken).join(' ');

/* ------------------------------------------------------------------ */
/* 2. Letters → klanken                                                 */
/* ------------------------------------------------------------------ */

const VOWEL = /[aeiouáéíóúü]/;
const FRONT = /[eiéí]/;
const ACCENTED = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };
const isVowelLetter = c => c != null && VOWEL.test(c);

/**
 * De klanken van één woord, vóór de lettergrepen.
 * Een klinker: {v: 'a', acc, weak, y}; een medeklinker: {c: 'b', letter}.
 * Een stomme h tussen twee klinkers wordt {gap: true}: geen tweeklank.
 */
function segments(word, espeak) {
  const w = word.normalize('NFC');
  const out = [];
  const at = i => w[i];
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    const next = at(i + 1);
    const prev = at(i - 1);

    if (ACCENTED[ch]) { out.push({ v: ACCENTED[ch], acc: true }); continue; }
    if ('aeo'.includes(ch)) { out.push({ v: ch }); continue; }
    if (ch === 'i') { out.push({ v: 'i', weak: true }); continue; }
    if (ch === 'ü') { out.push({ v: 'u', weak: true }); continue; }
    if (ch === 'u') {
      // que, qui, gue, gui: de u is stom.
      if ((prev === 'q' || prev === 'g') && FRONT.test(next ?? '')) continue;
      out.push({ v: 'u', weak: true });
      continue;
    }
    if (ch === 'y') {
      // Klinker aan het eind van een woord (hoy, muy) of als voegwoord.
      if (!isVowelLetter(next)) out.push({ v: 'i', weak: true, y: true });
      else out.push({ c: 'ʝ', letter: 'y' });
      continue;
    }
    if (ch === 'h') {
      // hielo, hierba: [ʝ]. Anders stom. Voor de stem blijft een h tussen
      // klinkers een lettergreepgrens (pro-hi-bi-do, zoals espeak het zegt).
      if (i === 0 && next === 'i' && isVowelLetter(at(i + 2))) { out.push({ c: 'ʝ', letter: 'hi', tts: 'j' }); i++; continue; }
      if (prev === 'c') continue;   // al verwerkt bij ch
      if (espeak && isVowelLetter(prev) && isVowelLetter(next)) out.push({ gap: true });
      continue;
    }
    switch (ch) {
      case 'b': case 'v': out.push({ c: 'b', letter: ch }); break;
      case 'c':
        if (next === 'h') { out.push({ c: 'tʃ', letter: 'ch' }); i++; }
        else if (FRONT.test(next ?? '')) out.push({ c: 'θ', letter: 'c' });
        else out.push({ c: 'k', letter: 'c' });
        break;
      case 'd': out.push({ c: 'd', letter: 'd' }); break;
      case 'f': out.push({ c: 'f', letter: 'f' }); break;
      case 'g':
        if (FRONT.test(next ?? '')) out.push({ c: 'x', letter: 'g' });
        else out.push({ c: 'ɡ', letter: 'g' });
        break;
      case 'j': out.push({ c: 'x', letter: 'j' }); break;
      case 'k': out.push({ c: 'k', letter: 'k' }); break;
      case 'l':
        if (next === 'l') { out.push(i + 2 >= w.length ? { c: 'l', letter: 'l' } : { c: 'ʎ', letter: 'll' }); i++; }
        else out.push({ c: 'l', letter: 'l' });
        break;
      case 'm': out.push({ c: 'm', letter: 'm' }); break;
      case 'n': out.push({ c: 'n', letter: 'n' }); break;
      case 'ñ': out.push({ c: 'ɲ', letter: 'ñ' }); break;
      case 'p':
        // psicólogo, pterodáctilo: de p is stom aan het begin.
        if (i === 0 && (next === 's' || next === 't')) break;
        out.push({ c: 'p', letter: 'p' });
        break;
      case 'q': out.push({ c: 'k', letter: 'q' }); break;
      case 'r':
        if (next === 'r') { out.push({ c: 'r', letter: 'rr' }); i++; }
        else if (i === 0 || 'lnsm'.includes(prev)) out.push({ c: 'r', letter: 'r' });
        else out.push({ c: 'ɾ', letter: 'r' });
        break;
      case 's': out.push({ c: 's', letter: 's' }); break;
      case 't':
        if (next === 'x') { out.push({ c: 'tʃ', letter: 'tx' }); i++; }
        else out.push({ c: 't', letter: 't' });
        break;
      case 'w': out.push({ c: 'w', letter: 'w', glide: true }); break;
      case 'x':
        if (i === 0) out.push({ c: 's', letter: 'x' });
        else { out.push({ c: 'k', letter: 'x' }); out.push({ c: 's', letter: 'x' }); }
        break;
      case 'z': out.push({ c: 'θ', letter: 'z' }); break;
      case 'ç': out.push({ c: 's', letter: 'ç' }); break;
      default:
        // Onbekende tekens (een vergeten ¨, een apostrof) zeggen we niet.
        break;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 3. Lettergrepen en klemtoon                                          */
/* ------------------------------------------------------------------ */

const ONSET_PAIRS = new Set(['pl', 'pɾ', 'bl', 'bɾ', 'tɾ', 'dɾ', 'kl', 'kɾ', 'ɡl', 'ɡɾ', 'fl', 'fɾ']);

/* espeak houdt na l of r een i/u vóór een andere klinker apart: ru-i-do,
 * Lu-is, lu-e-go, co-rri-en-do (een i na klinker + enkele l/r glijdt wel:
 * Ju-lio, Ma-rio). Zo is de stem getraind, dus zo krijgt ze het. De leerder
 * ziet de gewone tweeklank: [ˈlwe.ɣo]. */
const LR = new Set(['l', 'r', 'll', 'rr']);
function splitsAfterLR(segs, i) {
  const before = segs[i - 1];
  if (!before?.c || !LR.has(before.letter)) return false;
  if (segs[i].v === 'u') return true;
  const single = before.letter === 'l' || before.letter === 'r';
  return !(single && segs[i - 2]?.v);
}

/**
 * Verdeelt de klanken in lettergrepen.
 * @returns {{onset: object[], glide: string, nucleus: string, offglide: string,
 *            coda: object[], acc: boolean, nucleusAcc: boolean, unstressable: boolean}[]}
 *          onset en coda zijn medeklinkers uit segments()
 */
function syllabify(segs, espeak) {
  // Welke klinkers zijn kern, welke glijden?
  const runs = [];
  let run = null;
  segs.forEach((s, i) => {
    if (s.v) { (run ??= []).push(i); }
    else { if (run) runs.push(run); run = null; }
  });
  if (run) runs.push(run);

  const role = new Map();     // index -> 'nucleus' | 'glide' | 'offglide'
  const unstressable = new Set();   // de u van ru-i-do: krijgt nooit de klemtoon (Lu-is, cru-el)
  for (const r of runs) {
    const strong = i => !segs[i].weak || segs[i].acc;
    // Eerst alle sterke klinkers als kern.
    for (const i of r) if (strong(i)) role.set(i, 'nucleus');
    for (let k = 0; k < r.length; k++) {
      const i = r[k];
      if (role.has(i)) continue;
      const prevI = r[k - 1];
      const nextI = r[k + 1];
      const lrSplit = espeak && nextI != null && splitsAfterLR(segs, i);
      if (lrSplit) {
        // ru-i-do, in-clu-i-do: allebei een eigen lettergreep.
        role.set(i, 'nucleus');
        unstressable.add(i);
        if (segs[nextI].weak) role.set(nextI, 'nucleus');
      } else if (nextI != null && role.get(nextI) === 'nucleus') role.set(i, 'glide');
      else if (prevI != null && role.get(prevI) === 'nucleus') role.set(i, 'offglide');
      else if (nextI != null && segs[nextI].y && !segs[i].acc) {
        // muy, huy: de y glijdt achter de u.
        role.set(i, 'nucleus'); role.set(nextI, 'offglide'); k++;
      } else if (nextI != null) role.set(i, 'glide');   // fui, ciudad: de laatste is kern
      else role.set(i, 'nucleus');
    }
  }

  // Lettergrepen rond de kernen.
  const nuclei = segs.map((s, i) => (role.get(i) === 'nucleus' ? i : -1)).filter(i => i >= 0);
  if (!nuclei.length) {
    // Geen klinker (een losse medeklinker): één lettergreep zonder kern.
    return [{ onset: segs.filter(s => s.c), glide: '', nucleus: '', offglide: '', coda: [], acc: false }];
  }
  const syl = nuclei.map(i => ({
    onset: [], glide: '', nucleus: segs[i].v, offglide: '', coda: [], acc: !!segs[i].acc,
    nucleusAcc: !!segs[i].acc, unstressable: unstressable.has(i),
  }));
  // Glijklanken bij hun kern.
  nuclei.forEach((ni, k) => {
    for (let j = ni - 1; j >= 0 && role.get(j) === 'glide'; j--) syl[k].glide = segs[j].v + syl[k].glide;
    for (let j = ni + 1; j < segs.length && role.get(j) === 'offglide'; j++) {
      syl[k].offglide += segs[j].v;
      if (segs[j].acc) syl[k].acc = true;
    }
  });
  // Medeklinkers tussen de kernen.
  const consBetween = (from, to) => segs.slice(from, to).filter(s => s.c);
  const firstVowel = i => { let j = i; while (j > 0 && role.get(j - 1) === 'glide') j--; return j; };
  const lastVowel = i => { let j = i; while (j + 1 < segs.length && role.get(j + 1) === 'offglide') j++; return j; };

  syl[0].onset = consBetween(0, firstVowel(nuclei[0]));
  for (let k = 0; k < nuclei.length - 1; k++) {
    const between = consBetween(lastVowel(nuclei[k]) + 1, firstVowel(nuclei[k + 1]));
    const n = between.length;
    let split;   // aantal medeklinkers dat bij de vorige lettergreep blijft
    const pair = (a, b) => ONSET_PAIRS.has(a.c + b.c);
    if (n === 0) split = 0;
    else if (n === 1) split = 0;
    else if (n === 2) split = pair(between[0], between[1]) ? 0 : 1;
    else if (n === 3) split = pair(between[1], between[2]) ? 1 : 2;
    else split = n - 2;
    syl[k].coda = between.slice(0, split);
    syl[k + 1].onset = between.slice(split);
  }
  const last = syl.at(-1);
  const tail = consBetween(lastVowel(nuclei.at(-1)) + 1, segs.length);
  last.coda = tail;
  return syl;
}

/** Klemtoon volgens de regels: accent, anders voorlaatste bij klinker/n/s, anders laatste. */
function stressIndex(word, syl) {
  const marked = syl.findIndex(s => s.acc);
  if (marked >= 0) return marked;
  if (syl.length === 1) return 0;
  const i = /[aeiouns]$/.test(word) ? syl.length - 2 : syl.length - 1;
  if (!syl[i].unstressable) return i;
  // ba-rri-o → ˈbario, Lu-is → luˈis: naar de lettergreep ervoor, anders erna.
  return i > 0 && !syl[i - 1].unstressable ? i - 1 : Math.min(i + 1, syl.length - 1);
}

/** Woorden zonder eigen klemtoon (lidwoorden, voorzetsels, voegwoorden …), voor de klankschrift. */
const ATONIC = new Set([
  'el', 'la', 'los', 'las', 'lo', 'me', 'te', 'le', 'les', 'se', 'nos', 'os',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus',
  'a', 'al', 'de', 'del', 'en', 'con', 'sin', 'por', 'tras', 'para', 'entre', 'desde', 'hasta', 'hacia', 'ante',
  'sobre', 'bajo',
  'e', 'y', 'o', 'u', 'ni', 'aunque', 'pero', 'porque', 'que', 'cuando', 'cuanto', 'adonde', 'donde', 'como',
  'quien', 'quienes', 'mientras', 'si',
]);
/** Na een lidwoord zijn dit zelfstandige naamwoorden met klemtoon: el sobre, un bajo. */
const NOUN_AFTER_ARTICLE = new Set(['sobre', 'bajo']);
const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas']);

/** De onbeklemtoonde woorden van espeak (es_list, $u), zoals de stem ze kent. */
const ATONIC_TTS = new Set([
  'el', 'los', 'la', 'las', 'lo', 'me', 'te', 'le', 'les', 'se', 'nos', 'os',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestros', 'nuestra', 'nuestras',
  'vuestro', 'vuestros', 'vuestra', 'vuestras',
  'a', 'al', 'de', 'del', 'en', 'con', 'sin', 'por', 'tras', 'ante', 'para', 'entre', 'sobre', 'bajo',
  'desde', 'hasta', 'hacia', 'e', 'y', 'o', 'u', 'aunque', 'pero', 'porque', 'que', 'cuando', 'cuanto',
  'adonde', 'donde', 'como', 'quien', 'quienes', 'mientras', 'si',
]);

/**
 * Een woord in lettergrepen met klemtoon.
 * @param espeak volg de lettergreepgrenzen van espeak (voor de stem)
 */
function analyzeWord(word, espeak = false) {
  const w = word.toLowerCase();
  // -mente: twee klemtonen, die van het bijvoeglijk naamwoord en die van -men-.
  const mente = w.match(/^(.*[aeiouáéíóú].*[aeiouáéíóú].*)mente$/);
  if (mente && w.length > 6) {
    const stem = analyzeWord(mente[1], espeak);
    const tail = analyzeWord('mente', espeak);
    stem.syllables.forEach((s, i) => { s.stress = i === stem.primary ? 2 : 0; });
    const offset = stem.syllables.length;
    // espeak schrijft -mente voluit als m'e/nte: geen [ɛ] daar.
    tail.syllables.forEach((s, i) => { s.stress = i === 0 ? 1 : 0; s.plainE = true; });
    return {
      word: w, syllables: [...stem.syllables, ...tail.syllables], primary: offset, stemPrimary: stem.primary,
      segs: [...stem.segs, ...tail.segs],
    };
  }
  const segs = segments(w, espeak);
  const syllables = syllabify(segs, espeak);
  const primary = stressIndex(w, syllables);
  syllables.forEach((s, i) => { s.stress = i === primary ? 1 : 0; });
  return { word: w, syllables, primary, segs };
}

/* ------------------------------------------------------------------ */
/* 4. Klanken in hun omgeving                                           */
/* ------------------------------------------------------------------ */

const NASAL = new Set(['m', 'n', 'ŋ', 'ɲ']);
const SOFT = { b: 'β', d: 'ð', ɡ: 'ɣ' };

/**
 * Vult de klanken in voor een rij woorden die zonder pauze na elkaar komen:
 * de zachte b/d/g en de n hangen af van de buren, ook over woordgrenzen.
 * @param words analyzeWord()-resultaten
 * @param mode  'ipa' (de leerder) of 'tts' (de stem, espeak-stijl)
 * @returns per woord, per lettergreep {stress, parts}
 */
function realize(words, mode) {
  const tts = mode === 'tts';
  const flat = [];
  words.forEach((w, wi) => {
    w.syllables.forEach((s, si) => {
      const push = (p, kind, seg) => flat.push({ p, kind, wi, si, seg, acc: s.nucleusAcc || s.plainE });
      s.onset.forEach(c => push(c.c, 'onset', c));
      for (const g of s.glide) push(g, 'glide');
      if (s.nucleus) push(s.nucleus, 'nucleus');
      for (const g of s.offglide) push(g, 'offglide');
      s.coda.forEach(c => push(c.c, 'coda', c));
    });
  });

  for (let i = 0; i < flat.length; i++) {
    const x = flat[i];
    const prev = flat[i - 1];
    const next = flat[i + 1];
    const vowelish = y => y && (y.kind === 'nucleus' || y.kind === 'glide' || y.kind === 'offglide');
    const sameWord = y => y && y.wi === x.wi;
    const nextLetter = next?.seg?.letter ?? '';

    if (SOFT[x.p]) {
      const afterNasal = prev && NASAL.has(prev.p);
      if (tts) {
        // espeak: zacht na alles behalve het begin en een neusklank, als er een
        // klinker, r of l volgt (de d ook vóór j, maar niet vóór w), of een f, j, r, s, y, z.
        const nextOk = (vowelish(next) && !(x.p === 'd' && next.kind === 'glide' && next.p === 'u'))
          || ['ɾ', 'r', 'l'].includes(next?.p) || /^[fjrsyz]$/.test(nextLetter);
        const finalD = x.p === 'd' && x.kind === 'coda' && !sameWord(next) && !vowelish(next);
        if (prev && !afterNasal && nextOk && !finalD) x.p = SOFT[x.p];
      } else if (prev && !afterNasal && !(x.p === 'd' && prev.p === 'l')) {
        // Leerboekregel: hard na een pauze of neusklank (en d na l), anders zacht.
        x.p = SOFT[x.p];
      }
    }

    // De n neemt de plaats van de volgende medeklinker over.
    if (x.p === 'n' && next && !vowelish(next)) {
      if (tts) {
        const first = nextLetter[0];
        if ('bvp'.includes(first) || (first === 'f' && ['l', 'ɾ'].includes(flat[i + 2]?.p))) x.p = 'm';
        else if ('gk'.includes(first) || (first === 'j' && sameWord(next))) x.p = 'ŋ';
      } else if (['b', 'p', 'm', 'β'].includes(next.p)) x.p = 'm';
      else if (['k', 'ɡ', 'x', 'ɣ'].includes(next.p)) x.p = 'ŋ';
    }

    if (tts) {
      // Een medeklinker op het eind van de lettergreep, met nog een medeklinker erna in hetzelfde woord.
      if (x.kind === 'coda' && sameWord(next) && !vowelish(next)) x.closed = true;
      // espeak rekt de p vóór een t: septiembre → sepːtjˈembɾe.
      if (x.p === 'p' && next?.p === 't' && sameWord(next)) x.p = 'pː';
      // hielo → jˈelo
      if (x.seg?.tts) x.p = x.seg.tts;
      // "Muy bien. Yo …", "están yendo": na een n klinkt de y als dʒ.
      if (x.seg?.letter === 'y' && x.p === 'ʝ' && prev && !sameWord(prev) && NASAL.has(prev.p) && words[x.wi].syllables[0] === words[x.wi].syllables[x.si]) x.p = 'dʒ';
    }
  }

  const out = words.map(w => w.syllables.map(s => ({ stress: s.stress, parts: [] })));
  for (const x of flat) out[x.wi][x.si].parts.push(x);
  return out;
}

/** Glijklanken: [j w] in de klankschrift; in espeak-stijl aɪ, aʊ, eɪ, eʊ, oɪ, ow, uj, en ái/éi met accent. */
function glideSymbol(x, nucleus, mode) {
  if (x.kind === 'glide' || mode !== 'tts') return x.p === 'i' ? 'j' : 'w';
  if (x.acc) return x.p;   // estáis → estˈais
  if (x.p === 'i') return nucleus === 'u' || nucleus === 'i' ? 'j' : 'ɪ';
  return nucleus === 'o' ? 'w' : 'ʊ';
}

/** Een lettergreep als tekst. */
function sylText(parts, mode, mark) {
  const nucleus = parts.find(p => p.kind === 'nucleus');
  // espeak: een beklemtoonde e zonder accentteken vóór n + medeklinker is [ɛ].
  const open = mode === 'tts' && mark === 'ˈ' && nucleus?.p === 'e' && !nucleus.acc
    && !parts.some(p => p.kind === 'offglide')
    && parts[parts.indexOf(nucleus) + 1]?.seg?.letter === 'n' && parts[parts.indexOf(nucleus) + 1]?.closed;
  let s = '';
  for (const x of parts) {
    if (x.kind === 'glide' || x.kind === 'offglide') s += glideSymbol(x, nucleus?.p, mode);
    else if (x.kind === 'nucleus') s += (mode === 'tts' ? mark : '') + (open ? 'ɛ' : x.p);
    else s += x.p;
  }
  return (mode === 'tts' ? '' : mark) + s;
}

/** Het klemteken van elke lettergreep van een woord. */
function marks(a, word, mode, { clauseFinal = false, prevWord = null } = {}) {
  const n = a.syllables.length;
  if (mode === 'tts') {
    // espeak beklemtoont een klemtoonloos woord toch aan het eind van een zinsdeel: "alérgico a".
    const atonic = ATONIC_TTS.has(word) && !clauseFinal;
    const P = a.stemPrimary ?? a.primary;
    return a.syllables.map((s, i) => {
      if (atonic) return n > 1 && s.stress ? 'ˌ' : '';
      if (s.stress) return 'ˈ';
      // Bijklemtoon zoals espeak: op de 1e, 3e … lettergreep, minstens twee vóór de klemtoon.
      return i <= P - 2 && i % 2 === 0 && !s.unstressable ? 'ˌ' : '';
    });
  }
  const atonic = ATONIC.has(word) && !(NOUN_AFTER_ARTICLE.has(word) && ARTICLES.has(prevWord));
  return a.syllables.map(s => (atonic ? '' : s.stress === 1 ? 'ˈ' : s.stress === 2 ? 'ˌ' : ''));
}

/* ------------------------------------------------------------------ */
/* 5. Uitvoer                                                           */
/* ------------------------------------------------------------------ */

/**
 * De volledige analyse: per getoond stuk tekst de klanken.
 * @param mode 'ipa', 'tts' of 'both'
 * @returns {{text: string, spoken: string|null, punct?: string, ipa: string, tts: string}[]}
 */
export function analyze(text, { mode = 'both' } = {}) {
  const toks = tokens(text);
  const words = [];
  toks.forEach((t, ti) => {
    if (t.spoken == null) return;
    const list = t.spoken.split(' ').filter(Boolean);
    list.forEach((w, k) => {
      const last = k === list.length - 1;
      const after = toks.slice(ti + 1).find(x => x.spoken != null || x.punct);
      words.push({
        tok: t, word: w, a: { ipa: analyzeWord(w), tts: analyzeWord(w, true) },
        // Laatste woord van een zin (niet van een zinsdeel: na een komma telt het niet).
        clauseFinal: last && (!after || (after.spoken == null && after.punct !== ',' && after.punct !== '')),
        pauseAfter: last && after?.spoken == null && Boolean(after),
      });
    });
  });

  for (const m of mode === 'both' ? ['ipa', 'tts'] : [mode]) {
    // De leerder pauzeert bij elk leesteken; espeak leest de hele tekst als één stroom.
    const groups = [];
    let g = [];
    for (const w of words) {
      g.push(w);
      if (m === 'ipa' && w.pauseAfter) { groups.push(g); g = []; }
    }
    if (g.length) groups.push(g);
    for (const grp of groups) {
      const real = realize(grp.map(x => x.a[m]), m);
      grp.forEach((x, i) => {
        const mk = marks(x.a[m], x.word, m, { clauseFinal: x.clauseFinal, prevWord: grp[i - 1]?.word });
        const sylls = real[i].map((s, k) => sylText(s.parts, m, mk[k]));
        x[m] = m === 'ipa' ? sylls.join('.') : sylls.join('');
      });
    }
  }

  return toks.map(t => {
    const ws = words.filter(w => w.tok === t);
    return { ...t, ipa: ws.map(w => w.ipa ?? '').join(' '), tts: ws.map(w => w.tts ?? '').join(' ') };
  });
}

/** Klankschrift voor de leerder: "¿Cómo te llamas?" → "[ˈko.mo te ˈʎa.mas]". */
export function ipa(text) {
  const parts = [];
  for (const t of analyze(text, { mode: 'ipa' })) {
    if (t.spoken != null) { parts.push(t.ipa); continue; }
    const mark = t.punct === ',' ? '|' : t.punct ? '‖' : null;
    if (!mark || !parts.length) continue;
    // Twee pauzes na elkaar ("? —"): de langste telt.
    if (/^[|‖]$/.test(parts.at(-1))) { if (mark === '‖') parts[parts.length - 1] = mark; }
    else parts.push(mark);
  }
  while (parts.length && /^[|‖]$/.test(parts.at(-1))) parts.pop();
  return parts.length ? `[${parts.join(' ')}]` : '';
}

/** Klankschrift per getoond woord, voor onder de woorden van een zin. Leestekens krijgen null. */
export const ipaWords = text => analyze(text, { mode: 'ipa' }).map(t => ({ text: t.text, ipa: t.spoken == null ? null : t.ipa }));

/**
 * Wat de stem moet zeggen, per zin, in espeak-stijl: "kˈomo te ʎˈamas?".
 * @returns {string[]} één string per zin
 */
export function phonemes(text) {
  const sentences = [];
  let cur = '';
  for (const t of analyze(text, { mode: 'tts' })) {
    if (t.spoken != null) {
      if (t.tts) cur += (cur && !cur.endsWith(' ') ? ' ' : '') + t.tts;
      continue;
    }
    if (!cur.trim()) continue;
    if (t.punct === ',') cur = `${cur.trimEnd()}, `;
    else if (t.punct) {
      sentences.push(cur.trimEnd() + t.punct);
      cur = '';
    }
  }
  if (cur.trim()) sentences.push(cur.trim());
  return sentences.map(s => s.replace(/,\s*$/, '.'));
}
