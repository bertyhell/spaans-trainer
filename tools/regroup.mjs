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
 *     thema per activiteit, en krijgen `regular` mee (zie verbs.mjs).
 *
 * Het script is herhaalbaar: twee keer draaien geeft hetzelfde resultaat.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GROUPS, GROUP_OF } from './groups.mjs';
import { VERB_THEMES, VERB_THEME_OF, REPLACED_THEMES, IRREGULAR, REGULAR } from './verbs.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const COURSE = join(HERE, '..', 'data', 'course.js');
const CLASSIFIED = process.argv[2];

/* Imperatieven op ustedes. Die vorm hoort bij het Latijns-Amerikaanse
 * "u"-meervoud en wordt in deze cursus nergens actief gevraagd; als los
 * woordje oefenen levert alleen een vorm op die je niet gebruikt. */
const DROP = new Set(['v.mencionen', 'v.piensen-en']);

const POS = new Set(['verb', 'noun', 'adj', 'adv', 'other']);

/* --- inlezen --- */

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
const VERB_THEME_IDS = new Set(VERB_THEMES.map(t => t.id));
course.themes = [
  ...course.themes.filter(t => !VERB_THEME_IDS.has(t.id)),
  ...VERB_THEMES.map(({ verbs: _, ...t }) => t),
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
  // Liedjesregels staan in de cursus om mee te zingen. Als oefening vragen ze
  // je een songtekst woord voor woord te reproduceren, en dat leert je geen
  // Spaans — ze gaan er dus helemaal uit, thema en al.
  if (atom.kind === 'lyric') continue;
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

  const { regular: _r, change: _c, ...rest } = atom;
  atoms.push({ ...rest, pos, theme, ...(pos === 'verb' ? verbInfo(atom.es) : {}) });
}

/* --- groepen in plaats van unidades --- */

const used = new Set(atoms.map(a => a.theme));
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
};
delete next.units;

writeFileSync(COURSE, `${header}window.COURSE = ${JSON.stringify(next, null, 1)};\n`);

console.log(`woordenschat geclassificeerd: ${tagged}/${atoms.filter(a => a.kind === 'vocab').length}`);
console.log(`verhuisd naar een ander thema: ${moved}`);
console.log(`groepen: ${groups.length}, thema's: ${themes.length}`);
if (dropped.length) console.log(`buiten de indeling gelaten: ${dropped.map(t => t.id).join(', ')}`);
if (problems.length) {
  console.log(`\n${problems.length} aandachtspunten:`);
  for (const p of problems.slice(0, 20)) console.log(`  ${p}`);
  if (problems.length > 20) console.log(`  … en nog ${problems.length - 20}`);
}
