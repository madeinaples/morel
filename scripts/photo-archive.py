#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

IT_CARD = '''
      <article class="photo-entry photo-entry-featured">
        <a class="photo-entry-image" href="/fotografie/001-longridge-road-2013.html" aria-label="Apri Fotografia 001: Longridge Road, settembre 2013">
          <img src="/assets/photo-001-longridge-road-2013.jpg" alt="Longridge Road a Londra al crepuscolo, con il marciapiede bagnato e i lampioni accesi" loading="lazy">
        </a>
        <div class="photo-entry-copy">
          <p class="kicker">Fotografia 001 · Londra · Settembre 2013</p>
          <h2>Longridge Road</h2>
          <p>La strada della mia prima casa a Londra. Per me le case non sono quasi mai state punti d’arrivo: sono state il posto da cui ricominciare.</p>
          <a class="read-link" href="/fotografie/001-longridge-road-2013.html">Guarda e leggi <span>↗</span></a>
        </div>
      </article>
'''

EN_CARD = '''
      <article class="photo-entry photo-entry-featured">
        <a class="photo-entry-image" href="/photography/001-longridge-road-2013.html" aria-label="Open Photograph 001: Longridge Road, September 2013">
          <img src="/assets/photo-001-longridge-road-2013.jpg" alt="Longridge Road in London at dusk, with a wet pavement and glowing street lamps" loading="lazy">
        </a>
        <div class="photo-entry-copy">
          <p class="kicker">Photograph 001 · London · September 2013</p>
          <h2>Longridge Road</h2>
          <p>The street of my first home in London. For me, homes have rarely been destinations: they have been places from which to begin again.</p>
          <a class="read-link" href="/photography/001-longridge-road-2013.html">View and read <span>↗</span></a>
        </div>
      </article>
'''


def patch(path_name: str, card: str, opening: str, replacement_status: str):
    path = ROOT / path_name
    source = path.read_text(encoding='utf-8')
    source = source.replace(f'<span>{opening}</span>', f'<span>{replacement_status}</span>')
    start = source.find('      <div class="photo-placeholder">')
    if start != -1:
        end = source.find('      </div>\n    </section>', start)
        if end != -1:
            end += len('      </div>')
            source = source[:start] + card.rstrip() + source[end:]
    elif 'photo-entry-featured' not in source:
        marker = '    </section>\n  </main>'
        source = source.replace(marker, card + marker, 1)
    path.write_text(source, encoding='utf-8')
    print(path_name)

patch('fotografie.html', IT_CARD, 'In apertura', '001 · Longridge Road')
patch('photography.html', EN_CARD, 'Opening', '001 · Longridge Road')

sitemap = ROOT / 'sitemap.xml'
if sitemap.exists():
    source = sitemap.read_text(encoding='utf-8')
    additions = []
    if 'https://www.andreamorel.com/fotografie/001-longridge-road-2013.html' not in source:
        additions.append('  <url><loc>https://www.andreamorel.com/fotografie/001-longridge-road-2013.html</loc><lastmod>2026-08-09</lastmod></url>')
    if 'https://www.andreamorel.com/photography/001-longridge-road-2013.html' not in source:
        additions.append('  <url><loc>https://www.andreamorel.com/photography/001-longridge-road-2013.html</loc><lastmod>2026-08-09</lastmod></url>')
    if additions:
        source = source.replace('</urlset>', '\n' + '\n'.join(additions) + '\n</urlset>')
        sitemap.write_text(source, encoding='utf-8')
        print('sitemap.xml')
