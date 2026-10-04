/* Antwoordcontrole: vergevingsgezind, maar corrigeert wel.
 *
 * De volgorde is belangrijk. Een exacte match telt als "juist" zonder opmerking;
 * een match die alleen op accenten of op één typefout verschilt telt óók als
 * juist, maar toont de correcte schrijfwijze. Zo leer je canción schrijven
 * zonder afgestraft te worden door een telefoontoetsenbord. */

const ARTICLES = ['de', 'het', 'een', 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', "'t"];

/* Het Spaanse lidwoord draagt geslacht en getal: dát moet je leren. "una mano"
 * voor "la mano" is dus goed (zelfde geslacht), "el mano" niet. De Nederlandse
 * lidwoorden blijven vergevingsgezind. */
const ES_GENDER = {
  el: 'm', un: 'm', los: 'mp', unos: 'mp',
  la: 'f', una: 'f', las: 'fp', unas: 'fp',
};

const COMBINING = /[̀-ͯ]/g;
const N_TILDE = /ñ/g;          // ñ na NFD-decompositie
const SENTINEL = '\u0000';     // als escape: een echte NUL maakt het bestand "binair" voor git

/** Kleinletters, spaties genormaliseerd, rechte aanhalingstekens. Leestekens
 *  die niemand op een gsm intypt (¿ ¡ , ; : …) tellen niet mee. */
export function normalize(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…|\.\.\./g, ' ')
    .replace(/[¿¡,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]+$/, '')
    .trim();
}

/** Verwijdert diakritische tekens, maar behoudt de ñ — die is een eigen letter.
 *  año en ano zijn verschillende woorden: dat mag geen "accentfoutje" heten. */
export function stripAccents(s) {
  return s
    .normalize('NFD')
    .replace(N_TILDE, SENTINEL)   // zet de ñ even opzij
    .replace(COMBINING, '')       // weg met de overige accenten
    .replace(new RegExp(SENTINEL, 'g'), 'ñ');
}

/** Haalt één voorafgaand lidwoord weg: "de das" en "das" zijn beide goed. */
export function stripArticle(s) {
  const parts = s.split(' ');
  if (parts.length > 1 && ARTICLES.includes(parts[0])) return parts.slice(1).join(' ');
  return s;
}

const leadingArticle = s => {
  const first = s.split(' ')[0];
  return s.includes(' ') && ARTICLES.includes(first) ? first : null;
};

/* ------------------------------------------------------------------ */
/* Notatie in de woordenlijst                                          */
/* ------------------------------------------------------------------ */

/* Een vrouwelijke uitgang na een schuine streep: sencillo/-a, alemán/-ana,
 * español/a, varios/as. Wat na de streep staat is geen apart woord. */
const SUFFIX = /^-?(a|as|ana|esa)$/;

function feminine(base, suffix) {
  if (suffix.length >= 3) return base.slice(0, -2) + suffix;         // alemán → alemana
  if (suffix === 'as' && base.endsWith('os')) return base.slice(0, -2) + 'as';
  if (suffix === 'a' && /[oe]$/.test(base)) return base.slice(0, -1) + 'a';  // este → esta
  return base + suffix;                                               // español → española
}

/** "el / la" + "experto/-a": een vrouwelijk lidwoord hoort bij de vrouwelijke vorm. */
const FEM_ARTICLE = /^(la|las|una|unas) /;
const MASC_ARTICLE = /^(el|los|un|unos) /;

/** Losse schuine strepen tussen woorden: "hacer / sacar / tomar fotos", "ir al
 *  cine / al teatro". Een kort stuk vervangt de eerste (of laatste) woorden van
 *  het langste stuk. */
function splitAlternatives(s) {
  const parts = s.split(/\s+\/\s+/).map(p => p.trim()).filter(Boolean);
  if (parts.length < 2) return [s];
  const words = parts.map(p => p.split(' '));
  const longest = words.reduce((m, w, i) => (w.length > words[m].length ? i : m), 0);
  const base = words[longest];
  return words.map((w, i) => {
    // Begint het korte stuk met hetzelfde woord, dan is het een volledig
    // alternatief: "ver películas / ver la tele".
    if (w.length >= base.length || w[0] === base[0]) return w.join(' ');
    return (i < longest ? [...w, ...base.slice(w.length)] : [...base.slice(0, base.length - w.length), ...w]).join(' ');
  });
}

/** Aan elkaar geschreven: "sencillo/-a" of "hij/zij". */
function expandSlashes(s) {
  const m = s.match(/([\p{L}]+)\/([-\p{L}]+)/u);
  if (!m) return [s];
  const [whole, left, right] = m;
  const at = m.index;
  const swap = w => s.slice(0, at) + w + s.slice(at + whole.length);
  const pair = SUFFIX.test(right)
    ? [swap(left), swap(feminine(left, right.replace(/^-/, '')))]
    : [swap(left), swap(right)];
  // Bij "la experto/-a" hoort enkel de vrouwelijke vorm.
  const options = SUFFIX.test(right)
    ? (FEM_ARTICLE.test(s) ? [pair[1]] : MASC_ARTICLE.test(s) ? [pair[0]] : pair)
    : pair;
  return options.flatMap(expandSlashes);
}

/** Tussen haakjes staat wat mag, niet moet: "el frigo(rífico)", "aburrir(se)". */
function expandParens(s) {
  const m = s.match(/\(([^()]*)\)/);
  if (!m) return [s];
  const tidy = x => x.replace(/\s+/g, ' ').trim();
  const withIt = s.slice(0, m.index) + m[1] + s.slice(m.index + m[0].length);
  const without = s.slice(0, m.index) + s.slice(m.index + m[0].length);
  return [...expandParens(tidy(withIt)), ...expandParens(tidy(without))];
}

/**
 * Alle schrijfwijzen die een woordenlijstnotatie toelaat. De eerste is de
 * volledigste (mét wat tussen haakjes staat, mannelijk eerst): die is geschikt
 * om uit te spreken.
 *   "el frigo(rífico)"     → el frigorífico, el frigo
 *   "el / la experto/-a"   → el experto, la experta
 *   "(zich) wassen"        → zich wassen, wassen
 */
export function expandVariants(s) {
  const text = String(s ?? '').trim();
  if (!/[/()]/.test(text)) return [text];
  const out = splitAlternatives(text)
    .flatMap(expandParens)
    .flatMap(expandSlashes)
    .map(x => x.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return [...new Set(out)];
}

/** Wat de spraaksynthese moet zeggen: geen schuine strepen of haakjes. */
export const speakable = s => expandVariants(s)[0] ?? '';

/* ------------------------------------------------------------------ */
/* Woorden die bestaan                                                 */
/* ------------------------------------------------------------------ */

/* Alle woorden uit de cursus, zonder lidwoord en zonder accenten. Een antwoord
 * dat zelf een bestaand woord is, is geen typefout maar een ander woord:
 * "gorra" voor "gorro", "tonijn" voor "konijn". data.init() vult dit. */
let lexicon = new Set();

export const lexiconKey = s => stripAccents(stripArticle(normalize(s)));

export function setLexicon(words) {
  lexicon = new Set();
  for (const w of words) for (const v of expandVariants(w)) lexicon.add(lexiconKey(v));
}

/** Levenshtein met vroege afbreking zodra de afstand groter wordt dan max. */
export function levenshtein(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Vergelijkt een antwoord met alle aanvaarde vormen.
 *
 * @param input      wat de gebruiker typte
 * @param accepted   string of lijst; de eerste is de canonieke vorm
 * @param opts.strictAccents  accenten moeten exact kloppen
 * @param opts.ignoreAccents  accenten tellen helemaal niet mee, ook niet als
 *        "bijna". Voor Nederlandse antwoorden: daar zijn ze geen leerstof,
 *        en zonnecreme is evengoed als zonnecrème.
 * @param opts.rejectNear     vormen die nooit als typfout mogen doorgaan.
 *        Cruciaal bij vervoegingen: "tuvo" ligt één letter van "tuve", maar is
 *        een andere persoon — dat aanvaarden zou de verkeerde vorm aanleren.
 * @returns {{correct: boolean, almost?: boolean, expected: string, note: string|null}}
 *   almost (en note) is gezet wanneer het antwoord aanvaard is maar niet perfect gespeld.
 */
export function checkAnswer(input, accepted, { strictAccents = false, ignoreAccents = false, rejectNear = [] } = {}) {
  const list = (Array.isArray(accepted) ? accepted : [accepted]).filter(Boolean);
  const canonical = list[0] ?? '';
  const given = normalize(input);

  if (!given) return { correct: false, expected: canonical, note: null };

  // Elke aanvaarde vorm in twee smaken: mét en zonder lidwoord. `art` onthoudt
  // welk lidwoord er af ging, zodat "el mano" niet stiekem als "mano" doorgaat.
  const variants = [];
  for (const a of list) {
    // De notatie zelf telt ook: wie "francés/-esa" overneemt zoals het in de
    // woordenlijst staat, heeft het niet fout.
    for (const x of new Set([a, ...expandVariants(a)])) {
      const n = normalize(x);
      variants.push({ s: n, art: null, full: x });
      const art = leadingArticle(n);
      if (art) variants.push({ s: stripArticle(n), art, full: x });
    }
  }

  const tries = [{ s: given, art: null }];
  const givenArt = leadingArticle(given);
  if (givenArt) tries.push({ s: stripArticle(given), art: givenArt });

  let wrongArticle = false;
  const clash = (t, v) => t.art && v.art && ES_GENDER[t.art] && ES_GENDER[v.art]
    && ES_GENDER[t.art] !== ES_GENDER[v.art];
  // De vorm die het antwoord benaderde: bij "zonnecreme" is dat zonnecrème,
  // niet de eerste vertaling in de lijst.
  let matched = canonical;
  const find = same => {
    for (const t of tries) {
      for (const v of variants) {
        if (!same(t.s, v.s)) continue;
        if (clash(t, v)) { wrongArticle = true; continue; }
        matched = v.full;
        return true;
      }
    }
    return false;
  };

  // 1 — exact
  if (find((a, b) => a === b)) return { correct: true, expected: canonical, note: null };

  // 2 — alleen accenten verschillen
  const sameLetters = (a, b) => stripAccents(a) === stripAccents(b);
  if (ignoreAccents && find(sameLetters)) return { correct: true, expected: canonical, note: null };
  if (!strictAccents && find(sameLetters)) {
    return { correct: true, almost: true, expected: canonical, note: `¡Casi! Let op de accenten: ${matched}` };
  }

  // 3 — één typefout. Overgeslagen zodra het antwoord zelf een geldige andere
  //     vorm is (rejectNear) of een ander woord uit de cursus: dan is het een
  //     vergissing, geen typefout.
  const blocked = rejectNear.map(normalize);
  const isOtherRealForm = tries.some(t => blocked.includes(t.s) || lexicon.has(lexiconKey(t.s)));

  if (!isOtherRealForm) {
    // Een verschil dat enkel uit accenten bestaat is geen typefout. Stap 2
    // heeft het al beoordeeld; hier doorlaten zou strictAccents uithollen.
    // Onder de 5 letters is één afwijking te vaak een écht ander woord.
    const typo = (a, b) => stripAccents(a) !== stripAccents(b)
      && b.length >= 5 && levenshtein(stripAccents(a), stripAccents(b), 1) <= 1;
    if (find(typo)) return { correct: true, almost: true, expected: canonical, note: `¡Casi! Typfoutje, juist is: ${matched}` };
  }

  if (wrongArticle) {
    return { correct: false, expected: canonical, note: `Let op het lidwoord: ${canonical}` };
  }
  return { correct: false, expected: canonical, note: null };
}
