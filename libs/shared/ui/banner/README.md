# frontend@schaeffler Banner Documentation

This lib depends on `tailwind`, which has to be included in your app.

```css
/* styles.scss */

@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

@import 'libs/shared/ui/styles/src/lib/material-theme';

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import into your project like:

```typescript

This lib has few dependencies which also have to be installed and then imported. Check out their documentation as well.

Import into your project like:

```typescript
// app.modules.ts

import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { BannerModule } from '@schaeffler/banner';


@NgModule({
  ...
  imports: [
    HttpClientModule,
    StoreModule,
    SharedTranslocoModule.forRoot(...)
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
