/* De indeling van de startpagina: thema's gebundeld op betekenis.
 *
 * De cursus groepeert woorden per unidad, dus per plek in het boek. Om te
 * oefenen zegt dat niets: "de groenten" en "het fruit" horen bij elkaar, ook
 * al staan ze twintig bladzijden uit elkaar, en wie "het lichaam" wil leren
 * heeft niets aan de vraag in welk hoofdstuk dat toevallig stond.
 *
 * De volgorde hieronder is de volgorde op het scherm. Binnen een groep staan
 * de thema's zoals ze hier staan, niet op grootte: je zoekt op onderwerp.
 */

import { CONJUGATION_ORDER, VERB_TYPE_THEMES } from './conjugate.mjs';
import { CONTENT_GROUPS, contentThemesOf } from './content/themes.mjs';

export const GROUPS = [
  {
    id: 'g-eten', title: 'Eten en drinken', emoji: '🍽️',
    themes: [
      'groenten', 'fruit', 'vlees', 'vleeswaren', 'gevogelte', 'vis', 'zeevruchten',
      'peulvruchten', 'noten', 'kaas', 'kruiden', 'zoetigheden', 'dranken',
      'bereiding', 'winkels-eten', 'restaurant',
    ],
  },
  {
    id: 'g-kleding', title: 'Kleding en uiterlijk', emoji: '👕',
    themes: ['kleding', 'ondergoed', 'schoeisel', 'accessoires', 'juwelen', 'kleuren'],
  },
  {
    id: 'g-lichaam', title: 'Lichaam en gezondheid', emoji: '💪',
    themes: ['lichaam', 'klachten', 'gezondheid'],
  },
  {
    id: 'g-huis', title: 'Huis en wonen', emoji: '🏠',
    themes: ['huis', 'meubels', 'badkamer', 'decoracion', 'apparaten', 'wonen', ...contentThemesOf('g-huis')],
  },
  {
    id: 'g-reizen', title: 'Reizen, weer en natuur', emoji: '🧳',
    themes: [
      'reizen', 'camino', 'plaatsen-en-natuur', 'aardrijkskunde', 'dieren-en-planten', 'weer',
      'nationaliteiten-europa', 'nationaliteiten-wereld',
    ],
  },
  {
    id: 'g-vrijetijd', title: 'Vrije tijd', emoji: '🎲',
    themes: ['vrije-tijd', 'hobbys', 'sport', 'spel', 'muziekinstrumenten'],
  },
  {
    id: 'g-dagelijks', title: 'Dagelijks leven', emoji: '🕘',
    themes: [
      'dagelijkse-routine', 'dagen-en-maanden', 'tijd-en-uur',
      'afspreken', 'afspreken-en-plannen', 'telefoneren',
      'mensen', 'winkelen', 'winkels-diensten', 'kantoor-papier', 'kantoor-schrijfgerei',
      ...contentThemesOf('g-dagelijks'),
    ],
  },
  {
    id: 'g-ww-soort', title: 'Werkwoorden: soort herkennen', emoji: '🧩',
    themes: VERB_TYPE_THEMES.map(t => t.id),
  },
  {
    id: 'g-ww-betekenis', title: 'Werkwoorden: betekenis', emoji: '🔤',
    themes: [
      'ww-praten', 'ww-leren', 'ww-denken', 'ww-gaan', 'ww-eten',
      'ww-verzorgen', 'ww-kopen', 'ww-dingen', 'ww-overig',
    ],
  },
  {
    // Per tijd een tussenkopje (het `section` van het thema, zie conjugate.mjs).
    id: 'g-ww-vervoegen', title: 'Werkwoorden: vervoegen', emoji: '🔠',
    themes: CONJUGATION_ORDER,
  },
  {
    id: 'g-grammatica', title: 'Grammatica en taalgebruik', emoji: '📐',
    themes: [
      'eigenschappen', 'bijwoord', 'vergelijken', 'voornaamwoorden', 'aanwijzend',
      'onbepaalde-voornaamwoorden', 'interrogativos', 'bijvoeglijk-naamwoord',
      'ser-estar', 'verleden-tijden', 'opdrachtentaal',
      // Oefeningen uit het werkboek en de bundel (tools/content/).
      ...contentThemesOf('g-grammatica'),
    ],
  },
  ...CONTENT_GROUPS.map(g => ({ ...g, themes: contentThemesOf(g.id) })),
];

/** themaId -> groepId, voor het omzetten van de data. */
export const GROUP_OF = Object.fromEntries(
  GROUPS.flatMap(g => g.themes.map(t => [t, g.id])));
