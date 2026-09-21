/* Eenheidstests voor de antwoordcontrole. Geen afhankelijkheden.
 * Uitvoeren:  node tools/test-check.mjs  */

import { checkAnswer, stripAccents, levenshtein, stripArticle } from '../js/check.js';

let failed = 0;
const results = [];

function t(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  results.push([ok, label, actual, expected]);
}

function answer(input, accepted, opts) {
  return checkAnswer(input, accepted, opts).correct;
}
function note(input, accepted) {
  return checkAnswer(input, accepted).note;
}

/* --- exacte en alternatieve antwoorden --- */
t('exacte match', answer('canción', ['canción']), true);
t('alternatief antwoord', answer('stropdas', ['de das', 'de stropdas']), true);
t('lidwoord mag weg', answer('das', ['de das']), true);
t('lidwoord mag erbij', answer('de das', ['das']), true);
t('hoofdletters maken niet uit', answer('De Das', ['de das']), true);
t('extra spaties maken niet uit', answer('  de   das ', ['de das']), true);
t('punt op het einde mag', answer('de das.', ['de das']), true);

/* --- accenten: aanvaard, maar met correctie --- */
t('ontbrekend accent aanvaard', answer('cancion', ['canción']), true);
t('ontbrekend accent geeft opmerking', /Let op de accenten/.test(note('cancion', ['canción'])), true);
t('juist accent geeft geen opmerking', note('canción', ['canción']), null);
t('strictAccents weigert', answer('cancion', ['canción'], { strictAccents: true }), false);

/* --- de ñ is een eigen letter, geen accent --- */
t('ano is niet año', answer('ano', ['año']), false);
t('año exact', answer('año', ['año']), true);
t('stripAccents behoudt ñ', stripAccents('año'), 'año');
t('stripAccents verwijdert accent', stripAccents('canción'), 'cancion');
t('stripAccents gemengd', stripAccents('mañana está'), 'mañana esta');

/* --- typefouten --- */
t('één typefout aanvaard', answer('corbatta', ['la corbata']), true);
t('typefout geeft opmerking', /Typfoutje/.test(note('corbatta', ['la corbata'])), true);
t('twee typefouten geweigerd', answer('corbbatta', ['la corbata']), false);
t('kort woord: geen typefoutmarge', answer('tuvo', ['tuve']), false);
t('ander woord geweigerd', answer('la mesa', ['la corbata']), false);

/* --- rejectNear: andere vervoegingen zijn geen typefouten --- */
const PERSONS = ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'];
t('andere persoon geweigerd (kort)',
  answer('tuvo', ['tuve'], { rejectNear: PERSONS }), false);
t('andere persoon geweigerd (lang)',
  answer('tuvimos', ['tuvisteis'], { rejectNear: PERSONS }), false);
t('juiste persoon blijft juist',
  answer('tuvisteis', ['tuvisteis'], { rejectNear: PERSONS }), true);
t('echte typefout blijft aanvaard',
  answer('tuvisteiss', ['tuvisteis'], { rejectNear: PERSONS }), true);

/* --- randgevallen --- */
t('leeg antwoord', answer('', ['algo']), false);
t('enkel spaties', answer('   ', ['algo']), false);
t('null antwoord', answer(null, ['algo']), false);
t('string i.p.v. array', answer('hola', 'hola'), true);

/* --- hulpfuncties --- */
t('stripArticle haalt er één weg', stripArticle('de las botas'), 'las botas');
t('stripArticle laat de rest staan', stripArticle('gafas de sol'), 'gafas de sol');
t('levenshtein basis', levenshtein('kat', 'kar'), 1);
t('levenshtein afbreking', levenshtein('abcdef', 'xyzuvw', 1), 2);

/* --- rapport --- */
const width = Math.max(...results.map(r => r[1].length));
for (const [ok, label, actual, expected] of results) {
  const line = `${ok ? '  ok  ' : ' FAIL '} ${label.padEnd(width)}`;
  console.log(ok ? line : `${line}  kreeg ${JSON.stringify(actual)}, verwacht ${JSON.stringify(expected)}`);
}
console.log(`\n${results.length - failed}/${results.length} geslaagd`);
process.exit(failed ? 1 : 0);
