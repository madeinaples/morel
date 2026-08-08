from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = (
    (ROOT / "storie/no-drama-please.html", 'article:section" content="storie-di-andrea"', 'article:section" content="andrea"'),
    (ROOT / "stories/no-drama-please.html", 'article:section" content="andreas-stories"', 'article:section" content="andrea"'),
)

for path, old, new in FILES:
    source = path.read_text(encoding="utf-8")
    if old in source:
        path.write_text(source.replace(old, new, 1), encoding="utf-8")
