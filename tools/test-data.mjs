/* Tests die de echte oefendata nodig hebben: synoniemen, afleiders,
 * vervoegingen. Draait zonder browser.
 *   node tools/test-data.mjs  */

import { readFile } from 'node:fs/promises';

const store = new Map();
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  clear: () => store.clear(),
};
globalThis.window = globalThis;
new Function(await readFile(new URL('../data/course.js', import.meta.url), 'utf8'))();

const data = await import('../js/data.js');
const { describeForm, otherForms } = await import('../js/types/conjugation.js');
const { checkAnswer } = await import('../js/check.js');
const { pluralOf, formsOf } = await import('../js/types/agreement.js');
const { wordDiff } = await import('../js/types/dictation.js');
data.init();

let failed = 0;
const rows = [];
function t(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  rows.push([ok, label, actual, expected]);
}

const vocab = data.allAtoms().filter(a => a.kind === 'vocab');
const byEs = es => vocab.find(a => a.es === es);

/* --- synoniemen --- */
const gafas = byEs('las gafas');
if (gafas) {
  t('synoniem: de bril', data.synonymsOf(gafas, { gloss: gafas.nl[0] }).some(o => o.es === 'los lentes'), true);
  t('synoniem is geen afleider', data.siblings(gafas).some(o => o.es === 'los lentes'), false);
}
let clashes = 0;
for (const a of vocab) for (const s of data.siblings(a)) if (s.kind === 'vocab' && data.shareGloss(a, s)) clashes++;
t('geen afleider deelt een vertaling', clashes, 0);

/* --- vervoegingen --- */
t('alle vormen van hablar bevatten habló', data.verbForms('hablar').includes('habló'), true);
t('otherForms laat de vorm zelf weg', otherForms('hablar', 'habló').includes('habló'), false);
t('hablo voor habló geweigerd', checkAnswer('hablo', ['habló'], { rejectNear: otherForms('hablar', 'habló') }).correct, false);
t('describeForm noemt persoon en tijd', /yo.*presente/.test(describeForm('hablar', 'hablo') ?? ''), true);
t('conjugationsOfForm', data.conjugationsOfForm('tengo').some(a => a.verb === 'tener'), true);

/* --- bijvoeglijke naamwoorden laten overeenkomen --- */
t('meervoud op klinker', pluralOf('rojo'), 'rojos');
t('meervoud op medeklinker', pluralOf('azul'), 'azules');
t('meervoud: accent valt weg', pluralOf('alemán'), 'alemanes');
t('meervoud: inglés', pluralOf('inglés'), 'ingleses');
t('meervoud: z wordt ces', pluralOf('feliz'), 'felices');
t('vier vormen uit de notatie', formsOf('alemán/-ana'), { m: { sg: 'alemán', pl: 'alemanes' }, f: { sg: 'alemana', pl: 'alemanas' } });
t('onveranderlijk', formsOf('belga').f.pl, 'belgas');

/* --- dictee --- */
t('dictee: vergeten woord', wordDiff('me llamo', 'Me llamo Ana').missed, ['ana']);
t('dictee: accent', wordDiff('esta en casa', 'Está en casa').accents, ['está']);
t('dictee: fout woord', wordDiff('tengo un perro', 'tengo dos perros').missed, ['dos', 'perros']);

/* --- offline: elk script staat in de lijst van de service worker --- */
{
  const { readdir } = await import('node:fs/promises');
  const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  const root = new URL('../js/', import.meta.url);
  const files = (await readdir(root, { recursive: true })).filter(f => f.endsWith('.js')).map(f => `./js/${f}`);
  t('alle scripts staan in sw.js', files.filter(f => !sw.includes(`'${f}'`)), []);
}

/* --- rapport --- */
const width = Math.max(...rows.map(r => r[1].length));
for (const [ok, label, actual, expected] of rows) {
  const line = `${ok ? '  ok  ' : ' FAIL '} ${label.padEnd(width)}`;
  console.log(ok ? line : `${line}  kreeg ${JSON.stringify(actual)}, verwacht ${JSON.stringify(expected)}`);
}
console.log(`\n${rows.length - failed}/${rows.length} geslaagd`);
process.exit(failed ? 1 : 0);
