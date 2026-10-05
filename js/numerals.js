/* Getallen, uren, data en prijzen — berekend in plaats van opgeslagen.
 *
 * Een "numeral"-atoom is een soort getal (n.31-99, t.kwartier, p.prijs …),
 * geen vast getal. Bij elke vraag kiest generate() een nieuw voorbeeld, zodat
 * er nooit twee keer hetzelfde komt. De Leitner-doos hoort bij de soort: wie
 * de kwartieren kent, krijgt ze minder vaak.
 *
 * Elk voorbeeld heeft drie gezichten:
 *   display   wat je ziet: "345", "7:15", "15/3", "12,50 €"
 *   words     hoe je het zegt: "trescientos cuarenta y cinco"
 *   accepted  andere juiste schrijfwijzen ("las siete y cuarto" naast "son las …")
 * en isDigits() kijkt een in cijfers getypt antwoord na. */

const UNITS = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
];
const TENS = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta', 6: 'sesenta', 7: 'setenta', 8: 'ochenta', 9: 'noventa' };
const HUNDREDS = {
  1: 'ciento', 2: 'doscientos', 3: 'trescientos', 4: 'cuatrocientos', 5: 'quinientos',
  6: 'seiscientos', 7: 'setecientos', 8: 'ochocientos', 9: 'novecientos',
};

function below100(n) {
  if (n < 30) return UNITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u ? `${TENS[t]} y ${UNITS[u]}` : TENS[t];
}

function below1000(n) {
  if (n === 100) return 'cien';
  if (n < 100) return below100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r ? `${HUNDREDS[h]} ${below100(r)}` : HUNDREDS[h];
}

/** "uno" wordt "un" vóór een zelfstandig naamwoord of "mil": veintiún euros, un millón. */
export const apocope = words => words
  .replace(/veintiuno$/, 'veintiún')
  .replace(/(^|\s)uno$/, '$1un');

/**
 * Een getal (0 – 999 999) voluit, in de telvorm: "uno", "veintiuno".
 * @param noun  true vóór een zelfstandig naamwoord: "un", "veintiún".
 */
export function numberWords(n, { noun = false } = {}) {
  if (!Number.isInteger(n) || n < 0 || n > 999999) throw new RangeError(`getal buiten bereik: ${n}`);
  let out;
  if (n < 1000) out = below1000(n);
  else {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const head = th === 1 ? 'mil' : `${apocope(below1000(th))} mil`;
    out = r ? `${head} ${below1000(r)}` : head;
  }
  return noun ? apocope(out) : out;
}

/* ------------------------------------------------------------------ */
/* Het uur                                                             */
/* ------------------------------------------------------------------ */

const hourWord = h => (h === 1 ? 'una' : numberWords(h));

/**
 * "son las siete y cuarto" voor 7:15; na het halfuur telt het volgende uur:
 * 6:45 is "son las siete menos cuarto".
 * @returns {{words: string, accepted: string[]}}
 */
export function timeWords(h, m) {
  const hour = m > 30 ? (h % 12) + 1 : h;
  const rest = m === 0 ? '' : m === 15 ? ' y cuarto' : m === 30 ? ' y media' : m === 45 ? ' menos cuarto'
    : m < 30 ? ` y ${numberWords(m)}` : ` menos ${numberWords(60 - m)}`;
  // Wie kwartier of half in minuten zegt, heeft het ook juist.
  const restAlt = m === 15 ? ' y quince' : m === 30 ? ' y treinta' : m === 45 ? ' menos quince' : null;
  const lead = hour === 1 ? 'es la' : 'son las';
  const core = [`${hourWord(hour)}${rest}`, ...(restAlt ? [`${hourWord(hour)}${restAlt}`] : [])];
  if (m === 0) core.push(`${hourWord(hour)} en punto`);
  const accepted = core.flatMap(c => [`${lead} ${c}`, `${lead.split(' ')[1]} ${c}`, c]);
  // Zoals een digitale klok het leest: "las doce y cuarenta y cinco". Niet
  // fout, maar na het halfuur telt men meestal af van het volgende uur.
  const ownLead = h === 1 ? 'es la' : 'son las';
  const digital = m > 30
    ? [`${ownLead} ${hourWord(h)} y ${numberWords(m)}`, `${ownLead.split(' ')[1]} ${hourWord(h)} y ${numberWords(m)}`, `${hourWord(h)} y ${numberWords(m)}`]
    : [];
  return { words: `${lead} ${core[0]}`, accepted, digital };
}

/* ------------------------------------------------------------------ */
/* Datum en prijs                                                      */
/* ------------------------------------------------------------------ */

export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function dateWords(day, month) {
  const m = MONTHS[month - 1];
  const days = [numberWords(day), ...(day === 1 ? ['primero'] : [])];
  return { words: `el ${days[0]} de ${m}`, accepted: days.flatMap(d => [`el ${d} de ${m}`, `${d} de ${m}`]) };
}

export function priceWords(euros, cents) {
  const e = `${numberWords(euros, { noun: true })} ${euros === 1 ? 'euro' : 'euros'}`;
  if (!cents) return { words: e, accepted: [e] };
  const c = numberWords(cents);
  const ce = numberWords(cents, { noun: true });
  return {
    words: `${e} con ${c}`,
    // Zo zegt men het ook aan de kassa: "doce con cincuenta".
    accepted: [`${e} con ${c}`, `${e} ${c}`, `${e} con ${ce} céntimos`, `${e} y ${ce} céntimos`, `${numberWords(euros)} con ${c}`],
  };
}

/* ------------------------------------------------------------------ */
/* Generatoren per soort                                               */
/* ------------------------------------------------------------------ */

const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const CENTS = [10, 20, 25, 30, 40, 45, 50, 60, 75, 80, 90, 95, 99];

/** Een getal uit het bereik; boven de duizend een "rond" getal zoals in het echt. */
function numberIn(min, max) {
  if (max < 1000) return rnd(min, max);
  return pick([rnd(min, max), Math.round(rnd(min, max) / 100) * 100, Math.round(rnd(min, max) / 10) * 10]);
}

export const GENERATORS = {
  number(atom) {
    const n = numberIn(atom.min, atom.max);
    return { kind: 'number', value: n, display: String(n), words: numberWords(n), accepted: [numberWords(n)] };
  },
  year(atom) {
    const n = rnd(atom.min, atom.max);
    return { kind: 'year', value: n, display: String(n), words: numberWords(n), accepted: [numberWords(n)] };
  },
  time(atom) {
    const h = rnd(1, 12);
    const m = pick(atom.minutes);
    const { words, accepted, digital } = timeWords(h, m);
    return { kind: 'time', value: [h, m], display: `${h}:${String(m).padStart(2, '0')}`, words, accepted, digital };
  },
  date() {
    const month = rnd(1, 12);
    const day = rnd(1, MONTH_DAYS[month - 1]);
    const { words, accepted } = dateWords(day, month);
    return { kind: 'date', value: [day, month], display: `${day}/${month}`, words, accepted };
  },
  price(atom) {
    const euros = rnd(atom.min ?? 1, atom.max ?? 99);
    const cents = Math.random() < 0.3 ? 0 : pick(CENTS);
    const { words, accepted } = priceWords(euros, cents);
    const display = cents ? `${euros},${String(cents).padStart(2, '0')} €` : `${euros} €`;
    return { kind: 'price', value: [euros, cents], display, words, accepted };
  },
};

/** Een nieuw voorbeeld voor dit atoom. */
export const generate = atom => GENERATORS[atom.gen](atom);

/* ------------------------------------------------------------------ */
/* Antwoorden in cijfers                                               */
/* ------------------------------------------------------------------ */

const digitsOnly = s => String(s).replace(/[^\d]/g, '');

/**
 * Kijkt een antwoord in cijfers na. Vergevingsgezind in de schrijfwijze:
 * 7:15, 7.15, 7u15 en 19:15 zijn allemaal kwart over zeven; 12,50, 12.50 en
 * 12,5 € dezelfde prijs; 15/3, 15-03 en 15.3 dezelfde datum.
 */
export function isDigits(sample, input) {
  const raw = String(input ?? '').trim().toLowerCase();
  if (!raw) return false;
  switch (sample.kind) {
    case 'number':
    case 'year':
      // Duizendtallen mogen met een punt of spatie: 12.000 of 12 000.
      return /^[\d .]+$/.test(raw) && Number(digitsOnly(raw)) === sample.value;
    case 'time': {
      const m = raw.match(/^(\d{1,2})\s*[:.hu]\s*(\d{2})$/) ?? raw.match(/^(\d{1,2})$/);
      if (!m) return false;
      const [h, min] = [Number(m[1]), Number(m[2] ?? 0)];
      return h % 12 === sample.value[0] % 12 && min === sample.value[1];
    }
    case 'date': {
      const m = raw.match(/^(\d{1,2})\s*[/.\-\s]\s*(\d{1,2})$/);
      return Boolean(m) && Number(m[1]) === sample.value[0] && Number(m[2]) === sample.value[1];
    }
    case 'price': {
      const m = raw.replace(/€|eur(o|os)?/g, '').trim().match(/^(\d+)(?:[.,](\d{1,2}))?$/);
      if (!m) return false;
      const cents = m[2] ? Number(m[2].padEnd(2, '0')) : 0;
      return Number(m[1]) === sample.value[0] && cents === sample.value[1];
    }
    default:
      return false;
  }
}

/** Wat je typt bij een cijferantwoord, als voorbeeld in het invoerveld. */
export const DIGIT_PLACEHOLDER = { number: '123', year: '1999', time: '7:15', date: '15/3', price: '12,50' };

/**
 * Drie verwarrende alternatieven in cijfers: sesenta/setenta, quinientos/
 * cincuenta, een uur te vroeg of te laat, dag en maand omgedraaid.
 */
export function confusables(sample) {
  const out = new Set();
  const add = v => { if (v !== sample.display) out.add(v); };
  switch (sample.kind) {
    case 'number':
    case 'year': {
      const n = sample.value;
      const swap = { 6: 7, 7: 6, 5: 4, 4: 5, 2: 3, 3: 2, 9: 8, 8: 9 };
      const s = String(n);
      // Eén cijfer verwisseld met zijn "klankbuur": sesenta ↔ setenta.
      for (let i = 0; i < s.length && out.size < 2; i++) {
        if (swap[s[i]] != null) add(s.slice(0, i) + swap[s[i]] + s.slice(i + 1));
      }
      // quinientos ↔ cincuenta: honderdtal en tiental door elkaar.
      if (n >= 100 && n < 1000 && n % 100 === 0) add(String(n / 10));
      for (const v of [n + 10, n - 10, n + 1, n - 1, n + 2, n + 20]) if (v >= 0) add(String(v));
      break;
    }
    case 'time': {
      const [h, m] = sample.value;
      const fmt = (hh, mm) => `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')}`;
      if (m > 30) add(fmt(h + 1, m));                    // "siete menos cuarto" ≠ 7:45
      if (m) add(fmt(h, 60 - m));
      add(fmt(h + 1, m));
      add(fmt(h - 1, m));
      add(fmt(h, (m + 15) % 60));
      break;
    }
    case 'date': {
      const [d, mo] = sample.value;
      if (mo <= 12 && d <= 12 && d !== mo) add(`${mo}/${d}`);
      add(`${d}/${(mo % 12) + 1}`);
      add(`${(d % 28) + 1}/${mo}`);
      add(`${d}/${((mo + 10) % 12) + 1}`);
      break;
    }
    case 'price': {
      const [e, c] = sample.value;
      const fmt = (ee, cc) => (cc ? `${ee},${String(cc).padStart(2, '0')} €` : `${ee} €`);
      add(fmt(e, c ? 0 : 50));
      add(fmt(e + 10, c));
      add(fmt(Math.max(1, e - 1), c));
      add(fmt(e, (c + 5) % 100));
      break;
    }
  }
  return [...out].slice(0, 3);
}
