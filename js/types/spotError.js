/* Zoek de fout: in een zin uit de cursus zit één woord dat niet klopt. Tik erop.
 *
 * De fout wordt er door de app in gezet, en alleen waar ze zonder twijfel fout
 * is. Een andere persoon van het werkwoord is op zich geen fout ("comemos pan"
 * en "comen pan" kloppen allebei), dus enkel twee soorten:
 *
 *   - lidwoord en zelfstandig naamwoord: "el casa". Alleen bij een woord uit de
 *     woordenlijst met één vast geslacht, en nooit bij een vrouwelijk woord op
 *     een (agua, aula, hambre): dat krijgt soms juist el.
 *   - onderwerp en werkwoord: "yo comes". Alleen met het voornaamwoord er
 *     uitdrukkelijk bij, en niet na een voorzetsel: in "con él hablo" is él
 *     geen onderwerp.
 *
 * Wie het andere woord van het paar aantikt, heeft het ook gezien: in
 * "yo comes" kan je evengoed yo als comes de fout noemen. */

import { el, sample, optionList, speakerButton } from '../dom.js';
import { allAtoms, conjugationsOfForm, conjugationFamily } from '../data.js';
import { expandVariants } from '../check.js';
import { tokenize, bare } from './wordBank.js';
import { pluralOf } from './agreement.js';

const MIN_WORDS = 4;
const MAX_WORDS = 12;

/* lidwoord -> [geslacht, getal] */
const ARTICLE = {
  el: ['m', 'sg'], la: ['f', 'sg'], los: ['m', 'pl'], las: ['f', 'pl'],
  un: ['m', 'sg'], una: ['f', 'sg'], unos: ['m', 'pl'], unas: ['f', 'pl'],
};
const SWAP = { el: 'la', la: 'el', los: 'las', las: 'los', un: 'una', una: 'un', unos: 'unas', unas: 'unos' };

const PRONOUN = {
  yo: '1s', 'tú': '2s', 'él': '3s', ella: '3s', usted: '3s',
  nosotros: '1p', nosotras: '1p', vosotros: '2p', vosotras: '2p',
  ellos: '3p', ellas: '3p', ustedes: '3p',
};
/* Tussen onderwerp en werkwoord: "yo no me llamo". */
const BETWEEN = new Set(['no', 'me', 'te', 'se', 'nos', 'os', 'lo', 'la', 'le', 'los', 'las', 'les']);
/* Na een voorzetsel is het voornaamwoord geen onderwerp. */
const PREPOSITION = new Set([
  'a', 'con', 'de', 'para', 'por', 'sin', 'en', 'entre', 'según', 'hacia', 'contra', 'sobre',
  'que', 'como',
]);

/* Vrouwelijke woorden op een beklemtoonde a krijgen el: el agua, el aula.
 * Welke a beklemtoond is, weten we niet zeker; dus alle vrouwelijke op (h)a. */
const FEMININE_EL = /^h?[aá]/;

let genderCache = null;
/** Zelfstandig naamwoord (kleine letters, met accenten) -> [geslacht, getal]. */
export function nounGenders() {
  if (genderCache) return genderCache;
  const seen = new Map();
  const add = (word, tag) => {
    if (!seen.has(word)) seen.set(word, new Set());
    seen.get(word).add(tag);
  };
  for (const a of allAtoms()) {
    if (a.kind !== 'vocab' || a.pos !== 'noun') continue;
    for (const variant of expandVariants(a.es)) {
      const m = variant.match(/^(el|la|los|las) (\p{Ll}+)$/u);
      if (!m) continue;
      const [, article, noun] = m;
      const [g, n] = ARTICLE[article];
      // el agua: het lidwoord zegt iets anders dan het geslacht. Nooit gebruiken.
      if (!a.gender || a.gender !== g || (g === 'f' && FEMININE_EL.test(noun))) {
        add(noun, '?');
        continue;
      }
      add(noun, `${g}|${n}`);
      if (n === 'sg') add(pluralOf(noun), `${g}|pl`);
    }
  }
  // Een woord met twee geslachten (el / la cura) of een twijfelgeval valt weg.
  genderCache = new Map([...seen]
    .filter(([, tags]) => tags.size === 1 && !tags.has('?'))
    .map(([w, tags]) => [w, [...tags][0].split('|')]));
  return genderCache;
}

/** Zet de nieuwe tekst in een token, met dezelfde hoofdletter en leestekens. */
function replaceWord(token, word) {
  const core = bare(token);
  const cased = /^\p{Lu}/u.test(core) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  return token.replace(core, cased);
}

const corruptionCache = new Map();

/**
 * Alle fouten die je zonder twijfel in deze zin kan zetten.
 * @returns {{at: number, pair: number[], wrongs: string[], right: string,
 *            from: number, to: number, note: (wrong) => string}[]}
 *   at: het woord dat verandert; wrongs: wat er in de plaats kan komen;
 *   pair: woorden die als "de fout" tellen; from/to: het stukje zin dat in
 *   de verbetering komt.
 */
export function corruptionsFor(atom) {
  if (corruptionCache.has(atom.id)) return corruptionCache.get(atom.id);
  const out = [];
  if (atom.kind === 'sentence' || atom.kind === 'dialogue') {
    const words = tokenize(atom.es);
    if (words.length >= MIN_WORDS && words.length <= MAX_WORDS) {
      const low = words.map(w => bare(w).toLowerCase());
      const genders = nounGenders();

      for (let i = 0; i < low.length - 1; i++) {
        // Een leesteken na het lidwoord ("la, …") betekent dat het er niet bij hoort.
        if (!SWAP[low[i]] || bare(words[i]) !== words[i]) continue;
        // Met een hoofdletter midden in de zin is het een naam: "El Dorada".
        const g = /^\p{Ll}/u.test(bare(words[i + 1])) && genders.get(low[i + 1]);
        if (!g) continue;
        const [gender, number] = ARTICLE[low[i]];
        if (g[0] !== gender || g[1] !== number) continue;
        const noun = low[i + 1];
        out.push({
          at: i, pair: [i, i + 1], wrongs: [SWAP[low[i]]], right: low[i], from: i, to: i + 1,
          note: () => `${noun} is ${gender === 'f' ? 'vrouwelijk' : 'mannelijk'}: ${low[i]} ${noun}.`,
        });
      }

      for (let i = 0; i < low.length - 1; i++) {
        const person = PRONOUN[low[i]];
        if (!person || PREPOSITION.has(low[i - 1])) continue;
        let j = i + 1;
        while (j < low.length && BETWEEN.has(low[j])) j++;
        if (j >= low.length) continue;
        const conj = conjugationsOfForm(low[j]).find(c => c.person === person);
        if (!conj) continue;
        // Een vorm die bij díé persoon ook bestaat (hablaba is yo én él) is geen fout.
        const options = conjugationFamily(conj).filter(o => o.person !== person
          && !/\s/.test(o.form)
          && o.form.toLowerCase() !== low[j]
          && !conjugationsOfForm(o.form).some(x => x.person === person));
        if (!options.length) continue;
        out.push({
          at: j, pair: [i, j], wrongs: [...new Set(options.map(o => o.form.toLowerCase()))], right: low[j], from: i, to: j,
          note: wrong => `Bij ${low[i]} hoort ${low[j]}, niet ${wrong}.`,
        });
      }
    }
  }
  corruptionCache.set(atom.id, out);
  return out;
}

/** De zin met de fout erin, als losse woorden. */
export function corruptedWords(atom, c, wrong = c.wrongs[0]) {
  const words = tokenize(atom.es);
  words[c.at] = replaceWord(words[c.at], wrong);
  return words;
}

export default {
  id: 'spotError',
  label: 'Zoek de fout',

  supports: item => corruptionsFor(item.atom).length > 0,

  render(item, root, ctx) {
    const { atom } = item;
    const c = sample(corruptionsFor(atom), 1)[0];
    const wrong = sample(c.wrongs, 1)[0];
    const words = corruptedWords(atom, c, wrong);
    const original = tokenize(atom.es);
    const phrase = ws => ws.slice(c.from, c.to + 1).map(bare).join(' ');
    const wrongPhrase = phrase(words);
    const rightPhrase = phrase(original);

    root.append(
      el('p', { class: 'q-instruction' }, 'Eén woord klopt niet. Tik erop.'),
      atom.nl ? el('p', { class: 'q-hint' }, atom.nl) : null,
    );

    const opts = optionList(words.map((w, i) => ({ value: String(i), label: w })), {
      lang: 'es', className: 'word-chip', onChoose: () => ctx.ready(true),
    });
    opts.list.classList.add('options--words');
    root.append(opts.list);

    const accepted = c.pair.map(String);

    return {
      focus: opts.focus,
      check() {
        const chosen = opts.chosen();
        const ok = accepted.includes(chosen);
        return {
          correct: ok,
          expected: `${wrongPhrase} → ${rightPhrase}`,
          note: c.note(wrong),
          given: chosen == null ? null : bare(words[Number(chosen)]),
        };
      },
      reveal() {
        const chosen = opts.chosen();
        opts.reveal(accepted.includes(chosen) ? chosen : String(c.at));
        const chip = opts.list.querySelector(`[data-value="${c.at}"]`);
        chip.classList.add('is-error');
        chip.replaceChildren(
          el('s', {}, words[c.at]), ' ',
          el('span', { class: 'fix' }, replaceWord(original[c.at], c.right)));
        const sb = speakerButton(atom.es, ctx.speech);
        if (sb) opts.list.after(el('div', { class: 'wordbank-play' }, sb));
      },
    };
  },
};
