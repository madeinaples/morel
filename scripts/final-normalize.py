#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

changed = 0

for path in ROOT.rglob('*.html'):
    if any(part.startswith('.') for part in path.parts):
        continue

    source = path.read_text(encoding='utf-8')
    original = source
    is_en = bool(re.search(r'<html[^>]*\blang=["\']en', source, re.I))
    home = '/index-en.html' if is_en else '/index.html'
    privacy = '/privacy-en.html' if is_en else '/privacy.html'
    ai_notice = '/ai-use-notice.html' if is_en else '/nota-ai.html'
    project_copy = 'A project by' if is_en else 'Un progetto di'

    if 'footer-refine.css' not in source:
        source = re.sub(r'</head>', '  <link rel="stylesheet" href="/footer-refine.css?v=3">\n</head>', source, count=1, flags=re.I)
    else:
        source = re.sub(r'/footer-refine\.css(?:\?v=[^"\']*)?', '/footer-refine.css?v=3', source)

    source = re.sub(
        r'\s*[·|—-]?\s*(?:PROGETTO\s+EDITORIALE\s+E\s+SITO\s+CURATI\s+DA|EDITORIAL\s+PROJECT\s+AND\s+SITE\s+CURATED\s+BY)\s+CRISTIANO\s+MAIELLO',
        '', source, flags=re.I | re.S)
    source = re.sub(r'CRISTIANO\s+MAIELLO', '', source, flags=re.I)

    nav = re.search(r'(<nav\b[^>]*\bid=["\']main-nav["\'][^>]*>)(.*?)(</nav>)', source, re.I | re.S)
    if nav:
        body = nav.group(2)
        body = re.sub(
            r'<a\b[^>]*href=["\'][^"\']*manifesto(?:-en)?\.html(?:#[^"\']*)?["\'][^>]*>.*?</a>',
            '', body, flags=re.I | re.S)
        source = source[:nav.start()] + nav.group(1) + body + nav.group(3) + source[nav.end():]

    signature = (
        '<a class="human-edit-signature" href="https://humaneditstudio.co.uk/" '
        'target="_blank" rel="noopener noreferrer" aria-label="Human Edit Studio">'
        '<img src="/assets/human-edit-studio-white.svg" alt="Human Edit Studio" width="150" height="75" loading="lazy">'
        '<p>Websites. Content. Care.</p></a>'
    )
    credit = (
        f'<span>© 2026 Andrea Morel · {project_copy} '
        '<a href="https://humaneditstudio.co.uk/" target="_blank" rel="noopener noreferrer">Human Edit Studio</a></span>'
    )
    footer = (
        f'<footer><a class="footer-name" href="{home}">Andrea Morel</a>'
        f'{signature}<div class="human-edit-footer-meta">{credit}'
        f'<a href="{privacy}">Privacy</a>'
        f'<a href="{ai_notice}">{"AI use" if is_en else "Uso dell’AI"}</a>'
        f'<a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a>'
        f'<a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>'
    )
    source, footer_count = re.subn(r'<footer\b[^>]*>.*?</footer>', footer, source, flags=re.I | re.S)

    source = re.sub(r'<script\s+src=["\']/hes-footer-fix\.js(?:\?v=[^"\']*)?["\']></script>', '', source, flags=re.I)
    source = re.sub(r'</body>', '<script src="/hes-footer-fix.js?v=3"></script></body>', source, count=1, flags=re.I)

    path.write_text(source, encoding='utf-8')
    if source != original:
        changed += 1

    if re.search(r'CRISTIANO\s+MAIELLO', source, re.I):
        raise RuntimeError(f'Legacy Cristiano Maiello credit survived in {path.relative_to(ROOT)}')
    if nav:
        nav_after = re.search(r'<nav\b[^>]*\bid=["\']main-nav["\'][^>]*>(.*?)</nav>', source, re.I | re.S)
        manifesto_count = len(re.findall(r'href=["\'][^"\']*manifesto(?:-en)?\.html', nav_after.group(1), re.I)) if nav_after else 0
        if manifesto_count != 0:
            raise RuntimeError(f'Expected no Manifesto links in {path.relative_to(ROOT)}, found {manifesto_count}')
    if footer_count:
        if source.count('human-edit-signature') != 1:
            raise RuntimeError(f'Expected exactly one HES signature in {path.relative_to(ROOT)}')
        if 'hes-footer-fix.js?v=3' not in source:
            raise RuntimeError(f'HES footer fix missing in {path.relative_to(ROOT)}')

print(f'FINAL NORMALIZER OK — checked production HTML; changed {changed} files; one universal HES footer enforced on every page.')
