/* De rekenaar achter de stem en de spraakherkenning, in een eigen draad zodat
 * de app niet hapert. Haalt de modellen één keer op (Cache API), laadt ze in
 * ONNX Runtime en beantwoordt berichten:
 *
 *   load   {parts: ['tts', 'stt']}           → {ok}, onderweg {progress}
 *   say    {text, rate}                      → {audio, sampleRate}
 *   check  {text, audio}                     → het oordeel van speakScore.judge
 *   hear   {audio}                           → {text} (vrij herkennen)
 *
 * Alles blijft op het toestel: geen geluid gaat naar een server. */

import { ORT_BASE, VOICE_CACHE, FILES } from './models.js';
import { synthesize } from './piper.js';
import { Tokenizer, encode, greedy, forced, SAMPLE_RATE } from './whisper.js';
import { phonemes } from '../phonetic.js';
import { judge, expectedWords, forcedPerWord } from '../speakScore.js';

let ort = null;
let tts = null;   // {session, config}
let stt = null;   // {encoder, decoder, tokenizer, silent}

/** Een bestand uit de cache, anders van het net (en dan bewaren). Meldt de voortgang. */
async function file(f, onBytes) {
  const cache = await caches.open(VOICE_CACHE);
  let res = await cache.match(f.url);
  if (!res) {
    const net = await fetch(f.url, { mode: 'cors' });
    if (!net.ok) throw new Error(`${f.key}: HTTP ${net.status}`);
    // Zelf lezen om de voortgang te kunnen tonen; daarna pas in de cache.
    const reader = net.body.getReader();
    const chunks = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      onBytes(value.byteLength);
    }
    const blob = new Blob(chunks, { type: net.headers.get('content-type') ?? 'application/octet-stream' });
    await cache.put(f.url, new Response(blob, { headers: { 'content-type': blob.type } }));
    res = await cache.match(f.url);
  } else onBytes(f.size);
  return res.arrayBuffer();
}

async function runtime(get) {
  if (ort) return ort;
  const wasm = await get(FILES.runtime[0]);
  const mod = await import(`${ORT_BASE}ort.wasm.bundle.min.mjs`);
  mod.env.wasm.wasmBinary = wasm;
  mod.env.wasm.numThreads = 1;
  mod.env.logLevel = 'error';
  ort = mod;
  return ort;
}

const session = buffer => ort.InferenceSession.create(new Uint8Array(buffer), {
  executionProviders: ['wasm'],
  graphOptimizationLevel: 'all',
});

async function load(parts, id) {
  const wanted = [...FILES.runtime, ...parts.flatMap(p => FILES[p])];
  const total = wanted.reduce((s, f) => s + f.size, 0);
  let loaded = 0;
  let last = 0;
  const get = f => file(f, n => {
    loaded += n;
    const now = performance.now();
    if (now - last > 120) { last = now; postMessage({ id, progress: Math.min(1, loaded / total) }); }
  });

  await runtime(get);
  if (parts.includes('tts') && !tts) {
    const [model, config] = [await get(FILES.tts[0]), await get(FILES.tts[1])];
    tts = { session: await session(model), config: JSON.parse(new TextDecoder().decode(config)) };
  }
  if (parts.includes('stt') && !stt) {
    const buf = {};
    for (const f of FILES.stt) buf[f.key] = await get(f);
    const encoder = await session(buf.encoder);
    const decoder = await session(buf.decoder);
    const text = b => new TextDecoder().decode(b);
    const tokenizer = new Tokenizer(JSON.parse(text(buf.vocab)), text(buf.merges));
    // Hoe waarschijnlijk is een zin zonder geluid? De maatstaf voor het bewijs per woord.
    const silent = await encode(ort, encoder, new Float32Array(SAMPLE_RATE));
    stt = { encoder, decoder, tokenizer, silent };
  }
  postMessage({ id, progress: 1 });
}

/** Alle zinnen van een tekst achter elkaar, met een korte stilte ertussen. */
async function say(text, rate) {
  const { session: s, config } = tts;
  const rateHz = config.audio.sample_rate;
  const gap = new Float32Array(Math.round(rateHz * 0.18));
  const parts = [];
  for (const p of phonemes(text)) {
    if (parts.length) parts.push(gap);
    parts.push(await synthesize(ort, s, config, p, { rate }));
  }
  const n = parts.reduce((a, p) => a + p.length, 0);
  const audio = new Float32Array(n);
  let o = 0;
  for (const p of parts) { audio.set(p, o); o += p.length; }
  return { audio, sampleRate: rateHz };
}

async function hear(audio) {
  const hidden = await encode(ort, stt.encoder, audio);
  const { tokens } = await greedy(ort, stt.decoder, hidden);
  return { hidden, text: stt.tokenizer.decode(tokens) };
}

async function check(text, audio) {
  const { hidden, text: heard } = await hear(audio);
  // Het bewijs per woord: log-kans van de verwachte zin bij dit geluid, min die bij stilte.
  const toks = stt.tokenizer.encode(` ${text}`);
  const ids = toks.map(t => t.id);
  const [withAudio, without] = [await forced(ort, stt.decoder, hidden, ids), await forced(ort, stt.decoder, stt.silent, ids)];
  const words = expectedWords(text);
  const spans = toks.map(t => ({ start: t.start - 1, end: t.end - 1 }));
  const evidence = forcedPerWord(words, spans, withAudio.perToken.map((v, k) => v - without.perToken[k]));
  return { ...judge(text, heard, evidence), heard };
}

let queue = Promise.resolve();
onmessage = ({ data }) => {
  const { id, type } = data;
  // Eén ding tegelijk: het model draait op één draad.
  queue = queue.then(async () => {
    try {
      if (type === 'load') { await load(data.parts, id); postMessage({ id, ok: true }); return; }
      if (type === 'say') {
        const r = await say(data.text, data.rate ?? 1);
        postMessage({ id, ok: true, ...r }, [r.audio.buffer]);
        return;
      }
      if (type === 'check') { postMessage({ id, ok: true, result: await check(data.text, data.audio) }); return; }
      if (type === 'hear') { postMessage({ id, ok: true, text: (await hear(data.audio)).text }); return; }
      throw new Error(`onbekend bericht: ${type}`);
    } catch (err) {
      postMessage({ id, ok: false, error: String(err?.message ?? err) });
    }
  });
};
