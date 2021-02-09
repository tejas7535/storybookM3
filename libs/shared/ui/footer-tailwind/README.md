# frontend@schaeffler-tailwind Footer (using Tailwind) Documentation

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

import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { RouterModule } from '@angular/router';

@NgModule({
  ...
  imports: [
    FooterTailwindModule,
    RouterModule,
    ...
  ]
  ...
})
```

API of Footer Component:

```typescript
  @Input() public footerLinks: FooterLink[] = [];
  @Input() public appVersion?: string;
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-footer-tailwind
  [footerLinks]="footerLinks"
  [appVersion]="appVersion"
></schaeffler-footer-tailwind>
```

```typescript
// comp-xy.component.ts
import { version } from '../../package.json';

import { FooterLink } from '@schaeffler/footer-tailwind';

public footerLinks: FooterLink[] = [
  {
    link: 'https://external.link.com/community',
    title: 'External Link',
    external: true
  },
  {
    link: '/interal-link',
    title: 'Internal Link',
    external: false
  }
];

  public appVersion = version;
```

The footerLinks as well as the version input are not mandatory. When no version or footerLinks provided the footer will just not show it.
