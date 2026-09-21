/* Bouwt data/sources.js: van scanbestand naar een leesbare bronvermelding.
 *
 *   node tools/sources.mjs <map-met-scans>
 *
 * De atomen in data/course.js dragen als `src` de bestandsnaam van de scan
 * waar ze uit komen. Dat zegt een cursist niets. Dit script vertaalt zo'n
 * bestandsnaam naar boek, hoofdstuk en paginanummer.
 *
 * Het paginanummer staat onderaan elke boekpagina, voluit én in cijfers
 * ("**8** ocho"). De OCR haalt dat er niet altijd door, maar de foto's staan
 * op volgorde: wat ontbreekt ligt tussen twee herkende pagina's in en is af
 * te leiden zolang het aantal foto's klopt met het aantal pagina's.
 *
 * De losse cursusbundel (course-md) heeft geen paginanummers; daarvoor
 * gebruiken we de titel bovenaan de pagina.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = process.argv[2];
if (!SRC) {
  console.error('gebruik: node tools/sources.mjs <map-met-course-md-en-spanish-md>');
  process.exit(1);
}

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'sources.js');

const BOOK = 'Sí, claro nuevo 1.2';
const BUNDLE = 'Vocabulario extra';

/* Hoofdstukindeling uit de índice. De einden volgen uit het volgende begin. */
const CHAPTERS = [
  [1, 'Voorwerk'],
  [9, 'Unidad 1 — Caminando'],
  [19, 'Unidad 2 — Tengo planes'],
  [29, 'Unidad 3 — Casa nueva, vida nueva'],
  [39, 'Unidad 4 — Mirador'],
  [43, 'Unidad 5 — El gusto de aprender'],
  [53, 'Unidad 6 — Te lo compro'],
  [63, 'Unidad 7 — ¡Qué descanso!'],
  [73, 'Unidad 8 — Mirador'],
  [77, 'Cuaderno de ejercicios'],
  [151, 'Gramática sistemática'],
  [175, 'Transcripciones de los audios'],
  [186, 'Transcripciones de los vídeos'],
  [188, 'Soluciones'],
  [204, 'Vocabulario por unidades'],
  [228, 'Vocabulario temático'],
  [238, 'Tabla de verbos'],
];

const chapterFor = page => {
  let label = CHAPTERS[0][1];
  for (const [start, name] of CHAPTERS) {
    if (page >= start) label = name; else break;
  }
  return label;
};

/* De voettekst van een boekpagina: het nummer in cijfers naast het woord. */
const FOOTER = /\*\*(\d{1,3})\*\*\s+[a-zá-úñ]|[a-zá-úñ]\s+\*\*(\d{1,3})\*\*/g;

function scan(dir) {
  return readdirSync(join(SRC, dir))
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => {
      const text = readFileSync(join(SRC, dir, f), 'utf8');
      const lines = text.split('\n');
      // Alleen de staart bekijken: vetgedrukte getallen komen ook in de
      // lopende tekst voor, maar het paginanummer staat onderaan.
      const hits = [...lines.slice(-12).join('\n').matchAll(FOOTER)]
        .map(m => Number(m[1] ?? m[2]));
      // "VOCABULARIO EXTRA" staat boven élke bundelpagina en onderscheidt dus
      // niets; de subtitel eronder benoemt het onderwerp wél.
      const headings = lines.filter(l => /^#{1,3} \S/.test(l)).map(l => l.replace(/^#+\s*/, '').trim());
      const heading = headings.find(h => !/^vocabulario extra/i.test(h)) ?? headings[0] ?? null;
      return { file: `${dir}/${f}`, page: hits[0] ?? null, heading };
    });
}

/* Een los verkeerd gelezen getal zou een heel blok pagina's verschuiven.
 * De foto's lopen oplopend, dus alles wat terugspringt gooien we weg. */
function dropOutliers(list) {
  let last = 0;
  for (const e of list) {
    if (e.page == null) continue;
    if (e.page < last) e.page = null;
    else last = e.page;
  }
  return list;
}

/* Vult de gaten tussen twee herkende pagina's — maar alleen als het aantal
 * foto's ertussen exact overeenkomt met het aantal pagina's ertussen. Anders
 * zat er een dubbele plaat of een losse foto tussen en is gokken erger dan
 * niets vermelden. */
function interpolate(list) {
  const known = list.flatMap((e, i) => (e.page == null ? [] : [i]));
  for (let k = 0; k < known.length - 1; k++) {
    const a = known[k], b = known[k + 1];
    if (b - a === 1) continue;
    if (list[b].page - list[a].page !== b - a) continue;
    for (let i = a + 1; i < b; i++) list[i].page = list[a].page + (i - a);
  }
  return list;
}

const book = interpolate(dropOutliers(scan('spanish-md')));
const bundle = scan('course-md');

const map = {};
for (const e of book) {
  if (e.page == null) continue;
  map[e.file] = { book: BOOK, chapter: chapterFor(e.page), page: e.page };
}
for (const e of bundle) {
  map[e.file] = { book: BUNDLE, chapter: e.heading ?? null, page: null };
}

const found = book.filter(e => e.page != null).length;

writeFileSync(OUT,
  `/* Bronvermelding per scan: boek, hoofdstuk en pagina.\n` +
  ` *\n` +
  ` * GEGENEREERD BESTAND — niet met de hand aanpassen.\n` +
  ` * Opnieuw maken:  node tools/sources.mjs <map-met-scans>\n` +
  ` *\n` +
  ` * Geladen via <script src> zodat de app ook vanaf file:// werkt.\n` +
  ` */\n` +
  `window.SOURCES = ${JSON.stringify(map, null, 1)};\n`);

console.log(`handboek: ${found}/${book.length} scans met paginanummer`);
console.log(`bundel:   ${bundle.length} scans (geen paginanummers)`);
console.log(`geschreven: ${OUT}`);
