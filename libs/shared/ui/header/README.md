# frontend@schaeffler Header Documentation

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
<schaeffler-header [platformTitle]="title" toggleEnabled="true">
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



