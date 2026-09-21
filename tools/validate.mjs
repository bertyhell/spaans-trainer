/* Controleert data/course.js. Geen afhankelijkheden.
 *   node tools/validate.mjs
 * Faalt met code 1 bij fouten; waarschuwingen laten de build doorgaan. */

import { readFile } from 'node:fs/promises';

const DATA = new URL('../data/course.js', import.meta.url);

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

/* Het databestand zet window.COURSE; hier bootsen we dat na. */
const source = await readFile(DATA, 'utf8');
const window = {};
new Function('window', source)(window);
const course = window.COURSE;

if (!course) {
  console.error('FOUT: window.COURSE is niet gezet.');
  process.exit(1);
}

/* --- structuur op hoog niveau --- */
if (course.schemaVersion !== 1) err('course', `onbekende schemaVersion ${course.schemaVersion}`);
if (!Array.isArray(course.units) || !course.units.length) err('course', 'geen units');
if (!Array.isArray(course.themes) || !course.themes.length) err('course', 'geen themes');
if (!Array.isArray(course.atoms) || !course.atoms.length) err('course', 'geen atoms');

const unitIds = new Set(course.units.map(u => u.id));
const themeIds = new Set(course.themes.map(t => t.id));

for (const t of course.themes) {
  if (!unitIds.has(t.unit)) err(`theme ${t.id}`, `verwijst naar onbekende unit "${t.unit}"`);
  if (!t.label) err(`theme ${t.id}`, 'zonder label');
}

/* --- atomen --- */
const seenIds = new Set();
const usedThemes = new Set();
const conjugations = new Map();          // verb|tense -> Set(persons)
const spanishSeen = new Map();           // genormaliseerd es -> [ids]

const PERSONS = ['1s', '2s', '3s', '1p', '2p', '3p'];
const norm = s => String(s).trim().toLowerCase();

/* Tekens die in schoongemaakte data niet meer horen voor te komen.
 * Let op: ___ (precies drie) is onze eigen gatmarkering en dus toegestaan;
 * langere reeksen komen uit ingescande invulvelden.
 * "Propuesta" staat hier bewust NIET in: in de bron markeert dat open vragen,
 * maar la propuesta (het voorstel) is gewoon een woord uit de woordenschat. */
const OCR_JUNK = /\[onleesbaar\]|handgeschreven|\|{2,}|_{4,}/i;

/* … hoort erbij: grammaticapatronen schrijven zich als "(no) … nunca". */
const VALID_ES = /^[a-záéíóúüñ¿¡?!.,'/()+\-…: 0-9]+$/i;

for (const a of course.atoms) {
  const id = a.id ?? '(zonder id)';

  if (!a.id) { err('atom', 'zonder id'); continue; }
  if (seenIds.has(a.id)) err(id, 'dubbel id');
  seenIds.add(a.id);

  if (!a.kind) err(id, 'zonder kind');
  if (!a.theme) err(id, 'zonder theme');
  else if (!themeIds.has(a.theme)) err(id, `onbekend theme "${a.theme}"`);
  else usedThemes.add(a.theme);

  if (!a.src) warn(id, 'zonder bronverwijzing');

  const text = [a.es, a.rule, ...(a.nl ?? []), ...(a.examples ?? []).map(e => e.es)].join(' ');
  if (OCR_JUNK.test(text)) err(id, 'bevat OCR-resten of annotatietekst');

  if (a.es && !VALID_ES.test(a.es)) err(id, `ongeldige tekens in es: "${a.es}"`);

  // Emoji moet één teken zijn, geen woord.
  if (a.emoji && [...a.emoji].length > 3) warn(id, `verdachte emoji "${a.emoji}"`);

  switch (a.kind) {
    case 'vocab': {
      if (!a.es) err(id, 'vocab zonder es');
      if (!Array.isArray(a.nl) || !a.nl.length) err(id, 'vocab zonder nl-antwoorden');
      else if (a.nl.some(x => !x || !String(x).trim())) err(id, 'vocab met leeg nl-antwoord');

      if (a.gender && !['m', 'f'].includes(a.gender)) err(id, `ongeldig gender "${a.gender}"`);
      if (a.number && !['sg', 'pl'].includes(a.number)) err(id, `ongeldig number "${a.number}"`);
      if (/^(el|la|los|las)\s/i.test(a.es ?? '') && (!a.gender || !a.number)) {
        warn(id, 'zelfstandig naamwoord zonder gender/number — lidwoordoefening valt weg');
      }

      const key = norm(a.es);
      if (!spanishSeen.has(key)) spanishSeen.set(key, []);
      spanishSeen.get(key).push(a.id);
      break;
    }

    case 'conjugation': {
      for (const f of ['verb', 'tense', 'person', 'form']) {
        if (!a[f]) err(id, `conjugation zonder ${f}`);
      }
      if (a.person && !PERSONS.includes(a.person)) err(id, `ongeldige person "${a.person}"`);
      const key = `${a.verb}|${a.tense}`;
      if (!conjugations.has(key)) conjugations.set(key, new Set());
      conjugations.get(key).add(a.person);
      break;
    }

    case 'grammar': {
      if (!a.rule) err(id, 'grammar zonder rule');
      if (!Array.isArray(a.examples) || !a.examples.length) err(id, 'grammar zonder examples');
      for (const [i, ex] of (a.examples ?? []).entries()) {
        if (!ex.es) err(id, `example ${i} zonder es`);
        if (!ex.answer) err(id, `example ${i} zonder answer`);
        if (ex.options && !ex.options.includes(ex.answer)) {
          err(id, `example ${i}: answer "${ex.answer}" ontbreekt in options`);
        }
        if (ex.es && !ex.es.includes('___')) warn(id, `example ${i} heeft geen ___ gat`);
      }
      break;
    }

    case 'sentence':
    case 'lyric': {
      if (!a.es) err(id, `${a.kind} zonder es`);
      if (!a.nl) warn(id, `${a.kind} zonder vertaling`);
      for (const [i, b] of (a.blanks ?? []).entries()) {
        if (!b.answer) err(id, `blank ${i} zonder answer`);
        else if (a.es && !norm(a.es).includes(norm(b.answer))) {
          err(id, `blank ${i}: "${b.answer}" komt niet voor in de zin`);
        }
        if (b.options && !b.options.includes(b.answer)) {
          err(id, `blank ${i}: answer ontbreekt in options`);
        }
      }
      break;
    }

    default:
      err(id, `onbekende kind "${a.kind}"`);
  }
}

/* --- rijtjes vervoegingen --- */
for (const [key, persons] of conjugations) {
  if (persons.size !== 6) {
    const missing = PERSONS.filter(p => !persons.has(p));
    warn(`conjugatie ${key}`, `onvolledig, mist ${missing.join(', ')} — de tabeloefening valt weg`);
  }
}

/* --- dubbels en weesthema's --- */
for (const [es, ids] of spanishSeen) {
  if (ids.length > 1) warn('dubbel woord', `"${es}" komt ${ids.length}× voor: ${ids.join(', ')}`);
}
for (const t of themeIds) {
  if (!usedThemes.has(t)) warn(`theme ${t}`, 'heeft geen enkel atoom');
}

/* --- afleiders: meerkeuze heeft themagenoten nodig --- */
const perTheme = new Map();
for (const a of course.atoms) {
  if (a.kind !== 'vocab') continue;
  perTheme.set(a.theme, (perTheme.get(a.theme) ?? 0) + 1);
}
for (const [theme, n] of perTheme) {
  if (n < 4) warn(`theme ${theme}`, `slechts ${n} woorden — te weinig voor meerkeuze-afleiders`);
}

/* --- rapport --- */
const kinds = {};
for (const a of course.atoms) kinds[a.kind] = (kinds[a.kind] ?? 0) + 1;

console.log(`\n  ${course.course}`);
console.log(`  ${course.atoms.length} atomen · ${course.themes.length} thema's · ${course.units.length} unidades`);
console.log(`  ${Object.entries(kinds).map(([k, v]) => `${k}: ${v}`).join(' · ')}\n`);

for (const w of warnings) console.log(`  waarschuwing  ${w}`);
if (warnings.length) console.log('');
for (const e of errors) console.log(`  FOUT  ${e}`);

if (errors.length) {
  console.log(`\n  ${errors.length} fout(en), ${warnings.length} waarschuwing(en)\n`);
  process.exit(1);
}
console.log(`  geen fouten, ${warnings.length} waarschuwing(en)\n`);
