/* Welke bestanden de stem en de spraakherkenning nodig hebben, en waar ze
 * vandaan komen. Alles met een vaste versie: een model dat ongemerkt verandert,
 * verandert ook hoe streng of hoe vals de app klinkt.
 *
 *   runtime  ONNX Runtime Web (WebAssembly, één draad: statische hosting kan
 *            de headers voor meerdere draden niet zetten)
 *   tts      Piper, stem "sharvard" (es_ES, medium, mannelijke spreker),
 *            gewichten als float16 opgeslagen: half zo groot, zelfde klank
 *            (tools/make-voice.py). Gekozen boven "davefx", die korte losse
 *            woorden onverstaanbaar maakt (mal, más, sol).
 *   stt      Whisper tiny, meertalig, 8-bit
 *
 * Bewaard in de Cache API onder VOICE_CACHE, los van de cache van de app:
 * een nieuwe versie van de app hoeft de modellen niet opnieuw op te halen. */

export const ORT_VERSION = '1.23.2';
export const ORT_BASE = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
export const VOICE_CACHE = 'vamos-voice-1';

const WHISPER = 'https://huggingface.co/onnx-community/whisper-tiny/resolve/ff4177021cc41f7db950912b73ea4fdf7d01d8e7/';
const local = path => new URL(`../../models/${path}`, import.meta.url).href;

/** size: uitgepakte grootte in bytes, voor de voortgangsbalk. */
export const FILES = {
  runtime: [
    { key: 'ort-wasm', url: `${ORT_BASE}ort-wasm-simd-threaded.wasm`, size: 11905541 },
  ],
  tts: [
    { key: 'voice', url: local('es_ES-sharvard-medium.fp16.onnx'), size: 38825181 },
    { key: 'voice-config', url: local('es_ES-sharvard-medium.onnx.json'), size: 5486 },
  ],
  stt: [
    { key: 'encoder', url: `${WHISPER}onnx/encoder_model_quantized.onnx`, size: 10124990 },
    { key: 'decoder', url: `${WHISPER}onnx/decoder_model_merged_quantized.onnx`, size: 30719241 },
    { key: 'vocab', url: `${WHISPER}vocab.json`, size: 1036584 },
    { key: 'merges', url: `${WHISPER}merges.txt`, size: 493869 },
  ],
};

/** De bestanden voor deze onderdelen, met de runtime erbij. */
export const filesFor = parts => [...FILES.runtime, ...parts.flatMap(p => FILES[p])];

/** Totale grootte in MB, afgerond, voor in de interface. */
export const megabytes = parts => Math.round(filesFor(parts).reduce((s, f) => s + f.size, 0) / 1e6);
