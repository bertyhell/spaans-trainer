/* Zet de app klaar om te publiceren.
 *   node tools/release.mjs
 *
 * Verhoogt het cacheversienummer in sw.js op basis van de inhoud van de app.
 * Zonder die stap blijven telefoons die de app al geïnstalleerd hebben op de
 * oude woordenlijst hangen, ook al staat er nieuwe data op de server. */

import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const swPath = new URL('sw.js', root);
const versionPath = new URL('js/version.js', root);

const sw = await readFile(swPath, 'utf8');

/* Hash over alles wat de gebruiker te zien krijgt. */
const files = [...sw.matchAll(/'\.\/([^']+)'/g)].map(m => m[1]).filter(Boolean)
  // version.js zelf niet: het nummer verandert door deze stap.
  .filter(f => f !== 'js/version.js');
const hash = createHash('sha256');
let counted = 0;

for (const f of [...new Set(files)].sort()) {
  try {
    hash.update(await readFile(new URL(f, root)));
    counted++;
  } catch {
    console.warn(`  ontbreekt in sw.js-lijst: ${f}`);
  }
}

const version = hash.digest('hex').slice(0, 8);
const current = sw.match(/const CACHE = '([^']+)'/)?.[1];

if (current === `vamos-${version}`) {
  console.log(`\n  niets gewijzigd (${current})\n`);
  process.exit(0);
}

await writeFile(swPath, sw.replace(/const CACHE = '[^']+'/, `const CACHE = 'vamos-${version}'`));

const versionSrc = await readFile(versionPath, 'utf8');
const oldNr = versionSrc.match(/VERSION = '([\d.]+)'/)?.[1] ?? '1.0.0';
const [major, minor, patch] = oldNr.split('.').map(Number);
const newNr = `${major}.${minor}.${patch + 1}`;
await writeFile(versionPath, versionSrc.replace(/VERSION = '[\d.]+'/, `VERSION = '${newNr}'`));

console.log(`\n  ${counted} bestanden gehasht`);
console.log(`  cache: ${current} → vamos-${version}`);
console.log(`  versie: ${oldNr} → ${newNr}`);
console.log(`
  Publiceren:
    aws s3 sync . s3://<bucket>/ --exclude '.git/*' --exclude 'tools/*' --delete
  of duw de map naar de branch die GitHub Pages bedient.
`);
