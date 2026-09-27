/* Toeval, op één plek: de lesmotor, de koppelronde en de oefenvormen schudden
 * allemaal met dezelfde functie. */

/** Fisher–Yates op een kopie. */
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
