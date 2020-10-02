# frontend@schaeffler Under Construction

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i @schaeffler/styles`

```css
/* styles.scss */

@import '@schaeffler/styles/src';
```

Import into your project like:

```typescript
// app.module.ts

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@NgModule({
  imports: [
    UnderConstructionModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en',
      'en',
      true
    ),
    ...
  ],
})
export class AppRoutingModule {}

```

Use in your template with:

```html
<div class="my-widget">
    <h6>My Widget</h6>
    <schaeffler-under-construction>
    </schaeffler-under-construction>
</div>

```