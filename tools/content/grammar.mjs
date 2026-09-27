/* Grammatica-uitleg: verschijnt onder een fout antwoord, bij elk atoom met
 * een grammarRef, en bij vervoegingen volgens hun tijd (zie data.js).
 *
 * Eigen, korte uitleg in het Nederlands — geen overgetypte boektekst. `ref`
 * verwijst naar de paragraaf in de grammatica achteraan het boek (Gramática
 * sistemática); leeg als het boek er geen paragraaf over heeft. De uitleg
 * volgt die grammatica en de cursus grammatica van de lesgever. */

export default {
  grammar: {
    'gr.presente': {
      title: 'Presente: de tegenwoordige tijd',
      ref: '6.1.1',
      body: 'Haal -ar, -er of -ir van de infinitief en zet de uitgang van de persoon erachter.\n'
        + '• -ar: -o, -as, -a, -amos, -áis, -an\n'
        + '• -er: -o, -es, -e, -emos, -éis, -en\n'
        + '• -ir: -o, -es, -e, -imos, -ís, -en\n'
        + 'Hablo español. — Ik spreek Spaans.\n'
        + '¿Comes carne? — Eet jij vlees?\n'
        + 'Vivimos en Gante. — Wij wonen in Gent.',
    },
    'gr.klankverandering': {
      title: 'Klankveranderende werkwoorden (e → ie, o → ue, e → i)',
      ref: '6.1.2',
      body: 'Bij sommige werkwoorden verandert de beklemtoonde klinker van de stam: e → ie, o → ue of e → i (en jugar: u → ue). '
        + 'Dat gebeurt in alle personen behalve nosotros en vosotros. De uitgangen blijven regelmatig.\n'
        + '• pensar: pienso, piensas, piensa, pensamos, pensáis, piensan\n'
        + '• poder: puedo, puedes … podemos\n'
        + '• pedir: pido, pides … pedimos\n'
        + '¿Cuánto cuesta? — Hoeveel kost het?\n'
        + 'Jugamos al tenis. — Wij tennissen.',
    },
    'gr.onregelmatig-yo': {
      title: 'Onregelmatige yo-vorm (tengo, hago, conozco)',
      ref: '6.1.2',
      body: 'Sommige werkwoorden zijn alleen in de ik-vorm onregelmatig; de andere personen zijn gewoon.\n'
        + '• hacer → hago, poner → pongo, salir → salgo, traer → traigo, ver → veo, dar → doy, saber → sé\n'
        + '• op -cer/-cir: conocer → conozco, conducir → conduzco\n'
        + '• met ook een stamverandering: tener → tengo, tienes; venir → vengo, vienes; decir → digo, dices\n'
        + 'Salgo a las ocho. — Ik vertrek om acht uur.\n'
        + 'No conozco a tu hermano. — Ik ken je broer niet.',
    },
    'gr.wederkerend': {
      title: 'Wederkerende werkwoorden',
      ref: '6.1.3',
      body: 'Een wederkerend werkwoord (infinitief op -se) krijgt een voornaamwoord dat bij het onderwerp past: me, te, se, nos, os, se. '
        + 'Het staat vóór het vervoegde werkwoord, of hangt achter een infinitief of gerundio.\n'
        + 'Niet elk Spaans wederkerend werkwoord is dat ook in het Nederlands: levantarse = opstaan.\n'
        + 'Me levanto a las siete. — Ik sta om zeven uur op.\n'
        + '¿Cómo te llamas? — Hoe heet je?\n'
        + 'Vamos a ducharnos. / Nos vamos a duchar. — We gaan douchen.',
    },
    'gr.persoonlijke-a': {
      title: 'De persoonlijke a',
      ref: '1.1',
      body: 'Is het lijdend voorwerp een bepaalde persoon, dan zet je er a voor. Die a vertaal je niet in het Nederlands. '
        + 'Bij zaken, bij een willekeurige persoon en na tener komt er geen a.\n'
        + 'Veo a Juan. — Ik zie Juan.\n'
        + 'Busco a Isabel. — Ik zoek Isabel. (maar: Buscamos una secretaria.)\n'
        + 'Conozco este libro. — Ik ken dit boek.\n'
        + 'Tengo dos hermanos. — Ik heb twee broers.',
    },
    'gr.aanwijzend': {
      title: 'Este, ese en aquel',
      ref: '5.2',
      body: 'Este (deze, dit) wijst iets aan dicht bij wie spreekt, ese (die, dat) iets dicht bij wie luistert, aquel iets dat verder weg is. '
        + 'Ze passen zich aan het zelfstandig naamwoord aan.\n'
        + '• este, esta, estos, estas\n'
        + '• ese, esa, esos, esas\n'
        + '• aquel, aquella, aquellos, aquellas\n'
        + 'Voor iets zonder naam: esto, eso, aquello.\n'
        + 'Esta falda es bonita. — Deze rok is mooi.\n'
        + '¿Qué es eso? — Wat is dat?',
    },
    'gr.bezittelijk': {
      title: 'Bezittelijke voornaamwoorden',
      ref: '',
      body: 'Vóór een zelfstandig naamwoord: mi, tu, su, nuestro/-a, vuestro/-a, su, met -s in het meervoud. Su betekent zijn, haar, uw of hun.\n'
        + 'Zonder zelfstandig naamwoord, of na ser, gebruik je de beklemtoonde vorm: mío, tuyo, suyo, nuestro, vuestro, suyo (+ -a, -os, -as).\n'
        + 'mis amigos — mijn vrienden\n'
        + 'nuestra casa — ons huis\n'
        + '¿Es tuyo este libro? — Sí, es mío. — Is dit boek van jou? Ja, het is van mij.',
    },
    'gr.lijdend-voorwerp': {
      title: 'Lijdend voorwerp: lo, la, los, las',
      ref: '5.1',
      body: 'Het lijdend voorwerp (wie of wat?) wordt me, te, nos, os of, in de 3e persoon, lo, la, los, las: volgens geslacht en getal, voor personen en zaken. '
        + 'Het staat vóór het vervoegde werkwoord; achter een infinitief of gerundio mag het eraan vastgeschreven worden.\n'
        + '¿El periódico? Lo leo. — De krant? Ik lees hem.\n'
        + 'Veo a Carmen. → La veo. — Ik zie haar.\n'
        + '¿Las gafas? Voy a comprarlas. — De bril? Ik ga hem kopen.',
    },
    'gr.meewerkend-voorwerp': {
      title: 'Meewerkend voorwerp: le, les',
      ref: '5.1',
      body: 'Het meewerkend voorwerp (aan wie?) wordt me, te, nos, os of, in de 3e persoon, le (enkelvoud) en les (meervoud), voor mannen en vrouwen. '
        + 'Vaak staat le of les er ook als de persoon zelf al genoemd wordt.\n'
        + 'Le doy el libro a Juan. — Ik geef Juan het boek.\n'
        + 'Les escribo un correo. — Ik schrijf hun een mail.\n'
        + '¿Qué le gusta a tu padre? — Wat vindt je vader leuk?',
    },
    'gr.combinatie-voornaamwoorden': {
      title: 'Twee voornaamwoorden samen: se lo, me la',
      ref: '5.1.1',
      body: 'Staan er twee voornaamwoorden samen, dan komt eerst het meewerkend (aan wie?), dan het lijdend voorwerp (wat?): me lo, te la, nos los … '
        + 'Le en les worden se vóór lo, la, los of las.\n'
        + 'Achter een infinitief hangen ze samen aan het werkwoord, met een accent om de klemtoon te bewaren.\n'
        + 'Pepe me lo da. — Pepe geeft het mij.\n'
        + '¿El bolso? Se lo compro a Eva. — De tas? Ik koop hem voor Eva.\n'
        + '¿Puedo probármelo? — Mag ik het passen?',
    },
    'gr.ser-estar': {
      title: 'Ser of estar?',
      ref: '6.1.4',
      body: 'Ser zegt wat iets of iemand is: naam, afkomst, beroep, vaste eigenschappen, kleur en materiaal, uur en datum, bezit, en waar een evenement plaatsvindt.\n'
        + 'Estar zegt waar iets of iemand zich bevindt, en hoe het nu gaat: een toestand of gevoel.\n'
        + 'Juan es médico. Es de Madrid. — Juan is dokter. Hij is van Madrid.\n'
        + 'Juan está en la cama. Está cansado. — Juan ligt in bed. Hij is moe.\n'
        + 'La sopa está rica. — De soep is lekker.',
    },
    'gr.hay-estar': {
      title: 'Hay of está?',
      ref: '',
      body: 'Hay (er is, er zijn) zegt dát iets ergens is: meestal met un/una, een getal, mucho of zonder lidwoord. Hay blijft altijd hetzelfde, ook in het meervoud.\n'
        + 'Está / están zegt wáár een bepaald, gekend ding is: met el/la, mi, este of een naam.\n'
        + 'En mi calle hay dos bares. — In mijn straat zijn er twee cafés.\n'
        + '¿Hay una farmacia por aquí? — Is er hier een apotheek?\n'
        + 'La farmacia está al lado del banco. — De apotheek is naast de bank.',
    },
    'gr.vergelijken': {
      title: 'Vergelijken: más … que, tan … como',
      ref: '4',
      body: '• más / menos + bijvoeglijk naamwoord + que: meer / minder … dan\n'
        + '• tan + bijvoeglijk naamwoord + como: even … als\n'
        + '• met een getal: más de / menos de\n'
        + '• onregelmatig: bueno → mejor, malo → peor; voor leeftijd mayor en menor\n'
        + 'El hotel es más caro que el albergue. — Het hotel is duurder dan de jeugdherberg.\n'
        + 'Ana es tan alta como yo. — Ana is even groot als ik.\n'
        + 'Pedro es mi hermano mayor. — Pedro is mijn oudere broer.',
    },
    'gr.muy-mucho': {
      title: 'Muy of mucho?',
      ref: '7.5',
      body: 'Muy (heel, erg) staat vóór een bijvoeglijk naamwoord of bijwoord en verandert nooit.\n'
        + 'Mucho (veel) staat bij een werkwoord, dan verandert het niet, of vóór een zelfstandig naamwoord, dan past het zich aan: mucho, mucha, muchos, muchas.\n'
        + 'Es muy simpático. — Hij is heel sympathiek.\n'
        + 'Trabajas mucho. — Jij werkt veel.\n'
        + 'Hay muchas personas. — Er zijn veel mensen.',
    },
    'gr.ir-a': {
      title: 'Ir a + infinitief: de nabije toekomst',
      ref: '6.3',
      body: 'Plannen en wat binnenkort gebeurt, zeg je met ir (voy, vas, va, vamos, vais, van) + a + infinitief. '
        + 'Alleen ir wordt vervoegd; het tweede werkwoord blijft een infinitief.\n'
        + 'Voy a jugar al tenis. — Ik ga tennissen.\n'
        + '¿Qué vas a hacer el sábado? — Wat ga je zaterdag doen?\n'
        + 'Vamos a levantarnos pronto. — We gaan vroeg opstaan.',
    },
    'gr.gerundio': {
      title: 'Estar + gerundio: ergens mee bezig zijn',
      ref: '6.2',
      body: 'Wat nu aan de gang is, zeg je met estar + gerundio. Het gerundio eindigt op -ando (-ar) of -iendo (-er, -ir).\n'
        + 'Onregelmatig: decir → diciendo, pedir → pidiendo, venir → viniendo, dormir → durmiendo, leer → leyendo, ir → yendo.\n'
        + 'Estoy escuchando música. — Ik ben naar muziek aan het luisteren.\n'
        + '¿Qué estás haciendo? — Wat ben je aan het doen?\n'
        + 'Paula está duchándose. — Paula staat onder de douche.',
    },
    'gr.indefinido': {
      title: 'Pretérito indefinido',
      ref: '6.6',
      body: 'Een afgesloten handeling op een voorbij moment (ayer, el año pasado, en 2010, hace dos días).\n'
        + '• -ar: -é, -aste, -ó, -amos, -asteis, -aron\n'
        + '• -er/-ir: -í, -iste, -ió, -imos, -isteis, -ieron\n'
        + 'Spelling in de ik-vorm: busqué, pagué, empecé. -ir-werkwoorden met stamverandering veranderen in de 3e persoon: pidió, durmieron.\n'
        + 'Ayer trabajé mucho. — Gisteren werkte ik veel.\n'
        + 'Vivieron dos años en Perú. — Ze woonden twee jaar in Peru.',
    },
    'gr.indefinido-onregelmatig': {
      title: 'Onregelmatige indefinido (tuve, hice, fui)',
      ref: '6.6.2',
      body: 'Een eigen stam met de uitgangen -e, -iste, -o, -imos, -isteis, -ieron, zonder accent:\n'
        + '• tener → tuve, estar → estuve, poder → pude, poner → puse, saber → supe, querer → quise, venir → vine\n'
        + '• hacer → hice (hizo), decir → dije (dijeron), traer → traje (trajeron)\n'
        + '• ser en ir: fui, fuiste, fue, fuimos, fuisteis, fueron; dar: di, dio; ver: vi, vio\n'
        + 'Ayer tuve mucho trabajo. — Gisteren had ik veel werk.\n'
        + '¿Qué hiciste? — Fui al cine. — Wat deed je? Ik ging naar de film.',
    },
    'gr.imperfecto': {
      title: 'Pretérito imperfecto',
      ref: '6.7',
      body: 'Beschrijvingen en gewoontes in het verleden (antes, siempre, todos los días, mientras).\n'
        + '• -ar: -aba, -abas, -aba, -ábamos, -abais, -aban\n'
        + '• -er/-ir: -ía, -ías, -ía, -íamos, -íais, -ían\n'
        + 'Alleen ser (era), ir (iba) en ver (veía) zijn onregelmatig. Hay wordt había.\n'
        + 'Antes vivíamos en Brujas. — Vroeger woonden we in Brugge.\n'
        + 'De niño jugaba en la calle. — Als kind speelde ik op straat.\n'
        + 'La casa era muy grande. — Het huis was heel groot.',
    },
    'gr.indefinido-imperfecto': {
      title: 'Indefinido of imperfecto?',
      ref: '6.8',
      body: 'In een verhaal schetst het imperfecto de achtergrond: hoe iets was, wat aan de gang was, wat gewoonte was. '
        + 'Het indefinido vertelt wat er gebeurde: de feiten die het verhaal vooruit helpen.\n'
        + 'Mientras comíamos, sonó el teléfono. — Terwijl we aan het eten waren, ging de telefoon.\n'
        + 'Como no tenía tiempo, tomé un taxi. — Omdat ik geen tijd had, nam ik een taxi.\n'
        + 'Hacía sol y fuimos a la playa. — Het was zonnig en we gingen naar het strand.',
    },
    'gr.perfecto': {
      title: 'Pretérito perfecto',
      ref: '6.5',
      body: 'Haber (he, has, ha, hemos, habéis, han) + voltooid deelwoord op -ado (-ar) of -ido (-er, -ir). Het deelwoord verandert nooit en blijft vlak na haber.\n'
        + 'Onregelmatig: abrir → abierto, decir → dicho, escribir → escrito, hacer → hecho, poner → puesto, ver → visto, volver → vuelto, romper → roto.\n'
        + 'Hoy he comido paella. — Vandaag heb ik paella gegeten.\n'
        + '¿Has visto a Ana? — Heb je Ana gezien?\n'
        + 'No me he duchado. — Ik heb niet gedoucht.',
    },
    'gr.perfecto-indefinido': {
      title: 'Perfecto of indefinido?',
      ref: '6.5.2 en 6.6.3',
      body: 'Perfecto: de periode loopt nog (hoy, esta mañana, esta semana, este año), of het moment doet er niet toe (ya, todavía no, nunca, alguna vez).\n'
        + 'Indefinido: het moment is voorbij, vóór vandaag (ayer, anoche, la semana pasada, el año pasado, hace dos años).\n'
        + 'Esta semana he trabajado mucho. — Deze week heb ik veel gewerkt.\n'
        + 'La semana pasada trabajé mucho. — Vorige week werkte ik veel.\n'
        + '¿Has estado alguna vez en Chile? — Ben je al eens in Chili geweest?',
    },
    'gr.futuro': {
      title: 'Futuro simple',
      ref: '',
      body: 'Zet achter de hele infinitief: -é, -ás, -á, -emos, -éis, -án (voor -ar, -er en -ir dezelfde).\n'
        + 'Onregelmatige stam, zelfde uitgangen: hacer → haré, decir → diré, tener → tendré, poner → pondré, salir → saldré, venir → vendré, poder → podré, saber → sabré, querer → querré.\n'
        + 'Mañana hablaré con él. — Morgen zal ik met hem praten.\n'
        + 'El año que viene iremos a México. — Volgend jaar gaan we naar Mexico.\n'
        + '¿Vendrás a la fiesta? — Kom je naar het feest?',
    },
    'gr.condicional': {
      title: 'Condicional',
      ref: '',
      body: 'De condicional (zou …) krijgt achter de hele infinitief: -ía, -ías, -ía, -íamos, -íais, -ían. '
        + 'Onregelmatige werkwoorden hebben dezelfde stam als in de futuro: haría, diría, tendría, pondría, saldría, vendría, podría, sabría, querría.\n'
        + 'Je gebruikt hem voor wensen, beleefde vragen en raad.\n'
        + 'Me gustaría viajar a Cuba. — Ik zou graag naar Cuba reizen.\n'
        + '¿Podrías ayudarme? — Zou je me kunnen helpen?\n'
        + 'Yo no lo haría. — Ik zou het niet doen.',
    },
    'gr.imperativo': {
      title: 'De gebiedende wijs',
      ref: '',
      body: '• tú: zoals de él-vorm van de presente: habla, come, escribe; onregelmatig: di, haz, ve, pon, sal, ten, ven, sé\n'
        + '• vosotros: infinitief met -d in plaats van -r: hablad, comed\n'
        + '• usted/ustedes: vormen van de subjuntivo: hable, coma, hablen\n'
        + '• verbod: altijd subjuntivo: no hables, no comas\n'
        + 'Voornaamwoorden hangen achter een gebod, maar staan vóór een verbod.\n'
        + '¡Cómpralo! — Koop het!\n'
        + '¡No lo compres! — Koop het niet!',
    },
    'gr.subjuntivo': {
      title: 'Presente de subjuntivo',
      ref: '',
      body: 'Neem de ik-vorm van de presente, laat de -o vallen en wissel de klinker: -ar krijgt -e (hable, hables, hablemos), -er/-ir krijgen -a (coma, viva). '
        + 'Zo ook: tengo → tenga, hago → haga, conozco → conozca. Apart: ser → sea, ir → vaya, estar → esté, saber → sepa, dar → dé.\n'
        + 'Na que bij wensen, gevoelens, es importante que … en no creo que.\n'
        + 'Quiero que vengas. — Ik wil dat je komt.\n'
        + 'Es importante que estudies. — Het is belangrijk dat je studeert.',
    },
    'gr.mente': {
      title: 'Bijwoorden op -mente',
      ref: '7.1',
      body: 'Zet -mente achter de vrouwelijke vorm van het bijvoeglijk naamwoord: rápido → rápidamente, tranquilo → tranquilamente. '
        + 'Zonder aparte vrouwelijke vorm (op -e of een medeklinker) plak je -mente er gewoon achter: normal → normalmente, fácil → fácilmente. Een accent blijft staan.\n'
        + 'Let op: bueno → bien, malo → mal.\n'
        + 'Habla lentamente. — Hij praat traag.\n'
        + 'Normalmente como a las dos. — Normaal eet ik om twee uur.',
    },
    'gr.verkort': {
      title: 'Verkorte vormen: buen, mal, gran, primer',
      ref: '',
      body: 'Vóór een mannelijk enkelvoudig zelfstandig naamwoord valt de -o weg: bueno → buen, malo → mal, primero → primer, tercero → tercer, alguno → algún, ninguno → ningún. '
        + 'Grande wordt gran vóór elk enkelvoudig zelfstandig naamwoord, mannelijk of vrouwelijk.\n'
        + 'Es un buen libro. — Het is een goed boek. (maar: una buena playa)\n'
        + 'Vivo en el primer piso. — Ik woon op de eerste verdieping.\n'
        + 'Madrid es una gran ciudad. — Madrid is een grote stad.',
    },
    'gr.que-cual': {
      title: 'Qué of cuál?',
      ref: '9.1.1',
      body: 'Qué vraagt algemeen naar iets, of staat vóór een zelfstandig naamwoord.\n'
        + 'Cuál / cuáles (welk, welke) kiest uit een gekende groep en staat vóór een werkwoord of vóór de, nooit vóór een zelfstandig naamwoord.\n'
        + '¿Qué has comprado? — Wat heb je gekocht?\n'
        + '¿Qué productos compras? — Welke producten koop je?\n'
        + '¿Cuál es tu color preferido? — Wat is je lievelingskleur?\n'
        + '¿Cuál de las blusas te gusta? — Welke van de bloezen vind je mooi?',
    },
    'gr.desde-hace': {
      title: 'Desde, hace en desde hace',
      ref: '8.3.1',
      body: '• hace + periode = … geleden, het is voorbij\n'
        + '• desde hace + periode = al …, sinds …, het duurt nog\n'
        + '• desde + tijdstip = sinds, vanaf dat beginpunt\n'
        + 'Viví en Madrid hace cinco años. — Vijf jaar geleden woonde ik in Madrid.\n'
        + 'Vivo en Amberes desde hace tres meses. — Ik woon al drie maanden in Antwerpen.\n'
        + 'Trabajo aquí desde 2019. — Ik werk hier sinds 2019.',
    },
    'gr.onbepaald': {
      title: 'Algo, nada, alguien, nadie, alguno, ninguno',
      ref: '5.3',
      body: 'Algo (iets), nada (niets) en todo (alles) gaan over zaken, alguien (iemand) en nadie (niemand) over personen. Ze veranderen niet.\n'
        + 'Alguno (een of ander, enkele) en ninguno (geen enkel) passen zich aan; vóór een mannelijk enkelvoudig woord worden ze algún en ningún.\n'
        + '¿Buscas algo? — No, nada. — Zoek je iets? Nee, niets.\n'
        + '¿Hay alguien en casa? — Is er iemand thuis?\n'
        + '¿Tienes algún libro de cocina? — No, ninguno. — Heb je een kookboek? Nee, geen enkel.',
    },
    'gr.ontkenning': {
      title: 'Ontkennen: no … nunca, no … nada',
      ref: '5.3.2',
      body: 'No staat altijd vóór het vervoegde werkwoord, en vóór voornaamwoorden als me, te, lo.\n'
        + 'Staan nada, nadie, nunca of ninguno achter het werkwoord, dan komt er ook no vóór: die dubbele ontkenning is correct. Staan ze vooraan, dan valt no weg.\n'
        + 'No trabajo en una fábrica. — Ik werk niet in een fabriek.\n'
        + 'No he comprado nada. — Ik heb niets gekocht.\n'
        + 'No viene nunca. / Nunca viene. — Hij komt nooit.',
    },
    'gr.klemtoon': {
      title: 'Klemtoon en accenttekens',
      ref: '',
      body: '• Eindigt een woord op een klinker, -n of -s, dan ligt de klemtoon op de voorlaatste lettergreep: ca-mi-sa, jo-ven, za-pa-tos.\n'
        + '• Eindigt het op een andere medeklinker, dan ligt de klemtoon op de laatste: ha-blar, ciu-dad, pro-fe-sor.\n'
        + '• Wijkt de klemtoon af van die regels, dan schrijf je een accent: ca-fé, lá-piz, te-lé-fo-no.\n'
        + 'Een accent op i of u splitst twee klinkers: dí-a, pa-ís.\n'
        + 'Let op het meervoud: la habitación → las habitaciones, zonder accent.',
    },
  },
};
