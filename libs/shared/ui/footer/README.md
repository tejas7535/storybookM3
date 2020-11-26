# frontend@schaeffler Footer Documentation
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

The footerLinks as well as the version input are not mandatory. When no version or footerLinks provided the footer will just not show it in the left corner.
