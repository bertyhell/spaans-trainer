/* Schuifbord: kaartjes onder elkaar, elk schuif je opzij naar een kolom.
 *
 * Slepen, tikken op een kolom of de pijltjestoetsen: alle drie werken. Tijdens
 * het slepen licht de kolomnaam op waar het kaartje zou landen. Een tik op het
 * kaartje zelf schuift het naar de volgende kolom.
 *
 * Gedeeld door "sorteer de werkwoorden" en "welk woord hoort er niet bij?". */

import { el } from './dom.js';

/**
 * @param columns  [{id, label}] — id komt terug als klasse sort-head--{id}
 * @param items    [{name, label?, lang?}] — name voor schermlezers, label is
 *                 wat op het kaartje staat (standaard de name)
 * @param start    kolomindex waar elk kaartje begint, of null: nog niet gesorteerd
 * @param onChange (placedCount) na elke verschuiving
 */
export function sortBoard({ columns, items, start = null, onChange }) {
  const placed = new Map();   // itemindex → kolomindex
  const n = columns.length;

  const heads = columns.map(c => el('span', { class: `sort-head sort-head--${c.id}` }, c.label));
  const board = el('div', { class: 'sort-board', style: `--sort-cols: ${n}` },
    el('div', { class: 'sort-heads' }, heads));

  const highlight = col => heads.forEach((h, i) => h.classList.toggle('is-hot', i === col));

  const rows = items.map((item, idx) => {
    const tile = el('button', {
      class: 'sort-tile', type: 'button', lang: item.lang ?? null,
      'aria-label': `${item.name}: nog niet gesorteerd`,
    }, item.label ?? item.name);
    const cells = columns.map((c, i) => el('span', {
      class: 'sort-cell', 'aria-hidden': 'true', style: `grid-column: ${i + 1}`,
      onclick: () => place(i),
    }));
    const row = el('div', { class: 'sort-row' }, cells, tile);

    function place(col, silent = false) {
      if (row.classList.contains('is-done')) return;
      placed.set(idx, col);
      tile.style.gridColumn = String(col + 1);
      tile.classList.add('is-placed');
      tile.setAttribute('aria-label', `${item.name}: ${columns[col].label}`);
      if (!silent) onChange?.(placed.size);
    }

    // Kolom onder een x-positie, binnen de breedte van de rij.
    const columnAt = x => {
      const r = row.getBoundingClientRect();
      return Math.max(0, Math.min(n - 1, Math.floor((x - r.left) / (r.width / n))));
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
      const cur = placed.get(idx);
      place(cur == null ? 0 : (cur + 1) % n);
    });
    tile.addEventListener('keydown', e => {
      const cur = placed.get(idx);
      if (e.key === 'ArrowLeft') place(cur == null ? 0 : Math.max(0, cur - 1));
      else if (e.key === 'ArrowRight') place(cur == null ? n - 1 : Math.min(n - 1, cur + 1));
      else if (e.key === 'ArrowDown') tiles[idx + 1]?.focus();
      else if (e.key === 'ArrowUp') tiles[idx - 1]?.focus();
      else return;
      e.preventDefault();
    });

    if (start != null) place(start, true);
    board.append(row);
    return { row, tile };
  });
  const tiles = rows.map(r => r.tile);

  return {
    board,
    /** Kolomindex van kaartje idx, of null. */
    placed: idx => placed.get(idx) ?? null,
    focus() { if (document.activeElement?.matches('.sort-tile')) document.activeElement.blur(); },
    /** Kijkt kaartje idx na; fix = tekst die in de juiste kolom verschijnt. */
    reveal(idx, { correct, column, fix }) {
      const { row, tile } = rows[idx];
      tile.disabled = true;
      row.classList.add('is-done');
      tile.classList.add(correct ? 'is-correct' : 'is-wrong');
      if (!correct && fix) {
        row.append(el('span', { class: 'sort-fix', style: `grid-column: ${column + 1}` }, fix));
      }
    },
  };
}
