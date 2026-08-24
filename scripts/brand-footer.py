#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

for path in ROOT.rglob("*.html"):
    if any(part.startswith('.') for part in path.parts):
        continue
    source = path.read_text(encoding="utf-8")

    lang_en = bool(re.search(r'<html[^>]+lang=["\']en', source, flags=re.I))
    home = '/index-en.html' if lang_en else '/index.html'
    privacy = '/privacy-en.html' if lang_en else '/privacy.html'

    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    if not footer:
        path.write_text(source, encoding="utf-8")
        continue

    source = re.sub(r'\s*·?\s*(?:progetto editoriale e sito curati da|editorial project and site curated by)\s+Cristiano Maiello', '', source, flags=re.I)
    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    block = f'''<footer><a class="footer-name" href="{home}">Andrea Morel</a><div><span>© 2026</span><a href="{privacy}">Privacy</a><a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>'''
    source = source[:footer.start()] + block + source[footer.end():]
    if '/hes-footer-fix.js' not in source:
        source = re.sub(r'</body>', '<script src="/hes-footer-fix.js?v=1"></script></body>', source, count=1, flags=re.I)
    path.write_text(source, encoding="utf-8")
    print(path.relative_to(ROOT))
