/* Basiswoorden en -grammatica die Sí, claro 1.2 als gekend veronderstelt
 * (ze komen uit deel 1.1) maar nergens zelf oefent: de rest van de kleuren,
 * de maanden, de getallen, waar iets staat, gustar en por/para.
 *
 * Geen boektekst: eigen woordenlijsten en zinnen, op A1-niveau. Elk atoom
 * draagt daarom de bronvermelding "Aanvulling A1" in plaats van een scan. */

const SRC = 'Aanvulling A1 (niet uit het boek)';

const slug = es => es.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9ñ]+/g, '-').replace(/^-|-$/g, '');

/** [es, nl, extra?] → woordenschatatoom. */
const words = (theme, pos, list) => list.map(([es, nl, extra = {}]) => ({
  id: `v.${slug(es)}`, kind: 'vocab', theme, es, nl: [].concat(nl), pos,
  gender: null, number: null, srcLabel: SRC, ...extra,
}));

/** [es met het antwoord erin, nl, antwoord, opties] → invulzin. */
const sentences = ({ slug: s, theme, grammarRef, instruction }, list) =>
  list.map(([es, nl, answer, options], i) => ({
    id: `s.a1.${s}-${i + 1}`, kind: 'sentence', theme, es, nl,
    blanks: [{ answer, options }], instruction, grammarRef, srcLabel: SRC,
  }));

/* --- kleuren: de vier die ontbraken --- */
const colours = words('kleuren', 'adj', [
  ['rojo/-a', 'rood', { emoji: '🟥' }],
  ['verde', 'groen', { emoji: '🟩' }],
  ['negro/-a', 'zwart', { emoji: '⬛' }],
  ['blanco/-a', 'wit', { emoji: '⬜' }],
  ['morado/-a', 'paars', { emoji: '🟪' }],
]);

/* --- maanden: kleine letter, zonder lidwoord --- */
const months = words('dagen-en-maanden', 'noun', [
  ['enero', 'januari'], ['febrero', 'februari'], ['marzo', 'maart'], ['abril', 'april'],
  ['mayo', 'mei'], ['junio', 'juni'], ['julio', 'juli'], ['agosto', 'augustus'],
  ['septiembre', 'september'], ['octubre', 'oktober'], ['noviembre', 'november'], ['diciembre', 'december'],
  ['el mes', 'de maand', { gender: 'm', number: 'sg' }],
].map(([es, nl, extra = { gender: 'm', number: 'sg', note: 'Maanden schrijf je met een kleine letter.' }]) => [es, nl, extra]));

/* --- getallen --- */
const numbers = words('getallen', 'other', [
  ['cero', 'nul'], ['uno', ['één', 'een']], ['dos', 'twee'], ['tres', 'drie'], ['cuatro', 'vier'],
  ['cinco', 'vijf'], ['seis', 'zes'], ['siete', 'zeven'], ['ocho', 'acht'], ['nueve', 'negen'],
  ['diez', 'tien'], ['once', 'elf'], ['doce', 'twaalf'], ['trece', 'dertien'], ['catorce', 'veertien'],
  ['quince', 'vijftien'], ['dieciséis', 'zestien'], ['diecisiete', 'zeventien'], ['dieciocho', 'achttien'],
  ['diecinueve', 'negentien'], ['veinte', 'twintig'],
  ['veintiuno', 'eenentwintig', { note: 'Van 21 tot 29 in één woord: veintidós, veintitrés …' }],
  ['treinta', 'dertig'], ['treinta y uno', 'eenendertig', { note: 'Vanaf 31 met y: cuarenta y dos, noventa y nueve.' }],
  ['cuarenta', 'veertig'], ['cincuenta', 'vijftig'], ['sesenta', 'zestig'], ['setenta', 'zeventig'],
  ['ochenta', 'tachtig'], ['noventa', 'negentig'],
  ['cien', 'honderd', { note: 'Precies 100 is cien; daarboven ciento: ciento uno, ciento veinte.' }],
  ['mil', 'duizend'],
]);

const ordinals = words('getallen', 'adj', [
  ['primero/-a', 'eerste', { note: 'Voor een mannelijk woord: el primer día.' }],
  ['segundo/-a', 'tweede'], ['tercero/-a', 'derde', { note: 'Voor een mannelijk woord: el tercer piso.' }],
  ['cuarto/-a', 'vierde'], ['quinto/-a', 'vijfde'], ['sexto/-a', 'zesde'],
  ['séptimo/-a', 'zevende'], ['octavo/-a', 'achtste'], ['noveno/-a', 'negende'], ['décimo/-a', 'tiende'],
]);

/* --- waar staat het? --- */
const places = words('waar-is-het', 'other', [
  ['delante de', 'voor'], ['detrás de', 'achter'], ['encima de', ['op', 'boven']],
  ['debajo de', 'onder'], ['al lado de', 'naast'], ['entre', 'tussen'],
  ['enfrente de', 'tegenover'], ['a la izquierda de', 'links van'], ['a la derecha de', 'rechts van'],
  ['dentro de', ['in', 'binnenin']], ['fuera de', 'buiten'],
]);

const PLACES = ['delante de', 'detrás de', 'encima de', 'debajo de', 'al lado de', 'enfrente de'];
const placeSentences = sentences({
  slug: 'waar', theme: 'waar-is-het', instruction: 'Waar is het? Kies het juiste woord',
}, [
  ['El gato está debajo de la mesa.', 'De kat zit onder de tafel.', 'debajo de', PLACES.slice(0, 4)],
  ['Las llaves están encima de la mesa.', 'De sleutels liggen op de tafel.', 'encima de', PLACES.slice(0, 4)],
  ['El coche está delante de la casa.', 'De auto staat voor het huis.', 'delante de', PLACES.slice(0, 4)],
  ['El jardín está detrás de la casa.', 'De tuin ligt achter het huis.', 'detrás de', PLACES.slice(0, 4)],
  ['La farmacia está al lado del banco.', 'De apotheek is naast de bank.', 'al lado', ['al lado', 'encima', 'debajo', 'dentro']],
  ['El museo está enfrente de la estación.', 'Het museum ligt tegenover het station.', 'enfrente de', PLACES.slice(2)],
  ['La lámpara está entre el sofá y la ventana.', 'De lamp staat tussen de zetel en het raam.', 'entre', ['entre', 'debajo de', 'dentro de', 'fuera de']],
  ['La ropa está dentro del armario.', 'De kleren zitten in de kast.', 'dentro', ['dentro', 'fuera', 'encima', 'detrás']],
]);

/* --- gustar --- */
const gustarWords = words('ww-denken', 'verb', [
  ['gustar', ['graag hebben', 'lusten', 'bevallen'], { note: 'Me gusta el café: het café bevalt mij.' }],
  ['encantar', ['dol zijn op', 'heerlijk vinden'], { note: 'Me encanta bailar: ik ben dol op dansen.' }],
  ['interesar', 'interesseren', { note: '¿Te interesa el arte? Interesseert kunst je?' }],
]);

const GUSTA = ['gusta', 'gustan'];
const gustarSentences = sentences({
  slug: 'gustar', theme: 'gr-gustar', grammarRef: 'gr.gustar', instruction: 'Vul de juiste vorm in',
}, [
  ['Me gusta el chocolate.', 'Ik hou van chocolade.', 'gusta', GUSTA],
  ['Me gustan las fresas.', 'Ik hou van aardbeien.', 'gustan', GUSTA],
  ['Nos gusta viajar.', 'Wij reizen graag.', 'gusta', GUSTA],
  ['¿Te gustan los perros?', 'Hou jij van honden?', 'gustan', GUSTA],
  ['A mis padres les encanta la playa.', 'Mijn ouders zijn dol op het strand.', 'les', ['les', 'le', 'nos', 'me']],
  ['A Pedro le encantan los libros.', 'Pedro is dol op boeken.', 'le', ['le', 'les', 'te', 'me']],
  ['¿A ti te interesa la historia?', 'Interesseert geschiedenis jou?', 'te', ['te', 'me', 'le', 'nos']],
  ['A nosotros nos encantan las películas.', 'Wij zijn dol op films.', 'encantan', ['encantan', 'encanta']],
  ['Me duele la cabeza.', 'Ik heb hoofdpijn.', 'duele', ['duele', 'duelen']],
  ['Me duelen los pies.', 'Mijn voeten doen pijn.', 'duelen', ['duele', 'duelen']],
  ['A Ana le duele la espalda.', 'Ana heeft rugpijn.', 'le', ['le', 'la', 'se', 'me']],
]);

/* --- por of para --- */
const PP = ['por', 'para'];
const porPara = sentences({
  slug: 'por-para', theme: 'gr-por-para', grammarRef: 'gr.por-para', instruction: 'Por of para?',
}, [
  ['Este regalo es para ti.', 'Dit cadeau is voor jou.', 'para', PP],
  ['Gracias por todo.', 'Bedankt voor alles.', 'por', PP],
  ['Mañana salgo para Madrid.', 'Morgen vertrek ik naar Madrid.', 'para', PP],
  ['Paseamos por el parque.', 'We wandelen door het park.', 'por', PP],
  ['Estudio español para hablar con mis amigos.', 'Ik leer Spaans om met mijn vrienden te praten.', 'para', PP],
  ['Te llamo por la tarde.', 'Ik bel je in de namiddag.', 'por', PP],
  ['Compré el libro por diez euros.', 'Ik kocht het boek voor tien euro.', 'por', PP],
  ['Necesito el informe para el lunes.', 'Ik heb het verslag tegen maandag nodig.', 'para', PP],
  ['Voy al gimnasio dos veces por semana.', 'Ik ga twee keer per week naar de fitness.', 'por', PP],
  ['Hablamos por teléfono.', 'We spreken elkaar via de telefoon.', 'por', PP],
  ['Para mí, este café está muy bueno.', 'Voor mij is deze koffie erg lekker.', 'Para', PP.map(x => x[0].toUpperCase() + x.slice(1))],
]);

export default {
  atoms: [
    ...colours, ...months, ...numbers, ...ordinals, ...places, ...placeSentences,
    ...gustarWords, ...gustarSentences, ...porPara,
  ],
  grammar: {
    'gr.gustar': {
      title: 'Gustar, encantar en doler',
      ref: '',
      body: 'Bij gustar is wat je graag hebt het onderwerp: "het café bevalt mij". Het werkwoord volgt dus het ding, niet de persoon.\n'
        + '• één ding of een werkwoord: me gusta el café, me gusta bailar\n'
        + '• meer dingen: me gustan los libros\n'
        + '• de persoon staat ervoor: me, te, le, nos, os, les (en voor nadruk: a mí, a ti, a Pedro …)\n'
        + 'Encantar (dol zijn op), interesar en doler (pijn doen) werken net zo.\n'
        + 'Me duele la cabeza. — Ik heb hoofdpijn.\n'
        + 'A mis padres les encanta la playa. — Mijn ouders zijn dol op het strand.',
    },
    'gr.por-para': {
      title: 'Por of para?',
      ref: '',
      body: 'Para kijkt vooruit, naar een doel; por kijkt naar een reden, een weg of een ruil.\n'
        + '• para: voor wie (para ti), doel (para aprender), bestemming (salgo para Madrid), deadline (para el lunes), mening (para mí)\n'
        + '• por: reden (gracias por …), door/langs (por el parque), deel van de dag (por la tarde), prijs (por diez euros), middel (por teléfono), per (dos veces por semana)\n'
        + 'Este regalo es para ti. — Dit cadeau is voor jou.\n'
        + 'Gracias por el regalo. — Bedankt voor het cadeau.',
    },
  },
};
