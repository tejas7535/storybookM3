# frontend@schaeffler LabelValue Documentation

This is a unified but also flexible component to display the label-value pairs.

## Usage

### Prerequisites

This lib depends on [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
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

```ts
import { LabelValueModule } from '@schaeffler/label-value';

@NgModule({
  ...
    imports: [
  LabelValueModule,
  ...
]
...
})
```

### Embed the Template (example)

In the parent component:

```ts
import { LabelValue } from '@schaeffler/label-value';

@Component({
  selector: 'my-component',
  templateUrl: './my.component.html',
})
export class MyComponent {
    
  // for a single value per row
  public labelValuesSingle: LabelValue[] = [
    {
      label: 'Data Label',
      value: 'This is the data value',
    },
    {
      label: 'Even longer data label',
      value: 'This is another and even longer data value string.',
    },
    {
      label: 'Erroneous Data',
      value: 'There is something wrong with this data',
      valueAdditionalClass: 'text-error'
    },
  ];

  // or

   // for only labels
  public labelsOnly: LabelValue[] = [
    {
      label: 'Data Label',
    },
    {
      label: 'Even longer data label',
    },
  ];
  
  // or
  
  // for multiple values per row
  public labelValuesMultiple: LabelValue[] = [
    {
      label: 'Data Set with multiple values',
      values: [
        {
          valueText: 'This is the first data value'
        },
        {
          valueText: 'This is the second, a little longer data value'
        },
        {
          valueText: 'Short value'
        }
      ],
    },
    {
      label: 'Data Set with colored values',
      values: [
        {
          valueText: 'No color data value'
        },
        {
          valueText: 'something wrong',
          valueAdditionalClass: 'text-error'
        },
        {
          valueText: 'Super',
          valueAdditionalClass: 'text-link'
        }
      ],
    },
  ];

  // or

  // for a custom html and components in row
  public labelValuesSingle: LabelValue[] = [
    {
      label: 'This one ist custom',
      custom: {
        selector: `htmlrow`, // Later used to identify row
        data: {
          any: `thing` // data of structure as needed
        }
      }
    },
    {
      label: 'Even longer data label',
      value: 'This is another and even longer data value string.',
    },
    {
      label: 'Erroneous Data',
      value: 'There is something wrong with this data',
      valueAdditionalClass: 'text-error'
    },
  ];
}
```

```html
<!--  for a single value per row  -->
<schaeffler-label-value [labelValues]="labelValuesSingle"></schaeffler-label-value>

<!--  or  -->

<!--  only show labels  -->
<schaeffler-label-value [labelValues]="labelsOnly" [showValue]="false"></schaeffler-label-value>

<!--  or  -->

<!--  set a minimum width for the labels  -->
<schaeffler-label-value [labelValues]="labelValuesSingle" [labelMinWidth]="120"></schaeffler-label-value>

<!--  or  -->

<!--  set a maximum width for the labels  -->
<schaeffler-label-value [labelValues]="labelValuesSingle" [labelMaxWidth]="120"></schaeffler-label-value>

<!--  or  -->

<!--  for multiple values per row  -->
<schaeffler-label-value [labelValues]="labelValuesMultiple"></schaeffler-label-value>

<!--  or  -->

<!--  for a single value per row  -->
<schaeffler-label-value [labelValues]="labelValuesSingle">
  <ng-template #custom let-row="row" let-data="data">
    custom.selector must be the same string as custom.selector in `labelValue`
    <div *ngIf="row === 'custom'">
      <!-- Custom HTML and Components -->
      <!-- {{ data | json }} can be accessed -->
    </div>
  </ng-template>
</schaeffler-label-value>
```

### API

| Name          | Description                        |
|---------------|------------------------------------|
| labelValues   | set of label-value pairs           |
| labelMinWidth | set a minimum width for the labels |
| labelMaxWidth | set a maximum width for the labels |

## Development

### Run Tests

#### Lint

```shell
$ nx lint shared-ui-label-value
```

#### Unit Tests

```shell
$ nx test shared-ui-label-value
```

### Run build

```shell
$ nx run shared-ui-label-value
```
