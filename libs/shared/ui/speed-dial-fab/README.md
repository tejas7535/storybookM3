# frontend@schaeffler Speed Dial Fab Documentation

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
import { SpeedDialFabModule } from '@schaeffler/speed-dial-fab';

@NgModule({
  ...
  imports: [
    BrowserAnimationsModule,
    SpeedDialFabModule,
    ...
  ]
  ...
})
```

API of Speed Dial Fab Component:

```typescript
@Input() primaryButton: SpeedDialFabItem = {
  key: 'add',
  icon: new Icon('icon-plus', false),
  color: 'primary',
  label: true,
  title: 'Edit'
}; // this is the default configuration of the  FAB

public primaryButtonOpen: SpeedDialFabItem = {
  key: 'cancel',
  icon: new Icon('icon-cross', false),
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
import { SpeedDialFabItem } from '@schaeffler/speed-dial-fab';
import { Icon } from '@schaeffler/icons';

public speedDialFabPrimaryBtn: SpeedDialFabItem = {
  key: 'conversation',
  icon: new Icon('icon-bubbles', false),
  color: 'primary',
  label: true,
  title: 'new conversation'
};

public speedDialFabSecondaryBtns: SpeedDialFabItem[] = [
  {
    key: 'mail',
    icon: new Icon('icon-mail', false),
    color: 'accent',
    label: true,
    title: 'new mail'
  },
  {
    key: 'phone',
    icon: new Icon('icon-phone', false),
    color: 'accent',
    label: true,
    title: 'new call'
  }
];

public speedDialFabOpen = false;
public speedDialFabDisabled = false;

public speedDialFabClicked(key: string): void {
  if (key === 'conversation' || key === 'cancel') {
      this.speedDialFabOpen = !this.speedDialFabOpen;
  }
}
```
