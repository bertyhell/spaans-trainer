/* Whisper (tiny, meertalig) zonder bibliotheek: geluid → log-mel → encoder →
 * woord voor woord decoderen. Puur rekenwerk; de ONNX-sessies komen van de
 * aanroeper (de worker in de browser, onnxruntime in de tests), zodat dit
 * bestand overal hetzelfde draait.
 *
 * Kenmerken zoals WhisperFeatureExtractor van Hugging Face: 16 kHz, vensters
 * van 400 met stap 160, 80 mel-banden (Slaney), log10, alles opgevuld tot 30 s.
 * Decoderen is gretig (telkens het waarschijnlijkste token), met de
 * KV-cache van het "merged" decodermodel. */

export const SAMPLE_RATE = 16000;
const N_FFT = 400;
const HOP = 160;
const N_MELS = 80;
const N_FRAMES = 3000;
const N_SAMPLES = N_FRAMES * HOP;
const N_BINS = N_FFT / 2 + 1;

export const TOKENS = {
  eot: 50257,
  sot: 50258,
  es: 50262,
  transcribe: 50359,
  noTimestamps: 50363,
};
/* begin_suppress_tokens en suppress_tokens uit generation_config.json van whisper-tiny. */
const BEGIN_SUPPRESS = [220, TOKENS.eot];
const SUPPRESS = [1, 2, 7, 8, 9, 10, 14, 25, 26, 27, 28, 29, 31, 58, 59, 60, 61, 62, 63, 90, 91, 92, 93, 359, 503, 522, 542, 873, 893, 902, 918, 922, 931, 1350, 1853, 1982, 2460, 2627, 3246, 3253, 3268, 3536, 3846, 3961, 4183, 4667, 6585, 6647, 7273, 9061, 9383, 10428, 10929, 11938, 12033, 12331, 12562, 13793, 14157, 14635, 15265, 15618, 16553, 16604, 18362, 18956, 20075, 21675, 22520, 26130, 26161, 26435, 28279, 29464, 31650, 32302, 32470, 36865, 42863, 47425, 49870, 50254, 50258, 50358, 50359, 50360, 50361, 50362];

/* ------------------------------------------------------------------ */
/* Log-mel                                                              */
/* ------------------------------------------------------------------ */

const hzToMel = f => (f < 1000 ? (3 * f) / 200 : 15 + Math.log(f / 1000) * (27 / Math.log(6.4)));
const melToHz = m => (m < 15 ? (200 * m) / 3 : 1000 * Math.exp((Math.log(6.4) / 27) * (m - 15)));

let tables = null;
function getTables() {
  if (tables) return tables;
  // Driehoekige filters, Slaney-genormaliseerd: [N_MELS][N_BINS].
  const melMax = hzToMel(SAMPLE_RATE / 2);
  const pts = Array.from({ length: N_MELS + 2 }, (_, i) => melToHz((melMax * i) / (N_MELS + 1)));
  const fft = Array.from({ length: N_BINS }, (_, k) => (k * SAMPLE_RATE / 2) / (N_BINS - 1));
  const filters = Array.from({ length: N_MELS }, (_, m) => {
    const row = new Float32Array(N_BINS);
    const norm = 2 / (pts[m + 2] - pts[m]);
    for (let k = 0; k < N_BINS; k++) {
      const down = (fft[k] - pts[m]) / (pts[m + 1] - pts[m]);
      const up = (pts[m + 2] - fft[k]) / (pts[m + 2] - pts[m + 1]);
      row[k] = Math.max(0, Math.min(down, up)) * norm;
    }
    return row;
  });
  // Eén keer cos/sin uitrekenen; een DFT van 400 punten is dan een paar optellingen per bin.
  const cos = new Float32Array(N_BINS * N_FFT);
  const sin = new Float32Array(N_BINS * N_FFT);
  for (let k = 0; k < N_BINS; k++) {
    for (let n = 0; n < N_FFT; n++) {
      const a = (2 * Math.PI * k * n) / N_FFT;
      cos[k * N_FFT + n] = Math.cos(a);
      sin[k * N_FFT + n] = Math.sin(a);
    }
  }
  const window = Float32Array.from({ length: N_FFT }, (_, n) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / N_FFT));
  tables = { filters, cos, sin, window };
  return tables;
}

/**
 * Het log-melspectrogram van hoogstens 30 s geluid op 16 kHz.
 * @param {Float32Array} audio
 * @returns {Float32Array} [80 × 3000], rij per melband
 */
export function logMel(audio) {
  const { filters, cos, sin, window } = getTables();
  const x = new Float32Array(N_SAMPLES);
  x.set(audio.subarray(0, N_SAMPLES));
  // Gecentreerde vensters: aan beide kanten 200 stalen gespiegeld.
  const pad = N_FFT / 2;
  const at = i => (i < 0 ? x[-i] : i >= N_SAMPLES ? x[2 * N_SAMPLES - i - 2] : x[i]);

  const mel = new Float32Array(N_MELS * N_FRAMES);
  // Vensters die volledig in de opvulling vallen, zijn nul: die hoeven we niet uit te rekenen.
  const lastReal = Math.min(N_FRAMES, Math.ceil((Math.min(audio.length, N_SAMPLES) + pad) / HOP) + 1);
  const frame = new Float32Array(N_FFT);
  const power = new Float32Array(N_BINS);
  let maxLog = -Infinity;
  for (let t = 0; t < N_FRAMES; t++) {
    if (t < lastReal) {
      const start = t * HOP - pad;
      for (let n = 0; n < N_FFT; n++) frame[n] = at(start + n) * window[n];
      for (let k = 0; k < N_BINS; k++) {
        let re = 0;
        let im = 0;
        const o = k * N_FFT;
        for (let n = 0; n < N_FFT; n++) { re += frame[n] * cos[o + n]; im -= frame[n] * sin[o + n]; }
        power[k] = re * re + im * im;
      }
    } else power.fill(0);
    for (let m = 0; m < N_MELS; m++) {
      const f = filters[m];
      let s = 0;
      for (let k = 0; k < N_BINS; k++) s += f[k] * power[k];
      const v = Math.log10(Math.max(s, 1e-10));
      mel[m * N_FRAMES + t] = v;
      if (v > maxLog) maxLog = v;
    }
  }
  for (let i = 0; i < mel.length; i++) mel[i] = (Math.max(mel[i], maxLog - 8) + 4) / 4;
  return mel;
}

/* ------------------------------------------------------------------ */
/* Tokens → tekst                                                       */
/* ------------------------------------------------------------------ */

/* GPT-2 byte-level BPE: elk byte heeft een eigen zichtbaar teken. */
let charOfByte = null;
let byteOfChar = null;
function byteTables() {
  if (charOfByte) return;
  const bs = [];
  for (let b = 33; b <= 126; b++) bs.push(b);
  for (let b = 161; b <= 172; b++) bs.push(b);
  for (let b = 174; b <= 255; b++) bs.push(b);
  const cs = [...bs];
  let n = 0;
  for (let b = 0; b < 256; b++) if (!bs.includes(b)) { bs.push(b); cs.push(256 + n++); }
  charOfByte = new Array(256);
  byteOfChar = new Map();
  bs.forEach((b, i) => { charOfByte[b] = String.fromCodePoint(cs[i]); byteOfChar.set(charOfByte[b], b); });
}

const PRETOKEN = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;

/**
 * De tokenizer van Whisper: vocab.json + merges.txt.
 *   decode(ids)  → tekst
 *   encode(text) → [{id, start, end}] met de tekenposities in text
 */
export class Tokenizer {
  constructor(vocabJson, mergesTxt) {
    byteTables();
    this.ids = new Map(Object.entries(vocabJson));
    this.tokens = [];
    for (const [tok, id] of this.ids) this.tokens[id] = tok;
    this.ranks = new Map();
    mergesTxt.split('\n').filter(l => l && !l.startsWith('#')).forEach((l, i) => this.ranks.set(l, i));
    this.cache = new Map();
  }

  decode(ids) {
    const bytes = [];
    for (const id of ids) {
      if (id >= TOKENS.eot) continue;
      for (const ch of this.tokens[id] ?? '') bytes.push(byteOfChar.get(ch) ?? 63);
    }
    return new TextDecoder().decode(new Uint8Array(bytes)).trim();
  }

  bpe(piece) {
    if (this.cache.has(piece)) return this.cache.get(piece);
    let word = [...piece];
    while (word.length > 1) {
      let best = null;
      let bestRank = Infinity;
      for (let i = 0; i < word.length - 1; i++) {
        const r = this.ranks.get(`${word[i]} ${word[i + 1]}`);
        if (r != null && r < bestRank) { bestRank = r; best = i; }
      }
      if (best == null) break;
      const a = word[best];
      const b = word[best + 1];
      const merged = [];
      for (let i = 0; i < word.length; i++) {
        if (i < word.length - 1 && word[i] === a && word[i + 1] === b) { merged.push(a + b); i++; }
        else merged.push(word[i]);
      }
      word = merged;
    }
    this.cache.set(piece, word);
    return word;
  }

  encode(text) {
    const out = [];
    const enc = new TextEncoder();
    for (const m of text.matchAll(PRETOKEN)) {
      // Elk teken van het stuk naar zijn bytes, en terug naar zijn positie in de tekst.
      const owner = [];
      let mapped = '';
      let pos = m.index;
      for (const ch of m[0]) {
        for (const b of enc.encode(ch)) { mapped += charOfByte[b]; owner.push(pos); }
        pos += ch.length;
      }
      let k = 0;
      for (const tok of this.bpe(mapped)) {
        const len = [...tok].length;
        const id = this.ids.get(tok);
        if (id != null) out.push({ id, start: owner[k], end: (owner[k + len] ?? pos) });
        k += len;
      }
    }
    return out;
  }
}

/* ------------------------------------------------------------------ */
/* Herkennen                                                            */
/* ------------------------------------------------------------------ */

const PROMPT = [TOKENS.sot, TOKENS.es, TOKENS.transcribe, TOKENS.noTimestamps];

/** Het geluid door de encoder: één keer per opname, daarna kan je er meerdere keren mee decoderen. */
export async function encode(ort, encoder, audio) {
  const features = new ort.Tensor('float32', logMel(audio), [1, N_MELS, N_FRAMES]);
  const { last_hidden_state: hidden } = await encoder.run({ input_features: features });
  return hidden;
}

function emptyPast(ort, decoder, hidden) {
  // Whisper heeft altijd koppen van 64 breed: tiny 6, base 8, small 12.
  const layers = decoder.inputNames.filter(n => /^past_key_values\.\d+\.decoder\.key$/.test(n)).length;
  const heads = hidden.dims[2] / 64;
  const empty = () => new ort.Tensor('float32', new Float32Array(0), [1, heads, 0, 64]);
  const past = {};
  for (let i = 0; i < layers; i++) {
    for (const kind of ['decoder', 'encoder']) {
      past[`past_key_values.${i}.${kind}.key`] = empty();
      past[`past_key_values.${i}.${kind}.value`] = empty();
    }
  }
  return { past, layers };
}

/** log-softmax van één rij logits, met wat Whisper hier nooit mag zeggen op -∞. */
function logSoftmax(row, first) {
  const V = row.length;
  const out = new Float32Array(row);
  for (const t of SUPPRESS) out[t] = -Infinity;
  for (let t = TOKENS.eot + 1; t < V; t++) out[t] = -Infinity;
  if (first) for (const t of BEGIN_SUPPRESS) out[t] = -Infinity;
  let max = -Infinity;
  for (let t = 0; t < V; t++) if (out[t] > max) max = out[t];
  let sum = 0;
  for (let t = 0; t < V; t++) if (out[t] > -Infinity) sum += Math.exp(out[t] - max);
  const lse = max + Math.log(sum);
  for (let t = 0; t < V; t++) out[t] -= lse;
  return out;
}

/**
 * Wat er gezegd werd, volgens Whisper: telkens het waarschijnlijkste token.
 * @returns {{tokens: number[], logprob: number}} logprob: gemiddeld per token
 */
export async function greedy(ort, decoder, hidden, { maxTokens = 80 } = {}) {
  let { past, layers } = emptyPast(ort, decoder, hidden);
  let input = PROMPT;
  const out = [];
  let total = 0;
  for (let step = 0; step < maxTokens; step++) {
    const r = await decoder.run({
      input_ids: new ort.Tensor('int64', BigInt64Array.from(input.map(BigInt)), [1, input.length]),
      encoder_hidden_states: hidden,
      use_cache_branch: new ort.Tensor('bool', [step > 0], [1]),
      ...past,
    });
    const V = r.logits.dims[2];
    const rows = r.logits.dims[1];
    const lp = logSoftmax(r.logits.data.subarray((rows - 1) * V, rows * V), step === 0);
    let best = 0;
    for (let t = 1; t < V; t++) if (lp[t] > lp[best]) best = t;
    total += lp[best];

    // De cache voor de volgende stap; de encoder-sleutels komen uit de eerste stap.
    const next = {};
    for (let i = 0; i < layers; i++) {
      for (const kind of ['key', 'value']) {
        next[`past_key_values.${i}.decoder.${kind}`] = r[`present.${i}.decoder.${kind}`];
        next[`past_key_values.${i}.encoder.${kind}`] = step === 0 ? r[`present.${i}.encoder.${kind}`] : past[`past_key_values.${i}.encoder.${kind}`];
      }
    }
    past = next;

    if (best === TOKENS.eot) break;
    out.push(best);
    input = [best];
    if (repeats(out)) { out.length -= 8; break; }
  }
  return { tokens: out, logprob: total / (out.length + 1) };
}

/**
 * Hoe goed past een gegeven tekst bij het geluid? Eén doorgang door de decoder
 * met de hele tekst ineens ("teacher forcing").
 * @param ids  de tokens van de verwachte tekst (zonder prompt, zonder eot)
 * @returns {{perToken: number[], eot: number}} log-kans van elk token in zijn context
 */
export async function forced(ort, decoder, hidden, ids) {
  const { past } = emptyPast(ort, decoder, hidden);
  const input = [...PROMPT, ...ids];
  const r = await decoder.run({
    input_ids: new ort.Tensor('int64', BigInt64Array.from(input.map(BigInt)), [1, input.length]),
    encoder_hidden_states: hidden,
    use_cache_branch: new ort.Tensor('bool', [false], [1]),
    ...past,
  });
  const V = r.logits.dims[2];
  const row = j => logSoftmax(r.logits.data.subarray(j * V, (j + 1) * V), j === PROMPT.length - 1);
  const perToken = ids.map((id, k) => row(PROMPT.length - 1 + k)[id]);
  const eot = row(input.length - 1)[TOKENS.eot];
  return { perToken, eot };
}

/** Whisper blijft soms hetzelfde herhalen bij stilte of ruis: stop na drie keer hetzelfde viertal. */
function repeats(ids) {
  const n = ids.length;
  if (n < 12) return false;
  const tail = ids.slice(n - 4).join(',');
  return ids.slice(n - 8, n - 4).join(',') === tail && ids.slice(n - 12, n - 8).join(',') === tail;
}
