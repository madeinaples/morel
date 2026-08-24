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
    ai_notice = '/ai-use-notice.html' if lang_en else '/nota-ai.html'
    project_copy = 'A project by' if lang_en else 'Un progetto di'

    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)
    if not footer:
        path.write_text(source, encoding="utf-8")
        continue

    source = re.sub(r'\s*·?\s*(?:progetto editoriale e sito curati da|editorial project and site curated by)\s+Cristiano Maiello', '', source, flags=re.I)
    footer = re.search(r'<footer>.*?</footer>', source, flags=re.S | re.I)

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
    block = (
        f'<footer><a class="footer-name" href="{home}">Andrea Morel</a>'
        f'{signature}<div class="human-edit-footer-meta">{credit}'
        f'<a href="{privacy}">Privacy</a>'
        f'<a href="{ai_notice}">{"AI use" if lang_en else "Uso dell’AI"}</a>'
        f'<a href="https://www.instagram.com/andreamorel.writer/" target="_blank" rel="noopener noreferrer">Instagram</a>'
        f'<a href="mailto:andreamoreluk@gmail.com">Email</a></div></footer>'
    )
    source = source[:footer.start()] + block + source[footer.end():]

    source = re.sub(r'<script\s+src=["\']/hes-footer-fix\.js(?:\?v=[^"\']*)?["\']></script>', '', source, flags=re.I)
    source = re.sub(r'</body>', '<script src="/hes-footer-fix.js?v=3"></script></body>', source, count=1, flags=re.I)

    if 'footer-refine.css' not in source:
        source = re.sub(r'</head>', '<link rel="stylesheet" href="/footer-refine.css?v=3">\n</head>', source, count=1, flags=re.I)

    path.write_text(source, encoding="utf-8")
    print(path.relative_to(ROOT))
