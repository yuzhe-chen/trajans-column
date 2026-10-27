# Trajan's Column

A scroll-through site about Trajan's Column (Rome, AD 113): climb the frieze
scene by scene, read the inscription and coins with a magnifying glass, follow
Trajan's name as it grows, and compare his empire in 98 and 117.

## Editing

- **Words:** `js/content.js` — every heading, scene description, the inscription,
  the abbreviations and the Latin readings. Nothing else needs touching.
- **Key scenes:** add or change entries in `keyScenes` (Cichorius scene number +
  an image in `assets/scenes/`). The climb finds each scene on the frieze itself.
- **Map:** `data/*.json` (see `data/SOURCES.md`).
- **Image credits:** `assets/credits.json`, printed at the foot of the page.

## Running it

No build step. Serve the folder and open it:

    python3 -m http.server 8137

Pushing to `main` publishes it with GitHub Pages.

## How the column works

`js/column.js` wraps the frieze strip (`assets/frieze/atlas.jpg`, the strip cut
into rows) round a cylinder as a true helix in a shader, so the 3D column is
built from the frieze itself. Scrolling reads the strip in order; the column
turns so the part being read faces you, and the climb pauses at key scenes.

## Hosting

Two copies of the same files:

- GitHub Pages, https://yuzhe-chen.github.io/trajans-column/, published by
  `.github/workflows/pages.yml` on every push to `main`.
- Firebase Hosting, https://trajans-column.web.app, a site in the
  `saxonplanner` project. Deploy with
  `npx firebase-tools deploy --only hosting:trajans-column`.
