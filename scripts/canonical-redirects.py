#!/usr/bin/env python3
"""Generate Netlify redirects that collapse clean/.html URL duplicates."""

from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
REDIRECTS = ROOT / "_redirects"
START = "# BEGIN GENERATED CANONICAL REDIRECTS"
END = "# END GENERATED CANONICAL REDIRECTS"


def sitemap_paths():
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    tree = ET.parse(SITEMAP)
    for element in tree.findall(".//s:loc", namespace):
        path = urlsplit(element.text or "").path
        if path.endswith(".html"):
            yield path


def generated_block():
    rules = {
        "/index-en": "/",
        "/index-en.html": "/",
    }
    for canonical in sitemap_paths():
        clean = canonical[:-5]
        rules.setdefault(clean, canonical)

    lines = [START]
    lines.extend(f"{source:<68} {target:<68} 301!" for source, target in sorted(rules.items()))
    lines.append(END)
    return "\n".join(lines)


def main():
    source = REDIRECTS.read_text()
    block = generated_block()
    if START in source and END in source:
        before, remainder = source.split(START, 1)
        _, after = remainder.split(END, 1)
        updated = before.rstrip() + "\n\n" + block + after
    else:
        updated = block + "\n\n" + source.lstrip()
    REDIRECTS.write_text(updated.rstrip() + "\n")
    print(f"CANONICAL REDIRECTS OK — {block.count('301!')} permanent redirects generated")


if __name__ == "__main__":
    main()
