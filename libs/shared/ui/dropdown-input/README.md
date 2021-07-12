# frontend@schaeffler DropdownInput Documentation
## Disclaimer
This lib depends on the [ngneat/https://github.com/ngneat/tailwind](https://github.com/ngneat/tailwind), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [schaeffler-frontend repo](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/master/tailwind.config.js)

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

