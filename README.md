# Global Neurotechnology Atlas

Interactive atlas of 86 neurotechnology categories and 399 projects, laboratories, companies, public programs, and open-science efforts worldwide.

The quantitative ranking browser compares disclosed capital or program funding, reported workforce or team size, and directly sponsored interventional trials. Every displayed figure includes its scope, date, uncertainty, and source; unavailable figures remain explicitly undisclosed.

The interface uses progressive disclosure: the default 3D field map starts with six color-coded technology territories, organization nodes and filters are optional layers, ranking rows show only the active metric, and full evidence opens in a dismissible detail drawer. X shows interface depth, Y shows research-to-clinical maturity, Z separates technology-family layers, and technology-node size reflects the number of mapped organizations.

The map-first interaction is informed by the spatial taxonomy pattern used by [O-DATAMAP](https://o-datamap.oall.com/), adapted for neurotechnology rather than copying its branding or content.

Live site: https://howardwhsrun.github.io/neurovisual/

The application is now separated into maintainable web sources:

- `index.html` contains semantic page structure.
- `styles.css` contains the responsive visual system and map presentation.
- `src/app.ts` contains the typed atlas data, state, filtering, ranking, canvas rendering, and interactions.
- `dist/app.js` is the browser-ready JavaScript generated from TypeScript.

Run `pnpm install` and `pnpm build` after changing the TypeScript source. The compiled script is emitted as a classic browser script so both GitHub Pages and direct `file://` opening work. GitHub Pages publishes the static site from the root of the `main` branch.
