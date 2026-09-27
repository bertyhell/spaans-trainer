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
const HABER = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];

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
  if (tense === 'perfecto') return HABER.map(h => `${h} ${stem}${end === 'ar' ? 'ado' : 'ido'}`);
  return ENDINGS[tense]?.[end].map(e => stem + e) ?? null;
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

/* Onregelmatige voltooide deelwoorden. */
const PARTICIPLES = {
  abrir: 'abierto', escribir: 'escrito', hacer: 'hecho', poner: 'puesto',
  decir: 'dicho', ver: 'visto', volver: 'vuelto', morir: 'muerto', romper: 'roto',
};

/* Klankveranderaars uit verbs.mjs. Weersverschijnselen en doler vallen weg:
 * die hebben geen volledig rijtje van zes. */
const STEM_CHANGERS = Object.entries(IRREGULAR)
  .filter(([v, c]) => c.includes('→') && !['nevar', 'llover', 'doler'].includes(v));

/** Het correcte rijtje voor de werkwoorden die we zelf aanvullen. */
function forms(verb, tense) {
  if (tense === 'presente') {
    const change = IRREGULAR[verb];
    return change?.includes('→') ? stemChangedForms(verb, change) : regularForms(verb, tense);
  }
  if (tense === 'futuro' && FUTURE_STEMS[verb]) return FUTURE.map(e => FUTURE_STEMS[verb] + e);
  if (tense === 'perfecto' && PARTICIPLES[verb]) return HABER.map(h => `${h} ${PARTICIPLES[verb]}`);
  return regularForms(verb, tense);
}

/* Welke werkwoorden we per tijd aanvullen. Werkwoorden met een
 * spellingswissel die je niet als "regelmatig" wil leren blijven weg:
 * busqué, pagué, empecé in de indefinido, leyó en leído. */
const SPELLING = /(car|gar|zar)$/;
const VOWEL_STEM = /[aeo](er|ir)$/;

function verbsToAdd(tense, bookVerbs) {
  const changers = STEM_CHANGERS.map(([v]) => v);
  const regular = [...REGULAR];
  switch (tense) {
    case 'presente': return [...regular, ...changers];
    case 'imperfecto': return [...regular, ...changers];
    case 'perfecto': return [...regular, ...changers].filter(v => !VOWEL_STEM.test(v));
    case 'futuro': return [...regular, ...changers, ...bookVerbs];
    case 'indefinido':
      // -ir-klankveranderaars wisselen ook hier (sintió, pidió); querer en
      // poder zijn volledig onregelmatig (quise, pude).
      return [...regular, ...changers.filter(v => !v.endsWith('ir') && !['querer', 'poder'].includes(v))]
        .filter(v => !SPELLING.test(v) && !VOWEL_STEM.test(v));
    default: return [];
  }
}

/* --- de thema's --- */

export const TENSES = [
  { tense: 'presente', section: 'Presente (tegenwoordige tijd: ik spreek)', kinds: ['ar', 'er', 'ir', 'klank', 'onr'] },
  { tense: 'indefinido', section: 'Pretérito indefinido (verleden tijd, afgerond: ik sprak)', kinds: ['ar', 'er', 'ir', 'onr'] },
  { tense: 'futuro', section: 'Futuro simple (toekomende tijd: ik zal spreken)', kinds: ['ar', 'er', 'ir', 'onr'] },
  { tense: 'imperfecto', section: 'Pretérito imperfecto (verleden tijd, gewoonte of beschrijving: ik sprak altijd)', kinds: ['ar', 'er', 'ir', 'onr'] },
  { tense: 'perfecto', section: 'Pretérito perfecto (voltooid tegenwoordige tijd: ik heb gesproken)', kinds: ['ar', 'er', 'ir', 'onr'] },
];

const KIND_LABELS = {
  ar: 'Regelmatig op -ar', er: 'Regelmatig op -er', ir: 'Regelmatig op -ir',
  klank: 'Klankveranderend', onr: 'Onregelmatig',
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
function classify(verb, tense, family) {
  const same = f => f && PERSONS.every((p, i) => family.get(p) === f[i]);
  if (same(regularForms(verb, tense))) return { theme: themeId(tense, endingOf(verb)), irregular: false };
  if (tense === 'presente' && IRREGULAR[verb]?.includes('→')
      && same(stemChangedForms(verb, IRREGULAR[verb]))) {
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
  for (const { tense } of TENSES) {
    for (const verb of new Set(verbsToAdd(tense, bookVerbs))) {
      const f = forms(verb, tense);
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
    const { theme, irregular } = classify(a.verb, a.tense, families.get(`${a.verb}|${a.tense}`));
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
