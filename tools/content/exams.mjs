/* Examenreeksen: de woordenlijst die je voor een examen moet kennen, als
 * één thema om te oefenen.
 *
 * Een examenthema bevat geen eigen woorden. Het verwijst naar bestaande
 * woordenschat-atomen, die in hun eigen thema blijven staan (regroup.mjs
 * zet het examenthema in hun `also`). De voortgang is dus gedeeld: wat je
 * voor het examen oefent, telt ook bij "Kleding" of "Het weer", en omgekeerd.
 *
 * Unidad 1: de woordenlijst achteraan het boek, p. 205–209. Zinsflarden die
 * regroup.mjs schrapt (lo más importante, quería contar, ...) en de
 * ustedes-imperatieven (mencionen, piensen) staan er bewust niet in, net als
 * de grammaticale vaktermen en de woorden die fixes.mjs schrapt. */

const U1_WORDS = [
  // p. 205
  'v.caminando', 'v.la-camisa', 'v.la-camiseta', 'v.el-algodon', 'v.el-sombrero', 'v.el-jersey',
  'v.la-lana', 'v.los-calcetines', 'v.la-chaqueta', 'v.la-mochila', 'v.los-vaqueros', 'v.la-bota',
  'v.el-cuero', 'v.la-falda', 'v.las-gafas-de-sol', 'v.amarillo-a', 'v.gris', 'v.marron',
  'v.naranja', 'v.rosa', 'v.la-ropa', 'v.el-tiempo', 'v.la-rutina-diaria', 'v.la-comparacion',
  'v.lo-que-esta-sucediendo', 'v.suceder', 'v.el-anorak', 'v.llevar-gafas', 'v.las-gafas',
  'v.los-pantalones', 'v.el-abrigo', 'v.la-marca', 'v.los-zapatos', 'v.la-ropa-deportiva',
  'v.la-blusa', 'v.el-bikini', 'v.el-vestido', 'v.las-sandalias', 'v.elija', 'v.el-catalogo',
  'v.el-la-experto-a',
  // p. 206
  'v.la-epoca', 'v.el-albergue', 'v.el-la-peregrino-a', 'v.la-primavera', 'v.la-peregrinacion',
  'v.sencillo-a', 'v.el-camino-frances', 'v.frances-esa', 'v.la-estacion-del-ano', 'v.el-verano',
  'v.el-otono', 'v.el-invierno', 'v.el-destino', 'v.el-apostol-santiago', 'v.llover',
  'v.el-camino-del-norte', 'v.mas-largo-a-que', 'v.tan-importante-como', 'v.menos',
  'v.las-comodidades', 'v.el-mes-menos-atractivo', 'v.mayor', 'v.malo-a',
  'v.peor', 'v.la-desigualdad', 'v.la-igualdad', 'v.comodo-a', 'v.practico-a',
  'v.llevar-zapatos', 'v.la-vida-cotidiana', 'v.cotidiano-a', 'v.el-parrafo',
  'v.entre-los-siguientes', 'v.la-paz', 'v.a-caminar', 'v.comenzar', 'v.en-camino',
  'v.sale-el-sol', 'v.levantarse', 'v.lavar-se', 'v.ponerse-ropa', 'v.la-energia',
  'v.despues-de-desayunar', 'v.en-silencio', 'v.el-silencio', 'v.aburrir-se', 'v.tener-prisa',
  'v.cansarse', 'v.relajarse', 'v.pobre', 'v.separar-se',
  // p. 207
  'v.solo-a', 'v.tomar-fotos', 'v.el-diario-del-viaje', 'v.ducharse', 'v.acostarse',
  'v.disfrutar-de', 'v.mirar', 'v.viceversa', 'v.antes-de-caminar', 'v.durante-el-camino',
  'v.la-gente-del-lugar', 'v.la-tranquilidad', 'v.positivo-a', 'v.olvidar-se', 'v.frecuentemente',
  'v.la-fila', 'v.la-tele', 'v.antes-de-las-siete', 'v.este-a', 'v.ese-a', 'v.esto', 'v.eso',
  'v.hacer-referencia-a', 'v.la-referencia', 'v.estar-al-alcance-de', 'v.el-alcance',
  'v.alejado-a', 'v.senalar', 'v.el-camino-inca', 'v.cuanto-tiempo',
  'v.el-mal-de-las-alturas', 'v.el-imperio-inca', 'v.perdido-a', 'v.el-inca', 'v.solamente',
  'v.el-tour', 'v.durar', 'v.recorrer', 'v.convenir', 'v.hacer-la-reserva',
  'v.se-recomienda', 'v.acostumbrarse-a', 'v.el-soroche', 'v.recomendado-a', 'v.hace-sol',
  'v.esta-nublado', 'v.hace-buen-tiempo', 'v.la-temperatura', 'v.contra',
  // p. 208
  'v.el-viento', 'v.el-frio', 'v.es-necesario', 'v.la-recomendacion', 'v.el-safari',
  'v.el-crucero', 'v.despacio', 'v.ponerse-crema', 'v.la-crema', 'v.el-mosquito', 'v.llevar',
  'v.el-papel-higienico', 'v.la-revista', 'v.estamos-esperando', 'v.estoy-haciendo-una-pausa',
  'v.esta-tomando-fotos', 'v.regular', 'v.represente',
  'v.la-mimica', 'v.el-plato', 'v.el-televisor', 'v.el-ordenador', 'v.el-hombre-del-jersey',
  'v.que-tiempo-hace', 'v.hace-calor', 'v.el-calor', 'v.hace-frio', 'v.hace-5-grados',
  'v.el-grado', 'v.bajo-cero', 'v.hace-viento', 'v.hace-mal-tiempo', 'v.hay-niebla', 'v.la-niebla',
  'v.nieva', 'v.nevar', 'v.el-programa', 'v.las-islas-canarias', 'v.los-pirineos', 'v.galicia',
  'v.la-costa-mediterranea', 'v.que-nublado-esta', 'v.que-frio-hace', 'v.como-llueve',
  'v.llevarse', 'v.la-prenda-de-vestir', 'v.a-jugar', 'v.jugar', 'v.la-ficha', 'v.avanzar',
  // p. 209
  'v.ir-de-camping', 'v.a-su-derecha', 'v.atras', 'v.el-pueblo', 'v.la-cabeza',
  'v.el-maximo-de-adjetivos', 'v.la-crema-solar', 'v.por-lo-menos', 'v.el-equipaje',
  'v.la-duracion', 'v.entre-todos', 'v.el-la-coordinador-a', 'v.politico-a', 'v.economico-a',
  'v.financiero-a', 'v.declarar', 'v.restaurar', 'v.llamado-a', 'v.eterno-a', 'v.el-clima',
  'v.el-lago-titicaca', 'v.el-la-escritor-a', 'v.el-amazonas', 'v.el-caiman', 'v.el-mono',
  'v.el-delfin', 'v.el-muro', 'v.el-templo', 'v.riquisimo-a', 'v.el-preparativo', 'v.la-violeta',
  'v.el-la-hablante', 'v.proceder-de',
];

/* Primer test con estrés (evaluatie 1, unidad 1). Alle woorden en werkwoorden
 * van de toetsstof; het thema is `balanced`, dus de duizend vervoegingen
 * verdringen de woorden niet. De eigen oefeningen bij de toets staan in
 * test-con-estres.mjs, rechtstreeks in dit thema. */

const range = (prefix, from, to, suffix = '') =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}${suffix}`);
const pad2 = n => String(n).padStart(2, '0');
const PERSONS = ['1s', '2s', '3s', '1p', '2p', '3p'];
// De presente van oír komt uit de cursus, met een id zonder accent.
const conjId = (v, t, p) => `c.${v === 'oír' && t === 'presente' ? 'oir' : v}.${t}.${p}`;
const conj = (verbs, tenses) =>
  verbs.flatMap(v => tenses.flatMap(t => PERSONS.map(p => conjId(v, t, p))));

/* curso p. 4–12: regelmatig, onregelmatig, diptongación, cambio vocálico,
 * en de werkwoorden uit de herhalingsoefeningen. */
const TEST_VERBS = [
  'hablar', 'comer', 'partir', 'comprar', 'viajar', 'tomar', 'cantar', 'entrar', 'beber',
  'vender', 'correr', 'recibir', 'nadar', 'pasear', 'llegar',
  'ir', 'ser', 'estar', 'tener', 'querer', 'poder', 'dar', 'ver', 'decir', 'venir', 'oír',
  'hacer', 'poner', 'salir', 'saber', 'conocer', 'conducir', 'traer', 'caer', 'leer', 'creer',
  'escribir', 'abrir', 'romper', 'cubrir', 'descubrir', 'resolver', 'construir',
  'cerrar', 'empezar', 'pensar', 'recomendar', 'entender', 'encender', 'perder', 'sentir',
  'preferir', 'encontrar', 'contar', 'probar', 'costar', 'mostrar', 'volver', 'dormir', 'morir',
  'almorzar', 'jugar', 'pedir', 'repetir', 'vestir', 'servir',
];
/* curso p. 42: el pronombre reflexivo. */
const TEST_REFLEXIVE = [
  'levantarse', 'acostarse', 'llamarse', 'ducharse', 'afeitarse', 'peinarse', 'pintarse',
  'bañarse', 'despertarse', 'lavarse', 'divertirse', 'vestirse',
];

const ESTRES_WORDS = [
  ...U1_WORDS,
  // p. 18 en de herhalingsoefeningen, de bundel (p. 72) en de spreekvragen
  'v.lo-mas-importante', 'v.mejor', 'v.menor', 'v.mas', 'v.mas-o-menos', 'v.llueve', 'v.tener-que',
  'v.rojo-a', 'v.verde', 'v.negro-a', 'v.blanco-a', 'v.azul', 'v.morado-a',
  'v.el-panuelo', 'v.de-rayas', 'v.de-cuadros', 'v.la-almohada', 'v.los-auriculares',
  'v.lunes', 'v.martes', 'v.miercoles', 'v.jueves', 'v.viernes', 'v.sabado', 'v.domingo',
  'v.enero', 'v.febrero', 'v.marzo', 'v.abril', 'v.mayo', 'v.junio', 'v.julio', 'v.agosto',
  'v.septiembre', 'v.octubre', 'v.noviembre', 'v.diciembre', 'v.el-mes', 'v.el-ano-bisiesto',
  'v.hoy', 'v.manana', 'v.ayer', 'v.la-manana', 'v.el-mediodia', 'v.la-tarde', 'v.la-noche',
  'v.sobre-las-diez', 'v.es-la-una', 'v.son-las-dos', 'v.son-las-dos-y-diez',
  'v.son-las-tres-y-cuarto', 'v.son-las-tres-y-media', 'v.son-las-cuatro-menos-veinte',
  'v.son-las-cinco-menos-cuarto', 'v.son-las-seis-en-punto',
  // de werkwoorden zelf, als woord
  'v.hablar', 'v.comer', 'v.partir', 'v.comprar', 'v.viajar', 'v.tomar', 'v.cantar', 'v.entrar',
  'v.beber', 'v.vender', 'v.correr', 'v.recibir', 'v.nadar', 'v.pasear', 'v.salir', 'v.leer',
  'v.creer', 'v.escribir', 'v.abrir', 'v.cerrar', 'v.empezar', 'v.pensar', 'v.recomendar',
  'v.entender', 'v.encender', 'v.perder', 'v.sentir', 'v.preferir', 'v.encontrar', 'v.contar',
  'v.probar', 'v.costar', 'v.mostrar', 'v.volver', 'v.dormir', 'v.morir', 'v.poder', 'v.querer',
  'v.almorzar', 'v.pedir', 'v.repetir', 'v.vestir', 'v.servir', 'v.desayunar',
  'v.cenar', 'v.afeitarse', 'v.banarse', 'v.despertarse', 'v.divertirse', 'v.lavarse',
  'v.llamarse', 'v.peinarse', 'v.pintarse',
];

const ESTRES_VERBS = [
  ...conj(TEST_VERBS, ['presente', 'perfecto', 'continuo']),
  ...conj(['haber'], ['presente']),
  ...conj(TEST_REFLEXIVE, ['presente', 'perfecto']),
  ...TEST_VERBS.map(v => `vt.${v}`),
  // werkwoorden in zinnen
  ...range('s.drill.gerundio-', 1, 50), ...range('s.drill.perfecto-gerundio-', 1, 20),
  ...range('s.drill.ir-a-', 1, 17), ...range('s.wb-u1.22-', 1, 4), ...range('s.wb-u1.7a-', 1, 8),
  's.wb-u1.20-1', 's.wb-u1.20-2a', 's.wb-u1.20-2b', 's.wb-u1.20-3a', 's.wb-u1.20-3b',
  's.wb-u1.20-4a', 's.wb-u1.20-4b', 's.wb-u1.20-5a', 's.wb-u1.20-5b', 's.wb-u1.20-5c',
  's.wb-u1.20-6a', 's.wb-u1.20-6b', 's.wb-u1.20-6c',
  's.drill.tijden-1b', 's.drill.tijden-2b', 's.drill.tijden-3a', 's.drill.tijden-4c', 's.drill.tijden-5b',
  'q.wb-u1.24-2', 'q.wb-u1.24-8', 'q.wb-u1.24-9',
  'g.participio-onregelmatig', 'g.perfecto-vorming', 'g.wb-u7.7-perfecto', 'g.wb-u7.7-presente',
];

const ESTRES_GRAMMAR = [
  ...range('q.toets-u1.', 1, 18).map(id => id.replace(/\d+$/, n => pad2(n))),
  // la comparación
  'g.mas-de-getal', 'g.superlatief', 'g.vergelijking-mas-menos', 'g.vergelijking-onregelmatig',
  'g.vergelijking-tan-como', 'g.vergelijking-tanto', ...range('q.wb-u1.4-', 1, 8),
  ...['1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6', '7', '8'].map(n => `q.wb-u1.17-${n}`),
  // a + persoon
  ...range('q.wb-u1.9-', 1, 14), ...range('q.wb-u1.18-', 1, 13), 'q.wb-u1.24-1', 'q.wb-u1.24-10',
  // wederkerend
  ...range('s.wb-u1.8-', 1, 8), 's.wb-u1.14-2a', 's.wb-u1.14-2b', 'q.wb-u1.24-6', 'q.wb-u6.12-10',
  'q.wb-u7.5-8', 'q.wb-u7.5-9', 'q.wb-u7.5-13', 'q.wb-u7.5-15',
  // aanwijzend en kleuren
  'q.wb-u1.24-7', 'q.wb-u1.24-4', 'g.adjectief-overeenkomst', 'g.wb-u1.2-kleuren',
  'g.wb-u1.19-familia-padres', 'g.wb-u1.19-familia-mateo', 'g.apocope-buen-primer',
];

const ESTRES_SKILLS = [
  // lezen
  ...range('r.en-camino.', 1, 6), ...range('r.camino-inca.', 1, 6), ...range('r.peru-pilar.', 1, 6),
  ...range('q.wb-u1.27-', 1, 7),
  // luisteren
  ...range('d.dlg-u1-botas.', 1, 10), ...range('d.dlg-u1-jersey.', 1, 10),
  ...range('d.dlg-u1-tiempo.', 1, 11), ...range('d.dlg-u1-mochila.', 1, 10),
  // het uur en de datum
  'n.uur-heel-half', 'n.uur-kwartier', 'n.uur-minuten', 'n.datum',
];

export default {
  exams: {
    'examen-u1': U1_WORDS,
    'examen-u1-estres': [...ESTRES_WORDS, ...ESTRES_VERBS, ...ESTRES_GRAMMAR, ...ESTRES_SKILLS],
  },
};
