/* Primer test con estrés (Spaans 1.2, evaluatie 1, unidad 1): de
 * herhalingsoefeningen van de lesgever met hun oplossingen, de spreekvragen,
 * de schrijfopdracht "mi rutina diaria" en de structuren uit de bundel
 * (curso p. 4–12, 42, 70 en 72) die nog geen oefening hadden.
 *
 * Het examenthema zelf (de lijst bestaande atomen) staat in exams.mjs. Dit
 * thema is `balanced` (themes.mjs): een les trekt evenveel vragen uit elk
 * onderdeel, anders verdrinken de woorden in duizend vervoegingen. Atomen die
 * het onderdeel niet uit hun soort of thema laten afleiden, zeggen het zelf
 * met `part` (js/data.js, lessonPart). */

const THEME = 'examen-u1-estres';
const SRC = {
  repaso: 'Herhalingsoefeningen evaluatie 1 · unidad 1',
  bundel: 'Cursusbundel Spaans 1.2',
  oral: 'Evaluatie 1 · spreekvragen',
  vocab: 'Test sin estrés · unidad 1',
};

const sentence = (id, part, srcLabel, instruction, grammarRef, [es, nl, answer, hint, extra = {}]) => {
  const { alt, options, ...rest } = extra;
  return {
    id: `s.estres.${id}`, kind: 'sentence', theme: THEME, part, srcLabel, instruction,
    ...(grammarRef ? { grammarRef } : {}),
    es, nl,
    blanks: [{ answer, ...(hint ? { hint } : {}), ...(alt ? { alt } : {}), ...(options ? { options } : {}) }],
    ...rest,
  };
};

const choice = (id, part, srcLabel, prompt, options, answer, extra = {}) => ({
  id: `q.estres.${id}`, kind: 'choice', theme: THEME, part, srcLabel, prompt, options, answer, ...extra,
});

/** Een rijtje losse vormen: [vraag met ___, antwoord, nl?, alt?]. */
const forms = (id, part, srcLabel, grammarRef, rule, list) => ({
  id: `g.estres.${id}`, kind: 'grammar', theme: THEME, part, srcLabel, grammarRef, rule,
  examples: list.map(([es, answer, nl, alt]) => ({ es, answer, ...(nl ? { nl } : {}), ...(alt ? { alt } : {}) })),
});

const vocab = (id, theme, es, nl, pos, extra = {}) => ({
  id: `v.${id}`, kind: 'vocab', theme, es, nl, pos, srcLabel: SRC.vocab, ...extra,
});

/* ------------------------------------------------------------------ */
/* Woorden die nog ontbraken                                          */

const words = [
  vocab('lo-mas-importante', 'vergelijken', 'lo más importante', ['het belangrijkste'], 'other'),
  vocab('mejor', 'vergelijken', 'mejor', ['beter', 'best'], 'adj', { note: 'bueno → mejor' }),
  vocab('menor', 'vergelijken', 'menor', ['jonger', 'jongst'], 'adj', { note: 'Voor de leeftijd: mi hermana menor. Voor de grootte zeg je más pequeño.' }),
  vocab('mas-o-menos', 'vergelijken', 'más o menos', ['min of meer', 'ongeveer'], 'adv'),
  vocab('llueve', 'weer', 'llueve', ['het regent'], 'other', { note: 'llover (o → ue) → llueve. Niet: llueva.' }),
  vocab('almorzar', 'ww-eten', 'almorzar', ['lunchen', "'s middags eten"], 'verb', { note: 'o → ue: almuerzo, almorzamos' }),
  vocab('tener-que', 'ww-denken', 'tener que', ['moeten'], 'other', { note: 'Tengo que trabajar. = Ik moet werken.' }),
  vocab('la-manana', 'tijd-en-uur', 'la mañana', ['de ochtend', 'de voormiddag'], 'noun', { gender: 'f', number: 'sg', note: 'Zonder lidwoord is mañana "morgen".' }),
  vocab('el-mediodia', 'tijd-en-uur', 'el mediodía', ['de middag', 'het middaguur'], 'noun', { gender: 'm', number: 'sg' }),
  vocab('la-tarde', 'tijd-en-uur', 'la tarde', ['de namiddag'], 'noun', { gender: 'f', number: 'sg' }),
  vocab('la-noche', 'tijd-en-uur', 'la noche', ['de nacht', 'de avond'], 'noun', { gender: 'f', number: 'sg' }),
  vocab('sobre-las-diez', 'tijd-en-uur', 'sobre las diez', ['rond tien uur', 'omstreeks tien uur'], 'other', { note: 'sobre = ongeveer, bij een uur' }),
  vocab('el-ano-bisiesto', 'dagen-en-maanden', 'el año bisiesto', ['het schrikkeljaar'], 'noun', { gender: 'm', number: 'sg' }),
  vocab('la-almohada', 'meubels', 'la almohada', ['het hoofdkussen', 'het kussen'], 'noun', { gender: 'f', number: 'sg' }),
  vocab('los-auriculares', 'apparaten', 'los auriculares', ['de koptelefoon', 'de oortjes'], 'noun', { gender: 'm', number: 'pl' }),
  vocab('de-rayas', 'kleding', 'de rayas', ['gestreept', 'met strepen'], 'adj', { note: 'ook: a rayas — una camisa de rayas' }),
  vocab('de-cuadros', 'kleding', 'de cuadros', ['geruit', 'met ruitjes'], 'adj', { note: 'ook: a cuadros — una falda de cuadros' }),
];

/* ------------------------------------------------------------------ */
/* Repaso 1: indicativo presente (oplossingen blz. 5)                  */

const PRESENTE = 'Vul de indicativo presente in';
const presente = [
  ['Ana y Juan dan su número de teléfono.', 'Ana en Juan geven hun telefoonnummer.', 'dan', 'dar', { grammarRef: 'gr.onregelmatig-yo' }],
  ['Él piensa en el verano.', 'Hij denkt aan de zomer.', 'piensa', 'pensar', { grammarRef: 'gr.klankverandering' }],
  ['Vosotros pedís la cuenta.', 'Jullie vragen de rekening.', 'pedís', 'pedir', { grammarRef: 'gr.klankverandering', note: 'e → i alleen in de laars: pido, pides, pide, piden — maar pedimos, pedís.' }],
  ['Ana se acuesta muy tarde.', 'Ana gaat heel laat slapen.', 'se acuesta', 'acostarse', { grammarRef: 'gr.wederkerend', note: 'Het voornaamwoord vóór het vervoegde werkwoord, en o → ue: se acuesta.' }],
  ['Nosotros conducimos lentamente.', 'Wij rijden langzaam.', 'conducimos', 'conducir', { grammarRef: 'gr.onregelmatig-yo', note: 'Enkel yo is onregelmatig: conduzco.' }],
  ['Vosotros veis todo.', 'Jullie zien alles.', 'veis', 'ver', { grammarRef: 'gr.onregelmatig-yo', note: 'veis heeft één lettergreep: geen accent.' }],
  ['¿Cómo están ustedes?', 'Hoe gaat het met u?', 'están', 'estar', { grammarRef: 'gr.onregelmatig-yo' }],
  ['Yo digo la verdad.', 'Ik zeg de waarheid.', 'digo', 'decir', { grammarRef: 'gr.onregelmatig-yo', note: 'decir: digo, dices, dice, decimos, decís, dicen.' }],
  ['¿Tú puedes venir?', 'Kan jij komen?', 'puedes', 'poder', { grammarRef: 'gr.klankverandering' }],
  ['Yo conozco Madrid.', 'Ik ken Madrid.', 'conozco', 'conocer', { grammarRef: 'gr.onregelmatig-yo', note: 'conocer → conozco, met zc.' }],
  ['Ellos prueban el restaurante.', 'Zij proberen het restaurant uit.', 'prueban', 'probar', { grammarRef: 'gr.klankverandering' }],
  ['¿Tú eres enfermera?', 'Ben jij verpleegster?', 'eres', 'ser', { grammarRef: 'gr.onregelmatig-yo', note: 'ser: soy, eres, es, somos, sois, son.' }],
  ['¿Viene usted también?', 'Komt u ook?', 'Viene', 'venir', { grammarRef: 'gr.onregelmatig-yo' }],
  ['Nosotros leemos el periódico.', 'Wij lezen de krant.', 'leemos', 'leer', { grammarRef: 'gr.presente', note: 'leer is regelmatig in de presente; de y komt pas in leyendo.' }],
  ['Yo hago deporte.', 'Ik doe aan sport.', 'hago', 'hacer', { grammarRef: 'gr.onregelmatig-yo' }],
  ['Pilar y Lucía van a la playa.', 'Pilar en Lucía gaan naar het strand.', 'van', 'ir', { grammarRef: 'gr.onregelmatig-yo' }],
  ['¿Cuánto cuesta el vino?', 'Hoeveel kost de wijn?', 'cuesta', 'costar', { grammarRef: 'gr.klankverandering', note: 'Eén wijn: cuesta. Meer dingen: cuestan.' }],
  ['¡Yo sé todo!', 'Ik weet alles!', 'sé', 'saber', { grammarRef: 'gr.onregelmatig-yo' }],
  ['¡Tú tienes razón!', 'Jij hebt gelijk!', 'tienes', 'tener', { grammarRef: 'gr.onregelmatig-yo' }],
  ['Ellos almuerzan juntos.', 'Zij lunchen samen.', 'almuerzan', 'almorzar', { grammarRef: 'gr.klankverandering' }],
  ['¿Ustedes quieren un café?', 'Willen jullie een koffie?', 'quieren', 'querer', { grammarRef: 'gr.klankverandering', note: 'e → ie: quiero, quieres, quiere, queremos, queréis, quieren.' }],
  ['¿Tú prefieres el pescado?', 'Verkies jij de vis?', 'prefieres', 'preferir', { grammarRef: 'gr.klankverandering' }],
  ['Yo duermo poco.', 'Ik slaap weinig.', 'duermo', 'dormir', { grammarRef: 'gr.klankverandering' }],
  ['Ellos sirven la comida.', 'Zij dienen het eten op.', 'sirven', 'servir', { grammarRef: 'gr.klankverandering', note: 'e → i: sirvo, sirves, sirve, servimos, servís, sirven.' }],
  ['¿Vosotros os levantáis temprano?', 'Staan jullie vroeg op?', 'os levantáis', 'levantarse', { grammarRef: 'gr.wederkerend', note: 'os vóór het werkwoord: os levantáis.' }],
].map(([es, nl, answer, hint, extra], i) => sentence(`presente-${i + 1}`, 'werkwoorden', `${SRC.repaso} · oefening 1.${i + 1}`, PRESENTE, null, [es, nl, answer, hint, extra]));

/* ------------------------------------------------------------------ */
/* Repaso 2 en 3: pretérito compuesto en futuro próximo (blz. 6)        */

const perfecto = [
  ['Este fin de semana he ido al mercado.', 'Dit weekend ben ik naar de markt gegaan.', 'he ido', 'ir, yo'],
  ['He comprado flores y queso.', 'Ik heb bloemen en kaas gekocht.', 'He comprado', 'comprar, yo'],
  ['Después he visitado a mi madre.', 'Daarna heb ik mijn moeder bezocht.', 'he visitado', 'visitar, yo', { note: 'visitar a + persoon.' }],
  ['También he visto a mi hijo.', 'Ik heb ook mijn zoon gezien.', 'he visto', 'ver, yo', { note: 'ver → visto (onregelmatig).' }],
  ['Luego he hecho un poco de deporte.', 'Daarna heb ik een beetje aan sport gedaan.', 'he hecho', 'hacer, yo', { note: 'hacer → hecho (onregelmatig).' }],
  ['Esta semana hemos dormido mucho.', 'Deze week hebben we veel geslapen.', 'hemos dormido', 'dormir, nosotros', { note: 'Geen klankverandering in de pretérito compuesto: dormido.' }],
  ['¿Habéis escrito la carta?', 'Hebben jullie de brief geschreven?', 'Habéis escrito', 'escribir, vosotros', { note: 'escribir → escrito (onregelmatig).' }],
  ['Este año mis padres han vuelto a España.', 'Dit jaar zijn mijn ouders naar Spanje teruggekeerd.', 'han vuelto', 'volver, ellos', { note: 'volver → vuelto (onregelmatig).' }],
].map((row, i) => sentence(`perfecto-${i + 1}`, 'werkwoorden', `${SRC.repaso} · oefening 2`,
  'Vul de pretérito compuesto in (haber + participio)', 'gr.perfecto', row));

const futuroProximo = [
  ['La semana próxima voy a comprar un regalo.', 'Volgende week ga ik een cadeau kopen.', 'voy a comprar', 'comprar, yo'],
  ['Voy a ir a una fiesta.', 'Ik ga naar een feest gaan.', 'Voy a ir', 'ir, yo'],
  ['También voy a visitar a unos amigos.', 'Ik ga ook vrienden bezoeken.', 'voy a visitar', 'visitar, yo'],
  ['Vamos a caminar por el bosque.', 'We gaan in het bos wandelen.', 'Vamos a caminar', 'caminar, nosotros'],
  ['Después vamos a tomar una copa.', 'Daarna gaan we iets drinken.', 'vamos a tomar', 'tomar, nosotros'],
  ['¿Qué vais a hacer el fin de semana que viene?', 'Wat gaan jullie volgend weekend doen?', 'vais a hacer', 'hacer, vosotros'],
  ['Esta tarde mis hermanos van a jugar al fútbol.', 'Vanmiddag gaan mijn broers voetballen.', 'van a jugar', 'jugar, ellos'],
  ['Mañana voy a levantarme a las seis.', 'Morgen ga ik om zes uur opstaan.', 'voy a levantarme', 'levantarse, yo', { alt: ['me voy a levantar'], note: 'Het voornaamwoord achter de infinitief, of vóór ir: me voy a levantar.' }],
].map((row, i) => sentence(`ir-a-${i + 1}`, 'werkwoorden', `${SRC.repaso} · oefening 3`,
  'Vul de futuro próximo in (ir + a + infinitief)', 'gr.ir-a', row));

/* ------------------------------------------------------------------ */
/* Repaso 4: estar + gerundio (blz. 6)                                  */

const gerundio = [
  ['Él está hablando por teléfono.', 'Hij is aan het telefoneren.', 'está hablando', 'él habla'],
  ['Los niños están durmiendo.', 'De kinderen zijn aan het slapen.', 'están durmiendo', 'los niños duermen', { note: 'dormir → durmiendo: o → u.' }],
  ['El tren está llegando a la estación.', 'De trein komt het station binnen.', 'está llegando', 'el tren llega'],
  ['Tú estás escribiendo un correo electrónico.', 'Jij bent een e-mail aan het schrijven.', 'estás escribiendo', 'tú escribes'],
  ['Nosotros estamos nadando en la piscina.', 'Wij zijn aan het zwemmen in het zwembad.', 'estamos nadando', 'nosotros nadamos', { note: 'estamos zonder accent.' }],
  ['Luis está leyendo el periódico.', 'Luis is de krant aan het lezen.', 'está leyendo', 'Luis lee', { note: 'leer → leyendo: tussen twee klinkers wordt de i een y.' }],
  ['Yo estoy paseando por el parque.', 'Ik ben in het park aan het wandelen.', 'estoy paseando', 'yo paseo', { note: 'pasear = wandelen, pasar = voorbijgaan.' }],
  ['Ella está saliendo de la habitación.', 'Zij is de kamer aan het verlaten.', 'está saliendo', 'ella sale', { note: 'salir → saliendo: -ir krijgt -iendo.' }],
  ['Pepe está yendo a la oficina.', 'Pepe is naar kantoor aan het gaan.', 'está yendo', 'Pepe va', { note: 'ir → yendo.' }],
  ['Vosotros estáis jugando al tenis.', 'Jullie zijn aan het tennissen.', 'estáis jugando', 'vosotros jugáis'],
].map((row, i) => sentence(`gerundio-${i + 1}`, 'werkwoorden', `${SRC.repaso} · oefening 4.${i + 1}`,
  'Zet in estar + gerundio', 'gr.gerundio', row));

/* ------------------------------------------------------------------ */
/* Ejercicio extra: de vier tijden van de toets, regelmatige werkwoorden */

const ROWS = [
  ['yo', 'hablar', 'he hablado', 'hablo', 'voy a hablar', 'estoy hablando'],
  ['tú', 'comprar', 'has comprado', 'compras', 'vas a comprar', 'estás comprando'],
  ['él', 'viajar', 'ha viajado', 'viaja', 'va a viajar', 'está viajando'],
  ['nosotros', 'tomar', 'hemos tomado', 'tomamos', 'vamos a tomar', 'estamos tomando'],
  ['vosotros', 'cantar', 'habéis cantado', 'cantáis', 'vais a cantar', 'estáis cantando'],
  ['ellos', 'entrar', 'han entrado', 'entran', 'van a entrar', 'están entrando'],
  ['yo', 'comer', 'he comido', 'como', 'voy a comer', 'estoy comiendo'],
  ['tú', 'beber', 'has bebido', 'bebes', 'vas a beber', 'estás bebiendo'],
  ['él', 'vender', 'ha vendido', 'vende', 'va a vender', 'está vendiendo'],
  ['nosotros', 'correr', 'hemos corrido', 'corremos', 'vamos a correr', 'estamos corriendo'],
  ['vosotros', 'partir', 'habéis partido', 'partís', 'vais a partir', 'estáis partiendo'],
  ['ellos', 'recibir', 'han recibido', 'reciben', 'van a recibir', 'están recibiendo'],
];

const fourTenses = ROWS.map(([who, verb, pc, pres, fut, ger]) => forms(
  `vier-tijden-${verb}`, 'werkwoorden', `${SRC.bundel} · ejercicio extra (blz. 1)`, 'gr.perfecto',
  'De tijdsaanduiding kiest de tijd: esta semana → pretérito compuesto, hoy → presente, esta tarde → futuro próximo, ahora mismo → estar + gerundio.',
  [
    [`(${who}, ${verb}) Esta semana ___.`, pc, 'pretérito compuesto'],
    [`(${who}, ${verb}) Hoy ___.`, pres, 'indicativo presente'],
    [`(${who}, ${verb}) Esta tarde ___.`, fut, 'futuro próximo'],
    [`(${who}, ${verb}) Ahora mismo ___.`, ger, 'estar + gerundio'],
  ]));

/* ------------------------------------------------------------------ */
/* Lijstjes uit de bundel die je uit het hoofd moet kennen              */

const lists = [
  forms('yo-onregelmatig', 'werkwoorden', `${SRC.bundel} · blz. 4–5`, 'gr.onregelmatig-yo',
    'Deze werkwoorden zijn onregelmatig in de ik-vorm van de presente.', [
      ['hacer → yo ___', 'hago'], ['poner → yo ___', 'pongo'], ['salir → yo ___', 'salgo'],
      ['saber → yo ___', 'sé'], ['conocer → yo ___', 'conozco'], ['conducir → yo ___', 'conduzco'],
      ['traer → yo ___', 'traigo'], ['caer → yo ___', 'caigo'], ['decir → yo ___', 'digo'],
      ['venir → yo ___', 'vengo'], ['tener → yo ___', 'tengo'], ['oír → yo ___', 'oigo'],
      ['dar → yo ___', 'doy'], ['ver → yo ___', 'veo'], ['ir → yo ___', 'voy'],
      ['ser → yo ___', 'soy'], ['estar → yo ___', 'estoy'], ['haber → yo ___', 'he'],
    ]),
  forms('participio-er', 'werkwoorden', `${SRC.bundel} · blz. 10`, 'gr.perfecto',
    'Onregelmatige voltooide deelwoorden op -er. Na een klinker krijgt -ído een accent.', [
      ['hacer → he ___', 'hecho', 'gemaakt, gedaan'], ['poner → he ___', 'puesto', 'gelegd, gezet'],
      ['resolver → he ___', 'resuelto', 'opgelost'], ['romper → he ___', 'roto', 'gebroken'],
      ['volver → he ___', 'vuelto', 'teruggekomen'], ['ver → he ___', 'visto', 'gezien'],
      ['leer → he ___', 'leído', 'gelezen'], ['creer → he ___', 'creído', 'geloofd'],
      ['traer → he ___', 'traído', 'gebracht'], ['caer → he ___', 'caído', 'gevallen'],
    ]),
  forms('participio-ir', 'werkwoorden', `${SRC.bundel} · blz. 10`, 'gr.perfecto',
    'Onregelmatige voltooide deelwoorden op -ir. Let op: estar, ir en ser zijn regelmatig.', [
      ['abrir → he ___', 'abierto', 'geopend'], ['cubrir → he ___', 'cubierto', 'bedekt'],
      ['decir → he ___', 'dicho', 'gezegd'], ['descubrir → he ___', 'descubierto', 'ontdekt'],
      ['escribir → he ___', 'escrito', 'geschreven'], ['oír → he ___', 'oído', 'gehoord'],
      ['morir → ha ___', 'muerto', 'gestorven'], ['estar → he ___', 'estado', 'geweest'],
      ['ir → he ___', 'ido', 'gegaan'], ['ser → he ___', 'sido', 'geweest'],
    ]),
  forms('gerundio-onregelmatig', 'werkwoorden', `${SRC.bundel} · blz. 12`, 'gr.gerundio',
    'Onregelmatige gerundios: -ir-werkwoorden met klankwissel nemen u of i, en tussen twee klinkers komt een y.', [
      ['poder → ___', 'pudiendo'], ['venir → ___', 'viniendo'], ['decir → ___', 'diciendo'],
      ['dormir → ___', 'durmiendo'], ['pedir → ___', 'pidiendo'], ['leer → ___', 'leyendo'],
      ['creer → ___', 'creyendo'], ['caer → ___', 'cayendo'], ['traer → ___', 'trayendo'],
      ['construir → ___', 'construyendo'], ['oír → ___', 'oyendo'], ['ir → ___', 'yendo'],
      ['ser → ___', 'siendo'], ['estar → ___', 'estando'],
    ]),
  forms('ir-a', 'werkwoorden', `${SRC.bundel} · blz. 11`, 'gr.ir-a',
    'Futuro próximo = ir + a + infinitief. Er zijn geen onregelmatige werkwoorden.', [
      ['(yo) ___ a hablar.', 'voy'], ['(tú) ___ a comprar.', 'vas'], ['(él) ___ a pagar.', 'va'],
      ['(nosotros) ___ a comer.', 'vamos'], ['(vosotros) ___ a aprender.', 'vais'],
      ['(ellos) ___ a partir.', 'van'],
      ['(tú, levantarse) Mañana ___ temprano.', 'vas a levantarte', null, ['te vas a levantar']],
      ['(nosotros, levantarse) Mañana ___ temprano.', 'vamos a levantarnos', null, ['nos vamos a levantar']],
    ]),
];

/* ------------------------------------------------------------------ */
/* Grammatica: vergelijken, a + persoon, wederkerend, aanwijzend,      */
/* kleuren en het weer                                                 */

const G = 'grammatica';
const CMP = ['más … que', 'menos … que', 'tan … como'];
const grammatica = [
  // Repaso 5: la comparación (blz. 6)
  choice('vergelijk-1', G, `${SRC.repaso} · oefening 5.1`, 'Los hoteles son ___ caros ___ los albergues. (+)', CMP, 'más … que', { grammarRef: 'gr.vergelijken', nl: 'Hotels zijn duurder dan herbergen.' }),
  choice('vergelijk-2', G, `${SRC.repaso} · oefening 5.2`, 'En enero hay ___ turistas ___ en agosto. (−)', CMP, 'menos … que', { grammarRef: 'gr.vergelijken', nl: 'In januari zijn er minder toeristen dan in augustus.' }),
  choice('vergelijk-3', G, `${SRC.repaso} · oefening 5.3`, 'Llevar una chaqueta no es ___ práctico ___ un anorak. (=)', CMP, 'tan … como', { grammarRef: 'gr.vergelijken', nl: 'Een jas dragen is niet zo praktisch als een anorak.' }),
  choice('vergelijk-4', G, `${SRC.repaso} · oefening 5.4`, 'Un litro de leche cuesta ___ en Madrid ___ en Lima. (−)', CMP, 'menos … que', { grammarRef: 'gr.vergelijken', nl: 'Een liter melk kost minder in Madrid dan in Lima.' }),
  choice('vergelijk-5', G, `${SRC.repaso} · oefening 5.5`, 'Un billete de autobús es ___ barato en Lima ___ en Caracas. (=)', CMP, 'tan … como', { grammarRef: 'gr.vergelijken', nl: 'Een busticket is even goedkoop in Lima als in Caracas.' }),
  choice('vergelijk-6', G, `${SRC.bundel} · blz. 70`, 'Tengo ___ dinero ___ tú.', ['tanto … como', 'tan … como', 'tanto … que'], 'tanto … como', { grammarRef: 'gr.vergelijken', nl: 'Ik heb evenveel geld als jij. Vóór een zelfstandig naamwoord: tanto.' }),
  choice('vergelijk-7', G, `${SRC.bundel} · blz. 70`, 'Ana es mi hermana ___. (jonger)', ['menor', 'más pequeña', 'peor'], 'menor', { grammarRef: 'gr.vergelijken', nl: 'Ana is mijn jongere zus. Mayor en menor gaan over leeftijd.' }),
  choice('vergelijk-8', G, `${SRC.bundel} · blz. 70`, 'Este vino es ___ que el otro. (bueno)', ['mejor', 'más bueno', 'mayor'], 'mejor', { grammarRef: 'gr.vergelijken', nl: 'Deze wijn is beter dan de andere.' }),

  // a + complemento directo de persona (E5, blz. 70)
  choice('a-1', G, `${SRC.bundel} · blz. 70`, 'Veo ___ Juan.', ['a', '—'], 'a', { grammarRef: 'gr.persoonlijke-a', nl: 'Ik zie Jan. Een persoon als lijdend voorwerp krijgt a.' }),
  choice('a-2', G, `${SRC.bundel} · blz. 70`, 'Veo ___ coche.', ['el', 'al', 'a el'], 'el', { grammarRef: 'gr.persoonlijke-a', nl: 'Ik zie de auto. Geen persoon, dus geen a.' }),
  choice('a-3', G, `${SRC.bundel} · blz. 70`, 'Tengo ___ una hermana.', ['a', '—'], '—', { grammarRef: 'gr.persoonlijke-a', nl: 'Ik heb een zus. Na tener nooit a.' }),
  choice('a-4', G, `${SRC.bundel} · blz. 70`, '¿Conoces ___ mis padres?', ['a', '—'], 'a', { grammarRef: 'gr.persoonlijke-a', nl: 'Ken je mijn ouders?' }),
  choice('a-5', G, `${SRC.bundel} · blz. 70`, '¿Has visto ___ profesor?', ['al', 'el', 'a el'], 'al', { grammarRef: 'gr.persoonlijke-a', nl: 'Heb je de leraar gezien? a + el = al.' }),
  choice('a-6', G, `${SRC.bundel} · blz. 70`, '¿Entiendes ___ profesora?', ['a la', 'la', 'al'], 'a la', { grammarRef: 'gr.persoonlijke-a', nl: 'Begrijp je de lerares?' }),

  // El pronombre reflexivo (blz. 42)
  choice('wed-1', G, `${SRC.bundel} · blz. 42`, '___ lavo las manos.', ['Me', 'Te', 'Se'], 'Me', { grammarRef: 'gr.wederkerend', nl: 'Ik was mijn handen.' }),
  choice('wed-2', G, `${SRC.bundel} · blz. 42`, '¿A qué hora ___ despiertas?', ['te', 'se', 'me'], 'te', { grammarRef: 'gr.wederkerend', nl: 'Hoe laat word jij wakker?' }),
  choice('wed-3', G, `${SRC.bundel} · blz. 42`, 'Nosotros ___ duchamos por la mañana.', ['nos', 'os', 'se'], 'nos', { grammarRef: 'gr.wederkerend', nl: "Wij douchen 's ochtends." }),
  choice('wed-4', G, `${SRC.bundel} · blz. 42`, '¿Vosotros ___ divertís en la fiesta?', ['os', 'nos', 'se'], 'os', { grammarRef: 'gr.wederkerend', nl: 'Amuseren jullie je op het feest?' }),
  choice('wed-5', G, `${SRC.bundel} · blz. 42`, 'Mis padres ___ acuestan a las once.', ['se', 'os', 'nos'], 'se', { grammarRef: 'gr.wederkerend', nl: 'Mijn ouders gaan om elf uur slapen.' }),
  choice('wed-6', G, `${SRC.bundel} · blz. 42`, 'En Chile ___ habla español.', ['se', 'es', 'le'], 'se', { grammarRef: 'gr.wederkerend', nl: 'In Chili spreekt men Spaans. Se = men.' }),
  choice('wed-7', G, `${SRC.bundel} · blz. 42`, 'No quiero duchar___ con agua fría.', ['me', 'te', 'se'], 'me', { grammarRef: 'gr.wederkerend', nl: 'Ik wil niet koud douchen. Bij een infinitief mag het voornaamwoord erachter.' }),
  choice('wed-8', G, `${SRC.bundel} · blz. 42`, 'Ana ___ muy tarde. (acostarse)', ['se acuesta', 'acuestase', 'se acosta'], 'se acuesta', { grammarRef: 'gr.wederkerend', nl: 'Ana gaat heel laat slapen.' }),

  // Los demostrativos (unidad 1, blz. 18)
  choice('aanw-1', G, `${SRC.vocab} · blz. 18`, '¿Te gusta ___ falda? (deze, hier)', ['esta', 'este', 'esa'], 'esta', { grammarRef: 'gr.aanwijzend', nl: 'Vind je deze rok mooi?' }),
  choice('aanw-2', G, `${SRC.vocab} · blz. 18`, 'No mucho, pero ___ roja sí. (die, daar)', ['esa', 'esta', 'ese'], 'esa', { grammarRef: 'gr.aanwijzend', nl: 'Niet echt, maar die rode wel.' }),
  choice('aanw-3', G, `${SRC.vocab} · blz. 18`, '¿Qué es ___? (iets dat je niet benoemt)', ['esto', 'este', 'esta'], 'esto', { grammarRef: 'gr.aanwijzend', nl: 'Wat is dit?' }),
  choice('aanw-4', G, `${SRC.vocab} · blz. 18`, '___ jerseys son muy caros. (die, daar)', ['Esos', 'Estos', 'Esas'], 'Esos', { grammarRef: 'gr.aanwijzend', nl: 'Die truien zijn heel duur.' }),
  choice('aanw-5', G, `${SRC.vocab} · blz. 18`, '___ mochilas son nuevas. (deze, hier)', ['Estas', 'Estos', 'Esas'], 'Estas', { grammarRef: 'gr.aanwijzend', nl: 'Deze rugzakken zijn nieuw.' }),

  // Los adjetivos de color (blz. 18)
  choice('kleur-1', G, `${SRC.vocab} · blz. 18`, 'una camisa ___ (oranje)', ['naranja', 'naranjo', 'naranjas'], 'naranja', { nl: 'Kleuren die van een zelfstandig naamwoord komen (naranja, rosa, violeta) hebben geen mannelijke vorm.' }),
  choice('kleur-2', G, `${SRC.vocab} · blz. 18`, 'unos zapatos ___ (bruin)', ['marrones', 'marrón', 'marrons'], 'marrones', { nl: 'marrón → marrones: het accent valt weg in het meervoud.' }),
  choice('kleur-3', G, `${SRC.vocab} · blz. 18`, 'una chaqueta ___ (zwart)', ['negra', 'negro', 'negras'], 'negra', { nl: 'negro/-a past zich aan.' }),
  choice('kleur-4', G, `${SRC.vocab} · blz. 18`, 'unos pantalones ___ (blauw)', ['azules', 'azul', 'azuls'], 'azules', { nl: 'azul is mannelijk en vrouwelijk gelijk, maar krijgt -es in het meervoud.' }),

  // ¿Qué tiempo hace? (repaso, vocabulario)
  choice('weer-1', G, `${SRC.repaso} · vocabulario`, 'Het is mooi weer: ___ buen tiempo.', ['Hace', 'Es', 'Está'], 'Hace', { nl: 'Het weer: hace + zelfstandig naamwoord (buen tiempo, frío, sol).' }),
  choice('weer-2', G, `${SRC.repaso} · vocabulario`, 'Het is bewolkt: ___ nublado.', ['Está', 'Hace', 'Es'], 'Está', { nl: 'Bij een bijvoeglijk naamwoord: está nublado.' }),
  choice('weer-3', G, `${SRC.repaso} · vocabulario`, 'Het sneeuwt: ___.', ['Nieva', 'Nieve', 'Hace nieve'], 'Nieva', { nl: 'nevar (e → ie) → nieva.' }),
  choice('weer-4', G, `${SRC.repaso} · vocabulario`, 'Het regent: ___.', ['Llueve', 'Llueva', 'Hace lluvia'], 'Llueve', { nl: 'llover (o → ue) → llueve.' }),
  choice('weer-5', G, `${SRC.repaso} · vocabulario`, 'Het is mistig: ___ niebla.', ['Hay', 'Hace', 'Está'], 'Hay', { nl: 'hay niebla = er is mist.' }),
];

/* ------------------------------------------------------------------ */
/* Vaardigheden: spreken (uur en datum, spreekvragen) en schrijven     */

const V = 'vaardigheden';
const vaardigheden = [
  // La hora y la fecha (E9, blz. 72)
  choice('uur-1', V, `${SRC.bundel} · blz. 72`, 'Het is één uur.', ['Es la una.', 'Son la una.', 'Es las una.'], 'Es la una.', { grammarRef: 'gr.uur' }),
  choice('uur-2', V, `${SRC.bundel} · blz. 72`, 'Het is twintig voor vier.', ['Son las cuatro menos veinte.', 'Son las tres y cuarenta.', 'Son las cuatro y veinte.'], 'Son las cuatro menos veinte.', { grammarRef: 'gr.uur' }),
  choice('uur-3', V, `${SRC.bundel} · blz. 72`, 'Het is kwart voor vijf.', ['Son las cinco menos cuarto.', 'Son las cuatro menos cuarto.', 'Son las cinco y cuarto.'], 'Son las cinco menos cuarto.', { grammarRef: 'gr.uur' }),
  choice('uur-4', V, `${SRC.bundel} · blz. 72`, 'Het is half vier.', ['Son las tres y media.', 'Son las cuatro y media.', 'Son las cuatro menos media.'], 'Son las tres y media.', { grammarRef: 'gr.uur' }),
  choice('datum-1', V, `${SRC.bundel} · blz. 72`, 'Hoy es ___ de enero. (1 januari)', ['el primero', 'la primera', 'el primer'], 'el primero', { grammarRef: 'gr.datum', nl: 'Voor de eerste mag ook el uno: el uno de enero.' }),
  choice('datum-2', V, `${SRC.bundel} · blz. 72`, 'Hoy es el ___ de noviembre. (3 november)', ['tres', 'tercero', 'tercer'], 'tres', { grammarRef: 'gr.datum', nl: 'In een datum gebruik je het hoofdtelwoord; alleen voor de eerste mag primero.' }),
  choice('datum-3', V, `${SRC.bundel} · blz. 72`, 'primavera, verano, otoño ___ invierno', ['e', 'y', 'o'], 'e', { nl: 'y wordt e vóór een woord dat met de klank i begint.' }),

  // Spreekvragen (evaluatie 1, blz. 2): kies het juiste antwoord
  choice('spreek-1', V, SRC.oral, '¿A qué hora te levantas?', ['Me levanto a las siete.', 'Te levantas a las siete.', 'Me levanto a la siete.'], 'Me levanto a las siete.', { nl: 'Antwoord in de ik-vorm, met me, en las vóór het uur.' }),
  choice('spreek-2', V, SRC.oral, '¿Cuándo desayunas?', ['Desayuno a las ocho menos cuarto.', 'Desayunas a las ocho menos cuarto.', 'Desayuno a las ocho menos cuarta.'], 'Desayuno a las ocho menos cuarto.'),
  choice('spreek-3', V, SRC.oral, '¿A qué hora almuerzas?', ['Almuerzo sobre la una.', 'Almorzo sobre la una.', 'Almuerzas sobre la una.'], 'Almuerzo sobre la una.', { nl: 'almorzar: o → ue — almuerzo. Sobre = ongeveer.' }),
  choice('spreek-4', V, SRC.oral, '¿Cuándo cenas?', ['Ceno entre las siete y las ocho.', 'Ceno entre los siete y ocho.', 'Cenas entre las siete y las ocho.'], 'Ceno entre las siete y las ocho.'),
  choice('spreek-5', V, SRC.oral, '¿A qué hora te acuestas?', ['Me acuesto a las once.', 'Me acosto a las once.', 'Te acuestas a las once.'], 'Me acuesto a las once.', { nl: 'acostarse: o → ue — me acuesto.' }),
  choice('spreek-6', V, SRC.oral, '¿Prefieres viajar con una maleta o con una mochila?', ['Prefiero viajar con una mochila.', 'Prefero viajar con una mochila.', 'Prefieres viajar con una mochila.'], 'Prefiero viajar con una mochila.', { nl: 'preferir: e → ie — prefiero.' }),
  choice('spreek-7', V, SRC.oral, '¿Qué llevas siempre cuando vas de viaje?', ['Siempre llevo crema solar y gafas de sol.', 'Siempre lleva crema solar y gafas de sol.', 'Siempre llevo el crema solar y gafas de sol.'], 'Siempre llevo crema solar y gafas de sol.', { nl: 'llevar = meenemen. La crema is vrouwelijk.' }),
  choice('spreek-8', V, SRC.oral, '¿Cuál es tu color favorito?', ['Mi color favorito es el azul.', 'Mi color favorita es el azul.', 'Tu color favorito es el azul.'], 'Mi color favorito es el azul.', { nl: 'el color is mannelijk: favorito.' }),
  choice('spreek-9', V, SRC.oral, '¿De qué color es tu bicicleta?', ['Mi bicicleta es roja.', 'Mi bicicleta es rojo.', 'Mi bicicleta está roja.'], 'Mi bicicleta es roja.', { nl: 'De kleur past zich aan: la bicicleta → roja. Een kleur beschrijf je met ser.' }),
  choice('spreek-10', V, SRC.oral, '¿De qué color son tus zapatos?', ['Mis zapatos son marrones.', 'Mis zapatos son marrón.', 'Mis zapatos son marrons.'], 'Mis zapatos son marrones.'),
  choice('spreek-11', V, SRC.oral, 'Describe la ropa que llevas.', ['Llevo unos vaqueros azules y una camisa de rayas.', 'Llevo unos vaqueros azul y una camisa de rayas.', 'Llevo un vaqueros azules y una camisa de rayas.'], 'Llevo unos vaqueros azules y una camisa de rayas.', { nl: 'los vaqueros is meervoud: unos vaqueros azules.' }),

  // Schrijven: mi rutina diaria (een modeltekst om in te vullen)
  ...[
    ['Me despierto a las seis y media.', 'Ik word om half zeven wakker.', 'Me despierto', 'despertarse, yo'],
    ['Me levanto enseguida y me ducho.', 'Ik sta meteen op en neem een douche.', 'me ducho', 'ducharse, yo'],
    ['Después me visto y me pongo los zapatos.', 'Daarna kleed ik me aan en doe ik mijn schoenen aan.', 'me pongo', 'ponerse, yo'],
    ['Desayuno a las siete con mi familia.', 'Ik ontbijt om zeven uur met mijn gezin.', 'Desayuno', 'desayunar, yo',
      { esAlt: ['Desayuno con mi familia a las siete.'] }],
    ['Salgo de casa a las ocho menos cuarto.', 'Ik vertrek om kwart voor acht van huis.', 'Salgo', 'salir, yo'],
    ['Voy a la oficina en bicicleta.', 'Ik ga met de fiets naar kantoor.', 'Voy', 'ir, yo'],
    ['Almuerzo a la una en la cafetería.', 'Ik lunch om één uur in de cafetaria.', 'Almuerzo', 'almorzar, yo'],
    ['Vuelvo a casa sobre las seis.', 'Ik kom rond zes uur thuis.', 'Vuelvo', 'volver, yo'],
    ['Por la noche ceno y veo la tele.', "'s Avonds eet ik en kijk ik tv.", 'veo', 'ver, yo'],
    ['Me acuesto a las once.', 'Ik ga om elf uur slapen.', 'Me acuesto', 'acostarse, yo'],
  ].map((row, i) => sentence(`rutina-${i + 1}`, V, 'Evaluatie 1 · schrijven: mi rutina diaria',
    'Mi rutina diaria: vul het werkwoord in', 'gr.presente', row)),
];

export default {
  atoms: [...words, ...presente, ...perfecto, ...futuroProximo, ...gerundio, ...fourTenses, ...lists, ...grammatica, ...vaardigheden],
};
