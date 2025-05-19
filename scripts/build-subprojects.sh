#!/usr/bin/env bash

set -ex

HERE="$(dirname "${BASH_SOURCE[0]}")"
cd "$HERE"
REPO_DIR="$(git rev-parse --show-toplevel)"

# Do this to allow adding private projects given I have a deploy key
eval `ssh-agent -s`


ASTEROIDS="$(mktemp -d -t asteroids-3d.XXX)"
echo "Building asteroids-3d [directory=$ASTEROIDS]"
git clone --depth=1 https://github.com/elihunter173/asteroids-3d.git "$ASTEROIDS"
cd "$ASTEROIDS"
npm install --production
npm run build
cp -r ./dist "$REPO_DIR/static/asteroids"


WEIDING="$(mktemp -d -t weiding.XXX)"
echo "Building weiding [directory=$WEIDING]"
ssh-add - <<< "$WEIDING_PRIVATE_DEPLOY_KEY"
git clone --depth=1 git@github.com:elihunter173/weiding_portfolio.git "$WEIDING"
# Strip all the git information since we're copying the directory verbatim and she doesn't need that
rm -rf "$WEIDING/.git"
cp -r "$WEIDING" "$REPO_DIR/static/weiding"
zip -r "$REPO_DIR/static/weiding/site.zip" "$WEIDING"
