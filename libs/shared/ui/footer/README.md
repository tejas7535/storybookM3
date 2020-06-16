# frontend@schaeffler Footer Documentation
Import into your project like:

```typescript
// app.modules.ts or core.modules.ts

import { FooterModule } from '@schaeffler/footer';

@NgModule({
  ...
  imports: [
    FooterModule,
    ...
  ]
  ...
})
```

API of Footer Component:

```typescript
  @Input() public footerLinks: FooterLink[];
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-footer [footerLinks]="footerLinks"></schaeffler-footer>
```

```typescript
// comp-xy.component.ts
import { FooterLink } from '@schaeffler/footer';

public footerLinks: FooterLink[] = [
  {
    link:
      'https://external.link.com/community,
    title: 'External Link',
    external: true
  },
  {
    link:
      '/interal-link,
    title: 'Internal Link',
    external: false
  }
];
```
