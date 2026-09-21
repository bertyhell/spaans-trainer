/* Voegt de JSON-fragmenten van de mijnagenten samen tot data/course.js.
 *
 *   node tools/merge.mjs <map-met-fragmenten> [--dry]
 *
 * Doet drie dingen die de agenten zelf niet kunnen:
 *  - dubbels samenvoegen (course-md en spanish-md overlappen),
 *  - de themaboom opbouwen en aan de juiste unidad hangen,
 *  - te kleine thema's samenvoegen, want meerkeuze heeft afleiders nodig.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = process.argv[2];
const dryRun = process.argv.includes('--dry');
if (!dir) {
  console.error('gebruik: node tools/merge.mjs <map-met-fragmenten> [--dry]');
  process.exit(1);
}

const OUT = new URL('../data/course.js', import.meta.url);
const MIN_THEME_SIZE = 4;          // minder dan dit levert geen afleiders op

/* De acht unidades van het handboek, plus twee eigen groepen voor materiaal uit
 * de losse grammaticabundel van de lesgever — dat hangt niet aan één unidad. */
const UNITS = [
  { id: 'u1', n: 1, title: 'Caminando' },
  { id: 'u2', n: 2, title: 'Tengo planes' },
  { id: 'u3', n: 3, title: 'Casa nueva, vida nueva' },
  { id: 'u4', n: 4, title: 'De fiesta' },
  { id: 'u5', n: 5, title: 'El gusto de aprender' },
  { id: 'u6', n: 6, title: 'Te lo compro' },
  { id: 'u7', n: 7, title: '¡Qué descanso!' },
  { id: 'u8', n: 8, title: 'Mirador' },
  { id: 'uw', n: 9, title: 'Werkwoorden' },
  { id: 'ug', n: 10, title: 'Grammatica en basis' },
];

/* Trefwoorden per unidad. Het eerste thema-slug dat matcht wint, dus de
 * volgorde binnen een lijst doet ertoe: zet specifieke termen vooraan.
 * De agenten leveren zowel Nederlandse als Spaanse slugs, dus beide staan erin. */
const UNIT_HINTS = {
  // Unidad 7 eerst: "lichaam" mag niet door een bredere regel opgeslokt worden.
  u7: ['lichaam', 'cuerpo', 'organen', 'orgaan', 'gezondheid', 'ziekte', 'ziektes', 'klachten',
       'salud', 'apotheek', 'medicijn', 'kwetsuur', 'rust', 'liedje', 'spel'],
  u3: ['huis', 'casa', 'meubel', 'mueble', 'kamer', 'habitacion', 'decoracion', 'decoratie',
       'electrodomestico', 'apparaat', 'toestel', 'keuken', 'cocina', 'verhuiz', 'wonen'],
  u2: ['hobby', 'hobbys', 'vrije-tijd', 'ocio', 'telefoon', 'afspraak', 'quedar',
       'eten', 'drinken', 'comida', 'bebida', 'restaurant', 'fruta', 'fruit', 'verdura',
       'groente', 'carne', 'vlees', 'pescado', 'vis', 'especia', 'kruid', 'legumbre',
       'peulvrucht', 'frutos-secos', 'preparacion', 'bereiding', 'aves', 'gevogelte',
       'postre', 'land', 'pais', 'nationaliteit', 'taal', 'idioma', 'plannen', 'toekomst'],
  u1: ['kleding', 'kleren', 'ropa', 'schoeisel', 'calzado', 'accessoire', 'complemento',
       'juweel', 'juwelen', 'joyeria', 'weer', 'clima', 'tiempo-atmosferico',
       'reizen', 'viaje', 'wandel', 'camino', 'vergelijk', 'comparativo'],
  u4: ['feest', 'fiesta', 'carnaval', 'posadas', 'fallas', 'traditie', 'cultuur'],
  u5: ['leren', 'aprender', 'school', 'kantoor', 'oficina', 'materiaal',
       'persoonlijkheid', 'karakter', 'personalidad'],
  u6: ['winkel', 'kopen', 'comprar', 'geld', 'dinero', 'kleur', 'color', 'stof', 'material'],
  u8: ['herhaling', 'repaso', 'mirador'],

  // Grammaticale steunstof uit de bundel.
  ug: ['interrogativo', 'vragend', 'adverbio', 'bijwoord', 'adjetivo', 'bijvoeglijk',
       'voornaamwoord', 'pronombre', 'aanwijzend', 'onbepaald', 'reflexief', 'wederkerend',
       'lidwoord', 'articulo', 'getal', 'numeral', 'hora', 'uur', 'dias', 'dag', 'maand',
       'mes', 'seizoen', 'grammaticatermen', 'grammatica', 'preposicion', 'voorzetsel'],
};

function unitFor(themeSlug) {
  // Vervoegingen krijgen hun eigen groep: ze horen bij geen enkele unidad in het
  // bijzonder en zouden anders een inhoudelijke unidad overspoelen.
  if (themeSlug.startsWith('ww-') || /^werkwoorden?-/.test(themeSlug)) return 'uw';

  for (const [unit, words] of Object.entries(UNIT_HINTS)) {
    if (words.some(w => themeSlug.includes(w))) return unit;
  }
  return 'ug';
}

/* Een emoji per thema, afgeleid van het drukst voorkomende woord-emoji. */
function themeEmoji(atoms) {
  const counts = new Map();
  for (const a of atoms) if (a.emoji) counts.set(a.emoji, (counts.get(a.emoji) ?? 0) + 1);
  return [...counts.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? '•';
}

const normEs = s => String(s).trim().toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '');

/* ---------------- inlezen ---------------- */

const files = (await readdir(dir)).filter(f => f.startsWith('out_') && f.endsWith('.json'));
if (!files.length) {
  console.error(`geen out_*.json gevonden in ${dir}`);
  process.exit(1);
}

const raw = [];
const themeLabels = new Map();

for (const f of files) {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(join(dir, f), 'utf8'));
  } catch (e) {
    console.error(`  ${f}: ongeldige JSON — overgeslagen (${e.message})`);
    continue;
  }
  if (!Array.isArray(parsed)) { console.error(`  ${f}: geen array — overgeslagen`); continue; }
  console.log(`  ${f}: ${parsed.length} records`);
  for (const a of parsed) {
    if (a.themeLabel && a.theme) themeLabels.set(a.theme, a.themeLabel);
    delete a.themeLabel;
    raw.push(a);
  }
}

/* ---------------- dubbels samenvoegen ---------------- */

const merged = new Map();     // sleutel -> atoom
let duplicates = 0;

for (const a of raw) {
  // Woordenschat ontdubbelen op het Spaanse lemma; de rest op id.
  const key = a.kind === 'vocab' ? `v|${normEs(a.es)}` : a.id;
  const existing = merged.get(key);

  if (!existing) { merged.set(key, a); continue; }
  duplicates++;

  // Vertalingen samenvoegen, aanvullende velden overnemen.
  if (a.nl) existing.nl = [...new Set([...(existing.nl ?? []), ...a.nl])];
  existing.emoji ??= a.emoji;
  existing.gender ??= a.gender;
  existing.number ??= a.number;
  if (a.note && !existing.note) existing.note = a.note;
  if (a.src && existing.src !== a.src) existing.src = `${existing.src}; ${a.src}`;
}

let atoms = [...merged.values()];

/* ---------------- gelijkwaardige thema's samenvoegen ----------------
 *
 * De agenten werken elk op hun eigen stapel bladzijden en verzinnen dus los van
 * elkaar een slug. Zo ontstaan "ropa" naast "kleding" en "viaje" naast "reizen":
 * hetzelfde onderwerp, twee rijen op de startpagina. Hier worden ze samengelegd
 * op hun genormaliseerde Nederlandse label, met een tabel voor de gevallen waar
 * de labels verschillen maar het onderwerp hetzelfde is. */

const THEME_ALIAS = {
  ropa: 'kleding', 'ropa-interior': 'ondergoed', accesorios: 'accessoires',
  'kleding-accessoires': 'accessoires', calzado: 'schoeisel', joyeria: 'juwelen',
  viaje: 'reizen', 'camino-de-santiago': 'camino', 'camino-inca': 'camino',
  ocio: 'vrije-tijd', 'vrije-tijd-cultuur': 'vrije-tijd', 'vrije-tijd-sport': 'sport',
  deportes: 'sport', 'tiempo-meteo': 'weer', casa: 'huis', 'huis-ruimtes': 'huis',
  'huis-onderdelen': 'huis', muebles: 'meubels', bano: 'badkamer',
  'keuken-en-badkamer': 'badkamer', electrodomesticos: 'apparaten',
  cuerpo: 'lichaam', 'lichaam-hoofd': 'lichaam', 'lichaam-romp': 'lichaam',
  'lichaam-extra': 'lichaam', lichaamsdelen: 'lichaam', organen: 'lichaam',
  salud: 'gezondheid', 'gezondheid-zorg': 'gezondheid', 'gezondheid-extra': 'gezondheid',
  'gezondheid-klachten': 'klachten', ziektes: 'klachten',
  rutina: 'dagelijkse-routine', 'dagelijkse-routine': 'dagelijkse-routine',
  telefono: 'telefoneren', gramatica: 'grammaticatermen',
  bebida: 'dranken', dulces: 'zoetigheden', pescado: 'vis', mariscos: 'zeevruchten',
  charcuteria: 'vleeswaren', queso: 'kaas', fruta: 'fruit', verdura: 'groenten',
  carne: 'vlees', especias: 'kruiden', legumbres: 'peulvruchten',
  'aves-caza': 'gevogelte', 'frutos-secos': 'noten', preparacion: 'bereiding',
  instrumentos: 'muziekinstrumenten', kleuren: 'kleuren', dias: 'dagen-en-maanden',
  seizoenen: 'dagen-en-maanden', hora: 'tijd-en-uur',
};

/* "De kleding", "Kleding" en "de  kleding" zijn hetzelfde label. */
const labelKey = s => String(s).toLowerCase()
  .replace(/^(de|het|een)\s+/, '')
  .replace(/[^a-zà-ÿ0-9]+/g, ' ')
  .trim();

/* Nette Nederlandse labels voor de slugs waar de alias naartoe wijst. */
const ALIAS_LABELS = {
  kleding: 'De kleding', ondergoed: 'Het ondergoed', accessoires: 'De accessoires',
  schoeisel: 'Het schoeisel', juwelen: 'De juwelen', reizen: 'Reizen en bagage',
  camino: 'De pelgrimsroutes', 'vrije-tijd': 'De vrije tijd', sport: 'De sport',
  weer: 'Het weer', huis: 'Het huis', meubels: 'De meubels', badkamer: 'Keuken en badkamer',
  apparaten: 'De elektrische toestellen', lichaam: 'Het lichaam',
  gezondheid: 'De gezondheid', klachten: 'Klachten en ziektes',
  'dagelijkse-routine': 'De dagelijkse routine', telefoneren: 'Telefoneren',
  grammaticatermen: 'Grammaticale termen', dranken: 'De dranken',
  zoetigheden: 'Zoetigheden en gebak', vis: 'De vis', zeevruchten: 'De zeevruchten',
  vleeswaren: 'De vleeswaren', kaas: 'De kaas', fruit: 'Het fruit',
  groenten: 'De groenten', vlees: 'Het vlees', kruiden: 'Kruiden en specerijen',
  peulvruchten: 'De peulvruchten', gevogelte: 'Gevogelte en wild', noten: 'De noten',
  bereiding: 'De bereidingswijzen', muziekinstrumenten: 'De muziekinstrumenten',
  kleuren: 'De kleuren', 'dagen-en-maanden': 'Dagen, maanden en seizoenen',
  'tijd-en-uur': 'Tijd en het uur',
};

const canonicalTheme = new Map();     // labelKey -> definitieve slug
let themeMerges = 0;

for (const a of atoms) {
  const from = a.theme;
  const slugged = THEME_ALIAS[from] ?? from;
  // Label van het ORIGINELE thema opzoeken — na het toewijzen is dat weg.
  const key = labelKey(ALIAS_LABELS[slugged] ?? themeLabels.get(from) ?? slugged);

  if (!canonicalTheme.has(key)) canonicalTheme.set(key, slugged);
  const target = canonicalTheme.get(key);

  if (from !== target) themeMerges++;
  a.theme = target;

  if (!themeLabels.has(target) || themeLabels.get(target) === target) {
    themeLabels.set(target, ALIAS_LABELS[target] ?? themeLabels.get(from) ?? target);
  }
}

/* ---------------- kleine thema's samenvoegen ---------------- */

const byTheme = new Map();
for (const a of atoms) {
  if (!byTheme.has(a.theme)) byTheme.set(a.theme, []);
  byTheme.get(a.theme).push(a);
}

const absorbed = [];
for (const [theme, list] of byTheme) {
  if (list.length >= MIN_THEME_SIZE || theme.startsWith('ww-')) continue;
  // Te klein: onderbrengen bij het grootste thema van dezelfde unidad.
  const unit = unitFor(theme);
  const target = [...byTheme.entries()]
    .filter(([t, l]) => t !== theme && l.length >= MIN_THEME_SIZE && unitFor(t) === unit)
    .sort((x, y) => y[1].length - x[1].length)[0];
  if (!target) continue;

  for (const a of list) {
    a.theme = target[0];
    a.id = a.id.replace(/^([a-z])\.[^.]+\./, `$1.${target[0]}.`);
  }
  target[1].push(...list);
  byTheme.delete(theme);
  absorbed.push(`${theme} (${list.length}) → ${target[0]}`);
}

/* Definitieve id's.
 *
 * Bewust ZONDER het thema erin. De voortgang in localStorage hangt aan deze
 * id's, en het thema is net het minst stabiele onderdeel: bij een volgende
 * generatie kiezen de agenten makkelijk een andere indeling. Het Spaanse lemma
 * ligt wel vast. Een woord verhuizen naar een ander thema laat de voortgang nu
 * dus ongemoeid; enkel het lemma corrigeren maakt een nieuw item. */
const slug = s => String(s).trim().toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const seenIds = new Set();
atoms = [...byTheme.values()].flat();
for (const a of atoms) {
  const base = a.kind === 'vocab' ? `v.${slug(a.es)}` : a.id;
  let id = base, n = 2;
  while (seenIds.has(id)) id = `${base}-${n++}`;
  a.id = id;
  seenIds.add(id);
}

/* ---------------- themaboom ---------------- */

const themes = [...byTheme.entries()]
  .map(([id, list]) => ({
    id,
    label: themeLabels.get(id) ?? id.replace(/-/g, ' '),
    unit: unitFor(id),
    emoji: themeEmoji(list),
    _n: list.length,
  }))
  .sort((a, b) => a.unit.localeCompare(b.unit) || b._n - a._n);

const usedUnits = new Set(themes.map(t => t.unit));
const units = UNITS.filter(u => usedUnits.has(u.id));
for (const t of themes) delete t._n;

/* ---------------- wegschrijven ---------------- */

const course = {
  schemaVersion: 1,
  course: 'Sí, claro nuevo 1.2',
  generatedAt: new Date().toISOString().slice(0, 10),
  units,
  themes,
  atoms: atoms.sort((a, b) => a.theme.localeCompare(b.theme) || a.id.localeCompare(b.id)),
};

const kinds = {};
for (const a of atoms) kinds[a.kind] = (kinds[a.kind] ?? 0) + 1;

console.log(`\n  ${raw.length} records ingelezen`);
console.log(`  ${duplicates} dubbele woorden samengevoegd`);
console.log(`  ${themeMerges} atomen naar een gelijkwaardig thema verplaatst`);
if (absorbed.length) console.log(`  kleine thema's samengevoegd:\n    ${absorbed.join('\n    ')}`);
console.log(`\n  ${atoms.length} atomen · ${themes.length} thema's · ${units.length} unidades`);
console.log(`  ${Object.entries(kinds).map(([k, v]) => `${k}: ${v}`).join(' · ')}`);
console.log(`  unidad-verdeling: ${units.map(u => `${u.n}:${themes.filter(t => t.unit === u.id).length}`).join(' ')}`);

if (dryRun) { console.log('\n  --dry: niets weggeschreven\n'); process.exit(0); }

const banner = `/* Sí, claro nuevo 1.2 — oefendata
 *
 * GEGENEREERD BESTAND — niet met de hand aanpassen.
 * Opnieuw maken:  node tools/merge.mjs <map-met-fragmenten>
 * Daarna:         node tools/validate.mjs
 *
 * Geladen via <script src> zodat de app ook vanaf file:// werkt.
 */
`;
await writeFile(OUT, `${banner}window.COURSE = ${JSON.stringify(course, null, 1)};\n`);
console.log(`\n  geschreven naar data/course.js\n`);
