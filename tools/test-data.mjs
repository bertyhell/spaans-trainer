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
const { pluralPhrase } = await import('../js/types/plural.js');
const { sourceTenses } = await import('../js/types/tenseShift.js');
const { meaningDistractors } = await import('../js/types/sentenceMeaning.js');
const { wrongSentences } = await import('../js/types/pickSentence.js');
const { hintsFor, genderRule, conjugationHint } = await import('../js/hints.js');
const numerals = await import('../js/numerals.js');
const { hintPattern } = await import('../js/hintLadder.js');
const { glossFor } = await import('../js/gloss.js');
const { questionForm, tenseAlternatives } = await import('../js/types/conversation.js');
const { sentenceScore } = await import('../js/types/speak.js');
const { trickyDistractors } = await import('../js/types/multipleChoice.js');
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

/* --- meervoud --- */
t('meervoud: la casa', pluralPhrase('la casa'), 'las casas');
t('meervoud: el lápiz', pluralPhrase('el lápiz'), 'los lápices');
t('meervoud: la canción', pluralPhrase('la canción'), 'las canciones');
t('meervoud: el examen overgeslagen', pluralPhrase('el examen'), null);
t('meervoud: el lunes overgeslagen', pluralPhrase('el lunes'), null);
t('meervoud: el tour overgeslagen', pluralPhrase('el tour'), null);
t('meervoud: el agua overgeslagen', pluralPhrase('el agua'), null);

/* --- zet om --- */
const hablo = data.allAtoms().find(a => a.id === 'c.hablar.indefinido.1s');
if (hablo) t('zet om: presente naar indefinido', sourceTenses(hablo).includes('presente'), true);
const perf = data.allAtoms().find(a => a.kind === 'conjugation' && a.tense === 'perfecto');
if (perf) t('zet om: geen samengestelde tijd', sourceTenses(perf), []);

/* --- zinnen --- */
let meaningClash = 0, wrongIsRight = 0;
for (const a of data.allAtoms()) {
  if (a.kind === 'sentence' && typeof a.nl === 'string' && meaningDistractors(a).includes(a.nl)) meaningClash++;
  if (a.kind === 'sentence' || a.kind === 'dialogue') if (wrongSentences(a).some(w => w.text === a.es)) wrongIsRight++;
}
t('geen afleider is de juiste vertaling', meaningClash, 0);
t('geen foute zin is de juiste zin', wrongIsRight, 0);

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

/* --- ezelsbruggetjes --- */
{
  const tip = es => hintsFor(byEs(es) ?? { kind: 'none' }).join(' ');
  const conj = id => conjugationHint(data.getAtom(id) ?? {}) ?? '';
  t('tip: -ma is mannelijk', /Grieks/.test(tip('el programa')), true);
  t('tip: el agua', /beklemtoonde a/.test(tip('el agua con gas')), true);
  t('tip: -ción', /-ción/.test(tip('la infección')), true);
  t('tip: -dad', /-dad/.test(tip('la enfermedad')), true);
  t('tip: -dor met werkwoord', /comer = eten/.test(tip('el comedor')), true);
  t('tip: el paraguas is geen woord op -a', /eindigt op -a/.test(tip('el paraguas')), false);
  t('tip: la batería is geen winkel', /winkel/.test(tip('la batería')), false);
  t('tip: es- voor s + medeklinker', /schrijven/.test(tip('escribir')), true);
  t('tip: z wordt c', /lápices/.test(tip('el lápiz')), true);
  t('tip: eigen ezelsbrug eerst', hintsFor(byEs('desayunar'))[0], byEs('desayunar').memo);
  t('lidwoordregel: la mano', /vrouwelijk/.test(genderRule(byEs('la mano')) ?? ''), true);
  t('tip: laars buiten nosotros', /buiten de laars/.test(conj('c.pensar.presente.1p')), true);
  t('tip: laars binnen yo', /e → ie/.test(conj('c.pensar.presente.1s')), true);
  t('tip: tener toont de laars via él', /tiene/.test(conj('c.tener.presente.2s')), true);
  t('tip: go-werkwoord', /go-werkwoord/.test(conj('c.hacer.presente.1s')), true);
  t('tip: ser en ir in de indefinido', /ser en ir/.test(conj('c.ser.indefinido.1s')), true);
  t('tip: sterke verleden tijd', /Sterke/.test(conj('c.tener.indefinido.1s')), true);
  t('tip: geen accent-regel bij sois', /accent/.test(conj('c.ser.presente.2p')), false);
  const gap = data.allAtoms().find(a => a.kind === 'sentence');
  t('tip: invulzin met een vervoegde vorm', /tener.*laars/i.test(hintsFor(gap, { expected: 'tiene' })[0] ?? ''), true);
  t('tip: dubbelzinnige vorm krijgt niets', hintsFor(gap, { expected: 'fue' }), []);
  let empty = 0;
  for (const a of vocab) if (hintsFor(a).some(h => !h || h.includes('undefined'))) empty++;
  t('geen lege of halve tips', empty, 0);
  const memoed = vocab.filter(a => a.memo).length;
  t('ezelsbruggetjes in de data', memoed > 350, true);
}

/* --- hint bij het intypen --- */
t('hint 1: eerste letter en lengte', hintPattern('la corbata', 1), 'la   c _ _ _ _ _ _');
t('hint 2: om de andere letter', hintPattern('la corbata', 2), 'la   c _ r _ a _ a');
t('hint: één woord', hintPattern('comí', 1), 'c _ _ _');
t('hint: notatie wordt eerst uitgeschreven', hintPattern('el frigo(rífico)', 1), 'el   f _ _ _ _ _ _ _ _ _ _');

/* --- getallen --- */
const nw = numerals.numberWords;
t('getal 16', nw(16), 'dieciséis');
t('getal 21 / vóór een woord', [nw(21), nw(21, { noun: true })], ['veintiuno', 'veintiún']);
t('getal 31', nw(31), 'treinta y uno');
t('getal 100 / 101', [nw(100), nw(101)], ['cien', 'ciento uno']);
t('getal 555', nw(555), 'quinientos cincuenta y cinco');
t('getal 1000 / 2024', [nw(1000), nw(2024)], ['mil', 'dos mil veinticuatro']);
t('getal 21 000', nw(21000), 'veintiún mil');
t('uur 1:00', numerals.timeWords(1, 0).words, 'es la una');
t('uur 7:15', numerals.timeWords(7, 15).words, 'son las siete y cuarto');
t('uur 6:45 telt af van 7', numerals.timeWords(6, 45).words, 'son las siete menos cuarto');
t('uur 12:40 telt af van 1', numerals.timeWords(12, 40).words, 'es la una menos veinte');
t('uur: y quince mag ook', numerals.timeWords(7, 15).accepted.includes('las siete y quince'), true);
t('datum 1/5', numerals.dateWords(1, 5).accepted.includes('el primero de mayo'), true);
t('prijs 21,50', numerals.priceWords(21, 50).words, 'veintiún euros con cincuenta');
t('prijs 1 euro', numerals.priceWords(1, 0).words, 'un euro');
{
  const time = { kind: 'time', value: [7, 15], display: '7:15' };
  t('cijfers: 7:15, 7.15, 19u15', ['7:15', '7.15', '19u15', '07:15'].map(x => numerals.isDigits(time, x)), [true, true, true, true]);
  t('cijfers: 7:45 is niet 7:15', numerals.isDigits(time, '7:45'), false);
  const price = { kind: 'price', value: [12, 50], display: '12,50 €' };
  t('cijfers: prijs', ['12,50', '12.5', '€12,50', '12'].map(x => numerals.isDigits(price, x)), [true, true, true, false]);
  const num = { kind: 'number', value: 12000, display: '12000' };
  t('cijfers: 12.000 en 12 000', ['12000', '12.000', '12 000', '1200'].map(x => numerals.isDigits(num, x)), [true, true, true, false]);
  const date = { kind: 'date', value: [15, 3], display: '15/3' };
  t('cijfers: datum', ['15/3', '15-03', '3/15'].map(x => numerals.isDigits(date, x)), [true, true, false]);
  t('verwarrende buren: 60 ↔ 70', numerals.confusables({ kind: 'number', value: 64, display: '64' }).includes('74'), true);
  t('verwarrende buren: nooit het antwoord zelf', numerals.confusables(time).includes('7:15'), false);
}
let badSample = 0;
for (const a of data.allAtoms().filter(x => x.kind === 'numeral')) {
  for (let i = 0; i < 50; i++) {
    const smp = numerals.generate(a);
    if (!smp.words || !numerals.isDigits(smp, smp.display.replace(' €', '')) || numerals.confusables(smp).length < 3
      || !checkAnswer(smp.words, smp.accepted).correct) badSample++;
  }
}
t('elk berekend voorbeeld is na te kijken en heeft drie buren', badSample, 0);

/* --- verwarring en gelijkenis --- */
{
  // Twee woorden uit hetzelfde thema die geen vertaling delen.
  const one = vocab.find(a => data.siblings(a).some(o => o.kind === 'vocab'));
  const two = data.siblings(one).find(o => o.kind === 'vocab');
  t('verward: Spaans van een ander woord', data.confusedWith(one, two.es, 'nl2es')?.id, two.id);
  t('verward: Nederlands van een ander woord', data.confusedWith(one, two.nl[0], 'es2nl')?.id, two.id);
  // pedir = "vragen (om)" en preguntar = "vragen": voor de app synoniemen.
  if (byEs('pedir') && byEs('preguntar')) t('pedir en preguntar delen "vragen"', data.shareGloss(byEs('pedir'), byEs('preguntar')), true);
  if (gafas) t('geen verwarring met een synoniem', data.confusedWith(gafas, 'los lentes', 'nl2es'), null);
  t('geen verwarring bij onzin', data.confusedWith(vocab[0], 'xyzzy', 'nl2es'), null);
  let synonymLookalikes = 0;
  for (const a of vocab.slice(0, 300)) for (const l of data.lookalikes(a)) if (data.shareGloss(a, l.atom)) synonymLookalikes++;
  t('een gelijkend woord is nooit een synoniem', synonymLookalikes, 0);
  t('lastige afleiders zijn andere woorden', vocab.slice(0, 200).every(a => trickyDistractors(a).every(o => o.id !== a.id)), true);
}
{
  const hablo = data.allAtoms().find(a => a.kind === 'conjugation' && a.verb === 'hablar' && a.tense === 'presente' && a.person === '1s');
  t('minimaal paar: hablo / habló', data.minimalPartners(hablo).map(p => p.es), ['habló']);
}

/* --- woord in een zin --- */
{
  let wrongCase = 0, proper = 0, twice = 0;
  for (const a of vocab) {
    for (const c of data.contextsFor(a)) {
      if (c.es.slice(c.at, c.at + c.surface.length) !== c.surface) wrongCase++;
      if (/[→=()]/.test(c.es)) twice++;
      const before = c.es.slice(0, c.at).replace(/[\s"«—–-]+$/u, '');
      if (c.surface[0] !== c.surface[0].toLowerCase() && before && !/[.!?¿¡:]$/.test(before)) proper++;
    }
  }
  t('context: het woord staat waar gezegd', wrongCase, 0);
  t('context: geen opdrachtregels', twice, 0);
  t('context: geen namen midden in de zin', proper, 0);
  const granada = byEs('la granada');
  if (granada) t('context: Granada is geen granaatappel', data.contextsFor(granada).some(c => c.surface === 'Granada'), false);
  t('context: genoeg woorden hebben een zin', vocab.filter(a => data.contextsFor(a).length).length > 250, true);
}

/* --- gesprek --- */
{
  const comi = data.allAtoms().find(a => a.kind === 'conjugation' && a.verb === 'comer' && a.tense === 'indefinido' && a.person === '1s');
  t('antwoord op de vraag: comiste → comí', questionForm(comi), 'comiste');
  const comio = data.allAtoms().find(a => a.kind === 'conjugation' && a.verb === 'comer' && a.tense === 'indefinido' && a.person === '3s');
  t('antwoord op de vraag: niet voor él', questionForm(comio), null);
  const alts = tenseAlternatives(comi).map(x => x.tense).sort();
  t('welke tijd: de andere drie tijden', alts, ['imperfecto', 'perfecto', 'presente']);
}

/* --- spreken --- */
t('spreken: zelfde zin', sentenceScore('¿Dónde está la playa?', 'donde esta la playa'), 1);
t('spreken: cijfers tellen als woorden', sentenceScore('Tengo dos hermanos.', 'tengo 2 hermanos'), 1);
t('spreken: één woord fout op vier', sentenceScore('Tengo dos hermanos mayores.', 'tengo tres hermanos mayores'), 0.75);

/* --- woordbetekenis in leesteksten --- */
t('betekenis: woord uit de lijst', glossFor('corbata')?.lines[0]?.startsWith('la corbata'), true);
t('betekenis: leestekens eraf', glossFor('¿corbata?')?.word, 'corbata');
t('betekenis: meervoud', glossFor('corbatas')?.lines[0]?.startsWith('la corbata'), true);
t('betekenis: vervoeging', /ir|ser/.test(glossFor('fuimos')?.lines.join(' ') ?? ''), true);
t('betekenis: klein woordje', glossFor('pero')?.lines.join(' ').includes('maar'), true);
t('betekenis: onbekend is null', glossFor('xyzzy'), null);
t('betekenis: wederkerend', /levantar/.test(glossFor('levanto')?.lines.join(' ') ?? ''), true);
t('betekenis: voltooid deelwoord', /deelwoord van hablar/.test(glossFor('hablado')?.lines.join(' ') ?? ''), true);

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
