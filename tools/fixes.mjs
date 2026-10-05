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
  'v.estoy-haciendo-una-pausa': ['ik ben pauze aan het nemen', 'ik ben een pauze aan het nemen', 'ik ben een pauze aan het houden'],
  'v.hacer-referencia-a': ['een verwijzing maken naar'],
  'v.comenzar': ['starten'],
  'v.frecuentemente': ['frequent'],
  'v.sencillo-a': ['simpel'],
  'v.la-crema-solar': ['de zonnecrème'],
  'v.tan-importante-como': ['even belangrijk als'],
  'v.la-gente-del-lugar': ['de lokale bevolking'],
};

/** Emoji die een dubbelzinnige vertaling uit elkaar houdt: "arm" (pobre) is
 *  niet de arm aan je lichaam. */
export const EMOJI = {
  'v.pobre': '💸',
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

  // "Grammaticale termen" was een thema naar de cursus, niet naar betekenis.
  // De vaktermen zelf vallen weg (DROP); de gewone woorden krijgen een thuis.
  'v.este-a': 'aanwijzend',
  'v.ese-a': 'aanwijzend',
  'v.esto': 'aanwijzend',
  'v.eso': 'aanwijzend',
  'v.la-igualdad': 'vergelijken',
  'v.la-desigualdad': 'vergelijken',
  'v.por-lo-menos': 'vergelijken',
  'v.viceversa': 'bijwoord',
  'v.el-alcance': 'bijwoord',
  'v.estar-al-alcance-de': 'bijwoord',
  'v.la-referencia': 'ww-praten',
  'v.hacer-referencia-a': 'ww-praten',

  // "Plaatsen en natuur" gooide dieren, streken en gebouwen op één hoop.
  'v.el-caiman': 'dieren-en-planten',
  'v.el-delfin': 'dieren-en-planten',
  'v.el-gato': 'dieren-en-planten',
  'v.el-mono': 'dieren-en-planten',
  'v.el-mosquito': 'dieren-en-planten',
  'v.la-mariposa': 'dieren-en-planten',
  'v.la-concha': 'dieren-en-planten',
  'v.la-violeta': 'dieren-en-planten',
  'v.el-amazonas': 'aardrijkskunde',
  'v.el-lago-titicaca': 'aardrijkskunde',
  'v.galicia': 'aardrijkskunde',
  'v.la-costa-mediterranea': 'aardrijkskunde',
  'v.las-islas-canarias': 'aardrijkskunde',
  'v.los-pirineos': 'aardrijkskunde',
};

export const DROP = [
  // Zinsflarden uit de dialogen, geen woordenschat.
  'v.lo-mas-importante', 'v.muchas-cosas-mas', 'v.queria-contar', 'v.hasta-encontrarlo',
  // Te specifiek om als woord te leren.
  'v.el-manchego', 'v.la-pantomima', 'v.autorizado-a', 'v.el-camino-de-santiago',
  // Grammaticale vaktermen: die heb je nodig om de cursus te volgen, niet om
  // Spaans te spreken.
  'v.el-comparativo', 'v.el-demostrativo', 'v.el-gerundio', 'v.el-pronombre-reflexivo',
  'v.el-superlativo', 'v.el-verbo-conjugado', 'v.el-verbo-reflexivo',
  // Dubbel gedolven: hetzelfde woord in een andere notatie (enfermo/a en
  // enfermo/-a), of dezelfde zin die ook in het werkboek staat.
  'v.enfermo-a-2', 'v.sano-a-2', 's.gezondheid-7',
];

/** Thema's die de cursus niet heeft. */
export const EXTRA_THEMES = [
  { id: 'mensen', label: 'Mensen en beroepen', emoji: '🧑‍💼' },
  { id: 'aanwijzend', label: 'Dit en dat (aanwijzend)', emoji: '👉' },
  { id: 'dieren-en-planten', label: 'Dieren en planten', emoji: '🐾' },
  { id: 'aardrijkskunde', label: 'Streken, bergen en water', emoji: '🗺️' },
  // Vervangt het gedolven thema: wat overblijft zijn plaatsen en gebouwen.
  { id: 'plaatsen-en-natuur', label: 'Plaatsen en gebouwen', emoji: '🏘️' },
];
