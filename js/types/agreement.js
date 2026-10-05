/* Maak het bijvoeglijk naamwoord passend: "la camisa ___ (amarillo)" →
 * amarilla. Geslacht en getal moeten kloppen, en dat zie je aan het
 * zelfstandig naamwoord ervoor.
 *
 * Niet elk bijvoeglijk naamwoord past bij elk zelfstandig naamwoord ("la
 * paella enferma"). Daarom per soort een eigen onderwerp: kleuren bij
 * kledingstukken, nationaliteiten en ziektes bij mensen, met ser of estar. */

import { el, sample, accentBar } from '../dom.js';
import { allAtoms, getTheme } from '../data.js';
import { checkAnswer, expandVariants, stripAccents } from '../check.js';

const PEOPLE = [
  { es: 'el chico', g: 'm', n: 'sg' }, { es: 'la chica', g: 'f', n: 'sg' },
  { es: 'los chicos', g: 'm', n: 'pl' }, { es: 'las chicas', g: 'f', n: 'pl' },
  { es: 'mi padre', g: 'm', n: 'sg' }, { es: 'mi madre', g: 'f', n: 'sg' },
  { es: 'mis hermanos', g: 'm', n: 'pl' }, { es: 'mis hermanas', g: 'f', n: 'pl' },
];

/* Thema → hoe de zin eruitziet. `verb` per getal; null = geen werkwoord. */
const KINDS = {
  kleuren: { subjects: () => clothes(), verb: null },
  'nationaliteiten-europa': { subjects: () => PEOPLE, verb: { sg: 'es', pl: 'son' } },
  'nationaliteiten-wereld': { subjects: () => PEOPLE, verb: { sg: 'es', pl: 'son' } },
  gezondheid: { subjects: () => PEOPLE, verb: { sg: 'está', pl: 'están' } },
  klachten: { subjects: () => PEOPLE, verb: { sg: 'está', pl: 'están' } },
};

/* Naranja en rosa zijn ook zelfstandige naamwoorden en blijven in de spreektaal
 * vaak onveranderd ("camisas rosa"): daar is geen eenduidig antwoord. */
const SKIP = new Set(['naranja', 'rosa']);

let clothesCache = null;
function clothes() {
  return (clothesCache ??= allAtoms()
    .filter(a => a.kind === 'vocab' && a.pos === 'noun' && a.gender && a.number
      && getTheme(a.theme)?.group === 'g-kleding' && a.theme !== 'kleuren'
      && /^(el|la|los|las) \S+$/.test(a.es))
    .map(a => ({ es: a.es, g: a.gender, n: a.number, nl: a.nl[0] })));
}

/** Meervoud van een bijvoeglijk naamwoord: rojo → rojos, azul → azules, alemán → alemanes. */
/* Eén woord: geen ¿ of ¡ nodig. */
const WORD_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];

export function pluralOf(w) {
  if (/[aeiou]$/.test(w)) return `${w}s`;
  if (/z$/.test(w)) return `${w.slice(0, -1)}ces`;
  // De klemtoon blijft staan, dus het accent op de laatste lettergreep valt weg.
  const m = w.match(/^(.*)([áéíóú])([ns])$/);
  if (m) return `${m[1]}${stripAccents(m[2])}${m[3]}es`;
  return `${w}es`;
}

/** De vier vormen [m.sg, f.sg, m.pl, f.pl] uit de woordenlijstnotatie. */
export function formsOf(es) {
  const variants = expandVariants(es);
  const m = variants[0];
  const f = variants[1] ?? m;
  return { m: { sg: m, pl: pluralOf(m) }, f: { sg: f, pl: pluralOf(f) } };
}

export default {
  id: 'agreement',
  label: 'Maak het passend',

  supports(item) {
    const a = item.atom;
    if (a.kind !== 'vocab' || a.pos !== 'adj' || item.direction !== 'es2nl') return false;
    if (!KINDS[a.theme] || /\s/.test(a.es) || SKIP.has(a.es)) return false;
    return KINDS[a.theme].subjects().length > 0;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const kind = KINDS[atom.theme];
    const forms = formsOf(atom.es);
    // Mannelijk enkelvoud staat al tussen haakjes: dat is geen oefening.
    const useful = kind.subjects().filter(s => forms[s.g][s.n] !== forms.m.sg);
    const subject = sample(useful.length ? useful : kind.subjects(), 1)[0];
    const answer = forms[subject.g][subject.n];
    const all = [forms.m.sg, forms.f.sg, forms.m.pl, forms.f.pl];
    const base = forms.m.sg;
    const verb = kind.verb?.[subject.n];

    root.append(
      el('p', { class: 'q-instruction' }, 'Maak het bijvoeglijk naamwoord passend'),
      el('div', { class: 'q-prompt q-prompt--sentence', lang: 'es' },
        el('span', {}, `${subject.es}${verb ? ` ${verb}` : ''} `),
        el('span', { class: 'q-blank' }, '___'),
        el('span', { class: 'q-infinitive' }, ` (${base})`)),
      el('p', { class: 'q-hint' }, [subject.nl, `${base} = ${atom.nl[0]}`].filter(Boolean).join(' · ')),
    );

    const input = el('input', {
      class: 'answer-input', type: 'text', lang: 'es',
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      placeholder: 'en español…', 'aria-label': `${subject.es} ${verb ?? ''} … (${base})`,
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    root.append(input, accentBar(input, () => ctx.ready(input.value.trim().length > 0), WORD_KEYS));

    const what = `${subject.g === 'f' ? 'vrouwelijk' : 'mannelijk'} ${subject.n === 'pl' ? 'meervoud' : 'enkelvoud'}`;
    return {
      focus() { input.focus(); },
      check() {
        // De andere drie vormen zijn nooit een typefout: dat is net de oefening.
        const r = checkAnswer(input.value, [answer], { rejectNear: all.filter(f => f !== answer) });
        return {
          ...r, given: input.value,
          expected: `${subject.es}${verb ? ` ${verb}` : ''} ${answer}`,
          note: r.correct && !r.almost ? null
            : `${subject.es} is ${what}: ${answer}.${forms.m.sg === forms.f.sg ? ` ${base} is gelijk voor mannelijk en vrouwelijk.` : ''}`,
        };
      },
      reveal({ correct, almost }) {
        input.disabled = true;
        input.classList.add(almost ? 'is-almost' : correct ? 'is-correct' : 'is-wrong');
      },
    };
  },
};
