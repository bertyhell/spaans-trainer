/* Service worker: de app moet offline werken zodra ze één keer geopend is.
 *
 * CACHE bevat een versienummer. Verhoog het na elke inhoudelijke wijziging —
 * vooral na het opnieuw genereren van data/course.js, anders blijven telefoons
 * op de oude woordenlijst hangen. tools/release.mjs doet dat automatisch. */

const CACHE = 'vamos-e0ddbaae';

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
  './js/data.js',
  './js/dom.js',
  './js/random.js',
  './js/check.js',
  './js/storage.js',
  './js/scheduler.js',
  './js/session.js',
  './js/matchRound.js',
  './js/flashcards.js',
  './js/speech.js',
  './js/audio.js',
  './js/sortBoard.js',
  './js/types/index.js',
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
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // Eén ontbrekend bestand mag de hele installatie niet blokkeren.
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Netwerk eerst, cache als terugval: zo zie je een nieuwe versie meteen,
  // maar blijft de app werken in de trein.
  // 'no-cache' laat de browser altijd bij de server nagaan of het bestand
  // gewijzigd is. Zonder dat haalt fetch() een oude style.css uit de
  // HTTP-cache (S3 stuurt geen Cache-Control), terwijl index.html al nieuw is.
  // Een navigatie-request mag geen extra opties krijgen.
  const req = e.request.mode === 'navigate'
    ? fetch(e.request)
    : fetch(e.request, { cache: 'no-cache' });
  e.respondWith(
    req
      .then(res => {
        // Enkel geslaagde antwoorden bewaren: een 404 in de cache zou een
        // werkend bestand offline vervangen.
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => {
        if (r) return r;
        // index.html is alleen een zinvolle terugval voor een pagina, niet
        // voor een script of stylesheet (dat geeft een MIME-fout).
        return e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error();
      })),
  );
});
