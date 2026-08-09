#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

MARK = '''<span class="hes-credit" style="display:inline-flex;align-items:center;gap:10px;margin-right:auto;color:#9b9d97;text-decoration:none;font:9px 'DM Sans',Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap"><span aria-hidden="true" style="display:inline-grid;place-items:center;width:31px;height:31px;border:1px solid rgba(238,233,222,.38);font:15px 'Libre Caslon Display',Georgia,serif;letter-spacing:-.08em;color:#eee9de">HES</span><span>Human Edit Studio</span></span>'''

for filename in ("index.html", "index-en.html"):
    path = ROOT / filename
    source = path.read_text(encoding="utf-8")
    # Keep Andrea Morel as the principal signature, remove any personal production credit,
    # and add the studio mark as the discreet editorial credit.
    source = re.sub(r'\s*·?\s*(?:progetto editoriale e sito curati da|editorial project and site curated by)\s+Cristiano Maiello', '', source, flags=re.I)
    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    if not footer:
        raise SystemExit(f"Footer not found in {filename}")
    block = footer.group(0)
    if 'Human Edit Studio' not in block:
        block = block.replace('<div>', f'<div>{MARK}', 1)
    source = source[:footer.start()] + block + source[footer.end():]
    path.write_text(source, encoding="utf-8")
    print(filename)
