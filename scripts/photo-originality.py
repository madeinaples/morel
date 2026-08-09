#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def patch_index(path: Path, language: str) -> None:
    source = path.read_text(encoding="utf-8")
    if language == "it":
        marker = "Tutte le fotografie di questo archivio sono immagini originali scattate da Andrea Morel nel corso degli anni."
        anchor = "<p>Qui la fotografia non è una decorazione. Può restare semplicemente una fotografia, oppure aprire una memoria, un luogo, una sensazione e qualche volta una storia.</p>"
        source = source.replace(anchor, anchor + f"\n        <p><strong>{marker}</strong></p>") if marker not in source else source
        source = source.replace("Fotografia 001 · Londra", "Fotografia 001 · Archivio originale · Londra")
    else:
        marker = "Every photograph in this archive is an original image taken by Andrea Morel over the years."
        anchor = "<p>Here, photography is not decoration. An image can remain simply an image, or it can open a memory, a place, a sensation and sometimes a story.</p>"
        source = source.replace(anchor, anchor + f"\n        <p><strong>{marker}</strong></p>") if marker not in source else source
        source = source.replace("Photograph 001 · London", "Photograph 001 · Original archive · London")
    path.write_text(source, encoding="utf-8")
    print(path.relative_to(ROOT))


def patch_detail(path: Path, language: str) -> None:
    source = path.read_text(encoding="utf-8")
    if '<meta name="copyright" content="Andrea Morel">' not in source:
        source = source.replace('<meta name="author" content="Andrea Morel">', '<meta name="author" content="Andrea Morel">\n  <meta name="copyright" content="Andrea Morel">\n  <meta name="creator" content="Andrea Morel">')

    if language == "it":
        source = re.sub(r'<span>Fotografia (\d+)</span>', r'<span>Fotografia \1 · Archivio originale</span>', source)
        if "Fotografia © Andrea Morel · Archivio personale" not in source:
            source = source.replace("</figcaption>", " · Fotografia © Andrea Morel · Archivio personale</figcaption>", 1)
    else:
        source = re.sub(r'<span>Photograph (\d+)</span>', r'<span>Photograph \1 · Original archive</span>', source)
        if "Photograph © Andrea Morel · Personal archive" not in source:
            source = source.replace("</figcaption>", " · Photograph © Andrea Morel · Personal archive</figcaption>", 1)

    path.write_text(source, encoding="utf-8")
    print(path.relative_to(ROOT))


patch_index(ROOT / "fotografie.html", "it")
patch_index(ROOT / "photography.html", "en")
for path in sorted((ROOT / "fotografie").glob("*.html")):
    patch_detail(path, "it")
for path in sorted((ROOT / "photography").glob("*.html")):
    patch_detail(path, "en")
