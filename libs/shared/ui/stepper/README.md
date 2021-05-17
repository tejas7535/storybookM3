# frontend@schaeffler Stepper Documentation
A directive and stylesheet that streamlines the [Material Stepper](https://material.angular.io/components/stepper/overview) for small viewports. The difference is that on smaller screens only the active step label will be visible and the separators will have a set maximum width. Other than that it works exactly as a regular Material Stepper

## Disclaimer
This lib depends on the [ngneat/https://github.com/ngneat/tailwind](https://github.com/ngneat/tailwind), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [schaeffler-frontend repo](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/master/tailwind.config.js)

It also depends on `@schaeffler/styles` which can be installed with npm:

`npm i @schaeffler/styles`

Also import the tailwind styles in your app
Example `styles.scss`
``` scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import into your project like:

```typescript
// myModule.module.ts

import { StepperModule } from '@schaeffler/stepper'

@NgModule({
  ...
  imports: [
    StepperModule,
    ...
  ]
  ...
})
```

Use like:

```html
  <mat-horizontal-stepper schaefflerSeparatedSteps>
    <mat-step>(...)</mat-step>
    (...)
  </mat-horizontal-stepper>
```

```scss

@import "@schaeffler/stepper"

```

## Running unit tests

Run `nx test shared-ui-stepper` to execute the unit tests.
