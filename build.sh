#!/usr/bin/env bash
# Zet enkel de bestanden die de website nodig heeft in dist/.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist
mkdir -p dist
cp index.html manifest.json sw.js robots.txt dist/
cp -r css js data icons models dist/

echo "dist/ klaar: $(du -sh dist | cut -f1)"
