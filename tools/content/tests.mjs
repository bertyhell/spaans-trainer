/* Toetsen en herhaling: de zelfevaluatie van unidad 1 en de instaptoets
 * (course-pdf/, met hun sleutel), en de twee Mirador-hoofdstukken (unidad 4
 * en 8): de gesloten oefeningen uit het tekstboek en de TELC- en DELE-toetsen
 * uit het werkboek, met de oplossingen achteraan het boek. Luister- en
 * video-oefeningen en vrije schrijf- en spreekopdrachten staan er niet in.
 * Waar het boek geen sleutel heeft (tekstboek-Mirador), zijn de antwoorden
 * zelf uitgewerkt. */

const pad = n => String(n).padStart(2, '0');

/* Toets unidad 1: 18 meerkeuzevragen. */
const toets = (n, prompt, options, answer, extra = {}) => ({
  id: `q.toets-u1.${pad(n)}`, kind: 'choice', theme: 'toets-u1', srcLabel: `Toets unidad 1 · vraag ${n}`,
  prompt, options, answer, ...extra,
});

/* Instaptoets: één atoom per open plek; `gap` is 1 of 2 bij vragen met twee plekken. */
const instap = (n, gap, prompt, options, answer, extra = {}) => ({
  id: `q.instaptoets.${pad(n)}${gap ? `-${gap}` : ''}`, kind: 'choice', theme: 'instaptoets',
  srcLabel: `Instaptoets · vraag ${n}${gap ? `.${gap}` : ''}`,
  prompt, options, answer, ...extra,
});

const choice = (id, theme, src, prompt, options, answer, extra = {}) => ({
  id, kind: 'choice', theme, src, prompt, options, answer, ...extra,
});

const reading = (text, n, theme, src, q, options, answer, extra = {}) => ({
  id: `r.${text.slice(2)}.${n}`, kind: 'reading', theme, src, text, q, options, answer, ...extra,
});

const SRC = {
  // tekstboek
  u4Sobremesa: 'spanish-md/IMG_20260918_201755480.md',
  u4Hotel: 'spanish-md/IMG_20260918_201808336_AE.md',
  u4Aprender: 'spanish-md/IMG_20260918_201832168_AE.md',
  u8Lenguas: 'spanish-md/IMG_20260918_202225671.md',
  u8Aprender: 'spanish-md/IMG_20260918_202252001_AE.md',
  // werkboek: TELC
  u4Telc1: 'spanish-md/IMG_20260918_202543181_AE.md',
  u4Telc4a: 'spanish-md/IMG_20260918_202548731_AE.md',
  u4Telc4b: 'spanish-md/IMG_20260918_202556117_AE.md',
  u8Telc1: 'spanish-md/IMG_20260918_202924791.md',
  u8Telc3: 'spanish-md/IMG_20260918_202935471_AE.md',
  // werkboek: DELE
  u4Dele1: 'spanish-md/IMG_20260918_202605439_AE.md',
  u4Dele2: 'spanish-md/IMG_20260918_202610918_AE.md',
  u4Dele34: 'spanish-md/IMG_20260918_202615138_AE.md',
  u8Dele1: 'spanish-md/IMG_20260918_202941903.md',
  u8Dele2: 'spanish-md/IMG_20260918_202951049_AE.md',
  u8Dele34: 'spanish-md/IMG_20260918_202955652.md',
};

const CF = ['Correcto', 'Falso'];

export default {
  atoms: [
    /* ---------- Toets unidad 1 (sleutel: 1b 2c 3a 4b 5a 6b 7a 8c 9b 10a 11a 12c 13c 14c 15a 16c 17a 18a) ---------- */
    toets(1, 'En general, las pensiones son ___ que los hoteles.', ['más caras', 'menos caras', 'tan caros'], 'menos caras', {
      instruction: 'Kies het juiste antwoord: pensions zijn meestal goedkoper dan hotels',
      nl: 'Over het algemeen zijn pensions minder duur dan hotels. (tan … como, niet tan … que)',
      grammarRef: 'gr.vergelijken',
    }),
    toets(2, '¿Has entendido ___ la explicación del profesor?', ['a', 'por', '—'], '—', {
      nl: 'Heb je de uitleg van de leraar begrepen? Geen a: la explicación is geen persoon.',
      grammarRef: 'gr.persoonlijke-a',
    }),
    toets(3, 'Hemos invitado ___ amigo de Ana.', ['al', 'a el', 'el'], 'al', {
      nl: 'We hebben de vriend van Ana uitgenodigd. Persoon als lijdend voorwerp → a; a + el = al.',
      grammarRef: 'gr.persoonlijke-a',
    }),
    toets(4, 'Carlos ___ ducha después del deporte.', ['le', 'se', 'lo'], 'se', {
      nl: 'Carlos neemt een douche na het sporten (ducharse → se ducha).',
      grammarRef: 'gr.wederkerend',
    }),
    toets(5, '¿Qué tiempo ___?', ['hace', 'hay', 'es'], 'hace', {
      nl: 'Wat voor weer is het? Het weer: hacer (hace sol, hace frío).',
    }),
    toets(6, '¡___ llueve!', ['Qué', 'Cómo', 'Cuándo'], 'Cómo', {
      nl: 'Wat regent het! Bij een werkwoord: ¡Cómo …! (¡Qué …! staat bij een naamwoord: ¡Qué lluvia!).',
    }),
    toets(7, 'José ___ por teléfono.', ['está hablando', 'es hablando', 'está habliendo'], 'está hablando', {
      nl: 'José is aan het telefoneren. estar + gerundio; -ar → -ando.',
      grammarRef: 'gr.gerundio',
    }),
    toets(8, '¿Has llamado a Lola?', ['No he lo podido hacer.', 'Lo no he podido hacer.', 'No he podido hacerlo.'], 'No he podido hacerlo.', {
      instruction: 'Kies het juiste antwoord op de vraag',
      nl: 'Heb je Lola gebeld? — Ik heb het niet kunnen doen. Het voornaamwoord hangt achter de infinitief (hacerlo) of staat vóór he (No lo he podido hacer).',
      grammarRef: 'gr.lijdend-voorwerp',
    }),
    toets(9, '___ me ducho.', ['Durante de desayunar', 'Antes de desayunar', 'Delante de desayunar'], 'Antes de desayunar', {
      nl: 'Vóór het ontbijt neem ik een douche. antes de + infinitief; delante de = vóór (plaats).',
    }),
    toets(10, 'Marisa y Antonio ___ viendo la tele.', ['están', 'son', 'hay'], 'están', {
      nl: 'Marisa en Antonio zitten tv te kijken. estar + gerundio.',
      grammarRef: 'gr.gerundio',
    }),
    toets(11, 'Esta mochila es ___ la otra.', ['más cara que', 'más cara de', 'tan cara que'], 'más cara que', {
      nl: 'Deze rugzak is duurder dan de andere. más … que; tan … como.',
      grammarRef: 'gr.vergelijken',
    }),
    toets(12, 'Toni ___ la siesta.', ['está dormiendo', 'está dormando', 'está durmiendo'], 'está durmiendo', {
      nl: 'Toni doet een middagdutje. dormir → durmiendo (o → u).',
      grammarRef: 'gr.gerundio',
    }),
    toets(13, '___ llevar un anorak para la excursión.', ['Se recomenda', 'Es necesito', 'Es necesario'], 'Es necesario', {
      nl: 'Je moet een anorak meenemen voor de uitstap. Es necesario + infinitief (of: Se recomienda).',
    }),
    toets(14, 'Margarita lleva ___.', ['una gafa verde', 'unas gafas verdas', 'unas gafas verdes'], 'unas gafas verdes', {
      nl: 'Margarita draagt een groene bril. Gafas is altijd meervoud; verde → verdes.',
    }),
    toets(15, 'Alejandro ___ el periódico.', ['está leyendo', 'está leiendo', 'es leyando'], 'está leyendo', {
      nl: 'Alejandro is de krant aan het lezen. leer → leyendo.',
      grammarRef: 'gr.gerundio',
    }),
    toets(16, 'Me encantan ___.', ['los jerseys gris', 'los jerseys grisos', 'los jerseys grises'], 'los jerseys grises', {
      nl: 'Ik ben dol op de grijze truien. gris → grises.',
    }),
    toets(17, '¿Has hecho las camas?', ['Las estoy haciendo.', 'Soy haciéndolas.', 'Estoy las haciendo.'], 'Las estoy haciendo.', {
      instruction: 'Kies het juiste antwoord op de vraag',
      nl: 'Heb je de bedden opgemaakt? — Ik ben ze aan het opmaken. Las vóór estoy, of achter het gerundio: Estoy haciéndolas.',
      grammarRef: 'gr.lijdend-voorwerp',
    }),
    toets(18, 'Normalmente ___ la última.', ['me acosto', 'acuestome', 'me acuesto'], 'me acuesto', {
      nl: 'Normaal ga ik als laatste slapen. acostarse: o → ue (me acuesto).',
      note: 'De sleutel van de toets geeft a (me acosto); dat is fout. Juist is me acuesto.',
      grammarRef: 'gr.klankverandering',
    }),

    /* ---------- Instaptoets 1.2 ---------- */
    instap(1, 0, 'Mira, aquí está, ___ Museo de Arte.', ['del lado del', 'al lado del', 'al lado de'], 'al lado del', {
      context: 'Dos amigos miran el plano de Sevilla. — ¿Dónde está la catedral?',
      nl: 'Kijk, hier is ze, naast het Museum voor Kunst. al lado de + el = al lado del.',
    }),
    instap(2, 1, 'Señora, ¿esta línea ___ al Museo del Oro?', ['vamos', 'ir', 'va'], 'va', {
      context: 'En el metro.',
      nl: 'Mevrouw, gaat deze lijn naar het Goudmuseum?',
    }),
    instap(2, 2, 'No, tiene que ___ en Portal del Sur y tomar la línea G.', ['viajar', 'tomar', 'bajar'], 'bajar', {
      context: 'Señora, ¿esta línea va al Museo del Oro?',
      nl: 'Nee, u moet uitstappen in Portal del Sur en lijn G nemen.',
    }),
    instap(3, 1, 'Señor, ¿___ lejos la estación de trenes?', ['son', 'es', 'está'], 'está', {
      context: 'Una pregunta en la calle.',
      nl: 'Meneer, is het treinstation ver? Ligging → estar.',
      grammarRef: 'gr.ser-estar',
    }),
    instap(3, 2, 'No, no. Está cerca, son unos cinco minutos ___ pie.', ['en', 'a', 'de'], 'a', {
      context: 'Señor, ¿está lejos la estación de trenes?',
      nl: 'Nee hoor, het is dichtbij, een vijftal minuten te voet (a pie).',
    }),
    instap(4, 0, 'Solamente ___ está cerrado.', ['lunes', 'en lunes', 'los lunes'], 'los lunes', {
      context: 'En la oficina de turismo. — ¿Qué día cierra el museo?',
      nl: 'Het is alleen op maandag gesloten. Elke maandag = los lunes (zonder en).',
    }),
    instap(5, 0, 'Quería un ___ para el tren a Alicante.', ['entrada', 'carta', 'billete'], 'billete', {
      context: 'En la estación de trenes.',
      nl: 'Ik wou graag een kaartje voor de trein naar Alicante. Treinticket = el billete; la entrada is voor een museum of concert.',
    }),
    instap(6, 0, 'A mí ___.', ['también', 'tampoco', 'no'], 'tampoco', {
      context: 'Dos amigas hablan de las vacaciones. — No me gustan las playas con mucha gente.',
      nl: 'Ik hou niet van drukke stranden. — Ik ook niet. Na een ontkenning: tampoco.',
      grammarRef: 'gr.ontkenning',
    }),
    instap(7, 0, '¡Oh! Disculpe. Aquí tiene.', ['De nada.', 'No pasa nada.', 'No hace nada.'], 'No pasa nada.', {
      instruction: 'Kies de beste reactie van de klant',
      context: 'En el restaurante. — Camarero, me falta el tenedor.',
      nl: 'Ober, ik heb geen vork. — Oh, excuseer. Alstublieft. — Geen probleem.',
    }),
    instap(8, 1, '¡Esteban, no estás ___ en casa!', ['de veces', 'una vez', 'nunca'], 'nunca', {
      context: 'Al teléfono.',
      nl: 'Esteban, je bent nooit thuis!',
      grammarRef: 'gr.ontkenning',
    }),
    instap(8, 2, 'Es que trabajo mucho y por la noche ___ con mis amigos.', ['sale', 'salo', 'salgo'], 'salgo', {
      context: '¡Esteban, no estás nunca en casa!',
      nl: 'Ik werk veel en ’s avonds ga ik uit met mijn vrienden. salir → salgo.',
      grammarRef: 'gr.onregelmatig-yo',
    }),
    instap(9, 1, 'Chicos, ¿___ la excursión a la montaña esta semana?', ['habéis hecho', 'ha hecho', 'habéis viajado'], 'habéis hecho', {
      context: 'Unos amigos en las vacaciones.',
      nl: 'Jongens, hebben jullie deze week de uitstap naar de bergen gedaan?',
      grammarRef: 'gr.perfecto',
    }),
    instap(9, 2, 'Sí, y nos ___ mucho.', ['hemos gustado', 'ha gustado', 'he gustado'], 'ha gustado', {
      context: 'Chicos, ¿habéis hecho la excursión a la montaña esta semana?',
      nl: 'Ja, en we vonden het heel leuk. Het onderwerp is la excursión → ha gustado.',
      grammarRef: 'gr.perfecto',
    }),
    instap(10, 1, 'Nos gusta ___ viajar, pero es muy caro porque somos una familia grande.', ['muy', 'mucho', 'muchos'], 'mucho', {
      context: 'Una opinión sobre los viajes.',
      nl: 'We reizen heel graag, maar het is erg duur omdat we een groot gezin zijn. Bij een werkwoord: mucho.',
      grammarRef: 'gr.muy-mucho',
    }),
    instap(10, 2, 'Nos gusta mucho viajar, pero es ___ caro porque somos una familia grande.', ['muy', 'mucho', 'poco'], 'muy', {
      context: 'Una opinión sobre los viajes.',
      nl: 'We reizen heel graag, maar het is erg duur. Bij een bijvoeglijk naamwoord: muy.',
      grammarRef: 'gr.muy-mucho',
    }),
    instap(11, 0, '¡Qué calor ___!', ['hay', 'hace', 'es'], 'hace', {
      context: 'En casa de una amiga.',
      nl: 'Wat is het warm! Het weer: hace calor.',
    }),
    instap(12, 1, 'El Camino del Norte es ___ bonito como el Camino Francés, ¿verdad?', ['tan', 'tanto', 'más'], 'tan', {
      context: 'Dos personas hablan del Camino de Santiago.',
      nl: 'De Camino del Norte is even mooi als de Camino Francés, toch? tan + bijvoeglijk naamwoord + como.',
      grammarRef: 'gr.vergelijken',
    }),
    instap(12, 2, 'No sé, es que ___ solo el Camino Francés.', ['conoce', 'conozo', 'conozco'], 'conozco', {
      context: 'El Camino del Norte es tan bonito como el Camino Francés, ¿verdad?',
      nl: 'Ik weet het niet, ik ken alleen de Camino Francés. conocer → conozco.',
      grammarRef: 'gr.onregelmatig-yo',
    }),
    instap(13, 1, '¿Qué te parecen estas camisetas ___?', ['rojos', 'gris', 'grises'], 'grises', {
      context: 'Dos amigas miran un catálogo.',
      nl: 'Wat vind je van deze grijze T-shirts? Vrouwelijk meervoud: grises.',
    }),
    instap(13, 2, 'A mí me gustan más ___.', ['las blancas', 'blancas', 'blanco'], 'las blancas', {
      context: '¿Qué te parecen estas camisetas grises?',
      nl: 'Ik vind de witte mooier. Zonder zelfstandig naamwoord: lidwoord + bijvoeglijk naamwoord.',
    }),
    instap(14, 1, '¿Ya conoces ___ profesor de inglés?', ['a el', 'el', 'al'], 'al', {
      context: 'En una escuela de idiomas.',
      nl: 'Ken je de leraar Engels al? Persoon als lijdend voorwerp → a; a + el = al.',
      grammarRef: 'gr.persoonlijke-a',
    }),
    instap(14, 2, 'No, todavía no ___ he visto.', ['lo', 'el', 'yo'], 'lo', {
      context: '¿Ya conoces al profesor de inglés?',
      nl: 'Nee, ik heb hem nog niet gezien.',
      grammarRef: 'gr.lijdend-voorwerp',
    }),
    instap(15, 0, 'No, pero tienes que ___ muy temprano.', ['te levantar', 'levantarse', 'levantarte'], 'levantarte', {
      context: '¿Es difícil hacer la excursión a pie por las sierras de Cádiz?',
      nl: 'Nee, maar je moet heel vroeg opstaan. Het wederkerend voornaamwoord past bij de persoon (tú → te) en hangt achter de infinitief.',
      grammarRef: 'gr.wederkerend',
    }),
    instap(16, 0, 'Mario, me llamas en un mal momento, es que justo ahora ___.', ['estamos comido', 'hemos comiendo', 'estamos comiendo'], 'estamos comiendo', {
      context: 'Una llamada de teléfono.',
      nl: 'Mario, je belt op een slecht moment, we zitten net te eten.',
      grammarRef: 'gr.gerundio',
    }),
    instap(17, 0, 'Camarero, ¿nos trae ___ salsa?', ['una otra de', 'un poco más de', 'más de'], 'un poco más de', {
      context: 'En el restaurante.',
      nl: 'Ober, brengt u ons nog wat saus?',
    }),
    instap(18, 0, 'Mira, esta es la tienda ___ mi madre compra toda su ropa.', ['que', 'la que', 'donde'], 'donde', {
      context: 'Dos amigas de compras.',
      nl: 'Kijk, dit is de winkel waar mijn moeder al haar kleren koopt. Plaats → donde.',
    }),
    instap(19, 1, '¿Qué ___ el gazpacho?', ['tal', 'está', 'gusta'], 'tal', {
      context: 'En el bar.',
      nl: 'Hoe is de gazpacho?',
    }),
    instap(19, 2, '___ muy bueno. ¿Quieres probarlo?', ['Es', 'Está', 'Lo es'], 'Está', {
      context: '¿Qué tal el gazpacho?',
      nl: 'Hij is heel lekker. Wil je proeven? Smaak van eten dat je nu eet → estar.',
      grammarRef: 'gr.ser-estar',
    }),
    instap(20, 0, 'No, es que no ___, nunca lo he aprendido.', ['puedo', 'sé', 'conozco'], 'sé', {
      context: 'En casa de amigos. — ¿Qué tal si jugamos al póker?',
      nl: 'Nee, ik kan het niet, ik heb het nooit geleerd. Iets geleerd hebben → saber.',
    }),
    instap(21, 0, 'La paella y el gazpacho son dos especialidades ___.', ['español', 'españoles', 'españolas'], 'españolas', {
      context: 'Hablando sobre la comida en España.',
      nl: 'Paella en gazpacho zijn twee Spaanse specialiteiten. Las especialidades → españolas.',
    }),
    instap(22, 1, '¿Vienes ___ a la fiesta de Javier mañana?', ['con mí', 'conmigo', 'con yo'], 'conmigo', {
      context: 'Dos amigos hablan de una fiesta.',
      nl: 'Ga je morgen met mij mee naar het feest van Javier?',
    }),
    instap(22, 2, 'Claro. ¿A qué hora ___?', ['venimos', 'encontramos', 'quedamos'], 'quedamos', {
      context: '¿Vienes conmigo a la fiesta de Javier mañana?',
      nl: 'Natuurlijk. Hoe laat spreken we af?',
    }),
    instap(23, 1, '¿Qué ___ el domingo? ¿Tienes ganas de ir al cine?', ['tienes hacer', 'vas a hacer', 'vas hacer'], 'vas a hacer', {
      context: 'Haciendo planes para el fin de semana.',
      nl: 'Wat ga je zondag doen? Heb je zin om naar de film te gaan?',
      grammarRef: 'gr.ir-a',
    }),
    instap(23, 2, 'Pues ___, es que tengo que trabajar.', ['gracias', 'pena', 'lo siento'], 'lo siento', {
      context: '¿Qué vas a hacer el domingo? ¿Tienes ganas de ir al cine?',
      nl: 'Sorry, ik moet werken.',
    }),
    instap(24, 1, 'Tenemos que comprar ___ para la cocina.', ['un escritorio', 'una cama', 'una mesa'], 'una mesa', {
      context: 'Un nuevo piso.',
      nl: 'We moeten een tafel kopen voor de keuken.',
    }),
    instap(24, 2, '¿Qué tal si la ___ el sábado?', ['vamos a comprar', 'compré', 'vamos de compras'], 'vamos a comprar', {
      context: 'Tenemos que comprar una mesa para la cocina.',
      nl: 'Zullen we hem zaterdag gaan kopen?',
      grammarRef: 'gr.ir-a',
    }),
    instap(25, 0, '___ No tiene tantos metros.', ['¿Tú crees?', '¿Nos parece?', 'Gracias.'], '¿Tú crees?', {
      context: 'Una visita al nuevo piso. — ¡Chicos, qué piso más grande tenéis!',
      nl: 'Wat een groot appartement hebben jullie! — Vind je? Zo veel vierkante meter is het niet.',
    }),
    instap(26, 0, '¿Me dice, por favor, en qué año ___?', ['naciste', 'nace', 'nació'], 'nació', {
      context: 'Completando un formulario.',
      nl: 'Kunt u me zeggen in welk jaar u geboren bent? — In 1972. Me dice = u-vorm → nació.',
      grammarRef: 'gr.indefinido',
    }),
    instap(27, 0, '¡Por supuesto! La ___ el verano pasado en tu casa.', ['conoció', 'conocí', 'conozco'], 'conocí', {
      context: 'En una fiesta. — ¿Ya conoces a Miriam, la hermana de mi novia?',
      nl: 'Natuurlijk! Ik heb haar vorige zomer bij jou thuis leren kennen.',
      grammarRef: 'gr.indefinido',
    }),
    instap(28, 1, 'El año pasado ___ a La Habana. ¿Y vosotros?', ['hemos viajado', 'habéis viajado', 'viajamos'], 'viajamos', {
      context: 'En casa de amigos.',
      nl: 'Vorig jaar zijn we naar Havana gereisd. En jullie? El año pasado → indefinido.',
      grammarRef: 'gr.perfecto-indefinido',
    }),
    instap(28, 2, 'Nosotros ___ a Cancún.', ['fueron', 'fuimos', 'fuisteis'], 'fuimos', {
      context: 'El año pasado viajamos a La Habana. ¿Y vosotros?',
      nl: 'Wij zijn naar Cancún gegaan.',
      grammarRef: 'gr.indefinido-onregelmatig',
    }),
    instap(29, 0, 'En España muy ___ jóvenes alquilan un piso.', ['muchos', 'pocos', 'algunos'], 'pocos', {
      context: 'Informaciones sobre los alquileres.',
      nl: 'In Spanje huren heel weinig jongeren een appartement. Na muy kan alleen pocos (muy muchos en muy algunos bestaan niet).',
      grammarRef: 'gr.onbepaald',
    }),
    instap(30, 1, 'El pintor ___ en 1881 en Málaga.', ['nací', 'nació', 'ha nacido'], 'nació', {
      context: 'Datos biográficos de Picasso.',
      nl: 'De schilder werd in 1881 in Málaga geboren.',
      grammarRef: 'gr.indefinido',
    }),
    instap(30, 2, 'En 1937 ___ el Guernica, su cuadro más conocido.', ['pintó', 'pinto', 'pinté'], 'pintó', {
      context: 'Picasso nació en 1881 en Málaga.',
      nl: 'In 1937 schilderde hij de Guernica, zijn bekendste schilderij.',
      grammarRef: 'gr.indefinido',
    }),

    /* ---------- Mirador unidad 4 · tekstboek ---------- */
    // 2a: de sobremesa
    reading('t.mirador-u4-sobremesa', 1, 'mirador-u4', SRC.u4Sobremesa, '¿Qué es la sobremesa?',
      ['El tiempo que la gente se queda en la mesa charlando después de comer', 'Un postre típico español', 'La mesa donde se sirve la comida'],
      'El tiempo que la gente se queda en la mesa charlando después de comer',
      { nl: 'De sobremesa is het moment na het eten waarop men aan tafel blijft praten.' }),
    reading('t.mirador-u4-sobremesa', 2, 'mirador-u4', SRC.u4Sobremesa, '¿Quiénes hacen sobremesa?',
      ['Solo las familias', 'Las familias, los amigos y también los colegas y los jefes', 'Solo los amigos'],
      'Las familias, los amigos y también los colegas y los jefes',
      { nl: 'Families, vrienden en ook collega’s en bazen bij een werklunch.' }),
    reading('t.mirador-u4-sobremesa', 3, 'mirador-u4', SRC.u4Sobremesa, 'Según el texto, ¿cuándo se puede hablar de temas más serios?',
      ['Durante la comida', 'Antes de comer', 'En la sobremesa'], 'En la sobremesa',
      { nl: 'Tijdens het eten zijn de onderwerpen licht; in de sobremesa kan het over ernstigere dingen gaan.' }),

    // 5a: wie zegt het in het hotel?
    ...[
      ['oiga', 'Oiga, por favor.', 'el / la cliente', 'Hallo, alstublieft (om iemands aandacht te trekken).'],
      ['mire', 'Mire, tengo un problema…', 'el / la cliente', 'Kijk, ik heb een probleem…'],
      ['he-pedido', 'Yo he pedido una habitación doble.', 'el / la cliente', 'Ik heb een tweepersoonskamer gevraagd.'],
      ['papel', 'No hay papel higiénico.', 'el / la cliente', 'Er is geen wc-papier.'],
      ['wifi', 'El wifi no funciona.', 'el / la cliente', 'De wifi werkt niet.'],
      ['lamento', 'Lo lamento.', 'el / la recepcionista', 'Het spijt me.'],
      ['ayudar', '¿En qué le puedo ayudar?', 'el / la recepcionista', 'Waarmee kan ik u helpen?'],
      ['enseguida', 'Enseguida se lo arreglamos.', 'el / la recepcionista', 'We lossen het meteen voor u op.'],
    ].map(([slug, prompt, answer, nl]) => choice(`q.mirador-u4.hotel-${slug}`, 'mirador-u4', SRC.u4Hotel,
      prompt, ['el / la cliente', 'el / la recepcionista'], answer,
      { instruction: 'Problemen in een hotel: wie zegt dit?', nl })),

    // 9a: twee zelfstandige naamwoorden verbinden met de
    ...[
      ['agencia', 'agencia ___ viajes', 'reisbureau'],
      ['transporte', 'medio ___ transporte', 'vervoermiddel'],
      ['cumpleanos', 'fiesta ___ cumpleaños', 'verjaardagsfeest'],
    ].map(([slug, prompt, nl]) => choice(`q.mirador-u4.de-${slug}`, 'mirador-u4', SRC.u4Aprender,
      prompt, ['a', 'de', 'en'], 'de',
      { instruction: `Hoe zeg je „${nl}”?`, nl: `${prompt.replace('___', 'de')} = ${nl}. Twee zelfstandige naamwoorden verbind je met de; het tweede zegt welk soort.` })),

    // 10: valse vrienden
    choice('q.mirador-u4.falso-mapa', 'mirador-u4', SRC.u4Aprender,
      'El año pasado viajamos por Chile. Mira, en ___ puedes ver la ruta.', ['esta carta', 'este mapa', 'esta letra'], 'este mapa',
      { instruction: 'Valse vrienden: kies het juiste woord', nl: 'Een landkaart is un mapa; una carta is een brief (of de menukaart).' }),
    choice('q.mirador-u4.falso-plano', 'mirador-u4', SRC.u4Aprender,
      'La arquitecta nos ha traído ___ de la nueva casa.', ['el plan', 'el plano', 'la carta'], 'el plano',
      { instruction: 'Valse vrienden: kies het juiste woord', nl: 'Een bouwplan of stadsplan is el plano; el plan is een plan (idee).' }),
    choice('q.mirador-u4.falso-taza', 'mirador-u4', SRC.u4Aprender,
      'Voy a tomar una ___ de té.', ['copa', 'tasa', 'taza'], 'taza',
      { instruction: 'Valse vrienden: kies het juiste woord', nl: 'Een kop is una taza; una copa is een glas op voet (wijn), una tasa een tarief.' }),
    choice('q.mirador-u4.falso-fecha', 'mirador-u4', SRC.u4Aprender,
      'Pronto vuelas a Buenos Aires, ¿verdad? ¿En qué ___ exactamente?', ['dato', 'fecha', 'data'], 'fecha',
      { instruction: 'Valse vrienden: kies het juiste woord', nl: 'Een datum is la fecha; un dato is een gegeven.' }),
    choice('q.mirador-u4.falso-tarjeta', 'mirador-u4', SRC.u4Aprender,
      'Quiero pagar con ___ de crédito, por favor.', ['tarjeta', 'carta', 'cartera'], 'tarjeta',
      { instruction: 'Valse vrienden: kies het juiste woord', nl: 'Een kredietkaart is una tarjeta de crédito; una cartera is een portefeuille.' }),
    choice('q.mirador-u4.falso-carta', 'mirador-u4', SRC.u4Aprender,
      'Mi nueva nevera no funciona, tengo que escribir una ___ de reclamación.', ['letra', 'carta', 'tarjeta'], 'carta',
      { instruction: 'Valse vrienden: kies het juiste woord', nl: 'Een brief is una carta; una letra is een letter (van het alfabet).' }),

    // 11a: terapia de errores (de correo van Marc)
    ...[
      ['llegar-a', 'Hace tres días llegamos ___ Argentina.', ['en', 'a'], 'a', 'Drie dagen geleden zijn we in Argentinië aangekomen. llegar a + plaats.', null],
      ['hemos', 'Lars y yo ___ conocido a otros belgas.', ['han', 'hemos', 'habéis'], 'hemos', 'Lars en ik hebben andere Belgen leren kennen. Lars y yo = nosotros → hemos.', 'gr.perfecto'],
      ['a-belgas', 'Hemos conocido ___ que van también por la Panamericana.', ['otros belgos', 'a otros belgas', 'otros belgas'], 'a otros belgas', 'We hebben andere Belgen leren kennen die ook de Panamericana volgen. Personen → a; belga is ook mannelijk belga(s).', 'gr.persoonlijke-a'],
      ['estamos', 'Ahora ___ en una pensión.', ['somos', 'estamos'], 'estamos', 'Nu zitten we in een pension. Plaats → estar.', 'gr.ser-estar'],
      ['jugar-a', 'Esta noche los otros están jugando ___ cartas.', ['de las', 'a las', 'en las'], 'a las', 'Vanavond spelen de anderen kaart. jugar a + spel.', null],
      ['se', 'Pero yo no, porque no ___ jugar al bridge.', ['puedo', 'conozco', 'sé'], 'sé', 'Maar ik niet, want ik kan niet bridgen. Iets geleerd hebben → saber.', null],
      ['tocar', 'Yo prefiero ___ la guitarra mirando las estrellas.', ['jugar', 'tocar'], 'tocar', 'Ik speel liever gitaar terwijl ik naar de sterren kijk. Een instrument bespelen → tocar.', null],
      ['fantasticas', 'Miro las estrellas, que son ___ aquí.', ['fantásticos', 'fantásticas'], 'fantásticas', 'De sterren zijn hier fantastisch. Las estrellas → vrouwelijk meervoud.', null],
      ['hace-frio', 'Hace buen tiempo y no ___ frío.', ['es', 'hace', 'está'], 'hace', 'Het is mooi weer en het is niet koud. Het weer → hacer.', null],
      ['vamos-a', 'Mañana ___ hacer una excursión.', ['vamos', 'vamos a'], 'vamos a', 'Morgen gaan we een uitstap maken. ir a + infinitief.', 'gr.ir-a'],
      ['levantarnos', 'Mañana tenemos que ___ a las seis.', ['levantarse', 'levantarnos'], 'levantarnos', 'Morgen moeten we om zes uur opstaan. nosotros → levantarnos.', 'gr.wederkerend'],
      ['gusta', 'No me ___, pero es necesario porque la ruta es muy larga.', ['gusto', 'gusta'], 'gusta', 'Ik vind het niet leuk, maar het moet, want de route is erg lang. Me gusta (het bevalt me).', null],
      ['necesario', 'No me gusta, pero es ___ porque la ruta es muy larga.', ['necesito', 'necesario'], 'necesario', 'Es necesario = het is nodig; necesito = ik heb nodig.', null],
    ].map(([slug, prompt, options, answer, nl, grammarRef]) => choice(`q.mirador-u4.error-${slug}`, 'mirador-u4', SRC.u4Aprender,
      prompt, options, answer, {
        instruction: 'Foutentherapie: kies wat Marc had moeten schrijven',
        context: 'Marc escribe a Mercedes desde Argentina.',
        nl, ...(grammarRef ? { grammarRef } : {}),
      })),

    /* ---------- Mirador unidad 4 · werkboek, test TELC A1 ---------- */
    // 1: grammatica en woordenschat (correo van Arturo)
    ...[
      [1, 'Ya estoy ___ Cusco, ¡y es de verdad un lugar maravilloso!', ['en', 'a'], 'en', 'Ik ben al in Cusco. estar en + plaats.', null],
      [2, 'Desde aquí ___ hacer el Camino Inca.', ['voy', 'voy a'], 'voy a', 'Van hieruit ga ik de Inca Trail doen. ir a + infinitief.', 'gr.ir-a'],
      [3, 'Yo ___ unos días antes de empezar la excursión.', ['llegó', 'llegué'], 'llegué', 'Ik ben een paar dagen vóór de tocht aangekomen. yo → llegué.', 'gr.indefinido'],
      [4, 'Llegué unos días antes, porque es importante ___ a la altura.', ['se adaptar', 'adaptarse'], 'adaptarse', 'Het is belangrijk om aan de hoogte te wennen. Het voornaamwoord hangt achter de infinitief.', 'gr.wederkerend'],
      [5, 'No he tenido problemas con el soroche y creo que ___ voy a tener problemas con los pies.', ['tampoco', 'también no'], 'tampoco', 'Ik heb geen last gehad van hoogteziekte en ik denk dat ik ook geen last van mijn voeten zal krijgen.', 'gr.ontkenning'],
      [6, 'Han dicho que va a ___ mal tiempo.', ['ser', 'hacer'], 'hacer', 'Ze hebben gezegd dat het slecht weer wordt. Het weer → hacer.', null],
      [7, 'Va a hacer mal tiempo, pero ___ una persona optimista.', ['soy', 'estoy'], 'soy', 'Het wordt slecht weer, maar ik ben een optimist. Karakter → ser.', 'gr.ser-estar'],
      [8, 'Ya he conocido ___ de mis compañeros de viaje.', ['algunos', 'a algunos'], 'a algunos', 'Ik heb al enkele van mijn reisgenoten leren kennen. Personen → a.', 'gr.persoonlijke-a'],
      [9, 'Mis compañeros de viaje son todos ___ simpáticos.', ['mucho', 'muy'], 'muy', 'Mijn reisgenoten zijn allemaal heel sympathiek. Bij een bijvoeglijk naamwoord: muy.', 'gr.muy-mucho'],
      [10, '¡Mañana tenemos que ___ a las seis de la mañana!', ['levantarnos', 'levantarse'], 'levantarnos', 'Morgen moeten we om zes uur ’s ochtends opstaan. nosotros → levantarnos.', 'gr.wederkerend'],
    ].map(([n, prompt, options, answer, nl, grammarRef]) => choice(`q.mirador-u4.telc-${pad(n)}`, 'mirador-u4', SRC.u4Telc1,
      prompt, options, answer, {
        context: 'Arturo escribe a su amiga Beatriz desde Perú.',
        nl, ...(grammarRef ? { grammarRef } : {}),
      })),

    // 4a: welke titel past bij welk bericht?
    ...[
      [1, 'Llega el frío', 'De temperaturen dalen van 20° naar 5°, met regen en wind.'],
      [2, 'Un regalo muy original', 'Chocoladefiguren met een prehispanisch ontwerp en een zin in het Nahuatl.'],
      [3, 'Más comunicación, mejor información', 'De satelliet geeft miljoenen Venezolanen internet en betere verbindingen.'],
    ].map(([n, answer, nl]) => reading('t.mirador-u4-noticias', n, 'mirador-u4', SRC.u4Telc4a,
      `¿Qué título es el adecuado para la noticia ${n}?`,
      ['Precios más bajos en Venezuela', 'Llega el frío', 'Un regalo muy original', 'Más comunicación, mejor información'], answer, { nl })),

    // 4b: correo van Carmen
    reading('t.mirador-u4-correo-carmen', 1, 'mirador-u4', SRC.u4Telc4b,
      '¿Correcto o falso? María Elena quiere visitar a una amiga que vive en Madrid.', CF, 'Correcto',
      { nl: 'Juist: Carmen woont in Madrid en María Elena komt morgen op bezoek.' }),
    reading('t.mirador-u4-correo-carmen', 2, 'mirador-u4', SRC.u4Telc4b,
      '¿Correcto o falso? María Elena no puede llegar antes de las siete.', CF, 'Falso',
      { nl: 'Fout: Carmen kan pas om zeven uur weg van kantoor. Komt María Elena vroeger, dan heeft de buurvrouw de sleutel.' }),
    reading('t.mirador-u4-correo-carmen', 3, 'mirador-u4', SRC.u4Telc4b,
      '¿Correcto o falso? María Elena no ha visto a su amiga durante mucho tiempo.', CF, 'Correcto',
      { nl: 'Juist: „después de tanto tiempo” — ze hebben elkaar lang niet gezien.' }),

    // 4c: aanbod van de taalschool
    reading('t.mirador-u4-sol-de-andalucia', 1, 'mirador-u4', SRC.u4Telc4b,
      'Usted quiere aprender a hablar más libremente. ¿Qué curso le conviene?', ['B', 'E'], 'B',
      { nl: 'B: debatten en spelletjes om vlotter te spreken.' }),
    reading('t.mirador-u4-sol-de-andalucia', 2, 'mirador-u4', SRC.u4Telc4b,
      'A usted le encanta la literatura. ¿En qué curso puede leer textos literarios en español?', ['A', 'D'], 'D',
      { nl: 'D: poëzie, romans en theater.' }),
    reading('t.mirador-u4-sol-de-andalucia', 3, 'mirador-u4', SRC.u4Telc4b,
      'Para su trabajo necesita conocer la actualidad política y social del país. ¿Qué curso le conviene?', ['C', 'F'], 'F',
      { nl: 'F: video’s, krantenartikels en teksten over de actuele situatie in Spanje.' }),

    /* ---------- Mirador unidad 4 · werkboek, DELE A1 ---------- */
    // Tarea 1: briefje van María José
    reading('t.mirador-u4-nota-maria-jose', 1, 'mirador-u4', SRC.u4Dele1, 'María José va a cenar hoy…',
      ['en casa.', 'en casa de Isabel.', 'con unos clientes.'], 'con unos clientes.',
      { nl: 'Ze eet vanavond met de Belgische klanten in het Galopín.' }),
    reading('t.mirador-u4-nota-maria-jose', 2, 'mirador-u4', SRC.u4Dele1, 'En el "Galopín"…',
      ['solo se puede comer carne o pescado.', 'no se pueden reservar mesas.', 'se pueden reservar comedores privados.'], 'se pueden reservar comedores privados.',
      { nl: 'Er is voor hen een aparte eetzaal gereserveerd; er is ook eten voor wie geen vlees of vis lust.' }),
    reading('t.mirador-u4-nota-maria-jose', 3, 'mirador-u4', SRC.u4Dele1, 'Mario puede…',
      ['cenar con Isabel.', 'prepararse una ensalada.', 'ir también a cenar al Galopín esta noche.'], 'prepararse una ensalada.',
      { nl: 'In de koelkast liggen tomaten en alles voor een salade.' }),
    reading('t.mirador-u4-nota-maria-jose', 4, 'mirador-u4', SRC.u4Dele1, 'Para el cumpleaños de Isabel…',
      ['todavía no han comprado nada.', 'ya han comprado un cedé.', 'no saben qué comprar.'], 'todavía no han comprado nada.',
      { nl: '„No tenemos nada”; ze weten wel wat: een cd met klassieke muziek.' }),

    // Tarea 2: woningadvertenties
    ...[
      [1, 'Buscamos un piso de unos 100 m² en una zona residencial, un poco lejos del centro.', ['A', 'B', 'D', 'G'], 'D', 'D (Alicante): 95 m², residentiële wijk, 20 minuten van het centrum.'],
      [2, 'Somos un grupo de seis amigos y queremos ir a esquiar este fin de semana.', ['F', 'G', 'H', 'I'], 'I', 'I (Sierra Nevada): appartement in de sneeuw met drie tweepersoonskamers, per week te huur.'],
      [3, 'Nos gusta la naturaleza. Queremos comprar una casa fuera de la ciudad.', ['B', 'C', 'F', 'H'], 'H', 'H (Toledo): huis op het platteland te koop, 20 km van Toledo. F is alleen te huur.'],
      [4, 'Queremos un piso de 3 dormitorios y bien comunicado. Necesitamos un garaje.', ['A', 'C', 'D', 'E'], 'E', 'E (Almería): 3 slaapkamers, bus naar het centrum en een garage.'],
      [5, 'Mi familia y yo necesitamos un piso amueblado en el centro de la ciudad.', ['A', 'B', 'E', 'G'], 'B', 'B (Oviedo): gemeubeld appartement in het centrum.'],
      [6, 'Estas vacaciones queremos estar cerca de la playa.', ['B', 'G', 'H', 'I'], 'G', 'G (Málaga): appartement met zicht op zee, in de zomermaanden.'],
      [7, 'Necesitamos un piso con jardín o una terraza grande. A los niños les gusta nadar.', ['B', 'C', 'F', 'G'], 'C', 'C (Alcorcón): terras van 30 m² én een zwembad.'],
    ].map(([n, q, options, answer, nl]) => reading('t.mirador-u4-anuncios-pisos', n, 'mirador-u4', SRC.u4Dele2,
      `¿Qué anuncio corresponde? ${q}`, options, answer, { nl })),

    // Tarea 3: welke notitie hoort bij de zin?
    ...[
      [1, 'Ir a una tienda de moda.', 'comprar el jersey negro', ['comprar CD para Carlos', 'reservar habitación doble para Londres', 'visitar al abuelo en el hospital'], 'Naar een kledingwinkel gaan.'],
      [2, 'Hacer deporte.', 'tenis con Luis, martes a las 20.30', ['jugar al dominó con Federico el domingo', 'reunión con el jefe de personal, lunes 11.30', 'llevar a Tisifús al veterinario'], 'Sporten.'],
      [3, 'Llamar a un hotel.', 'reservar habitación doble para Londres', ['reunión con el jefe de personal, lunes 11.30', 'enviar flores a la tía Antonia por su cumpleaños', 'tenis con Luis, martes a las 20.30'], 'Een hotel bellen.'],
      [4, 'Cocinar.', 'preparar una paella para la fiesta de José', ['comprar el jersey negro', 'jugar al dominó con Federico el domingo', 'visitar al abuelo en el hospital'], 'Koken.'],
      [5, 'Comprar un regalo.', 'comprar CD para Carlos', ['reservar habitación doble para Londres', 'llevar a Tisifús al veterinario', 'reunión con el jefe de personal, lunes 11.30'], 'Een cadeau kopen.'],
      [6, 'Ir con el gato al médico.', 'llevar a Tisifús al veterinario', ['visitar al abuelo en el hospital', 'tenis con Luis, martes a las 20.30', 'comprar CD para Carlos'], 'Met de kat naar de dokter gaan.'],
      [7, 'Ir a ver a un miembro de la familia.', 'visitar al abuelo en el hospital', ['jugar al dominó con Federico el domingo', 'reunión con el jefe de personal, lunes 11.30', 'comprar el jersey negro'], 'Een familielid gaan bezoeken.'],
    ].map(([n, prompt, answer, others, nl]) => choice(`q.mirador-u4.dele-notas-${n}`, 'mirador-u4', SRC.u4Dele34,
      prompt, [answer, ...others].sort(), answer, { instruction: 'Welke notitie hoort bij deze zin?', nl })),

    // Tarea 4: Semana latinoamericana
    ...[
      [1, 'El concierto empieza a ___.', ['las cuatro', 'las ocho', 'las diez y media'], 'las ocho', 'Het concert voor Mercedes Sosa begint zaterdag om 20.00 uur.'],
      [2, 'El cine es más barato a ___.', ['las cuatro', 'las siete', 'las nueve'], 'las cuatro', 'Om 16.00 uur kost de film 10 €, om 19.00 uur 12 €.'],
      [3, 'La actividad más cara es ___.', ['el concierto', 'el curso de tango', 'el curso de cocina'], 'el curso de cocina', 'De kookcursus kost 120 €; het concert hoogstens 55 €, tango 90 €.'],
      [4, '___ no tengo curso de tango. Los fines de semana tampoco.', ['Los lunes', 'Los jueves', 'Los viernes'], 'Los viernes', 'De tangocursus is van maandag tot donderdag.'],
      [5, 'El lunes el museo está ___.', ['abierto', 'cerrado'], 'cerrado', 'Het museum is open van dinsdag tot zondag.'],
      [6, 'Ponen una película mexicana en el ___. ¿Tienes ganas de verla?', ['Cine Odeón', 'Museo Nacional', 'Salón de actos'], 'Cine Odeón', 'Babel (Mexico) speelt in Cine Odeón.'],
      [7, 'La entrada más barata para el concierto cuesta ___.', ['10 €', '35 €', '55 €'], '35 €', 'Kaartjes voor het concert kosten van 35 tot 55 €.'],
      [8, 'El curso de cocina dura cada día ___ horas.', ['dos', 'tres', 'cuatro'], 'dos', 'Van 10.30 tot 12.30 uur: twee uur.'],
    ].map(([n, q, options, answer, nl]) => reading('t.mirador-u4-semana-latinoamericana', n, 'mirador-u4', SRC.u4Dele34,
      q, options, answer, { nl })),

    /* ---------- Mirador unidad 8 · tekstboek ---------- */
    // 1a: de officiële talen van Spanje
    reading('t.mirador-u8-lenguas', 1, 'mirador-u8', SRC.u8Lenguas,
      'Además del español, ¿cuántas lenguas oficiales se hablan en España?',
      ['Dos: el vasco y el catalán', 'Tres: el vasco, el gallego y el catalán', 'Cuatro: el vasco, el gallego, el catalán y el portugués'],
      'Tres: el vasco, el gallego y el catalán', { nl: 'Naast het Spaans (Castiliaans): Baskisch, Galicisch en Catalaans.' }),
    reading('t.mirador-u8-lenguas', 2, 'mirador-u8', SRC.u8Lenguas, '¿Qué lengua no viene del latín?',
      ['El vasco', 'El gallego', 'El catalán'], 'El vasco', { nl: 'Het Baskisch komt niet uit het Latijn; de oorsprong is nog altijd onbekend.' }),
    reading('t.mirador-u8-lenguas', 3, 'mirador-u8', SRC.u8Lenguas, '¿A qué lengua se parece el gallego?',
      ['Al francés', 'Al vasco', 'Al portugués'], 'Al portugués', { nl: 'Het Galicisch lijkt op het Portugees.' }),
    reading('t.mirador-u8-lenguas', 4, 'mirador-u8', SRC.u8Lenguas, '¿Dónde se habla catalán?',
      ['Solo en Cataluña', 'En Cataluña, en la Comunidad Valenciana y en las Islas Baleares', 'En Galicia y en el País Vasco'],
      'En Cataluña, en la Comunidad Valenciana y en las Islas Baleares', { nl: 'Catalaans spreekt men in Catalonië, Valencia en op de Balearen.' }),
    reading('t.mirador-u8-lenguas', 5, 'mirador-u8', SRC.u8Lenguas, '¿Por qué creían que José Mujika era de Afganistán?',
      ['Porque tiene un nombre vasco que suena diferente', 'Porque nació en Afganistán', 'Porque no habla español'],
      'Porque tiene un nombre vasco que suena diferente', { nl: 'Zijn Baskische naam klinkt anders dan de gewone Spaanse namen.' }),

    // 8a: hoe luisteren we?
    ...[
      ['tiempo', 'El pronóstico del tiempo si quiero hacer una excursión.', 'Me concentro solo en la región adonde voy.', 'Het weerbericht voor een uitstap: je let alleen op de streek waar je heen gaat.'],
      ['receta', 'Me explican una receta que quiero cocinar.', 'Lo escucho todo con mucha atención.', 'Een recept dat je wilt klaarmaken: je luistert heel aandachtig naar alles.'],
      ['radio', 'Un programa en la radio sobre la globalización.', 'Escucho para saber más del tema.', 'Een radioprogramma over globalisering: je luistert om meer over het onderwerp te weten.'],
    ].map(([slug, prompt, answer, nl]) => choice(`q.mirador-u8.escuchar-${slug}`, 'mirador-u8', SRC.u8Aprender,
      prompt, ['Escucho para saber más del tema.', 'Lo escucho todo con mucha atención.', 'Me concentro solo en la región adonde voy.'], answer,
      { instruction: 'Hoe luister je in deze situatie?', nl })),

    // 9a: terapia de errores (de brief van Silvia)
    ...[
      ['hace', 'Volví a mi casa ___ un mes.', ['desde', 'hace', 'desde hace'], 'hace', 'Ik ben een maand geleden naar huis teruggekeerd. Geleden → hace.', 'gr.desde-hace'],
      ['daros', 'Os escribo porque quiero ___ las gracias.', ['darles', 'darte', 'daros'], 'daros', 'Ik schrijf jullie omdat ik jullie wil bedanken. Vosotros → os (daros).', 'gr.meewerkend-voorwerp'],
      ['pase', 'Gracias por el año maravilloso que ___ con vosotros.', ['pasó', 'pasé', 'pasaste'], 'pasé', 'Bedankt voor het fantastische jaar dat ik bij jullie heb doorgebracht. Yo → pasé.', 'gr.indefinido'],
      ['muchas', 'Me sentí como en mi propia casa y viví ___ experiencias interesantes.', ['muchos', 'mucho', 'muchas'], 'muchas', 'Ik voelde me thuis en heb veel boeiende dingen meegemaakt. Las experiencias → muchas.', null],
      ['bien', 'Juntos aprendimos que nuestras costumbres se pueden combinar muy ___.', ['bueno', 'bien', 'buena'], 'bien', 'Samen hebben we geleerd dat onze gewoonten goed samengaan. Bij een werkwoord: bien (bijwoord).', null],
      ['pensando', 'Fue una experiencia fantástica y sigo ___ en vosotros.', ['a pensar', 'pensar', 'pensando'], 'pensando', 'Het was fantastisch en ik denk nog steeds aan jullie. seguir + gerundio.', 'gr.gerundio'],
      ['estoy', 'Ahora ___ preparando un viaje a Latinoamérica.', ['soy', 'estoy', 'he'], 'estoy', 'Nu ben ik een reis naar Latijns-Amerika aan het voorbereiden. estar + gerundio.', 'gr.gerundio'],
    ].map(([slug, prompt, options, answer, nl, grammarRef]) => choice(`q.mirador-u8.error-${slug}`, 'mirador-u8', SRC.u8Aprender,
      prompt, options, answer, {
        instruction: 'Foutentherapie: kies wat Silvia had moeten schrijven',
        context: 'Silvia, una estudiante suiza, escribe a su familia española.',
        nl, ...(grammarRef ? { grammarRef } : {}),
      })),

    /* ---------- Mirador unidad 8 · werkboek, test TELC A2 ---------- */
    // 1a: grammatica en woordenschat (correo van Pedro)
    ...[
      [1, '¡Por fin estoy ___ León!', ['a', 'en', 'de'], 'en', 'Eindelijk ben ik in León! estar en + plaats.', null],
      [2, 'Estoy en casa de Arturo ___ dos días.', ['hace', 'desde', 'desde hace'], 'desde hace', 'Ik logeer al twee dagen bij Arturo. Al een tijd (en nog steeds) → desde hace.', 'gr.desde-hace'],
      [3, 'No te he escrito antes ___ estaba muy cansado.', ['como', 'por eso', 'porque'], 'porque', 'Ik heb je niet eerder geschreven omdat ik erg moe was.', null],
      [4, 'El viaje ___ horrible: el avión a Madrid llegó muy tarde.', ['fue', 'estaba', 'fui'], 'fue', 'De reis was vreselijk. Afgesloten gebeurtenis → indefinido van ser: fue.', 'gr.indefinido-onregelmatig'],
      [5, 'El avión llegó muy tarde y por eso no ___ tomar el tren a León.', ['pudo', 'he podido', 'pude'], 'pude', 'Het vliegtuig was te laat, daardoor kon ik de trein naar León niet nemen. yo → pude.', 'gr.indefinido-onregelmatig'],
      [6, 'Al final tuve que venir ___ autobús.', ['con', 'en', 'al'], 'en', 'Uiteindelijk moest ik met de bus komen. Vervoermiddel → en.', null],
      [7, 'Tuve que venir en autobús y por eso el viaje fue muy ___.', ['lento', 'lentamente', 'rápido'], 'lento', 'Ik moest met de bus komen, dus de reis was erg traag. Bij ser: bijvoeglijk naamwoord (lento).', 'gr.mente'],
      [8, 'No hemos hecho muchas cosas, pero ___ más me ha gustado es el ambiente del Barrio Húmedo.', ['que', 'lo que', 'porque'], 'lo que', 'We hebben nog niet veel gedaan, maar wat ik het leukst vind, is de sfeer in de Barrio Húmedo. Wat = lo que.', null],
      [9, 'Los bares son fantásticos y las tapas, deliciosas. ¡Ya me lo ___!', ['dijiste', 'deciste', 'vas a decir'], 'dijiste', 'De cafés zijn fantastisch en de tapas heerlijk. Dat had je me al gezegd! decir → dijiste.', 'gr.indefinido-onregelmatig'],
      [10, 'Seguro que quieres saber más, porque no eres muy ___.', ['ordenada', 'paciente', 'trabajadora'], 'paciente', 'Je wilt vast meer weten, want je bent niet erg geduldig.', null],
    ].map(([n, prompt, options, answer, nl, grammarRef]) => choice(`q.mirador-u8.telc-${pad(n)}`, 'mirador-u8', SRC.u8Telc1,
      prompt, options, answer, {
        context: 'Pedro escribe a su amiga Susana desde León.',
        nl, ...(grammarRef ? { grammarRef } : {}),
      })),

    // 1b: lenguaje interactivo (in een reisbureau)
    choice('q.mirador-u8.telc-agencia-1', 'mirador-u8', SRC.u8Telc1,
      '___ ir con mi mujer a un balneario, un fin de semana.', ['Me gustaría', 'Me puede', 'Es que', 'No sé'], 'Me gustaría',
      { context: 'En una agencia de viajes. — Buenos días. ¿Qué desea?', nl: 'Ik zou graag met mijn vrouw een weekend naar een kuuroord gaan.' }),
    choice('q.mirador-u8.telc-agencia-2', 'mirador-u8', SRC.u8Telc1,
      'Pues sí. Estuvimos allí el año pasado. ¿___ recomendar también otros?', ['Me gustaría', 'Me puede', 'Le gusta', 'Se mejore'], 'Me puede',
      { context: 'Vamos a ver. ¿Conoce usted el balneario de Mondariz?', nl: 'Ja, daar waren we vorig jaar. Kunt u me ook andere aanraden?' }),
    choice('q.mirador-u8.telc-agencia-3', 'mirador-u8', SRC.u8Telc1,
      'Uy, no, ___ ella no sabe nada. Es una sorpresa para su cumpleaños.', ['es que', 'no sé', 'me puede', 'le gusta'], 'es que',
      { context: '¿Por qué no miran el catálogo usted y su mujer y así deciden?', nl: 'O nee, zij weet van niets. Het is een verrassing voor haar verjaardag. Es que = want, het zit zo.' }),
    choice('q.mirador-u8.telc-agencia-4', 'mirador-u8', SRC.u8Telc1,
      'Seguro que un tratamiento de reflexoterapia ___ mucho.', ['se mejore', 'le gusta', 'me gustaría', 'es que'], 'le gusta',
      { context: '¿Y qué le gusta a su mujer?', nl: 'Een reflexologiebehandeling vindt ze vast heel fijn.' }),

    // 3: comprensión lectora (global), gids voor León
    reading('t.mirador-u8-guia-leon', 1, 'mirador-u8', SRC.u8Telc3, '¿Qué título corresponde al texto 1 (Balneario Caldas de Luna)?',
      ['Tratamiento con piedras calientes', 'El agua, fuente de salud y belleza', 'Un museo para ver y tocar', 'Dónde comprar comida típica'],
      'El agua, fuente de salud y belleza', { nl: 'Het geneeskrachtige water en de schoonheidsbehandelingen van het kuuroord.' }),
    reading('t.mirador-u8-guia-leon', 2, 'mirador-u8', SRC.u8Telc3, '¿Qué título corresponde al texto 2 (Monasterio de San Marcos)?',
      ['Un museo para ver y tocar', 'Para los amantes del senderismo', 'Un alojamiento de lujo', 'Dónde comprar comida típica'],
      'Un alojamiento de lujo', { nl: 'Het klooster is een vijfsterrenhotel.' }),
    reading('t.mirador-u8-guia-leon', 3, 'mirador-u8', SRC.u8Telc3, '¿Qué título corresponde al texto 3 (Mantecadas de Astorga)?',
      ['Un museo para ver y tocar', 'Un dulce exquisito', 'Actividades para todas las edades', 'El agua, fuente de salud y belleza'],
      'Un dulce exquisito', { nl: 'Mantecadas zijn een klassiek gebak uit León.' }),
    reading('t.mirador-u8-guia-leon', 4, 'mirador-u8', SRC.u8Telc3, '¿Qué título corresponde al texto 4 (La ruta del Cares)?',
      ['Un alojamiento de lujo', 'Un museo para ver y tocar', 'Para los amantes del senderismo', 'Un dulce exquisito'],
      'Para los amantes del senderismo', { nl: 'Een wandeling van 12 km door een spectaculair landschap.' }),

    /* ---------- Mirador unidad 8 · werkboek, DELE A2 ---------- */
    // Tarea 1: correo van Manuel
    reading('t.mirador-u8-correo-manuel', 1, 'mirador-u8', SRC.u8Dele1, 'Manuel escribe a Pepe para…',
      ['cambiar de trabajo.', 'pedir información.', 'alquilar un apartamento.'], 'pedir información.',
      { nl: 'Hij vraagt tips over Gran Canaria: mooie plekken en goede restaurants.' }),
    reading('t.mirador-u8-correo-manuel', 2, 'mirador-u8', SRC.u8Dele1, 'Manuel ha…',
      ['alquilado una casa en el campo.', 'reservado una habitación en un hotel.', 'alquilado un alojamiento en un pueblo.'], 'alquilado un alojamiento en un pueblo.',
      { nl: 'Ze hebben een appartement gehuurd in een dorp aan het strand.' }),
    reading('t.mirador-u8-correo-manuel', 3, 'mirador-u8', SRC.u8Dele1, 'Marta…',
      ['va a Gran Canaria con Manuel.', 'piensa que va a llover en Canarias.', 'sabe dónde están los paisajes más bonitos.'], 'va a Gran Canaria con Manuel.',
      { nl: '„Marta y yo queremos ir de vacaciones a Gran Canaria.”' }),
    reading('t.mirador-u8-correo-manuel', 4, 'mirador-u8', SRC.u8Dele1, 'A Manuel…',
      ['le interesa la fotografía.', 'le gusta comer bien.', 'le interesa saber si hace buen tiempo.'], 'le gusta comer bien.',
      { nl: 'Manuel houdt van lekker eten; het is Marta die van fotografie houdt.' }),

    // Tarea 2: gezondheid
    ...[
      [1, 'Ahora se sabe que es también sana.', ['B', 'C', 'E', 'F'], 'B', 'B: volgens nieuw onderzoek is een siësta van 40 minuten goed voor de gezondheid.'],
      [2, 'Solo son eficaces si los da una persona con formación especializada.', ['A', 'D', 'F', 'H'], 'F', 'F: massages, maar zoek een goede professional.'],
      [3, 'Es mejor tomar solo los que receta el médico.', ['B', 'C', 'D', 'G'], 'C', 'C: veel mensen nemen te veel medicijnen; praat met de dokter.'],
      [4, 'Es diferente pero efectiva en muchos casos.', ['C', 'E', 'F', 'G'], 'G', 'G: alternatieve geneeskunde helpt veel mensen.'],
      [5, 'Hay que tomar un mínimo cada día.', ['A', 'E', 'F', 'H'], 'A', 'A: een salade en drie stuks fruit per dag.'],
      [6, 'Muchas veces ayudan igual que un medicamento de la farmacia.', ['B', 'C', 'D', 'E'], 'D', 'D: huismiddeltjes zijn vaak genoeg.'],
    ].map(([n, q, options, answer, nl]) => reading('t.mirador-u8-salud', n, 'mirador-u8', SRC.u8Dele2,
      `¿Qué texto corresponde a esta frase? «${q}»`, options, answer, { nl })),

    // Tarea 3: balnearios
    reading('t.mirador-u8-balnearios', 1, 'mirador-u8', SRC.u8Dele34, 'En este texto se habla de…',
      ['las vacaciones en la playa.', 'los resultados de una encuesta.', 'los gustos del 85 % de los españoles.'], 'los resultados de una encuesta.',
      { nl: 'Het artikel vat een enquête samen.' }),
    reading('t.mirador-u8-balnearios', 2, 'mirador-u8', SRC.u8Dele34, 'La mayoría ha ido a un balneario…',
      ['más de dos veces.', 'más de una vez.', 'una sola vez.'], 'más de dos veces.',
      { nl: '55 % is er „más de una segunda vez” geweest, dus vaker dan twee keer; 43 % maar één keer.' }),
    reading('t.mirador-u8-balnearios', 3, 'mirador-u8', SRC.u8Dele34, 'La mayoría visita los balnearios…',
      ['por aspectos estéticos.', 'para estar en forma.', 'para relajarse.'], 'para relajarse.',
      { nl: '85 % gaat om te ontspannen.' }),
    reading('t.mirador-u8-balnearios', 4, 'mirador-u8', SRC.u8Dele34, 'El número de visitantes de los balnearios…',
      ['es enorme.', 'prácticamente no ha cambiado.', 'está subiendo.'], 'está subiendo.',
      { nl: '„Cada vez hay más interés por los balnearios.”' }),
    reading('t.mirador-u8-balnearios', 5, 'mirador-u8', SRC.u8Dele34, 'En España hay balnearios…',
      ['en todas las regiones.', 'en las regiones del centro.', 'en las regiones de la costa.'], 'en todas las regiones.',
      { nl: '„… en todas las regiones.”' }),
    reading('t.mirador-u8-balnearios', 6, 'mirador-u8', SRC.u8Dele34, 'Las ofertas de los balnearios se dirigen…',
      ['especialmente a personas jóvenes.', 'a todas las edades.', 'solamente a personas mayores.'], 'a todas las edades.',
      { nl: '„Balnearios para todos los gustos … todas las edades.”' }),

    // Tarea 4: advertenties en berichtjes
    ...[
      [1, 'El domingo es más caro.', ['A', 'D', 'E', 'F'], 'D', 'D: het pension kost 40 € in de week en 55 € in het weekend.'],
      [2, 'No hay nadie en casa.', ['B', 'C', 'G', 'H'], 'H', 'H: Paula en Julia zitten in het restaurant en wachten op Carlos.'],
      [3, 'Para leer, escuchar y cantar.', ['A', 'C', 'D', 'F'], 'F', 'F: bij een boek met verhalen krijg je een cd met kinderliedjes.'],
      [4, 'Son 30 horas a la semana.', ['A', 'B', 'D', 'E'], 'A', 'A: zes uur les per dag, van maandag tot vrijdag.'],
      [5, 'Se trata de dos muebles.', ['D', 'E', 'F', 'G'], 'G', 'G: een bed en een kast.'],
      [6, 'La chica puede dar más información por teléfono.', ['B', 'C', 'E', 'G'], 'B', 'B: bel Nuria voor meer informatie (C is Fernando).'],
    ].map(([n, q, options, answer, nl]) => reading('t.mirador-u8-anuncios', n, 'mirador-u8', SRC.u8Dele34,
      `¿Qué texto corresponde a esta frase? «${q}»`, options, answer, { nl })),
  ],

  texts: {
    't.mirador-u4-sobremesa': {
      title: 'La sobremesa',
      es: 'La costumbre de la sobremesa es muy española. Describe el momento en el que, después de la comida, la gente se queda en la mesa charlando, para disfrutar de la buena compañía y de una conversación interesante, divertida o, a veces, muy personal. Lo hacen las familias, los amigos y también los colegas y los jefes en las comidas de trabajo.\n\n'
        + 'La sobremesa es una tradición importante. Durante la comida los temas son ligeros; en la sobremesa se puede hablar de temas más serios e incluso de problemas. Sin embargo, conviene evitar algunos temas para mantener un buen ambiente.',
      nl: 'Over de Spaanse gewoonte om na het eten aan tafel te blijven praten.',
      src: SRC.u4Sobremesa,
    },
    't.mirador-u4-noticias': {
      title: 'Tres noticias',
      es: '1. El cambio se presenta casi de la noche a la mañana: los expertos dicen que las temperaturas van a bajar esta semana de los agradables 20° del domingo hasta los 5° el jueves. Además, para hoy y para mañana se espera lluvia y un fuerte viento en casi toda la región.\n\n'
        + '2. Un grupo de estudiantes de Puebla (México) produce figuras de chocolate con un diseño prehispánico. Las figuras se venden junto con una tarjeta que lleva una frase escrita en náhuatl y su traducción al español. La idea de estos jóvenes no solo es ofrecer un producto muy especial. También quieren recordar el origen del chocolate y dar a conocer la lengua de los antiguos mexicanos.\n\n'
        + '3. El satélite "Simón Bolívar" cumple ocho años. Desde su instalación más de seis millones de venezolanos tienen acceso a internet. Este proyecto de cooperación entre Venezuela y China ha contribuido al desarrollo tecnológico y social del país con mejores conexiones de internet y teléfono y con programas de medicina y educación para la televisión.',
      nl: 'Drie korte krantenberichten: het weer, chocolade uit Puebla en een Venezolaanse satelliet.',
      src: SRC.u4Telc4a,
    },
    't.mirador-u4-correo-carmen': {
      title: 'Un correo de Carmen',
      es: 'Querida María Elena:\n\n'
        + 'Vienes ya mañana, ¡qué bien! No sé si me has dicho a qué hora llegas, pero he olvidado decirte que salgo un poco tarde de la oficina. Como soy nueva en la empresa, no puedo salir antes de las siete. Si llegas a Madrid antes de esa hora, no pasa nada porque mi vecina tiene la llave de mi piso. Y si quieres, puedes tomar un café en la cafetería de al lado. Es un café tradicional.\n\n'
        + '¡Qué ilusión pasar algunos días juntas después de tanto tiempo! ¡Va a ser un fin de semana genial! Nos vemos pronto.\n\n'
        + 'Un abrazo,\nCarmen',
      nl: 'Carmen schrijft aan haar vriendin die morgen naar Madrid komt.',
      src: SRC.u4Telc4b,
    },
    't.mirador-u4-sol-de-andalucia': {
      title: 'Sol de Andalucía · Escuela de idiomas',
      es: 'Además de nuestros cursos regulares de español, tenemos este semestre las siguientes ofertas especiales:\n\n'
        + 'A. Ejercicios para practicar la pronunciación de la lengua española.\n\n'
        + 'B. Debates sobre temas interesantes, juegos y muchas actividades más para mejorar la expresión oral.\n\n'
        + 'C. Preparación intensiva para los exámenes internacionales DELE y TELC.\n\n'
        + 'D. Ejemplos de poesía, novela y teatro, para descubrir la lengua española.\n\n'
        + 'E. Visitas culturales a los monumentos importantes de la ciudad y a fiestas locales.\n\n'
        + 'F. Presentación de vídeos, artículos de periódico y textos que tratan sobre la historia y la situación actual de España.\n\n'
        + 'G. Clases de flamenco. No se necesita ropa especial, solo zapatos adecuados.',
      nl: 'Het extra cursusaanbod van een taalschool.',
      src: SRC.u4Telc4b,
    },
    't.mirador-u4-nota-maria-jose': {
      title: 'Una nota para Mario',
      es: 'Hola, Mario:\n\n'
        + 'Esta noche voy a volver tarde del trabajo, así que no tienes que esperarme para cenar. Esta mañana me han invitado a una cena con los clientes belgas que llegan hoy para hablar de un nuevo proyecto. Tengo reuniones todo el día: con el nuevo director, con el jefe de Marketing, con el jefe del proyecto y después vamos a cenar al "Galopín". Ya sabes, ahí no hay problema si a alguien no le gusta la carne o el pescado, porque tienen de todo, y además nos han reservado un comedor privado. ¿No tienes ganas de volver tú también alguna vez? La última vez te gustó mucho. Voy a reservar una mesa para nosotros la semana que viene.\n\n'
        + 'En la nevera hay tomates y todo lo que necesitas para una ensalada. O también puedes comerte el pollo que quedó de ayer, si lo prefieres. Si tienes tiempo, ¿puedes ir al centro y comprar un regalo para Isabel? El viernes es su cumpleaños y no tenemos nada, pero no es difícil elegir. Ya sabes que le gusta la música clásica, así que un cedé siempre es un buen regalo.\n\n'
        + 'Bueno, un beso. Me puedes esperar en la cama.\n\nMaría José',
      nl: 'María José laat een briefje achter voor Mario: ze komt laat thuis.',
      src: SRC.u4Dele1,
    },
    't.mirador-u4-anuncios-pisos': {
      title: 'Anuncios de pisos',
      es: 'A. Madrid. Alonso Martínez. Piso de 115 m², 4 dormitorios, salón, cocina con electrodomésticos, baño, 3.er piso sin ascensor, exterior. Precio: 1250 €.\n\n'
        + 'B. Oviedo. Piso amueblado, dos dormitorios, muy tranquilo, 70 m², en el centro. Jardín. Precio: 950 €.\n\n'
        + 'C. Alcorcón. Piso de 2 dormitorios, baño, salón-comedor, terraza de 30 m², garaje, piscina. Zona residencial. Precio: 890 €.\n\n'
        + 'D. Alicante. Zona residencial, 95 m², 3 dormitorios, cocina amueblada, 3.er piso, exterior, ascensor. A 20 min del centro (autobús). Precio: 1200 €.\n\n'
        + 'E. Almería. 86 m², 3 dormitorios, cocina amueblada, salón, 1.er piso sin ascensor, cerca del centro (autobús), garaje, aire acondicionado. Precio: 1020 €.\n\n'
        + 'F. Asturias. Casa rural, 4 dormitorios, 2 baños, terraza grande, cocina. Por semanas y todo el año. 400 € por semana.\n\n'
        + 'G. Málaga. Apartamento con vistas al mar, 2.º piso sin ascensor, cocina amueblada, salón, baño, 2 dormitorios. Julio, agosto y septiembre. 700 € por mes.\n\n'
        + 'H. Toledo. Se vende casa en el campo, tres dormitorios, baño, cocina grande, salón-comedor, 120 m². A 20 km de Toledo. Precio: 350 000 €.\n\n'
        + 'I. Sierra Nevada. Apartamento en la nieve. Cocina, salón-comedor, 3 dormitorios dobles, 2 baños. De noviembre a febrero. 300 € por semana.',
      nl: 'Negen advertenties voor woningen, te huur of te koop.',
      src: SRC.u4Dele2,
    },
    't.mirador-u4-semana-latinoamericana': {
      title: 'Semana latinoamericana',
      es: 'Cine: Babel (México). Lugar: Cine Odeón. Horario: martes y jueves, a las 16.00 y a las 19.00. Precio: 10 € (16.00), 12 € (19.00).\n\n'
        + 'Música: Homenaje a Mercedes Sosa. Lugar: Salón de actos. Horario: sábado, 20.00. Precio: de 35 € a 55 €.\n\n'
        + 'Arte: Exposición de arte maya. Lugar: Museo Nacional. Horario: de martes a domingo, de 10.00 a 21.00. Entrada gratuita.\n\n'
        + 'Bailar: Curso de tango. Lugar: Salón de actos. Horario: de lunes a jueves, de 17.00 a 19.00. Precio: 90 €.\n\n'
        + 'Cocina: Curso de cocina peruana. Lugar: Cocina, aula 8. Horario: de lunes a viernes, de 10.30 a 12.30. Precio: 120 €.',
      nl: 'Het programma van een Latijns-Amerikaanse week: film, muziek, kunst, dans en koken.',
      src: SRC.u4Dele34,
    },
    't.mirador-u8-lenguas': {
      title: 'Las lenguas oficiales de España',
      es: '¿Recuerda a José Mujika Eizagirre, el bombero de la primera unidad? ¿Puede imaginar por qué en un campeonato creían que era de Afganistán? Es que tiene un nombre vasco que suena diferente a los nombres españoles más usuales. El vasco es, con el gallego y el catalán, una de las tres lenguas oficiales que se hablan en España además del español o castellano. El vasco se habla en el País Vasco y en parte de Navarra. Es realmente una lengua muy diferente porque, a diferencia de las otras tres, no viene del latín. En realidad todavía hoy no se conoce su origen.\n\n'
        + 'El gallego se habla en Galicia y es parecido al portugués. El catalán se habla en Cataluña, en la Comunidad Valenciana y en las Islas Baleares. ¿Es parecido a otras lenguas? Pues un poco al francés y al italiano. Es interesante ver cómo se transforman las lenguas según el lugar geográfico donde se hablan.',
      nl: 'Over het Baskisch, het Galicisch en het Catalaans naast het Spaans.',
      src: SRC.u8Lenguas,
    },
    't.mirador-u8-guia-leon': {
      title: 'Guía de León y su provincia',
      es: '1. Balneario Caldas de Luna. Sus aguas medicinales, a una temperatura de 28,5 °C, se usan principalmente para tratamientos nerviosos y de piel. En el balneario también se puede disfrutar de sus tratamientos de belleza, masajes y sauna.\n\n'
        + '2. Monasterio de San Marcos. En el centro de la ciudad, este monasterio tiene una de las fachadas más bellas de la región. El monasterio es también un hotel de cinco estrellas donde, además, se puede disfrutar de la comida típica de la región.\n\n'
        + '3. Mantecadas de Astorga. Hechas con harina, huevo, azúcar y canela, son un clásico de la pastelería de León. Para el desayuno o como postre tiene usted que probarlas. También son un regalo típico que puede llevar a casa como recuerdo de un viaje inolvidable.\n\n'
        + '4. La ruta del Cares. No necesita tener mucha experiencia, solo ganas de hacer un camino de 12 km en unas 3 o 4 horas para disfrutar de un paisaje espectacular. No hay que olvidarse de la cámara fotográfica para llevarse a casa un recuerdo impresionante.',
      nl: 'Vier korte teksten uit een reisgids voor León.',
      src: SRC.u8Telc3,
    },
    't.mirador-u8-correo-manuel': {
      title: 'Un correo de Manuel',
      es: 'Hola, Pepe:\n\n'
        + 'Carmen nos ha dicho que desde hace dos meses trabajas en Las Palmas de Gran Canaria. Chico, ¡qué sorpresa y qué alegría! Es lo que querías desde que terminaste tus estudios. ¿Cómo estás? ¿Te gusta tu nuevo trabajo? ¿Qué tal Adela y los niños?\n\n'
        + 'Te escribo porque Marta y yo queremos ir de vacaciones a Gran Canaria y hemos alquilado un apartamento para julio en la costa sur, en un pueblo al lado de la playa. Pero no conocemos la isla y no sabemos qué zonas son las más interesantes. ¿Puedes darnos algunos consejos?\n\n'
        + 'Como a Marta le encanta la fotografía, queríamos saber dónde están los paisajes más interesantes y los pueblos más bonitos. El tiempo no nos preocupa porque en Gran Canaria siempre hace buen tiempo.\n\n'
        + 'Ya sabes que a mí me gusta la buena comida. ¿Conoces buenos restaurantes? Ya ves que tenemos muchas preguntas. Mejor te llamo el próximo domingo y hablamos, ¿vale?\n\n'
        + 'Un abrazo,\nManuel',
      nl: 'Manuel vraagt zijn vriend Pepe om tips voor een vakantie op Gran Canaria.',
      src: SRC.u8Dele1,
    },
    't.mirador-u8-salud': {
      title: 'Consejos para la salud',
      es: 'A. Comer sano. Se come demasiada carne y mucha gente come poca fruta y verdura, por eso el cuerpo no recibe las vitaminas necesarias. Una ensalada y tres piezas de fruta al día son ideales para la buena salud.\n\n'
        + 'B. La siesta. Las últimas investigaciones científicas dicen que dormir unos 40 minutos de siesta es muy positivo para nuestra salud. Según un estudio, la siesta mejora la productividad de una persona en un 34 %.\n\n'
        + 'C. Medicamentos. En muchas ocasiones tenemos que tomar medicamentos para luchar contra una enfermedad, pero mucha gente toma demasiados, y eso no es bueno para la salud. Lo mejor es hablar con el médico.\n\n'
        + 'D. Remedios caseros. Se ha comprobado que los remedios caseros tienen un gran efecto en el tratamiento de problemas de salud y que a menudo son suficientes para luchar contra muchos de ellos.\n\n'
        + 'E. Ejercicio. No es necesario ser un deportista de alto nivel, basta con practicar algún deporte dos veces por semana. Si no le gusta hacer deporte, puede dar paseos. Lo importante es moverse.\n\n'
        + 'F. Masajes. Ayudan al tratamiento del estrés y de los dolores musculares, pero lo importante es buscar un buen profesional porque, en otro caso, los resultados pueden ser malos para la salud.\n\n'
        + 'G. Medicina alternativa. Muchas personas encuentran ayuda a sus problemas de salud en las llamadas medicinas alternativas: piedras calientes, acupuntura, reflexoterapia, ayurveda…\n\n'
        + 'H. Ir a la sauna regularmente. Es bueno, especialmente para tratar problemas de estrés cotidiano. Ir a la sauna regularmente relaja y, además, limpia la piel.',
      nl: 'Acht korte teksten over gezond leven.',
      src: SRC.u8Dele2,
    },
    't.mirador-u8-balnearios': {
      title: '¿Pasar las vacaciones en un balneario?',
      es: 'Según una encuesta, el 19 % de los españoles ya ha visitado un balneario. El 43 % de los visitantes solo ha ido una vez, pero el 55 % ha ido más de una segunda vez. El gasto medio en tratamientos terapéuticos es de 135 euros por persona y visita y parece que esta cifra va a subir más o menos un 19 % en los próximos dos años.\n\n'
        + 'Los motivos de las personas para pasar las vacaciones en un balneario son muy diferentes, pero encontramos uno que parece ser el más importante: el relax. El 85 % de las personas que pasan sus vacaciones en estos lugares dicen que la principal razón es que quieren relajarse. Un 15 % los visita por cuestiones de salud, y una pequeña cantidad, el 2 %, va a un balneario motivada por aspectos estéticos.\n\n'
        + 'Parece que cada vez hay más interés por los balnearios y que mucha gente ha descubierto una nueva forma de pasar sus vacaciones.\n\n'
        + 'En España hay balnearios para todos los gustos, todas las necesidades, todas las edades y en todas las regiones. Si desea informarse puede mirar en internet. Seguro que encontrar tantos va a ser una gran sorpresa para usted.',
      nl: 'Een artikel over een enquête: waarom Spanjaarden naar een kuuroord gaan.',
      src: SRC.u8Dele2,
    },
    't.mirador-u8-anuncios': {
      title: 'Anuncios y mensajes',
      es: 'A. La Conexión, escuela de idiomas. Ahora tiene la oportunidad de mejorar su inglés, francés, alemán, italiano… Cada semana empiezan nuevos cursos intensivos con seis horas de clase al día, de lunes a viernes, por solo 500 €.\n\n'
        + 'B. Campeonato de tenis para menores de 30 años. Si juegas al tenis y tienes menos de 30 años puedes participar en el campeonato. Para más información: llámame al 912557032. Te esperamos. Nuria\n\n'
        + 'C. ¿Te gusta cantar? Si te gusta cantar, puedes hacerlo con nosotros. Somos un grupo de estudiantes y queremos formar un coro. Si tienes interés, puedes llamarnos a partir de las 9 de la noche al 629706969. Fernando\n\n'
        + 'D. Pensión Amalia. Habitaciones individuales y dobles, con baño completo, a 200 metros de la playa. Precio: durante la semana, 40 euros; los fines de semana, 55 euros. Desayuno incluido.\n\n'
        + 'E. Alquiler de coches. Las mejores marcas a los mejores precios. Todos nuestros coches tienen aire acondicionado. Más información en nuestra web.\n\n'
        + 'F. Librería Los Pequeñitos. Les ofrece esta semana los mejores libros de cuentos para estas vacaciones. Si usted compra un libro, le regalamos un cedé con canciones infantiles.\n\n'
        + 'G. Vendo dormitorio de niño prácticamente nuevo, con cama y armario, por 150 euros. Interesados llamar al 9154805538.\n\n'
        + 'H. Hola, Carlos: Estoy en el restaurante mexicano de la calle Mayor con Julia. Te esperamos. Paula',
      nl: 'Acht advertenties en berichtjes.',
      src: SRC.u8Dele34,
    },
  },
};
