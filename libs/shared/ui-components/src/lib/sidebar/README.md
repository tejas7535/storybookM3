# frontend@schaeffler Sidebar Documentation

[Angular Material Documentation](https://material.angular.io/components/sidenav/overview)

Import into your project like:

```typescript
// app.modules.ts

import { SidebarModule } from '@schaeffler/shared/ui-components';

@NgModule({
  ...
  imports: [
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
