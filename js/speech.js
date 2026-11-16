/* Spaanse uitspraak.
 *
 * Staat de stem van de spreekmodus op het toestel (js/voice, Piper), dan
 * spreekt die alles uit: overal dezelfde, juiste Castiliaanse uitspraak, ook
 * zonder verbinding. Anders de ingebouwde spraaksynthese van de browser, met
 * twee eigenaardigheden:
 *  - de stemmenlijst is bij het laden van de pagina vaak nog leeg en komt pas
 *    later binnen via het voiceschanged-event;
 *  - iOS spreekt enkel wanneer de eerste uiting uit een gebruikersgebaar komt.
 * Zonder enige Spaanse stem melden we dat, en de luisteroefeningen blijven weg. */

import * as storage from './storage.js';
import { speakable } from './check.js';
import * as neural from './voice/index.js';

const synth = window.speechSynthesis ?? null;
let voice = null;
let ready = false;
let neuralInstalled = false;

function pickVoice() {
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  return voices.find(v => v.lang === 'es-ES')
      ?? voices.find(v => v.lang?.startsWith('es'))
      ?? null;
}

/** De stem van het toestel gebruiken? Als ze er is en niet uitgezet werd. */
export const usesNeural = () => neuralInstalled && storage.get().settings.voice !== false;

/** Na het downloaden of verwijderen van de stem (instellingen, spreekmodus). */
export function setNeuralInstalled(on) {
  neuralInstalled = on;
}

function browserVoices() {
  return new Promise(resolve => {
    if (!synth) return resolve(false);
    voice = pickVoice();
    if (voice) return resolve(true);
    const done = () => { voice = pickVoice(); resolve(Boolean(voice)); };
    synth.addEventListener('voiceschanged', done, { once: true });
    // Sommige browsers vuren voiceschanged nooit: niet eindeloos blijven wachten.
    setTimeout(done, 1200);
  });
}

/** Wacht tot de stemmen bekend zijn. Lost altijd op, ook zonder stem. */
export async function init() {
  const [, have] = await Promise.all([browserVoices(), neural.installed()]);
  neuralInstalled = have.tts;
  ready = true;
  // De stem alvast laden, zodat de eerste zin niet op zich laat wachten.
  if (usesNeural()) setTimeout(() => neural.prepare(['tts']).catch(() => {}), 1500);
  return Boolean(voice) || neuralInstalled;
}

/** Of er echt Spaans gesproken kan worden. Stuurt de luisteroefeningen aan. */
export const available = () => ready && (Boolean(voice) || usesNeural()) && storage.get().settings.speech !== false;

/** Armeert het geluid vanuit een gebruikersgebaar (vereist op iOS). */
export function arm() {
  neural.arm();
  if (!synth || !voice) return;
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  try { synth.speak(u); } catch { /* onbelangrijk */ }
}

function browserSpeak(text, rate) {
  if (!synth || !voice) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = rate;
  synth.speak(u);
}

export function speak(text, { rate = 0.9 } = {}) {
  if (storage.get().settings.speech === false) return;
  // "el frigo(rífico)" of "sencillo/-a" hardop voorlezen klinkt nergens naar.
  const say = speakable(text);
  if (usesNeural()) {
    synth?.cancel();
    neural.say(say, { rate }).catch(() => browserSpeak(say, rate));
    return;
  }
  browserSpeak(say, rate);
}

export function stop() {
  synth?.cancel();
  neural.stop();
}
