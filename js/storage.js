/* Persistente staat in localStorage.
 * Eén sleutel, één JSON-object. Onbekende velden blijven bewaard bij het
 * schrijven, zodat een oudere app-versie nieuwere data niet stukmaakt. */

const KEY = 'spa12.v1';
const SCHEMA_VERSION = 1;

const EMPTY = () => ({
  schemaVersion: SCHEMA_VERSION,
  progress: {},                 // itemKey -> [box, seen, wrong, lastSeen]
  streak: { current: 0, best: 0, lastDay: null },
  xp: 0,
  settings: { sound: true, speech: true, reducedMotion: false },
  reports: [],
});

let state = null;

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return EMPTY();
  // Toekomstige migraties komen hier, gestuurd door raw.schemaVersion.
  return { ...EMPTY(), ...raw, schemaVersion: SCHEMA_VERSION };
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

export function save() {
  if (!state) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // Quota vol of private mode: de app blijft werken, alleen zonder bewaren.
    console.warn('Kon voortgang niet bewaren:', e);
  }
}

export const get = () => load();

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

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Roept per afgeronde les. Verhoogt de streak hoogstens één keer per dag. */
export function touchStreak() {
  const s = load();
  const d = today();
  if (s.streak.lastDay === d) return s.streak;

  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  s.streak.current = s.streak.lastDay === yesterday ? s.streak.current + 1 : 1;
  s.streak.best = Math.max(s.streak.best, s.streak.current);
  s.streak.lastDay = d;
  return s.streak;
}

/** De streak is verbroken als er gisteren én vandaag niets is geoefend. */
export function currentStreak() {
  const s = load().streak;
  if (!s.lastDay) return 0;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  return (s.lastDay === today() || s.lastDay === yesterday) ? s.current : 0;
}

export function addXp(n) {
  load().xp += n;
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
  if (i === -1) s.reports.push(atomId); else s.reports.splice(i, 1);
  save();
  return i === -1;
}

export function resetAll() {
  state = EMPTY();
  save();
}
