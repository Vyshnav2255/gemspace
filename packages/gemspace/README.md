# Gemspace

Twelve gemstone assets. Four styles. One component. Artwork is bundled in the dependency: no API key, account, CDN, or calls to the Gemspace website.

**Local preview package, not published to npm yet.** `@vyshnav2255/gemspace` is a proposed name; confirm the npm account scope before publishing.

## Try it locally

From the repository root:

```sh
npm run package:pack
```

Then, in another application:

```sh
npm install /absolute/path/to/gemspace/output/vyshnav2255-gemspace-0.1.0.tgz
```

Once published, installation will be `npm install @vyshnav2255/gemspace`.

## React

```jsx
import { Gem } from '@vyshnav2255/gemspace/react';
import { roseQuartz } from '@vyshnav2255/gemspace/gems/rose-quartz';

export default function Milestone() {
  return <Gem gem={roseQuartz} variant="glow" size={64} alt="Milestone reached" />;
}
```

React 18 or later is an optional peer dependency: only the `/react` adapter requires React. The component renders a plain `img` and works during server rendering. Use `alt=""` for decoration. Standard image props such as `className`, `loading`, and `onLoad` are supported. `size` sets width and height in pixels and must be positive. No stylesheet is required.

## JavaScript, Vue, Svelte, or another framework

```js
import { getGemSrc } from '@vyshnav2255/gemspace';
import { jade } from '@vyshnav2255/gemspace/gems/jade';

const image = document.createElement('img');
image.src = getGemSrc(jade, 'color');
image.alt = 'Achievement unlocked';
image.width = image.height = 64;
document.querySelector('#milestone').append(image);
```

Use the same source as an ordinary `img` source in Vue or Svelte, or as a CSS background image. `getGemSrc` returns a self-contained SVG data URI; it needs no asset loader and works during SSR. If your app uses a Content Security Policy, allow `data:` in `img-src`.

## Gems and styles

Gems: `dewdrop`, `blue-spark`, `sea-glass`, `moonstone`, `amethyst`, `sunstone`, `rose-quartz`, `jade`, `aurora`, `starlight`, `prism`, `everlight`.

Exports use camelCase: `blueSpark`, `seaGlass`, and `roseQuartz`. Each per-gem module also has a default export.

Variants: `outline`, `uncolored`, `color` (default), `glow`. All variants share a normalized canvas, so changing styles keeps the stone in place and at the same visible size. Grayscale, color, and glow embed raster artwork in SVG; outline uses vectors.

Prefer per-gem imports, especially for server rendering. Each imported gem includes its four styles; it never loads other gems. The root barrel also exports every gem for convenience, but whether unused imports are removed depends on the consuming bundler. These are detailed bitmap gemstones, not tiny vector UI icons; the images contribute meaningful bundle weight.

## Development

`npm run build` generates the checked-in, standalone gem modules from the site's normalized previews. Run the website's `npm run build` first if the original art changes. `npm test` checks all 48 packaged styles against those source files. `npm pack` builds and tests automatically.

The JavaScript is MIT licensed. See `ASSET-LICENSE.txt` for asset permission and AI provenance. The UI icons used on the Gemspace website are not included in this package.
