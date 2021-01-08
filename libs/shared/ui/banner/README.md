# frontend@schaeffler Banner Documentation

This lib depends on the `schaeffler-icons`, which can be installed with npm:

`npm i schaeffler-icons`

Afterwards the `styles` section in the `angular.json` has to be adjusted: 

```json
"styles": [
  ...
  "node_modules/schaeffler-icons/style.css"
],
```

This lib has few dependencies which also have to be installed and then imported. Check out their documentation as well.

Import into your project like:

```typescript
// app.modules.ts

import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { BannerModule } from '@schaeffler/banner';
import { IconsModule } from '@schaeffler/icons';


@NgModule({
  ...
  imports: [
    HttpClientModule,
    StoreModule,
    SharedTranslocoModule.forRoot(...)
    BannerModule,
    IconsModule
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
