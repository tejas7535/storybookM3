# frontend@schaeffler Settings Sidebar Documentation

[Angular Material Documentation](https://material.angular.io/components/sidenav/overview)

**Note: Should be used in combination with the `@schaeffler/header`**

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i @schaeffler/styles`

```scss
/* styles.scss */

@import '@schaeffler/styles/src';
```

This lib depends on the `schaeffler-icons`, which can be installed with npm:

`npm i schaeffler-icons`

Afterwards the `styles` section in the `angular.json` has to be adjusted: 

```json
"styles": [
  ...
  "node_modules/schaeffler-icons/style.css"
],
```

Import into your project like:

```typescript
// app.modules.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { SettingsSidebarModule } from '@schaeffler/settings-sidebar';

@NgModule({
  ...
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    SharedTranslocoModule.forRoot(...),
    SettingsSidebarModule,
    ...
  ]
  ...
})
```

API:

```typescript
  // Inputs
  @Input() open: boolean = true; // if the sidebar is visible or not
  @Input() openSidebarBtn: boolean = false; // if the user should see a button that opens the sidebar
  @Input() closeSidebarBtn: boolean = false; // if the user should see a button that closes the sidebar when opened
  
  // Outputs
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter(); // Emits the event, when the sidebar was toggled
```

Use like:

```html
<!-- parent.component.html -->

<schaeffler-settings-sidebar
  [open]="false"
  [openSidebarBtn]="true"
  [closeSidebarBtn]="true"
  (openChanged)="onOpenChanged($event)"
>
  <ng-container container>
    Your actual content
  </ng-container>
  <ng-container sidebar>
    Your Sidebar content
  </ng-container>
</schaeffler-settings-sidebar>
```
