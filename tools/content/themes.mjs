/* Thema's en groepen voor de handmatig samengestelde inhoud (tools/content/).
 *
 * Elke inhoudsmodule hangt haar atomen aan een thema uit deze lijst, of aan
 * een bestaand thema uit de cursus (zie EXISTING_THEMES). Een thema zonder
 * atomen verschijnt niet op het scherm, dus een lijst per unidad is veilig. */

const UNITS = {
  1: 'Caminando', 2: 'Tengo planes', 3: 'Casa nueva, vida nueva', 4: 'Mirador',
  5: 'El gusto de aprender', 6: 'Te lo compro', 7: '¡Qué descanso!', 8: 'Mirador',
};

export const CONTENT_GROUPS = [
  { id: 'g-toetsen', title: 'Toetsen', emoji: '📝' },
  { id: 'g-luisteren', title: 'Luisteren en lezen', emoji: '🎧' },
];

const grammar = (id, label, emoji, section) =>
  ({ id, label, emoji, group: 'g-grammatica', ...(section ? { section } : {}) });

const IN_SENTENCES = 'Werkwoorden in zinnen';

export const CONTENT_THEMES = [
  grammar('gr-wederkerend', 'Wederkerende werkwoorden', '🪞'),
  grammar('gr-persoonlijke-a', 'De persoonlijke a', '👤'),
  grammar('gr-aanwijzend', 'Este, ese en aquel', '👉'),
  grammar('gr-bezittelijk', 'Bezittelijke voornaamwoorden', '🔑'),
  grammar('gr-voorwerp', 'Lijdend en meewerkend voorwerp', '🎁'),
  grammar('gr-perfecto-indefinido', 'Perfecto of indefinido?', '⏪'),
  grammar('gr-indefinido-imperfecto', 'Indefinido of imperfecto?', '🕰️'),
  grammar('gr-imperativo', 'De gebiedende wijs', '📢'),
  grammar('gr-desde-hace', 'Desde, hace en desde hace', '⏳'),
  grammar('gr-woordkeuze', 'Het juiste woord', '🎯'),
  grammar('gr-zin-presente', 'Presente', '•', IN_SENTENCES),
  grammar('gr-zin-indefinido', 'Indefinido', '•', IN_SENTENCES),
  grammar('gr-zin-imperfecto', 'Imperfecto', '•', IN_SENTENCES),
  grammar('gr-zin-perfecto', 'Perfecto', '•', IN_SENTENCES),
  grammar('gr-zin-futuro', 'Futuro en condicional', '•', IN_SENTENCES),
  grammar('gr-zin-gerundio', 'Estar + gerundio', '•', IN_SENTENCES),

  { id: 'examen-u1', label: 'Unidad 1 sin estrés', emoji: '🎓', group: 'g-toetsen' },
  { id: 'toets-u1', label: 'Toets unidad 1', emoji: '📝', group: 'g-toetsen' },
  { id: 'instaptoets', label: 'Instaptoets 1.2', emoji: '🚪', group: 'g-toetsen' },
  { id: 'mirador-u4', label: 'Mirador unidad 4', emoji: '🔭', group: 'g-toetsen' },
  { id: 'mirador-u8', label: 'Mirador unidad 8', emoji: '🔭', group: 'g-toetsen' },

  ...Object.entries(UNITS).map(([n, title]) => ({
    id: `luister-u${n}`, label: `Dialogen · ${n}. ${title}`, emoji: '🎧', group: 'g-luisteren', section: 'Luisteren',
  })),
  ...Object.entries(UNITS).map(([n, title]) => ({
    id: `lezen-u${n}`, label: `Teksten · ${n}. ${title}`, emoji: '📖', group: 'g-luisteren', section: 'Lezen',
  })),
  { id: 'klemtoon', label: 'Welke lettergreep krijgt de klemtoon?', emoji: '🗣️', group: 'g-luisteren', section: 'Uitspraak' },
];

/* Bestaande thema's uit de cursus waar nieuwe grammatica-atomen ook in mogen. */
export const EXISTING_THEMES = [
  'eigenschappen', 'bijwoord', 'vergelijken', 'voornaamwoorden', 'onbepaalde-voornaamwoorden',
  'interrogativos', 'bijvoeglijk-naamwoord', 'ser-estar', 'verleden-tijden',
];

/** Thema-id's per groep, in schermvolgorde. */
export const contentThemesOf = groupId =>
  CONTENT_THEMES.filter(t => t.group === groupId).map(t => t.id);
