/* Indexeert window.COURSE en levert de bouwstenen waar de rest mee werkt.
 * Een "oefenitem" is een atoom plus een richting: woordenschat wordt in twee
 * richtingen los bijgehouden, want een woord herkennen is iets anders dan het
 * kunnen produceren. */

import { itemKey } from './scheduler.js';
import { setLexicon, expandVariants, normalize, stripArticle, stripAccents, lexiconKey, levenshtein, speakable } from './check.js';

let course = null;
let sources = {};
const byId = new Map();
const byTheme = new Map();
const themeById = new Map();
const byText = new Map();          // tekst-id -> dialoogregels, op volgorde
const byFamily = new Map();        // werkwoord|tijd -> vervoegingen
const byVerb = new Map();          // werkwoord -> alle vervoegde vormen
const byGloss = new Map();         // Nederlandse vertaling -> woordenschatatomen
const byEs = new Map();            // Spaans woord (lexiconKey) -> woordenschatatomen

export function init() {
  course = window.COURSE;
  if (!course) throw new Error('data/course.js is niet geladen');
  // Bronvermelding is een extra: zonder dat bestand werkt de app gewoon door.
  sources = window.SOURCES ?? {};

  for (const theme of course.themes) themeById.set(theme.id, theme);
  for (const atom of course.atoms) {
    byId.set(atom.id, atom);
    // `also`: examenthema's die naar dit atoom verwijzen. Het atoom blijft in
    // zijn eigen thema; afleiders komen dus nog altijd van daar.
    for (const theme of [atom.theme, ...(atom.also ?? [])]) {
      if (!byTheme.has(theme)) byTheme.set(theme, []);
      byTheme.get(theme).push(atom);
    }
    if (atom.kind === 'dialogue') {
      if (!byText.has(atom.text)) byText.set(atom.text, []);
      byText.get(atom.text).push(atom);
    }
    if (atom.kind === 'conjugation') {
      const key = `${atom.verb}|${atom.tense}`;
      if (!byFamily.has(key)) byFamily.set(key, []);
      byFamily.get(key).push(atom);
      if (!byVerb.has(atom.verb)) byVerb.set(atom.verb, new Set());
      byVerb.get(atom.verb).add(atom.form);
    }
    if (atom.kind === 'vocab') {
      for (const g of glossKeys(atom)) {
        if (!byGloss.has(g)) byGloss.set(g, []);
        byGloss.get(g).push(atom);
      }
      for (const v of new Set(expandVariants(atom.es).map(lexiconKey))) {
        if (!byEs.has(v)) byEs.set(v, []);
        byEs.get(v).push(atom);
      }
    }
  }
  for (const lines of byText.values()) lines.sort((a, b) => a.line - b.line);
  // Alle bestaande woorden en vormen: een antwoord dat één daarvan is, mag
  // nooit als typefout voor een ander woord doorgaan.
  setLexicon(course.atoms.flatMap(a =>
    a.kind === 'vocab' ? [a.es, ...a.nl] : a.kind === 'conjugation' ? [a.form] : []));
  return course;
}

export const getCourse = () => course;
export const getAtom = id => byId.get(id);
export const atomsForTheme = themeId => byTheme.get(themeId) ?? [];
export const allAtoms = () => course.atoms;
export const getTheme = id => themeById.get(id);

/** Leestekst of dialoog (titel, tekst) waar een atoom naar verwijst. */
export const getText = id => course.texts?.[id] ?? null;

/** Alle regels van een dialoog, in volgorde. */
export const dialogueLines = textId => byText.get(textId) ?? [];

/* Vervoegingen krijgen de uitleg van hun tijd. */
const TENSE_GRAMMAR = {
  presente: 'gr.presente', indefinido: 'gr.indefinido', imperfecto: 'gr.imperfecto',
  perfecto: 'gr.perfecto', futuro: 'gr.futuro', condicional: 'gr.condicional',
  continuo: 'gr.gerundio', subjuntivo: 'gr.subjuntivo',
};

/** De grammatica-uitleg bij dit atoom, of null. */
export function grammarFor(atom) {
  const key = atom.grammarRef ?? (atom.kind === 'conjugation' ? TENSE_GRAMMAR[atom.tense] : null);
  return (key && course.grammar?.[key]) || null;
}

/** Is dit atoom een werkwoord? Vervoegingen altijd, woordenschat volgens de
 *  woordsoort die in de data staat. */
export const isVerb = atom =>
  atom.kind === 'conjugation' || atom.kind === 'verbType' || (atom.kind === 'vocab' && atom.pos === 'verb');

/** Het werkwoord waar dit atoom over gaat, voor het tellen van unieke vormen. */
const verbOf = atom => atom.verb ?? atom.es;

/**
 * Hoeveel valt er in dit thema te leren, en waarin tel je dat.
 *
 * Een werkwoordenthema telt in werkwoorden, niet in oefeningen: "506 woorden"
 * voor vier tijden van dertig werkwoorden zegt niets over hoeveel je moet
 * kennen. Liedjesregels tellen niet mee, die worden niet geoefend.
 */
export function countForThemes(themeIds) {
  const atoms = themeIds.flatMap(id => byTheme.get(id) ?? []).filter(a => a.kind !== 'lyric');
  if (atoms.length && atoms.every(isVerb)) {
    return { count: new Set(atoms.map(verbOf)).size, noun: 'werkwoorden' };
  }
  // Een toets of een reeks zinnen telt in oefeningen, niet in woorden.
  if (atoms.length && !atoms.some(a => a.kind === 'vocab')) {
    return { count: atoms.length, noun: atoms.length === 1 ? 'oefening' : 'oefeningen' };
  }
  return { count: atoms.length, noun: 'woorden' };
}

export const countFor = themeId => countForThemes([themeId]);

/**
 * Thema's gebundeld per onderwerp — voedt de startpagina.
 *
 * Bewust niet per unidad: in welk hoofdstuk een woord toevallig stond helpt
 * je niet bij het kiezen van wat je wil leren, het onderwerp wel.
 */
export function tree() {
  return course.groups
    .map(group => ({
      ...group,
      themes: course.themes
        .filter(t => t.group === group.id)
        .map(t => ({ ...t, ...countFor(t.id) }))
        .filter(t => t.count > 0),
    }))
    .filter(g => g.themes.length > 0);
}

/**
 * Zet atomen om in oefenitems. Woordenschat levert er twee (nl→es en es→nl),
 * al de rest levert er één.
 *
 * Liedjesregels vallen af: ze staan in de cursus om mee te zingen, niet om
 * woord voor woord te kennen, en als oefening leveren ze vooral frustratie op.
 */
export function itemsFor(atoms) {
  const items = [];
  for (const atom of atoms) {
    if (atom.kind === 'lyric') continue;
    if (atom.kind === 'vocab') {
      items.push({ atomId: atom.id, direction: 'nl2es', key: itemKey(atom.id, 'nl2es'), atom });
      items.push({ atomId: atom.id, direction: 'es2nl', key: itemKey(atom.id, 'es2nl'), atom });
    } else {
      items.push({ atomId: atom.id, direction: null, key: itemKey(atom.id), atom });
    }
  }
  return items;
}

/** Alle oefensleutels van een thema — voor het beheersingsbalkje. */
export function keysForTheme(themeId) {
  return itemsFor(atomsForTheme(themeId)).map(i => i.key);
}

/**
 * Waar dit atoom vandaan komt, in woorden: boek, hoofdstuk en pagina.
 * De scanbestandsnaam in `src` zegt een cursist niets; die vertalen we via
 * data/sources.js. Een atoom kan uit meerdere scans komen — dan volstaat de
 * eerste, want die is altijd de plek waar het woord echt behandeld wordt.
 */
export function sourceLabel(atom) {
  if (atom.srcLabel) return atom.srcLabel;
  const file = atom.src?.split(';')[0].trim();
  const s = file && sources[file];
  if (!s) return null;
  return [s.book, s.chapter, s.page ? `p. ${s.page}` : null].filter(Boolean).join(' · ');
}

/* --- hulpstukken voor de oefentypes --- */

/** Een vertaling zonder lidwoord, hoofdletters of accenten: "de koelkast" = "koelkast". */
const glossKey = s => stripAccents(stripArticle(normalize(s)));
const glossCache = new WeakMap();
function glossKeys(atom) {
  let keys = glossCache.get(atom);
  if (!keys) {
    keys = [...new Set((atom.nl ?? []).flatMap(expandVariants).map(glossKey).filter(Boolean))];
    glossCache.set(atom, keys);
  }
  return keys;
}

/**
 * Woorden met een vertaling gemeen: la nevera, el frigo(rífico) en la
 * refrigeradora zijn allemaal "de koelkast". Wie er een van intypt heeft het
 * niet fout, en als afleider zou zo'n woord een tweede juist antwoord zijn.
 */
export function synonymsOf(atom, { gloss = null } = {}) {
  if (atom.kind !== 'vocab') return [];
  // Met `gloss` enkel de woorden voor díé vertaling: wie "nog" ziet staan en
  // "aún" typt voor "todavía" heeft gelijk, maar niet met een woord dat alleen
  // een tweede betekenis deelt.
  const keys = gloss ? expandVariants(gloss).map(glossKey) : glossKeys(atom);
  const out = new Set();
  for (const g of keys) for (const o of byGloss.get(g) ?? []) if (o.id !== atom.id) out.add(o);
  return [...out];
}

/** Delen deze twee woorden een vertaling? */
export const shareGloss = (a, b) => {
  const keys = new Set(glossKeys(a));
  return glossKeys(b).some(k => keys.has(k));
};

let byForm = null;
/** De vervoegingen die precies deze vorm hebben ("habla" → hablar, presente, 3s). */
export function conjugationsOfForm(form) {
  if (!byForm) {
    byForm = new Map();
    for (const a of course.atoms) {
      if (a.kind !== 'conjugation') continue;
      const k = a.form.toLowerCase();
      if (!byForm.has(k)) byForm.set(k, []);
      byForm.get(k).push(a);
    }
  }
  return byForm.get(String(form).toLowerCase()) ?? [];
}

/** Alle vervoegde vormen van een werkwoord, over alle tijden heen. */
export const verbForms = verb => [...(byVerb.get(verb) ?? [])];

/** Het gevraagde antwoord voor een woordenschatitem, als lijst. */
export function vocabAnswer(atom, direction) {
  return direction === 'nl2es' ? [atom.es] : atom.nl;
}

/** De vraagzijde van een woordenschatitem. */
export function vocabPrompt(atom, direction) {
  return direction === 'nl2es' ? atom.nl[0] : atom.es;
}

/** Broers en zussen uit hetzelfde thema, voor afleiders. Woorden met dezelfde
 *  vertaling vallen weg: die zouden een tweede juist antwoord zijn. */
export function siblings(atom, { sameKind = true } = {}) {
  return atomsForTheme(atom.theme)
    .filter(a => a.id !== atom.id && (!sameKind || a.kind === atom.kind)
      && !(a.kind === 'vocab' && atom.kind === 'vocab' && shareGloss(a, atom)));
}

/** Alle vervoegingen van hetzelfde werkwoord in dezelfde tijd. */
export function conjugationFamily(atom) {
  return byFamily.get(`${atom.verb}|${atom.tense}`) ?? [];
}

let verbNl = null;
/** Vertaling van een infinitief ("hablar" → "spreken"), of undefined. */
export function verbTranslation(verb) {
  if (!verbNl) {
    verbNl = new Map();
    for (const a of course.atoms) {
      if (a.kind === 'vocab' && a.nl?.length && !verbNl.has(a.es)) verbNl.set(a.es, a.nl[0]);
    }
  }
  return verbNl.get(verb);
}

/** Eén vervoegde vorm, of undefined. */
export const conjugatedForm = (verb, tense, person) =>
  byFamily.get(`${verb}|${tense}`)?.find(a => a.person === person)?.form;

/* usted en ustedes staan bewust niet in de labels. Ze delen hun vorm met de
 * derde persoon, dus ze leren je niets extra's, en ze maken het rijtje alleen
 * langer en verwarrender: bij "ellos / ellas / ustedes" ga je je afvragen of
 * er een aparte vorm bij hoort. */
export const PERSON_LABELS = {
  '1s': 'yo',
  '2s': 'tú',
  '3s': 'él / ella',
  '1p': 'nosotros / nosotras',
  '2p': 'vosotros / vosotras',
  '3p': 'ellos / ellas',
};

export const PERSON_ORDER = ['1s', '2s', '3s', '1p', '2p', '3p'];

export const TENSE_LABELS = {
  presente: 'presente · tegenwoordige tijd',
  indefinido: 'pretérito indefinido · verleden tijd, afgerond',
  imperfecto: 'pretérito imperfecto · verleden tijd, gewoonte of beschrijving',
  perfecto: 'pretérito perfecto · voltooid tegenwoordige tijd',
  futuro: 'futuro simple · toekomende tijd',
  condicional: 'condicional · voorwaardelijke wijs (zou …)',
  continuo: 'estar + gerundio · ergens mee bezig zijn',
  subjuntivo: 'presente de subjuntivo · aanvoegende wijs',
};

/* ------------------------------------------------------------------ */
/* Verwarring, gelijkenis en context                                   */
/* ------------------------------------------------------------------ */

/** Woordenschatatomen met precies dit Spaanse woord (lidwoord en accenten tellen niet). */
export const vocabByEs = text => byEs.get(lexiconKey(text)) ?? [];

/** Woordenschatatomen met deze Nederlandse vertaling. */
export const vocabByGloss = text => byGloss.get(glossKey(text)) ?? [];

/**
 * Het andere woord uit de cursus dat iemand gaf in plaats van dit woord, of
 * null. "preguntar" voor pedir, of "vragen" bij pedir terwijl dat de
 * vertaling van preguntar is. Eerst in de taal van het antwoord (nl→es typt
 * Spaans, es→nl meestal Nederlands; luisteren typt Spaans in beide).
 * Een synoniem is geen verwarring.
 */
export function confusedWith(atom, given, direction) {
  if (atom.kind !== 'vocab' || !given) return null;
  const pools = direction === 'es2nl' ? [vocabByGloss(given), vocabByEs(given)] : [vocabByEs(given), vocabByGloss(given)];
  for (const pool of pools) {
    const hit = pool.find(o => o.id !== atom.id && !shareGloss(o, atom));
    if (hit) return hit;
  }
  return null;
}

/** Het kale Spaanse woord: zonder lidwoord, kleine letters, accenten behouden. */
export const bareEs = atom => stripArticle(normalize(speakable(atom.es)));

const lookalikeCache = new Map();
/**
 * Woorden die op dit woord lijken: hoogstens twee letters verschil
 * (caro / carro / cara). Zulke afleiders dwingen je het woord echt te lezen
 * in plaats van het onderwerp te herkennen. Nooit een synoniem.
 */
export function lookalikes(atom) {
  if (atom.kind !== 'vocab') return [];
  if (lookalikeCache.has(atom.id)) return lookalikeCache.get(atom.id);
  const me = bareEs(atom);
  const flat = stripAccents(me);
  const out = [];
  if (flat.length >= 3) {
    for (const o of course.atoms) {
      if (o.kind !== 'vocab' || o.id === atom.id || shareGloss(o, atom)) continue;
      const other = bareEs(o);
      if (other === me || Math.abs(other.length - me.length) > 2 || other.length < 3) continue;
      // Accenten tellen hier wél: papa en papá zijn twee woorden.
      const d = levenshtein(me, other, 2);
      if (d <= 2) out.push({ atom: o, distance: d });
    }
  }
  out.sort((a, b) => a.distance - b.distance);
  lookalikeCache.set(atom.id, out);
  return out;
}

/**
 * Minimale paren om te beluisteren: woorden die één klank verschillen
 * (pero / perro, papa / papá). Voor een vervoeging: een vorm van hetzelfde
 * werkwoord die enkel door het accent verschilt (hablo / habló).
 * @returns {Array<{es, atom?}>}
 */
export function minimalPartners(atom) {
  if (atom.kind === 'conjugation') {
    if (/\s/.test(atom.form)) return [];
    const flat = stripAccents(atom.form);
    return verbForms(atom.verb)
      .filter(f => f !== atom.form && !/\s/.test(f) && stripAccents(f) === flat)
      .map(es => ({ es }));
  }
  if (atom.kind !== 'vocab' || /\s/.test(bareEs(atom))) return [];
  return lookalikes(atom)
    .filter(({ atom: o, distance }) => distance === 1 && !/\s/.test(bareEs(o)))
    .map(({ atom: o }) => ({ es: bareEs(o), atom: o }));
}

/* Alle Spaanse zinnen uit de cursus, met vertaling als die er is. Leesteksten
 * worden in zinnen geknipt; die hebben geen vertaling per zin. */
let sentencePool = null;
function sentences() {
  if (sentencePool) return sentencePool;
  sentencePool = [];
  const add = (es, nl, from) => {
    const words = es.trim().split(/\s+/).length;
    // Geen opdrachtregels uit het werkboek ("comer (tú) → comías").
    if (words < 3 || words > 22 || /___|[→=()]/.test(es)) return;
    sentencePool.push({ es: es.trim(), nl: nl ?? null, from });
  };
  for (const a of course.atoms) {
    if (a.kind === 'sentence' || a.kind === 'dialogue') add(a.es, a.nl, a.id);
    if (a.kind === 'grammar') {
      for (const ex of a.examples ?? []) if (ex.es?.includes('___')) add(ex.es.replace('___', ex.answer), ex.nl, a.id);
    }
  }
  for (const [id, t] of Object.entries(course.texts ?? {})) {
    for (const s of (t.es ?? '').split(/(?<=[.!?])\s+|\n+/)) add(s, null, id);
  }
  return sentencePool;
}

/* Een hoofdletter midden in de zin is een naam: Granada is geen granaatappel,
 * Noruega geen "Noors". Aan het begin van een zin zegt de hoofdletter niets. */
function isProperNoun(sentence, at, surface) {
  if (surface[0] === surface[0].toLowerCase()) return false;
  const before = sentence.slice(0, at).replace(/[\s"«—–-]+$/u, '');
  return before.length > 0 && !/[.!?¿¡:]$/.test(before);
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const contextCache = new Map();
const CONTEXT_POS = new Set(['noun', 'verb', 'adj', 'adv']);

/**
 * Zinnen uit de cursus waarin dit woord letterlijk staat, precies één keer.
 * `surface` is het woord zoals het in de zin staat (met die hoofdletters).
 *
 * Woorden die ook een vervoegde vorm of een ander woord zijn, vallen weg:
 * in "como pan" is como een werkwoord, geen "hoe", en "vino" kan wijn zijn of
 * "hij kwam". Een gat dat twee betekenissen toelaat, is een strikvraag.
 */
export function contextsFor(atom) {
  if (atom.kind !== 'vocab' || !CONTEXT_POS.has(atom.pos)) return [];
  if (contextCache.has(atom.id)) return contextCache.get(atom.id);
  const forms = [...new Set(expandVariants(atom.es).map(v => stripArticle(normalize(v))))]
    .filter(f => f.length >= 3)
    .filter(f => atom.pos === 'verb' || !conjugationsOfForm(f).length)
    .filter(f => vocabByEs(f).every(o => o.id === atom.id || shareGloss(o, atom)));
  const out = [];
  for (const f of forms) {
    const re = new RegExp(`(?<![\\p{L}])${escapeRe(f)}(?![\\p{L}])`, 'giu');
    for (const s of sentences()) {
      const hits = [...s.es.matchAll(re)];
      if (hits.length !== 1) continue;
      const [hit] = hits;
      if (isProperNoun(s.es, hit.index, hit[0])) continue;
      out.push({ ...s, surface: hit[0], at: hit.index });
    }
  }
  // Zinnen met een vertaling eerst: daar kan de vertaling als steuntje bij.
  out.sort((a, b) => Number(!a.nl) - Number(!b.nl) || a.es.length - b.es.length);
  const result = out.slice(0, 16);
  contextCache.set(atom.id, result);
  return result;
}
