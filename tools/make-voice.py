"""De stem van de spreekmodus klaarmaken: models/es_ES-davefx-medium.fp16.onnx.

Piper-stem "davefx" (es_ES, medium) van rhasspy/piper-voices, met de gewichten
als float16 opgeslagen en bij het laden weer naar float32 omgezet (Cast). Het
bestand is zo half zo groot (32 MB i.p.v. 63 MB) en klinkt hetzelfde: het
gemiddelde verschil in het spectrum is 0,05 dB. Int8 werd 18 MB maar
verschilde 7 dB — hoorbaar slechter, dus niet gedaan.

    python3 -m pip install --target .cache/py onnx numpy
    PYTHONPATH=.cache/py python3 tools/make-voice.py

Wie een andere stem kiest: ook VOICE_CACHE in js/voice/models.js verhogen,
anders blijven toestellen de oude in hun cache houden.
"""

import json
import urllib.request
from pathlib import Path

import numpy as np
import onnx
from onnx import TensorProto, helper, numpy_helper

REVISION = "e9ab671f2a0e50a701b34361136ba3e6a3a9eb0c"
BASE = f"https://huggingface.co/rhasspy/piper-voices/resolve/{REVISION}/es/es_ES/davefx/medium/"
OUT = Path(__file__).resolve().parent.parent / "models"
CACHE = Path(__file__).resolve().parent.parent / ".cache"


def fetch(name: str) -> Path:
    path = CACHE / name
    if not path.exists():
        CACHE.mkdir(exist_ok=True)
        print(f"  ophalen: {BASE}{name}")
        urllib.request.urlretrieve(BASE + name, path)
    return path


def main() -> None:
    model = onnx.load(fetch("es_ES-davefx-medium.onnx"))
    graph = model.graph
    casts = []
    for init in list(graph.initializer):
        arr = numpy_helper.to_array(init)
        # Kleine tensors (vormen, schalen) laten we met rust.
        if arr.dtype != np.float32 or arr.size < 1024:
            continue
        half = numpy_helper.from_array(arr.astype(np.float16), init.name + "_fp16")
        graph.initializer.remove(init)
        graph.initializer.append(half)
        casts.append(helper.make_node("Cast", [half.name], [init.name], to=TensorProto.FLOAT))
    for node in reversed(casts):
        graph.node.insert(0, node)
    OUT.mkdir(exist_ok=True)
    onnx.save(model, OUT / "es_ES-davefx-medium.fp16.onnx")
    config = json.loads(fetch("es_ES-davefx-medium.onnx.json").read_text())
    (OUT / "es_ES-davefx-medium.onnx.json").write_text(json.dumps(config, ensure_ascii=False, indent=2) + "\n")
    print(f"  {len(casts)} gewichten naar float16 → {OUT / 'es_ES-davefx-medium.fp16.onnx'}")


if __name__ == "__main__":
    main()
