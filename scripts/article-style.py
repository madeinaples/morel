#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINK = '<link rel="stylesheet" href="/article.css" />'

changed = 0
paths = []
for folder in (ROOT / "stories", ROOT / "storie"):
    if folder.exists():
        paths.extend(folder.glob("*.html"))

for root_name in ("manifesto.html", "manifesto-en.html", "after-reading.html", "dopo-la-lettura.html"):
    path = ROOT / root_name
    if path.exists():
        paths.append(path)

for path in paths:
    text = path.read_text(encoding="utf-8")
    if 'class="article-page' not in text:
        continue
    if LINK in text:
        continue
    marker = '</head>'
    if marker not in text:
        continue
    text = text.replace(marker, f'  {LINK}\n{marker}', 1)
    path.write_text(text, encoding="utf-8")
    changed += 1

print(f"ARTICLE STYLE OK - updated {changed} pages")
