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
const { corruptionsFor, corruptedWords, nounGenders } = await import('../js/types/spotError.js');
const { scramble, puzzleWord, decoyLetter } = await import('../js/types/letterPuzzle.js');
const { emojiDistractors } = await import('../js/types/emojiPick.js');
const { statementFor } = await import('../js/types/trueFalse.js');
const { tokenize, bare } = await import('../js/types/wordBank.js');
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

/* --- zoek de fout --- */
{
  const genders = nounGenders();
  t('geslacht: ventana is vrouwelijk', genders.get('ventana'), ['f', 'sg']);
  t('geslacht: meervoud erbij', genders.get('ventanas'), ['f', 'pl']);
  t('geslacht: el agua doet niet mee', genders.has('agua'), false);
  const sentences = data.allAtoms().filter(a => a.kind === 'sentence' || a.kind === 'dialogue');
  let supported = 0;
  const bad = [];
  for (const a of sentences) {
    const cs = corruptionsFor(a);
    if (cs.length) supported++;
    for (const c of cs) for (const wrong of c.wrongs) {
      const before = tokenize(a.es);
      const after = corruptedWords(a, c, wrong);
      const changed = after.map((w, i) => (w !== before[i] ? i : -1)).filter(i => i >= 0);
      if (changed.length !== 1 || changed[0] !== c.at || !c.pair.includes(c.at)) bad.push(a.id);
      if (bare(after[c.at]).toLowerCase() === bare(before[c.at]).toLowerCase()) bad.push(a.id);
    }
  }
  console.log(`zoek de fout: ${supported} van ${sentences.length} zinnen`);
  t('zoek de fout: genoeg zinnen', supported >= 50, true);
  t('zoek de fout: precies één woord anders', [...new Set(bad)], []);
  const fake = { id: 'test.yo', kind: 'sentence', es: 'Yo como en la cocina.' };
  t('zoek de fout: yo + werkwoord', corruptionsFor(fake).some(c => c.right === 'como'), true);
  t('zoek de fout: la cocina', corruptionsFor(fake).some(c => c.right === 'la' && c.wrongs[0] === 'el'), true);
  const name = { id: 'test.name', kind: 'sentence', es: 'El Dorada es un restaurante.' };
  t('zoek de fout: geen naam', corruptionsFor(name).some(c => c.at === 0), false);
  const prep = { id: 'test.prep', kind: 'sentence', es: 'Hablo mucho con él cada día.' };
  t('zoek de fout: niet na een voorzetsel', corruptionsFor(prep).some(c => c.right === 'cada'), false);
}

/* --- letterpuzzel --- */
{
  const same = (a, b) => [...a].sort().join('') === [...b].sort().join('');
  let wrongLetters = 0, inOrder = 0, puzzles = 0;
  for (const a of vocab) {
    const p = puzzleWord(a.es);
    if (!p) continue;
    puzzles++;
    const tiles = scramble(p.word);
    if (!same(tiles, p.word)) wrongLetters++;
    if (new Set(p.word).size > 1 && tiles.join('') === p.word) inOrder++;
  }
  console.log(`letterpuzzel: ${puzzles} woorden`);
  t('letterpuzzel: dezelfde letters', wrongLetters, 0);
  t('letterpuzzel: nooit al op volgorde', inOrder, 0);
  t('letterpuzzel: lidwoord apart', puzzleWord('la camisa'), { article: 'la', word: 'camisa' });
  t('letterpuzzel: geen woordgroep', puzzleWord('las zapatillas de deporte'), null);
  t('letterpuzzel: lokletter naast accent', decoyLetter('canción'), 'o');
  t('letterpuzzel: lokletter naast ñ', decoyLetter('niño'), 'n');
  t('letterpuzzel: met lokletter één tegel meer', scramble('casa', { decoy: 'o' }).length, 5);
}

/* --- welk plaatje? --- */
{
  let broken = 0;
  for (const a of vocab.filter(v => v.emoji)) {
    const ds = emojiDistractors(a);
    if (ds.length < 3) continue;
    const emoji = [a.emoji, ...ds.map(d => d.emoji)];
    if (new Set(emoji).size !== 4 || ds.some(d => data.shareGloss(d, a))) broken++;
  }
  t('welk plaatje: vier verschillende plaatjes', broken, 0);
}

/* --- klopt het? --- */
{
  // Twintig keer per atoom: elke foute bewering moet ook echt fout zijn.
  let falseButTrue = 0, statements = 0;
  const conj = data.allAtoms().filter(a => a.kind === 'conjugation');
  const label = (p, tn) => `${data.PERSON_LABELS[p]} · ${data.TENSE_LABELS[tn].split(' · ')[0]}`;
  for (const a of [...conj, ...vocab]) {
    for (let i = 0; i < 20; i++) {
      const s = statementFor({ atom: a, direction: 'es2nl' });
      if (!s || s.truth) continue;
      statements++;
      if (a.kind === 'vocab') {
        if (a.nl.includes(s.claim) || data.synonymsOf(a, {}).some(o => o.nl.includes(s.claim))) falseButTrue++;
      } else {
        for (const p of data.PERSON_ORDER) for (const tn of Object.keys(data.TENSE_LABELS)) {
          if (label(p, tn) === s.claim && data.conjugatedForm(a.verb, tn, p) === a.form) falseButTrue++;
        }
      }
    }
  }
  t('klopt het: foute beweringen gemaakt', statements > 1000, true);
  t('klopt het: fout is ook echt fout', falseButTrue, 0);
  const vt = data.allAtoms().find(a => a.kind === 'verbType' && a.type === 'onregelmatig');
  const always = () => 0;   // rnd() < 0.5: altijd een foute bewering
  if (vt) t('klopt het: onregelmatig wordt nooit klankveranderend', statementFor({ atom: vt }, always).claim, 'regelmatig');
}

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
