/* Handmatig samengestelde inhoud: toetsen, oefeningen uit het werkboek,
 * dialogen, leesteksten, klemtoon en grammatica-uitleg.
 *
 *   node tools/content/index.mjs              controleert alle modules
 *   node tools/content/index.mjs tests.mjs    enkel de fouten van één module
 *
 * De oorspronkelijke data (data/course.js) is ooit gedolven met agenten; die
 * fragmenten bestaan niet meer. Nieuwe inhoud komt daarom hier, als gewone
 * modules, en tools/regroup.mjs voegt ze bij elke run opnieuw in. Een atoom
 * uit deze map vervangt een atoom met dezelfde id; wat hier verdwijnt,
 * verdwijnt ook uit de app. Zo blijft regroup herhaalbaar.
 *
 * Elke module (behalve index.mjs en themes.mjs) exporteert als default:
 *
 *   {
 *     atoms:   [...],                 // zie hieronder
 *     texts:   { 't.id': {...} },     // leesteksten en dialogen (context)
 *     grammar: { 'gr.id': {...} },    // uitleg bij een fout antwoord
 *     exams:   { 'thema-id': ['v.id', ...] },  // bestaande atomen in een examenthema
 *   }
 *
 * Soorten atomen (naast de bestaande sentence en grammar):
 *   vocab     { es, nl: [...], pos, gender?, number?, emoji?, note? }  woordenschat
 *   choice    { prompt, context?, options, answer, nl? }        meerkeuzevraag
 *   reading   { text, q, options, answer, nl? }                 vraag bij een tekst
 *   dialogue  { text, line, who?, es, nl }                      zin uit een dialoog
 *   stress    { es, syllables, stressed, nl?, note? }           klemtoon aanduiden
 * Allemaal met id, kind, theme, en src (scanbestand) of srcLabel (vrije
 * bronvermelding), optioneel grammarRef (sleutel in `grammar`) en note.
 */

import { readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CONTENT_THEMES, EXISTING_THEMES } from './themes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKIP = new Set(['index.mjs', 'themes.mjs']);

const KINDS = new Set(['vocab', 'sentence', 'grammar', 'choice', 'reading', 'dialogue', 'stress']);
const POS = new Set(['verb', 'noun', 'adj', 'adv', 'other']);

/** Laadt en controleert alle modules. Gooit een fout bij iets onbruikbaars. */
export async function loadContent() {
  const files = readdirSync(HERE).filter(f => f.endsWith('.mjs') && !SKIP.has(f)).sort();
  const atoms = [];
  const texts = {};
  const grammar = {};
  const exams = {};
  const origin = new Map();
  const problems = [];

  for (const file of files) {
    const mod = (await import(pathToFileURL(`${HERE}/${file}`).href)).default ?? {};
    for (const a of mod.atoms ?? []) {
      if (origin.has(a.id)) problems.push(`${file}: id ${a.id} bestaat al in ${origin.get(a.id)}`);
      origin.set(a.id, file);
      atoms.push({ ...a, curated: true });
    }
    for (const [k, v] of Object.entries(mod.texts ?? {})) {
      if (k in texts) problems.push(`${file}: tekst ${k} dubbel`);
      texts[k] = v;
    }
    for (const [k, v] of Object.entries(mod.grammar ?? {})) {
      if (k in grammar) problems.push(`${file}: uitleg ${k} dubbel`);
      if (!v?.title || !v?.body) problems.push(`${file}: uitleg ${k}: title en body zijn verplicht`);
      grammar[k] = v;
    }
    for (const [k, ids] of Object.entries(mod.exams ?? {})) {
      if (k in exams) problems.push(`${file}: examen ${k} dubbel`);
      if (new Set(ids).size !== ids.length) problems.push(`${file}: examen ${k} bevat dubbele id's`);
      exams[k] = ids;
    }
  }

  const themeIds = new Set([...CONTENT_THEMES.map(t => t.id), ...EXISTING_THEMES]);
  for (const k of Object.keys(exams)) if (!themeIds.has(k)) problems.push(`examen ${k}: onbekend thema`);
  for (const a of atoms) problems.push(...checkAtom(a, { themeIds, texts, grammar }).map(p => `${origin.get(a.id)}: ${a.id}: ${p}`));

  return { files, atoms, texts, grammar, exams, problems };
}

const nonEmpty = s => typeof s === 'string' && s.trim().length > 0;

export function checkAtom(a, { themeIds, texts, grammar }) {
  const p = [];
  if (!nonEmpty(a.id)) p.push('zonder id');
  if (!KINDS.has(a.kind)) p.push(`onbekende kind "${a.kind}"`);
  if (!themeIds.has(a.theme)) p.push(`onbekend thema "${a.theme}"`);
  if (!a.src && !a.srcLabel) p.push('zonder src of srcLabel');
  if (a.grammarRef && !grammar[a.grammarRef]) p.push(`grammarRef "${a.grammarRef}" bestaat niet`);

  const options = (opts, answer) => {
    if (!Array.isArray(opts) || opts.length < 2) p.push('minstens twee opties nodig');
    else if (!opts.includes(answer)) p.push(`antwoord "${answer}" staat niet in de opties`);
    else if (new Set(opts).size !== opts.length) p.push('dubbele opties');
  };

  switch (a.kind) {
    case 'vocab':
      if (!nonEmpty(a.es)) p.push('zonder es');
      if (!Array.isArray(a.nl) || !a.nl.length || !a.nl.every(nonEmpty)) p.push('nl moet een lijst vertalingen zijn');
      if (!POS.has(a.pos)) p.push(`onbekende pos "${a.pos}"`);
      if (/^(el|la|los|las) /.test(a.es) && (!a.gender || !a.number)) p.push('lidwoord zonder gender en number');
      break;
    case 'sentence':
      if (!nonEmpty(a.es) || !nonEmpty(a.nl)) p.push('es en nl zijn verplicht');
      if (!Array.isArray(a.blanks) || !a.blanks.length) p.push('zonder blanks');
      for (const b of a.blanks ?? []) {
        if (!nonEmpty(b.answer)) p.push('blank zonder answer');
        else if (!a.es.toLowerCase().includes(b.answer.toLowerCase())) p.push(`answer "${b.answer}" staat niet in es`);
        if (b.options) options(b.options, b.answer);
      }
      break;
    case 'grammar':
      if (!nonEmpty(a.rule)) p.push('zonder rule');
      if (!Array.isArray(a.examples) || !a.examples.length) p.push('zonder examples');
      for (const ex of a.examples ?? []) {
        if (!ex.es?.includes('___')) p.push(`voorbeeld zonder ___: ${ex.es}`);
        if (!nonEmpty(ex.answer)) p.push('voorbeeld zonder answer');
        if (ex.options) options(ex.options, ex.answer);
      }
      break;
    case 'choice':
      if (!nonEmpty(a.prompt)) p.push('zonder prompt');
      options(a.options, a.answer);
      break;
    case 'reading':
      if (!texts[a.text]?.es) p.push(`tekst "${a.text}" bestaat niet of heeft geen es`);
      if (!nonEmpty(a.q)) p.push('zonder vraag q');
      options(a.options, a.answer);
      break;
    case 'dialogue':
      if (!texts[a.text]) p.push(`tekst "${a.text}" bestaat niet`);
      if (!Number.isInteger(a.line)) p.push('line moet een geheel getal zijn');
      if (!nonEmpty(a.es) || !nonEmpty(a.nl)) p.push('es en nl zijn verplicht');
      break;
    case 'stress':
      if (!nonEmpty(a.es)) p.push('zonder es');
      if (!Array.isArray(a.syllables) || a.syllables.length < 2) p.push('minstens twee lettergrepen');
      else {
        if (a.syllables.join('') !== a.es) p.push(`lettergrepen "${a.syllables.join('-')}" vormen niet "${a.es}"`);
        if (!Number.isInteger(a.stressed) || a.stressed < 0 || a.stressed >= a.syllables.length) p.push('stressed buiten bereik');
      }
      break;
  }
  return p;
}

/* Als script: controleren en een overzicht tonen. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Met een bestandsnaam erbij: enkel de fouten van die module.
  const only = process.argv[2]?.split('/').pop();
  const { files, atoms, texts, grammar, problems: all } = await loadContent();
  const problems = only ? all.filter(p => p.startsWith(`${only}:`)) : all;
  const perFile = {};
  for (const a of atoms) perFile[a.kind] = (perFile[a.kind] ?? 0) + 1;
  console.log(`\n  ${files.length} modules · ${atoms.length} atomen · ${Object.keys(texts).length} teksten · ${Object.keys(grammar).length} uitleg`);
  console.log(`  ${Object.entries(perFile).map(([k, n]) => `${k}: ${n}`).join(' · ')}\n`);
  for (const p of problems) console.log(`  fout  ${p}`);
  console.log(problems.length ? `\n  ${problems.length} fout(en)\n` : '  geen fouten\n');
  process.exit(problems.length ? 1 : 0);
}
