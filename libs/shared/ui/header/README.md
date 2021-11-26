# frontend@schaeffler Header Documentation

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
// myModule.module.ts

import { StoreModule } from '@ngrx/store';
import { HeaderModule } from '@schaeffler/header';

@NgModule({
  ...
  imports: [
    StoreModule,
    HeaderModule,
    ...
  ]
  ...
})
```

API of HeaderComponent:

```typescript
// Inputs:
@Input() toggleEnabled = false; // when enabled, a burger icon is included and the output event is active
// When you use the SchaefflerSidebar as well, the integration of the toggle event and the button click is already done for you. 

@Input() platformTitle: string;

@Input() link?: string; // an optional ngRouter link attached to the header title.  
@Input() logo?: string // an optional image url to display an additional logo next to the Schaeffler logo

// Output:
@Output() readonly toggle: EventEmitter<void> = new EventEmitter(); // is emitted when the burger icon was clicked
```

API of UserMenuComponent: 

```typescript
// Inputs:
@Input() user: string; // username, which is displayed
@Input() entries: UserMenuEntry[] = []; // menu entries

// Output: 
 @Output() readonly clicked: EventEmitter<string> = new EventEmitter(); // is emitted when a element of the menu is clicked. Emitted event contains the provided key within the UserMenuEntry.
```


Use like:

```html
<schaeffler-header [platformTitle]="title">
  <schaeffler-user-menu
    user-menu
    [user]="username"
    [entries]="userMenuEntries"
  ></schaeffler-user-menu>

  PAGE CONTENT COMES HERE
</schaeffler-header>
```

Here's a fully working example with the Schaeffler Sidebar. There is no further code necessary within your component: 

```html
<schaeffler-header [platformTitle]="title" [toggleEnabled]="true">
    <schaeffler-sidebar>
        <!-- optional -->
        <ng-container sidebar>
            <schaeffler-sidebar-elements
                [elements]="sidebarElements"
            ></schaeffler-sidebar-elements>
        </ng-container>

        <ng-container content>
            PAGE CONTENT
        </ng-container>
    </schaeffler-sidebar>
</schaeffler-header>
```



