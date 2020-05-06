# frontend@schaeffler Footer Documentation
Import into your project like:

```typescript
// app.modules.ts

import { SpeedDialFabModule } from '@schaeffler/shared/ui-components';

@NgModule({
  ...
  imports: [
    SpeedDialFabModule,
    ...
  ]
  ...
})
```

API of FileDrop Component:

```typescript
@Input() primaryButton: SpeedDialFabItem = {
  key: 'add',
  icon: 'plus',
  color: 'primary',
  label: true,
  title: 'Edit'
}; // this is the default configuration of the  FAB

public primaryButtonOpen: SpeedDialFabItem = {
  key: 'cancel',
  icon: 'cross',
  color: 'primary',
  label: true,
  title: 'Cancel'
}; // this is the default configuration of the opened FAB

@Input() public secondaryButtons: SpeedDialFabItem[];
@Input() public open = false;
@Input() public disabled: boolean[] = [];

@Output() readonly clicked: EventEmitter<string> = new EventEmitter();
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-speed-dial-fab
  [open]="speedDialFabOpen"
  [disabled]="speedDialFabDisabled"
  [primaryButton]="speedDialFabPrimaryBtn"
  [secondaryButtons]="speedDialFabSecondaryBtns"
  (clicked)="speedDialFabClicked($event)"
></schaeffler-speed-dial-fab>
```

```typescript
// comp-xy.component.ts
import { SpeedDialFabItem } from '@schaeffler/shared/ui-components';

public speedDialFabPrimaryBtn: SpeedDialFabItem = {
  key: 'conversation',
  icon: 'bubbles',
  color: 'primary',
  label: true,
  title: 'new conversation'
};

public speedDialFabSecondaryBtns: SpeedDialFabItem[] = [
  {
    key: 'mail',
    icon: 'mail',
    color: 'accent',
    label: true,
    title: 'new mail'
  },
  {
    key: 'phone',
    icon: 'phone',
    color: 'accent',
    label: true,
    title: 'new call'
  }
];

public speedDialFabClicked(key: string): void {
  if (key === 'conversation' || key === 'cancel') {
      this.speedDialFabOpen = !this.speedDialFabOpen;
  }
}
```
