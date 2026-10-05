/* Vervoegingen per tijd, ingedeeld naar hoe je ze leert.
 *
 * De cursus geeft volledige rijtjes voor een dertigtal werkwoorden, vooral
 * onregelmatige. Om een patroon als "regelmatig op -ar" in te oefenen heb je
 * er meer nodig, dus vullen we aan met de regelmatige werkwoorden uit de
 * woordenschat. Die rijtjes zijn berekend, niet gedolven: ze krijgen
 * `generated: true` en worden bij elke run opnieuw gemaakt. Een rijtje uit de
 * cursus heeft altijd voorrang.
 *
 * De indeling gebeurt per tijd, want wat onregelmatig is verschilt per tijd:
 * estar is onregelmatig in de presente maar regelmatig in de imperfecto.
 * Een rijtje dat precies het regelmatige patroon volgt is regelmatig; in de
 * presente is het klankveranderend als het precies het klankpatroon volgt;
 * al de rest is onregelmatig.
 */

import { REGULAR, IRREGULAR } from './verbs.mjs';

const PERSONS = ['1s', '2s', '3s', '1p', '2p', '3p'];

const ENDINGS = {
  presente: {
    ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
    er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
    ir: ['o', 'es', 'e', 'imos', 'ís', 'en'],
  },
  indefinido: {
    ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
    er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
    ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
  },
  imperfecto: {
    ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
    er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
    ir: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
  },
};
const FUTURE = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
const CONDITIONAL = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
const HABER = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];
const ESTAR = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'];

/* Aanvoegende wijs: de "andere" klinker. -ar krijgt e, -er en -ir krijgen a. */
const SUBJUNCTIVE = {
  ar: ['e', 'es', 'e', 'emos', 'éis', 'en'],
  er: ['a', 'as', 'a', 'amos', 'áis', 'an'],
  ir: ['a', 'as', 'a', 'amos', 'áis', 'an'],
};

const plain = s => s.normalize('NFD').replace(/[́]/g, '').normalize('NFC');

/** -ar, -er of -ir; null voor alles wat geen gewone infinitief is. */
export const endingOf = verb => {
  const e = plain(verb).slice(-2);
  return ['ar', 'er', 'ir'].includes(e) ? e : null;
};

/** Het regelmatige rijtje, zonder uitzonderingen. */
export function regularForms(verb, tense) {
  const end = endingOf(verb);
  if (!end) return null;
  const stem = plain(verb).slice(0, -2);
  if (tense === 'futuro') return FUTURE.map(e => plain(verb) + e);
  if (tense === 'condicional') return CONDITIONAL.map(e => plain(verb) + e);
  if (tense === 'perfecto') return HABER.map(h => `${h} ${stem}${end === 'ar' ? 'ado' : 'ido'}`);
  if (tense === 'continuo') return ESTAR.map(e => `${e} ${stem}${end === 'ar' ? 'ando' : 'iendo'}`);
  if (tense === 'subjuntivo') return SUBJUNCTIVE[end].map(e => spellStem(stem, end, e) + e);
  return ENDINGS[tense]?.[end].map(e => stem + e) ?? null;
}

/** buscar → busque, pagar → pague, empezar → empiece: de klank blijft, de
 *  spelling past zich aan vóór een e. */
function spellStem(stem, end, ending) {
  if (end !== 'ar' || !ending.startsWith('e') && !ending.startsWith('é')) return stem;
  return stem.replace(/c$/, 'qu').replace(/g$/, 'gu').replace(/z$/, 'c');
}

/** Het rijtje met klankverandering in de presente: de laatste klinker van de
 *  stam wisselt, behalve bij nosotros en vosotros. */
function stemChangedForms(verb, change) {
  const [from, to] = change.split(' → ');
  const base = regularForms(verb, 'presente');
  const stem = verb.slice(0, -2);
  const at = stem.lastIndexOf(from);
  if (!base || at < 0) return null;
  const changed = stem.slice(0, at) + to + stem.slice(at + from.length);
  return base.map((f, i) => (i === 3 || i === 4 ? f : changed + f.slice(stem.length)));
}

/* De toekomende tijd heeft maar een handvol afwijkende stammen. */
const FUTURE_STEMS = {
  tener: 'tendr', venir: 'vendr', poner: 'pondr', salir: 'saldr', poder: 'podr',
  saber: 'sabr', querer: 'querr', haber: 'habr', hacer: 'har', decir: 'dir',
};

/* Onregelmatige gerundios. De -ir-klankveranderaars (durmiendo, pidiendo,
 * sintiendo) worden berekend; dit zijn de overige. */
const GERUNDS = {
  ir: 'yendo', leer: 'leyendo', oír: 'oyendo', traer: 'trayendo', creer: 'creyendo',
  poseer: 'poseyendo', caer: 'cayendo', decir: 'diciendo', venir: 'viniendo',
  poder: 'pudiendo', reír: 'riendo',
};

/* Aanvoegende wijs die niet van de yo-vorm afgeleid kan worden. */
const SUBJUNCTIVE_IRREGULAR = {
  ser: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'],
  estar: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'],
  ir: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'],
  saber: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'],
  haber: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
  dar: ['dé', 'des', 'dé', 'demos', 'deis', 'den'],
};

/* Onregelmatige voltooide deelwoorden. De klinkerstammen (leído, traído)
 * krijgen een accent: zonder zou de klemtoon verschuiven. */
const PARTICIPLES = {
  abrir: 'abierto', escribir: 'escrito', hacer: 'hecho', poner: 'puesto',
  decir: 'dicho', ver: 'visto', volver: 'vuelto', morir: 'muerto', romper: 'roto',
  leer: 'leído', creer: 'creído', poseer: 'poseído', traer: 'traído', oír: 'oído', caer: 'caído',
};

/* Wederkerende werkwoorden uit de dagelijkse routine, met hun klankwissel.
 * Het voornaamwoord komt ervoor: me levanto, me he levantado. */
export const REFLEXIVE = {
  levantarse: null, ducharse: null, bañarse: null, afeitarse: null, peinarse: null,
  lavarse: null, llamarse: null, casarse: null, cansarse: null, relajarse: null,
  marearse: null, marcharse: null,
  acostarse: 'o → ue', despertarse: 'e → ie', divertirse: 'e → ie',
};
const PRONOUNS = ['me', 'te', 'se', 'nos', 'os', 'se'];
const REFLEXIVE_TENSES = new Set(['presente', 'indefinido', 'imperfecto', 'futuro', 'perfecto']);

/* Klankveranderaars uit verbs.mjs. Weersverschijnselen en doler vallen weg:
 * die hebben geen volledig rijtje van zes. */
const STEM_CHANGERS = Object.entries(IRREGULAR)
  .filter(([v, c]) => c.includes('→') && !['nevar', 'llover', 'doler'].includes(v));

/** De stamklinker zoals die in het gerundio en in nosotros/vosotros van de
 *  aanvoegende wijs verschijnt: enkel -ir-werkwoorden wisselen daar
 *  (durmiendo, durmamos; pidiendo, pidamos; sintiendo, sintamos). */
function weakStem(verb, change = IRREGULAR[verb]) {
  const stem = plain(verb).slice(0, -2);
  if (!change?.includes('→') || endingOf(verb) !== 'ir') return stem;
  const from = change.split(' → ')[0];
  const at = stem.lastIndexOf(from);
  return at < 0 ? stem : stem.slice(0, at) + (from === 'o' ? 'u' : 'i') + stem.slice(at + 1);
}

function gerund(verb) {
  if (GERUNDS[verb]) return GERUNDS[verb];
  const end = endingOf(verb);
  if (!end) return null;
  const stem = weakStem(verb);
  if (end === 'ar') return `${stem}ando`;
  // leer → leyendo: tussen twee klinkers wordt de i een y.
  return /[aeo]$/.test(stem) ? `${stem}yendo` : `${stem}iendo`;
}

/** Aanvoegende wijs, afgeleid van de yo-vorm van de presente: tengo → tenga,
 *  conozco → conozca. Bij klankveranderaars blijft nosotros/vosotros zwak. */
function subjunctive(verb, yo) {
  if (SUBJUNCTIVE_IRREGULAR[verb]) return SUBJUNCTIVE_IRREGULAR[verb];
  const end = endingOf(verb);
  if (!end || !yo?.endsWith('o')) return null;
  const endings = SUBJUNCTIVE[end];
  const strong = spellStem(yo.slice(0, -1), end, 'e');
  const change = IRREGULAR[verb];
  if (!change?.includes('→')) return endings.map(e => strong + e);
  const weak = spellStem(weakStem(verb), end, 'e');
  return endings.map((e, i) => (i === 3 || i === 4 ? weak : strong) + e);
}

/**
 * De indefinido met zijn spellings- en klankwissels:
 *   buscar → busqué, pagar → pagué, empezar → empecé (alleen yo);
 *   leer → leyó, leyeron (tussen twee klinkers wordt de i een y);
 *   pedir → pidió, dormir → durmió (-ir-klankveranderaars, enkel él en ellos).
 */
export function indefinidoForms(verb, change = IRREGULAR[verb]) {
  const base = regularForms(verb, 'indefinido');
  if (!base) return null;
  const end = endingOf(verb);
  const stem = plain(verb).slice(0, -2);
  if (VOWEL_STEM.test(plain(verb))) {
    return [`${stem}í`, `${stem}íste`, `${stem}yó`, `${stem}ímos`, `${stem}ísteis`, `${stem}yeron`];
  }
  const out = [...base];
  if (SPELLING.test(verb)) out[0] = `${spellStem(stem, 'ar', 'é')}é`;
  if (end === 'ir' && change?.includes('→')) {
    const weak = weakStem(verb, change);
    out[2] = `${weak}ió`;
    out[5] = `${weak}ieron`;
  }
  return out;
}

/** Een wederkerend werkwoord: het rijtje van de basis met me, te, se ervoor. */
function reflexiveForms(verb, tense) {
  const base = verb.slice(0, -2);
  const change = REFLEXIVE[verb];
  let f = null;
  if (tense === 'presente') f = change ? stemChangedForms(base, change) : regularForms(base, tense);
  else if (tense === 'indefinido') f = indefinidoForms(base, change);
  else f = regularForms(base, tense);
  return f && f.map((x, i) => `${PRONOUNS[i]} ${x}`);
}

/** Het correcte rijtje voor de werkwoorden die we zelf aanvullen. `yo` is de
 *  yo-vorm van de presente, voor de aanvoegende wijs. */
function forms(verb, tense, yo) {
  if (verb in REFLEXIVE) return REFLEXIVE_TENSES.has(tense) ? reflexiveForms(verb, tense) : null;
  if (tense === 'indefinido') return indefinidoForms(verb);
  if (tense === 'presente') {
    const change = IRREGULAR[verb];
    return change?.includes('→') ? stemChangedForms(verb, change) : regularForms(verb, tense);
  }
  if (tense === 'futuro' && FUTURE_STEMS[verb]) return FUTURE.map(e => FUTURE_STEMS[verb] + e);
  if (tense === 'condicional' && FUTURE_STEMS[verb]) return CONDITIONAL.map(e => FUTURE_STEMS[verb] + e);
  if (tense === 'perfecto' && PARTICIPLES[verb]) return HABER.map(h => `${h} ${PARTICIPLES[verb]}`);
  if (tense === 'continuo') {
    const g = gerund(verb);
    return g ? ESTAR.map(e => `${e} ${g}`) : null;
  }
  if (tense === 'subjuntivo') return subjunctive(verb, yo);
  return regularForms(verb, tense);
}

/* Spellings- en klinkerwissels. Zulke rijtjes komen in het thema
 * "onregelmatig" terecht: busqué en leyó volg je niet blind uit het patroon. */
const SPELLING = /(car|gar|zar)$/;
const VOWEL_STEM = /[aeo](er|ir)$/;

/* Werkwoorden uit de cursus waarvan de indefinido wél het patroon volgt (met
 * de wissels hierboven). De andere (tuve, hice, dije) staan in de cursus zelf. */
const BOOK_INDEFINIDO = ['comer', 'hablar', 'tomar', 'vivir', 'abrir', 'escribir', 'partir',
  'volver', 'conocer', 'salir', 'jugar', 'pensar', 'oír', 'dormir', 'pedir'];
/* De imperfecto is regelmatig, behalve bij deze drie. */
const IMPERFECTO_IRREGULAR = new Set(['ser', 'ir', 'ver']);

function verbsToAdd(tense, bookVerbs) {
  const changers = STEM_CHANGERS.map(([v]) => v);
  const regular = [...REGULAR];
  const reflexive = REFLEXIVE_TENSES.has(tense) ? Object.keys(REFLEXIVE) : [];
  return [...baseVerbsToAdd(tense, bookVerbs, changers, regular), ...reflexive];
}

function baseVerbsToAdd(tense, bookVerbs, changers, regular) {
  switch (tense) {
    case 'presente': return [...regular, ...changers];
    case 'imperfecto': return [...regular, ...changers, ...bookVerbs.filter(v => !IMPERFECTO_IRREGULAR.has(v))];
    case 'perfecto': return [...regular, ...changers, ...bookVerbs]
      .filter(v => !VOWEL_STEM.test(plain(v)) || PARTICIPLES[v]);
    case 'futuro': return [...regular, ...changers, ...bookVerbs];
    case 'condicional': return [...regular, ...changers, ...bookVerbs];
    case 'continuo': return [...regular, ...changers, ...bookVerbs].filter(v => v !== 'haber');
    // Enkel werkwoorden waarvan de yo-vorm bekend is (of die volledig
    // onregelmatig zijn). jugar → juegue, juguemos: spellStem doet beide wissels.
    case 'subjuntivo': return [...regular, ...changers, ...bookVerbs];
    case 'indefinido':
      // querer en poder zijn volledig onregelmatig (quise, pude).
      return [...regular, ...changers.filter(v => !['querer', 'poder'].includes(v)), ...BOOK_INDEFINIDO];
    default: return [];
  }
}

/* --- de thema's --- */

export const TENSES = [
  { tense: 'presente', section: 'Presente (tegenwoordige tijd: ik spreek)', kinds: ['ar', 'er', 'ir', 'klank', 'onr', 'wed'] },
  { tense: 'indefinido', section: 'Pretérito indefinido (verleden tijd, afgerond: ik sprak)', kinds: ['ar', 'er', 'ir', 'onr', 'wed'] },
  { tense: 'futuro', section: 'Futuro simple (toekomende tijd: ik zal spreken)', kinds: ['ar', 'er', 'ir', 'onr', 'wed'] },
  { tense: 'imperfecto', section: 'Pretérito imperfecto (verleden tijd, gewoonte of beschrijving: ik sprak altijd)', kinds: ['ar', 'er', 'ir', 'onr', 'wed'] },
  { tense: 'perfecto', section: 'Pretérito perfecto (voltooid tegenwoordige tijd: ik heb gesproken)', kinds: ['ar', 'er', 'ir', 'onr', 'wed'] },
  { tense: 'continuo', section: 'Estar + gerundio (bezig zijn: ik ben aan het spreken)', kinds: ['ar', 'er', 'ir', 'onr'] },
  { tense: 'condicional', section: 'Condicional (voorwaardelijke wijs: ik zou spreken)', kinds: ['ar', 'er', 'ir', 'onr'] },
  { tense: 'subjuntivo', section: 'Presente de subjuntivo (aanvoegende wijs: … dat ik spreek)', kinds: ['ar', 'er', 'ir', 'klank', 'onr'] },
];

const KIND_LABELS = {
  ar: 'Regelmatig op -ar', er: 'Regelmatig op -er', ir: 'Regelmatig op -ir',
  klank: 'Klankveranderend', onr: 'Onregelmatig', wed: 'Wederkerend (me levanto)',
};

const themeId = (tense, kind) => `vv-${tense}-${kind}`;

export const CONJUGATION_THEMES = TENSES.flatMap(({ tense, section, kinds }) =>
  kinds.map(kind => ({ id: themeId(tense, kind), label: KIND_LABELS[kind], emoji: '•', section })));

/* Het gerundio is geen rijtje van zes, maar hoort wel bij het vervoegen. */
export const EXTRA_SECTIONS = { 'aan-het-doen': 'Gerundio (bezig zijn: ik ben aan het spreken)' };

/** Thema-id's in schermvolgorde: gerundio na de presente, zoals in de les. */
export const CONJUGATION_ORDER = TENSES.flatMap(({ tense, kinds }) => [
  ...kinds.map(k => themeId(tense, k)),
  ...(tense === 'presente' ? Object.keys(EXTRA_SECTIONS) : []),
]);

/** In welk thema hoort dit rijtje? */
function classify(verb, tense, family, yo) {
  if (verb in REFLEXIVE) return { theme: themeId(tense, 'wed'), irregular: Boolean(REFLEXIVE[verb]) };
  const same = f => f && PERSONS.every((p, i) => family.get(p) === f[i]);
  if (same(regularForms(verb, tense))) return { theme: themeId(tense, endingOf(verb)), irregular: false };
  if (tense === 'presente' && IRREGULAR[verb]?.includes('→')
      && same(stemChangedForms(verb, IRREGULAR[verb]))) {
    return { theme: themeId(tense, 'klank'), irregular: true };
  }
  // In de aanvoegende wijs is een klankveranderaar precies zo klankveranderend
  // als in de presente: quiera, queramos.
  if (tense === 'subjuntivo' && IRREGULAR[verb]?.includes('→') && same(subjunctive(verb, yo))) {
    return { theme: themeId(tense, 'klank'), irregular: true };
  }
  return { theme: themeId(tense, 'onr'), irregular: true };
}

/**
 * Vult de vervoegingen aan en deelt ze in. Geeft de nieuwe lijst
 * vervoegingsatomen terug; de andere atomen laat het ongemoeid.
 */
export function buildConjugations(atoms) {
  const book = atoms.filter(a => a.kind === 'conjugation' && !a.generated);
  const byId = new Map(book.map(a => [a.id, a]));
  const bookVerbs = [...new Set(book.map(a => a.verb))];

  const all = [...book];
  // De yo-vorm van de presente, uit de cursus of berekend: basis voor de
  // aanvoegende wijs. Daarom komt de presente als eerste aan de beurt.
  const yoOf = verb => byId.get(`c.${verb}.presente.1s`)?.form;
  for (const { tense } of TENSES) {
    for (const verb of new Set(verbsToAdd(tense, bookVerbs))) {
      const f = forms(verb, tense, yoOf(verb));
      if (!f) continue;
      PERSONS.forEach((person, i) => {
        const id = `c.${verb}.${tense}.${person}`;
        if (byId.has(id)) return;
        const atom = { id, kind: 'conjugation', theme: null, verb, tense, person, form: f[i], generated: true };
        byId.set(id, atom);
        all.push(atom);
      });
    }
  }

  const families = new Map();
  for (const a of all) {
    const key = `${a.verb}|${a.tense}`;
    if (!families.has(key)) families.set(key, new Map());
    families.get(key).set(a.person, a.form);
  }

  return all.map(a => {
    const { theme, irregular } = classify(a.verb, a.tense, families.get(`${a.verb}|${a.tense}`), yoOf(a.verb));
    // Het onregelmatig-vlag uit de cursus blijft staan: dat is wat het boek zegt.
    return a.generated ? { ...a, theme, irregular } : { ...a, theme };
  });
}

/* --- soort werkwoord herkennen --- */

/* Eén thema per soort, gevoed door de indeling van de presente hierboven.
 * De oefening vraagt "welk werkwoord is …?" met drie werkwoorden van een
 * andere soort als afleiders (js/types/verbType.js). */
export const VERB_TYPE_THEMES = [
  { id: 'vs-regelmatig', label: 'Welk werkwoord is regelmatig?', emoji: '✅', type: 'regelmatig' },
  { id: 'vs-klank', label: 'Welk werkwoord verandert van klank?', emoji: '🔁', type: 'klankveranderend' },
  { id: 'vs-onregelmatig', label: 'Welk werkwoord is onregelmatig?', emoji: '⚡', type: 'onregelmatig' },
];

const TYPE_OF_THEME = {
  'vv-presente-ar': 'vs-regelmatig', 'vv-presente-er': 'vs-regelmatig', 'vv-presente-ir': 'vs-regelmatig',
  'vv-presente-klank': 'vs-klank', 'vv-presente-onr': 'vs-onregelmatig',
};

/** Eén atoom per werkwoord met een volledig presente-rijtje. */
export function buildVerbTypes(conjugations) {
  const seen = new Set();
  const out = [];
  for (const c of conjugations) {
    const theme = TYPE_OF_THEME[c.theme];
    if (!theme || seen.has(c.verb)) continue;
    seen.add(c.verb);
    const { type } = VERB_TYPE_THEMES.find(t => t.id === theme);
    out.push({ id: `vt.${c.verb}`, kind: 'verbType', theme, es: c.verb, nl: type, verb: c.verb, type, generated: true });
  }
  return out;
}
