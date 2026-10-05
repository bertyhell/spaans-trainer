/* Meervoud: "la casa" → "las casas". Zelf intypen, met het lidwoord erbij,
 * want daar zit de helft van de oefening.
 *
 * Alleen woorden waarvan het meervoud zeker uit de regel volgt. Woorden op -s
 * of -x (el lunes, el tórax) blijven gelijk, woorden op -y zijn soms -yes en
 * soms -is, en een woord als examen krijgt in het meervoud een accent
 * (exámenes) dat we niet kunnen voorspellen: die vallen weg. Net als
 * leenwoorden op een ongewone medeklinker (el tour → los tours). */

import { el, speakerButton, accentBar } from '../dom.js';
import { checkAnswer } from '../check.js';
import { pluralOf } from './agreement.js';

const PLURAL_ARTICLE = { el: 'los', la: 'las' };
const VOWELS = /[aeiouáéíóú]+/g;

/** "las casas" voor "la casa", of null als het meervoud niet zeker is. */
export function pluralPhrase(es) {
  const m = String(es).match(/^(el|la) (\p{Ll}+)$/u);
  if (!m) return null;
  const [, article, noun] = m;
  if (/[sxyíú]$/.test(noun)) return null;
  // Leenwoorden op een andere medeklinker (el tour, el club) volgen de regel niet.
  if (/[^aeiouáéíóúlrndzj]$/.test(noun) || /ou|w|k/.test(noun)) return null;
  // Klemtoon op de voorlaatste lettergreep zonder accent: in het meervoud
  // schuift die naar de voor-voorlaatste en komt er een accent bij.
  const syllables = noun.match(VOWELS)?.length ?? 0;
  if (/[n]$/.test(noun) && !/[áéíóú]/.test(noun) && syllables >= 2) return null;
  // Vrouwelijk op beklemtoonde a (el agua): lidwoord in het enkelvoud is el,
  // maar in het meervoud las. Dat raden we niet.
  if (article === 'el' && /^h?[aá]/.test(noun) && /a$/.test(noun)) return null;
  return `${PLURAL_ARTICLE[article]} ${pluralOf(noun)}`;
}

export default {
  id: 'plural',
  label: 'Meervoud',

  supports(item) {
    const a = item.atom;
    return a.kind === 'vocab' && a.pos === 'noun' && item.direction === 'es2nl'
      && (a.number == null || a.number === 'sg') && pluralPhrase(a.es) != null;
  },

  render(item, root, ctx) {
    const { atom } = item;
    const answer = pluralPhrase(atom.es);

    root.append(
      el('p', { class: 'q-instruction' }, 'Zet in het meervoud'),
      el('div', { class: 'q-prompt' },
        el('span', { class: 'q-word', lang: 'es' }, atom.es),
        speakerButton(atom.es, ctx.speech)),
      el('p', { class: 'q-hint' }, `(${atom.nl[0]})`),
    );

    const input = el('input', {
      class: 'answer-input', type: 'text',
      autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
      lang: 'es', placeholder: 'los / las …', 'aria-label': 'Meervoud',
      oninput: () => ctx.ready(input.value.trim().length > 0),
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } },
    });
    root.append(el('div', { class: 'input-wrap' }, input),
      accentBar(input, () => ctx.ready(input.value.trim().length > 0), ['á', 'é', 'í', 'ó', 'ú', 'ñ']));

    return {
      focus() { input.focus(); },
      check() {
        // Het lidwoord apart nakijken: "casas" zonder las is half goed, niet goed.
        // checkAnswer laat lidwoorden weg, dus dat kijken we zelf na.
        const [article, noun] = answer.split(' ');
        const typed = input.value.trim().toLowerCase().split(/\s+/);
        const r = checkAnswer(input.value, [answer]);
        if (r.correct && typed[0] !== article) {
          return { correct: false, expected: answer, given: input.value,
            note: typed.length > 1 ? `Meervoud van ${atom.es.split(' ')[0]} is ${article}.` : `Vergeet het lidwoord niet: ${answer}.` };
        }
        let note = r.note ?? null;
        if (!r.correct && checkAnswer(input.value, [noun]).correct) note = `Vergeet het lidwoord niet: ${answer}.`;
        else if (!r.correct && /[zn]$/.test(atom.es)) {
          note = /z$/.test(atom.es) ? 'Op -z: de z wordt c, dan -es.' : 'Op een medeklinker: -es erachter; een accent op de laatste lettergreep valt weg.';
        } else if (!r.correct && /[^aeiouáéíóú]$/.test(atom.es)) note = 'Op een medeklinker: -es erachter.';
        return { ...r, expected: answer, note, given: input.value };
      },
      reveal() { input.disabled = true; },
    };
  },
};
