/* Grammatica-oefeningen uit de cursusbundel van de lerares (course-md,
 * "Ejercicios de gramática", blz. 14 en 55–66): indefinido, imperfecto, de
 * keuze tussen de verleden tijden, futuro en condicional, verkorte vormen,
 * bijwoorden op -mente, bezittelijke en onbepaalde voornaamwoorden, lijdend
 * en meewerkend voorwerp, ser/estar. De bundel heeft geen oplossingen: de
 * antwoorden zijn zelf uitgewerkt en nagekeken.
 *
 * Daarnaast eigen zinnen bij de uitleg in dezelfde bundel: de gebiedende
 * wijs, desde/hace, estar + gerundio en ir a + infinitief. */

const CM = stamp => `course-md/IMG_20260918_${stamp}_AE.md`;

/** Genummerde zinnen van één oefening: [nr, es, nl, antwoord, hint, extra?].
 *  extra: options, alt (bij het gat) of theme/grammarRef (per zin anders). */
const drill = ({ slug, theme, src, grammarRef, instruction }, items) =>
  items.map(([n, es, nl, answer, hint, extra = {}]) => {
    const { options, alt, ...rest } = extra;
    return {
      id: `s.drill.${slug}-${n}`,
      kind: 'sentence',
      theme,
      es,
      nl,
      blanks: [{ answer, ...(hint ? { hint } : {}), ...(options ? { options } : {}), ...(alt ? { alt } : {}) }],
      instruction,
      grammarRef,
      src,
      ...rest,
    };
  });

/** Losse werkwoordsvormen als grammatica-atoom: [persoon, vorm, infinitief, nl]. */
const forms = ({ slug, theme, src, grammarRef, rule }, list) => ({
  id: `g.drill.${slug}`,
  kind: 'grammar',
  theme,
  rule,
  grammarRef,
  src,
  examples: list.map(([person, answer, inf, nl]) => ({ es: `${person} ___`, answer, nl: `${inf} – ${nl}` })),
});

/* ------------------------------------------------------------------ */
/* Pretérito indefinido (blz. 56–58)                                   */

const INDEFINIDO = 'Vul de pretérito indefinido in';

const indefinidoAr = drill({
  slug: 'indefinido-ar', theme: 'gr-zin-indefinido', src: CM('191354942'),
  grammarRef: 'gr.indefinido', instruction: INDEFINIDO,
}, [
  [1, 'Hablé mucho.', 'Ik sprak veel.', 'Hablé', 'hablar, yo'],
  [2, 'Compraste cosas.', 'Jij kocht dingen.', 'Compraste', 'comprar, tú'],
  [3, 'Fumó cigarrillos.', 'Hij rookte sigaretten.', 'Fumó', 'fumar, él'],
  [4, 'Pagamos la cuenta.', 'Wij betaalden de rekening.', 'Pagamos', 'pagar, nosotros'],
  [5, 'Pasasteis por mi casa.', 'Jullie kwamen bij mij thuis langs.', 'Pasasteis', 'pasar, vosotros'],
  [6, 'Tomaron café.', 'Zij dronken koffie.', 'Tomaron', 'tomar, ellos'],
  [7, 'Anduve a casa.', 'Ik wandelde naar huis.', 'Anduve', 'andar, yo', { grammarRef: 'gr.indefinido-onregelmatig', note: 'andar is onregelmatig: anduve, anduviste, anduvo …' }],
  [8, 'Cantaste una canción.', 'Jij zong een lied.', 'Cantaste', 'cantar, tú'],
  [9, 'Bailó salsa.', 'Hij danste salsa.', 'Bailó', 'bailar, él'],
  [10, 'Caminamos a la playa.', 'Wij wandelden naar het strand.', 'Caminamos', 'caminar, nosotros'],
  [11, 'Trabajasteis demasiado.', 'Jullie werkten te veel.', 'Trabajasteis', 'trabajar, vosotros'],
  [12, 'Viajaron en barco.', 'Zij reisden per boot.', 'Viajaron', 'viajar, ellos'],
  [13, 'Reservé una habitación.', 'Ik reserveerde een kamer.', 'Reservé', 'reservar, yo'],
  [14, 'Estudiaste español.', 'Jij studeerde Spaans.', 'Estudiaste', 'estudiar, tú'],
  [15, 'Cambió dinero.', 'Hij wisselde geld.', 'Cambió', 'cambiar, él'],
  [16, 'Apuntamos los precios.', 'Wij schreven de prijzen op.', 'Apuntamos', 'apuntar, nosotros'],
  [17, 'Necesitasteis un coche.', 'Jullie hadden een auto nodig.', 'Necesitasteis', 'necesitar, vosotros'],
  [18, 'Escucharon la radio.', 'Zij luisterden naar de radio.', 'Escucharon', 'escuchar, ellos'],
  [19, 'Entré en la escuela.', 'Ik ging de school binnen.', 'Entré', 'entrar, yo'],
  [20, 'Alquilaste un piso.', 'Jij huurde een appartement.', 'Alquilaste', 'alquilar, tú'],
  [21, 'Miró las tiendas.', 'Hij bekeek de winkels.', 'Miró', 'mirar, él'],
  [22, 'Olvidamos el libro.', 'Wij vergaten het boek.', 'Olvidamos', 'olvidar, nosotros'],
  [23, 'Invitasteis a vuestros amigos.', 'Jullie nodigden jullie vrienden uit.', 'Invitasteis', 'invitar, vosotros'],
  [24, 'Explicaron el problema.', 'Zij legden het probleem uit.', 'Explicaron', 'explicar, ellos'],
  [25, 'Pregunté la hora.', 'Ik vroeg hoe laat het was.', 'Pregunté', 'preguntar, yo'],
  [26, 'Charlaste con una amiga.', 'Jij babbelde met een vriendin.', 'Charlaste', 'charlar, tú'],
  [27, 'Telefoneó siempre.', 'Hij belde altijd.', 'Telefoneó', 'telefonear, él'],
  [28, 'Desayunamos a las ocho.', 'Wij ontbeten om acht uur.', 'Desayunamos', 'desayunar, nosotros'],
  [29, 'Buscasteis un banco.', 'Jullie zochten een bank.', 'Buscasteis', 'buscar, vosotros'],
  [30, 'Esperaron una llamada.', 'Zij wachtten op een telefoontje.', 'Esperaron', 'esperar, ellos'],
]);

const indefinidoEr = drill({
  slug: 'indefinido-er', theme: 'gr-zin-indefinido', src: CM('191400015'),
  grammarRef: 'gr.indefinido', instruction: INDEFINIDO,
}, [
  [1, 'Comí mucho.', 'Ik at veel.', 'Comí', 'comer, yo'],
  [2, 'Bebiste cerveza.', 'Jij dronk bier.', 'Bebiste', 'beber, tú'],
  [3, 'Comprendió el problema.', 'Hij begreep het probleem.', 'Comprendió', 'comprender, él'],
  [4, 'Aprendimos español.', 'Wij leerden Spaans.', 'Aprendimos', 'aprender, nosotros'],
  [5, 'Vendisteis el coche.', 'Jullie verkochten de auto.', 'Vendisteis', 'vender, vosotros'],
  [6, 'Corrieron en el parque.', 'Zij liepen in het park.', 'Corrieron', 'correr, ellos'],
  [7, 'Prometí eso.', 'Ik beloofde dat.', 'Prometí', 'prometer, yo'],
  [8, 'Respondiste sin pensarlo.', 'Jij antwoordde zonder na te denken.', 'Respondiste', 'responder, tú'],
  [9, 'Debió saberlo.', 'Hij moest het weten.', 'Debió', 'deber, él'],
  [10, 'No dependimos de nadie.', 'Wij hingen van niemand af.', 'dependimos', 'depender, nosotros'],
  [11, 'Escondisteis los libros.', 'Jullie verstopten de boeken.', 'Escondisteis', 'esconder, vosotros'],
  [12, 'Temieron al profesor.', 'Zij waren bang voor de leraar.', 'Temieron', 'temer, ellos'],
]);

const indefinidoIr = drill({
  slug: 'indefinido-ir', theme: 'gr-zin-indefinido', src: CM('191400015'),
  grammarRef: 'gr.indefinido', instruction: INDEFINIDO,
}, [
  [1, 'Partí para Inglaterra.', 'Ik vertrok naar Engeland.', 'Partí', 'partir, yo'],
  [2, 'Escribiste pocas cartas.', 'Jij schreef weinig brieven.', 'Escribiste', 'escribir, tú'],
  [3, 'Abrió las puertas.', 'Hij opende de deuren.', 'Abrió', 'abrir, él'],
  [4, 'Vivimos en Bélgica.', 'Wij woonden in België.', 'Vivimos', 'vivir, nosotros'],
  [5, 'Recibisteis muchas cartas.', 'Jullie kregen veel brieven.', 'Recibisteis', 'recibir, vosotros'],
  [6, 'Permitieron todo.', 'Zij lieten alles toe.', 'Permitieron', 'permitir, ellos'],
  [7, 'Admití eso.', 'Ik gaf dat toe.', 'Admití', 'admitir, yo'],
  [8, 'Reuniste dinero.', 'Jij verzamelde geld.', 'Reuniste', 'reunir, tú'],
  [9, 'No lo resistió.', 'Hij hield het niet uit.', 'resistió', 'resistir, él'],
  [10, 'Persuadimos a los demás.', 'Wij overtuigden de anderen.', 'Persuadimos', 'persuadir, nosotros'],
  [11, 'Aplaudisteis mucho.', 'Jullie applaudisseerden veel.', 'Aplaudisteis', 'aplaudir, vosotros'],
  [12, 'Añadieron sal y pimienta.', 'Zij voegden zout en peper toe.', 'Añadieron', 'añadir, ellos'],
  [13, 'Subí por la escalera.', 'Ik ging met de trap naar boven.', 'Subí', 'subir, yo'],
  [14, 'Interrumpiste la conversación.', 'Jij onderbrak het gesprek.', 'Interrumpiste', 'interrumpir, tú'],
  [15, 'Asistió a clase.', 'Hij woonde de les bij.', 'Asistió', 'asistir, él'],
]);

const indefinidoVormen = [
  forms({
    slug: 'indefinido-regelmatig', theme: 'gr-zin-indefinido', src: CM('191404565'), grammarRef: 'gr.indefinido',
    rule: 'Vervoeg in de pretérito indefinido: -ar → -é, -aste, -ó, -amos, -asteis, -aron; -er/-ir → -í, -iste, -ió, -imos, -isteis, -ieron.',
  }, [
    ['yo', 'tomé', 'tomar', 'ik nam'],
    ['él', 'comprendió', 'comprender', 'hij begreep'],
    ['nosotros', 'salimos', 'salir', 'wij vertrokken'],
    ['ellos', 'permitieron', 'permitir', 'zij lieten toe'],
    ['tú', 'estudiaste', 'estudiar', 'jij studeerde'],
    ['nosotros', 'recibimos', 'recibir', 'wij ontvingen'],
    ['vosotros', 'alquilasteis', 'alquilar', 'jullie huurden'],
    ['yo', 'corrí', 'correr', 'ik liep'],
    ['nosotros', 'telefoneamos', 'telefonear', 'wij belden'],
    ['ellos', 'escribieron', 'escribir', 'zij schreven'],
    ['él', 'aparcó', 'aparcar', 'hij parkeerde'],
    ['nosotros', 'valimos', 'valer', 'wij waren waard'],
  ]),
  forms({
    slug: 'indefinido-onregelmatig', theme: 'gr-zin-indefinido', src: CM('191404565'), grammarRef: 'gr.indefinido-onregelmatig',
    rule: 'Vervoeg in de pretérito indefinido: onregelmatige werkwoorden (tuve, quise, hice, dije, fui …), zonder accent.',
  }, [
    ['tú', 'quisiste', 'querer', 'jij wilde'],
    ['vosotros', 'pudisteis', 'poder', 'jullie konden'],
    ['yo', 'fui', 'ir', 'ik ging'],
    ['él', 'hizo', 'hacer', 'hij deed'],
    ['ellos', 'tuvieron', 'tener', 'zij hadden'],
    ['tú', 'viste', 'ver', 'jij zag'],
    ['él', 'dijo', 'decir', 'hij zei'],
    ['vosotros', 'hubisteis', 'haber', 'jullie hadden (hulpwerkwoord)'],
    ['yo', 'vine', 'venir', 'ik kwam'],
    ['tú', 'pusiste', 'poner', 'jij legde'],
    ['vosotros', 'fuisteis', 'ser', 'jullie waren'],
    ['ellos', 'supieron', 'saber', 'zij wisten'],
  ]),
];

/* ------------------------------------------------------------------ */
/* Pretérito imperfecto (blz. 59–60)                                   */

const imperfectoVormen = [
  forms({
    slug: 'imperfecto-regelmatig', theme: 'gr-zin-imperfecto', src: CM('191410191'), grammarRef: 'gr.imperfecto',
    rule: 'Vervoeg in het imperfecto: -ar → -aba, -abas, -aba, -ábamos, -abais, -aban; -er/-ir → -ía, -ías, -ía, -íamos, -íais, -ían.',
  }, [
    ['yo', 'tomaba', 'tomar', 'ik nam'],
    ['tú', 'querías', 'querer', 'jij wilde'],
    ['él', 'comprendía', 'comprender', 'hij begreep'],
    ['nosotros', 'salíamos', 'salir', 'wij vertrokken'],
    ['vosotros', 'podíais', 'poder', 'jullie konden'],
    ['ellos', 'permitían', 'permitir', 'zij lieten toe'],
    ['tú', 'estudiabas', 'estudiar', 'jij studeerde'],
    ['él', 'hacía', 'hacer', 'hij deed'],
    ['nosotros', 'recibíamos', 'recibir', 'wij ontvingen'],
    ['vosotros', 'alquilabais', 'alquilar', 'jullie huurden'],
    ['ellos', 'tenían', 'tener', 'zij hadden'],
    ['yo', 'corría', 'correr', 'ik liep'],
    ['él', 'decía', 'decir', 'hij zei'],
    ['nosotros', 'telefoneábamos', 'telefonear', 'wij belden'],
    ['vosotros', 'habíais', 'haber', 'jullie hadden (hulpwerkwoord)'],
    ['ellos', 'escribían', 'escribir', 'zij schreven'],
    ['yo', 'venía', 'venir', 'ik kwam'],
    ['tú', 'ponías', 'poner', 'jij legde'],
    ['él', 'aparcaba', 'aparcar', 'hij parkeerde'],
    ['nosotros', 'valíamos', 'valer', 'wij waren waard'],
    ['ellos', 'sabían', 'saber', 'zij wisten'],
  ]),
  forms({
    slug: 'imperfecto-onregelmatig', theme: 'gr-zin-imperfecto', src: CM('191410191'), grammarRef: 'gr.imperfecto',
    rule: 'Alleen ir (iba), ser (era) en ver (veía) zijn onregelmatig in het imperfecto.',
  }, [
    ['yo', 'iba', 'ir', 'ik ging'],
    ['tú', 'veías', 'ver', 'jij zag'],
    ['vosotros', 'erais', 'ser', 'jullie waren'],
    ['nosotros', 'íbamos', 'ir', 'wij gingen'],
    ['nosotros', 'éramos', 'ser', 'wij waren'],
    ['ellos', 'veían', 'ver', 'zij zagen'],
    ['ellos', 'iban', 'ir', 'zij gingen'],
  ]),
];

const imperfectoZinnen = drill({
  slug: 'imperfecto', theme: 'gr-zin-imperfecto', src: CM('191415604'),
  grammarRef: 'gr.imperfecto', instruction: 'Zet het werkwoord in het imperfecto',
}, [
  [1, 'Estaba contento.', 'Ik was tevreden.', 'Estaba', 'estar, yo'],
  [2, 'Arreglábamos el coche.', 'Wij herstelden de auto.', 'Arreglábamos', 'arreglar, nosotros'],
  [3, '¿Teníais dificultades?', 'Hadden jullie moeilijkheden?', 'Teníais', 'tener, vosotros'],
  [4, 'Carlos pedía café.', 'Carlos bestelde koffie.', 'pedía', 'pedir'],
  [5, 'Eran las cinco.', 'Het was vijf uur.', 'Eran', 'ser'],
  [6, 'No lo creía.', 'Ik geloofde het niet.', 'creía', 'creer, yo'],
  [7, 'Ellos no pasaban por aquí.', 'Zij kwamen hier niet langs.', 'pasaban', 'pasar'],
  [8, 'Nos traía flores.', 'Hij bracht ons bloemen.', 'traía', 'traer, él'],
  [9, '¿No podías decirlo?', 'Kon je het niet zeggen?', 'podías', 'poder, tú'],
  [10, '¿Venías en tren?', 'Kwam je met de trein?', 'Venías', 'venir, tú'],
  [11, 'Nos lo explicaban muy mal.', 'Ze legden het ons heel slecht uit.', 'explicaban', 'explicar, ellos'],
  [12, '¿Qué hacíais por la tarde?', 'Wat deden jullie in de namiddag?', 'hacíais', 'hacer, vosotros'],
  [13, '¿Adónde iban ellos?', 'Waar gingen zij naartoe?', 'iban', 'ir'],
  [14, 'Paco escribía novelas.', 'Paco schreef romans.', 'escribía', 'escribir'],
  [15, 'No veía nada.', 'Ik zag niets.', 'veía', 'ver, yo'],
  [16, 'Era necesario hacerlo.', 'Het was nodig om het te doen.', 'Era', 'ser'],
  [17, '¿Podías estar tranquilo?', 'Kon je rustig blijven?', 'Podías', 'poder, tú'],
  [18, 'Los niños tomaban la sopa.', 'De kinderen aten de soep.', 'tomaban', 'tomar'],
  [19, 'No estaban en casa.', 'Ze waren niet thuis.', 'estaban', 'estar, ellos'],
  [20, 'Íbamos a casa de Ana.', 'We gingen naar Ana thuis.', 'Íbamos', 'ir, nosotros'],
  [21, '¿No leíais los periódicos?', 'Lazen jullie de kranten niet?', 'leíais', 'leer, vosotros'],
  [22, '¿Ibais a la montaña?', 'Gingen jullie naar de bergen?', 'Ibais', 'ir, vosotros'],
  [23, 'Pedro estaba muy cansado.', 'Pedro was heel moe.', 'estaba', 'estar'],
  [24, '¿No lo sabías?', 'Wist je het niet?', 'sabías', 'saber, tú'],
  [25, 'No teníamos casa.', 'Wij hadden geen huis.', 'teníamos', 'tener, nosotros'],
  [26, 'Yo no pedía nada.', 'Ik vroeg niets.', 'pedía', 'pedir'],
  [27, 'Comprábamos siempre mucho.', 'Wij kochten altijd veel.', 'Comprábamos', 'comprar, nosotros'],
  [28, 'Éramos muy amigos.', 'Wij waren goede vrienden.', 'Éramos', 'ser, nosotros'],
  [29, 'Comíamos aquí.', 'Wij aten hier.', 'Comíamos', 'comer, nosotros'],
  [30, 'Nos ofrecían aperitivos.', 'Ze boden ons hapjes aan.', 'ofrecían', 'ofrecer, ellos'],
]);

/* ------------------------------------------------------------------ */
/* Welke verleden tijd? Volgens de tijdsaanduiding (blz. 61)           */

const PERFECTO = { theme: 'gr-perfecto-indefinido', grammarRef: 'gr.perfecto-indefinido' };

const tijden = drill({
  slug: 'tijden', theme: 'gr-indefinido-imperfecto', src: CM('191420497'),
  grammarRef: 'gr.indefinido-imperfecto', instruction: 'Kies de juiste verleden tijd volgens de tijdsaanduiding',
}, [
  ['1a', 'Cada semana Carmen iba a la discoteca.', 'Elke week ging Carmen naar de discotheek.', 'iba', 'ir', { options: ['iba', 'ha ido', 'fue'] }],
  ['1b', 'Esta semana Carmen ha ido a la discoteca.', 'Deze week is Carmen naar de discotheek gegaan.', 'ha ido', 'ir', { options: ['iba', 'ha ido', 'fue'], ...PERFECTO }],
  ['1c', 'La semana pasada Carmen fue a la discoteca.', 'Vorige week ging Carmen naar de discotheek.', 'fue', 'ir', { options: ['iba', 'ha ido', 'fue'] }],
  ['2a', 'El jueves pasado tuvimos una cita.', 'Vorige donderdag hadden we een afspraak.', 'tuvimos', 'tener, nosotros', { options: ['teníamos', 'hemos tenido', 'tuvimos'] }],
  ['2b', 'Este jueves hemos tenido una cita.', 'Deze donderdag hebben we een afspraak gehad.', 'hemos tenido', 'tener, nosotros', { options: ['teníamos', 'hemos tenido', 'tuvimos'], ...PERFECTO }],
  ['2c', 'Cada jueves teníamos una cita.', 'Elke donderdag hadden we een afspraak.', 'teníamos', 'tener, nosotros', { options: ['teníamos', 'hemos tenido', 'tuvimos'] }],
  ['3a', 'Hoy han telefoneado mucho.', 'Vandaag hebben ze veel gebeld.', 'han telefoneado', 'telefonear, ellos', { options: ['telefoneaban', 'han telefoneado', 'telefonearon'], ...PERFECTO }],
  ['3b', 'Antes telefoneaban mucho.', 'Vroeger belden ze veel.', 'telefoneaban', 'telefonear, ellos', { options: ['telefoneaban', 'han telefoneado', 'telefonearon'] }],
  ['3c', 'Anoche telefonearon mucho.', 'Gisteravond belden ze veel.', 'telefonearon', 'telefonear, ellos', { options: ['telefoneaban', 'han telefoneado', 'telefonearon'] }],
  ['4a', 'Antes salías para España.', 'Vroeger vertrok je naar Spanje.', 'salías', 'salir, tú', { options: ['salías', 'has salido', 'saliste'] }],
  ['4b', 'El verano pasado saliste para España.', 'Vorige zomer vertrok je naar Spanje.', 'saliste', 'salir, tú', { options: ['salías', 'has salido', 'saliste'] }],
  ['4c', 'Este verano has salido para España.', 'Deze zomer ben je naar Spanje vertrokken.', 'has salido', 'salir, tú', { options: ['salías', 'has salido', 'saliste'], ...PERFECTO }],
  ['5a', 'Anteayer estuvisteis cansados.', 'Eergisteren waren jullie moe.', 'estuvisteis', 'estar, vosotros', { options: ['estabais', 'habéis estado', 'estuvisteis'] }],
  ['5b', 'Esta mañana habéis estado cansados.', 'Vanmorgen zijn jullie moe geweest.', 'habéis estado', 'estar, vosotros', { options: ['estabais', 'habéis estado', 'estuvisteis'], ...PERFECTO }],
  ['5c', 'Todas las mañanas estabais cansados.', 'Elke ochtend waren jullie moe.', 'estabais', 'estar, vosotros', { options: ['estabais', 'habéis estado', 'estuvisteis'] }],
]);

/* ------------------------------------------------------------------ */
/* Futuro en condicional (blz. 62)                                     */

const futuro = drill({
  slug: 'futuro', theme: 'gr-zin-futuro', src: CM('191426245'),
  grammarRef: 'gr.futuro', instruction: 'Wat zal u volgend jaar doen? Vul de futuro in',
}, [
  [1, 'El año que viene iré regularmente a la piscina.', 'Volgend jaar zal ik regelmatig naar het zwembad gaan.', 'iré', 'ir, yo'],
  [2, 'El año que viene no comeré tanta carne.', 'Volgend jaar zal ik niet zoveel vlees eten.', 'comeré', 'comer, yo'],
  [3, 'El año que viene usaré con más frecuencia el transporte público.', 'Volgend jaar zal ik vaker het openbaar vervoer gebruiken.', 'usaré', 'usar, yo'],
  [4, 'El año que viene no gastaré tanto dinero en cosas que no necesito.', 'Volgend jaar zal ik niet zoveel geld uitgeven aan dingen die ik niet nodig heb.', 'gastaré', 'gastar, yo'],
  [5, 'El año que viene seré más amable en la oficina.', 'Volgend jaar zal ik vriendelijker zijn op kantoor.', 'seré', 'ser, yo'],
  [6, 'El año que viene no fumaré tantos cigarrillos.', 'Volgend jaar zal ik niet zoveel sigaretten roken.', 'fumaré', 'fumar, yo'],
  [7, 'El año que viene dormiré más.', 'Volgend jaar zal ik meer slapen.', 'dormiré', 'dormir, yo'],
  [8, 'El año que viene visitaré regularmente a mi familia.', 'Volgend jaar zal ik regelmatig mijn familie bezoeken.', 'visitaré', 'visitar, yo'],
  [9, 'El año que viene correré en el parque.', 'Volgend jaar zal ik in het park gaan lopen.', 'correré', 'correr, yo'],
  [10, 'El año que viene beberé más agua.', 'Volgend jaar zal ik meer water drinken.', 'beberé', 'beber, yo'],
]);

const condicional = drill({
  slug: 'condicional', theme: 'gr-zin-futuro', src: CM('191426245'),
  grammarRef: 'gr.condicional', instruction: 'Wat zou u doen met een miljoen euro? Vul de condicional in',
}, [
  [1, 'Con un millón de euros compraría una casa.', 'Met een miljoen euro zou ik een huis kopen.', 'compraría', 'comprar, yo'],
  [2, 'Con un millón de euros iría a vivir a otra ciudad.', 'Met een miljoen euro zou ik in een andere stad gaan wonen.', 'iría', 'ir, yo'],
  [3, 'Con un millón de euros viajaría por el mundo.', 'Met een miljoen euro zou ik de wereld rondreizen.', 'viajaría', 'viajar, yo'],
  [4, 'Con un millón de euros dejaría de trabajar.', 'Met een miljoen euro zou ik stoppen met werken.', 'dejaría', 'dejar, yo'],
  [5, 'Con un millón de euros regalaría una parte.', 'Met een miljoen euro zou ik een deel weggeven.', 'regalaría', 'regalar, yo'],
  [6, 'Con un millón de euros no cambiaría nada.', 'Met een miljoen euro zou ik niets veranderen.', 'cambiaría', 'cambiar, yo'],
  [7, 'Con un millón de euros partiría para otro país.', 'Met een miljoen euro zou ik naar een ander land vertrekken.', 'partiría', 'partir, yo'],
  [8, 'Con un millón de euros sería feliz.', 'Met een miljoen euro zou ik gelukkig zijn.', 'sería', 'ser, yo'],
  ['9a', 'Con un millón de euros bailaría y cantaría.', 'Met een miljoen euro zou ik dansen en zingen.', 'bailaría', 'bailar, yo'],
  ['9b', 'Con un millón de euros bailaría y cantaría.', 'Met een miljoen euro zou ik dansen en zingen.', 'cantaría', 'cantar, yo'],
  [10, 'Con un millón de euros bebería champán.', 'Met een miljoen euro zou ik champagne drinken.', 'bebería', 'beber, yo'],
]);

/* ------------------------------------------------------------------ */
/* Verkorte vormen en bijwoorden op -mente (blz. 63)                   */

const apocope = drill({
  slug: 'apocope', theme: 'bijvoeglijk-naamwoord', src: CM('191431725'),
  grammarRef: 'gr.verkort', instruction: 'Kies de juiste vorm: volledig of verkort?',
}, [
  [1, 'Tienen un jardín muy grande.', 'Ze hebben een heel grote tuin.', 'grande', 'grande', { options: ['gran', 'grande'] }],
  [2, 'Vivo en el tercer piso.', 'Ik woon op de derde verdieping.', 'tercer', 'tercero', { options: ['tercer', 'tercero', 'tercera'] }],
  [3, '¡No tengo ninguna idea!', 'Ik heb geen enkel idee!', 'ninguna', 'ninguno', { options: ['ningún', 'ninguno', 'ninguna'], note: 'idea is vrouwelijk: ninguna.' }],
  [4, '¡Qué mal tiempo ha hecho!', 'Wat een slecht weer was het!', 'mal', 'malo', { options: ['mal', 'malo', 'mala'] }],
  [5, 'Cualquier belga habla varios idiomas.', 'Elke Belg spreekt verschillende talen.', 'Cualquier', 'cualquiera', { options: ['Cualquier', 'Cualquiera'] }],
  [6, 'El coche primero es el mío.', 'De eerste auto is de mijne.', 'primero', 'primero', { options: ['primer', 'primero'], note: 'Primero staat hier áchter het zelfstandig naamwoord en blijft dus volledig.' }],
  [7, '¡Me gusta un buen café!', 'Ik hou van een goede koffie!', 'buen', 'bueno', { options: ['buen', 'bueno', 'buena'] }],
  [8, 'Quiero algún sombrero.', 'Ik wil een of andere hoed.', 'algún', 'alguno', { options: ['algún', 'alguno', 'alguna'] }],
  [9, '¡Es un hombre muy malo!', 'Het is een heel slechte man!', 'malo', 'malo', { options: ['mal', 'malo'] }],
  [10, '¿Qué es esta gran casa blanca?', 'Wat is dit grote witte huis?', 'gran', 'grande', { options: ['gran', 'grande'] }],
]);

const mente = drill({
  slug: 'mente', theme: 'bijwoord', src: CM('191431725'),
  grammarRef: 'gr.mente', instruction: 'Maak een bijwoord op -mente',
}, [
  [0, '¡Por favor, habla claramente!', 'Spreek alsjeblieft duidelijk!', 'claramente', 'claro'],
  [1, 'Ellos vienen seguramente mañana.', 'Ze komen morgen waarschijnlijk.', 'seguramente', 'seguro'],
  [2, 'Nosotros trabajamos rápidamente.', 'Wij werken snel.', 'rápidamente', 'rápido'],
  [3, 'Probablemente ha llegado ya.', 'Hij is waarschijnlijk al aangekomen.', 'Probablemente', 'probable'],
  [5, 'Posiblemente ha olvidado su libro.', 'Misschien is hij zijn boek vergeten.', 'Posiblemente', 'posible'],
  [7, 'Generalmente no le gusta conducir.', 'Over het algemeen rijdt hij niet graag met de auto.', 'Generalmente', 'general'],
  [8, 'Siempre come lentamente.', 'Hij eet altijd traag.', 'lentamente', 'lento'],
  [9, 'Lo he encontrado fácilmente.', 'Ik heb het makkelijk gevonden.', 'fácilmente', 'fácil'],
  [10, 'Normalmente no dormimos mucho.', 'Normaal slapen we niet veel.', 'Normalmente', 'normal'],
]);

/* ------------------------------------------------------------------ */
/* Bezittelijk en onbepaald voornaamwoord (blz. 64)                     */

const bezittelijk = drill({
  slug: 'bezittelijk', theme: 'gr-bezittelijk', src: CM('191438775'),
  grammarRef: 'gr.bezittelijk', instruction: 'Vul het beklemtoonde bezittelijk voornaamwoord in (el mío, la tuya …)',
}, [
  [0, 'Es el mío.', 'Het is de mijne.', 'el mío', 'mi jersey', { alt: ['mío'] }],
  [1, 'Es la nuestra.', 'Het is het onze.', 'la nuestra', 'nuestra casa', { alt: ['nuestra'] }],
  [2, 'Son los vuestros.', 'Het zijn die van jullie.', 'los vuestros', 'vuestros cigarrillos', { alt: ['vuestros'] }],
  [3, 'Son las suyas.', 'Het zijn die van hem.', 'las suyas', 'sus bicicletas', { alt: ['suyas'] }],
  [4, 'Es la tuya.', 'Het is de jouwe.', 'la tuya', 'tu corbata', { alt: ['tuya'] }],
  [5, 'Son los suyos.', 'Het zijn die van haar.', 'los suyos', 'sus guantes', { alt: ['suyos'] }],
  [6, 'Son los míos.', 'Het zijn de mijne.', 'los míos', 'mis zapatos', { alt: ['míos'] }],
  [7, 'Son las mías.', 'Het zijn de mijne.', 'las mías', 'mis maletas', { alt: ['mías'] }],
  [8, 'Es el suyo.', 'Het is de zijne.', 'el suyo', 'su coche', { alt: ['suyo'] }],
  [9, 'Son los nuestros.', 'Het zijn de onze.', 'los nuestros', 'nuestros abrigos', { alt: ['nuestros'] }],
  [10, 'Es el vuestro.', 'Het is dat van jullie.', 'el vuestro', 'vuestro diccionario', { alt: ['vuestro'] }],
]);

const NADA = ['nada', 'nadie', 'ninguno'];
const NADIE = ['nadie', 'nada', 'ninguno'];

const onbepaald = drill({
  slug: 'onbepaald', theme: 'onbepaalde-voornaamwoorden', src: CM('191438775'),
  grammarRef: 'gr.onbepaald', instruction: 'Antwoord ontkennend met nadie, nada of ninguno/a',
}, [
  [0, '¿Viene alguien por el jardín? — No, no viene nadie.', 'Komt er iemand door de tuin? – Nee, er komt niemand.', 'nadie', null, { options: NADIE }],
  [1, '¿Queda alguna naranja en la nevera? — No, no queda ninguna.', 'Is er nog een sinaasappel in de koelkast? – Nee, er is er geen meer.', 'ninguna', null, { options: ['ninguna', 'ninguno', 'nada'] }],
  [2, '¿Sabe alguien el camino? — No, no lo sabe nadie.', 'Kent iemand de weg? – Nee, niemand kent hem.', 'nadie', null, { options: NADIE }],
  [3, '¿Quieres algo? — No, no quiero nada.', 'Wil je iets? – Nee, ik wil niets.', 'nada', null, { options: NADA }],
  [4, '¿Tienes alguna camisa verde? — No, no tengo ninguna.', 'Heb je een groen hemd? – Nee, ik heb er geen.', 'ninguna', null, { options: ['ninguna', 'ninguno', 'nada'] }],
  [5, '¿Podéis hacer algo? — No, no podemos hacer nada.', 'Kunnen jullie iets doen? – Nee, we kunnen niets doen.', 'nada', null, { options: NADA }],
  [6, '¿Ve usted a alguien? — No, no veo a nadie.', 'Ziet u iemand? – Nee, ik zie niemand.', 'nadie', null, { options: NADIE }],
  [7, '¿Hay algún hotel por aquí? — No, no hay ninguno.', 'Is er hier een hotel in de buurt? – Nee, er is er geen.', 'ninguno', null, { options: ['ninguno', 'ningún', 'ninguna'], note: 'Zonder zelfstandig naamwoord erachter blijft het ninguno.' }],
  [8, '¿Oyes algo? — No, no oigo nada.', 'Hoor je iets? – Nee, ik hoor niets.', 'nada', null, { options: NADA }],
  [9, '¿Hay alguien en la habitación? — No, no hay nadie.', 'Is er iemand in de kamer? – Nee, er is niemand.', 'nadie', null, { options: NADIE }],
  [10, '¿Quiere usted algo de beber? — No, no quiero nada.', 'Wilt u iets drinken? – Nee, ik wil niets.', 'nada', null, { options: NADA }],
]);

/* ------------------------------------------------------------------ */
/* Lijdend en meewerkend voorwerp (blz. 65–66)                          */

const cod = drill({
  slug: 'cod', theme: 'gr-voorwerp', src: CM('191444100'),
  grammarRef: 'gr.lijdend-voorwerp', instruction: 'Vervang het lijdend voorwerp door lo, la, los of las',
}, [
  [1, 'Lo pago.', 'Ik betaal het (het ticket).', 'Lo', 'el billete'],
  [2, 'La comprendo.', 'Ik begrijp hem (de zin).', 'La', 'la frase'],
  [3, 'Lo visito.', 'Ik bezoek hem.', 'Lo', 'a Antonio', { alt: ['Le'] }],
  [4, 'Las repito.', 'Ik herhaal ze (de woorden).', 'Las', 'las palabras'],
  [5, 'Los saludo.', 'Ik groet ze (mijn vrienden).', 'Los', 'a mis amigos'],
  [6, 'Los vendo.', 'Ik verkoop ze (de boeken).', 'Los', 'los libros'],
  [7, 'Lo leo.', 'Ik lees hem (de krant).', 'Lo', 'el periódico'],
  [8, 'Los apunto.', 'Ik schrijf ze op (de prijzen).', 'Los', 'los precios'],
  [9, 'La miro.', 'Ik bekijk het (het huis).', 'La', 'la casa'],
  [10, 'Las aprendo.', 'Ik leer ze (de lessen).', 'Las', 'las lecciones'],
]);

const coi = drill({
  slug: 'coi', theme: 'gr-voorwerp', src: CM('191444100'),
  grammarRef: 'gr.meewerkend-voorwerp', instruction: 'Vervang het meewerkend voorwerp door le of les',
}, [
  [1, 'Le vendo la casa.', 'Ik verkoop hem het huis.', 'Le', 'al profesor'],
  [2, 'Le escribo una carta.', 'Ik schrijf haar een brief.', 'Le', 'a mi amiga'],
  [3, 'Les regalo el chocolate.', 'Ik geef hun de chocolade.', 'Les', 'a los niños'],
  [4, 'Le repito las palabras.', 'Ik herhaal de woorden voor hem.', 'Le', 'al señor'],
  [5, 'Les explico el texto.', 'Ik leg hun de tekst uit.', 'Les', 'a los estudiantes'],
  [6, 'Le doy el libro.', 'Ik geef haar het boek.', 'Le', 'a la señorita'],
  [7, 'Les pregunto la hora.', 'Ik vraag hun hoe laat het is.', 'Les', 'a las enfermeras'],
  [8, 'Le pido cien euros.', 'Ik vraag hem honderd euro.', 'Le', 'a mi padre'],
  [9, 'Le compro un libro.', 'Ik koop een boek voor haar.', 'Le', 'a Carmen'],
  [10, 'Les leo el anuncio.', 'Ik lees hun de advertentie voor.', 'Les', 'a las señoritas'],
]);

const codCoi = drill({
  slug: 'cod-coi', theme: 'gr-voorwerp', src: CM('191444100'),
  grammarRef: 'gr.lijdend-voorwerp', instruction: 'Vervang het lijdend of meewerkend voorwerp door een voornaamwoord',
}, [
  [1, 'Lo termino.', 'Ik maak het af (het werk).', 'Lo', 'el trabajo'],
  [2, 'Le explico el problema.', 'Ik leg hem het probleem uit.', 'Le', 'a mi director', { grammarRef: 'gr.meewerkend-voorwerp' }],
  [3, 'Lo miro.', 'Ik bekijk hem (de auto).', 'Lo', 'el coche'],
  [4, 'La canto.', 'Ik zing het (het lied).', 'La', 'la canción'],
  [5, 'Les reservo una habitación.', 'Ik reserveer een kamer voor hen.', 'Les', 'a los turistas', { grammarRef: 'gr.meewerkend-voorwerp' }],
  [6, 'Las leo.', 'Ik lees ze (de brieven).', 'Las', 'las cartas'],
  [7, 'Les pido una aspirina.', 'Ik vraag hun een aspirine.', 'Les', 'a las enfermeras', { grammarRef: 'gr.meewerkend-voorwerp' }],
  [8, 'Las veo.', 'Ik zie ze (mijn vriendinnen).', 'Las', 'a mis amigas'],
  [9, 'Los visito.', 'Ik bezoek u (meervoud).', 'Los', 'a ustedes', { alt: ['Las'] }],
  [10, 'Le compro un coche.', 'Ik koop een auto van u.', 'Le', 'a usted', { grammarRef: 'gr.meewerkend-voorwerp' }],
]);

const COMBINATIE = {
  theme: 'gr-voorwerp', src: CM('191449929'), grammarRef: 'gr.combinatie-voornaamwoorden',
  instruction: 'Vervang beide voorwerpen door voornaamwoorden (meewerkend + lijdend)',
};

const combinatie = [
  ...drill({ ...COMBINATIE, slug: 'combinatie-1' }, [
    [1, 'Te la canto.', 'Ik zing het voor je.', 'Te la', 'te canto la canción'],
    [2, 'Nos la piden.', 'Ze vragen ons erom (om de uitleg).', 'Nos la', 'nos piden la explicación'],
    [3, 'Os lo mando por correo.', 'Ik stuur het jullie met de post.', 'Os lo', 'os mando el paquete por correo'],
    [4, '¿Me la apuntas?', 'Schrijf je het voor me op?', 'Me la', 'me apuntas la dirección del hotel'],
    [5, 'Te lo vendo por 15 euros.', 'Ik verkoop het je voor 15 euro.', 'Te lo', 'te vendo el libro por 15 euros'],
    [6, 'Nos la han prometido.', 'Ze hebben ze ons beloofd (de beloning).', 'Nos la', 'nos han prometido la recompensa'],
    [7, 'Os las ofrecemos.', 'We bieden ze jullie aan.', 'Os las', 'os ofrecemos las flores'],
    [8, '¿Me los compras?', 'Koop je ze voor me?', 'Me los', 'me compras los tomates'],
  ]),
  ...drill({ ...COMBINATIE, slug: 'combinatie-2', instruction: 'Vervang beide voorwerpen door voornaamwoorden (le/les wordt se)' }, [
    [1, 'Se lo compro.', 'Ik koop het voor hem.', 'Se lo', 'compro el libro a mi compañero'],
    [2, 'Se la hago.', 'Ik stel hem die vraag.', 'Se la', 'hago la pregunta al profesor'],
    [3, 'Se lo cambio.', 'Ik wissel het voor hen.', 'Se lo', 'cambio el dinero a los turistas'],
    [4, 'Se los doy.', 'Ik geef ze aan haar.', 'Se los', 'doy los libros a mi madre'],
    [5, 'Se la pregunto.', 'Ik vraag het aan hem.', 'Se la', 'pregunto la hora a un transeúnte'],
    [6, 'Se la cuento.', 'Ik vertel het hem.', 'Se la', 'cuento la anécdota a mi amigo'],
    [7, 'Se lo pido.', 'Ik vraag het aan hem.', 'Se lo', 'pido el dinero a mi padre'],
    [8, 'Se la traduzco.', 'Ik vertaal die (de zin) voor hem.', 'Se la', 'traduzco la frase al extranjero'],
  ]),
  ...drill({ ...COMBINATIE, slug: 'combinatie-3' }, [
    [1, 'Se los limpio.', 'Ik poets ze voor hen.', 'Se los', 'limpio los zapatos a mis hijos'],
    [2, 'Hoy me la pongo.', 'Vandaag doe ik hem aan (de nieuwe das).', 'me la', 'hoy me pongo la corbata nueva'],
    [3, '¿Te lo arregla?', 'Herstelt hij hem voor je (de auto)?', 'Te lo', 'te arregla el coche'],
    [4, 'Se la escribo.', 'Ik schrijf die (de brief) aan hen.', 'Se la', 'escribo esta carta a los abuelos'],
    [5, 'Nos las regalan.', 'Ze geven ze ons cadeau.', 'Nos las', 'nos regalan estas flores'],
    [6, 'Se las dicto.', 'Ik dicteer ze aan hen.', 'Se las', 'dicto las cartas a las secretarias'],
    [7, 'Me los lavo con dentífrico.', 'Ik poets ze met tandpasta.', 'Me los', 'me lavo los dientes con dentífrico'],
    [8, 'Se la repito.', 'Ik herhaal die (de uitleg) voor hen.', 'Se la', 'repito la explicación a los estudiantes'],
  ]),
];

/* ------------------------------------------------------------------ */
/* Perfecto of gerundio? Vertaaloefening (blz. 55)                      */

const GERUNDIO = { theme: 'gr-zin-gerundio', grammarRef: 'gr.gerundio' };
const PERF = { theme: 'gr-zin-perfecto', grammarRef: 'gr.perfecto' };

const vertaal = drill({
  slug: 'perfecto-gerundio', src: CM('191348739'),
  instruction: 'Vertaal: estar + gerundio (bezig zijn) of pretérito perfecto (voltooid)',
}, [
  [1, 'Estoy leyendo.', 'Ik ben aan het lezen.', 'Estoy leyendo', 'leer, yo', GERUNDIO],
  [2, 'He olvidado.', 'Ik ben vergeten.', 'He olvidado', 'olvidar, yo', PERF],
  [3, 'Estás escribiendo.', 'Jij bent aan het schrijven.', 'Estás escribiendo', 'escribir, tú', GERUNDIO],
  [4, 'Has comido.', 'Jij hebt gegeten.', 'Has comido', 'comer, tú', PERF],
  [5, 'Está viajando.', 'Hij is aan het reizen.', 'Está viajando', 'viajar, él', GERUNDIO],
  [6, 'Ha comprendido.', 'Hij heeft begrepen.', 'Ha comprendido', 'comprender, él', PERF],
  [7, 'Estamos preguntando.', 'Wij zijn aan het vragen.', 'Estamos preguntando', 'preguntar, nosotros', GERUNDIO],
  [8, 'Hemos caminado.', 'Wij hebben gewandeld.', 'Hemos caminado', 'caminar, nosotros', PERF],
  [9, 'Estáis vendiendo.', 'Jullie zijn aan het verkopen.', 'Estáis vendiendo', 'vender, vosotros', GERUNDIO],
  [10, 'Habéis bebido.', 'Jullie hebben gedronken.', 'Habéis bebido', 'beber, vosotros', PERF],
  [11, 'Están bailando.', 'Zij zijn aan het dansen.', 'Están bailando', 'bailar, ellos', GERUNDIO],
  [12, 'Han tomado.', 'Zij hebben genomen.', 'Han tomado', 'tomar, ellos', PERF],
  [13, 'He leído.', 'Ik heb gelezen.', 'He leído', 'leer, yo', PERF],
  [14, 'Estás comiendo.', 'Jij bent aan het eten.', 'Estás comiendo', 'comer, tú', GERUNDIO],
  [15, 'Ha vendido.', 'Hij heeft verkocht.', 'Ha vendido', 'vender, él', PERF],
  [16, 'Estamos bebiendo.', 'Wij zijn aan het drinken.', 'Estamos bebiendo', 'beber, nosotros', GERUNDIO],
  [17, 'Habéis preguntado.', 'Jullie hebben gevraagd.', 'Habéis preguntado', 'preguntar, vosotros', PERF],
  [18, 'Están caminando.', 'Zij zijn aan het wandelen.', 'Están caminando', 'caminar, ellos', GERUNDIO],
  [19, 'He bailado.', 'Ik heb gedanst.', 'He bailado', 'bailar, yo', PERF],
  [20, 'Estás trabajando.', 'Jij bent aan het werken.', 'Estás trabajando', 'trabajar, tú', GERUNDIO],
]);

/* ------------------------------------------------------------------ */
/* Ser of estar (blz. 14)                                              */

const SER_ESTAR = ['es', 'está'];
const SON_ESTAN = ['son', 'están'];

const serEstar = drill({
  slug: 'ser-estar', theme: 'ser-estar', src: CM('191014793'),
  grammarRef: 'gr.ser-estar', instruction: 'Ser of estar?',
}, [
  [1, 'La mesa es cuadrada.', 'De tafel is vierkant.', 'es', null, { options: SER_ESTAR }],
  [2, 'La mesa está sucia.', 'De tafel is vuil.', 'está', null, { options: SER_ESTAR }],
  [3, 'Juan es médico.', 'Juan is dokter.', 'es', null, { options: SER_ESTAR }],
  [4, 'Juan está en la cama.', 'Juan ligt in bed.', 'está', null, { options: SER_ESTAR }],
  [5, 'Madrid es la capital de España.', 'Madrid is de hoofdstad van Spanje.', 'es', null, { options: SER_ESTAR }],
  [6, 'Madrid está en el centro de España.', 'Madrid ligt in het midden van Spanje.', 'está', null, { options: SER_ESTAR }],
  [7, 'La habitación es grande.', 'De kamer is groot.', 'es', null, { options: SER_ESTAR }],
  [8, 'La habitación está desordenada.', 'De kamer is rommelig.', 'está', null, { options: SER_ESTAR }],
  [9, 'Este niño es muy simpático.', 'Dit kind is heel vriendelijk.', 'es', null, { options: SER_ESTAR }],
  [10, 'Este niño está enfadado.', 'Dit kind is boos.', 'está', null, { options: SER_ESTAR }],
  [11, 'Ese bar es muy barato.', 'Die bar is heel goedkoop.', 'es', null, { options: SER_ESTAR }],
  [12, 'Aquel bar está abierto.', 'Die bar daarginds is open.', 'está', null, { options: SER_ESTAR }],
  [13, 'Peter y Mary son de Inglaterra.', 'Peter en Mary komen uit Engeland.', 'son', null, { options: SON_ESTAN }],
  [14, 'Pedro y Consuelo están en Inglaterra.', 'Pedro en Consuelo zijn in Engeland.', 'están', null, { options: SON_ESTAN }],
  [15, 'Mi coche es pequeño.', 'Mijn auto is klein.', 'es', null, { options: SER_ESTAR }],
  [16, 'Mi coche está roto.', 'Mijn auto is kapot.', 'está', null, { options: SER_ESTAR }],
  [17, 'Las ventanas son grandes.', 'De ramen zijn groot.', 'son', null, { options: SON_ESTAN }],
  [18, 'Las ventanas están cerradas.', 'De ramen zijn dicht.', 'están', null, { options: SON_ESTAN }],
  [19, 'Aquella silla está libre.', 'Die stoel daar is vrij.', 'está', null, { options: SER_ESTAR }],
  [20, 'Esta silla es cómoda.', 'Deze stoel is comfortabel.', 'es', null, { options: SER_ESTAR }],
]);

/* ------------------------------------------------------------------ */
/* Eigen zinnen: de gebiedende wijs (uitleg blz. 24–25)                 */

const IMP_REG = CM('191111997');
const IMP_ONR = CM('191117008');

const imperativo = drill({
  slug: 'imperativo', theme: 'gr-imperativo', src: IMP_REG,
  grammarRef: 'gr.imperativo', instruction: 'Vul de gebiedende wijs in',
}, [
  [1, 'Habla más despacio, por favor.', 'Spreek wat trager, alsjeblieft.', 'Habla', 'hablar, tú'],
  [2, 'Abre la ventana, hace mucho calor.', 'Doe het raam open, het is heel warm.', 'Abre', 'abrir, tú'],
  [3, 'Cierra la puerta, hace frío.', 'Doe de deur dicht, het is koud.', 'Cierra', 'cerrar, tú', { note: 'Ook in de gebiedende wijs splitst de klinker: cerrar → cierra.' }],
  [4, 'Ven a mi casa el sábado.', 'Kom zaterdag naar mijn huis.', 'Ven', 'venir, tú', { src: IMP_ONR }],
  [5, 'Haz la maleta esta noche.', 'Pak vanavond je koffer.', 'Haz', 'hacer, tú', { src: IMP_ONR }],
  [6, 'Pon la mesa, por favor.', 'Dek de tafel, alsjeblieft.', 'Pon', 'poner, tú', { src: IMP_ONR }],
  [7, 'Sal de casa temprano, hay mucho tráfico.', 'Vertrek vroeg van huis, er is veel verkeer.', 'Sal', 'salir, tú', { src: IMP_ONR }],
  [8, 'Ten cuidado, el suelo está mojado.', 'Wees voorzichtig, de vloer is nat.', 'Ten', 'tener, tú', { src: IMP_ONR }],
  [9, 'Di la verdad.', 'Zeg de waarheid.', 'Di', 'decir, tú', { src: IMP_ONR }],
  [10, 'Ve al médico si te duele la cabeza.', 'Ga naar de dokter als je hoofdpijn hebt.', 'Ve', 'ir, tú', { src: IMP_ONR }],
  [11, 'Sé puntual: la clase empieza a las siete.', 'Wees op tijd: de les begint om zeven uur.', 'Sé', 'ser, tú', { src: IMP_ONR }],
  [12, 'Hablad en español en clase.', 'Spreek Spaans in de les (tegen jullie).', 'Hablad', 'hablar, vosotros'],
  [13, 'Bebed mucha agua, hace mucho calor.', 'Drink veel water, het is heel warm (tegen jullie).', 'Bebed', 'beber, vosotros'],
  [14, 'Venid a la fiesta el viernes.', 'Kom vrijdag naar het feest (tegen jullie).', 'Venid', 'venir, vosotros', { src: IMP_ONR }],
  [15, 'No comas tanto chocolate.', 'Eet niet zoveel chocolade.', 'comas', 'comer, tú, ontkennend'],
  [16, 'No salgas sin paraguas, va a llover.', 'Ga niet naar buiten zonder paraplu, het gaat regenen.', 'salgas', 'salir, tú, ontkennend', { note: 'Ontkennend = subjuntivo: salgo → no salgas.' }],
  [17, 'No hagas ruido, el bebé está durmiendo.', 'Maak geen lawaai, de baby slaapt.', 'hagas', 'hacer, tú, ontkennend', { note: 'Ontkennend = subjuntivo: hago → no hagas.' }],
  [18, 'No habléis tan alto en la biblioteca.', 'Praat niet zo luid in de bibliotheek (tegen jullie).', 'habléis', 'hablar, vosotros, ontkennend'],
  [19, 'No abráis la ventana, hace frío.', 'Doe het raam niet open, het is koud (tegen jullie).', 'abráis', 'abrir, vosotros, ontkennend'],
  [20, 'No vayáis a la playa hoy, hace mal tiempo.', 'Ga vandaag niet naar het strand, het is slecht weer (tegen jullie).', 'vayáis', 'ir, vosotros, ontkennend', { src: CM('191121842') }],
]);

/* ------------------------------------------------------------------ */
/* Eigen zinnen: hace, desde hace, desde (uitleg blz. 53)              */

const HACE = ['hace', 'desde hace', 'desde'];
const HACE_CAP = ['Hace', 'Desde hace', 'Desde'];

const desdeHace = drill({
  slug: 'desde-hace', theme: 'gr-desde-hace', src: CM('191337457'),
  grammarRef: 'gr.desde-hace', instruction: 'Kies hace (geleden), desde hace (sinds, duurt nog) of desde (vanaf een tijdstip)',
}, [
  [1, 'Visité Granada hace cinco años.', 'Ik bezocht Granada vijf jaar geleden.', 'hace', null, { options: HACE }],
  [2, 'Fuimos al lago hace tres meses.', 'We gingen drie maanden geleden naar het meer.', 'hace', null, { options: HACE }],
  [3, 'Estuve en Bruselas hace dos días.', 'Ik was twee dagen geleden in Brussel.', 'hace', null, { options: HACE }],
  [4, 'Compré estos zapatos hace una semana.', 'Ik heb deze schoenen een week geleden gekocht.', 'hace', null, { options: HACE }],
  [5, 'Llegamos al hotel hace dos horas.', 'We kwamen twee uur geleden in het hotel aan.', 'hace', null, { options: HACE }],
  [6, 'Somos amigos desde hace cinco años.', 'We zijn al vijf jaar vrienden.', 'desde hace', null, { options: HACE }],
  [7, 'Desde hace tres meses vivo en Amberes.', 'Sinds drie maanden woon ik in Antwerpen.', 'Desde hace', null, { options: HACE_CAP }],
  [8, 'Tengo dolor de cabeza desde hace dos días.', 'Ik heb al twee dagen hoofdpijn.', 'desde hace', null, { options: HACE }],
  [9, 'Llueve desde hace tres días.', 'Het regent al drie dagen.', 'desde hace', null, { options: HACE }],
  [10, 'Juego al tenis desde hace diez años.', 'Ik tennis al tien jaar.', 'desde hace', null, { options: HACE }],
  [11, 'Esperamos el autobús desde hace media hora.', 'We wachten al een halfuur op de bus.', 'desde hace', null, { options: HACE }],
  [12, 'Desde el lunes tengo mi nuevo coche.', 'Sinds maandag heb ik mijn nieuwe auto.', 'Desde', null, { options: HACE_CAP }],
  [13, 'Desde abril conozco a mi novia.', 'Sinds april ken ik mijn vriendin.', 'Desde', null, { options: HACE_CAP }],
  [14, 'Trabajo en esta tienda desde 2019.', 'Ik werk sinds 2019 in deze winkel.', 'desde', null, { options: HACE }],
  [15, 'No como carne desde enero.', 'Ik eet sinds januari geen vlees.', 'desde', null, { options: HACE }],
  [16, 'Mi hermano está enfermo desde el sábado.', 'Mijn broer is ziek sinds zaterdag.', 'desde', null, { options: HACE }],
]);

/* ------------------------------------------------------------------ */
/* Eigen zinnen: estar + gerundio (uitleg blz. 12)                      */

const gerundio = drill({
  slug: 'gerundio', theme: 'gr-zin-gerundio', src: CM('191004215'),
  grammarRef: 'gr.gerundio', instruction: 'Vul estar + gerundio in (nu bezig)',
}, [
  [1, 'Ahora está lloviendo mucho en Madrid.', 'Nu regent het hard in Madrid.', 'está lloviendo', 'llover'],
  [2, 'Los niños están durmiendo en su habitación.', 'De kinderen liggen te slapen in hun kamer.', 'están durmiendo', 'dormir, ellos', { note: 'dormir → durmiendo' }],
  [3, 'Estoy leyendo una revista en el sofá.', 'Ik zit in de zetel een tijdschrift te lezen.', 'Estoy leyendo', 'leer, yo', { note: 'leer → leyendo' }],
  [4, 'Mi madre está preparando la cena en la cocina.', 'Mijn moeder is in de keuken het avondeten aan het klaarmaken.', 'está preparando', 'preparar'],
  [5, 'Estamos comiendo en un restaurante del centro.', 'We zijn aan het eten in een restaurant in het centrum.', 'Estamos comiendo', 'comer, nosotros'],
  [6, '¿Estáis viendo la tele?', 'Zitten jullie tv te kijken?', 'Estáis viendo', 'ver, vosotros'],
  [7, 'Pedro está pidiendo la cuenta al camarero.', 'Pedro vraagt de ober om de rekening.', 'está pidiendo', 'pedir', { note: 'pedir → pidiendo' }],
  [8, 'Estoy escribiendo un correo a mi profesora.', 'Ik ben een mail aan mijn lerares aan het schrijven.', 'Estoy escribiendo', 'escribir, yo'],
  [9, '¿Qué estás diciendo? No te entiendo.', 'Wat zeg je? Ik versta je niet.', 'estás diciendo', 'decir, tú', { note: 'decir → diciendo' }],
  [10, 'Ana está probándose un vestido azul.', 'Ana is een blauwe jurk aan het passen.', 'está probándose', 'probarse', { alt: ['se está probando'], note: 'Het voornaamwoord hangt achter de gerundio (met accent) of staat vóór estar.' }],
  [11, 'Estamos esperando el autobús en la parada.', 'We staan aan de halte op de bus te wachten.', 'Estamos esperando', 'esperar, nosotros'],
  [12, 'Hace sol y los chicos están jugando en la playa.', 'De zon schijnt en de jongens zijn op het strand aan het spelen.', 'están jugando', 'jugar, ellos'],
  [13, 'Estoy aprendiendo a nadar.', 'Ik ben aan het leren zwemmen.', 'Estoy aprendiendo', 'aprender, yo'],
  [14, 'El tren está llegando a la estación.', 'De trein komt het station binnen.', 'está llegando', 'llegar'],
  [15, '¿Estás oyendo la música de los vecinos?', 'Hoor je de muziek van de buren?', 'Estás oyendo', 'oír, tú', { note: 'oír → oyendo' }],
  [16, 'El camarero está trayendo las bebidas.', 'De ober is de drankjes aan het brengen.', 'está trayendo', 'traer', { note: 'traer → trayendo' }],
  [17, 'Me duele la espalda porque estoy trabajando demasiado.', 'Mijn rug doet pijn omdat ik te veel aan het werken ben.', 'estoy trabajando', 'trabajar, yo'],
  [18, 'Estoy buscando unos zapatos negros.', 'Ik ben op zoek naar zwarte schoenen.', 'Estoy buscando', 'buscar, yo'],
]);

/* ------------------------------------------------------------------ */
/* Eigen zinnen: ir a + infinitief (uitleg blz. 11, modellen gr 1 en 3)  */

const irA = drill({
  slug: 'ir-a', theme: 'gr-zin-presente', src: CM('190958340'),
  grammarRef: 'gr.ir-a', instruction: 'Vul ir a + infinitief in (nabije toekomst)',
}, [
  [1, 'Mañana voy a hablar mucho.', 'Morgen ga ik veel praten.', 'voy a hablar', 'hablar, yo', { src: CM('190807820') }],
  [2, 'Mañana voy a ir a la playa.', 'Morgen ga ik naar het strand.', 'voy a ir', 'ir, yo', { src: CM('190821728') }],
  [3, 'Esta noche vamos a cenar en un restaurante italiano.', 'Vanavond gaan we in een Italiaans restaurant eten.', 'vamos a cenar', 'cenar, nosotros'],
  [4, 'El sábado Ana va a comprar un vestido nuevo.', 'Zaterdag gaat Ana een nieuwe jurk kopen.', 'va a comprar', 'comprar'],
  [5, '¿Qué vais a hacer este fin de semana?', 'Wat gaan jullie dit weekend doen?', 'vais a hacer', 'hacer, vosotros'],
  [6, 'Mira las nubes: va a llover.', 'Kijk naar de wolken: het gaat regenen.', 'va a llover', 'llover'],
  [7, 'Este verano mis padres van a viajar a México.', 'Deze zomer gaan mijn ouders naar Mexico reizen.', 'van a viajar', 'viajar'],
  [8, 'Mañana voy a levantarme a las seis.', 'Morgen ga ik om zes uur opstaan.', 'voy a levantarme', 'levantarse, yo', { alt: ['me voy a levantar'] }],
  [9, '¿Vas a venir a la fiesta?', 'Kom je naar het feest?', 'Vas a venir', 'venir, tú'],
  [10, 'Tengo hambre: voy a preparar un bocadillo.', 'Ik heb honger: ik ga een broodje maken.', 'voy a preparar', 'preparar, yo'],
  [11, 'Esta tarde Pedro va a ir al médico porque le duele la garganta.', 'Vanmiddag gaat Pedro naar de dokter, want hij heeft keelpijn.', 'va a ir', 'ir'],
  [12, 'Hace frío: voy a ponerme el abrigo.', 'Het is koud: ik ga mijn jas aandoen.', 'voy a ponerme', 'ponerse, yo', { alt: ['me voy a poner'] }],
  [13, '¿Vais a alquilar un piso en el centro?', 'Gaan jullie een appartement in het centrum huren?', 'Vais a alquilar', 'alquilar, vosotros'],
  [14, 'Mañana no vamos a trabajar: es fiesta.', 'Morgen gaan we niet werken: het is een feestdag.', 'vamos a trabajar', 'trabajar, nosotros'],
  [15, 'Los niños van a jugar en el parque.', 'De kinderen gaan in het park spelen.', 'van a jugar', 'jugar'],
  [16, '¿A qué hora vas a volver a casa?', 'Hoe laat kom je naar huis?', 'vas a volver', 'volver, tú'],
  [17, 'El lunes voy a empezar un curso de cocina.', 'Maandag begin ik aan een kookcursus.', 'voy a empezar', 'empezar, yo'],
]);

export default {
  atoms: [
    ...indefinidoAr,
    ...indefinidoEr,
    ...indefinidoIr,
    ...indefinidoVormen,
    ...imperfectoVormen,
    ...imperfectoZinnen,
    ...tijden,
    ...futuro,
    ...condicional,
    ...apocope,
    ...mente,
    ...bezittelijk,
    ...onbepaald,
    ...cod,
    ...coi,
    ...codCoi,
    ...combinatie,
    ...vertaal,
    ...serEstar,
    ...imperativo,
    ...desdeHace,
    ...gerundio,
    ...irA,
  ],
};
