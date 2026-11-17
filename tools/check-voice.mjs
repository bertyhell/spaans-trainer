/* Klopt de uitspraak? Laat de stem van de spreekmodus elke zin en elk woord
 * zeggen, laat Whisper meeluisteren, en meldt wat niet terugkomt.
 *
 *   npm i --no-save onnxruntime-node      (eenmalig; de app zelf heeft het niet nodig)
 *   node tools/check-voice.mjs                     alles, met whisper-tiny zoals in de app
 *   node tools/check-voice.mjs --asr small         strenger: whisper-small hoort beter
 *   node tools/check-voice.mjs --kind sentence --limit 50 --out verslag.md
 *
 * Twee toetsen per tekst:
 *   oordeel   wat de app zou zeggen als jij precies zo sprak als de stem
 *             (speakScore.judge, met het bewijs per woord). Moet "ok" zijn,
 *             anders keurt de app zijn eigen voorbeeld af.
 *   verstaan  hoeveel van de klanken Whisper vrij terughoort, per woord. Een
 *             woord dat een goed model niet verstaat, wordt misschien verkeerd
 *             uitgesproken: nakijken (klankschrift, uitschrijven in phonetic.js).
 *
 * Whisper komt van Hugging Face en wordt bewaard in .cache/voice-check/. */

import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { cpus } from 'node:os';

const ROOT = new URL('../', import.meta.url);
/** --naam waarde, of --naam alleen (true). Een waarde mag zelf "--" bevatten (paden). */
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const next = process.argv[i + 1];
  args[a.slice(2)] = next != null && !next.startsWith('--') ? (i++, next) : true;
}
const ASR = args.asr ?? 'tiny';
const LIMIT = Number(args.limit ?? Infinity);
const KIND = args.kind ?? 'all';

let ort;
try { ort = (await import('onnxruntime-node')).default; } catch {
  console.error('\n  onnxruntime-node ontbreekt. Installeer het (enkel voor deze controle):\n    npm i --no-save onnxruntime-node\n');
  process.exit(1);
}

const { encode, greedy, forced, Tokenizer } = await import(new URL('js/voice/whisper.js', ROOT));
const { synthesize } = await import(new URL('js/voice/piper.js', ROOT));
const { phonemes, ipa } = await import(new URL('js/phonetic.js', ROOT));
const { judge, expectedWords, forcedPerWord, phoneMatch, simplePhones, sayText } = await import(new URL('js/speakScore.js', ROOT));
const { analyze } = await import(new URL('js/phonetic.js', ROOT));

/* ------------------------------------------------------------------ */
/* Modellen                                                            */
/* ------------------------------------------------------------------ */

const REVISIONS = { tiny: 'ff4177021cc41f7db950912b73ea4fdf7d01d8e7', base: 'main', small: 'main' };
async function whisperFile(name) {
  const dir = new URL(`.cache/voice-check/whisper-${ASR}/`, ROOT);
  const path = new URL(name, dir);
  if (!existsSync(path)) {
    await mkdir(new URL('onnx/', dir), { recursive: true });
    const url = `https://huggingface.co/onnx-community/whisper-${ASR}/resolve/${REVISIONS[ASR] ?? 'main'}/${name}`;
    process.stderr.write(`  ophalen: ${url}\n`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    await writeFile(path, Buffer.from(await res.arrayBuffer()));
  }
  return path.pathname;
}

const threads = Math.max(1, Math.min(8, cpus().length - 1));
const opts = { intraOpNumThreads: threads };
const encoder = await ort.InferenceSession.create(await whisperFile('onnx/encoder_model_quantized.onnx'), opts);
const decoder = await ort.InferenceSession.create(await whisperFile('onnx/decoder_model_merged_quantized.onnx'), opts);
const tokenizer = new Tokenizer(JSON.parse(await readFile(await whisperFile('vocab.json'), 'utf8')), await readFile(await whisperFile('merges.txt'), 'utf8'));
const voice = await ort.InferenceSession.create(new URL('models/es_ES-sharvard-medium.fp16.onnx', ROOT).pathname, opts);
const config = JSON.parse(await readFile(new URL('models/es_ES-sharvard-medium.onnx.json', ROOT), 'utf8'));
const silent = await encode(ort, encoder, new Float32Array(16000));

/* ------------------------------------------------------------------ */
/* Geluid                                                              */
/* ------------------------------------------------------------------ */

/** Herbemonsteren met een venster-sinc (Lanczos, a=8): goed genoeg om niets te verliezen. */
function resample(x, from, to) {
  const ratio = from / to;
  const n = Math.floor(x.length / ratio);
  const out = new Float32Array(n);
  const a = 8;
  const cutoff = Math.min(1, to / from);
  for (let i = 0; i < n; i++) {
    const c = i * ratio;
    const lo = Math.ceil(c - a / cutoff);
    const hi = Math.floor(c + a / cutoff);
    let s = 0;
    let w = 0;
    for (let j = Math.max(0, lo); j <= Math.min(x.length - 1, hi); j++) {
      const t = (j - c) * cutoff;
      const k = t === 0 ? 1 : (Math.sin(Math.PI * t) / (Math.PI * t)) * (Math.sin((Math.PI * t) / a) / ((Math.PI * t) / a));
      s += x[j] * k;
      w += k;
    }
    out[i] = w ? s / w : 0;
  }
  return out;
}

async function speak(text) {
  const parts = [];
  for (const p of phonemes(text)) {
    parts.push(await synthesize(ort, voice, config, p, { rate: 1 }));
    parts.push(new Float32Array(Math.round(config.audio.sample_rate * 0.18)));
  }
  const all = new Float32Array(parts.reduce((s, p) => s + p.length, 0));
  let o = 0;
  for (const p of parts) { all.set(p, o); o += p.length; }
  return resample(all, config.audio.sample_rate, 16000);
}

/* ------------------------------------------------------------------ */
/* Controle                                                            */
/* ------------------------------------------------------------------ */

const src = await readFile(new URL('data/course.js', ROOT), 'utf8');
const window = {};
new Function('window', src)(window);
const kinds = KIND === 'all' ? ['sentence', 'dialogue', 'vocab'] : KIND.split(',');
const texts = [...new Set(window.COURSE.atoms.filter(a => kinds.includes(a.kind)).map(sayText).filter(Boolean))].slice(0, LIMIT);

const problems = [];
const t0 = Date.now();
// Onderweg al wegschrijven: een lange controle die op het eind misloopt, is dan niet verloren.
const partial = args.out ? `${args.out}.jsonl` : null;
if (partial) await writeFile(partial, '');
for (const [i, text] of texts.entries()) {
  const audio = await speak(text);
  const hidden = await encode(ort, encoder, audio);
  const heard = tokenizer.decode((await greedy(ort, decoder, hidden)).tokens);
  const toks = tokenizer.encode(` ${text}`);
  const ids = toks.map(t => t.id);
  const [fa, fs] = [await forced(ort, decoder, hidden, ids), await forced(ort, decoder, silent, ids)];
  const words = expectedWords(text);
  const evidence = forcedPerWord(words, toks.map(t => ({ start: t.start - 1, end: t.end - 1 })), fa.perToken.map((v, k) => v - fs.perToken[k]));
  const verdict = judge(text, heard, evidence);
  const heardIpa = analyze(heard, { mode: 'ipa' }).filter(t => t.spoken != null).map(t => t.ipa).join(' ');
  const match = phoneMatch(words, simplePhones(heardIpa));
  const unclear = words.filter((w, k) => match[k] < 0.5 && w.weight >= 2).map(w => w.text);
  if (verdict.verdict !== 'ok' || unclear.length) {
    const p = { text, ipa: ipa(text), heard, verdict: verdict.verdict, score: verdict.score, unclear,
      weak: verdict.words.filter(w => w.state !== 'ok').map(w => w.text) };
    problems.push(p);
    if (partial) await appendFile(partial, `${JSON.stringify(p)}\n`);
  }
  if ((i + 1) % 25 === 0 || i + 1 === texts.length) {
    const s = (Date.now() - t0) / 1000;
    process.stderr.write(`\r  ${i + 1}/${texts.length}  ${problems.length} na te kijken  ${(s / (i + 1)).toFixed(2)} s/tekst   `);
  }
}
process.stderr.write('\n');

const rejected = problems.filter(p => p.verdict !== 'ok');
const lines = [
  `# Uitspraakcontrole — stem sharvard, gehoor whisper-${ASR}`,
  '',
  `${texts.length} teksten. Het eigen voorbeeld afgekeurd: ${rejected.length}. Woorden die Whisper vrij niet terughoorde: ${problems.filter(p => p.unclear.length).length} teksten.`,
  '',
  ...problems.map(p => `- ${p.verdict === 'ok' ? '' : `**${p.verdict}** `}${p.text}  ${p.ipa}\n  hoorde: „${p.heard}”${p.unclear.length ? ` · onduidelijk: ${p.unclear.join(', ')}` : ''}${p.weak.length ? ` · zwak: ${p.weak.join(', ')}` : ''}`),
];
const report = lines.join('\n');
if (args.out) await writeFile(args.out, `${report}\n`);
console.log(args.out ? `\n  verslag: ${args.out}\n` : report);
process.exitCode = rejected.length ? 1 : 0;
