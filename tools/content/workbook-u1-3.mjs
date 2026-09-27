/* Werkboek (cuaderno de ejercicios), unidades 1–3 van ¡Sí, claro! nuevo 1.2:
 * de gesloten oefeningen (werkwoordsvormen, woordkeuze, ser/estar, persoonlijke
 * a, vergelijkingen, gerundio, indefinido, que/donde …) omgezet naar zinnen,
 * meerkeuzevragen en grammatica-oefeningen. Antwoorden uit de "Soluciones"
 * achteraan het boek (p. 188–195). Open oefeningen, oefeningen met tekeningen
 * of audio en oefeningen zonder eenduidig antwoord zijn weggelaten.
 * De grammaticapagina's van het leerboek (p. 18, 28, 38) bevatten geen
 * oefeningen en leveren hier dus niets op. */

/* Werkboekpagina → scanbestand. */
const PAGES = {
  77: '202257352_AE', 78: '202305039_AE', 79: '202312472_AE', 81: '202325247_AE',
  82: '202333683_AE', 83: '202341491_AE', 84: '202351059_AE', 85: '202403807_AE',
  87: '202414303_AE', 88: '202420012_AE', 89: '202423412', 90: '202431349_AE',
  91: '202434738_AE', 92: '202439876_AE', 93: '202442538_AE', 94: '202448306_AE',
  95: '202451352_AE',
  97: '202459721_AE', 99: '202508470_AE', 100: '202513456_AE', 101: '202516855_AE',
  102: '202521816_AE', 103: '202524765_AE', 104: '202530301_AE', 105: '202533454_AE',
  106: '202539589_AE',
};
const src = page => `spanish-md/IMG_20260918_${PAGES[page]}.md`;

/** Laat lege velden weg, zodat de atomen proper blijven. */
const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null));

/** Zinnen met één gat. Rij: [nr, es, nl, antwoord, hint, { options, alt, ref, theme }]. */
const sentences = ({ prefix, page, theme, instruction, ref }, rows) =>
  rows.map(([n, es, nl, answer, hint, more = {}]) => clean({
    id: `s.wb-${prefix}-${n}`, kind: 'sentence', theme: more.theme ?? theme, src: src(page),
    instruction, es, nl,
    blanks: [clean({ answer, hint, options: more.options, alt: more.alt })],
    grammarRef: more.ref === null ? undefined : (more.ref ?? ref),
  }));

/** Meerkeuzevragen. Rij: [nr, prompt, opties, antwoord, nl, { context, ref, theme }]. */
const choices = ({ prefix, page, theme, ref, context }, rows) =>
  rows.map(([n, prompt, options, answer, nl, more = {}]) => clean({
    id: `q.wb-${prefix}-${n}`, kind: 'choice', theme: more.theme ?? theme, src: src(page),
    context: more.context ?? context, prompt, options, answer, nl,
    grammarRef: more.ref === null ? undefined : (more.ref ?? ref),
  }));

/** Grammatica-oefening: één regel, voorbeelden [es met ___, antwoord, nl, opties?]. */
const grammar = ({ id, page, theme, rule, ref }, examples) => clean({
  id: `g.wb-${id}`, kind: 'grammar', theme, src: src(page), rule, grammarRef: ref,
  examples: examples.map(([es, answer, nl, options]) => clean({ es, answer, nl, options })),
});

/** "Welk woord hoort er niet bij?" Rij: [nr, woorden, antwoord, uitleg]. */
const oddOneOut = ({ prefix, page }, rows) =>
  choices({ prefix, page, theme: 'gr-woordkeuze' },
    rows.map(([n, words, answer, nl]) => [n, '¿Qué palabra no forma parte del grupo?', words, answer, nl]));

const NONE = '— (niets)';

/* ------------------------------------------------------------------ */
/* Unidad 1 · Caminando                                                */
/* ------------------------------------------------------------------ */

const PRECIOS = {
  cine: 'Entrada de cine: Buenos Aires $8,58 · México $3,58 · Lima $4,90 · Madrid $9,45 · Nueva York $11,00',
  leche: 'Litro de leche: Buenos Aires $1,24 · México $1,13 · Lima $1,22 · Madrid $0,90 · Nueva York $0,86',
  hamburguesa: 'Hamburguesa: Buenos Aires $2,39 · México $2,81 · Lima $2,93 · Madrid $3,76 · Nueva York $4,93',
  autobus: 'Billete de autobús: Buenos Aires $0,40 · México $0,41 · Lima $0,40 · Madrid $1,65 · Nueva York $2,20',
  taxi: '10 minutos en taxi: Buenos Aires $1,15 · México $1,10 · Lima $1,28 · Madrid $3,95 · Nueva York $4,67',
};

const RUTAS = 'Ruta amarilla: 13 km, 4,5 h, dificultad baja, 35 €, máx. 15 personas · '
  + 'Ruta roja: 19 km, 7–8 h, dificultad alta, 50 €, máx. 10 · '
  + 'Ruta verde: 22 km, 9–10 h, dificultad media-alta, 65 €, máx. 10';

const unidad1 = [
  // 2 · ¿Y su ropa? — kleuradjectieven laten overeenkomen
  grammar({
    id: 'u1.2-kleuren', page: 77, theme: 'bijvoeglijk-naamwoord',
    rule: 'Zet het kleuradjectief in de juiste vorm (geslacht en getal).',
  }, [
    ['Tengo una camiseta ___.', 'naranja', 'Ik heb een oranje T-shirt. (naranja)'],
    ['Tengo un anorak ___.', 'rojo', 'Ik heb een rode anorak. (rojo)'],
    ['Tengo unos pantalones ___.', 'azules', 'Ik heb een blauwe broek. (azul)'],
    ['Tengo una falda ___.', 'amarilla', 'Ik heb een gele rok. (amarillo)'],
    ['Tengo muchas camisas ___.', 'blancas', 'Ik heb veel witte hemden. (blanco)'],
    ['Tengo unas sandalias ___.', 'verdes', 'Ik heb groene sandalen. (verde)'],
    ['Tengo muchos zapatos ___.', 'marrones', 'Ik heb veel bruine schoenen. (marrón)'],
    ['Tengo un jersey ___.', 'gris', 'Ik heb een grijze trui. (gris)'],
    ['Tengo unas gafas de sol ___.', 'negras', 'Ik heb een zwarte zonnebril. (negro)'],
    ['Tengo un abrigo ___.', 'blanco', 'Ik heb een witte jas. (blanco)'],
  ]),

  // 4 · Los precios en diferentes ciudades del mundo
  ...choices({ prefix: 'u1.4', page: 78, theme: 'vergelijken', ref: 'gr.vergelijken' }, [
    ['1', 'Una entrada de cine es ___ cara en Buenos Aires ___ en Madrid.',
      ['menos … que', 'más … que', 'tan … como'], 'menos … que',
      'Een bioscoopticket is in Buenos Aires minder duur dan in Madrid.', { context: PRECIOS.cine }],
    ['2', 'Un litro de leche cuesta ___ en México ___ en Nueva York.',
      ['más … que', 'menos … que', 'tan … como'], 'más … que',
      'Een liter melk kost in Mexico meer dan in New York.', { context: PRECIOS.leche }],
    ['3', 'Las hamburguesas ___ caras se comen en Nueva York.',
      ['más', 'menos', 'tan'], 'más',
      'De duurste hamburgers eet je in New York.', { context: PRECIOS.hamburguesa }],
    ['4', 'Un billete de autobús es ___ barato en Lima ___ en Buenos Aires.',
      ['tan … como', 'más … que', 'menos … que'], 'tan … como',
      'Een busticket is in Lima even goedkoop als in Buenos Aires.', { context: PRECIOS.autobus }],
    ['5', 'Un viaje en taxi de diez minutos cuesta ___ en Buenos Aires ___ en Lima.',
      ['menos … que', 'más … que', 'tan … como'], 'menos … que',
      'Een taxirit van tien minuten kost in Buenos Aires minder dan in Lima.', { context: PRECIOS.taxi }],
    ['6', 'Nueva York es la ciudad ___ cara para viajar en autobús.',
      ['más', 'menos', 'tan'], 'más',
      'New York is de duurste stad om met de bus te reizen.', { context: PRECIOS.autobus }],
    ['7', 'El viaje en taxi ___ caro se puede hacer en México.',
      ['menos', 'más', 'tan'], 'menos',
      'De goedkoopste taxirit (letterlijk: de minst dure) maak je in Mexico.', { context: PRECIOS.taxi }],
    ['8', 'En Buenos Aires se pueden comer las hamburguesas ___ baratas.',
      ['más', 'menos', 'tan'], 'más',
      'In Buenos Aires eet je de goedkoopste hamburgers.', { context: PRECIOS.hamburguesa }],
  ]),

  // 6 · Verbos y sustantivos
  grammar({
    id: 'u1.6-woordfamilie', page: 78, theme: 'gr-woordkeuze',
    rule: 'Geef het zelfstandig naamwoord of het werkwoord uit dezelfde woordfamilie.',
  }, [
    ['desayunar → el ___', 'desayuno', 'ontbijten → het ontbijt'],
    ['comer → la ___', 'comida', 'eten → het eten, de maaltijd'],
    ['cocinar → la ___', 'cocina', 'koken → de keuken, het koken'],
    ['ducharse → la ___', 'ducha', 'douchen → de douche'],
    ['entrar → la ___', 'entrada', 'binnengaan → de ingang'],
    ['la cena → ___', 'cenar', 'het avondeten → het avondeten gebruiken'],
    ['la bebida → ___', 'beber', 'de drank → drinken'],
    ['el viaje → ___', 'viajar', 'de reis → reizen'],
    ['el trabajo → ___', 'trabajar', 'het werk → werken'],
    ['la ida → ___', 'ir', 'de heenreis → gaan'],
    ['la vuelta → ___', 'volver', 'de terugkeer → terugkeren'],
  ]),

  // 7a · ¿Qué hace Miguel en un día normal?
  ...sentences({
    prefix: 'u1.7a', page: 79, theme: 'gr-zin-presente', ref: 'gr.presente',
    instruction: 'Vul de juiste vorm van het werkwoord in (presente).',
  }, [
    ['1', 'A las ocho se levanta.', 'Om acht uur staat hij op.', 'se levanta', 'levantarse, él', { ref: 'gr.wederkerend' }],
    ['2', 'A las ocho y diez se ducha.', 'Om tien over acht neemt hij een douche.', 'se ducha', 'ducharse, él', { ref: 'gr.wederkerend' }],
    ['3', 'A las ocho y veinticinco desayuna.', 'Om vijf voor half negen ontbijt hij.', 'desayuna', 'desayunar, él'],
    ['4', 'A las nueve menos cuarto va a la universidad.', 'Om kwart voor negen gaat hij naar de universiteit.', 'va', 'ir, él'],
    ['5', 'A las dos come.', 'Om twee uur eet hij.', 'come', 'comer, él'],
    ['6', 'A las cinco vuelve a casa.', 'Om vijf uur gaat hij terug naar huis.', 'vuelve', 'volver, él', { ref: 'gr.klankverandering' }],
    ['7', 'A las siete y media hace deporte.', 'Om half acht sport hij.', 'hace', 'hacer, él'],
    ['8', 'A las diez y media se acuesta.', 'Om half elf gaat hij slapen.', 'se acuesta', 'acostarse, él', { ref: 'gr.wederkerend' }],
  ]),

  // 8 · Preguntas con verbos reflexivos
  ...sentences({
    prefix: 'u1.8', page: 79, theme: 'gr-wederkerend', ref: 'gr.wederkerend',
    instruction: 'Vul het wederkerend werkwoord in (tú).',
  }, [
    ['1', '¿Cómo te concentras en el examen?', 'Hoe concentreer je je tijdens het examen?', 'te concentras', 'concentrarse, tú'],
    ['2', '¿A qué hora te levantas todos los días?', 'Hoe laat sta je elke dag op?', 'te levantas', 'levantarse, tú'],
    ['3', '¿Es verdad que te duchas antes del desayuno?', 'Is het waar dat je voor het ontbijt een douche neemt?', 'te duchas', 'ducharse, tú'],
    ['4', '¿Siempre te cansas en las excursiones?', 'Word je altijd moe tijdens de uitstappen?', 'te cansas', 'cansarse, tú'],
    ['5', '¿Cuándo te acuestas los fines de semana?', 'Wanneer ga je in het weekend slapen?', 'te acuestas', 'acostarse, tú'],
    ['6', '¿Por qué te aburres en el trabajo?', 'Waarom verveel je je op het werk?', 'te aburres', 'aburrirse, tú'],
    ['7', '¿Por qué no te relajas después de comer?', 'Waarom ontspan je je niet na het eten?', 'te relajas', 'relajarse, tú'],
    ['8', '¿Por qué no te sientas en el sofá?', 'Waarom ga je niet in de zetel zitten?', 'te sientas', 'sentarse, tú'],
  ]),

  // 9 · La preposición 'a' (brief van Manolo en Celia uit Sevilla)
  ...choices({
    prefix: 'u1.9', page: 79, theme: 'gr-persoonlijke-a', ref: 'gr.persoonlijke-a',
  }, [
    ['1', 'Ya hemos llegado ___ Sevilla.', ['a', NONE], 'a',
      'We zijn al in Sevilla aangekomen. Hier is a het voorzetsel van richting (llegar a).'],
    ['2', 'Hemos visitado ___ Rosa, la hermana de Juan.', ['a', NONE], 'a',
      'We hebben Rosa, de zus van Juan, bezocht. Een persoon als lijdend voorwerp krijgt a.'],
    ['3', 'Rosa tiene ___ tres hijos muy simpáticos.', ['a', NONE], NONE,
      'Rosa heeft drie heel leuke kinderen. Na tener komt geen persoonlijke a.'],
    ['4', 'Por fin yo he conocido ___ su marido.', ['a', NONE], 'a',
      'Eindelijk heb ik haar man leren kennen. Persoon → a.'],
    ['5', 'También hemos visitado ___ monumentos famosos.', ['a', NONE], NONE,
      'We hebben ook bekende monumenten bezocht. Geen persoon → geen a.'],
    ['6', 'Hemos visitado monumentos famosos, por ejemplo ___ la Giralda.', ['a', NONE], NONE,
      'We hebben bekende monumenten bezocht, bijvoorbeeld de Giralda. Een gebouw, geen persoon.'],
    ['7', 'Hemos comido ___ unas cosas deliciosas.', ['a', NONE], NONE,
      'We hebben heerlijke dingen gegeten. Geen persoon → geen a.'],
    ['8', 'Rosa conoce ___ los mejores bares.', ['a', NONE], NONE,
      'Rosa kent de beste cafés. Bij plaatsen en dingen geen a.'],
    ['9', 'Mañana hacemos una excursión ___ la costa.', ['a', NONE], 'a',
      'Morgen maken we een uitstap naar de kust. Hier is a het voorzetsel van richting.'],
    ['10', 'Queremos conocer ___ los pueblos de la región.', ['a', NONE], NONE,
      'We willen de dorpen van de streek leren kennen. Geen personen → geen a.'],
    ['11', 'Queremos probar ___ la cocina tradicional.', ['a', NONE], NONE,
      'We willen de traditionele keuken proeven. Geen persoon → geen a.'],
    ['12', '___ la niña le he comprado unos zapatos para bailar flamenco.', ['a', NONE], 'a',
      'Voor het meisje heb ik schoenen gekocht om flamenco te dansen. Meewerkend voorwerp: a la niña … le.'],
    ['13', '___ ti también te llevamos un regalo.', ['a', NONE], 'a',
      'Voor jou brengen we ook een cadeau mee. Meewerkend voorwerp: a ti … te.'],
    ['14', 'A ti también te llevamos ___ un regalo.', ['a', NONE], NONE,
      'Voor jou brengen we ook een cadeau mee. Een cadeau is een ding → geen a.'],
  ]),

  // 14 · Antes del viaje — plaats van het voornaamwoord bij perfecto en gerundio
  ...sentences({
    prefix: 'u1.14', page: 81, theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp',
    instruction: 'Antwoord met het voornaamwoord op de juiste plaats.',
  }, [
    ['1a', '—María, ¿has hecho ya las maletas? —Sí, ya las he hecho.',
      '—María, heb je de koffers al gepakt? —Ja, ik heb ze al gepakt.', 'las he hecho', 'hacer, perfecto'],
    ['1b', '—María, ¿has hecho ya las maletas? —En este momento estoy haciéndolas.',
      '—María, heb je de koffers al gepakt? —Ik ben ze nu aan het pakken.', 'estoy haciéndolas', 'hacer, estar + gerundio',
      { alt: ['las estoy haciendo'] }],
    ['2a', '—¿Se han duchado ya los niños? —Sí, ya se han duchado.',
      '—Hebben de kinderen al gedoucht? —Ja, ze hebben al gedoucht.', 'ya se han duchado', 'ducharse, perfecto',
      { theme: 'gr-wederkerend', ref: 'gr.wederkerend' }],
    ['2b', '—¿Se han duchado ya los niños? —En este momento están duchándose.',
      '—Hebben de kinderen al gedoucht? —Ze staan nu onder de douche.', 'están duchándose', 'ducharse, estar + gerundio',
      { alt: ['se están duchando'], theme: 'gr-wederkerend', ref: 'gr.wederkerend' }],
    ['3a', '—Pedro, ¿has preparado ya el desayuno? —Sí, ya lo he preparado.',
      '—Pedro, heb je het ontbijt al klaargemaakt? —Ja, ik heb het al klaargemaakt.', 'lo he preparado', 'preparar, perfecto'],
    ['3b', '—Pedro, ¿has preparado ya el desayuno? —En este momento estoy preparándolo.',
      '—Pedro, heb je het ontbijt al klaargemaakt? —Ik ben het nu aan het klaarmaken.', 'estoy preparándolo', 'preparar, estar + gerundio',
      { alt: ['lo estoy preparando'] }],
    ['4a', '—¿Los niños han preparado ya sus mochilas? —Sí, ya las han preparado.',
      '—Hebben de kinderen hun rugzakken al klaargemaakt? —Ja, ze hebben ze al klaargemaakt.', 'las han preparado', 'preparar, perfecto'],
    ['4b', '—¿Los niños han preparado ya sus mochilas? —En este momento están preparándolas.',
      '—Hebben de kinderen hun rugzakken al klaargemaakt? —Ze zijn ze nu aan het klaarmaken.', 'están preparándolas', 'preparar, estar + gerundio',
      { alt: ['las están preparando'] }],
    ['5a', '—María, ¿has puesto ya los pasaportes en la mochila? —Sí, ya los he puesto.',
      '—María, heb je de paspoorten al in de rugzak gestoken? —Ja, ik heb ze er al in gestoken.', 'los he puesto', 'poner, perfecto'],
    ['5b', '—María, ¿has puesto ya los pasaportes en la mochila? —En este momento estoy poniéndolos.',
      '—María, heb je de paspoorten al in de rugzak gestoken? —Ik ben ze er nu in aan het steken.', 'estoy poniéndolos', 'poner, estar + gerundio',
      { alt: ['los estoy poniendo'] }],
    ['6a', '—Pedro, ¿has pedido ya un taxi? —Sí, ya lo he pedido.',
      '—Pedro, heb je al een taxi besteld? —Ja, ik heb er al een besteld.', 'lo he pedido', 'pedir, perfecto'],
    ['6b', '—Pedro, ¿has pedido ya un taxi? —En este momento estoy pidiéndolo.',
      '—Pedro, heb je al een taxi besteld? —Ik ben er nu een aan het bestellen.', 'estoy pidiéndolo', 'pedir, estar + gerundio',
      { alt: ['lo estoy pidiendo'] }],
  ]),

  // 15 · El tiempo
  grammar({
    id: 'u1.15-tiempo', page: 81, theme: 'gr-woordkeuze',
    rule: 'Het weer: hace, hay of está?',
  }, [
    ['___ 25 grados.', 'Hace', 'Het is 25 graden.', ['Hace', 'Hay', 'Está']],
    ['___ sol.', 'Hace', 'De zon schijnt.', ['Hace', 'Hay', 'Está']],
    ['___ viento.', 'Hace', 'Het waait.', ['Hace', 'Hay', 'Está']],
    ['___ calor.', 'Hace', 'Het is warm.', ['Hace', 'Hay', 'Está']],
    ['___ frío.', 'Hace', 'Het is koud.', ['Hace', 'Hay', 'Está']],
    ['¡Qué frío ___!', 'hace', 'Wat is het koud!', ['hace', 'hay', 'está']],
    ['___ niebla.', 'Hay', 'Het is mistig.', ['Hace', 'Hay', 'Está']],
    ['___ nublado.', 'Está', 'Het is bewolkt.', ['Hace', 'Hay', 'Está']],
  ]),

  // 17 · Tres excursiones en los Picos de Europa
  ...choices({
    prefix: 'u1.17', page: 82, theme: 'vergelijken', ref: 'gr.vergelijken', context: RUTAS,
  }, [
    ['1a', 'La ruta verde es ___ larga ___ la roja.', ['más … que', 'menos … que', 'tan … como'], 'más … que',
      'De groene route is langer dan de rode.'],
    ['1b', 'La ruta verde es más larga que la roja, pero no es ___ difícil como la roja.', ['tan', 'tanto', 'más'], 'tan',
      'De groene route is langer dan de rode, maar niet zo moeilijk. Tan + bijvoeglijk naamwoord + como.'],
    ['2a', 'La ruta roja es ___ difícil de todas.', ['la más', 'más', 'la menos'], 'la más',
      'De rode route is de moeilijkste van allemaal. Overtreffende trap: lidwoord + más.'],
    ['2b', 'La ruta roja es la más difícil de todas, pero es ___ larga ___ la ruta verde.',
      ['menos … que', 'más … que', 'tan … como'], 'menos … que',
      'De rode route is de moeilijkste, maar ze is minder lang dan de groene.'],
    ['3a', 'La ruta roja no es ___ larga ___ la verde.', ['tan … como', 'tan … que', 'más … como'], 'tan … como',
      'De rode route is niet zo lang als de groene. Tan hoort bij como, más bij que.'],
    ['3b', 'La ruta roja no es tan larga como la verde, pero es ___ difícil.', ['más', 'menos', 'tan'], 'más',
      'De rode route is niet zo lang als de groene, maar wel moeilijker.'],
    ['4a', 'La ruta amarilla cuesta ___ la roja.', ['menos que', 'más que', 'tan como'], 'menos que',
      'De gele route kost minder dan de rode (35 € tegenover 50 €).'],
    ['4b', 'La ruta amarilla cuesta menos que la roja y es también ___ difícil.', ['menos', 'más', 'tan'], 'menos',
      'De gele route kost minder dan de rode en is ook minder moeilijk.'],
    ['5a', 'La ruta amarilla es ___ corta que las otras.', ['más', 'menos', 'tan'], 'más',
      'De gele route is korter dan de andere.'],
    ['5b', 'La ruta amarilla es más corta que las otras y dura ___ tiempo.', ['menos', 'más', 'tan'], 'menos',
      'De gele route is korter dan de andere en duurt minder lang.'],
    ['6', 'La ruta verde es ___ cara y ___ larga.', ['la más … la más', 'la menos … la menos', 'tan … como'], 'la más … la más',
      'De groene route is de duurste en de langste.'],
    ['7', 'La ruta amarilla es la excursión con el ___ número de participantes.', ['mayor', 'menor', 'mejor'], 'mayor',
      'De gele route is de uitstap met het grootste aantal deelnemers (15). Grande → mayor.'],
    ['8', 'La ruta amarilla no es ___ cara ___ la roja y la verde.', ['tan … como', 'tan … que', 'tanto … como'], 'tan … como',
      'De gele route is niet zo duur als de rode en de groene. Tan + bijvoeglijk naamwoord + como.'],
  ]),

  // 18 · ¿Con o sin a?
  ...choices({
    prefix: 'u1.18', page: 82, theme: 'gr-persoonlijke-a', ref: 'gr.persoonlijke-a',
  }, [
    ['1', '—Carmen, ¿conoces ___ un buen restaurante italiano en el centro?', ['a', NONE], NONE,
      'Carmen, ken je een goed Italiaans restaurant in het centrum? Een restaurant is geen persoon → geen a.'],
    ['2', 'Quiero invitar ___ Carlos y no sé dónde se puede comer una buena pizza.', ['a', NONE], 'a',
      'Ik wil Carlos uitnodigen en ik weet niet waar je een goede pizza kunt eten. Persoon → a.'],
    ['3', 'Está en la primera calle ___ la izquierda.', ['a', NONE], 'a',
      'Het is in de eerste straat links (a la izquierda).'],
    ['4', 'Buenas tardes, soy Luis Romero, estoy buscando ___ mi hija Elena.', ['a', NONE], 'a',
      'Goedemiddag, ik ben Luis Romero, ik zoek mijn dochter Elena. Persoon → a.'],
    ['5', 'Ha llamado a casa, pero ___ su madre no ha contestado.', ['a', NONE], NONE,
      'Ze heeft naar huis gebeld, maar haar moeder heeft niet opgenomen. Su madre is hier het onderwerp.'],
    ['6', 'Buenas tardes, señores Solano, ¿conocen ___ mi marido?', ['a', NONE], 'a',
      'Goedemiddag, meneer en mevrouw Solano, kennen jullie mijn man? Persoon → a.'],
    ['7', '¿Ya han visitado ___ nuestra ciudad?', ['a', NONE], NONE,
      'Hebben jullie onze stad al bezocht? Een stad is geen persoon → geen a.'],
    ['8', 'Esta mañana hemos ido al centro ___ pie.', ['a', NONE], 'a',
      'Vanochtend zijn we te voet naar het centrum gegaan (a pie).'],
    ['9', 'Nuestro hotel está ___ unos 15 minutos.', ['a', NONE], 'a',
      'Ons hotel ligt op een kwartiertje (a + afstand).'],
    ['10', 'Mamá, me aburro… ¿Jugamos ___ las cartas?', ['a', NONE], 'a',
      'Mama, ik verveel me… Zullen we kaarten? (jugar a)'],
    ['11', 'Ahora tengo que ayudar ___ tu abuela a hacer la maleta.', ['a', NONE], 'a',
      'Nu moet ik je oma helpen haar koffer te pakken. Persoon → a.'],
    ['12', 'Tengo que ayudar a tu abuela ___ hacer la maleta.', ['a', NONE], 'a',
      'Ik moet je oma helpen haar koffer te pakken (ayudar a + infinitief).'],
    ['13', '¿Por qué no preguntas ___ tu hermano?', ['a', NONE], 'a',
      'Waarom vraag je het niet aan je broer? (preguntar a alguien)'],
  ]),

  // 19 · La familia de Mateo Romero — uitgangen van bijvoeglijke naamwoorden
  grammar({
    id: 'u1.19-familia-padres', page: 83, theme: 'bijvoeglijk-naamwoord',
    rule: 'Pas de uitgang van het bijvoeglijk naamwoord aan, als dat nodig is.',
  }, [
    ['Mi madre se llama Cari, es ___, alta y un poco gordita.', 'morena', 'Mijn moeder heet Cari, ze is donker, groot en een beetje mollig. (moreno)'],
    ['Mi madre es morena, ___ y un poco gordita.', 'alta', 'Mijn moeder is donker, groot en een beetje mollig. (alto)'],
    ['Mi madre es morena, alta y un poco ___.', 'gordita', 'Mijn moeder is donker, groot en een beetje mollig. (gordito)'],
    ['Hoy mi madre lleva una falda ___.', 'negra', 'Vandaag draagt mijn moeder een zwarte rok. (negro)'],
    ['Hoy mi madre lleva una camiseta ___.', 'roja', 'Vandaag draagt mijn moeder een rood T-shirt. (rojo)'],
    ['Hoy mi madre lleva unas sandalias ___.', 'negras', 'Vandaag draagt mijn moeder zwarte sandalen. (negro)'],
    ['Mi padre es muy alto, ___ y rubio.', 'delgado', 'Mijn vader is heel groot, slank en blond. (delgado)'],
    ['Hoy mi padre se ha puesto su ropa ___.', 'favorita', 'Vandaag heeft mijn vader zijn lievelingskleren aangetrokken. (favorito)'],
    ['Mi padre lleva vaqueros ___ y una camiseta blanca.', 'azules', 'Mijn vader draagt een blauwe jeans en een wit T-shirt. (azul)'],
    ['Mi padre lleva vaqueros azules y una camiseta ___.', 'blanca', 'Mijn vader draagt een blauwe jeans en een wit T-shirt. (blanco)'],
    ['Mi padre lleva zapatos ___.', 'marrones', 'Mijn vader draagt bruine schoenen. (marrón)'],
    ['Durante la semana mi padre siempre lleva camisas y corbatas ___.', 'elegantes', 'Tijdens de week draagt mijn vader altijd chique hemden en dassen. (elegante)'],
  ]),
  grammar({
    id: 'u1.19-familia-mateo', page: 83, theme: 'bijvoeglijk-naamwoord',
    rule: 'Pas de uitgang van het bijvoeglijk naamwoord aan, als dat nodig is.',
  }, [
    ['Yo soy alto como los dos, pero ___ como mi madre.', 'moreno', 'Ik (Mateo) ben groot zoals zij allebei, maar donker zoals mijn moeder. (moreno)'],
    ['Llevo unos pantalones ___.', 'grises', 'Ik draag een grijze broek. (gris)'],
    ['Llevo una camiseta a rayas y mis sandalias ___.', 'favoritas', 'Ik draag een gestreept T-shirt en mijn lievelingssandalen. (favorito)'],
    ['Mis sandalias favoritas son ___.', 'marrones', 'Mijn lievelingssandalen zijn bruin. (marrón)'],
    ['Mi padre trabaja en una empresa ___.', 'internacional', 'Mijn vader werkt in een internationaal bedrijf. (internacional)'],
    ['Mi madre es profesora en una escuela ___.', 'privada', 'Mijn moeder is lerares in een privéschool. (privado)'],
    ['Después vamos a un restaurante ___ para cenar.', 'italiano', 'Daarna gaan we in een Italiaans restaurant eten. (italiano)'],
  ]),

  // 20 · Complete. ¿Quién dice qué?
  ...sentences({
    prefix: 'u1.20', page: 83, theme: 'gr-zin-presente', ref: 'gr.presente',
    instruction: 'Vul de juiste vorm van het werkwoord in (presente).',
  }, [
    ['1', 'Yo me levanto la primera y ayudo a mi hijo a preparar las cosas para la escuela.',
      'Ik sta als eerste op en help mijn zoon zijn spullen voor school klaar te leggen.', 'me levanto', 'levantarse, yo', { ref: 'gr.wederkerend' }],
    ['2a', 'Mi mamá, mi papá y yo desayunamos juntos y luego mi papá sale de casa para ir a la oficina.',
      'Mijn mama, mijn papa en ik ontbijten samen en daarna vertrekt mijn papa naar kantoor.', 'desayunamos', 'desayunar, nosotros'],
    ['2b', 'Mi mamá, mi papá y yo desayunamos juntos y luego mi papá sale de casa para ir a la oficina.',
      'Mijn mama, mijn papa en ik ontbijten samen en daarna vertrekt mijn papa naar kantoor.', 'sale', 'salir, él'],
    ['3a', 'Él se levanta más tarde que yo, también se acuesta más tarde que yo.',
      'Hij staat later op dan ik en gaat ook later slapen dan ik.', 'se levanta', 'levantarse, él', { ref: 'gr.wederkerend' }],
    ['3b', 'Él se levanta más tarde que yo, también se acuesta más tarde que yo.',
      'Hij staat later op dan ik en gaat ook later slapen dan ik.', 'se acuesta', 'acostarse, él', { ref: 'gr.wederkerend' }],
    ['4a', 'Todos los días tengo que ponerme corbatas.',
      'Elke dag moet ik een das dragen.', 'ponerme', 'ponerse, na tengo que', { ref: 'gr.wederkerend' }],
    ['4b', 'Por eso los fines de semana me pongo vaqueros y una camiseta.',
      'Daarom trek ik in het weekend een jeans en een T-shirt aan.', 'me pongo', 'ponerse, yo', { ref: 'gr.onregelmatig-yo' }],
    ['5a', 'A veces me aburro en la escuela, sobre todo en las clases de Matemáticas.',
      'Soms verveel ik me op school, vooral in de wiskundeles.', 'me aburro', 'aburrirse, yo', { ref: 'gr.wederkerend' }],
    ['5b', 'Mi mamá también da clases de Matemáticas, pero ella trabaja en otra escuela.',
      'Mijn mama geeft ook wiskunde, maar zij werkt in een andere school.', 'da', 'dar, ella'],
    ['5c', 'Mi mamá también da clases de Matemáticas, pero ella trabaja en otra escuela.',
      'Mijn mama geeft ook wiskunde, maar zij werkt in een andere school.', 'trabaja', 'trabajar, ella'],
    ['6a', 'Tu madre y tú me esperáis en casa hoy, yo vuelvo a las 5 y entonces vamos todos juntos al parque.',
      'Jij en je moeder wachten vandaag thuis op mij, ik kom om 5 uur terug en dan gaan we allemaal samen naar het park.', 'esperáis', 'esperar, vosotros'],
    ['6b', 'Tu madre y tú me esperáis en casa hoy, yo vuelvo a las 5 y entonces vamos todos juntos al parque.',
      'Jij en je moeder wachten vandaag thuis op mij, ik kom om 5 uur terug en dan gaan we allemaal samen naar het park.', 'vuelvo', 'volver, yo', { ref: 'gr.klankverandering' }],
    ['6c', 'Tu madre y tú me esperáis en casa hoy, yo vuelvo a las 5 y entonces vamos todos juntos al parque.',
      'Jij en je moeder wachten vandaag thuis op mij, ik kom om 5 uur terug en dan gaan we allemaal samen naar het park.', 'vamos', 'ir, nosotros'],
  ]),

  // 22 · El gerundio
  ...sentences({
    prefix: 'u1.22', page: 84, theme: 'gr-zin-gerundio', ref: 'gr.gerundio',
    instruction: 'Vul estar + gerundio in (twee woordvolgordes zijn mogelijk).',
  }, [
    ['1', '—¿Puedo hablar con Jorge? —Lo siento, en este momento no. Es que se está duchando.',
      '—Kan ik Jorge spreken? —Sorry, nu niet. Hij staat net onder de douche.', 'se está duchando', 'ducharse, él',
      { alt: ['está duchándose'] }],
    ['2', '—Chicos, ¿estáis preparados para la excursión? —Sí, ya nos estamos poniendo los zapatos y el anorak.',
      '—Jongens, zijn jullie klaar voor de uitstap? —Ja, we zijn onze schoenen en anorak al aan het aandoen.', 'nos estamos poniendo', 'ponerse, nosotros',
      { alt: ['estamos poniéndonos'] }],
    ['3', '—¿Vienen los niños a comer? —Sí, vienen enseguida. Se están lavando las manos.',
      '—Komen de kinderen eten? —Ja, ze komen meteen. Ze zijn hun handen aan het wassen.', 'Se están lavando', 'lavarse, ellos',
      { alt: ['Están lavándose'] }],
    ['4', '—¿No es Juan, el novio de Teresa? —¿Quién? ¿El chico que se está levantando?',
      '—Is dat niet Juan, de vriend van Teresa? —Wie? De jongen die aan het opstaan is?', 'se está levantando', 'levantarse, él',
      { alt: ['está levantándose'] }],
  ]),

  // 24 · La palabra correcta
  ...choices({ prefix: 'u1.24', page: 84, theme: 'gr-woordkeuze' }, [
    ['1', '¿Conoces ___ restaurante «Don Pepe»?', ['el', 'al', 'a el'], 'el',
      'Ken jij restaurant Don Pepe? Een restaurant is geen persoon → geen a.',
      { theme: 'gr-persoonlijke-a', ref: 'gr.persoonlijke-a' }],
    ['2', 'El guía ___ haciendo una pausa.', ['está', 'es', 'hay'], 'está',
      'De gids neemt een pauze. Bezig zijn met iets: estar + gerundio.',
      { theme: 'gr-zin-gerundio', ref: 'gr.gerundio' }],
    ['3', 'Este invierno ___ mucho frío.', ['hace', 'es', 'está'], 'hace',
      'Deze winter is het erg koud. Bij het weer: hace frío.'],
    ['4', 'Tengo unos pantalones ___.', ['azules', 'azulos', 'azul'], 'azules',
      'Ik heb een blauwe broek. Azul heeft geen aparte vrouwelijke vorm; meervoud: azules.',
      { theme: 'bijvoeglijk-naamwoord' }],
    ['5', 'En la montaña ___ niebla.', ['hay', 'es', 'hace'], 'hay',
      'In de bergen is het mistig: hay niebla.'],
    ['6', '¿A qué hora ___ han levantado ustedes?', ['se', 'les', 'os'], 'se',
      'Hoe laat zijn jullie opgestaan? Bij ustedes hoort het wederkerend voornaamwoord se.',
      { theme: 'gr-wederkerend', ref: 'gr.wederkerend' }],
    ['7', '___ jersey me gusta mucho.', ['Este', 'Esto', 'Esta'], 'Este',
      'Deze trui vind ik heel mooi. Esto staat nooit voor een zelfstandig naamwoord.',
      { theme: 'gr-aanwijzend', ref: 'gr.aanwijzend' }],
    ['8', 'Martín, ¿___ a mi hermana Luisa?', ['conoces', 'conozes', 'conozcas'], 'conoces',
      'Martín, ken jij mijn zus Luisa? Alleen de yo-vorm heeft -zc-: conozco, maar conoces.',
      { theme: 'gr-zin-presente', ref: 'gr.onregelmatig-yo' }],
    ['9', 'A las 10 ya estamos ___.', ['acostándonos', 'acostándose', 'acostándoos'], 'acostándonos',
      'Om 10 uur zijn we al aan het gaan slapen. Bij nosotros hoort -nos.',
      { theme: 'gr-zin-gerundio', ref: 'gr.gerundio' }],
    ['10', 'Señora Ramos, ¿ha visto ___ hijo?', ['a mi', 'mi', 'a mí'], 'a mi',
      'Mevrouw Ramos, heeft u mijn zoon gezien? Persoon → a; het bezittelijk mi (mijn) krijgt geen accent.',
      { theme: 'gr-persoonlijke-a', ref: 'gr.persoonlijke-a' }],
  ]),

  // 26 · Preguntas y respuestas
  ...choices({ prefix: 'u1.26', page: 85, theme: 'gr-woordkeuze' }, [
    ['1', '¿Qué tal el tiempo en Santiago?',
      ['En este momento está lloviendo.', 'No. Mucho gusto.', 'Estoy haciéndola.'], 'En este momento está lloviendo.',
      'Hoe is het weer in Santiago? – Op dit moment regent het.'],
    ['2', '¿Te gusta este sombrero?',
      ['Es muy elegante, pero un poco caro, ¿no?', 'Durante la semana sí, ¿y tú?', 'En la cocina, está preparando la cena.'],
      'Es muy elegante, pero un poco caro, ¿no?',
      'Vind je deze hoed mooi? – Hij is heel chic, maar een beetje duur, niet?'],
    ['3', '¿Conoces a mi hermano?',
      ['No. Mucho gusto.', 'Estoy haciéndola.', 'En este momento está lloviendo.'], 'No. Mucho gusto.',
      'Ken je mijn broer? – Nee. Aangenaam.'],
    ['4', '¿Te levantas temprano?',
      ['Durante la semana sí, ¿y tú?', 'Es muy elegante, pero un poco caro, ¿no?', 'No. Mucho gusto.'], 'Durante la semana sí, ¿y tú?',
      'Sta je vroeg op? – Tijdens de week wel, en jij?'],
    ['5', '¿Dónde está Carlos?',
      ['En la cocina, está preparando la cena.', 'Estoy haciéndola.', 'Durante la semana sí, ¿y tú?'], 'En la cocina, está preparando la cena.',
      'Waar is Carlos? – In de keuken, hij is het avondeten aan het maken.'],
    ['6', '¿Has hecho la cama?',
      ['Estoy haciéndola.', 'No. Mucho gusto.', 'En este momento está lloviendo.'], 'Estoy haciéndola.',
      'Heb je het bed opgemaakt? – Ik ben het aan het opmaken.'],
  ]),

  // 27 · Panamericana: Perú
  ...choices({ prefix: 'u1.27', page: 85, theme: 'lezen-u1' }, [
    ['1', '¿Qué ciudad peruana fue la capital del Imperio inca, con enormes muros antiguos?',
      ['Cusco', 'Lima', 'Arequipa'], 'Cusco', 'Cusco was de hoofdstad van het Incarijk.'],
    ['2', '¿Qué metrópolis peruana tiene muchos edificios de estilo colonial?',
      ['Lima', 'Iquitos', 'Machu Picchu'], 'Lima', 'Lima, de hoofdstad, heeft veel koloniale gebouwen.'],
    ['3', '¿A qué ciudad peruana solo se puede llegar en barco o en avión?',
      ['Iquitos', 'Lima', 'Arequipa'], 'Iquitos', 'Iquitos, in het Amazonewoud, bereik je alleen per boot of vliegtuig.'],
    ['4', '¿Cómo se llama un famoso escritor peruano?',
      ['Vargas Llosa', 'Carlos Gardel', 'Cervantes'], 'Vargas Llosa', 'Mario Vargas Llosa is een beroemde Peruaanse schrijver.'],
    ['5', '¿Cuál es el destino final de la ruta de 45 km a 4500 m de altura, el Camino Inca?',
      ['Machu Picchu', 'Cusco', 'Iquitos'], 'Machu Picchu', 'Het Camino Inca eindigt in Machu Picchu.'],
    ['6', '¿Qué ciudad peruana tiene un clima fantástico y 300 días de sol al año?',
      ['Arequipa', 'Lima', 'Iquitos'], 'Arequipa', 'Arequipa heeft 300 zonnige dagen per jaar.'],
    ['7', '¿Cómo se llama en Perú el mal de altura?',
      ['el soroche', 'el mate', 'la niebla'], 'el soroche', 'Soroche is hoogteziekte, het grootste probleem op het Camino Inca.'],
  ]),
];

/* ------------------------------------------------------------------ */
/* Unidad 2 · Tengo planes                                             */
/* ------------------------------------------------------------------ */

const ETIQUETA = 't.wb-u2.etiqueta';

const unidad2 = [
  // 1a · Actividades de tiempo libre
  grammar({
    id: 'u2.1-tiempo-libre', page: 87, theme: 'gr-woordkeuze',
    rule: 'Welk werkwoord hoort bij deze vrijetijdsactiviteit?',
  }, [
    ['Los domingos me gusta ___ senderismo.', 'hacer', 'Op zondag maak ik graag trektochten.', ['hacer', 'tocar', 'jugar', 'ir']],
    ['Mi hermano sabe ___ un instrumento.', 'tocar', 'Mijn broer kan een instrument bespelen.', ['tocar', 'jugar', 'hacer', 'ir']],
    ['Esta tarde quiero ___ de compras.', 'ir', 'Vanmiddag wil ik gaan winkelen.', ['ir', 'hacer', 'jugar', 'tocar']],
    ['¿Sabes ___ al ajedrez?', 'jugar', 'Kun jij schaken?', ['jugar', 'tocar', 'hacer', 'ir']],
    ['¿Quieres ___ al cine esta noche?', 'ir', 'Wil je vanavond naar de film gaan?', ['ir', 'jugar', 'hacer', 'tocar']],
    ['Me gusta ___ en bicicleta.', 'ir', 'Ik fiets graag.', ['ir', 'jugar', 'hacer', 'tocar']],
    ['Los martes vamos a ___ al tenis.', 'jugar', 'Op dinsdag gaan we tennissen.', ['jugar', 'hacer', 'tocar', 'ir']],
    ['Por la tarde me gusta ___ por el parque.', 'pasear', 'In de namiddag wandel ik graag door het park.', ['pasear', 'jugar', 'tocar', 'hacer']],
    ['Los niños quieren ___ al fútbol.', 'jugar', 'De kinderen willen voetballen.', ['jugar', 'hacer', 'tocar', 'cantar']],
    ['A mi madre le gusta ___ en un coro.', 'cantar', 'Mijn moeder zingt graag in een koor.', ['cantar', 'tocar', 'jugar', 'hacer']],
    ['Dos veces por semana voy a ___ yoga.', 'hacer', 'Twee keer per week ga ik yoga doen.', ['hacer', 'jugar', 'tocar', 'ir']],
    ['¿Sabes ___ el piano?', 'tocar', 'Kun jij piano spelen?', ['tocar', 'jugar', 'hacer', 'cantar']],
    ['Después del trabajo quiero ___ al gimnasio.', 'ir', 'Na het werk wil ik naar de fitness gaan.', ['ir', 'hacer', 'jugar', 'pasear']],
  ]),

  // 4 · Correo electrónico de Lety a Nuria
  ...sentences({
    prefix: 'u2.4', page: 88, theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp',
    instruction: 'Vul het juiste voornaamwoord in.',
  }, [
    ['1', 'Hola, Nuria: esta semana no te he llamado, lo siento.',
      'Dag Nuria, deze week heb ik je niet gebeld, sorry.', 'te', 'a ti, Nuria'],
    ['2', 'Es que mi hermana Ángela está conmigo aquí en casa por dos semanas.',
      'Mijn zus Ángela logeert namelijk twee weken bij mij thuis.', 'conmigo', 'con + yo',
      { theme: 'voornaamwoorden', ref: null }],
    ['3', 'Estoy pasando mucho tiempo con ella porque la veo muy poco.',
      'Ik breng veel tijd met haar door, want ik zie haar heel weinig.', 'ella', 'con + Ángela',
      { theme: 'voornaamwoorden', ref: null }],
    ['4', 'Estoy pasando mucho tiempo con ella porque la veo muy poco.',
      'Ik breng veel tijd met haar door, want ik zie haar heel weinig.', 'la', 'Ángela, lijdend voorwerp'],
    ['5', 'A nosotras nos encanta estar juntas.',
      'Wij zijn dol op samen zijn.', 'nos', 'a nosotras',
      { theme: 'voornaamwoorden', ref: 'gr.meewerkend-voorwerp' }],
    ['6', 'Tú la conoces. Es la que vive en Chile.',
      'Jij kent haar (Ángela). Zij is degene die in Chili woont.', 'la', 'Ángela, lijdend voorwerp'],
    ['7', 'Pero como ves, ¡no te olvido!',
      'Maar zoals je ziet, vergeet ik je niet!', 'te', 'a ti, Nuria'],
    ['8', 'En los próximos días te llamo y salimos las tres juntas, ¿vale?',
      'Een van de komende dagen bel ik je en gaan we met z’n drieën uit, oké?', 'te', 'a ti, Nuria'],
  ]),

  // 7 · Los restaurantes de moda — que of donde
  ...sentences({
    prefix: 'u2.7', page: 89, theme: 'voornaamwoorden',
    instruction: 'Kies het juiste betrekkelijk voornaamwoord: que of donde.',
  }, [
    ['1', '¿Conoce usted los restaurantes que están de moda en Madrid?',
      'Kent u de restaurants die in Madrid in de mode zijn?', 'que', null, { options: ['que', 'donde'] }],
    ['2', 'En el centro le recomendamos el restaurante Sergi Arola, donde el famoso chef presenta sus creaciones.',
      'In het centrum raden we u restaurant Sergi Arola aan, waar de beroemde chef zijn creaties voorstelt.', 'donde', null, { options: ['que', 'donde'] }],
    ['3', 'En las afueras, usted puede comer en el Antiguo Convento de Boadilla del Monte, donde se sirven excelentes carnes.',
      'Buiten de stad kunt u eten in het Antiguo Convento van Boadilla del Monte, waar uitstekend vlees wordt geserveerd.', 'donde', null, { options: ['que', 'donde'] }],
    ['4', 'Otra posibilidad es La Dorada, un restaurante que ofrece especialidades de pescado.',
      'Een andere mogelijkheid is La Dorada, een restaurant dat visspecialiteiten aanbiedt.', 'que', null, { options: ['que', 'donde'] }],
    ['5', 'La Dorada es un restaurante donde los clientes cenan en pequeñas cabinas.',
      'La Dorada is een restaurant waar de klanten in kleine cabines dineren.', 'donde', null, { options: ['que', 'donde'] }],
    ['6', 'The Grill Club es un restaurante que es conocido por sus platos especiales.',
      'The Grill Club is een restaurant dat bekend is om zijn bijzondere gerechten.', 'que', null, { options: ['que', 'donde'] }],
    ['7', 'The Grill Club es un restaurante donde usted puede disfrutar de un menú internacional.',
      'The Grill Club is een restaurant waar u van een internationaal menu kunt genieten.', 'donde', null, { options: ['que', 'donde'] }],
  ]),

  // 8 · ¿Conoce el origen de estas cosas?
  ...sentences({
    prefix: 'u2.8', page: 89, theme: 'bijvoeglijk-naamwoord',
    instruction: 'Vul het bijvoeglijk naamwoord van nationaliteit in.',
  }, [
    ['1', 'La sangría es una bebida española.', 'Sangria is een Spaanse drank.', 'española', 'España'],
    ['2', 'El tango es un baile argentino.', 'De tango is een Argentijnse dans.', 'argentino', 'Argentina'],
    ['3', 'Las patatas fritas son una especialidad belga.', 'Frieten zijn een Belgische specialiteit.', 'belga', 'Bélgica'],
    ['4', 'El döner es un plato turco.', 'Döner is een Turks gerecht.', 'turco', 'Turquía'],
    ['5', 'Los tacos son una comida mexicana.', 'Taco’s zijn Mexicaans eten.', 'mexicana', 'México'],
    ['6', 'El Mercedes es un coche alemán.', 'De Mercedes is een Duitse auto.', 'alemán', 'Alemania'],
    ['7', 'IKEA es una tienda de muebles sueca.', 'IKEA is een Zweedse meubelwinkel.', 'sueca', 'Suecia'],
    ['8', 'Zara es una marca de ropa española.', 'Zara is een Spaans kledingmerk.', 'española', 'España'],
  ]),

  // 9 · ¿Saber o poder?
  ...sentences({
    prefix: 'u2.9', page: 90, theme: 'gr-woordkeuze',
    instruction: 'Saber of poder? Kies de juiste vorm.',
  }, [
    ['1', '—Perdone, ¿puede decirme dónde hay una parada de taxis?',
      'Pardon, kunt u me zeggen waar er een taxistandplaats is?', 'puede', 'saber / poder, usted', { options: ['puede', 'sabe'] }],
    ['2', '—Lo siento, no lo sé, no soy de aquí.',
      'Sorry, ik weet het niet, ik ben niet van hier.', 'sé', 'saber / poder, yo', { options: ['sé', 'puedo'] }],
    ['3', 'Me encanta esa discoteca porque se puede bailar salsa.',
      'Ik ben dol op die discotheek, want je kunt er salsa dansen.', 'puede', 'saber / poder', { options: ['puede', 'sabe'] }],
    ['4', 'Gracias, pero no sé bailar, y menos salsa.',
      'Bedankt, maar ik kan niet dansen, en al zeker geen salsa.', 'sé', 'saber / poder, yo', { options: ['sé', 'puedo'] }],
    ['5', '¿Queréis venir a casa el domingo a cenar? Javier sabe hacer una paella fantástica.',
      'Komen jullie zondag bij ons eten? Javier kan een fantastische paella maken.', 'sabe', 'saber / poder, él', { options: ['sabe', 'puede'] }],
    ['6', '¡Sí, gracias! Pero, ¿puedo llevar a mi hermana?',
      'Ja, graag! Maar mag ik mijn zus meebrengen?', 'puedo', 'saber / poder, yo', { options: ['puedo', 'sé'] }],
  ]),

  // 10 · ¡Qué rico! — de, al of a la
  grammar({
    id: 'u2.10-de-al-a-la', page: 90, theme: 'gr-woordkeuze',
    rule: 'De (ingrediënt) of al / a la (bereidingswijze)?',
  }, [
    ['calamares ___ romana', 'a la', 'gefrituurde inktvisringen', ['de', 'al', 'a la']],
    ['pollo ___ ajillo', 'al', 'kip met look', ['de', 'al', 'a la']],
    ['merluza ___ romana', 'a la', 'gefrituurde heek', ['de', 'al', 'a la']],
    ['helado ___ manzana', 'de', 'appelijs', ['de', 'al', 'a la']],
    ['tarta ___ chocolate', 'de', 'chocoladetaart', ['de', 'al', 'a la']],
    ['chuleta ___ cerdo', 'de', 'varkenskotelet', ['de', 'al', 'a la']],
    ['sopa ___ verdura', 'de', 'groentesoep', ['de', 'al', 'a la']],
    ['ensalada ___ tomate', 'de', 'tomatensalade', ['de', 'al', 'a la']],
    ['macedonia ___ fruta', 'de', 'fruitsalade', ['de', 'al', 'a la']],
    ['gambas ___ plancha', 'a la', 'gegrilde garnalen', ['de', 'al', 'a la']],
    ['espaguetis ___ boloñesa', 'a la', 'spaghetti bolognese', ['de', 'al', 'a la']],
  ]),

  // 12 · ¿'Otro/-a' o 'un poco más de'?
  ...sentences({
    prefix: 'u2.12', page: 91, theme: 'gr-woordkeuze',
    instruction: 'Otro/-a of un poco más de?',
  }, [
    ['1', 'Perdón, ¿nos trae otro cuchillo, por favor? Falta uno.',
      'Pardon, kunt u ons nog een mes brengen? Er ontbreekt er een.', 'otro', 'el cuchillo',
      { options: ['otro', 'otra', 'un poco más de'] }],
    ['2', '¿Me puede traer un poco más de sal?',
      'Kunt u me nog wat zout brengen?', 'un poco más de', 'la sal',
      { options: ['un poco más de', 'otra', 'otro'] }],
    ['3', 'Quería otra cerveza, por favor.',
      'Ik had graag nog een bier.', 'otra', 'la cerveza',
      { options: ['otra', 'otro', 'un poco más de'] }],
    ['4', '¿Me trae un poco más de pan, por favor?',
      'Kunt u me nog wat brood brengen?', 'un poco más de', 'el pan',
      { options: ['un poco más de', 'otro', 'otra'] }],
    ['5', 'Camarero, ¡otra tarta de chocolate, por favor!',
      'Ober, nog een chocoladetaart, alstublieft!', 'otra', 'la tarta',
      { options: ['otra', 'otro', 'un poco más de'] }],
  ]),

  // 13 · Frases típicas en un restaurante
  ...sentences({
    prefix: 'u2.13', page: 91, theme: 'gr-woordkeuze',
    instruction: 'Vul de typische restaurantzin aan.',
  }, [
    ['1', '¿Qué van a tomar?', 'Wat zullen jullie nemen?', 'tomar', 'de ober vraagt'],
    ['2', 'La tortilla, ¿se come caliente o fría?', 'Eet je de tortilla warm of koud?', 'se come', 'comer'],
    ['3', '¿De postre qué hay?', 'Wat is er als dessert?', 'hay', 'de klant vraagt', { alt: ['tiene', 'tienen'] }],
    ['4', '¿Nos trae un poco más de pan?', 'Brengt u ons nog wat brood?', 'un poco más de', 'la cantidad', { alt: ['un poco de'] }],
    ['8', '¿Lleva mayonesa la ensalada?', 'Zit er mayonaise in de salade?', 'Lleva', 'llevar'],
    ['9', 'De primero hay sopa o ensalada.', 'Als voorgerecht is er soep of salade.', 'primero', 'voorgerecht'],
    ['10', '¿Qué les pongo para beber?', 'Wat mag ik u te drinken brengen?', 'pongo', 'de ober vraagt', { alt: ['traigo'] }],
  ]),

  // 14 · ¿Ser o estar? (valoración ↔ definición)
  ...sentences({
    prefix: 'u2.14', page: 91, theme: 'ser-estar', ref: 'gr.ser-estar',
    instruction: 'Ser of estar? Estar om eten te beoordelen, ser om het te definiëren.',
  }, [
    ['1', '—¿Cómo están tus patatas, Lola?', 'Hoe zijn je aardappelen, Lola?', 'están', 'ser / estar', { options: ['están', 'son'] }],
    ['2', '—Están muy picantes, ¡llevan mucho tabasco!', 'Ze zijn heel pikant, er zit veel tabasco in!', 'Están', 'ser / estar', { options: ['Están', 'Son'] }],
    ['3', '—La merluza es un pescado, ¿verdad?', 'Heek is een vis, toch?', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['4', '—Sí, señora, y la preparamos con salsa de vino blanco. Está muy rica.',
      'Ja, mevrouw, en we bereiden ze met een wittewijnsaus. Ze is heel lekker.', 'Está', 'ser / estar', { options: ['Está', 'Es'] }],
    ['5', '—¿Cuál es el vino de la casa?', 'Wat is de huiswijn?', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['6', '—Es un Rioja. Es un tinto muy bueno.', 'Het is een Rioja. Het is een heel goede rode wijn.', 'Es', 'ser / estar', { options: ['Es', 'Está'] }],
    ['7', '—Mi café no está caliente.', 'Mijn koffie is niet warm.', 'está', 'ser / estar', { options: ['está', 'es'] }],
    ['8', '—¿De verdad? Mi té sí. ¡Está muy, muy caliente!', 'Echt? Mijn thee wel. Die is heel, heel heet!', 'Está', 'ser / estar', { options: ['Está', 'Es'] }],
  ]),

  // 17 · Crucigrama de nacionalidades
  ...sentences({
    prefix: 'u2.17', page: 92, theme: 'bijvoeglijk-naamwoord',
    instruction: 'Vul het bijvoeglijk naamwoord van nationaliteit in.',
  }, [
    ['1', 'El Rioja es un vino español famoso.', 'Rioja is een bekende Spaanse wijn.', 'español', 'España'],
    ['2', 'El Roquefort es un queso francés.', 'Roquefort is een Franse kaas.', 'francés', 'Francia'],
    ['3', 'Mercedes es una marca alemana de coches.', 'Mercedes is een Duits automerk.', 'alemana', 'Alemania'],
    ['5', 'Ámsterdam es la capital holandesa.', 'Amsterdam is de Nederlandse hoofdstad.', 'holandesa', 'Holanda', { alt: ['neerlandesa'] }],
    ['6', 'Sicilia es una isla italiana.', 'Sicilië is een Italiaans eiland.', 'italiana', 'Italia'],
    ['7', 'Mozart fue un músico y compositor austríaco.', 'Mozart was een Oostenrijks musicus en componist.', 'austríaco', 'Austria', { alt: ['austriaco'] }],
    ['8', 'Mary Quant fue una diseñadora inglesa, madre de la minifalda.', 'Mary Quant was een Engelse ontwerpster, de moeder van de minirok.', 'inglesa', 'Inglaterra'],
    ['10', 'Zúrich es una ciudad suiza con muchos bancos.', 'Zürich is een Zwitserse stad met veel banken.', 'suiza', 'el país: Suiza'],
  ]),

  // 18 · ¿'Que' o 'donde'? (Sevilla y Bogotá)
  ...sentences({
    prefix: 'u2.18', page: 92, theme: 'voornaamwoorden',
    instruction: 'Kies het juiste betrekkelijk voornaamwoord: que of donde.',
  }, [
    ['1', 'Triana es un barrio tradicional que está al otro lado del río Guadalquivir.',
      'Triana is een traditionele wijk aan de overkant van de Guadalquivir.', 'que', null, { options: ['que', 'donde'] }],
    ['2', 'TransMilenio es un sistema de transporte que funciona como el metro.',
      'TransMilenio (in Bogotá) is een vervoerssysteem dat werkt zoals de metro.', 'que', null, { options: ['que', 'donde'] }],
    ['3', 'El Guadalquivir es el río que pasa por Sevilla.',
      'De Guadalquivir is de rivier die door Sevilla stroomt.', 'que', null, { options: ['que', 'donde'] }],
    ['4', 'El Museo del Oro es un edificio donde podemos ver objetos de oro.',
      'Het Museo del Oro is een gebouw waar we gouden voorwerpen kunnen zien.', 'donde', null, { options: ['que', 'donde'] }],
    ['5a', 'La calle Sierpes es una calle donde hay muchas tiendas que venden cerámica.',
      'De calle Sierpes is een straat waar veel winkels zijn die keramiek verkopen.', 'donde', null, { options: ['que', 'donde'] }],
    ['5b', 'La calle Sierpes es una calle donde hay muchas tiendas que venden cerámica.',
      'De calle Sierpes is een straat waar veel winkels zijn die keramiek verkopen.', 'que', null, { options: ['que', 'donde'] }],
    ['6', 'La catedral de Sevilla es un edificio donde está la tumba de Cristóbal Colón.',
      'De kathedraal van Sevilla is een gebouw waar het graf van Christoffel Columbus is.', 'donde', null, { options: ['que', 'donde'] }],
    ['7', 'Santa Cruz es el barrio típico que asociamos con Sevilla.',
      'Santa Cruz is de typische wijk die we met Sevilla associëren.', 'que', null, { options: ['que', 'donde'] }],
    ['8', 'El Museo de Bellas Artes es el museo sevillano donde hay cuadros de Goya y Rubens.',
      'Het Museo de Bellas Artes is het Sevillaanse museum waar schilderijen van Goya en Rubens hangen.', 'donde', null, { options: ['que', 'donde'] }],
  ]),

  // 19 · ¿'Ser' o 'estar'? — een raadspel over een stad
  ...sentences({
    prefix: 'u2.19', page: 92, theme: 'ser-estar', ref: 'gr.ser-estar',
    instruction: 'Ser of estar? Een raadspel over een stad.',
  }, [
    ['1', 'Es una ciudad.', 'Het is een stad.', 'Es', 'ser / estar', { options: ['Es', 'Está'] }],
    ['2', '¿Es española?', 'Is ze Spaans?', 'Es', 'ser / estar', { options: ['Es', 'Está'] }],
    ['3', 'No, es latinoamericana.', 'Nee, ze is Latijns-Amerikaans.', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['4', '¿Está en Centroamérica?', 'Ligt ze in Centraal-Amerika?', 'Está', 'ser / estar', { options: ['Está', 'Es'] }],
    ['5', '¿Es una capital?', 'Is het een hoofdstad?', 'Es', 'ser / estar', { options: ['Es', 'Está'] }],
    ['6', '¿Está en la costa? —Sí, está en la costa.', 'Ligt ze aan de kust? —Ja, ze ligt aan de kust.', 'Está', 'ser / estar', { options: ['Está', 'Es'] }],
    ['7', '¿Es Ciudad de Panamá, la capital de Panamá?', 'Is het Panama-Stad, de hoofdstad van Panama?', 'Es', 'ser / estar', { options: ['Es', 'Está'] }],
    ['8', 'Eso es.', 'Juist, dat is het.', 'es', 'ser / estar', { options: ['es', 'está'] }],
  ]),

  // 20a · En el restaurante — es/son of está/n
  ...sentences({
    prefix: 'u2.20a', page: 93, theme: 'ser-estar', ref: 'gr.ser-estar',
    instruction: 'Ser of estar? Beschrijven (ser) of beoordelen (estar).',
  }, [
    ['1', 'La cocina mexicana es picante, pero muy buena.', 'De Mexicaanse keuken is pikant, maar heel lekker.', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['2', '¡Qué rica está la tarta!', 'Wat is de taart lekker!', 'está', 'ser / estar', { options: ['está', 'es'] }],
    ['3', 'Las patatas fritas están muy saladas.', 'De frieten zijn erg zout.', 'están', 'ser / estar', { options: ['están', 'son'] }],
    ['4', 'Excelente, el pollo con gambas está muy rico.', 'Uitstekend, de kip met garnalen is heel lekker.', 'está', 'ser / estar', { options: ['está', 'es'] }],
    ['5', 'La crema catalana está demasiado dulce.', 'De crema catalana is te zoet.', 'está', 'ser / estar', { options: ['está', 'es'] }],
    ['6', 'El gazpacho es frío y lleva verduras.', 'Gazpacho is koud en er zitten groenten in.', 'es', 'ser / estar', { options: ['es', 'está'] }],
  ]),

  // 20b · ¿'Ser' o 'estar'? Un resumen
  ...sentences({
    prefix: 'u2.20b', page: 93, theme: 'ser-estar', ref: 'gr.ser-estar',
    instruction: 'Ser of estar?',
  }, [
    ['1', 'Peter es inglés.', 'Peter is Engels. (nationaliteit)', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['2', 'Luisa es ingeniera.', 'Luisa is ingenieur. (beroep)', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['3', 'Ana es muy amable.', 'Ana is heel vriendelijk. (karakter)', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['4', 'La paella es un plato español.', 'Paella is een Spaans gerecht. (definitie)', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['5', 'Mi coche es azul.', 'Mijn auto is blauw. (kleur)', 'es', 'ser / estar', { options: ['es', 'está'] }],
    ['6', 'El café Torino está en la Plaza Mayor.', 'Café Torino ligt op de Plaza Mayor. (plaats)', 'está', 'ser / estar', { options: ['está', 'es'] }],
    ['7', 'Esta sopa está muy rica.', 'Deze soep is heel lekker. (beoordeling)', 'está', 'ser / estar', { options: ['está', 'es'] }],
    ['8', 'Estoy cansado.', 'Ik ben moe. (toestand)', 'Estoy', 'ser / estar', { options: ['Estoy', 'Soy'] }],
  ]),

  // 21 · El verbo 'ir' + voorzetsel
  grammar({
    id: 'u2.21-ir', page: 93, theme: 'gr-woordkeuze',
    rule: 'Ir a, con, de of en?',
  }, [
    ['Mañana vamos ___ una exposición.', 'a', 'Morgen gaan we naar een tentoonstelling.', ['a', 'con', 'de', 'en']],
    ['¿Vas ___ la sauna esta tarde?', 'a', 'Ga je vanmiddag naar de sauna?', ['a', 'con', 'de', 'en']],
    ['En verano voy ___ Francia.', 'a', 'In de zomer ga ik naar Frankrijk.', ['a', 'con', 'de', 'en']],
    ['Voy al cine ___ Pablo.', 'con', 'Ik ga met Pablo naar de film.', ['a', 'con', 'de', 'en']],
    ['Siempre voy de vacaciones ___ mis amigos.', 'con', 'Ik ga altijd met mijn vrienden op vakantie.', ['a', 'con', 'de', 'en']],
    ['Los sábados voy ___ compras.', 'de', 'Op zaterdag ga ik winkelen.', ['a', 'con', 'de', 'en']],
    ['El domingo vamos ___ excursión.', 'de', 'Zondag gaan we op uitstap.', ['a', 'con', 'de', 'en']],
    ['La semana que viene me voy ___ viaje.', 'de', 'Volgende week ga ik op reis.', ['a', 'con', 'de', 'en']],
    ['Voy a Madrid ___ avión.', 'en', 'Ik ga met het vliegtuig naar Madrid.', ['a', 'con', 'de', 'en']],
    ['Voy al trabajo ___ bicicleta.', 'en', 'Ik ga met de fiets naar het werk.', ['a', 'con', 'de', 'en']],
    ['¿Vais ___ tren o en coche?', 'en', 'Gaan jullie met de trein of met de auto?', ['a', 'con', 'de', 'en']],
  ]),

  // 23 · Planes para el fin de semana — ir + voorzetsel
  ...sentences({
    prefix: 'u2.23', page: 94, theme: 'gr-zin-presente', ref: 'gr.presente',
    instruction: 'Vul de juiste vorm van ir in, met het juiste voorzetsel.',
  }, [
    ['1', '—Julia, ¿qué vas a hacer este fin de semana?', 'Julia, wat ga jij dit weekend doen?', 'vas a', 'ir + voorzetsel, tú', { ref: 'gr.ir-a' }],
    ['2', '—Esta noche voy a casa de Marcos a cenar.', 'Vanavond ga ik bij Marcos eten.', 'voy a', 'ir + voorzetsel, yo'],
    ['3', 'Voy con mi hermana Inés, que está de visita.', 'Ik ga met mijn zus Inés, die op bezoek is.', 'Voy con', 'ir + voorzetsel, yo'],
    ['4', 'Toni y yo vamos de excursión a la montaña el sábado.', 'Toni en ik gaan zaterdag op uitstap naar de bergen.', 'vamos de', 'ir + voorzetsel, nosotros'],
    ['5', 'Esta noche yo voy al cine con una amiga.', 'Vanavond ga ik met een vriendin naar de film.', 'voy al', 'ir + voorzetsel, yo'],
    ['6', 'Toni va a jugar al tenis esta noche.', 'Toni gaat vanavond tennissen.', 'va a', 'ir + voorzetsel, él', { ref: 'gr.ir-a' }],
    ['7', 'Después vamos de copas con los amigos del tenis de Toni.', 'Daarna gaan we iets drinken met Toni’s tennisvrienden.', 'vamos de', 'ir + voorzetsel, nosotros'],
    ['8', 'Primero Inés y yo vamos a desayunar en un café.', 'Eerst gaan Inés en ik ontbijten in een café.', 'vamos a', 'ir + voorzetsel, nosotras', { ref: 'gr.ir-a' }],
    ['9', 'Luego ella va de compras. A mí no me gusta.', 'Daarna gaat zij winkelen. Ik hou daar niet van.', 'va de', 'ir + voorzetsel, ella'],
    ['10a', 'Por la noche vamos juntas a bailar salsa.', '’s Avonds gaan we samen salsa dansen.', 'vamos', 'ir, nosotras', { ref: 'gr.ir-a' }],
    ['10b', 'Por la noche vamos juntas a bailar salsa.', '’s Avonds gaan we samen salsa dansen.', 'a', 'voorzetsel', { ref: 'gr.ir-a' }],
    ['11', 'Y vosotros, ¿vais en coche o en tren a la montaña?', 'En jullie, gaan jullie met de auto of met de trein naar de bergen?', 'vais en', 'ir + voorzetsel, vosotros'],
    ['12', '—En coche, además llevamos también las bicicletas.', 'Met de auto, dan nemen we ook de fietsen mee.', 'En', 'voorzetsel'],
    ['13', 'Mi hermana se va por la mañana y yo solo quiero descansar.', 'Mijn zus vertrekt ’s ochtends en ik wil alleen maar uitrusten.', 'va', 'irse, ella'],
  ]),

  // 24 · ¿Qué palabra no forma parte del grupo?
  ...oddOneOut({ prefix: 'u2.24', page: 94 }, [
    ['1', ['correr', 'cantar', 'esquiar', 'nadar'], 'cantar', 'Zingen is geen sport.'],
    ['2', ['tenis', 'fútbol', 'dominó', 'golf'], 'dominó', 'Domino is geen sport.'],
    ['3', ['concierto', 'programa', 'película', 'exposición'], 'programa', 'Een programma is geen vrijetijdsactiviteit.'],
    ['4', ['Vale.', 'Perfecto.', 'Qué pena.', 'Buena idea.'], 'Qué pena.', 'Met ¡Qué pena! aanvaard je geen voorstel.'],
    ['5', ['primero', 'segundo', 'último', 'postre'], 'último', 'Último is geen gang van de maaltijd.'],
    ['6', ['filete', 'chuleta', 'merluza', 'pollo'], 'merluza', 'Heek is vis, geen vlees.'],
    ['7', ['sopa', 'tarta', 'crema catalana', 'flan'], 'sopa', 'Soep is geen dessert.'],
    ['8', ['salado', 'asado', 'dulce', 'picante'], 'asado', 'Asado (gebraden) is geen smaak.'],
  ]),

  // 25 · Preguntas y respuestas
  ...choices({ prefix: 'u2.25', page: 94, theme: 'gr-woordkeuze' }, [
    ['1', '¿Qué tal si vamos el viernes a la sauna?',
      ['Perfecto, ¿dónde quedamos?', 'Para mí, una sopa de tomate.', 'Sí, he hecho dos cursos en el Caribe.'],
      'Perfecto, ¿dónde quedamos?', 'Zullen we vrijdag naar de sauna gaan? – Perfect, waar spreken we af?'],
    ['2', '¿Tomamos una copa después de la clase?',
      ['Mejor antes, es que tengo entradas para el teatro.', 'Sí, claro, aceptamos Visa y Mastercard.', 'Para mí, una sopa de tomate.'],
      'Mejor antes, es que tengo entradas para el teatro.', 'Gaan we iets drinken na de les? – Liever ervoor, want ik heb tickets voor het theater.'],
    ['3', '¿A qué hora quedamos?',
      ['No sé, ¿a las siete o siete y media?', 'Sí, he hecho dos cursos en el Caribe.', 'No, es que los dulces no me gustan.'],
      'No sé, ¿a las siete o siete y media?', 'Hoe laat spreken we af? – Ik weet het niet, om zeven uur of half acht?'],
    ['4', '¿Qué desean de primero?',
      ['Para mí, una sopa de tomate.', 'No sé, ¿a las siete o siete y media?', 'Sí, claro, aceptamos Visa y Mastercard.'],
      'Para mí, una sopa de tomate.', 'Wat wensen jullie als voorgerecht? – Voor mij een tomatensoep.'],
    ['5', '¿Sabes hacer una tarta vienesa?',
      ['No, es que los dulces no me gustan.', 'Perfecto, ¿dónde quedamos?', 'Sí, claro, aceptamos Visa y Mastercard.'],
      'No, es que los dulces no me gustan.', 'Kun jij een Weense taart maken? – Nee, ik hou niet van zoetigheid.'],
    ['6', '¿Podemos pagar con tarjeta?',
      ['Sí, claro, aceptamos Visa y Mastercard.', 'Sí, he hecho dos cursos en el Caribe.', 'Para mí, una sopa de tomate.'],
      'Sí, claro, aceptamos Visa y Mastercard.', 'Kunnen we met de kaart betalen? – Ja, natuurlijk, we aanvaarden Visa en Mastercard.'],
    ['7', '¿Sabes bucear?',
      ['Sí, he hecho dos cursos en el Caribe.', 'Sí, claro, aceptamos Visa y Mastercard.', 'No sé, ¿a las siete o siete y media?'],
      'Sí, he hecho dos cursos en el Caribe.', 'Kun jij duiken? – Ja, ik heb twee cursussen gevolgd in de Caraïben.'],
    ['8', '¿Van a tomar postre?',
      ['No, gracias, solo un café.', 'Perfecto, ¿dónde quedamos?', 'Sí, he hecho dos cursos en el Caribe.'],
      'No, gracias, solo un café.', 'Nemen jullie een dessert? – Nee, dank u, alleen een koffie.'],
  ]),

  // 26 · La palabra correcta
  ...choices({ prefix: 'u2.26', page: 94, theme: 'gr-woordkeuze' }, [
    ['1', '¿Vas ___ al mercado?', ['conmigo', 'con mi', 'con me'], 'conmigo',
      'Ga je met mij naar de markt? Con + mí wordt conmigo.', { theme: 'voornaamwoorden' }],
    ['2', 'Para ___ de postre un helado.', ['mí', 'me', 'mi'], 'mí',
      'Voor mij als dessert een ijsje. Na een voorzetsel: mí, met accent.', { theme: 'voornaamwoorden' }],
    ['3', 'Menorca es un lugar ___ me gusta mucho.', ['que', 'donde'], 'que',
      'Menorca is een plek die ik heel mooi vind. Het lugar is hier het onderwerp van gustar, dus que.', { theme: 'voornaamwoorden' }],
    ['4', 'Mi filete ___ demasiado picante.', ['está', 'es'], 'está',
      'Mijn biefstuk is te pikant. Eten beoordelen: estar.', { theme: 'ser-estar', ref: 'gr.ser-estar' }],
    ['5', 'La paella ___ una especialidad de Valencia.', ['es', 'está'], 'es',
      'Paella is een specialiteit uit Valencia. Definitie: ser.', { theme: 'ser-estar', ref: 'gr.ser-estar' }],
    ['6', 'Mis amigas Karin y Sabine son ___.', ['belgas', 'belgos', 'belgues'], 'belgas',
      'Mijn vriendinnen Karin en Sabine zijn Belgisch. Belga is mannelijk en vrouwelijk gelijk.', { theme: 'bijvoeglijk-naamwoord' }],
    ['7', 'Por favor, ¿nos trae ___ pan?', ['más', 'más de', 'mucho de'], 'más',
      'Kunt u ons nog brood brengen, alstublieft? Más pan of un poco más de pan, maar niet más de pan.'],
    ['8', '¿Me trae ___ café?', ['otro', 'un otro', 'una otra'], 'otro',
      'Brengt u me nog een koffie? Otro nooit samen met un/una.'],
  ]),

  // 28 · Panamericana: Chile
  ...choices({ prefix: 'u2.28', page: 95, theme: 'lezen-u2' }, [
    ['1', '¿Cuántos kilómetros de longitud tiene Chile?', ['4200 km', '1200 km', '8000 km'], '4200 km',
      'Chili is ongeveer 4200 km lang.'],
    ['2', '¿Cómo se llama el desierto más seco del mundo?', ['Atacama', 'Sonora', 'Patagonia'], 'Atacama',
      'De Atacama is de droogste woestijn ter wereld.'],
    ['3', '¿Dónde está el desierto de Atacama?', ['En el norte de Chile', 'En el sur de Chile', 'En la Isla de Pascua'], 'En el norte de Chile',
      'De Atacama ligt in het noorden van Chili.'],
    ['4', '¿Dónde hay fiordos, glaciares y pingüinos?', ['En la Patagonia', 'En el desierto de Atacama', 'En Valparaíso'], 'En la Patagonia',
      'Fjorden, gletsjers en pinguïns vind je in Patagonië.'],
    ['5', '¿Dónde están los moáis?', ['En la Isla de Pascua', 'En la Patagonia', 'En Santiago'], 'En la Isla de Pascua',
      'De moai-beelden staan op Paaseiland.'],
    ['6', '¿Por qué es famoso Valparaíso?',
      ['Es la capital cultural, Patrimonio de la Humanidad, y tiene un puerto importante.', 'Es el desierto más seco del mundo.', 'Tiene fiordos, glaciares y pingüinos.'],
      'Es la capital cultural, Patrimonio de la Humanidad, y tiene un puerto importante.',
      'Valparaíso is de culturele hoofdstad, werelderfgoed, en heeft een belangrijke haven.'],
  ]),

  // 29 · Reglas de etiqueta en una comida de trabajo
  ...[
    ['1', 'Dejar los móviles encima de la mesa.', 'No', 'De gsm’s worden uitgeschakeld en liggen niet op tafel.'],
    ['2', 'Dejar las llaves y la agenda en la mesa.', 'No', 'Ook sleutels en agenda’s horen niet op tafel.'],
    ['3', 'No pedir platos caros y fuertes.', 'Sí', 'Gasten bestellen geen dure gerechten: een zakenlunch is geen banket.'],
    ['4', 'Hablar no solo del trabajo.', 'Sí', 'Praat ook over algemene onderwerpen; het werk komt pas bij het dessert.'],
    ['5', 'Pasar mucho tiempo tomando café.', 'No', 'Als de vergadering ’s middags verdergaat, blijf je niet lang koffiedrinken.'],
    ['6', 'Pagar cada persona su parte.', 'No', 'De persoon die uitnodigt, betaalt de rekening.'],
  ].map(([n, q, answer, nl]) => ({
    id: `r.wb-u2.etiqueta.${n}`, kind: 'reading', theme: 'lezen-u2', src: src(95), text: ETIQUETA,
    q: `¿Es correcto en una comida de trabajo? «${q}»`, options: ['Sí', 'No'], answer, nl,
  })),
];

/* ------------------------------------------------------------------ */
/* Unidad 3 · Casa nueva, vida nueva                                   */
/* ------------------------------------------------------------------ */

const unidad3 = [
  // 1 · El piso de Carina y Nicolás
  ...sentences({
    prefix: 'u3.1', page: 97, theme: 'gr-woordkeuze',
    instruction: 'Kies het juiste woord.',
  }, [
    ['1', '¿Qué tal vuestro nuevo piso?', 'Hoe is jullie nieuwe appartement?', 'piso', null,
      { options: ['piso', 'metro', 'alquiler', 'luz'] }],
    ['2', 'Tiene un salón con grandes ventanas y mucha luz.', 'Het heeft een woonkamer met grote ramen en veel licht.', 'ventanas', null,
      { options: ['ventanas', 'afueras', 'edificio', 'alquiler'] }],
    ['3', 'Tiene un salón con grandes ventanas y mucha luz.', 'Het heeft een woonkamer met grote ramen en veel licht.', 'luz', null,
      { options: ['luz', 'planta', 'metro', 'piso'] }],
    ['4', 'Da a la calle, pero no es ruidoso porque está en una calle pequeña donde casi no pasan coches.',
      'Het ligt aan de straatkant, maar het is niet lawaaierig, want het ligt in een klein straatje waar bijna geen auto’s passeren.', 'ruidoso', null,
      { options: ['ruidoso', 'tranquilo', 'exterior'] }],
    ['5', 'Está un poco lejos, en las afueras, ¿verdad?', 'Het ligt een beetje ver, aan de rand van de stad, toch?', 'afueras', null,
      { options: ['afueras', 'ventanas', 'plantas'] }],
    ['6', 'Sí, pero está cerca del metro.', 'Ja, maar het ligt dicht bij de metro.', 'metro', null,
      { options: ['metro', 'piso', 'alquiler'] }],
    ['7', '¿Y cuánto cuesta el alquiler? —750 € con todo incluido.', 'En hoeveel is de huur? —750 €, alles inbegrepen.', 'alquiler', null,
      { options: ['alquiler', 'edificio', 'metro'] }],
    ['8', 'Alberto vive en el mismo edificio, en la planta baja.', 'Alberto woont in hetzelfde gebouw, op de benedenverdieping.', 'edificio', null,
      { options: ['edificio', 'alquiler', 'metro'] }],
    ['9', 'Alberto vive en el mismo edificio, en la planta baja.', 'Alberto woont in hetzelfde gebouw, op de benedenverdieping.', 'planta', null,
      { options: ['planta', 'luz', 'ventana'] }],
  ]),

  // 2 · ¿Qué palabra no forma parte del grupo?
  ...oddOneOut({ prefix: 'u3.2', page: 97 }, [
    ['1', ['nevera', 'organizadora', 'lavadora', 'microondas'], 'organizadora', 'De andere zijn huishoudtoestellen.'],
    ['2', ['pasillo', 'salón', 'dormitorio', 'escritorio'], 'escritorio', 'Een bureau is een meubel, geen deel van de woning.'],
    ['3', ['regalo', 'estantería', 'silla', 'cama'], 'regalo', 'Een cadeau is geen meubel.'],
    ['4', ['tranquilo', 'renovado', 'moderno', 'rápido'], 'rápido', 'Met rápido beschrijf je geen woning.'],
    ['5', ['metro', 'piso', 'autobús', 'tren'], 'piso', 'Een appartement is geen vervoermiddel.'],
    ['6', ['televisor', 'radio', 'espejo', 'ordenador'], 'espejo', 'Een spiegel is geen elektrisch toestel.'],
    ['7', ['a la derecha', 'al lado', 'al horno', 'en el centro'], 'al horno', 'Al horno (uit de oven) is een bereidingswijze, geen plaats.'],
  ]),

  // 8 · ¿Presente o indefinido?
  grammar({
    id: 'u3.8-presente-indefinido', page: 99, theme: 'gr-zin-indefinido', ref: 'gr.indefinido',
    rule: 'Presente of indefinido? Let op de uitgang en het accent.',
  }, [
    ['hablo → ___', 'presente', '(hablar, yo)', ['presente', 'indefinido']],
    ['vive → ___', 'presente', '(vivir, él)', ['presente', 'indefinido']],
    ['llegaste → ___', 'indefinido', '(llegar, tú)', ['presente', 'indefinido']],
    ['usó → ___', 'indefinido', '(usar, él)', ['presente', 'indefinido']],
    ['encontré → ___', 'indefinido', '(encontrar, yo)', ['presente', 'indefinido']],
    ['como → ___', 'presente', '(comer, yo)', ['presente', 'indefinido']],
    ['fuimos → ___', 'indefinido', '(ir/ser, nosotros)', ['presente', 'indefinido']],
    ['bebemos → ___', 'presente', '(beber, nosotros)', ['presente', 'indefinido']],
    ['bebimos → ___', 'indefinido', '(beber, nosotros)', ['presente', 'indefinido']],
    ['trabajasteis → ___', 'indefinido', '(trabajar, vosotros)', ['presente', 'indefinido']],
    ['toman → ___', 'presente', '(tomar, ellos)', ['presente', 'indefinido']],
    ['explicaron → ___', 'indefinido', '(explicar, ellos)', ['presente', 'indefinido']],
    ['preguntáis → ___', 'presente', '(preguntar, vosotros)', ['presente', 'indefinido']],
    ['explican → ___', 'presente', '(explicar, ellos)', ['presente', 'indefinido']],
    ['comió → ___', 'indefinido', '(comer, él)', ['presente', 'indefinido']],
    ['llegas → ___', 'presente', '(llegar, tú)', ['presente', 'indefinido']],
    ['fui → ___', 'indefinido', '(ir/ser, yo)', ['presente', 'indefinido']],
    ['explicamos → ___', 'los dos', '(explicar, nosotros): bij -ar en -ir is de nosotros-vorm in beide tijden gelijk', ['presente', 'indefinido', 'los dos']],
    ['vivimos → ___', 'los dos', '(vivir, nosotros): bij -ar en -ir is de nosotros-vorm in beide tijden gelijk', ['presente', 'indefinido', 'los dos']],
  ]),

  // 9 · Mi visita a Chocomundo
  ...sentences({
    prefix: 'u3.9', page: 99, theme: 'gr-zin-indefinido', ref: 'gr.indefinido',
    instruction: 'Vul het werkwoord in de indefinido in.',
  }, [
    ['1', 'El último día de nuestro viaje por Andalucía visitamos el museo Chocomundo en Estepa.',
      'Op de laatste dag van onze reis door Andalusië bezochten we het museum Chocomundo in Estepa.', 'visitamos', 'visitar, nosotros'],
    ['2', 'Este museo nació hace más de 30 años de un proyecto de los dueños de una confitería.',
      'Dit museum ontstond meer dan 30 jaar geleden uit een project van de eigenaars van een banketbakkerij.', 'nació', 'nacer, él'],
    ['3', 'En la puerta nos saludó un guía y nos invitó a pasear por las salas del museo.',
      'Aan de deur begroette een gids ons en hij nodigde ons uit om door de zalen van het museum te wandelen.', 'saludó', 'saludar, él'],
    ['4', 'En la puerta nos saludó un guía y nos invitó a pasear por las salas del museo.',
      'Aan de deur begroette een gids ons en hij nodigde ons uit om door de zalen van het museum te wandelen.', 'invitó', 'invitar, él'],
    ['5', 'En la primera sala el guía nos presentó una película sobre la historia del cacao.',
      'In de eerste zaal toonde de gids ons een film over de geschiedenis van cacao.', 'presentó', 'presentar, él'],
    ['6', 'Después llegamos a una sala con una colección de maravillosas figuras arqueológicas.',
      'Daarna kwamen we in een zaal met een verzameling prachtige archeologische beeldjes.', 'llegamos', 'llegar, nosotros'],
    ['7', 'En otra sala nos impresionó una colección de envases.',
      'In een andere zaal maakte een verzameling verpakkingen indruk op ons.', 'impresionó', 'impresionar, ella'],
    ['8', 'Una preciosa caja de bombones se fabricó en el siglo XIX para la boda de la reina de Inglaterra.',
      'Een prachtige bonbondoos werd in de 19e eeuw gemaakt voor het huwelijk van de koningin van Engeland.', 'fabricó', 'fabricar'],
    ['9', 'Al final todos nos relajamos en la cafetería, donde probamos algunas especialidades.',
      'Op het einde ontspanden we allemaal in de cafetaria, waar we enkele specialiteiten proefden.', 'nos relajamos', 'relajarse, nosotros'],
    ['10', 'Al final todos nos relajamos en la cafetería, donde probamos algunas especialidades.',
      'Op het einde ontspanden we allemaal in de cafetaria, waar we enkele specialiteiten proefden.', 'probamos', 'probar, nosotros'],
    ['11', 'Además, yo fui a la tienda del museo y compré varias tabletas de chocolate.',
      'Bovendien ging ik naar de museumwinkel en kocht ik een paar repen chocolade.', 'fui', 'ir, yo', { ref: 'gr.indefinido-onregelmatig' }],
    ['12', 'Además, yo fui a la tienda del museo y compré varias tabletas de chocolate.',
      'Bovendien ging ik naar de museumwinkel en kocht ik een paar repen chocolade.', 'compré', 'comprar, yo'],
  ]),

  // 10 · Algunos datos históricos
  ...sentences({
    prefix: 'u3.10', page: 100, theme: 'gr-zin-indefinido', ref: 'gr.indefinido',
    instruction: 'Vul het werkwoord in de indefinido in.',
  }, [
    ['1', 'A principios del siglo XX los hermanos Wright realizaron el primer vuelo en avión.',
      'Begin 20e eeuw maakten de gebroeders Wright de eerste vlucht met een vliegtuig.', 'realizaron', 'realizar, ellos'],
    ['2', 'En mayo del 68 los estudiantes franceses salieron a las calles a protestar contra la política.',
      'In mei ’68 trokken de Franse studenten de straat op om te protesteren tegen de politiek.', 'salieron', 'salir, ellos'],
    ['3', 'En 1875 Alexander Graham Bell inventó el teléfono.',
      'In 1875 vond Alexander Graham Bell de telefoon uit.', 'inventó', 'inventar, él'],
    ['4', 'En 1885 Karl Benz inventó el primer coche.',
      'In 1885 vond Karl Benz de eerste auto uit.', 'inventó', 'inventar, él'],
    ['5', 'En el siglo XVII Cervantes escribió Don Quijote de la Mancha.',
      'In de 17e eeuw schreef Cervantes Don Quichot.', 'escribió', 'escribir, él'],
    ['6', 'En 2010 España ganó el Campeonato Mundial de Fútbol.',
      'In 2010 won Spanje het wereldkampioenschap voetbal.', 'ganó', 'ganar'],
    ['7', 'En 2013 el argentino Mario Bergoglio fue nombrado «Papa Francisco».',
      'In 2013 werd de Argentijn Mario Bergoglio tot paus Franciscus benoemd.', 'fue', 'ser, él', { ref: 'gr.indefinido-onregelmatig' }],
    ['8', 'En julio de 1969 Neil Armstrong llegó a la luna en el Apolo 11.',
      'In juli 1969 kwam Neil Armstrong met de Apollo 11 op de maan aan.', 'llegó', 'llegar, él'],
  ]),

  // 11a · Un día diferente — normaal (presente) tegenover zondag (indefinido)
  ...[
    ['1', 'Normalmente Pilar se levanta a las siete, pero el domingo se levantó a las diez.',
      'Normaal staat Pilar om zeven uur op, maar zondag stond ze om tien uur op.',
      ['se levanta', 'levantarse', 'gr.wederkerend'], ['se levantó', 'levantarse', 'gr.indefinido']],
    ['2', 'Normalmente Pilar va al trabajo sin desayunar, pero el domingo desayunó en la cama.',
      'Normaal gaat Pilar zonder ontbijt naar het werk, maar zondag ontbeet ze in bed.',
      ['va', 'ir', 'gr.presente'], ['desayunó', 'desayunar', 'gr.indefinido']],
    ['3', 'Normalmente Pilar come en la cafetería de la empresa, pero el domingo comió en casa.',
      'Normaal eet Pilar in de bedrijfskantine, maar zondag at ze thuis.',
      ['come', 'comer', 'gr.presente'], ['comió', 'comer', 'gr.indefinido']],
    ['4', 'Normalmente Pilar toma dos cafés en la oficina, pero el domingo tomó un café con una amiga.',
      'Normaal drinkt Pilar twee koffies op kantoor, maar zondag dronk ze een koffie met een vriendin.',
      ['toma', 'tomar', 'gr.presente'], ['tomó', 'tomar', 'gr.indefinido']],
    ['5', 'Normalmente Pilar llama por teléfono a sus clientes, pero el domingo llamó a su novio.',
      'Normaal belt Pilar haar klanten, maar zondag belde ze haar vriend.',
      ['llama', 'llamar', 'gr.presente'], ['llamó', 'llamar', 'gr.indefinido']],
    ['6', 'Normalmente Pilar no tiene tiempo de ver a los amigos, pero el domingo fue de excursión con ellos.',
      'Normaal heeft Pilar geen tijd om haar vrienden te zien, maar zondag ging ze met hen op uitstap.',
      ['tiene', 'tener', 'gr.presente'], ['fue', 'ir', 'gr.indefinido-onregelmatig']],
    ['7', 'Normalmente Pilar trabaja muchas horas, pero el domingo fue al cine.',
      'Normaal werkt Pilar veel uren, maar zondag ging ze naar de film.',
      ['trabaja', 'trabajar', 'gr.presente'], ['fue', 'ir', 'gr.indefinido-onregelmatig']],
    ['8', 'Normalmente Pilar se acuesta antes de las diez, pero el domingo se acostó muy tarde.',
      'Normaal gaat Pilar voor tien uur slapen, maar zondag ging ze heel laat slapen.',
      ['se acuesta', 'acostarse', 'gr.wederkerend'], ['se acostó', 'acostarse', 'gr.indefinido']],
  ].flatMap(([n, es, nl, [pAnswer, pVerb, pRef], [iAnswer, iVerb, iRef]]) => [
    {
      id: `s.wb-u3.11a-${n}p`, kind: 'sentence', theme: 'gr-zin-presente', src: src(100),
      instruction: 'Wat doet Pilar normaal? Vul de presente in.', es, nl,
      blanks: [{ answer: pAnswer, hint: `${pVerb}, normalmente` }], grammarRef: pRef,
    },
    {
      id: `s.wb-u3.11a-${n}i`, kind: 'sentence', theme: 'gr-zin-indefinido', src: src(100),
      instruction: 'Wat deed Pilar zondag? Vul de indefinido in.', es, nl,
      blanks: [{ answer: iAnswer, hint: `${iVerb}, el domingo` }], grammarRef: iRef,
    },
  ]),

  // 12b · Marcadores para el perfecto y el indefinido
  grammar({
    id: 'u3.12-marcadores', page: 100, theme: 'gr-perfecto-indefinido', ref: 'gr.perfecto-indefinido',
    rule: 'Welke tijd hoort bij deze tijdsaanduiding: perfecto of indefinido?',
  }, [
    ['en 2015 → ___', 'indefinido', 'in 2015', ['perfecto', 'indefinido']],
    ['hace dos años → ___', 'indefinido', 'twee jaar geleden', ['perfecto', 'indefinido']],
    ['hoy → ___', 'perfecto', 'vandaag', ['perfecto', 'indefinido']],
    ['ayer → ___', 'indefinido', 'gisteren', ['perfecto', 'indefinido']],
    ['esta semana → ___', 'perfecto', 'deze week', ['perfecto', 'indefinido']],
    ['el mes pasado → ___', 'indefinido', 'vorige maand', ['perfecto', 'indefinido']],
    ['el 3 de marzo → ___', 'indefinido', 'op 3 maart', ['perfecto', 'indefinido']],
    ['hace dos días → ___', 'indefinido', 'twee dagen geleden', ['perfecto', 'indefinido']],
    ['el verano pasado → ___', 'indefinido', 'vorige zomer', ['perfecto', 'indefinido']],
    ['esta mañana → ___', 'perfecto', 'vanochtend', ['perfecto', 'indefinido']],
    ['en octubre → ___', 'indefinido', 'in oktober', ['perfecto', 'indefinido']],
    ['el viernes (pasado) → ___', 'indefinido', 'vorige vrijdag', ['perfecto', 'indefinido']],
  ]),

  // 13 · ¿Perfecto o indefinido?
  ...sentences({
    prefix: 'u3.13', page: 101, theme: 'gr-perfecto-indefinido', ref: 'gr.perfecto-indefinido',
    instruction: 'Perfecto of indefinido? Let op de tijdsaanduiding.',
  }, [
    ['1', 'Hace tres años Juan y María se conocieron en Cuba.',
      'Drie jaar geleden leerden Juan en María elkaar kennen in Cuba.', 'se conocieron', 'conocerse, ellos'],
    ['2', 'Este año Juan ha empezado a pensar en casarse con ella.',
      'Dit jaar is Juan beginnen na te denken over trouwen met haar.', 'ha empezado', 'empezar, él'],
    ['3', 'Hoy María ha vuelto temprano del trabajo y Juan le ha preparado una sorpresa.',
      'Vandaag is María vroeg thuisgekomen van het werk en Juan heeft een verrassing voor haar klaargemaakt.', 'ha vuelto', 'volver, ella'],
    ['4', 'Hoy María ha vuelto temprano del trabajo y Juan le ha preparado una sorpresa.',
      'Vandaag is María vroeg thuisgekomen van het werk en Juan heeft een verrassing voor haar klaargemaakt.', 'ha preparado', 'preparar, él'],
    ['5', 'Hoy Juan la ha invitado a cenar, porque hace bastante tiempo que salieron juntos por última vez.',
      'Vandaag heeft Juan haar uitgenodigd om te gaan eten, want het is al een hele tijd geleden dat ze samen uitgingen.', 'ha invitado', 'invitar, él'],
    ['6', 'Hoy Juan la ha invitado a cenar, porque hace bastante tiempo que salieron juntos por última vez.',
      'Vandaag heeft Juan haar uitgenodigd om te gaan eten, want het is al een hele tijd geleden dat ze samen uitgingen.', 'salieron', 'salir, ellos'],
    ['7', 'Hoy Juan ha reservado una mesa en el restaurante «El Asador de Patxi».',
      'Vandaag heeft Juan een tafel gereserveerd in restaurant El Asador de Patxi.', 'ha reservado', 'reservar, él'],
    ['8', 'Es un restaurante exclusivo que abrió hace un mes.',
      'Het is een exclusief restaurant dat een maand geleden de deuren opende.', 'abrió', 'abrir, él'],
    ['9', 'Juan cenó allí con su jefe la semana pasada y la comida le pareció exquisita.',
      'Juan at er vorige week met zijn baas en hij vond het eten voortreffelijk.', 'cenó', 'cenar, él'],
    ['10', 'Juan cenó allí con su jefe la semana pasada y la comida le pareció exquisita.',
      'Juan at er vorige week met zijn baas en hij vond het eten voortreffelijk.', 'pareció', 'parecer, ella'],
  ]),

  // 14 · ¿Cuándo? — de tijd verraadt het moment
  ...choices({
    prefix: 'u3.14', page: 101, theme: 'gr-perfecto-indefinido', ref: 'gr.perfecto-indefinido',
  }, [
    ['1', 'Viajé por la Panamericana. ¿Cuándo?', ['El año pasado.', 'Este año.'], 'El año pasado.',
      'Viajé is indefinido: een afgesloten periode, dus vorig jaar.'],
    ['2', '¿Has comprado leche? ¿Cuándo?', ['Hoy.', 'Ayer.'], 'Hoy.',
      'Has comprado is perfecto: een periode die nog niet voorbij is, dus vandaag.'],
    ['3', 'Visitaron el Museo del Prado. ¿Cuándo?', ['En 2016.', 'Esta mañana.'], 'En 2016.',
      'Visitaron is indefinido: een afgesloten moment, in 2016.'],
    ['4', 'Mi padre vivió en Argentina muchos años. ¿Qué significa?', ['Ahora vive en otro país.', 'Todavía vive en Argentina.'], 'Ahora vive en otro país.',
      'Vivió (indefinido) beschrijft iets afgesloten: nu woont hij ergens anders.'],
    ['5', 'He comprado un regalo. ¿Para qué?', ['Para la fiesta de cumpleaños de hoy.', 'Para el cumpleaños de ayer.'], 'Para la fiesta de cumpleaños de hoy.',
      'He comprado (perfecto) hoort bij vandaag.'],
    ['6', 'Nos ha gustado mucho. ¿Qué?', ['Esta clase de español.', 'La película de ayer.'], 'Esta clase de español.',
      'Ha gustado (perfecto) hoort bij iets van nu: deze les. Voor de film van gisteren: nos gustó.'],
  ]),

  // 16 · ¿Qué es? — voornaamwoorden in definities
  ...sentences({
    prefix: 'u3.16', page: 102, theme: 'voornaamwoorden',
    instruction: 'Vul het voornaamwoord in.',
  }, [
    ['1', 'Encima de él vemos la televisión o hablamos con amigos: el sofá.',
      'Daarop kijken we tv of praten we met vrienden: de zetel.', 'él', 'el sofá, na een voorzetsel'],
    ['2', 'En ella dormimos: la cama.',
      'Daarin slapen we: het bed.', 'ella', 'la cama, na een voorzetsel'],
    ['3', 'La usamos cuando no hay mucha luz: la lámpara.',
      'We gebruiken hem als er niet veel licht is: de lamp.', 'La', 'la lámpara, lijdend voorwerp',
      { theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp' }],
    ['4', 'Sirve para los libros y otros objetos. La ponemos en la pared: la estantería.',
      'Hij dient voor boeken en andere voorwerpen. We hangen hem aan de muur: de boekenkast.', 'La', 'la estantería, lijdend voorwerp',
      { theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp' }],
    ['5', 'En él ponemos los platos y vasos sucios para no lavarlos a mano: el lavaplatos.',
      'Daarin zetten we de vuile borden en glazen om ze niet met de hand te moeten afwassen: de vaatwasser.', 'él', 'el lavaplatos, na een voorzetsel'],
    ['6', 'En él ponemos los platos y vasos sucios para no lavarlos a mano: el lavaplatos.',
      'Daarin zetten we de vuile borden en glazen om ze niet met de hand te moeten afwassen: de vaatwasser.', 'lavarlos', 'lavar + los platos',
      { theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp' }],
    ['7', 'Sin ella es difícil comer. La necesitamos para poner los platos, vasos, etc.: la mesa.',
      'Zonder is eten moeilijk. We hebben hem nodig om de borden, glazen enz. op te zetten: de tafel.', 'ella', 'la mesa, na een voorzetsel'],
    ['8', 'Sin ella es difícil comer. La necesitamos para poner los platos, vasos, etc.: la mesa.',
      'Zonder is eten moeilijk. We hebben hem nodig om de borden, glazen enz. op te zetten: de tafel.', 'La', 'la mesa, lijdend voorwerp',
      { theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp' }],
    ['9', 'Está en el baño y lo necesitamos cuando queremos vernos: el espejo.',
      'Hij hangt in de badkamer en we hebben hem nodig als we onszelf willen zien: de spiegel.', 'lo', 'el espejo, lijdend voorwerp',
      { theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp' }],
    ['10', 'En él ponemos la ropa. Lo tenemos en el dormitorio o en el pasillo: el armario.',
      'Daarin leggen we de kleren. We hebben hem in de slaapkamer of in de gang: de kleerkast.', 'él', 'el armario, na een voorzetsel'],
    ['11', 'En él ponemos la ropa. Lo tenemos en el dormitorio o en el pasillo: el armario.',
      'Daarin leggen we de kleren. We hebben hem in de slaapkamer of in de gang: de kleerkast.', 'Lo', 'el armario, lijdend voorwerp',
      { theme: 'gr-voorwerp', ref: 'gr.lijdend-voorwerp' }],
  ]),

  // 17 · ¿Qué palabra no forma parte del grupo?
  ...oddOneOut({ prefix: 'u3.17', page: 102 }, [
    ['1', ['lavaplatos', 'lavadora', 'espejo', 'nevera'], 'espejo', 'Een spiegel werkt niet met elektriciteit.'],
    ['2', ['ventana', 'silla', 'mesa', 'sofá'], 'ventana', 'Een raam is geen meubel.'],
    ['3', ['lámpara', 'microondas', 'televisor', 'bañera'], 'bañera', 'Een badkuip werkt niet met elektriciteit.'],
    ['4', ['dormitorio', 'salón', 'mueble', 'comedor'], 'mueble', 'Een meubel is geen kamer.'],
    ['5', ['tranquilo', 'exterior', 'delgado', 'amueblado'], 'delgado', 'Delgado (slank) beschrijft personen, geen woning.'],
    ['6', ['delante', 'después', 'encima', 'al lado'], 'después', 'Después (daarna) zegt niets over een plaats.'],
    ['7', ['algunos', 'muchos', 'todos', 'pisos'], 'pisos', 'Pisos is geen onbepaald voornaamwoord.'],
    ['8', ['hace un mes', 'el año pasado', 'mañana', 'ayer'], 'mañana', 'Mañana (morgen) verwijst niet naar het verleden.'],
  ]),

  // 19 · Familias de palabras
  grammar({
    id: 'u3.19-woordfamilies', page: 102, theme: 'gr-woordkeuze',
    rule: 'Vul het verwante woord in (zelfstandig naamwoord, bijvoeglijk naamwoord of werkwoord).',
  }, [
    ['tranquilo → la ___', 'tranquilidad', 'rustig → de rust'],
    ['la oscuridad → ___', 'oscuro', 'de duisternis → donker'],
    ['actual → la ___', 'actualidad', 'actueel → de actualiteit'],
    ['el optimismo → ___', 'optimista', 'het optimisme → optimistisch'],
    ['deportista → el ___', 'deporte', 'sportief → de sport'],
    ['la inteligencia → ___', 'inteligente', 'de intelligentie → intelligent'],
    ['mudarse → la ___', 'mudanza', 'verhuizen → de verhuizing'],
    ['producir → la ___', 'producción', 'produceren → de productie'],
    ['el consumo → ___', 'consumir', 'de consumptie → consumeren'],
    ['encontrar → el ___', 'encuentro', 'ontmoeten → de ontmoeting'],
  ]),

  // 20a · Tiempos verbales
  grammar({
    id: 'u3.20-vormen', page: 103, theme: 'verleden-tijden',
    rule: 'Vul de gevraagde werkwoordsvorm in.',
  }, [
    ['ir (yo) · perfecto: ___', 'he ido', 'ik ben gegaan'],
    ['ir (yo) · indefinido: ___', 'fui', 'ik ging'],
    ['trabajar (tú) · presente: ___', 'trabajas', 'jij werkt'],
    ['trabajar (tú) · perfecto: ___', 'has trabajado', 'jij hebt gewerkt'],
    ['ser (él) · presente: ___', 'es', 'hij is'],
    ['ser (él) · indefinido: ___', 'fue', 'hij was'],
    ['vivir (nosotros) · presente: ___', 'vivimos', 'wij wonen'],
    ['vivir (nosotros) · indefinido: ___', 'vivimos', 'wij woonden'],
    ['buscar (vosotros) · presente: ___', 'buscáis', 'jullie zoeken'],
    ['buscar (vosotros) · perfecto: ___', 'habéis buscado', 'jullie hebben gezocht'],
    ['pensar (ellos) · perfecto: ___', 'han pensado', 'zij hebben gedacht'],
    ['pensar (ellos) · indefinido: ___', 'pensaron', 'zij dachten'],
  ]),

  // 20b · ¿Con o sin acento?
  ...sentences({
    prefix: 'u3.20b', page: 103, theme: 'gr-zin-indefinido', ref: 'gr.indefinido',
    instruction: 'Met of zonder accent? Presente (yo) of indefinido (él)?',
  }, [
    ['1', 'Llego del trabajo y estoy muy cansado.', 'Ik kom thuis van het werk en ben heel moe.', 'Llego', 'llegar', { options: ['Llego', 'Llegó'] }],
    ['2', '¿Cuándo llegó el correo de Amalia?', 'Wanneer kwam de mail van Amalia aan?', 'llegó', 'llegar', { options: ['llegó', 'llego'] }],
    ['3', 'Mi hija trabajó dos años en Perú.', 'Mijn dochter werkte twee jaar in Peru.', 'trabajó', 'trabajar', { options: ['trabajó', 'trabajo'] }],
    ['4', 'Ahora trabajo en una agencia inmobiliaria.', 'Nu werk ik bij een vastgoedkantoor.', 'trabajo', 'trabajar', { options: ['trabajo', 'trabajó'] }],
  ]),

  // 21 · Preguntas y respuestas (un piso de alquiler)
  ...choices({
    prefix: 'u3.21', page: 103, theme: 'gr-woordkeuze', context: 'Alguien pregunta por un piso de alquiler.',
  }, [
    ['1', '¿En qué piso está?', ['En el segundo.', 'Unos sesenta.', 'A partir del próximo mes.'], 'En el segundo.',
      'Op welke verdieping ligt het? – Op de tweede.'],
    ['2', '¿Cuántos metros cuadrados tiene?', ['Unos sesenta.', 'En el segundo.', 'Sí, pero no la electricidad.'], 'Unos sesenta.',
      'Hoeveel vierkante meter is het? – Een zestigtal.'],
    ['3', '¿Cuánto cuesta el alquiler?', ['600 € al mes.', 'En el segundo.', 'A partir del próximo mes.'], '600 € al mes.',
      'Hoeveel is de huur? – 600 € per maand.'],
    ['4', '¿Está incluida la calefacción?', ['Sí, pero no la electricidad.', '600 € al mes.', 'En el segundo.'], 'Sí, pero no la electricidad.',
      'Is de verwarming inbegrepen? – Ja, maar de elektriciteit niet.'],
    ['5', '¿Cuándo está libre?', ['A partir del próximo mes.', 'Unos sesenta.', 'Sí, pero no la electricidad.'], 'A partir del próximo mes.',
      'Wanneer is het vrij? – Vanaf volgende maand.'],
  ]),

  // 22 · Un domingo perfecto
  ...sentences({
    prefix: 'u3.22', page: 103, theme: 'gr-zin-indefinido', ref: 'gr.indefinido',
    instruction: 'Vul het werkwoord in de indefinido in.',
  }, [
    ['1', 'Fue un fin de semana fantástico.', 'Het was een fantastisch weekend.', 'Fue', 'ser, él', { ref: 'gr.indefinido-onregelmatig' }],
    ['2', 'Ayer fue mi domingo perfecto.', 'Gisteren was mijn perfecte zondag.', 'fue', 'ser, él', { ref: 'gr.indefinido-onregelmatig' }],
    ['3', '¿Fuiste a la playa?', 'Ben je naar het strand gegaan?', 'Fuiste', 'ir, tú', { ref: 'gr.indefinido-onregelmatig' }],
    ['4', 'No, me quedé en la cama con mi mujer y mis hijos.', 'Nee, ik bleef in bed met mijn vrouw en mijn kinderen.', 'me quedé', 'quedarse, yo'],
    ['5', 'Dormimos todos hasta las 10.', 'We sliepen allemaal tot 10 uur.', 'Dormimos', 'dormir, nosotros'],
    ['6', 'Luego nos levantamos, mi mujer fue a comprar pan y cruasanes, yo salí a comprar el periódico.',
      'Daarna stonden we op, mijn vrouw ging brood en croissants kopen, ik ging de krant halen.', 'nos levantamos', 'levantarse, nosotros'],
    ['7', 'Luego nos levantamos, mi mujer fue a comprar pan y cruasanes, yo salí a comprar el periódico.',
      'Daarna stonden we op, mijn vrouw ging brood en croissants kopen, ik ging de krant halen.', 'fue', 'ir, ella', { ref: 'gr.indefinido-onregelmatig' }],
    ['8', 'Luego nos levantamos, mi mujer fue a comprar pan y cruasanes, yo salí a comprar el periódico.',
      'Daarna stonden we op, mijn vrouw ging brood en croissants kopen, ik ging de krant halen.', 'salí', 'salir, yo'],
    ['9', 'Desayunamos todos juntos sin prisa.', 'We ontbeten allemaal samen, zonder haast.', 'Desayunamos', 'desayunar, nosotros'],
    ['10', 'Yo leí el periódico en la terraza, tomando el sol.', 'Ik las de krant op het terras, in het zonnetje.', 'leí', 'leer, yo'],
    ['11', 'Luego invité a unos amigos a comer.', 'Daarna nodigde ik enkele vrienden uit om te komen eten.', 'invité', 'invitar, yo', { alt: ['invitamos'] }],
    ['12', 'Mi mujer preparó una paella deliciosa.', 'Mijn vrouw maakte een heerlijke paella.', 'preparó', 'preparar, ella'],
    ['13', 'Pasamos casi dos horas de sobremesa, simplemente hablando y tomando café.',
      'We bleven bijna twee uur natafelen, gewoon praten en koffiedrinken.', 'Pasamos', 'pasar, nosotros'],
    ['14', 'Después nuestros amigos volvieron a casa, y yo decidí dormir una pequeña siesta.',
      'Daarna gingen onze vrienden naar huis en besloot ik een kort dutje te doen.', 'volvieron', 'volver, ellos'],
    ['15', 'Después nuestros amigos volvieron a casa, y yo decidí dormir una pequeña siesta.',
      'Daarna gingen onze vrienden naar huis en besloot ik een kort dutje te doen.', 'decidí', 'decidir, yo'],
    ['16', 'Después salimos todos juntos a dar un paseo por la playa.',
      'Daarna gingen we allemaal samen wandelen op het strand.', 'salimos', 'salir, nosotros'],
  ]),

  // 23 · La palabra correcta
  ...choices({ prefix: 'u3.23', page: 104, theme: 'gr-woordkeuze' }, [
    ['1', 'La cocina del apartamento ___ amueblada.', ['está', 'es'], 'está',
      'De keuken van het appartement is gemeubeld. Toestand: estar.', { theme: 'ser-estar', ref: 'gr.ser-estar' }],
    ['2', 'El lunes ___ voy a hablar con Marta.', ['que viene', 'pasado'], 'que viene',
      'Volgende maandag ga ik met Marta praten. Toekomst: el lunes que viene.'],
    ['3', 'Ayer yo ___ muy tarde a la reunión.', ['llegué', 'llegé', 'llegó'], 'llegué',
      'Gisteren kwam ik heel laat op de vergadering. Llegar → llegué: -gu- om de g-klank te behouden.',
      { theme: 'gr-zin-indefinido', ref: 'gr.indefinido' }],
    ['4', 'Ayer el tren ___ a las 10 en punto.', ['llegó', 'llego', 'llegué'], 'llegó',
      'Gisteren kwam de trein om klokslag 10 uur aan. Hij-vorm van de indefinido: llegó, met accent.',
      { theme: 'gr-zin-indefinido', ref: 'gr.indefinido' }],
    ['5', 'El domingo fui ___ casa de Lucía.', ['a', 'en'], 'a',
      'Zondag ging ik naar Lucía’s huis. Ir a: richting.'],
    ['6', '¿Cuándo ___ la última vez que fuiste al cine?', ['fue', 'fui', 'fuiste'], 'fue',
      'Wanneer was de laatste keer dat je naar de film ging? Ser, derde persoon: fue.',
      { theme: 'gr-zin-indefinido', ref: 'gr.indefinido-onregelmatig' }],
    ['7', 'Ayer yo ___ al cine con Roberto.', ['fui', 'fue'], 'fui',
      'Gisteren ging ik met Roberto naar de film. Ir, yo: fui.',
      { theme: 'gr-zin-indefinido', ref: 'gr.indefinido-onregelmatig' }],
    ['8', 'Este sofá ___ muy cómodo.', ['es', 'está'], 'es',
      'Deze zetel is heel comfortabel. Een eigenschap: ser.', { theme: 'ser-estar', ref: 'gr.ser-estar' }],
  ]),

  // 24 · Contrarios
  grammar({
    id: 'u3.24-tegenstellingen', page: 104, theme: 'gr-woordkeuze',
    rule: 'Geef het tegenovergestelde.',
  }, [
    ['antiguo ↔ ___', 'moderno', 'oud ↔ modern'],
    ['tranquilo ↔ ___', 'ruidoso', 'rustig ↔ lawaaierig'],
    ['feo ↔ ___', 'bonito', 'lelijk ↔ mooi'],
    ['malo ↔ ___', 'bueno', 'slecht ↔ goed'],
    ['grande ↔ ___', 'pequeño', 'groot ↔ klein'],
    ['joven / nuevo ↔ ___', 'viejo', 'jong / nieuw ↔ oud'],
    ['gordo ↔ ___', 'delgado', 'dik ↔ slank'],
    ['barato ↔ ___', 'caro', 'goedkoop ↔ duur'],
    ['bajo ↔ ___', 'alto', 'klein, laag ↔ groot, hoog'],
    ['optimista ↔ ___', 'pesimista', 'optimistisch ↔ pessimistisch'],
    ['frío ↔ ___', 'caliente', 'koud ↔ warm, heet'],
  ]),

  // 25 · Descripciones: ¿el piso o el vecino?
  ...choices({ prefix: 'u3.25', page: 104, theme: 'gr-woordkeuze' }, [
    ['1', '¿De qué se habla? «Está un poco lejos, pero es muy grande.»', ['del piso', 'del vecino'], 'del piso',
      'Het ligt een beetje ver, maar het is heel groot: het appartement.'],
    ['2', '¿De qué se habla? «Es muy guapo, alto y rubio.»', ['del piso', 'del vecino'], 'del vecino',
      'Hij is heel knap, groot en blond: de buurman.'],
    ['3', '¿De qué se habla? «Está siempre muy alegre y de buen humor.»', ['del piso', 'del vecino'], 'del vecino',
      'Hij is altijd vrolijk en goedgehumeurd: de buurman.'],
    ['4', '¿De qué se habla? «Tiene mucha luz.»', ['del piso', 'del vecino'], 'del piso',
      'Er is veel licht: het appartement.'],
    ['5', '¿De qué se habla? «Es bastante elegante y muy amable.»', ['del piso', 'del vecino'], 'del vecino',
      'Hij is vrij chic en heel vriendelijk: de buurman.'],
    ['6', '¿De qué se habla? «Me gusta porque es tranquilo y barato.»', ['del piso', 'del vecino'], 'del piso',
      'Het bevalt me omdat het rustig en goedkoop is: het appartement.'],
  ]),

  // 26 · Panamericana: Argentina
  ...choices({ prefix: 'u3.26', page: 104, theme: 'lezen-u3' }, [
    ['1', '¿Cuántos habitantes tiene Buenos Aires?', ['unos 14 millones', 'unos 4 millones', 'unos 40 millones'], 'unos 14 millones',
      'Buenos Aires (met de agglomeratie) heeft zo’n 14 miljoen inwoners.'],
    ['2', '¿Qué es el Perito Moreno?',
      ['un glaciar en la Patagonia argentina', 'un baile típico de Buenos Aires', 'una bebida caliente'], 'un glaciar en la Patagonia argentina',
      'De Perito Moreno is een gletsjer in Argentijns Patagonië.'],
    ['3', '¿Dónde nació el tango?', ['En el Río de la Plata', 'En la Patagonia', 'En Finlandia'], 'En el Río de la Plata',
      'De tango ontstond aan de Río de la Plata.'],
    ['4', '¿Quién es un representante famoso del tango?', ['Carlos Gardel', 'Mario Vargas Llosa', 'Guillermo Xiu'], 'Carlos Gardel',
      'Carlos Gardel (en ook Ástor Piazzolla) is een beroemde naam uit de tango.'],
    ['5', '¿En qué país europeo hay muchos aficionados al tango?', ['En Finlandia', 'En Suecia', 'En Portugal'], 'En Finlandia',
      'Finland heeft verrassend veel tangoliefhebbers.'],
    ['6', '¿Qué es el mate?', ['Una bebida caliente de té de mate.', 'Un plato frío con carne.', 'Un baile argentino.'], 'Una bebida caliente de té de mate.',
      'Mate is een warme drank van mate-thee.'],
    ['7', '¿Qué ritual hay para tomar el mate?',
      ['Se bebe del mismo vaso y se pasa de mano en mano.', 'Se bebe solo, nunca con amigos.', 'Se bebe frío después de cenar.'],
      'Se bebe del mismo vaso y se pasa de mano en mano.',
      'Iedereen drinkt uit dezelfde beker, die van hand tot hand gaat.'],
  ]),

  // 27 · Un currículum vitae (Cecilia Romero Alonso)
  ...sentences({
    prefix: 'u3.27', page: 105, theme: 'gr-zin-indefinido', ref: 'gr.indefinido',
    instruction: 'Vul het werkwoord in de indefinido in (usted).',
  }, [
    ['1', '—Señora Romero Alonso, ¿cuándo nació usted? —El dos de marzo de 1985.',
      '—Mevrouw Romero Alonso, wanneer bent u geboren? —Op 2 maart 1985.', 'nació', 'nacer, usted'],
    ['2', '—¿Cuándo empezó la escuela primaria? —En 1991.',
      '—Wanneer bent u aan de lagere school begonnen? —In 1991.', 'empezó', 'empezar, usted'],
    ['3', '—¿En qué año terminó el Instituto de Secundaria? —En 2003.',
      '—In welk jaar hebt u de middelbare school afgewerkt? —In 2003.', 'terminó', 'terminar, usted'],
    ['4', '—¿Cuánto tiempo duró el curso de Secretariado? —Dos años.',
      '—Hoelang duurde de opleiding tot secretaresse? —Twee jaar.', 'duró', 'durar'],
    ['5', '—¿Dónde trabajó como recepcionista? —En el hotel Ibis en Salamanca.',
      '—Waar hebt u als receptioniste gewerkt? —In het hotel Ibis in Salamanca.', 'trabajó', 'trabajar, usted'],
    ['6', '—¿Adónde fue después? —Al hotel Astoria.',
      '—Waar bent u daarna naartoe gegaan? —Naar het hotel Astoria.', 'fue', 'ir, usted', { ref: 'gr.indefinido-onregelmatig' }],
    ['7', '—¿Cuándo empezó a trabajar en el hotel Puente Romano? —En 2013.',
      '—Wanneer bent u in het hotel Puente Romano beginnen te werken? —In 2013.', 'empezó', 'empezar, usted'],
  ]),

  // 28 · Acentuaciones 'con trampa'
  ...[
    ['profesor', ['pro', 'fe', 'sor'], 2, 'de leraar', 'Eindigt op een medeklinker (geen n of s): klemtoon op de laatste lettergreep.'],
    ['terapia', ['te', 'ra', 'pia'], 1, 'de therapie', 'Eindigt op een klinker: klemtoon op de voorlaatste lettergreep; -pia is één lettergreep.'],
    ['atmósfera', ['at', 'mós', 'fe', 'ra'], 1, 'de atmosfeer', 'Het accent toont de klemtoon: at-MÓS-fe-ra.'],
    ['sofá', ['so', 'fá'], 1, 'de zetel', 'Eindigt op een klinker maar de klemtoon ligt achteraan: daarom het accent.'],
    ['Ibiza', ['I', 'bi', 'za'], 1, 'Ibiza', 'Eindigt op een klinker: klemtoon op de voorlaatste lettergreep.'],
    ['Caracas', ['Ca', 'ra', 'cas'], 1, 'Caracas', 'Eindigt op -s: klemtoon op de voorlaatste lettergreep.'],
    ['teléfono', ['te', 'lé', 'fo', 'no'], 1, 'de telefoon', 'Het accent toont de klemtoon: te-LÉ-fo-no.'],
    ['farmacia', ['far', 'ma', 'cia'], 1, 'de apotheek', 'Eindigt op een klinker: klemtoon op de voorlaatste lettergreep; -cia is één lettergreep.'],
    ['fotocopia', ['fo', 'to', 'co', 'pia'], 2, 'de fotokopie', 'Eindigt op een klinker: klemtoon op de voorlaatste lettergreep; -pia is één lettergreep.'],
    ['Matemáticas', ['Ma', 'te', 'má', 'ti', 'cas'], 2, 'wiskunde', 'Het accent toont de klemtoon: ma-te-MÁ-ti-cas.'],
    ['Física', ['Fí', 'si', 'ca'], 0, 'fysica', 'Het accent toont de klemtoon: FÍ-si-ca.'],
    ['Uruguay', ['U', 'ru', 'guay'], 2, 'Uruguay', 'Een slot-y telt als medeklinker: klemtoon op de laatste lettergreep.'],
  ].map(([es, syllables, stressed, nl, note]) => ({
    id: `st.wb-u3.${es.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`,
    kind: 'stress', theme: 'klemtoon', src: src(106), es, syllables, stressed, nl, note,
  })),
];

export default {
  atoms: [...unidad1, ...unidad2, ...unidad3],
  texts: {
    [ETIQUETA]: {
      title: 'Reglas de etiqueta en una comida de trabajo',
      es: 'En una comida de trabajo los móviles se desconectan durante la comida y no se ponen en la mesa. '
        + 'Tampoco otros objetos como por ejemplo llaves o agendas. '
        + 'Los invitados no piden platos muy caros. Una comida de negocios no es un banquete. '
        + 'El tema de conversación no tiene que ser solamente el trabajo. Durante la comida conviene hablar de otros temas '
        + 'más generales y quizás llegar al trabajo en los postres. '
        + 'Si la reunión sigue por la tarde, no se recomienda pasar mucho tiempo tomando café. '
        + 'Si la comida es una despedida, la sobremesa puede ser un poco más larga. '
        + 'En general, los almuerzos de negocios tienen un carácter más laboral que las cenas. '
        + 'La cuenta la paga la persona que invita.',
      nl: 'Omgangsregels bij een zakenlunch: gsm’s uit en niet op tafel, geen dure gerechten, niet alleen over het werk praten, '
        + 'niet te lang koffiedrinken als de vergadering verdergaat, en wie uitnodigt, betaalt.',
      src: src(95),
    },
  },
};
