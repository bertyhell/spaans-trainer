/* Kennismaking: een nieuw woord eerst laten zien, pas daarna vragen.
 *
 * Zonder dit was de eerste ontmoeting met la corbata een meerkeuzevraag: raden.
 * Nu komt er een kaart met het woord, de uitspraak, de vertaling, een
 * ezelsbrug en een zin uit de cursus. Twee vragen later volgt de eerste vraag
 * (zie session.withIntros), zodat die toetst of het bleef hangen, niet of je
 * het net nog zag staan. Een kaart telt niet als vraag en verschuift geen doos. */

import { el, speakerButton } from './dom.js';
import { contextsFor } from './data.js';
import { genderRule } from './hints.js';

const GENDER = { m: 'mannelijk', f: 'vrouwelijk' };

/** Een voorbeeldzin met het woord vet. */
function example(atom) {
  const ctx = contextsFor(atom).find(c => c.nl) ?? contextsFor(atom)[0];
  if (!ctx) return null;
  const before = ctx.es.slice(0, ctx.at);
  const after = ctx.es.slice(ctx.at + ctx.surface.length);
  return el('div', { class: 'intro-example' },
    el('p', { lang: 'es' }, before, el('strong', {}, ctx.surface), after),
    ctx.nl ? el('p', { class: 'intro-example-nl' }, ctx.nl) : null);
}

export function renderIntro(item, root, { speech }) {
  const { atom } = item;
  const gender = atom.pos === 'noun' && GENDER[atom.gender];
  const rule = atom.pos === 'noun' ? genderRule(atom) : null;

  root.append(
    el('p', { class: 'q-instruction' }, '✨ Nieuw woord'),
    el('div', { class: 'intro-card' },
      atom.emoji ? el('span', { class: 'intro-emoji', 'aria-hidden': 'true' }, atom.emoji) : null,
      el('div', { class: 'intro-es' },
        el('span', { class: 'q-word', lang: 'es' }, atom.es),
        speakerButton(atom.es, speech)),
      el('p', { class: 'intro-nl', lang: 'nl' }, atom.nl.join(', ')),
      gender ? el('p', { class: 'intro-meta' }, `${gender}${atom.number === 'pl' ? ', meervoud' : ''}`) : null,
      atom.memo ? el('p', { class: 'intro-memo' }, `💡 ${atom.memo}`) : null,
      !atom.memo && rule ? el('p', { class: 'intro-memo' }, `💡 ${rule}`) : null,
      example(atom),
    ),
    el('p', { class: 'q-hint intro-later' }, 'Kijk en luister goed: straks vragen we het.'),
  );
  setTimeout(() => speech.speak(atom.es), 250);
}
