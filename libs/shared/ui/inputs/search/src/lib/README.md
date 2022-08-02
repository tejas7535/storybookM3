# Integrate Search UI component

## Search

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

```css
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

### Import the Search Component Module

```ts
// parent component module

import { SearchModule } from '@schaeffler/inputs/search';

@NgModule({
  ...
    imports: [
        SearchModule,
  ...
],
...
})
```

### Embed the Search Component (example)

In the parent component:

```html
<!--  example.component.html  -->

<!--  default implementation  -->
<schaeffler-search
  [stringOptions]="options"
  (searchUpdated)="onSearchUpdated($event)"
  (optionSelected)="onOptionSelected($event)"
></schaeffler-search>

<!--  using @angular/forms formControl implementation  -->
<schaeffler-search
  [stringOptions]="options"
  (searchUpdated)="onSearchUpdated($event)"
  [control]="control"
></schaeffler-search>

<!--  advanced implementation  -->
<schaeffler-search
  [stringOptions]="options"
  appearance="fill"
  [label]="label"
  [placeholder]="placeholder"
  [hint]="hint"
  [loading]="loading"
  [error]="error"
  [noResultsText]="noResultsText"
  displayWith="title"
  [filterFn]="filterFn"
  (searchUpdated)="onSearchUpdated($event)"
  (optionSelected)="onOptionSelected($event)"
>
  <div loadingContent>
    The custom content to display in the panel while loading is set to true.
  </div>
  <div errorContent>
    The custom content to display in the panel while error is set to true.
    (The custom loading content will take priority over the error content, so in case loading and error are both set to true, the loading content will be shown)
  </div>
  <div matErrorContent>
    <!-- This content will be projected inside a mat-error element -->
    {{ getErrorMessage() }}
  </div>
</schaeffler-search>
```

```ts
// example.component.ts

import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class ExampleComponent implements OnInit {
  public allOptions: StringOption[] = [
    {
      id: '1',
      title: 'first option',
    },
    {
      id: 2,
      title: 'second option',
    }
  ];

  public options: StringOption[] = [
    {
      id: '1',
      title: 'first option',
    },
    {
      id: 2,
      title: 'second option',
    }
  ];
  public label = 'search label';
  public placeholder = 'search placeholder';
  public hint = 'search hint';
  public loading = false;
  public error = false;
  public noResultsText = 'message to display the length of the provided option array is 0';

  public control = new FormControl();

  public ngOnInit(): void {
    // react to selection via formControl
    this.control.valueChanges.subscribe(value =>
      console.log(value))
  }

  // react to changes of the search value. Minimum length of the search string is 2 otherwise an empty string will be returned
  public onSearchUpdated(searchValue: string): void {
    this.options = this.allOptions.filter((option: StringOption) => option.title.includes(searchValue));
  }

  // react to selection via event
  public onOptionSelected(option: StringOption): void {
    console.log(option);
  }

  // pass a custom filter function
  public filterFn(option?: StringOption, value?: string) {
    return option?.title?.includes(value);
  }

  // parse errors
  public getErrorMessage() {
    if (this.control.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }
}

```

For further information about the option type see [@schaeffler/inputs documentation](../../../README.md)

### Component API

#### Inputs

| Name           | Description                                                                                                      |
| ---------------| -----------------------------------------------------------------------------------------------------------------|
| stringOptions  | the options to select from                                                                                       |
| appearance     | (optional) ('fill' \| 'outline') (default: 'fill') the style to display the component with                       |
| label          | (optional) the label for the control                                                                             |
| placeholder    | (optional) the placeholder for the control                                                                       |
| hint           | (optional) the hint to display below the search bar                                                              |
| loading        | (optional) whether the control should be in loading state (displays ng-content with selector `loadingContent`)   |
| error          | (optional) whether the control should be in error state (displays ng-content with selector `errorContent`)       |
| noResultsText  | (optional) the text to display if the length of the options array is 0                                           |
| displayWith    | (optional) ('id' \| 'title') (default: 'title') whether to display the id or the title                           |
| control        | (optional) a form control to manage the value of the control                                                     |
| filterFn       | (optional) a custom function to implement filter logic used by the component                                     |

#### Events

| Name           | Description                                                                                                      |
| ---------------| -----------------------------------------------------------------------------------------------------------------|
| searchUpdated  | (string) emits the value of the search string on change (returns `''` if the string is less than 2 characters)   |
| optionSelected | (StringOption) emits the value of the selected option                                                            |

