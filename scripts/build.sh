#!/usr/bin/env bash

set -e

HERE="$(dirname "${BASH_SOURCE[0]}")"
cd "$HERE"

BUILD_DIR="$(git rev-parse --show-toplevel)"
ZOLA_TAR="https://github.com/getzola/zola/releases/download/v0.14.0/zola-v0.14.0-x86_64-unknown-linux-gnu.tar.gz"

echo "Downloading zola: $ZOLA_TAR"
wget -q -O - $ZOLA_TAR | tar xzf - -C /usr/local/bin

cd "$BUILD_DIR"
zola build

cd "$BUILD_DIR/scripts"
npm install
find "$BUILD_DIR/public" -name '*.html' -print0 | xargs -0 -n 1 -P 8 node -r esm postprocess.js

cd "$BUILD_DIR/public"
REPO="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git init
git config user.name "GitHub Actions"
git config user.email "github-actions-bot@users.noreply.github.com"
git add .
git commit -m "Deploy website to website:gh-pages"
git push --force "$REPO" HEAD:gh-pages
