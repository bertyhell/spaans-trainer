/* De stem en het gehoor van de app, op het toestel zelf.
 *
 *   installed()        welke modellen al op het toestel staan
 *   prepare(parts, cb) modellen ophalen (eenmalig, ±85 MB) en laden
 *   say(text)          Spaans uitspreken met de Piper-stem
 *   check(text, audio) hoe goed werd de zin nagezegd (zie speakScore.js)
 *   playRecording(pcm) je eigen opname terugspelen
 *   remove()           alles weer van het toestel halen
 *
 * Het rekenwerk gebeurt in voice/worker.js. Dit bestand regelt het geluid
 * (AudioContext) en de berichten heen en weer. */

import { VOICE_CACHE, filesFor, megabytes } from './models.js';

export { megabytes };

const AC = globalThis.AudioContext ?? globalThis.webkitAudioContext;

/** Kan dit toestel het? WebAssembly, een worker, Cache API, geluid en een microfoon. */
export const supported = () => typeof WebAssembly === 'object' && typeof Worker === 'function'
  && 'caches' in globalThis && Boolean(AC) && Boolean(navigator.mediaDevices?.getUserMedia);

let worker = null;
let seq = 0;
const pending = new Map();
const loaded = new Set();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const p = pending.get(data.id);
    if (!p) return;
    if ('progress' in data) { p.onProgress?.(data.progress); return; }
    pending.delete(data.id);
    data.ok ? p.resolve(data) : p.reject(new Error(data.error));
  };
  worker.onerror = e => {
    for (const p of pending.values()) p.reject(new Error(e.message || 'worker'));
    pending.clear();
  };
  return worker;
}

function call(type, payload = {}, { transfer = [], onProgress } = {}) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    getWorker().postMessage({ id, type, ...payload }, transfer);
  });
}

/** @returns {Promise<{tts: boolean, stt: boolean}>} staat alles al in de cache? */
export async function installed() {
  if (!supported()) return { tts: false, stt: false };
  try {
    const cache = await caches.open(VOICE_CACHE);
    const has = async parts => (await Promise.all(filesFor(parts).map(f => cache.match(f.url)))).every(Boolean);
    const [tts, stt] = await Promise.all([has(['tts']), has(['stt'])]);
    return { tts, stt };
  } catch {
    return { tts: false, stt: false };
  }
}

/** Is dit onderdeel al geladen en klaar om te gebruiken? */
export const ready = part => loaded.has(part);

const preparing = new Map();
/**
 * Haalt de modellen op (of uit de cache) en laadt ze. Twee keer vragen is één keer doen.
 * @param onProgress  0–1
 */
export function prepare(parts = ['tts', 'stt'], onProgress = null) {
  const todo = parts.filter(p => !loaded.has(p));
  if (!todo.length) return Promise.resolve();
  const key = todo.join('+');
  if (!preparing.has(key)) {
    preparing.set(key, call('load', { parts: todo }, { onProgress })
      .then(() => { todo.forEach(p => loaded.add(p)); })
      .finally(() => preparing.delete(key)));
  }
  return preparing.get(key);
}

/** Haalt alles weer weg: de cache en het geheugen. */
export async function remove() {
  worker?.terminate();
  worker = null;
  loaded.clear();
  await caches.delete(VOICE_CACHE);
}

/* ------------------------------------------------------------------ */
/* Afspelen                                                            */
/* ------------------------------------------------------------------ */

let ctx = null;
let current = null;
function audioContext() {
  ctx ??= new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Vanuit een tik of klik aanroepen: iOS speelt pas af na een gebaar. */
export function arm() {
  if (!AC) return;
  try { audioContext(); } catch { /* geen geluid */ }
}

export function stop() {
  try { current?.stop(); } catch { /* al gestopt */ }
  current = null;
}

/** Speelt een buffer af; lost op wanneer hij gedaan is (of gestopt). */
function play(samples, sampleRate) {
  stop();
  const c = audioContext();
  const buf = c.createBuffer(1, samples.length, sampleRate);
  // Even luid als de rest van de app: de piek op 0,9.
  let peak = 0;
  for (const v of samples) peak = Math.max(peak, Math.abs(v));
  const gain = peak > 0.01 ? 0.9 / peak : 1;
  const ch = buf.getChannelData(0);
  for (let i = 0; i < samples.length; i++) ch[i] = samples[i] * gain;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(c.destination);
  current = src;
  return new Promise(resolve => {
    src.onended = () => { if (current === src) current = null; resolve(); };
    src.start();
  });
}

/* De laatste uitspraken bewaren: "nog eens" mag niet opnieuw moeten rekenen. */
const spoken = new Map();
const SPOKEN_MAX = 24;

/**
 * Zegt een Spaanse tekst met de stem van het toestel.
 * @param rate  1 = gewoon tempo; 0,6 = traag
 * @returns {Promise<void>} na het afspelen
 */
export async function say(text, { rate = 0.9 } = {}) {
  const clip = await synth(text, { rate });
  return play(clip.audio, clip.sampleRate);
}

/** Het geluid van een tekst, zonder af te spelen. @returns {{audio: Float32Array, sampleRate: number}} */
export async function synth(text, { rate = 0.9 } = {}) {
  const key = `${rate}|${text}`;
  let clip = spoken.get(key);
  if (!clip) {
    await prepare(['tts']);
    const r = await call('say', { text, rate });
    clip = { audio: r.audio, sampleRate: r.sampleRate };
    spoken.set(key, clip);
    if (spoken.size > SPOKEN_MAX) spoken.delete(spoken.keys().next().value);
  }
  return clip;
}

/** Je eigen opname (16 kHz) terugspelen. */
export const playRecording = audio => play(audio, 16000);

/**
 * Hoe goed werd de zin nagezegd?
 * @param audio Float32Array op 16 kHz
 * @returns het oordeel van speakScore.judge, met `heard`
 */
export async function check(text, audio) {
  await prepare(['stt']);
  const copy = new Float32Array(audio);
  const r = await call('check', { text, audio: copy }, { transfer: [copy.buffer] });
  return r.result;
}
