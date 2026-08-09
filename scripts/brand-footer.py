#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

# Inline the small HES mark styling so it renders consistently even on pages
# that do not load photography.css.
MARK = '''<span class="hes-credit" style="display:inline-flex;align-items:center;gap:10px;margin-right:auto;color:#9b9d97;text-decoration:none;font:9px 'DM Sans',Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap"><span class="hes-mark" aria-hidden="true" style="display:inline-grid;place-items:center;width:31px;height:31px;border:1px solid rgba(238,233,222,.38);font:15px 'Libre Caslon Display',Georgia,serif;letter-spacing:-.08em;color:#eee9de">HES</span><span>Human Edit Studio</span></span>'''

for path in ROOT.rglob("*.html"):
    if any(part.startswith('.') for part in path.parts):
        continue
    source = path.read_text(encoding="utf-8")

    lang_en = bool(re.search(r'<html[^>]+lang=["\']en', source, flags=re.I))
    home = '/index-en.html' if lang_en else '/index.html'
    privacy = '/privacy-en.html' if lang_en else '/privacy.html'
    manifesto_href = '/manifesto-en.html' if lang_en else '/manifesto.html'

    # The build had accumulated duplicate Manifesto links in the main navigation.
    # Keep exactly one, immediately before the language switcher.
    nav = re.search(r'(<nav\s+id="main-nav".*?>)(.*?)(</nav>)', source, flags=re.S | re.I)
    if nav:
        body = nav.group(2)
        body = re.sub(r'<a\s+href=["\']/?manifesto(?:-en)?\.html["\'][^>]*>Manifesto</a>', '', body, flags=re.I)
        language = re.search(r'<a\s+class="language"[^>]*>.*?</a>', body, flags=re.S | re.I)
        manifesto = f'<a href="{manifesto_href}">Manifesto</a>'
        if language:
            body = body[:language.start()] + manifesto + body[language.start():]
        else:
            body += manifesto
        source = source[:nav.start()] + nav.group(1) + body + nav.group(3) + source[nav.end():]

    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    if not footer:
        path.write_text(source, encoding="utf-8")
        continue

    source = re.sub(r'\s*·?\s*(?:progetto editoriale e sito curati da|editorial project and site curated by)\s+Cristiano Maiello', '', source, flags=re.I)
    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    block = f'''<footer><a class="footer-name" href="{home}">Andrea Morel</a><div>{MARK}<span>© 2026</span><a href="{privacy}">Privacy</a><a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>'''
    source = source[:footer.start()] + block + source[footer.end():]
    path.write_text(source, encoding="utf-8")
    print(path.relative_to(ROOT))
