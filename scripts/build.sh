#!/usr/bin/env bash

set -e

ZOLA_VER='v0.14.1'
ZOLA_TAR="https://github.com/getzola/zola/releases/download/$ZOLA_VER/zola-$ZOLA_VER-x86_64-unknown-linux-gnu.tar.gz"

HERE="$(dirname "${BASH_SOURCE[0]}")"
cd "$HERE"
REPO_DIR="$(git rev-parse --show-toplevel)"

echo "Building subprojects"
./build-subprojects.sh
echo "Done building subprojects"

echo "Downloading zola at $ZOLA_TAR"
wget -q -O - $ZOLA_TAR | tar xzf - -C /usr/local/bin

echo "Building HTML"
cd "$REPO_DIR"
zola build

echo "Post-processing HTML"
cd "$REPO_DIR/scripts"
npm install --production
find "$REPO_DIR/public" -name '*.html' -print0 | xargs -0 -n 1 -P 8 node -r esm postprocess.js

echo "Ensuring all LaTeX parsed correctly"
# ! means invert return value (i.e. not). grep returns true (zero) when found
# and false (non-zero) when not found. We want to not find things.
! grep --recursive --files-with-matches 'Undefined control sequence'

echo "Pushing to repo"
cd "$REPO_DIR/public"
REPO="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git init
git config user.name "GitHub Actions"
git config user.email "github-actions-bot@users.noreply.github.com"
git add .
git commit -m "Deploy website to website:gh-pages"
git push --force "$REPO" HEAD:gh-pages
