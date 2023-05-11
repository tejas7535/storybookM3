## Project Setup

### Create a new application

- Run `npx nx workspace-generator new-app`
- Follow the setup guide
- The app will be generated for you with our workspace defaults

If the `workspace-generator` fails, run following tasks and repeat the steps above:

- Run `node ./tools/npm-scripts/npm-force-resolutions-sync.js`
- Run `npm run force-resolutions`

### Further Adaptions

Configuration:

- If you want to apply more complex configuration scenarios, please get in touch with us first in order to discuss your needs.

Styles:

- Import common styles from the `@schaeffler/styles` package with `@import 'libs/shared/ui/styles/src/<package>';` to your app's `styles.scss`. Be cautious: Only import what you need, in order to keep the bundle size small.
- Add required fonts to your style section in the `angular.json` or `project.json` like so:

```
...
"styles": [
    "apps/cdba/src/styles.scss",
    "node_modules/@fontsource/material-icons/400.css",
    "node_modules/@fontsource/noto-sans/400.css",
    "node_modules/@fontsource/noto-sans/500.css"
],
...
```
