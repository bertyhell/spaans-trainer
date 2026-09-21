/* Korte geluidjes via WebAudio — geen geluidsbestanden nodig.
 * De AudioContext wordt pas bij de eerste aanraking gemaakt, omdat browsers
 * hem anders geschorst laten. */

import * as storage from './storage.js';

let ctx = null;

function context() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Armeert de audio vanuit een gebruikersgebaar (vereist op iOS). */
export function arm() { context(); }

function tone(freq, start, duration, { type = 'sine', gain = 0.12 } = {}) {
  const c = context();
  if (!c) return;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  env.gain.setValueAtTime(0, c.currentTime + start);
  env.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
  osc.connect(env).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.02);
}

const enabled = () => storage.get().settings.sound !== false;

export function correct() {
  if (!enabled()) return;
  tone(587.33, 0, 0.12);      // re
  tone(880.00, 0.08, 0.18);   // la
}

export function incorrect() {
  if (!enabled()) return;
  tone(196.00, 0, 0.18, { type: 'triangle', gain: 0.10 });
  tone(164.81, 0.09, 0.22, { type: 'triangle', gain: 0.10 });
}

export function finish() {
  if (!enabled()) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.3));
}

export function tap() {
  if (!enabled()) return;
  tone(440, 0, 0.05, { gain: 0.05 });
}
