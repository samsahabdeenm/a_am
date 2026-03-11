#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = 'https://puravigal.com'
EXCLUDE_DIRS = {'partials', 'scripts', 'images', 'css', 'js', 'sass'}
EXCLUDE_FILES = {'404.html'}


def page_url(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel.endswith('index.html'):
        rel = rel[:-10]
    elif rel.endswith('.html'):
        rel = rel[:-5]
    if not rel:
        return f'{BASE_URL}/'
    if not rel.startswith('/'):
        rel = '/' + rel
    return f'{BASE_URL}{rel}'


def should_include(path: Path) -> bool:
    rel_parts = path.relative_to(ROOT).parts
    if any(part in EXCLUDE_DIRS for part in rel_parts):
        return False
    if path.name in EXCLUDE_FILES:
        return False
    return True


def main() -> None:
    html_files = sorted(
        p for p in ROOT.rglob('*.html') if should_include(p)
    )
    urls = sorted({page_url(path) for path in html_files})

    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    lines.extend([f'  <url><loc>{url}</loc></url>' for url in urls])
    lines.append('</urlset>')

    (ROOT / 'sitemap.xml').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Generated sitemap.xml with {len(urls)} URLs')


if __name__ == '__main__':
    main()
