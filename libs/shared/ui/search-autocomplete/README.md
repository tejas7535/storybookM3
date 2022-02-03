# frontend@schaeffler Search Autocomplete Documentation

## Disclaimer
This lib is based on ValueControlAccessor. As such, you can treat the resulting component as a run-of-the-mill ReactiveForms component. A more in-depth explanation can be found here: [https://indepth.dev/posts/1055/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms]

## Usage

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 */
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
import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

@NgModule({
  ...
  imports: [
    SearchAutocompleteModule,
    ...
  ]
  ...
})
```

API of HeaderComponent:

```typescript
// Inputs:
@Input() options!: SearchAutocompleteOption[]; // the list of options available to user. The component will filter it based on input. It can be either static, supplied at init, or change over time. If you plan on changing it, remember about setting 'loading' attribute.

@Input() loading?: boolean = false; //whether or not the list is currently being fetched, processed or anything else you want. Setting it to true will replace the user's option list with a loading spinner and optionally a loading message. Remember about setting it back to false once your list is ready

@Input() loadingMessage?: string = ''; // what message (if any) should be shown to the user while the list is loading

@Input() error?: boolean = false; // whether or not the search resulted in an error. will display an error message instead of an option list

@Input() minimumChars?: number = 3; // how many characters need to be inputted before the component emits searchString and show the list to the user

@Input() label?: string = ''; // what label will be displayed in the input before the user starts typing

// Outputs:
@Output() selection: string | undefined; // id of the user's selection. will emit undefined if user cleared their selection

@Output() searchString: string; // current value of the input. Will only emit if minimumChars number was reached

```

Use like:

```html
  <schaeffler-search-autocomplete 
    [options]="options | async"
    [loading]="loading | async"
    [error]="error | async"
    label="Choose an option"
    loadingMessage="Fetching data..."
    minimumChars="2"
    [formControl]="autocompleteFormControl"
    (selection)="handleSelection($event)"
  >
  </schaeffler-search-autocomplete>
```

```typescript
export class AppComponent {
    options = new BehaviorSubject<SearchAutocompleteOption[]>([]);
    autocompleteFormControl = new FormControl();
    loading = new BehaviorSubject<boolean>(false);
    error = new BehaviorSubject<boolean>(false);

    handleSelection(selectionId: string) {
      (...)
    }

    getData(searchString: string): void {
        this.loading.next(true);
        (...)
        this.loading.next(false);
        this.options.next([
            { title: 'Bearing A1', id: 'A1'},
            { title: 'Bearing B2', id: 'B2'},
            { title: 'Bearing C3', id: 'C3'},
            { title: 'Bearing D4', id: 'D4'},
            { title: 'Bearing E5', id: 'E5'},
            { title: 'Bearing F6', id: 'F6'},
            { title: 'Bearing G7', id: 'G7'},
            { title: 'Bearing H8', id: 'H8'},
            { title: 'Bearing XX', id: 'XX'},
        ]);
    }
}
```

## Running unit tests

Run `nx test shared-ui-search-autocomplete` to execute the unit tests.
