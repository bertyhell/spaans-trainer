/* Minimale DOM-hulpjes. Bewust klein gehouden: dit is geen framework. */

import { shuffle, sample } from './random.js';

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  const badges = node.classList.contains('q-instruction');
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    if (c instanceof Node) node.append(c);
    else if (badges) node.append(...verbKindBadges(String(c)));
    else node.append(document.createTextNode(String(c)));
  }
  return node;
}

/* In een opdracht springt "regelmatig" (groen) of "onregelmatig" (rood) eruit,
   zodat je meteen ziet wat er gevraagd wordt. */
const VERB_KIND = /(niet regelmatig\w*|onregelmatig\w*|regelmatig\w*)/i;

function verbKindBadges(text) {
  return text.split(VERB_KIND).filter(Boolean).map(part => {
    if (!VERB_KIND.test(part)) return document.createTextNode(part);
    const irregular = /^(on|niet)/i.test(part);
    return el('span', { class: `kind-badge ${irregular ? 'is-irregular' : 'is-regular'}` }, part);
  });
}

export const clear = node => { while (node.firstChild) node.removeChild(node.firstChild); };

export { shuffle, sample };

/* Vlaggetjes: welke taal staat er, of moet je typen? SVG i.p.v. emoji,
   want vlag-emoji tonen niet op Windows. */
export const FLAGS = {
  es: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></svg>',
  nl: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#000"/><rect x="1" width="1" height="2" fill="#FDDA24"/><rect x="2" width="1" height="2" fill="#EF3340"/></svg>',
};

/** Een luidsprekerknop die de Spaanse tekst uitspreekt. */
export function speakerButton(text, speech) {
  if (!speech.available()) return null;
  return el('button', {
    class: 'speaker',
    type: 'button',
    'aria-label': `Spreek uit: ${text}`,
    onclick: e => { e.preventDefault(); speech.speak(text); },
  }, '🔊');
}

/** Markeert welke knop in een lijst gekozen is — ook voor een schermlezer. */
export function markSelected(list, value) {
  list.querySelectorAll('.option').forEach(b => {
    const on = b.dataset.value === value;
    b.classList.toggle('is-selected', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

/**
 * Een lijst keuzeknoppen. Een optie is een string, of { value, label } als de
 * knop meer toont dan zijn waarde. Tikken selecteert; reveal() kleurt het
 * juiste antwoord groen en een foute keuze rood.
 * @returns {{list: HTMLElement, chosen: () => string|null, focus(), reveal(answer)}}
 */
export function optionList(options, { onChoose, compact = false, lang = null, className = '' } = {}) {
  let chosen = null;
  const list = el('div', { class: `options${compact ? ' options--compact' : ''}` });
  for (const opt of options) {
    const { value, label } = typeof opt === 'string' ? { value: opt, label: opt } : opt;
    list.append(el('button', {
      class: `option${className ? ` ${className}` : ''}`, type: 'button',
      dataset: { value }, lang, 'aria-pressed': 'false',
      onclick: () => {
        chosen = value;
        markSelected(list, value);
        onChoose?.(value);
      },
    }, label));
  }
  return {
    list,
    chosen: () => chosen,
    // Geen optie vooraf focussen: pas een pijltje of tik markeert er een.
    focus() { if (document.activeElement?.matches('.option')) document.activeElement.blur(); },
    reveal(answer) {
      list.classList.add('is-revealed');
      list.querySelectorAll('.option').forEach(b => {
        b.disabled = true;
        if (b.dataset.value === answer) b.classList.add('is-correct');
        else if (b.dataset.value === chosen) b.classList.add('is-wrong');
      });
    },
  };
}

/* Spaanse tekens die op een Nederlands toetsenbord lastig zijn. */
export const ACCENT_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

/** Knoppenbalk die een teken invoegt op de plaats van de cursor. */
export function accentBar(input, onInput, keys = ACCENT_KEYS) {
  return el('div', { class: 'accent-bar' }, keys.map(ch =>
    el('button', {
      class: 'accent-key', type: 'button', tabindex: '-1',
      onmousedown: e => e.preventDefault(),   // focus niet stelen
      onclick: () => {
        const s = input.selectionStart ?? input.value.length;
        const e = input.selectionEnd ?? s;
        input.value = input.value.slice(0, s) + ch + input.value.slice(e);
        input.setSelectionRange(s + 1, s + 1);
        input.focus();
        onInput();
      },
    }, ch)));
}

/** Vaste opties in een willekeurige volgorde, zodat de plaats van het juiste
 *  antwoord niets verraadt. Waar/niet waar blijft in die volgorde staan. */
export const shuffleOptions = options =>
  (options.length === 2 && options.includes('verdadero') ? options : shuffle(options));

/** Splitst een zin rond het eerste ___ in [voor, na]; zonder gat is na null. */
export function splitGap(text) {
  const i = text.indexOf('___');
  return i === -1 ? [text, null] : [text.slice(0, i), text.slice(i + 3)];
}
