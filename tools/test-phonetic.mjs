/* Eenheidstests voor de klankschrift (js/phonetic.js) en de stem-id's
 * (js/voice/piper.js). Geen afhankelijkheden.
 * Uitvoeren:  node tools/test-phonetic.mjs
 *
 * De verwachte stem-fonemen zijn die van espeak-ng 1.52 (het programma
 * waarmee de Piper-stem getraind is), behalve waar espeak zich vergist:
 * pingüino, nicaragüense, Wright. */

import { ipa, phonemes, spoken, tokens, ipaWords } from '../js/phonetic.js';
import { phonemeIds } from '../js/voice/piper.js';
import { readFileSync } from 'node:fs';

let failed = 0;
const results = [];
function t(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  results.push([ok, label, actual, expected]);
}

/* --- klankschrift voor de leerder --- */
t('zin met klemtoon en lettergrepen', ipa('¿Cómo te llamas?'), '[ˈko.mo te ˈʎa.mas]');
t('pauze bij een komma, klemtoon op éénlettergrepige woorden', ipa('Hola, ¿qué tal?'), '[ˈo.la | ˈke ˈtal]');
t('zachte b/d/g tussen klinkers, ook over woorden heen', ipa('un vaso de agua'), '[ˈum ˈba.so ðe ˈa.ɣwa]');
t('n wordt ŋ vóór k/g/x', ipa('tengo cinco años'), '[ˈteŋ.ɡo ˈθiŋ.ko ˈa.ɲos]');
t('d blijft hard na l', ipa('el dedo'), '[el ˈde.ðo]');
t('tweeklank, geen hiaat na l (luego)', ipa('luego'), '[ˈlwe.ɣo]');
t('stomme h breekt geen tweeklank', ipa('prohibido'), '[pɾoj.ˈβi.ðo]');
t('accent maakt hiaat', ipa('María'), '[ma.ˈɾi.a]');
t('gü klinkt als ɡw', ipa('pingüino'), '[piŋ.ˈɡwi.no]');
t('hie- klinkt als ʝ', ipa('hielo'), '[ˈʝe.lo]');
t('x tussen klinkers is ks, aan het begin s', ipa('examen xilófono'), '[ek.ˈsa.men si.ˈlo.fo.no]');
t('-mente: twee klemtonen', ipa('rápidamente'), '[ˌra.pi.ða.ˈmen.te]');
t('sobre na een lidwoord is een naamwoord', ipa('el sobre'), '[el ˈso.βɾe]');
t('sobre als voorzetsel is klemtoonloos', ipa('sobre la mesa'), '[so.βɾe la ˈme.sa]');
t('México met [x]', ipa('México'), '[ˈme.xi.ko]');
t('rr en r aan het begin: [r], anders [ɾ]', ipa('perro caro rosa'), '[ˈpe.ro ˈka.ɾo ˈro.sa]');
t('pero is klemtoonloos', ipa('pero no'), '[pe.ɾo ˈno]');
t('zin over twee zinnen', ipa('Muy bien. ¿Y tú?'), '[ˈmuj ˈβjen ‖ i ˈtu]');

/* --- uitschrijven: getallen, afkortingen, leenwoorden --- */
t('getal voluit', spoken('Tengo 25 años.'), 'tengo veinticinco años');
t('jaartal', spoken('En 1875'), 'en mil ochocientos setenta y cinco');
t('un vóór een naamwoord', spoken('21 años'), 'veintiún años');
t('una vóór een vrouwelijk naamwoord', spoken('1 casa'), 'una casa');
t('uno vóór "de"', spoken('el 31 de agosto'), 'el treinta y uno de agosto');
t('euro en procent', spoken('750 € y 15 %'), 'setecientos cincuenta euros y quince por ciento');
t('Romeins cijfer na siglo', spoken('el siglo XVII'), 'el siglo diecisiete');
t('losse hoofdletter is een letternaam', spoken('la M.'), 'la eme');
t('señor X', spoken('¿Está el señor X?'), 'está el señor equis');
t('niveau A2', spoken('el nivel A2'), 'el nivel a dos');
t('afkorting Sr.', spoken('el Sr. García'), 'el señor garcía');
t('leenwoord zoals in Spanje', spoken('hacer footing'), 'hacer fútin');
t('Wright', ipa('Wright'), '[ˈrajt]');
t('uur', spoken('a las 7:30'), 'a las siete y media');
t('punt na een getal is een leesteken', tokens('hasta las 10.').map(x => x.text), ['hasta', 'las', '10', '.']);

/* --- per woord, voor onder de zin --- */
t('ipaWords houdt leestekens apart', ipaWords('¡Hola, Ana!'), [
  { text: '¡', ipa: null }, { text: 'Hola', ipa: 'ˈo.la' }, { text: ',', ipa: null }, { text: 'Ana', ipa: 'ˈa.na' }, { text: '!', ipa: null },
]);

/* --- de stem: espeak-ng-stijl --- */
const ESPEAK = [
  ['¿Cómo te llamas?', 'kˈomo te ʎˈamas?'],
  ['Me gusta mucho el chocolate.', 'me ɣˈusta mˈutʃo el tʃˌokolˈate.'],
  ['Un vaso de agua, por favor.', 'ˈum bˈaso ðe ˈaɣwa, poɾ faβˈoɾ.'],
  ['Tengo 25 años.', 'tˈɛŋɡo βˌeɪntiθˈinko ˈaɲos.'],
  ['muy bien', 'mˈuj βjˈen'],
  ['hay', 'ˈaɪ'],
  ['estoy', 'estˈoɪ'],
  ['ciudad', 'θjuðˈad'],
  ['cuidado', 'kwiðˈaðo'],
  ['ruido', 'ruˈiðo'],
  ['Luis', 'luˈis'],
  ['barrio', 'bˈario'],
  ['corriendo', 'kˌoriˈɛndo'],
  ['nuestro padre', 'nwˌestɾo pˈaðɾe'],
  ['alérgico a', 'alˈeɾxiko ˈa'],
  ['rápidamente', 'rˈapiðamˈente'],
  ['septiembre', 'sepːtjˈembɾe'],
  ['enfrente de', 'emfɾˈɛnte ðˈe'],
  ['Estáis vendiendo.', 'estˈais βendjˈɛndo.'],
  ['dieciséis', 'djˌeθisˈeis'],
  ['Los martes y los jueves, de seis a ocho.', 'los mˈaɾtes i los xwˈeβes, ðe sˈeɪs a ˈotʃo.'],
  ['el examen', 'el eksˈamen'],
  ['hielo', 'jˈelo'],
  ['huevo', 'wˈeβo'],
  ['extranjero', 'ˌekstɾaŋxˈeɾo'],
  ['inglés', 'iŋɡlˈes'],
  ['un gato', 'ˈuŋ ɡˈato'],
  ['en casa', 'en kˈasa'],
  ['naranja', 'naɾˈaŋxa'],
  ['el yogur', 'el ʝoɣˈuɾ'],
  ['desde', 'dˈesðe'],
  ['absoluto', 'ˌaβsolˈuto'],
  ['obvio', 'ˈobβjo'],
  ['Madrid', 'maðɾˈid'],
  ['la verdad', 'la βeɾðˈad'],
  ['departamento', 'dˌepaɾtamˈɛnto'],
  ['universidad', 'ˌuniβˌeɾsiðˈad'],
  ['extraordinario', 'ˌekstɾaˌoɾðinˈaɾjo'],
  ['organización', 'ˌoɾɣanˌiθaθjˈon'],
  ['prohibido', 'pɾˌoiβˈiðo'],
  ['guitarra', 'ɡitˈara'],
  ['antiguo', 'antˈiɣwo'],
  ['Enrique', 'enrˈike'],
  ['alrededor', 'ˌalreðeðˈoɾ'],
  ['Israel', 'ˌisraˈel'],
  ['psicólogo', 'sikˈoloɣo'],
  ['xilófono', 'silˈofono'],
  ['acción', 'akθjˈon'],
  // Hier vergist espeak zich ("pˌiŋɡuˈino"): wij zeggen het zoals het hoort.
  ['pingüino', 'piŋɡwˈino'],
];
for (const [text, want] of ESPEAK) t(`stem: ${text}`, phonemes(text).join(' '), want);
t('stem: één string per zin', phonemes('Muy bien. Yo todavía no.'), ['mˈuj βjˈen.', 'dʒˈo tˌoðaβˈia nˈo.']);

/* --- fonemen → id's, zoals piper het doet --- */
const config = JSON.parse(readFileSync(new URL('../models/es_ES-davefx-medium.onnx.json', import.meta.url), 'utf8'));
const ids = phonemeIds('ˈaɪ', config);
const map = config.phoneme_id_map;
t('id\'s: begin, opvulling, cluster aɪ, einde', ids, [...map['^'], ...map._, ...map['ˈ'], ...map._, ...map['aɪ'], ...map._, ...map.$]);
t('id\'s: tʃ is twee tekens', phonemeIds('tʃ', config).length, 2 + 2 * 2 + 1);
t('elke klank van de stem bestaat in het model', [...new Set(ESPEAK.flatMap(([text]) => [...phonemes(text).join(' ').normalize('NFD')]))].filter(c => !map[c]), []);

/* --- rapport --- */
const width = Math.max(...results.map(r => r[1].length));
for (const [ok, label, actual, expected] of results) {
  const line = `${ok ? '  ok  ' : ' FAIL '} ${label.padEnd(width)}`;
  console.log(ok ? line : `${line}  kreeg ${JSON.stringify(actual)}, verwacht ${JSON.stringify(expected)}`);
}
console.log(`\n${results.length - failed}/${results.length} geslaagd`);
process.exit(failed ? 1 : 0);
