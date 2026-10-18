# WTFBY storefront

A React 19 and Vite visual storefront prototype for WTFBY, with a procedural Three.js garment preview, hash-based collection/product navigation, product options, search, and an accessible navigation overlay.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Validate with:

```sh
npm run build
npm run lint
```

## Storefront scope

- Eight sample products are defined in `src/App.jsx` across SIGNATURE, GRAPHIC, WASHED, and LIMITED.
- Product colors and sizes are sample configuration and only change the product preview/selection state. The interface does not implement a bag, checkout, or payment.
- The garment is procedural geometry with a generated surface texture; it is not a scanned model or cloth simulation.
- The hero rockscape, macro garment reveals, product cards, and Studio studies use local SVG/CSS artwork, not product photography.

There is no backend, product inventory, customer authentication, or order service configured.
