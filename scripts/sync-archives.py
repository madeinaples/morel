#!/usr/bin/env python3
"""Keep bilingual archives, section pages and latest links in sync."""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ("andrea", "pensieri", "altri", "small-codes")
MONTHS = {
    "it": ("", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"),
    "en": ("", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
}
ARCHIVE_FILES = {"it": ROOT / "archivio.html", "en": ROOT / "archive.html"}
ARCHIVE_IDS = {
    "it": {"andrea": "andrea", "pensieri": "pensieri", "altri": "altri"},
    "en": {"andrea": "andrea", "pensieri": "thoughts", "altri": "others"},
}
SECTION_FILES = {
    "it": {"andrea": ROOT / "storie/storie-di-andrea.html", "pensieri": ROOT / "storie/pensieri-senza-filtro.html", "altri": ROOT / "storie/storie-degli-altri.html"},
    "en": {"andrea": ROOT / "stories/andreas-stories.html", "pensieri": ROOT / "stories/unfiltered-thoughts.html", "altri": ROOT / "stories/other-peoples-stories.html"},
}

@dataclass(frozen=True)
class Article:
    language: str
    section: str
    url: str
    title: str
    summary: str
    published: date
    minutes: int
    date_label: str | None = None
    reading_label: str | None = None

SPECIAL_ARCHIVE_ITEMS = {
    "it": [Article("it", "pensieri", "/non-sei-invisibile.html", "Non sei invisibile. Sei diventato più selettivo", "Età, desiderio e visibilità senza chiedere scusa.", date(2026, 1, 1), 0, "2026", "Riflessione")],
    "en": [Article("en", "pensieri", "/non-sei-invisibile.html", "You’re Not Invisible. You’ve Become More Selective", "Age, desire and visibility without apologising.", date(2026, 1, 1), 0, "2026", "Reflection")],
}

def meta(source: str, property_name: str) -> str | None:
    pattern = rf'<meta\s+property=["\']{re.escape(property_name)}["\']\s+content=["\']([^"\']+)["\']\s*/?>'
    match = re.search(pattern, source, re.IGNORECASE)
    return html_lib.unescape(match.group(1).strip()) if match else None

def element_text(source: str, class_name: str, tag: str) -> str | None:
    pattern = rf'<{tag}\b[^>]*class=["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\'][^>]*>(.*?)</{tag}>'
    match = re.search(pattern, source, re.IGNORECASE | re.DOTALL)
    if not match: return None
    return html_lib.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", match.group(1))).strip())

def first_heading(source: str) -> str | None:
    match = re.search(r"<h1\b[^>]*>(.*?)</h1>", source, re.IGNORECASE | re.DOTALL)
    if not match: return None
    return html_lib.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", match.group(1))).strip())

def canonical_path(source: str) -> str | None:
    match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']https?://[^/]+(/[^"\']*)["\']\s*/?>', source, re.IGNORECASE)
    return match.group(1) if match else None

def read_standard_articles(language: str) -> list[Article]:
    directory = ROOT / ("storie" if language == "it" else "stories")
    articles = []
    for path in sorted(directory.glob("*.html")):
        source = path.read_text(encoding="utf-8")
        section = meta(source, "article:section")
        if section not in ("andrea", "pensieri", "altri"): continue
        published_text, url, title = meta(source, "article:published_time"), canonical_path(source), first_heading(source)
        summary = element_text(source, "article-deck", "p")
        kicker = element_text(source, "kicker", "p") or ""
        minutes_match = re.search(r"(\d+)\s+min", kicker, re.IGNORECASE)
        missing = [name for name, value in (("published date", published_text), ("canonical URL", url), ("title", title), ("summary", summary), ("reading time", minutes_match)) if not value]
        if missing: raise ValueError(f"{path.relative_to(ROOT)}: missing {', '.join(missing)}")
        articles.append(Article(language, section, url, title, summary, date.fromisoformat(published_text), int(minutes_match.group(1))))
    return articles

def read_manifest_articles(language: str) -> list[Article]:
    path = ROOT / "content-manifest.json"
    if not path.exists(): return []
    data = json.loads(path.read_text(encoding="utf-8"))
    articles = []
    for item in data:
        if item.get("language") != language: continue
        required = ("section", "url", "title", "description", "published")
        if any(not item.get(key) for key in required): raise ValueError("content-manifest.json: incomplete item")
        articles.append(Article(language, item["section"], item["url"], item["title"], item["description"], date.fromisoformat(item["published"]), int(item.get("minutes", 3))))
    return articles

def read_articles(language: str) -> list[Article]:
    articles = read_standard_articles(language) + read_manifest_articles(language)
    urls = [item.url for item in articles]
    if len(urls) != len(set(urls)): raise ValueError(f"duplicate content URL in {language} publishing index")
    return sorted(articles, key=lambda item: (item.published.toordinal(), item.url), reverse=True)

def display_date(article: Article) -> str:
    if article.date_label: return article.date_label
    return f"{article.published.day} {MONTHS[article.language][article.published.month]} {article.published.year}"

def archive_item(article: Article) -> str:
    reading = article.reading_label or f"{article.minutes} min"
    return f'        <a class="archive-item" href="{article.url}"><span class="archive-meta">{display_date(article)}<br>{reading}</span><span class="archive-copy"><h3>{html_lib.escape(article.title)}</h3><p>{html_lib.escape(article.summary)}</p></span><span class="archive-arrow">↗</span></a>'

def replace_archive_section(source: str, section_id: str, rendered: str) -> str:
    pattern = re.compile(rf'(<section\s+class="archive-section"\s+id="{re.escape(section_id)}"[^>]*>.*?<div\s+class="archive-list">).*?(</div>\s*</section>)', re.DOTALL)
    updated, count = pattern.subn(rf'\1\n        <!-- AUTO-GENERATED: scripts/sync-archives.py -->\n{rendered}\n        <!-- END AUTO-GENERATED -->\n      \2', source, count=1)
    if count != 1: raise ValueError(f"archive section #{section_id} not found")
    return updated

def teaser(article: Article, number: int) -> str:
    label = f"Articolo {number} · {article.minutes} min di lettura" if article.language == "it" else f"Article {number} · {article.minutes} min read"
    return f'          <a class="article-teaser" href="{article.url}">\n            <p class="kicker">{label}</p>\n            <h2>{html_lib.escape(article.title)}</h2>\n            <p>{html_lib.escape(article.summary)}</p>\n          </a>'

def replace_section_list(source: str, rendered: str) -> str:
    pattern = re.compile(r'(<div\s+class="article-list"[^>]*>).*?(</div>\s*<div\s+class="article-end">)', re.DOTALL)
    updated, count = pattern.subn(rf'\1\n          <!-- AUTO-GENERATED: scripts/sync-archives.py -->\n{rendered}\n          <!-- END AUTO-GENERATED -->\n        \2', source, count=1)
    if count != 1: raise ValueError("section article list not found")
    return updated

def replace_latest_link(source: str, url: str) -> str:
    pattern = re.compile(r'(<a\s+class="hero-button primary"\s+href=")[^"]+("[^>]*>)')
    updated, count = pattern.subn(rf'\1{url}\2', source, count=1)
    if count != 1: raise ValueError("latest-article link not found")
    return updated

def replace_sitemap_lastmod(source: str, url: str, modified: date) -> str:
    pattern = re.compile(rf'(<loc>{re.escape(url)}</loc>\s*<lastmod>)[^<]+(</lastmod>)')
    updated, count = pattern.subn(lambda m: f"{m.group(1)}{modified.isoformat()}{m.group(2)}", source, count=1)
    if count != 1: raise ValueError(f"sitemap entry not found: {url}")
    return updated

def sync(check: bool) -> bool:
    changed = {}
    articles_by_language = {}
    for language in ("it", "en"):
        articles = read_articles(language); articles_by_language[language] = articles
        archive_source = ARCHIVE_FILES[language].read_text(encoding="utf-8")
        for section in ("andrea", "pensieri", "altri"):
            section_articles = [a for a in articles if a.section == section]
            extras = [a for a in SPECIAL_ARCHIVE_ITEMS[language] if a.section == section]
            archive_source = replace_archive_section(archive_source, ARCHIVE_IDS[language][section], "\n".join(archive_item(a) for a in section_articles + extras))
            section_path = SECTION_FILES[language][section]
            section_source = section_path.read_text(encoding="utf-8")
            count = len(section_articles)
            section_updated = replace_section_list(section_source, "\n".join(teaser(a, count-i) for i, a in enumerate(section_articles)))
            if section_updated != section_source: changed[section_path] = section_updated
        if archive_source != ARCHIVE_FILES[language].read_text(encoding="utf-8"): changed[ARCHIVE_FILES[language]] = archive_source
        homepage = ROOT / ("index.html" if language == "it" else "index-en.html")
        homepage_source = homepage.read_text(encoding="utf-8")
        homepage_updated = replace_latest_link(homepage_source, articles[0].url)
        if homepage_updated != homepage_source: changed[homepage] = homepage_updated
    if check:
        if changed:
            print("Content index is out of date:", file=sys.stderr)
            for path in sorted(changed): print(f"- {path.relative_to(ROOT)}", file=sys.stderr)
            return False
        return True
    for path, source in changed.items(): path.write_text(source, encoding="utf-8")
    for path in sorted(changed): print(path.relative_to(ROOT))
    return True

def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    try: return 0 if sync(args.check) else 1
    except ValueError as error:
        print(f"sync-archives: {error}", file=sys.stderr); return 1

if __name__ == "__main__": raise SystemExit(main())
