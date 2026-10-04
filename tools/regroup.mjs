/* Herschikt data/course.js op betekenis in plaats van op plek in het boek.
 *
 *   node tools/regroup.mjs [map-met-classificatie]
 *
 * Draai dit na tools/merge.mjs: merge bouwt de data uit de scans en houdt dus
 * de indeling van de cursus aan, dit script legt daar de indeling overheen
 * waarmee je wíl oefenen.
 *
 * Vier bewerkingen:
 *   - `units` wordt `groups`: thema's gebundeld op onderwerp (zie groups.mjs);
 *   - elk woordenschat-atoom krijgt een woordsoort (`pos`), zodat oefeningen
 *     geen appels met peren vergelijken;
 *   - woorden die in het verkeerde thema beland waren verhuizen;
 *   - de werkwoorden uit de vormthema's (-ar, -er, -ir, ...) gaan naar een
 *     thema per activiteit, en krijgen `regular` mee (zie verbs.mjs);
 *   - de vervoegingen worden aangevuld en per tijd ingedeeld in regelmatig,
 *     klankveranderend en onregelmatig (zie conjugate.mjs);
 *   - handmatige verbeteringen uit gemelde fouten: extra vertalingen,
 *     verhuisde en geschrapte woorden (zie fixes.mjs);
 *   - de handmatig samengestelde inhoud uit tools/content/ (toetsen,
 *     werkboekoefeningen, dialogen, teksten, klemtoon, grammatica-uitleg).
 *
 * Het script is herhaalbaar: twee keer draaien geeft hetzelfde resultaat.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GROUPS, GROUP_OF } from './groups.mjs';
import { VERB_THEMES, VERB_THEME_OF, REPLACED_THEMES, IRREGULAR, REGULAR } from './verbs.mjs';
import { CONJUGATION_THEMES, EXTRA_SECTIONS, VERB_TYPE_THEMES, buildConjugations, buildVerbTypes } from './conjugate.mjs';
import { EXTRA_NL, EMOJI, MOVE, DROP as FIX_DROP, EXTRA_THEMES } from './fixes.mjs';
import { CONTENT_THEMES } from './content/themes.mjs';
import { loadContent } from './content/index.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const COURSE = join(HERE, '..', 'data', 'course.js');
const CLASSIFIED = process.argv[2];

/* Imperatieven op ustedes. Die vorm hoort bij het Latijns-Amerikaanse
 * "u"-meervoud en wordt in deze cursus nergens actief gevraagd; als los
 * woordje oefenen levert alleen een vorm op die je niet gebruikt. */
const DROP = new Set(['v.mencionen', 'v.piensen-en', ...FIX_DROP]);

const POS = new Set(['verb', 'noun', 'adj', 'adv', 'other']);

/* --- inlezen --- */

const content = await loadContent();
if (content.problems.length) {
  console.error(`tools/content heeft ${content.problems.length} fout(en):`);
  for (const p of content.problems.slice(0, 30)) console.error(`  ${p}`);
  process.exit(1);
}

const raw = readFileSync(COURSE, 'utf8');
const header = raw.slice(0, raw.indexOf('window.COURSE'));
const course = new Function(`${raw.replace('window.COURSE', 'const C')}; return C;`)();

/* --- classificatie van de woordenschat --- */

const decided = new Map();
if (CLASSIFIED) {
  for (const f of readdirSync(CLASSIFIED).filter(f => /^out-\d+\.json$/.test(f))) {
    for (const row of JSON.parse(readFileSync(join(CLASSIFIED, f), 'utf8'))) {
      decided.set(row.id, row);
    }
  }
}

/* Vangnet voor woorden die geen beslissing kregen: een lidwoord vooraan maakt
 * het een zelfstandig naamwoord, een infinitief-uitgang een werkwoord. */
function guessPos(es) {
  if (/^(el|la|los|las|un|una|unos|unas)\s/i.test(es)) return 'noun';
  if (/(ar|er|ir)(se|\(se\))?$/.test(es.split(/[ ,/]/)[0])) return 'verb';
  return 'other';
}

/* De activiteitenthema's bestaan niet in de gedolven data: die komen erbij.
 * Opnieuw draaien overschrijft ze gewoon met wat in verbs.mjs staat. */
const OWN_THEMES = [
  ...VERB_THEMES.map(({ verbs: _, ...t }) => t),
  ...CONJUGATION_THEMES,
  ...VERB_TYPE_THEMES.map(({ type: _, ...t }) => t),
  ...EXTRA_THEMES,
  ...CONTENT_THEMES.map(({ group: _, ...t }) => t),
];
const OWN_THEME_IDS = new Set(OWN_THEMES.map(t => t.id));
course.themes = [
  ...course.themes
    .filter(t => !OWN_THEME_IDS.has(t.id))
    .map(t => (EXTRA_SECTIONS[t.id] ? { ...t, section: EXTRA_SECTIONS[t.id] } : t)),
  ...OWN_THEMES,
];

const themeIds = new Set(course.themes.map(t => t.id));

/** Regelmatig in de presente? Alleen voor losse infinitieven die we kennen. */
function verbInfo(es) {
  if (es in IRREGULAR) return { regular: false, change: IRREGULAR[es] };
  if (REGULAR.has(es)) return { regular: true };
  return {};
}

const problems = [];
let moved = 0, tagged = 0;

const atoms = [];
for (const atom of course.atoms) {
  if (DROP.has(atom.id)) continue;
  // Samengestelde inhoud komt hieronder vers uit tools/content/.
  if (atom.curated) continue;
  // Liedjesregels staan in de cursus om mee te zingen. Als oefening vragen ze
  // je een songtekst woord voor woord te reproduceren, en dat leert je geen
  // Spaans — ze gaan er dus helemaal uit, thema en al.
  if (atom.kind === 'lyric') continue;
  // Vervoegingen komen hieronder in één keer, aangevuld en ingedeeld.
  if (atom.kind === 'conjugation' || atom.kind === 'verbType') continue;
  if (atom.kind !== 'vocab') { atoms.push(atom); continue; }

  const d = decided.get(atom.id);
  // Zonder classificatie blijft staan wat er al stond: zo is het script ook
  // zonder die map veilig opnieuw te draaien.
  const pos = POS.has(d?.pos) ? d.pos : atom.pos ?? guessPos(atom.es);
  let theme = atom.theme;

  if (d?.theme && d.theme !== atom.theme) {
    if (!themeIds.has(d.theme)) problems.push(`${atom.id}: onbekend thema ${d.theme}`);
    else if (!GROUP_OF[d.theme]) problems.push(`${atom.id}: thema ${d.theme} zit in geen groep`);
    else { theme = d.theme; moved++; }
  }
  if (!d && !atom.pos) problems.push(`${atom.id}: geen classificatie, woordsoort geraden`);
  else tagged++;

  // Werkwoorden die in verbs.mjs staan gaan naar hun activiteit. Wie uit een
  // vormthema komt en daar níét staat, zou in een verdwenen thema blijven.
  if (pos === 'verb' && VERB_THEME_OF[atom.es]) theme = VERB_THEME_OF[atom.es];
  else if (REPLACED_THEMES.includes(theme)) {
    problems.push(`${atom.id}: werkwoord zonder activiteitenthema (verbs.mjs)`);
  }

  if (MOVE[atom.id]) theme = MOVE[atom.id];
  // Zonder dubbels, anders groeit de lijst bij elke keer opnieuw draaien.
  const nl = [...new Set([...atom.nl, ...(EXTRA_NL[atom.id] ?? [])])];

  const { regular: _r, change: _c, ...rest } = atom;
  const emoji = EMOJI[atom.id] ?? rest.emoji;
  atoms.push({ ...rest, ...(emoji ? { emoji } : {}), nl, pos, theme, ...(pos === 'verb' ? verbInfo(atom.es) : {}) });
}

const conjugations = buildConjugations(course.atoms);
atoms.push(...conjugations, ...buildVerbTypes(conjugations));

// Een samengesteld atoom vervangt een gedolven atoom met dezelfde id.
const curatedIds = new Set(content.atoms.map(a => a.id));
for (let i = atoms.length - 1; i >= 0; i--) if (curatedIds.has(atoms[i].id)) atoms.splice(i, 1);
atoms.push(...content.atoms);

// Examenthema's verwijzen naar bestaande atomen (content/exams.mjs).
const alsoOf = new Map();
for (const [theme, ids] of Object.entries(content.exams)) {
  for (const id of ids) alsoOf.set(id, [...(alsoOf.get(id) ?? []), theme]);
}
const atomIds = new Set(atoms.map(a => a.id));
for (const id of alsoOf.keys()) if (!atomIds.has(id)) problems.push(`examen: ${id} bestaat niet`);
for (const [i, a] of atoms.entries()) {
  const { also: _, ...rest } = a;
  atoms[i] = alsoOf.has(a.id) ? { ...rest, also: alsoOf.get(a.id) } : rest;
}

/* --- groepen in plaats van unidades --- */

const used = new Set(atoms.flatMap(a => [a.theme, ...(a.also ?? [])]));
const byId = Object.fromEntries(course.themes.map(t => [t.id, t]));

const groups = GROUPS
  .map(g => ({
    id: g.id, title: g.title, emoji: g.emoji,
    themes: g.themes.filter(t => used.has(t)),
  }))
  .filter(g => g.themes.length);

const themes = groups.flatMap(g => g.themes.map(id => {
  const { unit, ...rest } = byId[id];
  return { ...rest, group: g.id };
}));

const dropped = course.themes.filter(t => !themes.some(x => x.id === t.id));

/* --- wegschrijven --- */

const next = {
  ...course,
  groups: groups.map(({ themes: _, ...g }) => g),
  themes,
  atoms,
  texts: content.texts,
  grammar: content.grammar,
};
delete next.units;

writeFileSync(COURSE, `${header}window.COURSE = ${JSON.stringify(next, null, 1)};\n`);

console.log(`woordenschat geclassificeerd: ${tagged}/${atoms.filter(a => a.kind === 'vocab').length}`);
console.log(`verhuisd naar een ander thema: ${moved}`);
console.log(`vervoegingen: ${conjugations.length}, waarvan berekend: ${conjugations.filter(a => a.generated).length}`);
console.log(`groepen: ${groups.length}, thema's: ${themes.length}`);
console.log(`samengesteld: ${content.atoms.length} atomen, ${Object.keys(content.texts).length} teksten, ${Object.keys(content.grammar).length} uitleg`);
if (dropped.length) console.log(`buiten de indeling gelaten: ${dropped.map(t => t.id).join(', ')}`);
if (problems.length) {
  console.log(`\n${problems.length} aandachtspunten:`);
  for (const p of problems.slice(0, 20)) console.log(`  ${p}`);
  if (problems.length > 20) console.log(`  … en nog ${problems.length - 20}`);
}
