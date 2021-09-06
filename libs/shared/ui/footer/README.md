# frontend@schaeffler Footer Documentation

## Disclaimer

This lib depends on the [tailwind](https://www.npmjs.com/package/tailwindcss), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [frontend-schaeffler repo](https://github.com/Schaeffler-Group/frontend-schaeffler/blob/master/tailwind.config.js)

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

import { FooterModule } from '@schaeffler/footer';
import { RouterModule } from '@angular/router';

@NgModule({
  ...
  imports: [
    FooterModule,
    RouterModule,
    ...
  ]
  ...
})
```

API of Footer Component:

```typescript
  @Input() public footerLinks: FooterLink[];
  @Input() public appVersion?: string;
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-footer
  [footerLinks]="footerLinks"
  [appVersion]="appVersion"
></schaeffler-footer>
```

Use can also have some custom html left of the links and version by simply add content to your schaeffler-footer element like:

```html
<!-- comp-xy.component.html -->

<schaeffler-footer
  [footerLinks]="footerLinks"
  [appVersion]="appVersion"
>
<span>Custom Content</span>
</schaeffler-footer>

```

```typescript
// comp-xy.component.ts
import { version } from '../../package.json';

import { FooterLink } from '@schaeffler/footer';

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
