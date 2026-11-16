/* Spreekmodus: luister en zeg het na.
 *
 * De app zegt een zin of woord met de stem op het toestel (Piper), met de
 * klankschrift onder elk woord. Jij zegt het na; Whisper luistert, ook op het
 * toestel, en speakScore.js oordeelt per woord, vergevingsgezind: een accent
 * mag, een ander woord niet. Drie pogingen; de beste telt. Een goede poging
 * gaat meteen door.
 *
 * Alleen in de spreekmodus (env.speakMode), met items in de richting 'say':
 * nazeggen heeft een eigen doos, los van het woord kennen. */

import { el } from '../dom.js';
import { ipaWords } from '../phonetic.js';
import { sayText } from '../speakScore.js';
import * as voice from '../voice/index.js';
import { record, errorText } from '../voice/recorder.js';

export { sayText };
export const ATTEMPTS = 3;
const SLOW = 0.65;

/* Leestekens plakken aan hun woord: "¿Cómo" en "llamas?" in plaats van losse tekens. */
const LEADING = /^[¿¡«“"(—–-]+$/;
function chipsFor(text) {
  const chips = [];
  let pre = '';
  for (const w of ipaWords(text)) {
    if (w.ipa == null) {
      if (LEADING.test(w.text) || !chips.length) pre += w.text;
      else chips.at(-1).post += w.text;
      continue;
    }
    chips.push({ pre, text: w.text, post: '', ipa: w.ipa });
    pre = '';
  }
  return chips;
}

/* Er luistert hoogstens één microfoon tegelijk. */
let active = null;
const stopActive = () => { active?.stop(); active = null; };
/** Een les verlaten: de microfoon meteen uit. */
export const stopListening = stopActive;


export default {
  id: 'repeat',
  label: 'Zeg het na',

  supports(item, env) {
    return Boolean(env.speakMode) && item.direction === 'say' && sayText(item.atom) != null;
  },

  render(item, root, ctx) {
    stopActive();
    const { atom } = item;
    const text = sayText(atom);
    const chips = chipsFor(text);
    const attempts = [];
    let lastAudio = null;
    let busy = false;
    let finished = false;

    const chipNodes = chips.map(c => el('span', { class: 'say-word' },
      el('span', { class: 'say-es' }, c.pre, c.text, c.post),
      el('span', { class: 'say-ipa', 'aria-label': `uitspraak ${c.ipa}` }, c.ipa)));

    const play = rate => { stopActive(); voice.say(text, { rate }).catch(() => {}); };
    const mine = el('button', {
      class: 'say-btn', type: 'button', hidden: true,
      onclick: () => { stopActive(); if (lastAudio) voice.playRecording(lastAudio); },
    }, '▶ Jouw poging');

    const nl = Array.isArray(atom.nl) ? atom.nl[0] : atom.nl;
    root.append(
      el('p', { class: 'q-instruction' }, atom.kind === 'vocab' ? 'Luister en zeg het woord na' : 'Luister en zeg de zin na'),
      el('div', { class: 'say-card' },
        el('div', { class: 'say-line', lang: 'es' }, ...chipNodes),
        nl ? el('p', { class: 'say-nl', lang: 'nl' }, nl) : null,
        el('div', { class: 'say-play' },
          el('button', { class: 'say-btn', type: 'button', onclick: () => play(0.9) }, '🔊 Luister'),
          el('button', { class: 'say-btn', type: 'button', onclick: () => play(SLOW) }, '🐢 Traag'),
          mine)),
    );

    const status = el('p', { class: 'mic-status', 'aria-live': 'polite' }, 'Tik op de microfoon en zeg het na.');
    const heardLine = el('p', { class: 'say-heard', hidden: true });
    const meter = el('span', { class: 'mic-level', 'aria-hidden': 'true' });
    const mic = el('button', { class: 'mic-btn', type: 'button', 'aria-label': 'Spreek' }, meter, el('span', { class: 'mic-icon' }, '🎤'));
    const skip = el('button', {
      class: 'link-btn', type: 'button',
      onclick: () => { stopActive(); voice.stop(); ctx.skip?.({ noSpeaking: false }); },
    }, 'Ik kan nu niet spreken — overslaan');
    root.append(el('div', { class: 'mic-panel' }, mic, status, heardLine, skip));

    const paint = result => {
      result.words.forEach((w, i) => {
        const node = chipNodes[i];
        if (!node) return;
        node.classList.remove('is-ok', 'is-close', 'is-miss');
        node.classList.add(`is-${w.state}`);
      });
    };

    const best = () => [...attempts].sort((a, b) => b.score - a.score)[0] ?? null;

    async function listen() {
      if (finished) return;
      if (active) { active.stop(); return; }   // tweede tik: stoppen
      if (busy) return;
      voice.stop();
      busy = true;
      mic.classList.add('is-listening');
      status.textContent = 'Microfoon aan…';
      const rec = record({
        onLevel: (level, loud) => {
          meter.style.transform = `scale(${1 + level * 0.9})`;
          mic.classList.toggle('is-loud', loud);
        },
      });
      active = rec;
      rec.start.then(() => { if (active === rec) status.textContent = 'Ik luister… (tik om te stoppen)'; });
      let audio;
      try {
        audio = await rec.done;
      } catch (err) {
        status.textContent = errorText(err.code);
        if (err.code === 'not-allowed' || err.code === 'no-mic') ctx.skip?.({ noSpeaking: true, quiet: true });
        return;
      } finally {
        if (active === rec) active = null;
        mic.classList.remove('is-listening', 'is-loud');
        meter.style.transform = '';
        busy = false;
      }

      busy = true;
      mic.disabled = true;
      status.textContent = 'Even luisteren wat je zei…';
      try {
        lastAudio = audio;
        const result = await voice.check(text, audio);
        if (finished) return;
        attempts.push(result);
        mine.hidden = false;
        paint(result);
        if (result.verdict !== 'wrong' || attempts.length >= ATTEMPTS) {
          ctx.ready(true);
          ctx.submit();
          return;
        }
        status.textContent = `Nog niet helemaal: de rode woorden hoorde ik niet goed. Probeer nog eens (${attempts.length + 1}/${ATTEMPTS}).`;
        // Wat Whisper verstond, enkel na een mislukte poging: bij een goede is
        // die tekst vaak half verhaspeld (het kleine model), terwijl het oordeel
        // op het bewijs per woord steunt.
        heardLine.hidden = !result.heard;
        heardLine.textContent = result.heard ? `Ik hoorde: „${result.heard}”` : '';
        // Wie het voor bekeken houdt, mag verder: de beste poging telt dan.
        ctx.ready(true);
      } catch (err) {
        status.textContent = 'Er liep iets mis bij het luisteren. Probeer opnieuw.';
        console.error(err);
      } finally {
        mic.disabled = false;
        busy = false;
      }
    }
    mic.addEventListener('click', listen);

    // Eerst horen, dan zeggen.
    setTimeout(() => { if (!finished && !active) voice.say(text, { rate: 0.9 }).catch(() => {}); }, 300);

    return {
      focus() { mic.focus(); },
      check() {
        stopActive();
        voice.stop();
        finished = true;
        const b = best();
        if (!b) return { correct: false, expected: text, given: '', note: 'Je hebt de zin nog niet gezegd.' };
        const weak = b.words.filter(w => w.state !== 'ok').map(w => `${w.text} [${w.ipa}]`);
        const note = [
          b.verdict === 'wrong' && b.heard ? `Ik hoorde: „${b.heard}”` : null,
          weak.length && b.verdict !== 'ok' ? `Let op: ${weak.join(', ')}` : null,
        ].filter(Boolean).join('. ');
        return { correct: b.verdict !== 'wrong', almost: b.verdict === 'almost', expected: text, given: b.heard, note: note || null };
      },
      reveal() {
        mic.disabled = true;
        skip.hidden = true;
        // De uitslag staat onderaan; hier niets dubbel.
        status.textContent = '';
        heardLine.hidden = true;
        const b = best();
        if (b) paint(b);
      },
    };
  },
};
