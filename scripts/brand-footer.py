#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

MARK = '''<span class="hes-credit"><span class="hes-mark" aria-hidden="true">HES</span><span>Human Edit Studio</span></span>'''

# Use the photograph-page footer as the house style everywhere:
# Andrea Morel as the main signature, then HES left, copyright centre,
# and the essential links on the right. AI disclosure remains on its
# dedicated notice page rather than being repeated in the footer.
for path in ROOT.rglob("*.html"):
    if any(part.startswith('.') for part in path.parts):
        continue
    source = path.read_text(encoding="utf-8")
    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    if not footer:
        continue

    lang_en = bool(re.search(r'<html[^>]+lang=["\']en', source, flags=re.I))
    home = '/index-en.html' if lang_en else '/index.html'
    privacy = '/privacy-en.html' if lang_en else '/privacy.html'

    # Remove legacy personal production credits before replacing the block.
    source = re.sub(r'\s*·?\s*(?:progetto editoriale e sito curati da|editorial project and site curated by)\s+Cristiano Maiello', '', source, flags=re.I)

    block = f'''<footer><a class="footer-name" href="{home}">Andrea Morel</a><div>{MARK}<span>© 2026</span><a href="{privacy}">Privacy</a><a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>'''
    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    source = source[:footer.start()] + block + source[footer.end():]
    path.write_text(source, encoding="utf-8")
    print(path.relative_to(ROOT))
