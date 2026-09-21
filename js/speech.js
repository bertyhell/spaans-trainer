/* Spaanse uitspraak via de ingebouwde spraaksynthese van de browser.
 *
 * Twee eigenaardigheden om rekening mee te houden:
 *  - de stemmenlijst is bij het laden van de pagina vaak nog leeg en komt pas
 *    later binnen via het voiceschanged-event;
 *  - iOS spreekt enkel wanneer de eerste uiting uit een gebruikersgebaar komt.
 * Zonder Spaanse stem melden we dat, en de luisteroefeningen blijven weg. */

import * as storage from './storage.js';

const synth = window.speechSynthesis ?? null;
let voice = null;
let ready = false;

function pickVoice() {
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  return voices.find(v => v.lang === 'es-ES')
      ?? voices.find(v => v.lang?.startsWith('es'))
      ?? null;
}

/** Wacht tot de stemmenlijst geladen is. Lost altijd op, ook zonder stem. */
export function init() {
  return new Promise(resolve => {
    if (!synth) { ready = true; return resolve(false); }

    voice = pickVoice();
    if (voice) { ready = true; return resolve(true); }

    const done = () => {
      voice = pickVoice();
      ready = true;
      resolve(Boolean(voice));
    };
    synth.addEventListener('voiceschanged', done, { once: true });
    // Sommige browsers vuren voiceschanged nooit: niet eindeloos blijven wachten.
    setTimeout(done, 1200);
  });
}

/** Of er echt Spaans gesproken kan worden. Stuurt de luisteroefeningen aan. */
export const available = () => ready && Boolean(voice) && storage.get().settings.speech !== false;

/** Armeert de synthese vanuit een gebruikersgebaar (vereist op iOS). */
export function arm() {
  if (!synth || !voice) return;
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  try { synth.speak(u); } catch { /* onbelangrijk */ }
}

export function speak(text, { rate = 0.9 } = {}) {
  if (!synth || !voice || storage.get().settings.speech === false) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = rate;
  synth.speak(u);
}

export function stop() {
  synth?.cancel();
}
