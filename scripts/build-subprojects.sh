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


CITY_GAME="$(mktemp -d -t city-game.XXX)"
echo "Building city-game [directory=$CITY_GAME]"
ssh-add - <<< "$CITY_GAME_PRIVATE_DEPLOY_KEY"
git clone git@github.com:elihunter173/city-game.git "$CITY_GAME"
cd "$CITY_GAME"
git reset --hard a0e84fe9269d6397d25c2c68f7d6fa9d12280b93
cargo build --profile web --target wasm32-unknown-unknown
wasm-bindgen --no-typescript --target web \
    --out-dir ./out/ \
    --out-name "game" \
    ./target/wasm32-unknown-unknown/web/city-game.wasm
cat << EOF > ./out/index.html
<!doctype html>
<html lang="en">
<body style="margin: 0px;">
  <script type="module">
    import init from './game.js'
    init().catch((error) => {
      if (!error.message.startsWith("Using exceptions for control flow, don't mind me. This isn't actually an error!")) {
        throw error;
      }
    });
  </script>
</body>
</html>
EOF
cp -r ./assets ./out/.
cp -r ./out "$REPO_DIR/static/the-merp-experiment"
