# frontend@schaeffler Unsupported Viewport

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i @schaeffler/styles`

```css
/* styles.scss */

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import into your project like:

```typescript
// myModule.module.ts

import { UnsupportedViewportModule } from '@schaeffler/empty-states';

import { environment } from '../environments/environment';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@NgModule({
  ...
  imports: [
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
      *ngIf="(unsupportedViewport$ | ngrxPush) === false; else unsupportedViewport"
    ></my-app-component>
</div>

<ng-template #unsupportedViewport>
  <schaeffler-unsupported-viewport></schaeffler-unsupported-viewport>
</ng-template>

```

