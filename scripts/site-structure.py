#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

IT_BIO_OLD = "Sono Andrea Morel. Ho origini italiane e inglesi e ho vissuto in abbastanza città da sapere che cambiare indirizzo non risolve tutto — ma almeno cambia la vista dalla finestra."
IT_BIO_NEW = "Sono Andrea Morel. Sono italiano, ma ho scelto il Regno Unito come casa. Ho vissuto e viaggiato abbastanza da sentirmi più a mio agio tra culture diverse che dentro un’etichetta geografica — e ho imparato che cambiare indirizzo non risolve tutto, ma almeno cambia la vista dalla finestra."
EN_BIO_OLD = "I am Andrea Morel. I have Italian and English roots, and I have lived in enough cities to know that changing address does not solve everything — but at least it changes the view from the window."
EN_BIO_NEW = "I am Andrea Morel. I am Italian, and I chose the United Kingdom as home. I have lived and travelled enough to feel more at ease between cultures than inside a geographical label — and I have learned that changing address does not solve everything, but at least it changes the view from the window."

IT_PHOTO_SECTION = '''\n    <section class="photo-door" id="fotografie">\n      <div class="photo-door-inner reveal">\n        <div><p class="kicker">04 · Fotografie</p><h2>Immagini\nche ricordano.</h2></div>\n        <div class="photo-door-copy"><p>Fotografie originali, luoghi e memoria. Alcune immagini resteranno da sole; altre apriranno una storia.</p><a class="read-link" href="/fotografie.html">Entra nell’archivio fotografico <span>↗</span></a></div>\n      </div>\n    </section>\n'''
EN_PHOTO_SECTION = '''\n    <section class="photo-door" id="photography">\n      <div class="photo-door-inner reveal">\n        <div><p class="kicker">04 · Photography</p><h2>Images\nthat remember.</h2></div>\n        <div class="photo-door-copy"><p>Original photographs, places and memory. Some images will stand alone; others will open into a story.</p><a class="read-link" href="/photography.html">Enter the photographic archive <span>↗</span></a></div>\n      </div>\n    </section>\n'''

def patch_home(filename, language):
    path = ROOT / filename
    source = path.read_text(encoding='utf-8')
    if '/photography.css' not in source:
        source = source.replace('<link rel="stylesheet" href="style.css" />', '<link rel="stylesheet" href="style.css" />\n  <link rel="stylesheet" href="/photography.css" />')
    if language == 'it':
        if 'href="/fotografie.html">Fotografie</a>' not in source:
            source = source.replace('<a href="#autore">L\'autore</a>', '<a href="/fotografie.html">Fotografie</a><a href="#autore">L\'autore</a>')
        source = source.replace(IT_BIO_OLD, IT_BIO_NEW)
        if 'class="photo-door"' not in source:
            source = source.replace('    <section class="about" id="autore">', IT_PHOTO_SECTION + '\n    <section class="about" id="autore">')
    else:
        if 'href="/photography.html">Photography</a>' not in source:
            source = source.replace('<a href="#author">The author</a>', '<a href="/photography.html">Photography</a><a href="#author">The author</a>')
        source = source.replace(EN_BIO_OLD, EN_BIO_NEW)
        if 'class="photo-door"' not in source:
            source = source.replace('    <section class="about" id="author">', EN_PHOTO_SECTION + '\n    <section class="about" id="author">')
    path.write_text(source, encoding='utf-8')
    print(filename)

def patch_sitemap():
    path = ROOT / 'sitemap.xml'
    if not path.exists(): return
    source = path.read_text(encoding='utf-8')
    additions=[]
    if 'https://www.andreamorel.com/fotografie.html' not in source: additions.append('  <url><loc>https://www.andreamorel.com/fotografie.html</loc><lastmod>2026-08-09</lastmod></url>')
    if 'https://www.andreamorel.com/photography.html' not in source: additions.append('  <url><loc>https://www.andreamorel.com/photography.html</loc><lastmod>2026-08-09</lastmod></url>')
    if additions:
        source=source.replace('</urlset>', '\n'+'\n'.join(additions)+'\n</urlset>')
        path.write_text(source, encoding='utf-8')

patch_home('index.html','it')
patch_home('index-en.html','en')
patch_sitemap()
