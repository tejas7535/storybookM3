# frontend@schaeffler Share Button Documentation
A simple lib providing a button that copies the current link to clipboard upon clicking and displays a toast informing the user what happened

```typescript
// app.modules.ts or core.modules.ts

import { ShareButtonModule } from '@schaeffler/share-button';

@NgModule({
  ...
  imports: [
    ShareButtonModule,
    ...
  ]
  ...
})
```
Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-share-button></schaeffler-share-button>
```
