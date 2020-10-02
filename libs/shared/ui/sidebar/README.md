# frontend@schaeffler Sidebar Documentation

[Angular Material Documentation](https://material.angular.io/components/sidenav/overview)

This lib depends on the `schaeffler-icons`, which can be installed with npm:

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
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { SidebarModule } from '@schaeffler/sidebar';

@NgModule({
  ...
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    SharedTranslocoModule.forRoot(...),
    SidebarModule,
    ...
  ]
  ...
})
```

API of SidebarComponent:

```typescript
   @Input() width = 260; // you can override the standard width in px
```

API of SidebarElements: 

```typescript
    @Input() elements: SidebarElement[]; 
```

API of Sidebar Store:

```typescript
  // Selectors:
    export const getSidebarMode = createSelector(...); // will return a value of enum SidebarMode (open, minified, closed) 

  // Actions:
    export const toggleSidebar = createAction(...); 
    export const setSidebarMode = createAction(...); // set a specific mode manually 

```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-sidebar>
  <ng-container sidebar>
    <schaeffler-sidebar-elements
      [elements]="sidebarElements"
    ></schaeffler-sidebar-elements>
  </ng-container>

  <ng-container content>
    place content here
  </ng-container>
</schaeffler-sidebar>
```
