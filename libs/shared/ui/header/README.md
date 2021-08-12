# frontend@schaeffler Header Documentation


## Disclaimer
This lib depends on the [tailwind](https://www.npmjs.com/package/tailwindcss), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [frontend-schaeffler repo](https://github.com/Schaeffler-Group/frontend-schaeffler/blob/master/tailwind.config.js)

Also import the tailwind styles in your app
Example `styles.scss`
``` scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

## Usage

Import into your project like:

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



