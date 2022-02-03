# frontend@schaeffler Loading Spinner Documentation

The element is meant to indicate loading of some other element. It'll center itself in the parent element, matching its size, and it'll be positioned absolutely.  

## Usage

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 */
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

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

@NgModule({
  ...
  imports: [,
    LoadingSpinnerModule,
    ...
  ]
  ...
})
```

API of LoadingSpinnerComponent:

```typescript
// Inputs:
@Input() backgroundColor?: string; // css-readable string defining the color of spinner's background, in case you want to obscure whatever's meant to be displayed behind it.
@Input() relative?: boolean // sets positioning of loading spinner
@Input() diameter?: number // sets diameter of loading spinner
@Input() strokeWidth?: number // set stroke width in percentage of loading spinner
```

Use like:

```html
<div class="parent-div">
    <div class="element-to-be-loaded" *ngIf="expression; else spinner"></div>
</div>
<ng-template #spinner>
    <schaeffler-loading-spinner
        backgroundColor="rgba(255,255,255, 0.1)"
    ></schaeffler-loading-spinner>
</ng-template>
```

## Running unit tests

Run `nx test shared-ui-loading-spinner` to execute the unit tests.
