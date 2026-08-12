#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def replace_if_present(source: str, old: str, new: str) -> str:
    return source.replace(old, new, 1) if old in source else source


def replace_about_section(source: str, section_id: str, new_block: str) -> str:
    pattern = rf'<section class="about" id="{re.escape(section_id)}">.*?</section>'
    if re.search(pattern, source, flags=re.S):
        return re.sub(pattern, new_block, source, count=1, flags=re.S)
    return source


def patch_english() -> None:
    path = ROOT / "index-en.html"
    source = path.read_text(encoding="utf-8")

    source = source.replace(
        '<link rel="canonical" href="https://www.andreamorel.com/index-en">',
        '<link rel="canonical" href="https://www.andreamorel.com/">'
    )
    source = replace_if_present(
        source,
        '<div class="hero-image" role="img" aria-label="Portrait of Andrea Morel on a London street after the rain"></div>',
        '<div class="hero-image" role="img" aria-label="Longridge Road in London after the rain, photographed by the author"></div>'
    )
    source = replace_if_present(
        source,
        '<p class="hero-description">Andrea Morel is a bilingual narrative project about relationships, desire, age, loneliness and contemporary life, told through personal experience, unfiltered thoughts and stories entrusted by others.</p>',
        '<p class="hero-description"><strong>Andrea Morel is a pseudonym.</strong> The stories are rooted in lived experience, real encounters and memory; names and identifying details may be changed to protect the people involved. All photographs in the archive are original. <strong>The name is fictional. The experiences are not.</strong></p>'
    )

    new_about = '<section class="about" id="author"><div class="chapter-mark"><span>Interlude</span><strong>A</strong></div><div class="about-copy reveal"><p class="kicker">About the name</p><h2>A real voice.<br>A chosen name.</h2><div class="bio-text"><p>Andrea Morel is a pen name used by a real author who prefers to keep a private identity separate from the work.</p><p>The writing begins with lived experience: relationships, desire, ageing, solitude, cities, mistakes, encounters and the stories people choose to entrust to the author. Memory is subjective, and identifying details may sometimes be changed for privacy, but the emotional and experiential core is real.</p><p>The photographs are original images from the author’s own archive. They are not a simulated biography of Andrea Morel; they are part of the same lived world from which the writing comes.</p><p>The pseudonym is not intended to impersonate a fictional person. It creates the distance needed to write openly while leaving the private individual behind the name private.</p></div><a href="mailto:andreamoreluk@gmail.com">Write me a letter <span>↗</span></a></div></section>'
    source = replace_about_section(source, "author", new_about)

    path.write_text(source, encoding="utf-8")
    print("index-en.html")


def patch_italian() -> None:
    path = ROOT / "index.html"
    source = path.read_text(encoding="utf-8")

    source = source.replace(
        '<link rel="canonical" href="https://www.andreamorel.com/" />',
        '<link rel="canonical" href="https://www.andreamorel.com/index.html" />'
    )
    source = source.replace(
        '<link rel="alternate" hreflang="it" href="https://www.andreamorel.com/" />',
        '<link rel="alternate" hreflang="it" href="https://www.andreamorel.com/index.html" />'
    )
    source = replace_if_present(
        source,
        '<div class="hero-image" role="img" aria-label="Ritratto di Andrea Morel in una strada londinese dopo la pioggia"></div>',
        '<div class="hero-image" role="img" aria-label="Longridge Road a Londra dopo la pioggia, fotografata dall’autore"></div>'
    )
    source = replace_if_present(
        source,
        '<p class="hero-description">Andrea Morel è un progetto narrativo bilingue su relazioni, desiderio, età, solitudine e vita contemporanea, raccontati attraverso esperienze personali, pensieri senza filtro e storie affidate da altri.</p>',
        '<p class="hero-description"><strong>Andrea Morel è uno pseudonimo.</strong> Le storie nascono da esperienze vissute, incontri reali e memoria; nomi e dettagli identificativi possono essere modificati per proteggere le persone coinvolte. Tutte le fotografie dell’archivio sono originali. <strong>Il nome è fittizio. Le esperienze no.</strong></p>'
    )

    new_about = '''<section class="about" id="autore">
      <div class="chapter-mark"><span>Interludio</span><strong>A</strong></div>
      <div class="about-copy reveal">
        <p class="kicker">Dietro il nome</p>
        <h2>Una voce reale.<br>Un nome scelto.</h2>
        <div class="bio-text">
          <p>Andrea Morel è uno pseudonimo usato da un autore reale che preferisce tenere separata la propria identità privata dal lavoro pubblico.</p>
          <p>La scrittura parte dall’esperienza vissuta: relazioni, desiderio, età, solitudine, città, errori, incontri e storie che altre persone scelgono di affidare all’autore. La memoria è soggettiva e alcuni dettagli possono essere modificati per tutelare la privacy, ma il nucleo emotivo ed esperienziale è reale.</p>
          <p>Le fotografie sono immagini originali dell’archivio personale dell’autore. Non costruiscono una biografia simulata di Andrea Morel: appartengono allo stesso mondo vissuto da cui nasce la scrittura.</p>
          <p>Lo pseudonimo non serve a impersonare una persona fittizia. Serve a creare la distanza necessaria per scrivere apertamente, lasciando privata la persona che sta dietro al nome.</p>
        </div>
        <a href="mailto:andreamoreluk@gmail.com">Scrivimi una lettera <span>↗</span></a>
      </div>
    </section>'''
    source = replace_about_section(source, "autore", new_about)

    path.write_text(source, encoding="utf-8")
    print("index.html")


patch_english()
patch_italian()
