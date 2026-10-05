/* Persistente staat in localStorage.
 * Eén sleutel, één JSON-object. Onbekende velden blijven bewaard bij het
 * schrijven, zodat een oudere app-versie nieuwere data niet stukmaakt. */

const KEY = 'spa12.v1';
const SCHEMA_VERSION = 1;

const EMPTY = () => ({
  schemaVersion: SCHEMA_VERSION,
  progress: {},                 // itemKey -> [box, seen, wrong, lastSeen]
  streak: { current: 0, best: 0, lastDay: null },
  exercisesDone: 0,
  settings: { sound: true, speech: true, reducedMotion: false },
  reports: [],
  reportReasons: {},            // atomId -> vrije tekst: wat is er mis
  mistakes: {},                 // atomId -> { expected, given, note, at, streak }
});

let state = null;

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return EMPTY();
  // Toekomstige migraties komen hier, gestuurd door raw.schemaVersion.
  const s = { ...EMPTY(), ...raw, schemaVersion: SCHEMA_VERSION };
  // Oude versies telden punten i.p.v. oefeningen. Schatting: 10 punten per
  // juist antwoord, met perfecte-lesbonussen en foute antwoorden (0 punten)
  // die elkaar ruwweg opheffen, dus ~10 punten per gemaakte oefening.
  if (raw.exercisesDone == null && typeof raw.xp === 'number') {
    s.exercisesDone = Math.round(raw.xp / 10);
  }
  delete s.xp;
  return s;
}

export function load() {
  if (state) return state;
  try {
    state = migrate(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    state = EMPTY();
  }
  return state;
}

/* Mislukt bewaren (quota vol, private mode), dan blijft de app werken, maar
 * de gebruiker moet het weten: anders oefent die een week voor niets. */
let onSaveError = null;
let saveFailed = false;
export const watchSaveErrors = callback => { onSaveError = callback; };

export function save() {
  if (!state) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    saveFailed = false;
  } catch (e) {
    console.warn('Kon voortgang niet bewaren:', e);
    // Eén melding per reeks mislukkingen, niet bij elke vraag.
    if (!saveFailed) onSaveError?.(e);
    saveFailed = true;
  }
}

/** Vraagt de browser om de opslag niet op te ruimen (Safari wist anders na 7 dagen zonder bezoek). */
export async function persist() {
  try { return await navigator.storage?.persist?.() ?? false; } catch { return false; }
}

export const get = () => load();

/* Twee tabbladen open: zonder dit overschrijft het ene bij elke les de
 * voortgang van het andere. Wat een ander tabblad bewaart, lezen we hier in;
 * `onChange` laat de app daarna het scherm verversen. */
let onChange = null;
export function watch(callback) {
  onChange = callback;
  window.addEventListener('storage', e => {
    if (e.key !== KEY || e.newValue == null) return;
    try {
      state = migrate(JSON.parse(e.newValue));
      onChange?.();
    } catch { /* kapotte data van elders: de eigen staat blijft staan */ }
  });
}

/* --- progressie per oefenitem (atoom + richting) --- */

export function getProgress(key) {
  const p = load().progress[key];
  return p ? { box: p[0], seen: p[1], wrong: p[2], lastSeen: p[3] }
           : { box: 1, seen: 0, wrong: 0, lastSeen: 0 };
}

export function setProgress(key, { box, seen, wrong, lastSeen }) {
  load().progress[key] = [box, seen, wrong, lastSeen];
}

/* --- streak --- */

/* Lokale kalenderdagen, geen UTC: wie om half één 's nachts oefent, oefent
 * vandaag en niet gisteren. */
const dayKey = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = () => dayKey(new Date());

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

/** Roept per afgeronde les. Verhoogt de streak hoogstens één keer per dag. */
export function touchStreak() {
  const s = load();
  const d = today();
  if (s.streak.lastDay === d) return s.streak;

  s.streak.current = s.streak.lastDay === yesterday() ? s.streak.current + 1 : 1;
  s.streak.best = Math.max(s.streak.best, s.streak.current);
  s.streak.lastDay = d;
  return s.streak;
}

/** De streak is verbroken als er gisteren én vandaag niets is geoefend. */
export function currentStreak() {
  const s = load().streak;
  if (!s.lastDay) return 0;
  return (s.lastDay === today() || s.lastDay === yesterday()) ? s.current : 0;
}

export function addExercises(n) {
  load().exercisesDone += n;
}

export const isReported = atomId => load().reports.includes(atomId);

export function report(atomId) {
  const s = load();
  if (!s.reports.includes(atomId)) s.reports.push(atomId);
  save();
}

/** Zet de melding aan of uit. Geeft terug of ze nu aan staat. */
export function toggleReport(atomId) {
  const s = load();
  const i = s.reports.indexOf(atomId);
  if (i === -1) s.reports.push(atomId); else { s.reports.splice(i, 1); delete s.reportReasons[atomId]; }
  save();
  return i === -1;
}

export function unreport(atomId) {
  const s = load();
  s.reports = s.reports.filter(id => id !== atomId);
  delete s.reportReasons[atomId];
  save();
}

export function clearReports() {
  const s = load();
  s.reports = [];
  s.reportReasons = {};
  save();
}

export const getReportReason = atomId => load().reportReasons[atomId] ?? '';

export function setReportReason(atomId, reason) {
  const s = load();
  const text = reason.trim();
  if (text) s.reportReasons[atomId] = text; else delete s.reportReasons[atomId];
  save();
}

/* --- recente fouten ---
 * Een fout blijft in de lijst tot je dezelfde oefening 3 keer na elkaar juist
 * beantwoordt. Een nieuwe fout zet de teller terug op 0. */

export const MISTAKE_CLEAR_AFTER = 3;

/* Een "bijna" (accent- of typfout) telt als juist voor de dozen, maar komt
 * wel in de foutenlijst: de schrijfwijze moet je nog oefenen. */
export function recordAnswer(atomId, { correct, almost, expected, given, note }, direction = null) {
  const s = load();
  const m = s.mistakes[atomId];
  if (!correct || almost) {
    // De richting onthouden: wie "de bril" niet kon vertalen, moet dát oefenen,
    // niet het herkennen van las gafas.
    const count = (m?.count ?? 0) + 1;
    s.mistakes[atomId] = { expected, given: given ?? null, note: note ?? null, at: Date.now(), streak: 0,
      direction: direction ?? m?.direction ?? null, count };
  } else if (m) {
    m.streak += 1;
    if (m.streak >= MISTAKE_CLEAR_AFTER) delete s.mistakes[atomId];
  }
  save();
}

/** Nieuwste eerst. */
export const getMistakes = () =>
  Object.entries(load().mistakes)
    .map(([atomId, m]) => ({ atomId, ...m }))
    .sort((a, b) => b.at - a.at);

export function clearMistakes() {
  load().mistakes = {};
  save();
}

/** Wist voortgang, fouten en streak. Instellingen en meldingen blijven: die
 *  zijn geen voortgang, en een melding is bedoeld voor wie de data nakijkt. */
export function resetAll() {
  const keep = state ? { settings: state.settings, reports: state.reports, reportReasons: state.reportReasons } : {};
  state = { ...EMPTY(), ...keep };
  save();
}

/* --- reservekopie ---
 * localStorage leeft per toestel en per browser. Een bestand laat je de
 * voortgang meenemen naar een nieuwe telefoon, of terugzetten na het wissen
 * van de browsergegevens. */

export const BACKUP_KIND = 'vamos-backup';

export function exportState() {
  return JSON.stringify({ kind: BACKUP_KIND, exportedAt: new Date().toISOString(), state: load() });
}

/**
 * Voegt een reservekopie samen met wat er al is. Per oefenitem wint de kant
 * die het vaakst geoefend is; zo verlies je niets als je op twee toestellen
 * oefende. Geeft het aantal ingelezen items terug.
 * @throws als het bestand geen reservekopie van deze app is.
 */
export function importState(text) {
  const parsed = JSON.parse(text);
  if (parsed?.kind !== BACKUP_KIND || typeof parsed.state !== 'object') {
    throw new Error('Dit is geen reservekopie van ¡Vamos!');
  }
  const theirs = migrate(parsed.state);
  const s = load();
  let items = 0;
  for (const [key, p] of Object.entries(theirs.progress ?? {})) {
    const mine = s.progress[key];
    if (!mine || p[1] > mine[1] || (p[1] === mine[1] && (p[3] ?? 0) > (mine[3] ?? 0))) {
      s.progress[key] = p;
      items++;
    }
  }
  for (const [id, m] of Object.entries(theirs.mistakes ?? {})) {
    if (!s.mistakes[id] || m.at > s.mistakes[id].at) s.mistakes[id] = m;
  }
  for (const id of theirs.reports ?? []) if (!s.reports.includes(id)) s.reports.push(id);
  s.reportReasons = { ...theirs.reportReasons, ...s.reportReasons };
  s.exercisesDone = Math.max(s.exercisesDone, theirs.exercisesDone ?? 0);
  const a = s.streak;
  const b = theirs.streak ?? {};
  if ((b.lastDay ?? '') > (a.lastDay ?? '')) s.streak = { ...b };
  s.streak.best = Math.max(a.best ?? 0, b.best ?? 0, s.streak.current ?? 0);
  save();
  return items;
}
