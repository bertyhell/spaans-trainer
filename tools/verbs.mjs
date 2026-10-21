/* Werkwoorden per activiteit, en welke er regelmatig zijn.
 *
 * De cursus deelt de losse werkwoorden in naar hun vorm: regelmatig op -ar,
 * -er en -ir, klinkerveranderaars, wederkerende. Om woordenschat te oefenen
 * zegt dat weinig, en in "welk woord hoort er niet bij?" verraadt de uitgang
 * het antwoord zonder dat je één woord hoeft te kennen. Hier krijgen ze dus
 * een thema naar wat je ermee dóét.
 *
 * De vorm verdwijnt niet: die gaat als `regular` (en `change`) mee op het
 * atoom, en voedt de oefening "welk werkwoord is niet regelmatig?" — dáár is
 * het precies wat je moet leren.
 */

/* Indelen enkel op betekenis, nooit op het hoofdstuk waar het werkwoord
 * stond: een thema als "cerrar, encender, perder" is gewoon het rijtje
 * klinkerveranderaars uit de cursus.
 *
 * `activity: true` wil zeggen: de woorden horen echt samen, en de thema's
 * overlappen elkaar niet. Alleen tussen zulke thema's vraagt "hoort er niet
 * bij?" naar een werkwoord. "Overige" is een restbak en telt niet mee. */
export const VERB_THEMES = [
  {
    id: 'ww-praten', label: 'Praten en luisteren', emoji: '💬', activity: true,
    verbs: [
      'hablar', 'charlar', 'preguntar', 'responder', 'explicar', 'telefonear',
      'contar', 'repetir', 'prometer', 'invitar', 'interrumpir', 'persuadir',
      'pedir', 'recomendar', 'admitir', 'escuchar', 'declarar',
    ],
  },
  {
    id: 'ww-leren', label: 'Leren en werken', emoji: '🎓', activity: true,
    verbs: ['estudiar', 'aprender', 'trabajar', 'escribir', 'apuntar'],
  },
  {
    id: 'ww-denken', label: 'Denken, willen en voelen', emoji: '💭', activity: true,
    verbs: [
      'pensar', 'creer', 'entender', 'comprender', 'olvidar', 'sentir', 'temer',
      'divertirse', 'querer', 'preferir', 'necesitar', 'poder', 'deber',
    ],
  },
  {
    id: 'ww-gaan', label: 'Gaan en komen', emoji: '🚶', activity: true,
    verbs: [
      'andar', 'caminar', 'correr', 'entrar', 'viajar', 'partir', 'subir',
      'volver', 'irse', 'marcharse',
    ],
  },
  {
    id: 'ww-eten', label: 'Eten en drinken', emoji: '🍽️', activity: true,
    verbs: ['comer', 'beber', 'tomar', 'desayunar', 'cenar', 'servir'],
  },
  {
    id: 'ww-verzorgen', label: 'Slapen, opstaan en verzorgen', emoji: '🪥', activity: true,
    verbs: [
      'acostarse', 'despertarse', 'levantarse', 'dormir', 'ducharse', 'bañarse',
      'lavarse', 'afeitarse', 'peinarse', 'pintarse', 'vestir',
    ],
  },
  {
    id: 'ww-kopen', label: 'Kopen en betalen', emoji: '💶', activity: true,
    verbs: ['comprar', 'vender', 'pagar', 'costar', 'alquilar', 'reservar'],
  },
  {
    id: 'ww-dingen', label: 'Zoeken, vinden en tonen', emoji: '🔍', activity: true,
    verbs: ['buscar', 'encontrar', 'perder', 'esconder', 'mostrar', 'señalar'],
  },
  {
    id: 'ww-overig', label: 'Overige werkwoorden', emoji: '🔤',
    verbs: [
      'aplaudir', 'cambiar', 'casarse', 'depender', 'empezar', 'llamarse', 'mirar',
      'morir', 'pasar', 'permitir', 'resistir', 'restaurar', 'reunir', 'verse', 'vivir',
      // Geen eigen betekenisgroep van minstens vier: liever hier dan als
      // vreemde eend in een thema waar ze niet bij passen.
      'abrir', 'cerrar', 'encender', 'añadir', 'esperar', 'proceder (de)', 'fumar',
      'poseer', 'recibir',
    ],
  },
];

/** De cursusthema's die hierdoor vervangen worden. */
export const REPLACED_THEMES = [
  'werkwoorden-ar', 'werkwoorden-er', 'werkwoorden-ir',
  'verbos-cambio', 'wederkerende-werkwoorden',
];

/** Spaans infinitief -> nieuw thema. */
export const VERB_THEME_OF = Object.fromEntries(
  VERB_THEMES.flatMap(t => t.verbs.map(v => [v, t.id])));

/* Onregelmatig in de presente, met wat er verandert. Alleen losse,
 * niet-wederkerende infinitieven: "-se" achteraan valt zo hard op tussen
 * kale werkwoorden dat het de vraag verraadt. */
export const IRREGULAR = {
  cerrar: 'e → ie', comenzar: 'e → ie', empezar: 'e → ie', encender: 'e → ie',
  entender: 'e → ie', nevar: 'e → ie', pensar: 'e → ie', perder: 'e → ie',
  preferir: 'e → ie', querer: 'e → ie', recomendar: 'e → ie', sentir: 'e → ie',
  contar: 'o → ue', costar: 'o → ue', doler: 'o → ue', dormir: 'o → ue',
  encontrar: 'o → ue', llover: 'o → ue', morir: 'o → ue', mostrar: 'o → ue',
  poder: 'o → ue', probar: 'o → ue', volver: 'o → ue',
  pedir: 'e → i', repetir: 'e → i', servir: 'e → i', vestir: 'e → i',
  jugar: 'u → ue', almorzar: 'o → ue', resolver: 'o → ue',
  salir: 'yo salgo', conducir: 'yo conduzco', caer: 'yo caigo', construir: 'yo construyo',
};

/* Regelmatig in de presente. Bewust weggelaten: reunir (reúno) en esquiar
 * (esquío) — regelmatig op papier, maar met een klemtoonteken dat je niet
 * als "regelmatig" wil leren. */
export const REGULAR = new Set([
  // -ar
  'alquilar', 'andar', 'apuntar', 'avanzar', 'bailar', 'boxear', 'bucear',
  'buscar', 'caminar', 'cambiar', 'cantar', 'cenar', 'charlar', 'cocinar',
  'coleccionar', 'comprar', 'controlar', 'curar', 'declarar', 'desayunar',
  'descansar', 'dibujar', 'durar', 'entrar', 'escalar', 'escuchar', 'esperar',
  'estornudar', 'estudiar', 'explicar', 'fumar', 'hablar', 'invitar', 'llevar',
  'mirar', 'nadar', 'navegar', 'necesitar', 'olvidar', 'pagar', 'pasar',
  'pasear', 'patinar', 'pescar', 'picar', 'pintar', 'preguntar', 'rechazar',
  'reservar', 'respirar', 'restaurar', 'sangrar', 'señalar', 'telefonear',
  'tocar', 'tomar', 'trabajar', 'tratar', 'valorar', 'viajar', 'vomitar',
  // -er
  'aprender', 'beber', 'comer', 'comprender', 'correr', 'coser', 'creer',
  'deber', 'depender', 'esconder', 'leer', 'poseer', 'prometer', 'recorrer',
  'responder', 'suceder', 'temer', 'vender',
  // -ir
  'abrir', 'admitir', 'añadir', 'aplaudir', 'definir', 'escribir',
  'interrumpir', 'partir', 'permitir', 'persuadir', 'recibir', 'resistir',
  'subir', 'sufrir', 'vivir',
  // Regelmatig in de presente, met een onregelmatig voltooid deelwoord
  // (roto, cubierto, descubierto) of een spellingswissel (llegué).
  'llegar', 'romper', 'cubrir', 'descubrir',
]);
