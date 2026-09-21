/* Indexeert window.COURSE en levert de bouwstenen waar de rest mee werkt.
 * Een "oefenitem" is een atoom plus een richting: woordenschat wordt in twee
 * richtingen los bijgehouden, want een woord herkennen is iets anders dan het
 * kunnen produceren. */

import { itemKey } from './scheduler.js';

let course = null;
const byId = new Map();
const byTheme = new Map();

export function init() {
  course = window.COURSE;
  if (!course) throw new Error('data/course.js is niet geladen');

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

/** Thema's gegroepeerd per unidad, in cursusvolgorde — voedt de startpagina. */
export function tree() {
  return course.units
    .map(unit => ({
      ...unit,
      themes: course.themes
        .filter(t => t.unit === unit.id && (byTheme.get(t.id)?.length ?? 0) > 0)
        .map(t => ({ ...t, count: byTheme.get(t.id).length })),
    }))
    .filter(u => u.themes.length > 0);
}

/**
 * Zet atomen om in oefenitems. Woordenschat levert er twee (nl→es en es→nl),
 * al de rest levert er één.
 */
export function itemsFor(atoms) {
  const items = [];
  for (const atom of atoms) {
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

export const PERSON_LABELS = {
  '1s': 'yo',
  '2s': 'tú',
  '3s': 'él / ella / usted',
  '1p': 'nosotros / nosotras',
  '2p': 'vosotros / vosotras',
  '3p': 'ellos / ellas / ustedes',
};

export const PERSON_ORDER = ['1s', '2s', '3s', '1p', '2p', '3p'];

export const TENSE_LABELS = {
  presente: 'presente',
  indefinido: 'pretérito indefinido',
  imperfecto: 'pretérito imperfecto',
  perfecto: 'pretérito perfecto',
  futuro: 'futuro simple',
};
