# frontend@schaeffler Unsupported Viewport

Import into your project like:

```typescript
// myModule.module.ts

import { UnsupportedViewportModule } from '@schaeffler/shared/empty-states';

@NgModule({
  ...
  imports: [
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

