# frontend@schaeffler Unsupported Viewport

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i @schaeffler/styles`

```css
/* styles.scss */

@import '@schaffler/styles/src/lib/material-theme';  
@include mat-core();
@include angular-material-theme($schaeffler-theme);
```

Import into your project like:

```typescript
// myModule.module.ts

import { UnsupportedViewportModule } from '@schaeffler/empty-states';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@NgModule({
  ...
  imports: [
    HttpClientModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en',
      'en',
      true
    ),
    UnsupportedViewportModule,
    ...
  ]
  ...
})
```

Use like:

```html
<div>
  <my-app-component
      *ngIf="(unsupportedViewport$ | async) === false; else unsupportedViewport"
    ></my-app-component>
</div>

<ng-template #unsupportedViewport>
  <schaeffler-unsupported-viewport></schaeffler-unsupported-viewport>
</ng-template>

```

