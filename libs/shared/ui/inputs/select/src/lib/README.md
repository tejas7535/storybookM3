# Integrate Select UI component

## Select

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

import { SelectModule } from '@schaeffler/inputs/select';

@NgModule({
  ...
    imports: [
        SelectModule,
  ...
],
...
})
```

### Embed the Select Component (example)

In the parent component:

```html
<!--  example.component.html  -->

<!--  default implementation  -->
<schaeffler-select
    [stringOptions]="options"
    (searchUpdated)="onSearchUpdated($event)"
    (optionSelected)="onOptionSelected($event)"
></schaeffler-select>

<!--  using @angular/forms formControl implementation  -->
<schaeffler-select
    [stringOptions]="options"
    (searchUpdated)="onSearchUpdated($event)"
    [control]="control"
></schaeffler-select>

<!--  setting an initial value for the select control -->
<schaeffler-select
    [stringOptions]="options"
    [initialValue]="initialValue"
    (searchUpdated)="onSearchUpdated($event)"
    (optionSelected)="onOptionSelected($event)"
></schaeffler-select>

<!--  setting an initial value for the search input -->
<schaeffler-select
    [stringOptions]="options"
    [initialSearchValue]="initialSearchValue"
    (searchUpdated)="onSearchUpdated($event)"
    (optionSelected)="onOptionSelected($event)"
></schaeffler-select>

<!--  allow adding of new entries implementation  -->
<schaeffler-select
    [stringOptions]="options"
    [addEntry]="addEntry"
    (searchUpdated)="onSearchUpdated($event)"
    (entryAdded)="onEntryAdded($event)"
    (optionSelected)="onOptionSelected($event)"
></schaeffler-select>

<!--  advanced implementation  -->
<schaeffler-select
    [stringOptions]="options"
    [appearance]="appearance"
    [label]="label"
    [placeholder]="placeholder"
    [searchPlaceholder]="searchPlaceholder"
    [addEntryPlaceholder]="addEntryPlaceholder"
    [hint]="hint"
    [formFieldHint]="formFieldHint"
    [loading]="loading"
    [error]="error"
    [multiple]="multiple"
    [noResultsText]="noResultsText"
    [filterFn]="filterFn"
    [resetButton]="resetButton"
    [showTriggerTooltip]="true"
    [triggerTooltipDelay]="1500"
    (searchUpdated)="onSearchUpdated($event)"
    (entryAdded)="onEntryAdded($event)"
    (optionRemoved)="onOptionRemoved($event)"
    (optionSelected)="onOptionSelected($event)"
    (openedChange)="onOpenedChange($event)"
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
</schaeffler-select>
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
    public initialValue: StringOption = { id: 1, title: 'minimum option' };
    public initialSearchValue = 'minimum';

    public allOptions: StringOption[] = [
        {
            id: '1',
            title: 'full option',
            removable: true,
            tooltip: 'option tooltip',
            tooltipDelay: 1000,
        },
        {
            id: 1,
            title: 'minimum option',
        }
    ];

    public options: StringOption[] = [
        {
            id: '1',
            title: 'full option',
            removable: true,
            tooltip: 'option tooltip',
            tooltipDelay: 1000,
        },
        {
            id: 1,
            title: 'minimum option',
        }
    ];
    public appearance = 'fill';
    public label = 'select label';
    public placeholder = 'select placeholder';
    public searchPlaceholder = 'search placeholder';
    public addEntryPlaceholder = 'add entry placeholder';
    public hint = 'search hint';
    public formFieldHint = 'outer hint';
    public loading = false;
    public error = false;
    public multiple = true;
    public noResultsText = 'message to display the length of the provided option array is 0';
    public addEntry = true;
    public resetButton = true;

    public control = new FormControl();

    public ngOnInit(): void {
        // react to selection via formControl
        this.control.valueChanges.subscribe(
            value => console.log(value);
        )
    }

    // react to changes of the search value. Minimum length of the search string is 2 otherwise an empty string will be returned
    public onSearchUpdated(searchValue: string): void {
        this.options = allOptions.filter((option: StringOption) => option.title.includes(searchValue));
    }

    // react to addition of a new entry
    public onEntryAdded(value: string): void {
        const newOption: StringOption = { id: value, title: value, removable: true };
        this.options.push(newOption);
    }

    // react to the removal of an option
    public onOptionRemoved(option: StringOption): void {
        this.options.splice(this.options.indexOf(option, 1));
    }

    // react to selection via event
    public onOptionSelected(option: StringOption | StringOption[]): void {
        console.log(value);
    }

    // react to opening/closing the dropdown window
    public onOpenedChange(change: boolean): void {
        console.log(change);
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

| Name                      | Description                                                                                                      |
| --------------------------| -----------------------------------------------------------------------------------------------------------------|
| stringOptions             | the options to select from                                                                                       |
| appearance                | (optional) ('fill' \| 'outline') (default: 'fill') the style to display the component with                       |
| label                     | (optional) the label for the select control                                                                      |
| placeholder               | (optional) the placeholder for the select control                                                                |
| searchPlaceholder         | (optional) the placeholder for the search control inside the select                                              |
| addEntryplaceholder       | (optional) the placeholder for the add entry input control                                                       |
| hint                      | (optional) the hint to display below the search bar                                                              |
| formFieldHint             | (optional) the hint to display below the form field                                                              |
| initialValue              | (optional) the initial value to set for the select (has to be within the provided options)                       |
| initialSearchValue        | (optional) the initial value to set in the search bar                                                            |
| loading                   | (optional) whether the control should be in loading state (displays ng-content with selector `loadingContent`)   |
| error                     | (optional) whether the control should be in error state (displays ng-content with selector `errorContent`)       |
| multiple                  | (optional) whether the select control should should allow the selection of multiple items                        |
| noResultsText             | (optional) the text to display if the length of the options array is 0                                           |
| addEntry                  | (optional) whether the control should allow addition of new items                                                |
| control                   | (optional) a form control to manage the value of the control                                                     |
| filterFn                  | (optional) a custom function to implement filter logic used by the component                                     |
| resetButton               | (optional) (default: true) whether to display a reset button below the options                                   |
| showTriggerTooltip        | (optional) whether to display a tooltip on the trigger                                                           |
| showNumberOfSelected      | (optional) (default: false) whether to display the number of selected options in label for multiple options      |
| searchValueLengthTrigger  | (optional) (default: 1) lenght threshold for emitting searchUpdated event                                        |
| triggerTooltipDelay       | (optional) the delay in ms to display the trigger tooltip with                                                   |
| tooltipPosition           | (optional) the position to display option tooltips at                                                            |

#### Events

| Name                  | Description                                                                                                      |
| ----------------------| -----------------------------------------------------------------------------------------------------------------|
| searchUpdated         | (string) emits the value of the search string on change (returns `''` if the string is less than 2 characters)   |
| entryAdded            | (string) emits the string value the user entered to add a new item                                               |
| optionRemoved         | (StringOption) emits the value of the removed option                                                             |
| optionSelected        | (StringOption) emits the value of the selected option                                                            |
| openedChange          | (boolean) emits the status change of the dropdown window                                                         |

### i18n

The lib comes with translations for the following languages:

* de (german 🇩🇪)
* en (english 🇬🇧)
* es (spanish 🇪🇸)
* fr (french 🇫🇷)
* ru (russian 🇷🇺)
* zh (chinese 🇨🇳)