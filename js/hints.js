/* Ezelsbruggetjes onder een fout antwoord.
 *
 * Twee bronnen. Per woord een handgeschreven `memo` (tools/memos.mjs): een
 * verwant woord of een herkomst. Daarnaast regels die voor een hele groep
 * gelden en die we hier uit het woord zelf afleiden: woorden op -ción zijn
 * vrouwelijk, -dor is een toestel, bij een laarswerkwoord vallen nosotros en
 * vosotros buiten de laars. Zo'n regel helpt meer dan het juiste antwoord
 * alleen: ze werkt ook voor het volgende woord.
 *
 * Alles hier is kort en in het Nederlands. Een regel die niet zeker klopt
 * voor dit woord, geven we niet. */

import { conjugatedForm, conjugationsOfForm, verbTranslation } from './data.js';

/** Het kale zelfstandig naamwoord, zonder lidwoord en zonder wat erachter komt. */
const nounOf = es => es.replace(/^(el|la|los|las)\s+/i, '').split(/[\s(]/)[0].toLowerCase();
const plain = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
const articleOf = es => es.match(/^(el|la|los|las)\s+/i)?.[1].toLowerCase() ?? null;

/* Telkens twee voorbeelden, zonder het woord zelf. */
const like = (word, ...xs) => xs.filter(x => !x.endsWith(` ${word}`)).slice(0, 2).join(' en ');

/**
 * Waarom dit zelfstandig naamwoord mannelijk of vrouwelijk is, of null als er
 * geen eenvoudige regel is. Ook gebruikt door de lidwoordoefening.
 */
export function genderRule(atom) {
  if (atom.kind !== 'vocab' || !atom.gender) return null;
  const article = articleOf(atom.es);
  if (!article) return null;
  const word = nounOf(atom.es);
  const fem = atom.gender === 'f';
  const plural = atom.number === 'pl';
  // Zonder accenten en, in het meervoud, ook in de enkelvoudsvorm getest:
  // las infecciones moet even goed op -ción vallen als la infección.
  const bare = plain(word);
  const forms = plural ? [bare, bare.replace(/s$/, ''), bare.replace(/es$/, '')] : [bare];
  const ends = re => forms.some(f => re.test(f));

  if (article === 'el' && fem) {
    return `${word} is vrouwelijk, maar begint met een beklemtoonde a: dan zeg je el (las ${word}s in het meervoud).`;
  }
  if (fem && ends(/[cs]ion$/)) {
    return 'Woorden op -ción en -sión zijn altijd vrouwelijk. Vaak is het ons -tie of -sie: la infección = de infectie.';
  }
  if (fem && ends(/(dad|tad|tud)$/)) {
    return 'Woorden op -dad, -tad en -tud zijn altijd vrouwelijk. -dad is vaak ons -heid of -iteit: la igualdad = de gelijkheid.';
  }
  if (fem && ends(/umbre$/)) return 'Woorden op -umbre zijn vrouwelijk: la costumbre, la legumbre.';
  if (fem && /itis$/.test(bare)) {
    return 'Ontstekingen op -itis zijn vrouwelijk en blijven gelijk in het meervoud: la bronquitis, las bronquitis.';
  }
  // Alleen echte winkels: la batería en la estantería zijn dat niet.
  if (fem && ends(/eria$/) && atom.nl.some(n => /winkel|zaak|handel|erij\b|salon|kapper|juwelier|drogist|bakker|parfumerie/.test(n))) {
    return '-ería is een winkel of zaak, en altijd vrouwelijk: el pan → la panadería, la fruta → la frutería.';
  }
  // -dor vóór -or: dat zegt meer dan "op -or is mannelijk".
  if (ends(/dora?$/)) {
    const verb = bare.replace(/dora?s?$/, 'r');
    const nl = [verb, `${verb}(se)`, `${verb}se`].map(verbTranslation).find(Boolean);
    return `-dor is mannelijk, -dora vrouwelijk. Zo maak je van een werkwoord een toestel, persoon of plek: lavar → la lavadora, comer → el comedor.`
      + (nl ? ` Hier: ${verb} = ${nl}.` : '');
  }
  if (!fem && ends(/aje$/)) return `Woorden op -aje zijn mannelijk, zoals het Franse -age: ${like(word, 'el viaje', 'el garaje', 'el mensaje')}.`;
  // Op -a of -o telt alleen als het woord daar echt op eindigt: el paraguas
  // en el sacapuntas zijn samenstellingen, geen woorden op -a.
  const base = plural ? bare.replace(/s$/, '') : bare;
  if (!fem && /ma$/.test(base)) {
    return `${word} eindigt op -a maar is mannelijk. Veel woorden op -ma komen uit het Grieks en zijn mannelijk: ${like(word, 'el problema', 'el tema', 'el clima')}.`;
  }
  if (fem && /o$/.test(base)) return `${word} eindigt op -o maar is vrouwelijk, zoals ${like(word, 'la mano', 'la foto', 'la radio')}.`;
  if (!fem && /a$/.test(base)) return `${word} eindigt op -a maar is mannelijk, zoals ${like(word, 'el día', 'el mapa', 'el sofá')}.`;
  if (!fem && ends(/or$/)) return 'Woorden op -or zijn bijna altijd mannelijk: el dolor, el calor. Uitzondering: la flor.';
  if (fem && ends(/or$/)) return `${word} is een van de weinige vrouwelijke woorden op -or, zoals la flor.`;
  if (!fem && /o$/.test(base)) return 'Op -o: bijna altijd mannelijk.';
  if (fem && /a$/.test(base)) return 'Op -a: meestal vrouwelijk.';
  if (plural) return 'Meervoud: los voor mannelijk, las voor vrouwelijk.';
  return null;
}

/* Voor de vergelijking met het Nederlands: qu en c klinken als k. */
const sounds = s => s.replace(/^sch/, 'sk').replace(/qu|c(?=[aou])/g, 'k').replace(/^sc(?=[rl])/, 'sk');

/** Een woordvormingsregel die het woord doorzichtig maakt, of null. */
function patternRule(atom) {
  const es = atom.es.toLowerCase();
  const word = atom.pos === 'noun' ? nounOf(atom.es) : es.split(/[\s/,]/)[0];
  const nlWords = atom.nl.map(n => n.toLowerCase().replace(/^(de|het|een)\s+/, '').split(/[\s/]/)[0]);

  // Spaans zet een e- voor s + medeklinker: escribir = schrijven, esquiar = skiën.
  if (/^es[bcdfgklmnpqrtv]/.test(word)) {
    const twin = nlWords.find(n => /^s[bcdfghklmnpqrtvw]/.test(n) && sounds(plain(n)).slice(0, 3) === sounds(plain(word.slice(1))).slice(0, 3));
    if (twin) return `Een Spaans woord begint nooit met s + medeklinker: er komt een e- voor. Zonder die e- zie je het: ${word} ↔ ${twin}.`;
  }
  if (atom.pos === 'adv' && /mente$/.test(word)) {
    return '-mente is ons -lijk of -erwijs: je plakt het achter de vrouwelijke vorm (rápida → rápidamente).';
  }
  if (atom.pos === 'adj' && /(és|án)\/-?(esa|ana)$/.test(es)) {
    return 'In de vrouwelijke vorm valt het accent weg (francés → francesa, alemán → alemana): de klemtoon blijft gewoon op dezelfde plaats.';
  }
  if (atom.pos === 'adj' && !es.includes('/') && /^[a-zñáéíóúü]+$/.test(es) && /(e|[lnrz]|[^e]s)$/.test(es)) {
    return 'Op -e of een medeklinker: één vorm voor mannelijk en vrouwelijk (un coche verde, una casa verde).';
  }
  if (/^¿(de |por |para |a )?(qu[eé]|c[oó]mo|d[oó]nde|ad[oó]nde|cu[aá]ndo|cu[aá]nt|cu[aá]l|qui[eé]n)/i.test(atom.es)) {
    return 'Vraagwoorden krijgen altijd een accent, ook in een indirecte vraag: ¿Dónde vives? · No sé dónde vive.';
  }
  return null;
}

/** Meervoud op -z: niet te raden als je het niet weet. */
function pluralRule(atom) {
  if (atom.pos !== 'noun' || atom.number === 'pl') return null;
  const word = nounOf(atom.es);
  if (/z$/.test(word)) return `Meervoud: de z wordt c — ${word} → ${word.slice(0, -1)}ces.`;
  return null;
}

/* --- vervoegingen --- */

/** De stam van een vorm: zonder voornaamwoord en zonder uitgang. */
const bareForm = f => f?.replace(/^(me|te|se|nos|os)\s+/, '');

/** e → ie, o → ue, e → i of u → ue in de presente, of null. */
function stemChange(verb) {
  // Afgelezen aan él, niet aan yo: tengo en vengo verbergen de ie.
  const he = bareForm(conjugatedForm(verb, 'presente', '3s'));
  const we = bareForm(conjugatedForm(verb, 'presente', '1p'));
  if (!he || !we) return null;
  const inf = verb.replace(/se$/, '');
  const stem = plain(inf.slice(0, -2));
  for (const [from, to] of [['e', 'ie'], ['o', 'ue'], ['u', 'ue'], ['e', 'i']]) {
    const at = stem.lastIndexOf(from);
    if (at < 0) continue;
    const changed = stem.slice(0, at) + to + stem.slice(at + from.length);
    if (plain(he).startsWith(changed) && plain(we).startsWith(stem)) return { from, to, he, we };
  }
  return null;
}

const ending = verb => plain(verb.replace(/se$/, '')).slice(-2);

const STRONG_PRETERITE = 'Sterke verleden tijd: een nieuwe stam en uitgangen zonder accent: -e, -iste, -o, -imos, -isteis, -ieron (tuve, estuve, pude, puse, hice, quise, vine).';
const STEM_GROUPS = 'Drie groepjes: de e valt weg (podr-, sabr-, querr-, habr-), er komt een d bij (tendr-, pondr-, saldr-, vendr-), of apart (har-, dir-).';
const PARTICIPLES = { abierto: 1, escrito: 1, hecho: 1, puesto: 1, dicho: 1, visto: 1, vuelto: 1, muerto: 1, roto: 1 };
const SUBJ_IRREGULAR = { ser: 'sea', estar: 'esté', ir: 'vaya', saber: 'sepa', haber: 'haya', dar: 'dé' };

/** Een geheugensteun voor deze ene vorm, of null. */
export function conjugationHint(atom) {
  const { verb, tense, person } = atom;
  const form = bareForm(atom.form);
  const inf = verb.replace(/se$/, '');
  const end = ending(verb);
  const we = person === '1p' || person === '2p';

  switch (tense) {
    case 'presente': {
      if (person === '1s' && /oy$/.test(form)) return 'yo op -oy: soy, estoy, voy, doy.';
      if (person === '1s' && /go$/.test(form) && !/gu?[aei]r$/.test(inf)) {
        return `Een "go-werkwoord": alleen yo krijgt -go (tengo, pongo, salgo, hago, digo, vengo). De rest is gewoon.`;
      }
      if (person === '1s' && /zco$/.test(form)) return 'Op -cer of -cir: yo krijgt -zco (conozco, conduzco). De rest is gewoon.';
      const change = stemChange(verb);
      if (change) {
        return we
          ? `Laarswerkwoord (${change.from} → ${change.to}): nosotros en vosotros vallen buiten de laars en houden de gewone stam (${change.we}).`
          : `Laarswerkwoord: ${change.from} → ${change.to} in alle vormen behalve nosotros en vosotros (${change.he} … ${change.we}).`;
      }
      if (person === '2p' && /[áéí]i?s$/.test(form)) return 'vosotros: -áis, -éis of -ís, met een accent.';
      if (!atom.irregular) {
        return end === 'ar'
          ? '-ar krijgt uitgangen met a: -o, -as, -a, -amos, -áis, -an.'
          : `-${end} krijgt uitgangen met e: -o, -es, -e, ${end === 'er' ? '-emos, -éis' : '-imos, -ís'}, -en.`;
      }
      return null;
    }
    case 'indefinido': {
      if (inf === 'ser' || inf === 'ir') return 'ser en ir zijn in de indefinido gelijk (fui, fuiste, fue …): de zin zegt welk bedoeld is.';
      if (/^(dar|ver)$/.test(inf)) return `${inf} krijgt de uitgangen van -er/-ir, zonder accent: ${inf === 'dar' ? 'di, diste, dio' : 'vi, viste, vio'}.`;
      if (person === '1s' && /(qué|gué|cé)$/.test(form) && end === 'ar') {
        return 'Spelling: -car → -qué, -gar → -gué, -zar → -cé, zodat de klank blijft (busqué, pagué, empecé).';
      }
      if (/(yó|yeron)$/.test(form)) return 'Tussen twee klinkers wordt de i een y: leyó, leyeron, creyó.';
      const yo = bareForm(conjugatedForm(verb, 'indefinido', '1s'));
      if (yo && /[^é]e$/.test(yo)) {
        if (person === '3p' && /jeron$/.test(form)) return 'Na een j valt de i weg: dijeron, trajeron, condujeron (niet -jieron).';
        return STRONG_PRETERITE;
      }
      if (end === 'ir' && (person === '3s' || person === '3p') && atom.irregular) {
        return '-ir-laarswerkwoorden veranderen in de indefinido alleen bij él en ellos: e → i, o → u (pidió, durmieron).';
      }
      if (!atom.irregular) {
        if (person === '1p' && end !== 'er') return `nosotros is gelijk aan de presente (${form}): de context zegt of het verleden is.`;
        if (person === '1s' || person === '3s') return 'yo en él dragen de klemtoon op de uitgang, dus een accent: hablé, habló, comí, comió.';
        return end === 'ar'
          ? '-ar: -é, -aste, -ó, -amos, -asteis, -aron.'
          : '-er en -ir: -í, -iste, -ió, -imos, -isteis, -ieron.';
      }
      return null;
    }
    case 'imperfecto': {
      if (/^(ser|ir|ver)$/.test(inf)) return 'Er zijn maar drie onregelmatige: ser (era), ir (iba) en ver (veía).';
      if (person === '1p') return 'nosotros krijgt een accent: hablábamos, comíamos, vivíamos.';
      if (person === '1s' || person === '3s') return 'yo en él zijn in de imperfecto gelijk: (yo/él) hablaba, comía.';
      return end === 'ar' ? '-ar → -aba (met b): hablaba, hablabas …' : '-er en -ir → -ía (met accent): comía, vivía …';
    }
    case 'futuro':
      if (atom.irregular) return `Onregelmatige stam, gewone uitgangen. ${STEM_GROUPS}`;
      return 'De hele infinitief + -é, -ás, -á, -emos, -éis, -án. Alles behalve nosotros heeft een accent.';
    case 'condicional':
      if (atom.irregular) return `Dezelfde stam als de futuro (tendré → tendría). ${STEM_GROUPS}`;
      return 'De hele infinitief + de uitgangen van de imperfecto op -er: -ía, -ías, -ía, -íamos, -íais, -ían.';
    case 'perfecto': {
      const part = form.split(' ').pop();
      if (/íd[oa]$/.test(part)) return 'Na een klinker krijgt -ido een accent: leído, creído, traído, oído.';
      if (PARTICIPLES[part] || atom.irregular) return 'Onregelmatig deelwoord. Leer ze als rijtje: abierto, escrito, hecho, puesto, dicho, visto, vuelto, muerto, roto.';
      return 'haber (he, has, ha, hemos, habéis, han) + -ado of -ido. Het deelwoord verandert nooit.';
    }
    case 'continuo': {
      const ger = form.split(' ').pop();
      if (/yendo$/.test(ger)) return 'Na een klinker wordt -iendo -yendo: leyendo, oyendo, trayendo (en ir → yendo).';
      if (end === 'ir' && atom.irregular) return '-ir-laarswerkwoorden: e → i, o → u in het gerundio (pidiendo, durmiendo, sintiendo).';
      return 'estar + gerundio: -ar → -ando, -er en -ir → -iendo.';
    }
    case 'subjuntivo':
      if (SUBJ_IRREGULAR[inf]) return 'Zes uitzonderingen die je apart leert: sea, esté, vaya, sepa, haya, dé.';
      return 'Vertrek van de yo-vorm, haal de -o weg en neem de "andere" klinker: -ar → -e, -er/-ir → -a (hablo → hable, tengo → tenga).';
  }
  return null;
}

/**
 * Een invulzin waarvan het antwoord een vervoegde vorm is ("tiene"), krijgt
 * de tip van die vorm. Alleen als de vorm ondubbelzinnig is: "como" kan ook
 * "zoals" zijn, en "fue" is zowel ser als ir.
 */
function formHint(expected) {
  if (typeof expected !== 'string' || expected.split(/\s+/).length > 3) return null;
  const hits = conjugationsOfForm(expected.trim());
  const one = new Set(hits.map(a => `${a.verb}|${a.tense}`));
  if (one.size !== 1) return null;
  const hint = conjugationHint(hits[0]);
  const nl = verbTranslation(hits[0].verb);
  return hint ? `${expected.trim()} komt van ${hits[0].verb}${nl ? ` (${nl})` : ''}. ${hint}` : null;
}

/**
 * Alle tips voor dit atoom, belangrijkste eerst. Het eigen ezelsbruggetje
 * staat vooraan; daarna de regels. `expected` is het verwachte antwoord, voor
 * oefeningen die geen woord of vervoeging zijn.
 */
export function hintsFor(atom, { expected } = {}) {
  if (atom.kind === 'conjugation') return [conjugationHint(atom)].filter(Boolean);
  if (['sentence', 'grammar', 'choice'].includes(atom.kind)) return [formHint(expected)].filter(Boolean);
  if (atom.kind !== 'vocab') return [];
  return [atom.memo, genderRule(atom), patternRule(atom), pluralRule(atom)]
    .filter(Boolean)
    // De zwakke vuistregels (op -o meestal mannelijk) alleen als er niets beters is.
    .filter((h, _i, all) => !/^Op -[ao]: |^Meervoud: los/.test(h) || all.length === 1);
}
