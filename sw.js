/* Service worker: de app moet offline werken zodra ze één keer geopend is,
 * en meteen starten, ook op een trage verbinding.
 *
 * CACHE bevat een versienummer. Verhoog het na elke inhoudelijke wijziging —
 * vooral na het opnieuw genereren van data/course.js, anders blijven telefoons
 * op de oude woordenlijst hangen. tools/release.mjs doet dat automatisch. */

const CACHE = 'vamos-ddf36ea5';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png',
  './icons/icon-maskable.svg',
  './icons/apple-touch-icon.png',
  './css/style.css',
  './data/course.js',
  './data/sources.js',
  './js/main.js',
  './js/version.js',
  './js/data.js',
  './js/dom.js',
  './js/random.js',
  './js/check.js',
  './js/storage.js',
  './js/scheduler.js',
  './js/session.js',
  './js/matchRound.js',
  './js/flashcards.js',
  './js/hints.js',
  './js/speech.js',
  './js/audio.js',
  './js/sortBoard.js',
  './js/hintLadder.js',
  './js/intro.js',
  './js/gloss.js',
  './js/numerals.js',
  './js/recognition.js',
  './js/types/context.js',
  './js/types/confusion.js',
  './js/types/conversation.js',
  './js/types/minimalPair.js',
  './js/types/numeral.js',
  './js/types/speak.js',
  './js/types/index.js',
  './js/types/spotError.js',
  './js/types/letterPuzzle.js',
  './js/types/emojiPick.js',
  './js/types/trueFalse.js',
  './js/types/plural.js',
  './js/types/tenseShift.js',
  './js/types/sentenceMeaning.js',
  './js/types/pickSentence.js',
  './js/types/multipleChoice.js',
  './js/types/typeAnswer.js',
  './js/types/articlePicker.js',
  './js/types/accents.js',
  './js/types/oddOneOut.js',
  './js/types/irregularVerb.js',
  './js/types/verbType.js',
  './js/types/verbSort.js',
  './js/types/fillGap.js',
  './js/types/wordBank.js',
  './js/types/conjugation.js',
  './js/types/listen.js',
  './js/types/choice.js',
  './js/types/reading.js',
  './js/types/dialogue.js',
  './js/types/stressTap.js',
  './js/types/conjugationSpot.js',
  './js/types/dictation.js',
  './js/types/dialogueOrder.js',
  './js/types/agreement.js',
];

/* Op de eigen laptop of het thuisnetwerk wordt er gewerkt aan de app: daar
 * altijd het netwerk eerst, anders zie je je eigen wijziging pas na een
 * release. */
const DEV = /^(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/
  .test(self.location.hostname);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // cache: 'reload' haalt elk bestand vers van de server, niet uit de
      // HTTP-cache van de browser: anders kan een nieuwe versie een oud
      // bestand bevatten. Eén ontbrekend bestand blokkeert de installatie niet.
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(new Request(a, { cache: 'reload' })))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Een geslaagd antwoord bewaren. Een 404 in de cache zou offline een werkend bestand vervangen. */
function remember(req, res) {
  if (res.ok) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
  }
  return res;
}

/** De versie uit de cache, of anders index.html voor een pagina. */
const fromCache = req => caches.match(req).then(r => r
  ?? (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  if (DEV) {
    // Netwerk eerst; 'no-cache' laat de browser altijd bij de server nagaan
    // of het bestand gewijzigd is. Een navigatie mag geen extra opties krijgen.
    const req = e.request.mode === 'navigate' ? fetch(e.request) : fetch(e.request, { cache: 'no-cache' });
    e.respondWith(req.then(res => remember(e.request, res)).catch(() => fromCache(e.request)));
    return;
  }

  // Eerst de cache: die hoort bij één versie (CACHE is een hash van alle
  // bestanden), dus pagina, scripts en data passen altijd bij elkaar, en de
  // app start meteen, ook met één streepje bereik in de trein. Een nieuwe
  // versie komt binnen via een nieuwe sw.js; de pagina meldt dan "Herladen".
  e.respondWith(
    caches.match(e.request).then(hit => hit
      ?? fetch(e.request).then(res => remember(e.request, res)).catch(() => fromCache(e.request))),
  );
});
