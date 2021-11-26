# frontend@schaeffler PictureCard Documentation
## Usage

### Prerequisites

As this lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs), it is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 * and material icons, see https://fonts.google.com/icons
 */
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

@import 'libs/shared/ui/styles/src/lib/material-theme';

/*
 * further / custom components
 */
...

/***************************************************************************************************
 * UTILITIES
 */

/*
 * TailwindCSS, utility-first css framework
 * see https://tailwindcss.com/docs
 */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/*
 * further / custom utilities
 */
...

/***************************************************************************************************
 * OVERRIDES
 */ 
...
```

### Import the Module

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

