/* AudioWorklet: geeft de ruwe microfoonstalen door aan voice/recorder.js. */

class Capture extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0]?.[0];
    if (ch) this.port.postMessage(ch.slice(0));
    return true;
  }
}

registerProcessor('vamos-capture', Capture);
