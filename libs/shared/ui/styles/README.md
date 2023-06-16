# frontend@schaeffler Styles Documentation

## Installation

### Scss

1. Run `npm i @schaeffler/styles`
2. Import `index.scss` in your target `.scss` file (e.g. of your component or the main scss file): `@import "@schaeffler/styles/src";`
3. Alternatively, you can also minimize the import to specific stylesheets:
   - `@import '@schaeffler/styles/src/lib/material-theme';`
   - `@import '@schaeffler/styles/src/lib/schaeffler-colors';`
   - `@import '@schaeffler/styles/src/lib/theme-overrides';`

### Tailwind

1. Generate Tailwind CSS configuration files using @nx/angular:setup-tailwind
   https://nx.dev/packages/angular/generators/setup-tailwind#nrwlangularsetup-tailwind

2. Import tailwind preset to your tailwind.config.js

```js
const {
  schaefflerTailwindPreset,
} = require('../styles/src/lib/tailwind/preset');
```

3. Add preset to tailiwnd config

```js

module.exports = {
  ...
  presets: [schaefflerTailwindPreset],
  ...
};

```

### Using Tailwind Prefixes

If your application is using a Tailwind prefix, you need to provide the prefix in the $prefix variable **before** the import of the lib styles in your `.scss` file.

```js
// tailwind.config.js

module.exports = {
  ...
  prefix: 'my-tailwind-prefix-',
  ...
};

```

```scss
// styles.scss

$prefix: 'my-tailwind-prefix-';

@import '@schaeffler/styles/src';
```
