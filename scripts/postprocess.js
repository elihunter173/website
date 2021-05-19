#!/usr/bin/env -S node -r esm

/*
  A post-processing script that I run on my outputed HTML to minify it and run
  MathJax on it.

  This is a simplified version of simple/tex2svg-page from
  https://github.com/mathjax/MathJax-demos-node modified so so that it updates
  the file in place, hard-codes my preferred config, and removes command-line
  options
*/

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

var htmlfile = fs.readFileSync(filename, "utf8");
// If we do collapse whitespace after MathJax runs, the spaces around the math
// are removed. Thus we run it first.
htmlfile = minify(htmlfile, { collapseWhitespace: true });

fs.writeFile(filename, htmlfile, (err) => {
  if (err) throw err;
});


// Load MathJax and initialize MathJax and typeset the given math
// require("mathjax-full")
//   .init({
//     // MathJax configuration
//     loader: {
//       source: require("mathjax-full/components/src/source.js").source,
//       load: ["adaptors/liteDOM", "tex-chtml"],
//     },
//     tex: {
//       // the packages to use, e.g. "base, ams"; use "*" to represent the
//       // default packages, e.g, "*, bbox"
//       packages: ["base", "autoload", "require", "ams", "newcommand"],
//       inlineMath: [
//         ["$", "$"],
//         ["\\(", "\\)"],
//       ],
//     },
//     chtml: {
//       // Font to use for web fonts
//       fontURL:
//         "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2",
//       exFactor: EX / EM,
//     },
//     "adaptors/liteDOM": {
//       fontSize: EM,
//     },
//     startup: {
//       document: htmlfile,
//     },
//   })
//   .then((MathJax) => {
//     // Display the output
//     const adaptor = MathJax.startup.adaptor;
//     const html = MathJax.startup.document;

//     // Remove styles if there is no math
//     if (html.math.toArray().length === 0) {
//       adaptor.remove(html.outputJax.chtmlStyles);
//     }

//     const updatedDoc = minify(
//       adaptor.doctype(html.document) +
//         adaptor.outerHTML(adaptor.root(html.document)),
//       {
//         collapseBooleanAttributes: true,
//         // collapseWhitespace: true,
//         decodeEntities: true,
//         minifyCSS: true,
//         minifyJS: true,
//         minifyURLs: true,
//         removeAttributeQuotes: true,
//         removeComments: true,
//         removeOptionalTags: true,
//         removeRedundantAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         sortAttributes: true,
//         sortClassName: true,
//       }
//     );

//     fs.writeFile(filename, updatedDoc, (err) => {
//       if (err) throw err;
//     });
//   })
//   .catch((err) => console.error(err));
