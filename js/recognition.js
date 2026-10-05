/* Spraakherkenning: zelf iets zeggen in plaats van typen.
 *
 * Werkt in Chrome (ook op Android) en in Safari vanaf iOS 14.5. Chrome stuurt
 * het geluid naar een server van Google om het te herkennen — daarom staat dit
 * standaard uit en zet je het zelf aan in de instellingen. Zonder ondersteuning
 * of zonder toestemming verdwijnen de spreekoefeningen gewoon. */

import * as storage from './storage.js';

const Recognition = globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition ?? null;

/** Kan deze browser luisteren? */
export const supported = () => Boolean(Recognition);

/** Luisteren kan én de gebruiker heeft het aangezet. */
export const enabled = () => supported() && storage.get().settings.speaking === true;

/**
 * Luistert één keer naar Spaans.
 * @returns {{done: Promise<string[]>, stop(): void}} de herkende zinnen, beste
 *          eerst. Bij een fout wordt `done` verworpen met de foutcode van de
 *          browser ('not-allowed', 'no-speech', 'network', …).
 */
export function listen({ lang = 'es-ES', alternatives = 5 } = {}) {
  const rec = new Recognition();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = alternatives;
  rec.continuous = false;

  const done = new Promise((resolve, reject) => {
    let heard = [];
    rec.onresult = e => {
      const result = e.results[0];
      heard = Array.from({ length: result.length }, (_, i) => result[i].transcript.trim()).filter(Boolean);
    };
    rec.onerror = e => reject(e.error ?? 'error');
    rec.onend = () => (heard.length ? resolve(heard) : reject('no-speech'));
  });
  try { rec.start(); } catch { /* al bezig: onend volgt vanzelf */ }
  return { done, stop: () => { try { rec.stop(); } catch { /* al gestopt */ } } };
}

/** Een foutcode in mensentaal. */
export function errorText(code) {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Geen toegang tot de microfoon. Sta hem toe in je browser, of zet de spreekoefeningen uit.';
    case 'no-speech':
      return 'Ik hoorde niets. Tik op de microfoon en probeer opnieuw.';
    case 'network':
      return 'Geen verbinding: herkennen lukt enkel online.';
    case 'audio-capture':
      return 'Geen microfoon gevonden.';
    default:
      return 'Dat lukte niet. Probeer opnieuw.';
  }
}
