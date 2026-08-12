#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if old not in source:
        raise SystemExit(f"Missing expected block: {label}")
    return source.replace(old, new, 1)


def patch_english() -> None:
    path = ROOT / "index-en.html"
    source = path.read_text(encoding="utf-8")

    source = source.replace(
        '<link rel="canonical" href="https://www.andreamorel.com/index-en">',
        '<link rel="canonical" href="https://www.andreamorel.com/">'
    )

    source = source.replace(
        '<div class="hero-image" role="img" aria-label="Portrait of Andrea Morel on a London street after the rain"></div>',
        '<div class="hero-image" role="img" aria-label="Longridge Road in London after the rain, photographed by the author"></div>'
    )

    old_hero = '<p class="hero-description">Andrea Morel is a bilingual narrative project about relationships, desire, age, loneliness and contemporary life, told through personal experience, unfiltered thoughts and stories entrusted by others.</p>'
    new_hero = '<p class="hero-description"><strong>Andrea Morel is a pseudonym.</strong> The stories are rooted in lived experience, real encounters and memory; names and identifying details may be changed to protect the people involved. All photographs in the archive are original. <strong>The name is fictional. The experiences are not.</strong></p>'
    source = replace_once(source, old_hero, new_hero, "English hero statement")

    old_about = '<section class="about" id="author"><div class="chapter-mark"><span>Interlude</span><strong>A</strong></div><div class="about-copy reveal"><p class="kicker">The author</p><h2>One life, many cities.<br>And a few avoidable returns.</h2><div class="bio-text"><p>I am Andrea Morel. I am Italian, and I chose the United Kingdom as home. I have lived and travelled enough to feel more at ease between cultures than inside a geographical label — and I have learned that changing address does not solve everything, but at least it changes the view from the window.</p><p>I have travelled widely, met improbable people and lived almost everything without holding back: loves, mistakes, departures and a few returns I could quite happily have avoided.</p><p>Even at the most difficult moments, I have always found a way to begin again — sometimes through courage, and sometimes simply because there was no better alternative.</p><p>I write about what I live, what I observe and the stories other people entrust to me. With melancholy, when it is needed. With irony, far more often. Because life can be profound without being relentlessly heavy.</p></div><a href="mailto:andreamoreluk@gmail.com">Write me a letter <span>↗</span></a></div></section>'
    new_about = '<section class="about" id="author"><div class="chapter-mark"><span>Interlude</span><strong>A</strong></div><div class="about-copy reveal"><p class="kicker">About the name</p><h2>A real voice.<br>A chosen name.</h2><div class="bio-text"><p>Andrea Morel is a pen name used by a real author who prefers to keep a private identity separate from the work.</p><p>The writing begins with lived experience: relationships, desire, ageing, solitude, cities, mistakes, encounters and the stories people choose to entrust to the author. Memory is subjective, and identifying details may sometimes be changed for privacy, but the emotional and experiential core is real.</p><p>The photographs are original images from the author’s own archive. They are not a simulated biography of Andrea Morel; they are part of the same lived world from which the writing comes.</p><p>The pseudonym is not intended to impersonate a fictional person. It creates the distance needed to write openly while leaving the private individual behind the name private.</p></div><a href="mailto:andreamoreluk@gmail.com">Write me a letter <span>↗</span></a></div></section>'
    source = replace_once(source, old_about, new_about, "English about block")

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
    source = source.replace(
        '<link rel="alternate" hreflang="x-default" href="https://www.andreamorel.com/" />',
        '<link rel="alternate" hreflang="x-default" href="https://www.andreamorel.com/" />'
    )

    source = source.replace(
        '<div class="hero-image" role="img" aria-label="Ritratto di Andrea Morel in una strada londinese dopo la pioggia"></div>',
        '<div class="hero-image" role="img" aria-label="Longridge Road a Londra dopo la pioggia, fotografata dall’autore"></div>'
    )

    old_hero = '<p class="hero-description">Andrea Morel è un progetto narrativo bilingue su relazioni, desiderio, età, solitudine e vita contemporanea, raccontati attraverso esperienze personali, pensieri senza filtro e storie affidate da altri.</p>'
    new_hero = '<p class="hero-description"><strong>Andrea Morel è uno pseudonimo.</strong> Le storie nascono da esperienze vissute, incontri reali e memoria; nomi e dettagli identificativi possono essere modificati per proteggere le persone coinvolte. Tutte le fotografie dell’archivio sono originali. <strong>Il nome è fittizio. Le esperienze no.</strong></p>'
    source = replace_once(source, old_hero, new_hero, "Italian hero statement")

    old_about = '''<section class="about" id="autore">
      <div class="chapter-mark"><span>Interludio</span><strong>A</strong></div>
      <div class="about-copy reveal">
        <p class="kicker">L'autore</p>
        <h2>Una vita, molte città.<br>E qualche ritorno evitabile.</h2>
        <div class="bio-text">
          <p>Sono Andrea Morel. Ho origini italiane e inglesi e ho vissuto in abbastanza città da sapere che cambiare indirizzo non risolve tutto — ma almeno cambia la vista dalla finestra.</p>
          <p>Ho viaggiato molto, incontrato persone improbabili e vissuto quasi ogni cosa senza risparmiarmi: gli amori, gli errori, le partenze e qualche ritorno che avrei potuto tranquillamente evitare.</p>
          <p>Anche nei momenti più difficili ho sempre trovato il modo di ricominciare, qualche volta con coraggio, altre semplicemente perché non c’era un’alternativa migliore.</p>
          <p>Scrivo di ciò che vivo, di quello che osservo e delle storie che gli altri mi affidano. Con malinconia, quando serve. Con ironia, molto più spesso. Perché la vita può essere profonda senza essere continuamente pesante.</p>
        </div>
        <a href="mailto:andreamoreluk@gmail.com">Scrivimi una lettera <span>↗</span></a>
      </div>
    </section>'''
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
    source = replace_once(source, old_about, new_about, "Italian about block")

    path.write_text(source, encoding="utf-8")
    print("index.html")


patch_english()
patch_italian()
