# frontend@schaeffler Banner Documentation
Import into your project like:

```typescript
// app.modules.ts

import { BannerModule } from '@schaeffler/shared/ui-components';

@NgModule({
  ...
  imports: [
    BannerModule,
    ...
  ]
  ...
})
```

API of Banner Store:
```typescript

  // Actions:
  export const openBanner = createAction(...);
  export const closeBanner = createAction(...);
  export const toggleFullText = createAction(...);
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-banner></schaeffler-banner>
```

```typescript
// comp-xy.component.ts

public ngOnInit(): void {
  this.openBanner();
}

public openBanner(): void {
  this.store.dispatch(
    openBanner({
    text: translate('banner.bannerText'),
    buttonText: translate('banner.buttonText'),
    icon: 'info',
    truncateSize: 0
    })
  );
}
```
