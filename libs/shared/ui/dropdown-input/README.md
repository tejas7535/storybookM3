# frontend@schaeffler DropdownInput Documentation
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

import { DropdownInputModule } from '@schaeffler/dropdown-input';

@NgModule({
  ...
  imports: [
    DropdownInputModule,
    ...
  ]
  ...
})
```

API of DropdownInput Component:

```typescript
  @Output() updateSearch = new EventEmitter<string>();
  @Input() formControl = new FormControl('');
  @Input() options: DropdownInputOption[] = [];
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() label = '';
```

Interface of DropdownInputOption:

```typescript
  export interface DropdownInputOption {
  id: number;
  value: string;
  }
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-dropdown-input
  [formControl]="formControl"
  [options]="options"
  [placeholder]="placeholder"
  [hint]="hint"
  [label]="label"
  (updateSearch)="onUpdateSearch($event)"
></schaeffler-dropdown-input>
```

```typescript
// comp-xy.component.ts

import { DropdownInputOption } from '@schaeffler/dropdown-input';

public formControl: FormControl = new FormControl("")
public options: DropdownInputOption[] = [
  { id: 0, value: 'option0' },
  { id: 1, value: 'option1' },
  { id: 2, value: 'option2' },
];
public placeholder = 'Select an option';
public hint = 'Search for options to filter';
public label = 'Option Select';

public onUpdateSearch(query: string): void {
  console.log('searchQuery', query);
}
```

