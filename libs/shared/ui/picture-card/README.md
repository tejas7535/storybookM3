# frontend@schaeffler PictureCard Documentation
## Disclaimer
This lib depends on the [tailwind](https://www.npmjs.com/package/tailwindcss), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [frontend-schaeffler repo](https://github.com/Schaeffler-Group/frontend-schaeffler/blob/master/tailwind.config.js)

Also import the tailwind styles in your app
Example `styles.scss`


```scss
// styles.scss

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
/* You can add global styles to this file, and also import other style files */
@import '@schaeffler/styles/src/lib/colors.scss';
@import '@schaeffler/styles/src/lib/material-theme';
```

```typescript
// app.modules.ts or core.modules.ts

import { PictureCardModule } from '@schaeffler/picture-card';

@NgModule({
  ...
  imports: [
    PictureCardModule,
    ...
  ]
  ...
})
```

API of PictureCard Component:

```typescript
  @Input() public img: string;
  @Input() public title: string;
  @Input() public toggleEnabled: boolean = false;
  @Input() public hideActionsOnActive: boolean = false;
  @Input() public actions: PictureCardAction[];
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-picture-card
  [title]="title"
  [img]="img"
  [toggleEnabled]="toggleEnabled"
  [hideActionsOnActive]="hideActionsOnActive"
  [actions]="actions"
>
    <ng-container card-content>
        <p>This content will be shown/hidden when toggling the card</p>
    </ng-container>
    <ng-container card-actions>
        <p>This content will be placed in the action area of the card</p>
    </ng-container>
</schaeffler-picture-card>
```

```typescript
// comp-xy.component.ts

import { PictureCardAction } from '@schaeffler/picture-card';

public title = 'my title';
public img = 'my image source';
public toggleEnabled = true;
public hideActionsOnActive = true;
public actions: PictureCardAction[] = [
    {
      text: 'Select',
      disabled: false,
      toggleAction: true,
    }
]
```

