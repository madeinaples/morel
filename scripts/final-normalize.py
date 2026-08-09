#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

HES = '''<span class="hes-credit" style="display:inline-flex;align-items:center;gap:10px;margin-right:auto;color:#9b9d97;text-decoration:none;font:9px 'DM Sans',Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap"><span class="hes-mark" aria-hidden="true" style="display:inline-grid;place-items:center;width:31px;height:31px;border:1px solid rgba(238,233,222,.38);font:15px 'Libre Caslon Display',Georgia,serif;letter-spacing:-.08em;color:#eee9de">HES</span><span>Human Edit Studio</span></span>'''

changed = 0

for path in ROOT.rglob('*.html'):
    if any(part.startswith('.') for part in path.parts):
        continue

    source = path.read_text(encoding='utf-8')
    original = source
    is_en = bool(re.search(r'<html[^>]*\blang=["\']en', source, re.I))
    home = '/index-en.html' if is_en else '/index.html'
    privacy = '/privacy-en.html' if is_en else '/privacy.html'
    manifesto_href = '/manifesto-en.html' if is_en else '/manifesto.html'

    # Remove the complete legacy personal-credit text, including punctuation and
    # wording around the name. This deliberately works across whitespace/newlines.
    source = re.sub(
        r'\s*[·|—-]?\s*(?:PROGETTO\s+EDITORIALE\s+E\s+SITO\s+CURATI\s+DA|EDITORIAL\s+PROJECT\s+AND\s+SITE\s+CURATED\s+BY)\s+CRISTIANO\s+MAIELLO',
        '', source, flags=re.I | re.S)
    source = re.sub(r'CRISTIANO\s+MAIELLO', '', source, flags=re.I)

    # Main navigation: remove every Manifesto anchor regardless of attribute
    # order/classes/whitespace, then insert exactly one before the language link.
    nav = re.search(r'(<nav\b[^>]*\bid=["\']main-nav["\'][^>]*>)(.*?)(</nav>)', source, re.I | re.S)
    if nav:
        body = nav.group(2)
        body = re.sub(
            r'<a\b[^>]*href=["\'][^"\']*manifesto(?:-en)?\.html(?:#[^"\']*)?["\'][^>]*>.*?</a>',
            '', body, flags=re.I | re.S)
        lang = re.search(r'<a\b[^>]*class=["\'][^"\']*\blanguage\b[^"\']*["\'][^>]*>.*?</a>', body, re.I | re.S)
        manifest = f'<a href="{manifesto_href}">Manifesto</a>'
        if lang:
            body = body[:lang.start()] + manifest + body[lang.start():]
        else:
            body += manifest
        source = source[:nav.start()] + nav.group(1) + body + nav.group(3) + source[nav.end():]

    # Replace ALL footer blocks, not merely the last match. This prevents an old
    # footer from surviving beside the approved footer.
    footer = (f'<footer><a class="footer-name" href="{home}">Andrea Morel</a><div>'
              f'{HES}<span>© 2026</span>'
              f'<a href="{privacy}">Privacy</a>'
              f'<a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a>'
              f'<a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>')
    source, footer_count = re.subn(r'<footer\b[^>]*>.*?</footer>', footer, source, flags=re.I | re.S)

    path.write_text(source, encoding='utf-8')
    if source != original:
        changed += 1

    # Build-time assertions: fail the Netlify build rather than silently publish
    # a page that still contains the bugs we are trying to remove.
    if re.search(r'CRISTIANO\s+MAIELLO', source, re.I):
        raise RuntimeError(f'Legacy Cristiano Maiello credit survived in {path.relative_to(ROOT)}')
    if nav:
        nav_after = re.search(r'<nav\b[^>]*\bid=["\']main-nav["\'][^>]*>(.*?)</nav>', source, re.I | re.S)
        manifesto_count = len(re.findall(r'href=["\'][^"\']*manifesto(?:-en)?\.html', nav_after.group(1), re.I)) if nav_after else 0
        if manifesto_count != 1:
            raise RuntimeError(f'Expected 1 Manifesto link in {path.relative_to(ROOT)}, found {manifesto_count}')
    if footer_count and 'Human Edit Studio' not in source:
        raise RuntimeError(f'HES footer missing in {path.relative_to(ROOT)}')

print(f'FINAL NORMALIZER OK — checked production HTML; changed {changed} files; no Cristiano Maiello credits remain; navigation/footer assertions passed.')
