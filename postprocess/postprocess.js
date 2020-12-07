#!/usr/bin/env -S node -r esm

// This is a simplified version of simple/tex2svg-page from
// https://github.com/mathjax/MathJax-demos-node modified so so that it updates
// the file in place, hard-codes my preferred config, and removes command-line
// options

// Read the HTML file
const fs = require("fs");
const minify = require("html-minifier").minify;

// em-size and ex-size in pixels
const EM = 16;
const EX = 8;

var argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.error("$0 file.html");
  return;
}
const filename = argv[0];

const htmlfile = fs.readFileSync(filename, "utf8");

// Load MathJax and initialize MathJax and typeset the given math
require("mathjax-full")
  .init({
    //  MathJax configuration
    loader: {
      source: require("mathjax-full/components/src/source.js").source,
      load: ["adaptors/liteDOM", "tex-svg"],
    },
    tex: {
      // the packages to use, e.g. "base, ams"; use "*" to represent the
      // default packages, e.g, "*, bbox"
      packages: ["base", "autoload", "require", "ams", "newcommand"],
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
    },
    svg: {
      fontCache: "global",
      exFactor: EX / EM,
    },
    "adaptors/liteDOM": {
      fontSize: EM,
    },
    startup: {
      document: htmlfile,
    },
  })
  .then((MathJax) => {
    //  Display the output
    const adaptor = MathJax.startup.adaptor;
    const html = MathJax.startup.document;
    if (html.math.toArray().length === 0) {
      adaptor.remove(html.outputJax.svgStyles);
      const cache = adaptor.elementById(
        adaptor.body(html.document),
        "MJX-SVG-global-cache"
      );
      if (cache) adaptor.remove(cache);
    }

    const updatedDoc = minify(
      adaptor.doctype(html.document) +
        adaptor.outerHTML(adaptor.root(html.document)),
      {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
      }
    );

    fs.writeFile(filename, updatedDoc, (err) => {
      if (err) throw err;
    });
  })
  .catch((err) => console.error(err));
