/* Eén keer luisteren: de microfoon aan, wachten tot je begint te praten, en
 * stoppen zodra je even stil bent. Geeft 16 kHz terug, wat Whisper wil.
 *
 * Wanneer praat je? Het geluidsniveau per 20 ms vergeleken met het geruis van
 * de kamer, gemeten in het eerste kwartseconde. Zo werkt het met en zonder
 * achtergrondlawaai, zonder model. */

const AC = globalThis.AudioContext ?? globalThis.webkitAudioContext;

const FRAME_MS = 20;
const CALIBRATE_MS = 240;
/** Zo lang stil na het praten en we stoppen. */
const SILENCE_MS = 1100;
/** Zo lang zonder iets te zeggen en we geven op. */
const NO_SPEECH_MS = 7000;
const MAX_MS = 15000;
const PREROLL_MS = 300;

export class RecordError extends Error {
  constructor(code) { super(code); this.code = code; }
}

/** Een foutcode in mensentaal. */
export function errorText(code) {
  switch (code) {
    case 'not-allowed': return 'Geen toegang tot de microfoon. Sta hem toe in je browser.';
    case 'no-mic': return 'Geen microfoon gevonden.';
    case 'no-speech': return 'Ik hoorde niets. Tik op de microfoon en probeer opnieuw.';
    default: return 'Opnemen lukte niet. Probeer opnieuw.';
  }
}

/** Herbemonsteren naar 16 kHz: met een OfflineAudioContext (goede filter), anders lineair. */
async function to16k(samples, rate) {
  if (rate === 16000) return samples;
  const OAC = globalThis.OfflineAudioContext ?? globalThis.webkitOfflineAudioContext;
  const length = Math.ceil((samples.length * 16000) / rate);
  if (OAC) {
    try {
      const off = new OAC(1, length, 16000);
      const buf = off.createBuffer(1, samples.length, rate);
      buf.getChannelData(0).set(samples);
      const src = off.createBufferSource();
      src.buffer = buf;
      src.connect(off.destination);
      src.start();
      return (await off.startRendering()).getChannelData(0);
    } catch { /* hieronder */ }
  }
  const out = new Float32Array(length);
  const step = rate / 16000;
  for (let i = 0; i < length; i++) {
    const x = i * step;
    const i0 = Math.floor(x);
    out[i] = (samples[i0] ?? 0) * (1 - (x - i0)) + (samples[i0 + 1] ?? 0) * (x - i0);
  }
  return out;
}

/**
 * Neemt één uiting op.
 * @param onLevel  (0–1, praat je?) tijdens het opnemen, voor een meter
 * @returns {{start: Promise<void>, done: Promise<Float32Array>, stop(): void}}
 *          start: de microfoon staat aan; done: de opname op 16 kHz.
 *          stop() rondt meteen af (wat er al is, telt).
 */
export function record({ onLevel = null } = {}) {
  let stopNow = null;
  let started;
  const start = new Promise(r => { started = r; });
  const done = (async () => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      started();
      throw new RecordError(err?.name === 'NotFoundError' ? 'no-mic' : err?.name === 'NotAllowedError' || err?.name === 'SecurityError' ? 'not-allowed' : 'error');
    }
    const ctx = new AC();
    if (ctx.state === 'suspended') await ctx.resume();
    const rate = ctx.sampleRate;
    const frame = Math.round((rate * FRAME_MS) / 1000);
    const source = ctx.createMediaStreamSource(stream);

    const chunks = [];
    let total = 0;
    let pending = new Float32Array(0);
    let frames = 0;
    let noise = [];
    let floor = 0.003;
    let speechAt = -1;
    let quietFrames = 0;
    let loudRun = 0;
    let manual = false;

    const result = new Promise(resolve => {
      const finish = () => resolve();
      stopNow = () => { manual = true; finish(); };
      const onSamples = data => {
        chunks.push(data);
        total += data.length;
        // In vensters van 20 ms het niveau bekijken.
        const merged = new Float32Array(pending.length + data.length);
        merged.set(pending);
        merged.set(data, pending.length);
        let o = 0;
        for (; o + frame <= merged.length; o += frame) {
          let s = 0;
          for (let i = o; i < o + frame; i++) s += merged[i] * merged[i];
          const rms = Math.sqrt(s / frame);
          frames++;
          const ms = frames * FRAME_MS;
          if (ms <= CALIBRATE_MS) { noise.push(rms); if (ms === CALIBRATE_MS) floor = Math.max(0.002, noise.sort((a, b) => a - b)[noise.length >> 1]); continue; }
          const loud = rms > Math.max(0.012, floor * 3.5);
          const quiet = rms < Math.max(0.008, floor * 2.2);
          onLevel?.(Math.min(1, rms / 0.15), loud);
          if (speechAt < 0) {
            loudRun = loud ? loudRun + 1 : 0;
            if (loudRun >= 3) speechAt = Math.max(0, ms - 3 * FRAME_MS);
            else if (ms > NO_SPEECH_MS) { resolve('no-speech'); return; }
          } else {
            quietFrames = quiet ? quietFrames + 1 : 0;
            if (quietFrames * FRAME_MS >= SILENCE_MS) { finish(); return; }
          }
          if (ms >= MAX_MS) { finish(); return; }
        }
        pending = merged.slice(o);
      };

      if (ctx.audioWorklet && typeof AudioWorkletNode === 'function') {
        ctx.audioWorklet.addModule(new URL('./capture.js', import.meta.url)).then(() => {
          const node = new AudioWorkletNode(ctx, 'vamos-capture');
          node.port.onmessage = e => onSamples(e.data);
          source.connect(node);
          started();
        }).catch(() => fallback());
      } else fallback();

      function fallback() {
        // Oudere browsers: ScriptProcessor (verouderd, maar overal aanwezig).
        const node = ctx.createScriptProcessor(2048, 1, 1);
        node.onaudioprocess = e => onSamples(new Float32Array(e.inputBuffer.getChannelData(0)));
        source.connect(node);
        node.connect(ctx.destination);
        started();
      }
    });

    const outcome = await result;
    stream.getTracks().forEach(t => t.stop());
    ctx.close().catch(() => {});
    // Zelf gestopt terwijl de meter niets zag (een stille microfoon): alles na het ijken telt.
    if (manual && speechAt < 0 && frames * FRAME_MS > CALIBRATE_MS + 400) speechAt = CALIBRATE_MS;
    if (outcome === 'no-speech' || speechAt < 0) throw new RecordError('no-speech');

    const all = new Float32Array(total);
    let o = 0;
    for (const c of chunks) { all.set(c, o); o += c.length; }
    // Van net voor het praten tot net na het laatste woord.
    const from = Math.max(0, Math.round(((speechAt - PREROLL_MS) * rate) / 1000));
    const tail = Math.max(0, quietFrames * FRAME_MS - PREROLL_MS);
    const to = Math.max(from + 1, all.length - Math.round((tail * rate) / 1000));
    return to16k(all.subarray(from, to), rate);
  })();
  done.catch(() => {});
  return { start, done, stop: () => stopNow?.() };
}
