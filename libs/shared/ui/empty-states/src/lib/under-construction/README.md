# frontend@schaeffler Under Construction

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

The component selects a default `title` and `message` which are internationalized. There are translations for `DE` and `EN` available.

You can also override the default behavior and define a custom `title` and `message` for the component:

```html
<div class="my-widget">
    <h6>My Widget</h6>
    <schaeffler-under-construction
      title="Incoming feature!"
      message="This feature will come soon."
    >
    </schaeffler-under-construction>
</div>
```
