/* Handmatige verbeteringen op de gedolven woordenschat.
 *
 * Wat hier staat komt uit gemelde fouten in de app. Het staat apart zodat het
 * een nieuwe `merge.mjs` overleeft: `regroup.mjs` legt het er telkens opnieuw
 * overheen. Werkwoorden verhuizen via verbs.mjs, niet hier.
 */

/** Vertalingen die ook goed zijn, maar in de cursus ontbraken. */
export const EXTRA_NL = {
  'v.bastante': ['genoeg'],
  'v.el-ciclismo': ['het wielrennen'],
};

/* "Overige woorden" was een restbak: daar leer je niets uit, en in "hoort er
 * niet bij?" is elk woord even vreemd. De woorden krijgen een echt thema. */

/** Atoom-id -> thema. */
export const MOVE = {
  'v.el-catalogo': 'kantoor-papier',
  'v.el-ordenador': 'kantoor-papier',
  'v.el-la-coordinador-a': 'mensen',
  'v.el-la-escritor-a': 'mensen',
  'v.el-la-hablante': 'mensen',
  'v.el-la-experto-a': 'mensen',
  'v.el-la-peregrino-a': 'mensen',
};

/** Zinsflarden uit de dialogen, geen woordenschat. */
export const DROP = ['v.lo-mas-importante', 'v.muchas-cosas-mas', 'v.queria-contar'];

/** Thema's die de cursus niet heeft. */
export const EXTRA_THEMES = [
  { id: 'mensen', label: 'Mensen en beroepen', emoji: '🧑‍💼' },
];
