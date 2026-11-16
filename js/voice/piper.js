/* Piper: van espeak-fonemen naar de id's die het model kent, en terug naar
 * geluid. Zoals piper zelf (phonemize_espeak.py, phoneme_ids.py): elk teken
 * apart na NFD-ontleding, bekende klinkerclusters (aɪ, aʊ …) samen, en tussen
 * elke twee een opvul-id. */

/** @returns {number[]} ^ _ p₁ _ p₂ _ … pₙ _ $ */
export function phonemeIds(phonemes, config) {
  const map = config.phoneme_id_map;
  const clusters = new Set((config.vowel_clusters ?? []).map(c => c.join('')).filter(c => map[c]));
  const chars = [...phonemes.normalize('NFD')];
  const ids = [...map['^'], ...map._];
  for (let i = 0; i < chars.length; i++) {
    const pair = chars[i] + (chars[i + 1] ?? '');
    const p = clusters.has(pair) ? (i++, pair) : chars[i];
    if (!map[p]) continue;   // een teken dat de stem niet kent, zeggen we niet
    ids.push(...map[p], ...map._);
  }
  ids.push(...map.$);
  return ids;
}

/**
 * Eén zin uitspreken.
 * @param rate  1 = gewoon tempo, kleiner = trager (zoals bij speechSynthesis)
 * @returns {Promise<Float32Array>} geluid op config.audio.sample_rate
 */
export async function synthesize(ort, session, config, phonemes, { rate = 1 } = {}) {
  const ids = phonemeIds(phonemes, config);
  const inf = config.inference ?? {};
  const feeds = {
    input: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new ort.Tensor('float32', Float32Array.from([inf.noise_scale ?? 0.667, (inf.length_scale ?? 1) / rate, inf.noise_w ?? 0.8]), [3]),
  };
  if (session.inputNames.includes('sid')) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]), [1]);
  const out = await session.run(feeds);
  return out[session.outputNames[0]].data;
}
