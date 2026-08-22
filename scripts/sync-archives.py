#!/usr/bin/env python3
"""Keep the bilingual archives and section pages in sync."""

from __future__ import annotations

import argparse
import html as html_lib
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ("andrea", "pensieri", "altri")
PUBLISHING_SECTIONS = (*SECTIONS, "small-codes")
SECTION_ALIASES = {
    "andrea": "andrea",
    "storie": "andrea",
    "storie-di-andrea": "andrea",
    "pensieri": "pensieri",
    "pensieri-senza-filtro": "pensieri",
    "altri": "altri",
    "storie-degli-altri": "altri",
    "small-codes": "small-codes",
}

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
    "it": {
        "andrea": ROOT / "storie/storie-di-andrea.html",
        "pensieri": ROOT / "storie/pensieri-senza-filtro.html",
        "altri": ROOT / "storie/storie-degli-altri.html",
    },
    "en": {
        "andrea": ROOT / "stories/andreas-stories.html",
        "pensieri": ROOT / "stories/unfiltered-thoughts.html",
        "altri": ROOT / "stories/other-peoples-stories.html",
    },
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
    "it": [
        Article("it", "pensieri", "/non-sei-invisibile.html", "Non sei invisibile. Sei diventato più selettivo", "Età, desiderio e visibilità senza chiedere scusa.", date(2026, 1, 1), 0, "2026", "Riflessione"),
    ],
    "en": [
        Article("en", "pensieri", "/non-sei-invisibile.html", "You’re Not Invisible. You’ve Become More Selective", "Age, desire and visibility without apologising.", date(2026, 1, 1), 0, "2026", "Reflection"),
    ],
}


def meta(source: str, property_name: str) -> str | None:
    pattern = rf'<meta\s+property=["\']{re.escape(property_name)}["\']\s+content=["\']([^"\']+)["\']\s*/?>'
    match = re.search(pattern, source, re.IGNORECASE)
    return html_lib.unescape(match.group(1).strip()) if match else None


def element_text(source: str, class_name: str, tag: str) -> str | None:
    pattern = rf'<{tag}\b[^>]*class=["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\'][^>]*>(.*?)</{tag}>'
    match = re.search(pattern, source, re.IGNORECASE | re.DOTALL)
    if not match:
        return None
    without_tags = re.sub(r"<[^>]+>", "", match.group(1))
    return html_lib.unescape(re.sub(r"\s+", " ", without_tags).strip())


def first_heading(source: str) -> str | None:
    match = re.search(r"<h1\b[^>]*>(.*?)</h1>", source, re.IGNORECASE | re.DOTALL)
    if not match:
        return None
    return html_lib.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", match.group(1))).strip())


def canonical_path(source: str) -> str | None:
    match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']https?://[^/]+(/[^"\']*)["\']\s*/?>', source, re.IGNORECASE)
    return match.group(1) if match else None


def article_language(source: str) -> str | None:
    match = re.search(r'<html\b[^>]*\blang=["\']([^"\']+)["\']', source, re.IGNORECASE)
    if not match:
        return None
    lang = match.group(1).lower()
    return "it" if lang.startswith("it") else "en" if lang.startswith("en") else None


def article_summary(source: str) -> str | None:
    for class_name in ("article-deck", "code-deck"):
        value = element_text(source, class_name, "p")
        if value:
            return value
    match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']\s*/?>', source, re.IGNORECASE)
    return html_lib.unescape(match.group(1).strip()) if match else None


def article_minutes(source: str, section: str) -> int | None:
    kicker = element_text(source, "kicker", "p") or ""
    minutes_match = re.search(r"(\d+)\s+min", kicker, re.IGNORECASE)
    if minutes_match:
        return int(minutes_match.group(1))
    if section == "small-codes":
        return 1
    return None


def read_articles(language: str) -> list[Article]:
    directories = (ROOT / ("storie" if language == "it" else "stories"), ROOT / "small-codes")
    articles: list[Article] = []
    for directory in directories:
        for path in sorted(directory.glob("*.html")):
            source = path.read_text(encoding="utf-8")
            if article_language(source) != language:
                continue
            raw_section = meta(source, "article:section")
            section = SECTION_ALIASES.get(raw_section or "")
            if section not in PUBLISHING_SECTIONS:
                continue
            published_text = meta(source, "article:published_time")
            url = canonical_path(source)
            title = first_heading(source)
            summary = article_summary(source)
            minutes = article_minutes(source, section)
            missing = [name for name, value in (("published date", published_text), ("canonical URL", url), ("title", title), ("summary", summary), ("reading time", minutes)) if value is None]
            if missing:
                raise ValueError(f"{path.relative_to(ROOT)}: missing {', '.join(missing)}")
            articles.append(Article(language, section, url, title, summary, date.fromisoformat(published_text), minutes))
    return sorted(articles, key=lambda item: (item.published.toordinal(), item.url), reverse=True)


def display_date(article: Article) -> str:
    if article.date_label:
        return article.date_label
    month = MONTHS[article.language][article.published.month]
    return f"{article.published.day} {month} {article.published.year}"


def archive_item(article: Article) -> str:
    reading = article.reading_label or f"{article.minutes} min"
    return (
        f'        <a class="archive-item" href="{article.url}">'
        f'<span class="archive-meta">{display_date(article)}<br>{reading}</span>'
        f'<span class="archive-copy"><h3>{html_lib.escape(article.title)}</h3>'
        f'<p>{html_lib.escape(article.summary)}</p></span>'
        f'<span class="archive-arrow">↗</span></a>'
    )


def replace_archive_section(source: str, section_id: str, rendered: str) -> str:
    pattern = re.compile(
        rf'(<section\s+class="archive-section"\s+id="{re.escape(section_id)}"[^>]*>.*?<div\s+class="archive-list">).*?(</div>\s*</section>)',
        re.DOTALL,
    )
    replacement = rf'\1\n        <!-- AUTO-GENERATED: scripts/sync-archives.py -->\n{rendered}\n        <!-- END AUTO-GENERATED -->\n      \2'
    updated, count = pattern.subn(replacement, source, count=1)
    if count != 1:
        raise ValueError(f"archive section #{section_id} not found")
    return updated


def teaser(article: Article, number: int) -> str:
    label = f"Articolo {number} · {article.minutes} min di lettura" if article.language == "it" else f"Article {number} · {article.minutes} min read"
    return (
        f'          <a class="article-teaser" href="{article.url}">\n'
        f'            <p class="kicker">{label}</p>\n'
        f'            <h2>{html_lib.escape(article.title)}</h2>\n'
        f'            <p>{html_lib.escape(article.summary)}</p>\n'
        f'          </a>'
    )


def replace_section_list(source: str, rendered: str) -> str:
    pattern = re.compile(r'(<div\s+class="article-list"[^>]*>).*?(</div>\s*<div\s+class="article-end">)', re.DOTALL)
    replacement = rf'\1\n          <!-- AUTO-GENERATED: scripts/sync-archives.py -->\n{rendered}\n          <!-- END AUTO-GENERATED -->\n        \2'
    updated, count = pattern.subn(replacement, source, count=1)
    if count != 1:
        raise ValueError("section article list not found")
    return updated


def replace_sitemap_lastmod(source: str, url: str, modified: date) -> str:
    pattern = re.compile(rf'(<loc>{re.escape(url)}</loc>\s*<lastmod>)[^<]+(</lastmod>)')
    updated, count = pattern.subn(lambda match: f"{match.group(1)}{modified.isoformat()}{match.group(2)}", source, count=1)
    if count != 1:
        raise ValueError(f"sitemap entry not found: {url}")
    return updated


def sync(check: bool) -> bool:
    changed: dict[Path, str] = {}
    articles_by_language: dict[str, list[Article]] = {}
    for language in ("it", "en"):
        articles = read_articles(language)
        articles_by_language[language] = articles
        archive_source = ARCHIVE_FILES[language].read_text(encoding="utf-8")
        for section in SECTIONS:
            section_articles = [item for item in articles if item.section == section]
            extras = [item for item in SPECIAL_ARCHIVE_ITEMS[language] if item.section == section]
            rendered = "\n".join(archive_item(item) for item in section_articles + extras)
            archive_source = replace_archive_section(archive_source, ARCHIVE_IDS[language][section], rendered)

            section_source = SECTION_FILES[language][section].read_text(encoding="utf-8")
            count = len(section_articles)
            teaser_html = "\n".join(teaser(item, count - index) for index, item in enumerate(section_articles))
            section_updated = replace_section_list(section_source, teaser_html)
            if section_updated != section_source:
                changed[SECTION_FILES[language][section]] = section_updated

        if archive_source != ARCHIVE_FILES[language].read_text(encoding="utf-8"):
            changed[ARCHIVE_FILES[language]] = archive_source

        # MOREL 2.0 homepage entry points are intentional editorial doors,
        # not "latest article" links. Do not rewrite the primary hero CTA here.

    sitemap = ROOT / "sitemap.xml"
    sitemap_source = sitemap.read_text(encoding="utf-8")
    sitemap_updated = sitemap_source
    sitemap_urls = {
        "it": {
            "archive": "https://www.andreamorel.com/archivio.html",
            "andrea": "https://www.andreamorel.com/storie/storie-di-andrea.html",
            "pensieri": "https://www.andreamorel.com/storie/pensieri-senza-filtro.html",
            "altri": "https://www.andreamorel.com/storie/storie-degli-altri.html",
        },
        "en": {
            "archive": "https://www.andreamorel.com/archive.html",
            "andrea": "https://www.andreamorel.com/stories/andreas-stories.html",
            "pensieri": "https://www.andreamorel.com/stories/unfiltered-thoughts.html",
            "altri": "https://www.andreamorel.com/stories/other-peoples-stories.html",
        },
    }
    for language, articles in articles_by_language.items():
        sitemap_updated = replace_sitemap_lastmod(sitemap_updated, sitemap_urls[language]["archive"], max(item.published for item in articles))
        for section in SECTIONS:
            section_articles = [item for item in articles if item.section == section]
            sitemap_updated = replace_sitemap_lastmod(sitemap_updated, sitemap_urls[language][section], max(item.published for item in section_articles))
    if sitemap_updated != sitemap_source:
        changed[sitemap] = sitemap_updated

    if check:
        if changed:
            print("Content index is out of date:", file=sys.stderr)
            for path in sorted(changed):
                print(f"- {path.relative_to(ROOT)}", file=sys.stderr)
            return False
        return True

    for path, source in changed.items():
        path.write_text(source, encoding="utf-8")
    for path in sorted(changed):
        print(path.relative_to(ROOT))
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if generated listings are stale")
    args = parser.parse_args()
    try:
        return 0 if sync(args.check) else 1
    except ValueError as error:
        print(f"sync-archives: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
