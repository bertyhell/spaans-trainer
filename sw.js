/* Service worker: de app moet offline werken zodra ze één keer geopend is.
 *
 * CACHE bevat een versienummer. Verhoog het na elke inhoudelijke wijziging —
 * vooral na het opnieuw genereren van data/course.js, anders blijven telefoons
 * op de oude woordenlijst hangen. tools/release.mjs doet dat automatisch. */

const CACHE = 'vamos-ad2f4abf';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './data/course.js',
  './js/main.js',
  './js/data.js',
  './js/dom.js',
  './js/check.js',
  './js/storage.js',
  './js/scheduler.js',
  './js/session.js',
  './js/matchRound.js',
  './js/speech.js',
  './js/audio.js',
  './js/types/index.js',
  './js/types/multipleChoice.js',
  './js/types/typeAnswer.js',
  './js/types/articlePicker.js',
  './js/types/accents.js',
  './js/types/oddOneOut.js',
  './js/types/stemChange.js',
  './js/types/fillGap.js',
  './js/types/wordBank.js',
  './js/types/conjugation.js',
  './js/types/listen.js',
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
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r ?? caches.match('./index.html'))),
  );
});
