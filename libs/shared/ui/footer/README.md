# frontend@schaeffler Footer Documentation

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
