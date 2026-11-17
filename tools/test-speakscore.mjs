/* Eenheidstests voor het oordeel in de spreekmodus (js/speakScore.js) en de
 * tokenizer van Whisper (js/voice/whisper.js). Geen afhankelijkheden, geen
 * modellen: het bewijs per woord wordt hier met de hand ingevuld.
 * Uitvoeren:  node tools/test-speakscore.mjs */

import { judge, simplePhones, phoneMatch, expectedWords, forcedPerWord, wordState, sayText } from '../js/speakScore.js';
import { Tokenizer, logMel } from '../js/voice/whisper.js';

let failed = 0;
const results = [];
function t(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  results.push([ok, label, actual, expected]);
}
const states = r => r.words.map(w => w.state).join(' ');

/* --- klanken vergelijken, niet de spelling --- */
t('b, v en β zijn gelijk', simplePhones('ˈba.ka') .join(''), simplePhones('ˈβa.ka').join(''));
t('θ en s zijn gelijk', simplePhones('ˈθe.na').join(''), simplePhones('ˈse.na').join(''));
t('ʎ en ʝ zijn gelijk', simplePhones('ˈʎa.ma').join(''), simplePhones('ˈʝa.ma').join(''));
t('tʃ is één klank', simplePhones('ˈmu.tʃo'), ['m', 'u', 'c', 'o']);
t('alle klanken teruggevonden', phoneMatch(expectedWords('la casa'), simplePhones('la ˈka.sa')), [1, 1]);

/* --- alleen wat Whisper hoorde (zonder bewijs) --- */
t('zelfde zin: juist', judge('¿Cómo te llamas?', 'Como te llamas').verdict, 'ok');
t('andere spelling, zelfde klank: juist', judge('Voy a ver la casa.', 'Boy a ber la caza').verdict, 'ok');
t('"a ver" voor "haber": juist', judge('Va a haber fiesta.', 'Va a a ver fiesta').verdict, 'ok');
t('cijfers in wat gehoord werd', judge('Tengo veinticinco años.', 'Tengo 25 años').verdict, 'ok');
t('niets gehoord is fout', judge('¿Cómo te llamas?', '').verdict, 'wrong');
t('een andere zin is fout', judge('Me gusta mucho el chocolate.', 'Hoy hace calor en la playa').verdict, 'wrong');
t('per woord gekleurd', states(judge('Me gusta mucho el chocolate.', 'Me gusta mucho el')), 'ok ok ok ok miss');

/* --- met het bewijs per woord --- */
t('veel bewijs: goed, ook als Whisper het niet verstond', wordState(0, 3.5), 'ok');
t('wat bewijs: bijna', wordState(0, 1.4), 'close');
t('geen bewijs maar wel de klanken: goed', wordState(0.8, 0.2), 'ok');
t('klanken lijken, maar bewijs negatief: niet goed', wordState(0.8, -1), 'miss');
t('niets: gemist', wordState(0.1, -0.5), 'miss');
// Het kleine model verstaat "Asistió a clase" als "¡Aseis, tío! ¡Acláce!", maar het geluid steunt elk woord.
t('verhaspeld verstaan, sterk bewijs: juist', judge('Asistió a clase.', '¡Aseis, tío! ¡Acláce!', [4.2, 2.5, 5.1]).verdict, 'ok');
t('één inhoudswoord gemist: bijna', judge('Bastante bien. Hay que practicar todos los días.', 'Bastante bien. Hay que caminar todos los días.', [5, 4, 3, 3, -2, 4, 3, 5]).verdict, 'almost');
t('los woord dat bijna lukte: bijna', judge('pobre', 'Dónde', [1.2]).verdict, 'almost');
t('los woord dat niet lukte: fout', judge('pobre', 'Gracias', [-0.5]).verdict, 'wrong');
t('halve zin: fout', judge('Mañana vamos a la playa con mis amigos.', 'Mañana vamos a la', [5, 4, 3, 3, -1, -2, -1, -3]).verdict, 'wrong');

/* --- tokens van Whisper aan woorden koppelen --- */
const words = expectedWords('Hola, ¿qué tal?');
t('woorden met hun plaats in de tekst', words.map(w => [w.text, w.start, w.end]), [['Hola', 0, 4], ['qué', 7, 10], ['tal', 11, 14]]);
t('bewijs per woord, leestekens tellen niet', forcedPerWord(words, [
  { start: 0, end: 4 }, { start: 4, end: 5 }, { start: 5, end: 7 }, { start: 7, end: 10 }, { start: 10, end: 14 },
], [1, 9, 9, 2, 3]), [1, 2, 3]);

/* --- wat er nagezegd wordt --- */
t('woord uit de woordenlijst, notatie weg', sayText({ kind: 'vocab', es: 'el frigo(rífico)' }), 'el frigorífico');
t('zin met een gat: niet', sayText({ kind: 'sentence', es: 'Yo ___ en Gante.' }), null);
t('vervoeging: niet', sayText({ kind: 'conjugation', form: 'tengo' }), null);

/* --- tokenizer (met een mini-woordenschat) --- */
const vocab = { 'Ġh': 0, o: 1, l: 2, a: 3, 'Ġhola': 4, 'Ġ': 5, h: 6, 'ola': 7 };
const tok = new Tokenizer(vocab, '#version: 0.2\nĠ h\no l\nol a\nĠh ola\n');
t('BPE: samenvoegen volgens rang', tok.encode(' hola').map(x => x.id), [4]);
t('BPE: posities in de tekst', tok.encode(' hola').map(x => [x.start, x.end]), [[0, 5]]);
t('decode', tok.decode([4]), 'hola');

/* --- log-mel --- */
const mel = logMel(new Float32Array(1600));
t('log-mel: 80 × 3000', mel.length, 80 * 3000);
t('log-mel van stilte is overal gelijk', new Set(mel).size, 1);

/* --- rapport --- */
const width = Math.max(...results.map(r => r[1].length));
for (const [ok, label, actual, expected] of results) {
  const line = `${ok ? '  ok  ' : ' FAIL '} ${label.padEnd(width)}`;
  console.log(ok ? line : `${line}  kreeg ${JSON.stringify(actual)}, verwacht ${JSON.stringify(expected)}`);
}
console.log(`\n${results.length - failed}/${results.length} geslaagd`);
process.exit(failed ? 1 : 0);
