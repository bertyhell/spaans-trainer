"""De stem van de spreekmodus klaarmaken: models/es_ES-sharvard-medium.fp16.onnx.

Piper-stem "sharvard" (es_ES, medium; twee sprekers, de app gebruikt de man)
van rhasspy/piper-voices, met de gewichten als float16 opgeslagen en bij het
laden weer naar float32 omgezet (Cast). Het bestand is zo half zo groot
(39 MB i.p.v. 77 MB) en klinkt hetzelfde: het gemiddelde verschil in het
spectrum is 0,05 dB. Int8 scheelde nog eens de helft maar 7 dB — hoorbaar
slechter, dus niet gedaan.

Waarom sharvard en niet "davefx" (kleiner, 32 MB): davefx maakt korte losse
woorden onverstaanbaar ("mal", "más", "sol" — ook Whisper large-v3 verstaat ze
niet). Op 100 woorden uit de cursus: davefx 80 juist, sharvard 99.

    python3 -m pip install --target .cache/py onnx numpy
    PYTHONPATH=.cache/py python3 tools/make-voice.py

Wie een andere stem kiest: ook VOICE_CACHE in js/voice/models.js verhogen,
anders blijven toestellen de oude in hun cache houden.
"""

import urllib.request
from pathlib import Path

import numpy as np
import onnx
from onnx import TensorProto, helper, numpy_helper

REVISION = "e9ab671f2a0e50a701b34361136ba3e6a3a9eb0c"
NAME = "es_ES-sharvard-medium"
BASE = f"https://huggingface.co/rhasspy/piper-voices/resolve/{REVISION}/es/es_ES/sharvard/medium/"
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
    model = onnx.load(fetch(f"{NAME}.onnx"))
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
    onnx.save(model, OUT / f"{NAME}.fp16.onnx")
    # De instellingen ongewijzigd overnemen, byte voor byte.
    (OUT / f"{NAME}.onnx.json").write_bytes(fetch(f"{NAME}.onnx.json").read_bytes())
    (OUT / "MODEL_CARD-sharvard.md").write_bytes(fetch("MODEL_CARD").read_bytes())
    print(f"  {len(casts)} gewichten naar float16 → {OUT / f'{NAME}.fp16.onnx'}")


if __name__ == "__main__":
    main()
