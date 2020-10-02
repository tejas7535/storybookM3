# frontend@schaeffler ScrollToTop Documentation


This lib depends on the `schaeffler-icons`, can be installed with npm:

`npm i schaeffler-icons`

Afterwards the `styles` section in the `angular.json` has to be adjusted: 

```
"styles": [
  ...
  "node_modules/schaeffler-icons/style.css"
],
```

Import into your project like:

```typescript
// app.modules.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollToTopDirective, ScrollToTopModule} from '@schaeffler/scroll-to-top';

@NgModule({
  ...
  imports: [
    BrowserAnimationsModule,
    ScrollToTopModule,
    ...
  ]
  providers: [ScrollToTopDirective],
  ...
})
```

Use like:

```html
<!-- comp-xy.component.html -->

<div schaefflerScrollToTop>
  <!-- <content></content> -->
  <schaeffler-scroll-to-top></schaeffler-scroll-to-top>
</div>
```