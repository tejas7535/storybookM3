# frontend@schaeffler Under Construction

Import into your project like:

```typescript
// app.module.ts

import { NgModule } from '@angular/core';
import { UnderConstructionModule } from '@schaeffler/empty-states';

@NgModule({
  imports: [
    ...,
    UnderConstructionModule
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