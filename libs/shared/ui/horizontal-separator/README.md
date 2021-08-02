# frontend@schaeffler Horizontal Separator Documentation

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

import { HorizontalSeparatorModule } from '@schaeffler/horizontal-separator';

@NgModule({
  ...
  imports: [,
    HorizontalSeparatorModule,
    ...
  ]
  ...
})
```

API of HorizontalSeparatorComponent:

```typescript
// Inputs:
@Input() alwaysCentered = false; // whether or not the separator text will be centered on medium and larger screens. It's always centered on small viewports

@Input() text: string; // The text that will be displayed
```

Use like:

```html
<schaeffler-horizontal-separator 
    [text]="separator text"
    [alwaysCentered]="true"
>
<!-- <div>other content can be displayed next to the text<div> -->
</schaeffler-horizontal-separator>
```

## Running unit tests

Run `nx test shared-ui-horizontal-separator` to execute the unit tests.
