# frontend@schaeffler Settings Sidebar Documentation

[Angular Material Documentation](https://material.angular.io/components/sidenav/overview)

Import into your project like:

```typescript
// app.modules.ts

import { SettingsSidebarModule } from '@schaeffler/shared/ui-components';

@NgModule({
  ...
  imports: [
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
