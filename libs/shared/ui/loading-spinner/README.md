# frontend@schaeffler Loading Spinner Documentation

The element is meant to indicate loading of some other element. It'll center itself in the parent element, matching its size, and it'll be positioned absolutely.  

## Disclaimer
This lib depends on the [ngneat/https://github.com/ngneat/tailwind](https://github.com/ngneat/tailwind), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [schaeffler-frontend repo](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/master/tailwind.config.js)

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
