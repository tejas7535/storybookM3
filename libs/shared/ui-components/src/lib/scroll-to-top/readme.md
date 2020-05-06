# frontend@schaeffler ScrollToTop Documentation
Import into your project like:

```typescript
// app.modules.ts

import { ScrollToTopDirective, ScrollToTopModule} from '@schaeffler/shared/ui-components';

@NgModule({
  ...
  imports: [
    ScrollToTopModule,
    ...
  ]
  providers: [ScrollToTopDirective],
  ...
})
```

Use like:

```html
<!-- comp-xy.component.html -->

<div schaefflerScrollToTop>
  <!-- <content></content> -->
  <schaeffler-scroll-to-top></schaeffler-scroll-to-top>
</div>
```