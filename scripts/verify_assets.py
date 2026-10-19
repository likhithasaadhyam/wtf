import os
import re

paths_to_check = set()
for src_file in [
    'src/data/garments.js',
    'src/App.jsx',
    'src/components/AboutPage.jsx',
    'src/components/StudioPage.jsx',
    'src/components/ProductDetailPage.jsx',
    'src/components/ProductCard.jsx',
]:
    with open(src_file, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r"['\"](/assets/fashion/[^'\"]+)['\"]", content)
        paths_to_check.update(matches)

missing = []
valid = []
for p in sorted(paths_to_check):
    disk_path = os.path.join('public', p.lstrip('/'))
    if os.path.exists(disk_path) and os.path.getsize(disk_path) > 0:
        valid.append((p, os.path.getsize(disk_path)))
    else:
        missing.append((p, disk_path))

print(f'Total valid active image assets verified: {len(valid)}')
for p, size in valid:
    print(f'  [OK] {p} ({size // 1024} KB)')

if missing:
    print(f'MISSING ASSETS: {len(missing)}')
    for p, dp in missing:
        print(f'  ✗ {p} -> {dp}')
    exit(1)
else:
    print('\nALL ASSET PATHS ARE 100% VALID AND EXIST ON DISK!')
