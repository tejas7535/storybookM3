# frontend@schaeffler Styles Documentation

## Installation

### Scss
1. Run `npm i @schaeffler/styles`  
2. Import `index.scss` in your target `.scss` file (e.g. of your component or the main scss file): `@import "@schaeffler/styles/src";`
3. Alternatively, you can also minimize the import to specific stylesheets:
    - `@import '@schaeffler/styles/src/lib/buttons';`  
    - `@import '@schaeffler/styles/src/lib/colors';`  
    - `@import '@schaeffler/styles/src/lib/common';`  
    - `@import '@schaeffler/styles/src/lib/fonts';`  
    - `@import '@schaeffler/styles/src/lib/helpers';`  
    - `@import '@schaeffler/styles/src/lib/material-theme';`  
    - `@import '@schaeffler/styles/src/lib/mediaqueries';`  
    - `@import '@schaeffler/styles/src/lib/ghost-animation';` 

### Tailwind
1. Generate Tailwind CSS configuration files using @nrwl/angular:setup-tailwind
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
