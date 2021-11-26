# frontend@schaeffler Stepper Documentation
A directive and stylesheet that streamlines the [Material Stepper](https://material.angular.io/components/stepper/overview) for small viewports. The difference is that on smaller screens only the active step label will be visible and the separators will have a set maximum width. Other than that it works exactly as a regular Material Stepper

## Usage

### Prerequisites

As this lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs), it is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 * and material icons, see https://fonts.google.com/icons
 */
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

@import 'libs/shared/ui/styles/src/lib/material-theme';

/*
 * further / custom components
 */
...

/***************************************************************************************************
 * UTILITIES
 */

/*
 * TailwindCSS, utility-first css framework
 * see https://tailwindcss.com/docs
 */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/*
 * further / custom utilities
 */
...

/***************************************************************************************************
 * OVERRIDES
 */ 
...
```

### Import the Module

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
