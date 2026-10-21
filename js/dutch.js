/* Nederlandse vertaling van een Spaanse vervoeging: "comí" → "ik at".
 *
 * Per Spaans werkwoord staan de stamtijden van het Nederlandse werkwoord met
 * de hand in de tabel; de rest volgt uit regels. Een scheidbaar deel (uit-gaan)
 * staat apart, net als woorden die vóór het werkwoord aan het eind komen
 * ("moe" worden: ik ben moe geworden).
 *
 *   [infinitief, ik-vorm, verleden enkelvoud, verleden meervoud, voltooid deelwoord, opties]
 *   opties: z  = hulpwerkwoord zijn
 *           sep = scheidbaar deel, refl = wederkerend, rest = vaste woorden
 *
 * De subjuntivo heeft geen Nederlandse tegenhanger en krijgt geen vertaling. */

const T = {
  comer: ['eten', 'eet', 'at', 'aten', 'gegeten'],
  decir: ['zeggen', 'zeg', 'zei', 'zeiden', 'gezegd'],
  estar: ['zijn', 'ben', 'was', 'waren', 'geweest', { z: 1 }],
  hablar: ['spreken', 'spreek', 'sprak', 'spraken', 'gesproken'],
  hacer: ['doen', 'doe', 'deed', 'deden', 'gedaan'],
  ir: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { z: 1 }],
  ser: ['zijn', 'ben', 'was', 'waren', 'geweest', { z: 1 }],
  tener: ['hebben', 'heb', 'had', 'hadden', 'gehad'],
  tomar: ['nemen', 'neem', 'nam', 'namen', 'genomen'],
  ver: ['zien', 'zie', 'zag', 'zagen', 'gezien'],
  vivir: ['leven', 'leef', 'leefde', 'leefden', 'geleefd'],
  dar: ['geven', 'geef', 'gaf', 'gaven', 'gegeven'],
  dormir: ['slapen', 'slaap', 'sliep', 'sliepen', 'geslapen'],
  pedir: ['vragen', 'vraag', 'vroeg', 'vroegen', 'gevraagd', { rest: 'om iets' }],
  poder: ['kunnen', 'kan', 'kon', 'konden', 'gekund'],
  poner: ['leggen', 'leg', 'legde', 'legden', 'gelegd'],
  querer: ['willen', 'wil', 'wilde', 'wilden', 'gewild'],
  saber: ['weten', 'weet', 'wist', 'wisten', 'geweten'],
  salir: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { sep: 'uit', z: 1 }],
  traer: ['brengen', 'breng', 'bracht', 'brachten', 'gebracht', { sep: 'mee' }],
  venir: ['komen', 'kom', 'kwam', 'kwamen', 'gekomen', { z: 1 }],
  abrir: ['openen', 'open', 'opende', 'openden', 'geopend'],
  escribir: ['schrijven', 'schrijf', 'schreef', 'schreven', 'geschreven'],
  partir: ['vertrekken', 'vertrek', 'vertrok', 'vertrokken', 'vertrokken', { z: 1 }],
  volver: ['komen', 'kom', 'kwam', 'kwamen', 'gekomen', { sep: 'terug', z: 1 }],
  conocer: ['kennen', 'ken', 'kende', 'kenden', 'gekend'],
  jugar: ['spelen', 'speel', 'speelde', 'speelden', 'gespeeld'],
  oír: ['horen', 'hoor', 'hoorde', 'hoorden', 'gehoord'],
  pensar: ['denken', 'denk', 'dacht', 'dachten', 'gedacht'],
  alquilar: ['huren', 'huur', 'huurde', 'huurden', 'gehuurd'],
  andar: ['lopen', 'loop', 'liep', 'liepen', 'gelopen'],
  apuntar: ['schrijven', 'schrijf', 'schreef', 'schreven', 'geschreven', { sep: 'op' }],
  avanzar: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { sep: 'vooruit', z: 1 }],
  bailar: ['dansen', 'dans', 'danste', 'dansten', 'gedanst'],
  boxear: ['boksen', 'boks', 'bokste', 'boksten', 'gebokst'],
  bucear: ['duiken', 'duik', 'dook', 'doken', 'gedoken'],
  buscar: ['zoeken', 'zoek', 'zocht', 'zochten', 'gezocht'],
  caminar: ['wandelen', 'wandel', 'wandelde', 'wandelden', 'gewandeld'],
  cambiar: ['wisselen', 'wissel', 'wisselde', 'wisselden', 'gewisseld'],
  cantar: ['zingen', 'zing', 'zong', 'zongen', 'gezongen'],
  cenar: ['eten', 'eet', 'at', 'aten', 'gegeten', { rest: "'s avonds" }],
  charlar: ['babbelen', 'babbel', 'babbelde', 'babbelden', 'gebabbeld'],
  cocinar: ['koken', 'kook', 'kookte', 'kookten', 'gekookt'],
  coleccionar: ['verzamelen', 'verzamel', 'verzamelde', 'verzamelden', 'verzameld'],
  comprar: ['kopen', 'koop', 'kocht', 'kochten', 'gekocht'],
  controlar: ['controleren', 'controleer', 'controleerde', 'controleerden', 'gecontroleerd'],
  curar: ['genezen', 'genees', 'genas', 'genazen', 'genezen'],
  declarar: ['verklaren', 'verklaar', 'verklaarde', 'verklaarden', 'verklaard'],
  desayunar: ['ontbijten', 'ontbijt', 'ontbeet', 'ontbeten', 'ontbeten'],
  descansar: ['rusten', 'rust', 'rustte', 'rustten', 'gerust', { sep: 'uit' }],
  dibujar: ['tekenen', 'teken', 'tekende', 'tekenden', 'getekend'],
  durar: ['duren', 'duur', 'duurde', 'duurden', 'geduurd'],
  entrar: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { sep: 'binnen', z: 1 }],
  escalar: ['klimmen', 'klim', 'klom', 'klommen', 'geklommen'],
  escuchar: ['luisteren', 'luister', 'luisterde', 'luisterden', 'geluisterd'],
  esperar: ['wachten', 'wacht', 'wachtte', 'wachtten', 'gewacht'],
  estornudar: ['niezen', 'nies', 'niesde', 'niesden', 'geniesd'],
  estudiar: ['studeren', 'studeer', 'studeerde', 'studeerden', 'gestudeerd'],
  explicar: ['leggen', 'leg', 'legde', 'legden', 'gelegd', { sep: 'uit' }],
  fumar: ['roken', 'rook', 'rookte', 'rookten', 'gerookt'],
  invitar: ['nodigen', 'nodig', 'nodigde', 'nodigden', 'genodigd', { sep: 'uit' }],
  llevar: ['dragen', 'draag', 'droeg', 'droegen', 'gedragen'],
  mirar: ['kijken', 'kijk', 'keek', 'keken', 'gekeken'],
  nadar: ['zwemmen', 'zwem', 'zwom', 'zwommen', 'gezwommen'],
  navegar: ['zeilen', 'zeil', 'zeilde', 'zeilden', 'gezeild'],
  necesitar: ['hebben', 'heb', 'had', 'hadden', 'gehad', { rest: 'het nodig' }],
  olvidar: ['vergeten', 'vergeet', 'vergat', 'vergaten', 'vergeten'],
  pagar: ['betalen', 'betaal', 'betaalde', 'betaalden', 'betaald'],
  pasar: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { sep: 'voorbij', z: 1 }],
  pasear: ['wandelen', 'wandel', 'wandelde', 'wandelden', 'gewandeld'],
  patinar: ['schaatsen', 'schaats', 'schaatste', 'schaatsten', 'geschaatst'],
  pescar: ['vissen', 'vis', 'viste', 'visten', 'gevist'],
  pintar: ['schilderen', 'schilder', 'schilderde', 'schilderden', 'geschilderd'],
  preguntar: ['vragen', 'vraag', 'vroeg', 'vroegen', 'gevraagd'],
  rechazar: ['weigeren', 'weiger', 'weigerde', 'weigerden', 'geweigerd'],
  reservar: ['reserveren', 'reserveer', 'reserveerde', 'reserveerden', 'gereserveerd'],
  respirar: ['ademen', 'adem', 'ademde', 'ademden', 'geademd'],
  restaurar: ['restaureren', 'restaureer', 'restaureerde', 'restaureerden', 'gerestaureerd'],
  sangrar: ['bloeden', 'bloed', 'bloedde', 'bloedden', 'gebloed'],
  señalar: ['wijzen', 'wijs', 'wees', 'wezen', 'gewezen', { sep: 'aan' }],
  telefonear: ['telefoneren', 'telefoneer', 'telefoneerde', 'telefoneerden', 'getelefoneerd'],
  tocar: ['spelen', 'speel', 'speelde', 'speelden', 'gespeeld', { rest: 'muziek' }],
  trabajar: ['werken', 'werk', 'werkte', 'werkten', 'gewerkt'],
  tratar: ['behandelen', 'behandel', 'behandelde', 'behandelden', 'behandeld'],
  valorar: ['waarderen', 'waardeer', 'waardeerde', 'waardeerden', 'gewaardeerd'],
  viajar: ['reizen', 'reis', 'reisde', 'reisden', 'gereisd'],
  vomitar: ['geven', 'geef', 'gaf', 'gaven', 'gegeven', { sep: 'over' }],
  aprender: ['leren', 'leer', 'leerde', 'leerden', 'geleerd'],
  beber: ['drinken', 'drink', 'dronk', 'dronken', 'gedronken'],
  comprender: ['begrijpen', 'begrijp', 'begreep', 'begrepen', 'begrepen'],
  correr: ['rennen', 'ren', 'rende', 'renden', 'gerend'],
  coser: ['naaien', 'naai', 'naaide', 'naaiden', 'genaaid'],
  creer: ['geloven', 'geloof', 'geloofde', 'geloofden', 'geloofd'],
  deber: ['moeten', 'moet', 'moest', 'moesten', 'gemoeten'],
  depender: ['hangen', 'hang', 'hing', 'hingen', 'gehangen', { sep: 'af' }],
  esconder: ['verstoppen', 'verstop', 'verstopte', 'verstopten', 'verstopt'],
  leer: ['lezen', 'lees', 'las', 'lazen', 'gelezen'],
  poseer: ['bezitten', 'bezit', 'bezat', 'bezaten', 'bezeten'],
  prometer: ['beloven', 'beloof', 'beloofde', 'beloofden', 'beloofd'],
  recorrer: ['leggen', 'leg', 'legde', 'legden', 'gelegd', { sep: 'af' }],
  responder: ['antwoorden', 'antwoord', 'antwoordde', 'antwoordden', 'geantwoord'],
  suceder: ['gebeuren', 'gebeur', 'gebeurde', 'gebeurden', 'gebeurd', { z: 1 }],
  temer: ['vrezen', 'vrees', 'vreesde', 'vreesden', 'gevreesd'],
  vender: ['verkopen', 'verkoop', 'verkocht', 'verkochten', 'verkocht'],
  admitir: ['geven', 'geef', 'gaf', 'gaven', 'gegeven', { sep: 'toe' }],
  añadir: ['voegen', 'voeg', 'voegde', 'voegden', 'gevoegd', { sep: 'toe' }],
  aplaudir: ['applaudisseren', 'applaudisseer', 'applaudisseerde', 'applaudisseerden', 'geapplaudisseerd'],
  definir: ['definiëren', 'definieer', 'definieerde', 'definieerden', 'gedefinieerd'],
  interrumpir: ['onderbreken', 'onderbreek', 'onderbrak', 'onderbraken', 'onderbroken'],
  permitir: ['laten', 'laat', 'liet', 'lieten', 'gelaten', { sep: 'toe' }],
  persuadir: ['overtuigen', 'overtuig', 'overtuigde', 'overtuigden', 'overtuigd'],
  recibir: ['ontvangen', 'ontvang', 'ontving', 'ontvingen', 'ontvangen'],
  resistir: ['weerstaan', 'weersta', 'weerstond', 'weerstonden', 'weerstaan'],
  subir: ['stappen', 'stap', 'stapte', 'stapten', 'gestapt', { sep: 'in', z: 1 }],
  sufrir: ['lijden', 'lijd', 'leed', 'leden', 'geleden'],
  llegar: ['komen', 'kom', 'kwam', 'kwamen', 'gekomen', { sep: 'aan', z: 1 }],
  romper: ['breken', 'breek', 'brak', 'braken', 'gebroken'],
  cubrir: ['bedekken', 'bedek', 'bedekte', 'bedekten', 'bedekt'],
  descubrir: ['ontdekken', 'ontdek', 'ontdekte', 'ontdekten', 'ontdekt'],
  cerrar: ['sluiten', 'sluit', 'sloot', 'sloten', 'gesloten'],
  comenzar: ['beginnen', 'begin', 'begon', 'begonnen', 'begonnen', { z: 1 }],
  empezar: ['beginnen', 'begin', 'begon', 'begonnen', 'begonnen', { z: 1 }],
  encender: ['steken', 'steek', 'stak', 'staken', 'gestoken', { sep: 'aan' }],
  entender: ['verstaan', 'versta', 'verstond', 'verstonden', 'verstaan'],
  perder: ['verliezen', 'verlies', 'verloor', 'verloren', 'verloren'],
  preferir: ['verkiezen', 'verkies', 'verkoos', 'verkozen', 'verkozen'],
  recomendar: ['bevelen', 'beveel', 'beval', 'bevalen', 'bevolen', { sep: 'aan' }],
  sentir: ['voelen', 'voel', 'voelde', 'voelden', 'gevoeld'],
  contar: ['tellen', 'tel', 'telde', 'telden', 'geteld'],
  costar: ['kosten', 'kost', 'kostte', 'kostten', 'gekost'],
  encontrar: ['vinden', 'vind', 'vond', 'vonden', 'gevonden'],
  morir: ['sterven', 'sterf', 'stierf', 'stierven', 'gestorven', { z: 1 }],
  mostrar: ['tonen', 'toon', 'toonde', 'toonden', 'getoond'],
  probar: ['proberen', 'probeer', 'probeerde', 'probeerden', 'geprobeerd'],
  repetir: ['herhalen', 'herhaal', 'herhaalde', 'herhaalden', 'herhaald'],
  servir: ['bedienen', 'bedien', 'bediende', 'bedienden', 'bediend'],
  vestir: ['kleden', 'kleed', 'kleedde', 'kleedden', 'gekleed'],
  almorzar: ['lunchen', 'lunch', 'lunchte', 'lunchten', 'geluncht'],
  resolver: ['lossen', 'los', 'loste', 'losten', 'gelost', { sep: 'op' }],
  conducir: ['rijden', 'rijd', 'reed', 'reden', 'gereden'],
  caer: ['vallen', 'val', 'viel', 'vielen', 'gevallen', { z: 1 }],
  construir: ['bouwen', 'bouw', 'bouwde', 'bouwden', 'gebouwd'],
  levantarse: ['staan', 'sta', 'stond', 'stonden', 'gestaan', { sep: 'op', z: 1 }],
  ducharse: ['douchen', 'douche', 'douchte', 'douchten', 'gedoucht', { refl: 1 }],
  bañarse: ['baden', 'baad', 'baadde', 'baadden', 'gebaad', { refl: 1 }],
  afeitarse: ['scheren', 'scheer', 'schoor', 'schoren', 'geschoren', { refl: 1 }],
  peinarse: ['kammen', 'kam', 'kamde', 'kamden', 'gekamd', { refl: 1 }],
  lavarse: ['wassen', 'was', 'waste', 'wasten', 'gewassen', { refl: 1 }],
  llamarse: ['heten', 'heet', 'heette', 'heetten', 'geheten'],
  casarse: ['trouwen', 'trouw', 'trouwde', 'trouwden', 'getrouwd', { z: 1 }],
  cansarse: ['worden', 'word', 'werd', 'werden', 'geworden', { rest: 'moe', z: 1 }],
  relajarse: ['ontspannen', 'ontspan', 'ontspande', 'ontspanden', 'ontspannen', { refl: 1 }],
  marearse: ['worden', 'word', 'werd', 'werden', 'geworden', { rest: 'duizelig', z: 1 }],
  marcharse: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { sep: 'weg', z: 1 }],
  pintarse: ['schminken', 'schmink', 'schminkte', 'schminkten', 'geschminkt', { refl: 1 }],
  acostarse: ['gaan', 'ga', 'ging', 'gingen', 'gegaan', { rest: 'naar bed', z: 1 }],
  despertarse: ['worden', 'word', 'werd', 'werden', 'geworden', { rest: 'wakker', z: 1 }],
  divertirse: ['amuseren', 'amuseer', 'amuseerde', 'amuseerden', 'geamuseerd', { refl: 1 }],
  vestirse: ['kleden', 'kleed', 'kleedde', 'kleedden', 'gekleed', { sep: 'aan', refl: 1 }],
};

const SUBJECT = { '1s': 'ik', '2s': 'jij', '3s': 'hij/zij', '1p': 'wij', '2p': 'jullie', '3p': 'zij' };
const REFLEXIVE = { '1s': 'me', '2s': 'je', '3s': 'zich', '1p': 'ons', '2p': 'je', '3p': 'zich' };
const plural = p => p.endsWith('p');

/* Werkwoorden waarvan de tegenwoordige tijd niet uit de ik-vorm volgt: ik, jij, hij. */
const IRREGULAR = {
  zijn: ['ben', 'bent', 'is'],
  hebben: ['heb', 'hebt', 'heeft'],
  kunnen: ['kan', 'kunt', 'kan'],
  willen: ['wil', 'wilt', 'wil'],
  zullen: ['zal', 'zult', 'zal'],
};

/** Tegenwoordige tijd: ik spreek, jij/hij spreekt (maar: hij wacht, hij gaat), wij spreken. */
function present(inf, ik, person) {
  if (plural(person)) return inf;
  const irr = IRREGULAR[inf];
  if (irr) return irr[{ '1s': 0, '2s': 1, '3s': 2 }[person]];
  if (person === '1s') return ik;
  if (ik.endsWith('t')) return ik;
  return /[^a]a$/.test(ik) ? `${ik}at` : `${ik}t`;
}

/* "ik ben aan het zijn" of "ik ben het nodig aan het hebben" zegt geen mens. */
const NO_CONTINUO = new Set(['zijn', 'hebben', 'kunnen', 'willen', 'moeten', 'weten', 'kennen', 'heten']);

const AUX = { z: 'zijn', h: 'hebben' };

/* Tijden waarvan de Nederlandse vertaling overlapt: "comí" is "ik at", maar
 * "ik heb gegeten" is ook goed Nederlands; "como" kan "ik ben aan het eten"
 * zijn. Binnen zo'n groep mag de ene nooit afleider zijn bij de andere. */
export const TENSE_GROUP = {
  presente: 'nu', continuo: 'nu',
  indefinido: 'verleden', imperfecto: 'verleden', perfecto: 'verleden',
  futuro: 'toekomst', condicional: 'zou',
};

/** "ik at", "jullie zijn opgestaan", of null als het niet te vertalen is. */
export function dutchMeaning(verb, tense, person) {
  const entry = T[verb];
  if (!entry || !TENSE_GROUP[tense] || !SUBJECT[person]) return null;
  const [inf, ik, pastSg, pastPl, pp, opt = {}] = entry;
  if (tense === 'continuo' && (NO_CONTINUO.has(inf) || opt.rest)) return null;
  const sep = opt.sep ?? '';
  const middle = [opt.refl ? REFLEXIVE[person] : null, opt.rest].filter(Boolean);
  // Hoofdzin: onderwerp, persoonsvorm, wederkerend, vaste woorden, rest van het werkwoord.
  const say = (finite, ...tail) => [SUBJECT[person], finite, ...middle, ...tail].filter(Boolean).join(' ');

  switch (tense) {
    case 'presente': return say(present(inf, ik, person), sep);
    case 'indefinido':
    case 'imperfecto': return say(plural(person) ? pastPl : pastSg, sep);
    case 'perfecto': return say(present(AUX[opt.z ? 'z' : 'h'], null, person), sep + pp);
    case 'futuro': return say(present('zullen', null, person), sep + inf);
    case 'condicional': return say(plural(person) ? 'zouden' : 'zou', sep + inf);
    // "ik ben me aan het wassen": het wederkerend voornaamwoord staat vóór "aan het".
    case 'continuo': return say(present('zijn', null, person), 'aan het', sep + inf);
    default: return null;
  }
}
