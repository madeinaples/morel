#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

HES = '<span class="hes-credit"><span class="hes-mark" aria-hidden="true">HES</span><span>Human Edit Studio</span></span>'

for path in ROOT.rglob('*.html'):
    if any(part.startswith('.') for part in path.parts):
        continue
    source = path.read_text(encoding='utf-8')
    is_en = bool(re.search(r'<html[^>]*\blang=["\']en', source, re.I))
    home = '/index-en.html' if is_en else '/index.html'
    privacy = '/privacy-en.html' if is_en else '/privacy.html'
    manifesto_href = '/manifesto-en.html' if is_en else '/manifesto.html'

    # Remove every legacy personal production credit, wherever an older build left it.
    source = re.sub(r'[^<>]{0,120}CRISTIANO\s+MAIELLO[^<>]{0,120}', '', source, flags=re.I)

    # Normalise the main navigation: exactly one Manifesto link.
    nav = re.search(r'(<nav\b[^>]*id=["\']main-nav["\'][^>]*>)(.*?)(</nav>)', source, flags=re.I | re.S)
    if nav:
        body = nav.group(2)
        body = re.sub(r'<a\b[^>]*href=["\'][^"\']*manifesto(?:-en)?\.html["\'][^>]*>\s*Manifesto\s*</a>', '', body, flags=re.I | re.S)
        lang = re.search(r'<a\b[^>]*class=["\'][^"\']*language[^"\']*["\'][^>]*>.*?</a>', body, flags=re.I | re.S)
        manifest = f'<a href="{manifesto_href}">Manifesto</a>'
        if lang:
            body = body[:lang.start()] + manifest + body[lang.start():]
        else:
            body += manifest
        source = source[:nav.start()] + nav.group(1) + body + nav.group(3) + source[nav.end():]

    # Replace the final footer wholesale with the approved Photography footer structure.
    footer_matches = list(re.finditer(r'<footer\b[^>]*>.*?</footer>', source, flags=re.I | re.S))
    if footer_matches:
        footer = footer_matches[-1]
        block = (f'<footer><a class="footer-name" href="{home}">Andrea Morel</a><div>'
                 f'{HES}<span>© 2026</span>'
                 f'<a href="{privacy}">Privacy</a>'
                 f'<a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a>'
                 f'<a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>')
        source = source[:footer.start()] + block + source[footer.end():]

    # Safety pass: no legacy name may survive production HTML.
    source = re.sub(r'CRISTIANO\s+MAIELLO', '', source, flags=re.I)
    path.write_text(source, encoding='utf-8')
    print(path.relative_to(ROOT))
