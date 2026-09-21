/* Indexeert window.COURSE en levert de bouwstenen waar de rest mee werkt.
 * Een "oefenitem" is een atoom plus een richting: woordenschat wordt in twee
 * richtingen los bijgehouden, want een woord herkennen is iets anders dan het
 * kunnen produceren. */

import { itemKey } from './scheduler.js';

let course = null;
let sources = {};
const byId = new Map();
const byTheme = new Map();

export function init() {
  course = window.COURSE;
  if (!course) throw new Error('data/course.js is niet geladen');
  // Bronvermelding is een extra: zonder dat bestand werkt de app gewoon door.
  sources = window.SOURCES ?? {};

  for (const atom of course.atoms) {
    byId.set(atom.id, atom);
    if (!byTheme.has(atom.theme)) byTheme.set(atom.theme, []);
    byTheme.get(atom.theme).push(atom);
  }
  return course;
}

export const getCourse = () => course;
export const getAtom = id => byId.get(id);
export const atomsForTheme = themeId => byTheme.get(themeId) ?? [];
export const allAtoms = () => course.atoms;
export const getTheme = id => course.themes.find(t => t.id === id);

/** Is dit atoom een werkwoord? Vervoegingen altijd, woordenschat volgens de
 *  woordsoort die in de data staat. */
export const isVerb = atom =>
  atom.kind === 'conjugation' || (atom.kind === 'vocab' && atom.pos === 'verb');

/** Het werkwoord waar dit atoom over gaat, voor het tellen van unieke vormen. */
const verbOf = atom => (atom.kind === 'conjugation' ? atom.verb : atom.es);

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
  const file = atom.src?.split(';')[0].trim();
  const s = file && sources[file];
  if (!s) return null;
  return [s.book, s.chapter, s.page ? `p. ${s.page}` : null].filter(Boolean).join(' · ');
}

/* --- hulpstukken voor de oefentypes --- */

/** Het gevraagde antwoord voor een woordenschatitem, als lijst. */
export function vocabAnswer(atom, direction) {
  return direction === 'nl2es' ? [atom.es] : atom.nl;
}

/** De vraagzijde van een woordenschatitem. */
export function vocabPrompt(atom, direction) {
  return direction === 'nl2es' ? atom.nl[0] : atom.es;
}

/** Broers en zussen uit hetzelfde thema, voor afleiders. */
export function siblings(atom, { sameKind = true } = {}) {
  return atomsForTheme(atom.theme)
    .filter(a => a.id !== atom.id && (!sameKind || a.kind === atom.kind));
}

/** Alle vervoegingen van hetzelfde werkwoord in dezelfde tijd. */
export function conjugationFamily(atom) {
  return allAtoms().filter(a =>
    a.kind === 'conjugation' && a.verb === atom.verb && a.tense === atom.tense);
}

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
  presente: 'presente',
  indefinido: 'pretérito indefinido',
  imperfecto: 'pretérito imperfecto',
  perfecto: 'pretérito perfecto',
  futuro: 'futuro simple',
};
