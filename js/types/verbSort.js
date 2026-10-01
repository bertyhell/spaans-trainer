/* Sorteer werkwoorden: regelmatig, klankveranderend of onregelmatig. Vijf
 * werkwoorden onder elkaar; elk schuif je opzij naar de juiste kolom.
 *
 * Slepen, tikken op een kolom of de pijltjestoetsen: alle drie werken. Tijdens
 * het slepen licht de kolomnaam op waar het werkwoord zou landen.
 *
 * Elk werkwoord is een eigen verbType-atoom en telt apart mee, net als de
 * vakjes van de vervoegingstabel. */

import { el, shuffle, sample } from '../dom.js';
import { allAtoms, conjugatedForm } from '../data.js';

const ROWS = 5;
const COLUMNS = ['regelmatig', 'klankveranderend', 'onregelmatig'];
const COLUMN_LABELS = { regelmatig: 'regelmatig', klankveranderend: 'klank­veranderend', onregelmatig: 'onregelmatig' };

let verbTypeCache = null;
const verbTypes = () => (verbTypeCache ??= allAtoms().filter(a => a.kind === 'verbType'));

/** "pensar → pienso, piensa": yo en él tonen samen elke soort afwijking. */
const showForms = verb => {
  const forms = ['1s', '3s'].map(p => conjugatedForm(verb, 'presente', p)).filter(Boolean);
  return forms.length ? `${verb} → ${forms.join(', ')}` : verb;
};

/** Het getrokken werkwoord plus minstens één van elke andere soort. */
function pickVerbs(atom) {
  const pool = verbTypes().filter(a => a.verb !== atom.verb);
  const picked = [atom];
  for (const type of COLUMNS) {
    if (type === atom.type) continue;
    picked.push(...sample(pool.filter(a => a.type === type), 1));
  }
  const rest = pool.filter(a => !picked.includes(a));
  picked.push(...sample(rest, ROWS - picked.length));
  return shuffle(picked);
}

export default {
  id: 'verbSort',
  label: 'Sorteer de werkwoorden',

  supports: item => item.atom.kind === 'verbType',

  render(item, root, ctx) {
    const verbs = pickVerbs(item.atom);
    const placed = new Map();   // atom → kolomindex

    root.append(
      el('p', { class: 'q-instruction' }, 'Schuif elk werkwoord naar de juiste kolom'),
      el('p', { class: 'q-hint' }, 'In de tegenwoordige tijd (presente).'),
    );

    const heads = COLUMNS.map(c => el('span', { class: `sort-head sort-head--${c}` }, COLUMN_LABELS[c]));
    const board = el('div', { class: 'sort-board' }, el('div', { class: 'sort-heads' }, heads));
    root.append(board);

    const highlight = col => heads.forEach((h, i) => h.classList.toggle('is-hot', i === col));

    const rows = verbs.map(atom => {
      const tile = el('button', {
        class: 'sort-tile', type: 'button', lang: 'es',
        'aria-label': `${atom.verb}: nog niet gesorteerd`,
      }, atom.verb);
      const cells = COLUMNS.map((c, i) => el('span', {
        class: 'sort-cell', 'aria-hidden': 'true', style: `grid-column: ${i + 1}`,
        onclick: () => place(i),
      }));
      const row = el('div', { class: 'sort-row' }, cells, tile);

      function place(col) {
        if (row.classList.contains('is-done')) return;
        placed.set(atom, col);
        tile.style.gridColumn = String(col + 1);
        tile.classList.add('is-placed');
        tile.setAttribute('aria-label', `${atom.verb}: ${COLUMNS[col]}`);
        ctx.ready(placed.size === verbs.length);
      }

      // Kolom onder een x-positie, binnen de breedte van de rij.
      const columnAt = x => {
        const r = row.getBoundingClientRect();
        return Math.max(0, Math.min(COLUMNS.length - 1, Math.floor((x - r.left) / (r.width / COLUMNS.length))));
      };

      let drag = null;
      tile.addEventListener('pointerdown', e => {
        if (tile.disabled) return;
        drag = { x: e.clientX, id: e.pointerId, moved: false };
        tile.setPointerCapture(e.pointerId);
      });
      tile.addEventListener('pointermove', e => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) < 6) return;
        drag.moved = true;
        tile.classList.add('is-dragging');
        tile.style.transform = `translateX(${dx}px)`;
        highlight(columnAt(e.clientX));
      });
      const end = e => {
        if (!drag || e.pointerId !== drag.id) return;
        const { moved } = drag;
        drag = null;
        tile.classList.remove('is-dragging');
        tile.style.transform = '';
        highlight(-1);
        justDragged = moved && e.type === 'pointerup';
        if (moved && e.type === 'pointerup') place(columnAt(e.clientX));
      };
      tile.addEventListener('pointerup', end);
      tile.addEventListener('pointercancel', end);
      // Een tik zonder slepen schuift naar de volgende kolom. Na het slepen
      // volgt ook een click; die telt niet.
      let justDragged = false;
      tile.addEventListener('click', () => {
        if (justDragged) { justDragged = false; return; }
        const cur = placed.get(atom);
        place(cur == null ? 0 : (cur + 1) % COLUMNS.length);
      });
      tile.addEventListener('keydown', e => {
        const cur = placed.get(atom);
        if (e.key === 'ArrowLeft') place(cur == null ? 0 : Math.max(0, cur - 1));
        else if (e.key === 'ArrowRight') place(cur == null ? COLUMNS.length - 1 : Math.min(COLUMNS.length - 1, cur + 1));
        else if (e.key === 'ArrowDown') tiles[verbs.indexOf(atom) + 1]?.focus();
        else if (e.key === 'ArrowUp') tiles[verbs.indexOf(atom) - 1]?.focus();
        else return;
        e.preventDefault();
      });

      board.append(row);
      return { atom, row, tile };
    });
    const tiles = rows.map(r => r.tile);

    return {
      focus() { if (document.activeElement?.matches('.sort-tile')) document.activeElement.blur(); },

      check() {
        const per = rows.map(({ atom }) => {
          const given = COLUMNS[placed.get(atom)] ?? null;
          return { atomId: atom.id, verb: atom.verb, correct: given === atom.type, given, expected: atom.type };
        });
        const wrong = per.filter(p => !p.correct);
        return {
          correct: !wrong.length,
          expected: per.map(p => `${p.verb}: ${p.expected}`).join(' · '),
          note: wrong.length ? wrong.map(p => `${showForms(p.verb)} is ${p.expected}.`).join(' ') : null,
          given: per.map(p => `${p.verb}: ${p.given ?? '—'}`).join(' · '),
          perAtom: per,
        };
      },

      reveal(result) {
        for (const { atom, row, tile } of rows) {
          const p = result.perAtom?.find(x => x.atomId === atom.id);
          tile.disabled = true;
          row.classList.add('is-done');
          tile.classList.add(p?.correct ? 'is-correct' : 'is-wrong');
          if (p && !p.correct) {
            const col = COLUMNS.indexOf(atom.type);
            row.append(el('span', { class: 'sort-fix', style: `grid-column: ${col + 1}` }, `✓ ${atom.verb}`));
          }
        }
      },
    };
  },
};
