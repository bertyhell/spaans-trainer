/* Tik op een woord in een leestekst en zie wat het betekent.
 *
 * Een tekst van 150 woorden met drie onbekende woorden is onleesbaar als je
 * telkens naar een woordenboek moet. Hier volstaat één tik. De betekenis komt
 * uit de cursus zelf:
 *   1. de woordenlijst                       playa → het strand
 *   2. een vervoegde vorm van een werkwoord  fuimos → ir/ser (gaan/zijn), wij, indefinido
 *   3. een meervoud of vrouwelijke vorm      playas → playa, cansada → cansado
 *   4. een klein lijstje gewone woordjes     pero → maar
 * Wat nergens in staat, is niet aantikbaar: liever niets dan iets fouts. */

import { el } from './dom.js';
import { vocabByEs, conjugationsOfForm, verbTranslation, PERSON_LABELS, TENSE_LABELS } from './data.js';
import { stripAccents } from './check.js';

/* Woordjes die overal staan maar niet in de woordenlijst van het boek. */
const SMALL_WORDS = {
  el: 'de (m.)', la: 'de (v.)', los: 'de (m. mv.)', las: 'de (v. mv.)', un: 'een (m.)', una: 'een (v.)',
  unos: 'enkele (m.)', unas: 'enkele (v.)', y: 'en', o: 'of', pero: 'maar', que: 'dat, die, wat',
  de: 'van', del: 'van de', a: 'naar, aan', al: 'naar de', en: 'in, op', con: 'met', sin: 'zonder',
  por: 'door, voor, via', para: 'voor, om te', desde: 'sinds, vanaf', hasta: 'tot', entre: 'tussen',
  sobre: 'over, op', mi: 'mijn', mis: 'mijn (mv.)', tu: 'jouw', tus: 'jouw (mv.)', su: 'zijn, haar, uw',
  sus: 'zijn, haar, uw (mv.)', nuestro: 'ons', nuestra: 'onze', yo: 'ik', tú: 'jij', él: 'hij', ella: 'zij',
  nosotros: 'wij', vosotros: 'jullie', ellos: 'zij (mv.)', ellas: 'zij (v. mv.)', usted: 'u',
  me: 'me, mij', te: 'je, jou', se: 'zich', nos: 'ons', le: 'hem, haar (meewerkend)', les: 'hun',
  lo: 'het, hem', no: 'niet, nee', sí: 'ja', si: 'als, indien', muy: 'heel, zeer', más: 'meer',
  menos: 'minder', también: 'ook', tampoco: 'ook niet', ya: 'al', todavía: 'nog', cuando: 'wanneer, als',
  como: 'zoals, als', porque: 'omdat', este: 'deze', esta: 'deze', esto: 'dit', ese: 'die', esa: 'die',
  eso: 'dat', todo: 'alles, heel', todos: 'iedereen, alle', mucho: 'veel', mucha: 'veel', muchos: 'veel',
  muchas: 'veel', hay: 'er is, er zijn', qué: 'wat', dónde: 'waar', cómo: 'hoe', cuándo: 'wanneer',
  quién: 'wie', cuál: 'welke', ahora: 'nu', aquí: 'hier', allí: 'daar', siempre: 'altijd', nunca: 'nooit',
};

const REFLEXIVE = ['me', 'te', 'se', 'nos', 'os'];
const TENSE_SHORT = t => (TENSE_LABELS[t] ?? t).split(' · ')[0];

/** Mogelijke grondvormen van een woord: playas → playa, cansada → cansado. */
function baseForms(w) {
  const out = [];
  if (w.endsWith('es')) out.push(w.slice(0, -2));
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  if (w.endsWith('a')) out.push(`${w.slice(0, -1)}o`);
  if (w.endsWith('as')) out.push(`${w.slice(0, -2)}o`);
  if (w.endsWith('ces')) out.push(`${w.slice(0, -3)}z`);
  return out;
}

/**
 * Wat een woord betekent, of null.
 * @returns {{word, lines: string[]}|null}
 */
export function glossFor(raw) {
  const word = String(raw).toLowerCase().replace(/^[¿¡"«(—–-]+|[.,;:!?"»)…—–-]+$/g, '');
  if (!word || !/\p{L}/u.test(word)) return null;
  const lines = [];
  const vocabLine = a => `${a.es} = ${a.nl.slice(0, 2).join(', ')}`;

  for (const a of vocabByEs(word).slice(0, 2)) lines.push(vocabLine(a));

  // Wederkerende vormen staan met hun voornaamwoord in de data: "me levanto".
  const conj = [word, ...REFLEXIVE.map(p => `${p} ${word}`)].flatMap(conjugationsOfForm);
  const byVerb = new Map();
  for (const c of conj) {
    if (!byVerb.has(c.verb)) byVerb.set(c.verb, []);
    byVerb.get(c.verb).push(c);
  }
  for (const [verb, forms] of [...byVerb].slice(0, 2)) {
    const nl = verbTranslation(verb);
    const how = forms.slice(0, 2).map(c => `${PERSON_LABELS[c.person].split(' / ')[0]}, ${TENSE_SHORT(c.tense)}`).join('; ');
    lines.push(`${verb}${nl ? ` (${nl})` : ''} — ${how}`);
  }

  // Een voltooid deelwoord: "dividido" staat als "ha dividido" in de perfecto.
  if (!lines.length && /(ado|ido|to|cho|sto)$/.test(word)) {
    const verb = conjugationsOfForm(`ha ${word}`)[0]?.verb;
    if (verb) {
      const nl = verbTranslation(verb);
      lines.push(`voltooid deelwoord van ${verb}${nl ? ` (${nl})` : ''}`);
    }
  }

  if (!lines.length) {
    for (const base of baseForms(word)) {
      const hits = vocabByEs(base);
      if (hits.length) { lines.push(`${vocabLine(hits[0])} · hier: ${word}`); break; }
    }
  }

  const small = SMALL_WORDS[word] ?? SMALL_WORDS[stripAccents(word)];
  if (!lines.length && small) lines.push(`${word} = ${small}`);

  return lines.length ? { word, lines } : null;
}

/* Eén ballonnetje voor de hele app. */
let pop = null;
let popFor = null;

function hidePop() {
  pop?.remove();
  pop = null;
  popFor?.classList.remove('is-active');
  popFor = null;
}

function showPop(span, gloss) {
  hidePop();
  popFor = span;
  span.classList.add('is-active');
  pop = el('div', { class: 'gloss-pop', role: 'tooltip' }, gloss.lines.map(l => el('div', {}, l)));
  document.body.append(pop);
  const r = span.getBoundingClientRect();
  const w = pop.offsetWidth;
  const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
  const below = r.bottom + 8 + pop.offsetHeight < window.innerHeight;
  pop.style.left = `${left + window.scrollX}px`;
  pop.style.top = `${(below ? r.bottom + 6 : r.top - pop.offsetHeight - 6) + window.scrollY}px`;
}

// Buiten de browser (de tests) is er geen document.
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', e => {
    if (pop && !e.target.closest('.gloss-word, .gloss-pop')) hidePop();
  });
  document.addEventListener('scroll', hidePop, true);
}

/**
 * Een alinea waarin elk gekend woord aantikbaar is.
 * @param text  Spaanse tekst
 */
export function glossedParagraph(text) {
  const p = el('p', {});
  for (const part of text.split(/(\s+)/)) {
    if (!part.trim()) { p.append(part); continue; }
    const gloss = glossFor(part);
    if (!gloss) { p.append(part); continue; }
    // Leestekens vóór en na het woord blijven erbuiten.
    const [, lead, core, tail] = part.match(/^([¿¡"«(—–-]*)(.*?)([.,;:!?"»)…—–-]*)$/u);
    const span = el('span', {
      class: 'gloss-word', tabindex: '0', role: 'button', 'aria-label': `${core}: ${gloss.lines.join('; ')}`,
      onclick: () => (popFor === span ? hidePop() : showPop(span, gloss)),
      onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPop(span, gloss); } },
    }, core);
    p.append(lead, span, tail);
  }
  return p;
}

export { hidePop as hideGloss };
