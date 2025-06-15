# Portfolio for Wei Ding (丁卫)

Here's a quick summary of the changes I (Eli Hunter) made in Late May & Early
June of 2025:
- Format HTML, JS, and CSS files with prettier.
- Upgrade to HTML5 and CSS3.
- Switch from HTML table to Flexbox for better mobile formatting.
- Add fonts for captions and headers.
- Lots of changes to the lightbox modals:
  - Make modals scale the X & Y axis at the same time.
  - Remove the initial modal resize animation.
  - Make the background shadow effect appear at the same time as the modal.
  - Make the background shadow cover the entire background even when the
    viewport size changes.
  - Make the image details always available. (Previously they would appear and
    disappear causing everything to jiggle.)
  - Update icons to be Material Design SVGs with transparency.
  - Add padding to the image details.

## Project Layout

- `index.html`: The main content of the website. This contains all of the text
  and lists out all of the projects in the portfolio. For projects with images,
  follow the "lightbox" pattern that is used in the "Design Samples" section.
  Put images in the `images/` folder, ideally with a specific sub-folder for
  every project. For projects with documents, follow the "flex-item + links"
  pattern used by the "Wireframs and Workflows" section. Put the docs in the
  `docs/` folder.
- `images/`: The folder for all of the images in the website.
- `docs/`: The folder for all of the documents (e.g. PDFs) in the website.
- `css/`: The folder for all of the CSS (Cascading Style Sheets) used in the
  website. The files here control the look of the website, but don't affect the
  content of behavior of the website.
  - `pages.css`: Controls the fonts, margins, padding, and colors of the
    general website. Edit this to your heart's content. It's pretty harmless.
  - `lightbox.css`: Controls the fonts, margins, padding, and colors of the
    image pop-ups. This is relatively harmless to modify, but sometimes
    requires updates to `lightbox.js`.
- `js/`: The folder for all of the Javascript used in the website. The files
  here control the behavior of the website.
  - `lightbox.js`: Code controlling the image modals. Probably doesn't need to
    be modified because you can tweak its setting using the LightBoxOptions in
    `index.html`.
  - `effects.js`: Library controlling the animated affects used in the pop-ups.
    Probably doesn't need to be modified.
  - `prototype.js`: Library powering the object-oriented inheritance system
    used by `effects.js`. Do not touch.
  - `scriptaculous.js`: Honestly I don't know what this does.
  - `builder.js`: I also don't know what this does.
```
