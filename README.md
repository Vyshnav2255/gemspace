# Gemspace

A standalone, space-themed library of 12 free gemstone assets in four styles: outline, without color, with color, and color with subtle glow. Includes individual downloads, four ZIP sets, a responsive gallery, starfield, shooting stars, and reduced-motion support.

Run `npm run dev`, then open http://localhost:4173. No JavaScript dependencies or build step required to serve `dist/`.

`npm run build` regenerates the SVG variants and ZIP sets using Python's standard library. Color is transparent PNG; the grayscale and glow SVGs embed their artwork and filters, so their effects travel with downloads. Outline is vector SVG. Grayscale and glow are raster-backed SVG, not vector redraws.

The asset permission and AI provenance note are in `dist/LICENSE.txt`. This project began with the Bookcrumbs milestone gem collection. The current project name is a working name.
