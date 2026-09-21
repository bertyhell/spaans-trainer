/* Minimale DOM-hulpjes. Bewust klein gehouden: dit is geen framework. */

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
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

export const clear = node => { while (node.firstChild) node.removeChild(node.firstChild); };

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** n willekeurige elementen uit een lijst. */
export const sample = (arr, n) => shuffle(arr).slice(0, n);

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
