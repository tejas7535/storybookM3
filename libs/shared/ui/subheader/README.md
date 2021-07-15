# frontend@schaeffler-tailwind Subheader Documentation

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

## Usage

Import into your project like:

```typescript
// app.modules.ts or core.modules.ts

import { SubheaderModule } from '@schaeffler/subheader';

@NgModule({
  ...
  imports: [
    SubheaderModule,
    ...
  ]
  ...
})
```

API of Subheader Component:

```typescript
  ...
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-subheader></schaeffler-subheader>
```

```typescript
// comp-xy.component.ts
  ...
```