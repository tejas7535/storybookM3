# frontend@schaeffler RotaryControl Documentation

UI component to provide a rotary control. This can be used to **display and change** values.  
The component is an Angular [standalone component](https://angular.io/guide/standalone-components). This works with Angular v14 and higher.

## Usage

### Prerequisites

This lib depends on [Tailwind](https://tailwindcss.com/docs). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

```scss
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

### Import the Component

```ts
// parent.module.ts
import { RotaryControlComponent } from '@schaeffler/controls';

@NgModule({
  imports: [
    RotaryControlComponent,
  ]
})
export class ParentModule {}

// or

// parent.component.ts
import { RotaryControlComponent } from '@schaeffler/controls';

@Component({
  selector: 'parent-component',
  standalone: true,
  imports: [
    RotaryControlComponent,
  ]
})
```

### Embed the Component (example)

In the parent component:

```ts
import { RotaryControlItem } from '@schaeffler/controls';

@Component({
  selector: 'parent-component',
  standalone: true,
  imports: [
    RotaryControlComponent,
  ],
})
export class ParentComponent implements OnInit {
  private readonly monthsWithNumber = [0,1,3,6,9,12];
  public duration = 5;
  public availableMonths: RotaryControlItem[] = Array.from(
    { length: 13 },
    (_, index) => (
      {
        label: this.monthsWithNumber.includes(index) ? index.toString() : '',
        highlight: index === 0,
      }
    )
  );

  public otherValue = 12;
  public otherValues: RotaryControlItem[] = Array.from(
    { length: 13 },
    (_, index) => (
      {
        label: index.toString(),
        highlight: index === this.otherValue,
      }
    )
  );

  public changeableValue = 10;
  public changeableValues: RotaryControlItem[]

  ngOnInit() {
    this.assignChangeableValues();
  }

  public onChangeableValueChanged(value: number): void {
    this.changeableValue = value;
    this.assignChangeableValues();
  }

  private assignChangeableValues(): void {
    this.changeableValues = Array.from(
      { length: 11 },
      (_, index) => (
        {
          label: index.toString(),
          highlight: index === this.changeableValue
        }
      )
    );
  }
}
```

```html
<div class="flex flex-col md:flex-row gap-12 min-h-full justify-center py-4 md:py-8">
  <div>
    <h4 class="text-center mb-4">Lubrication Duration:<br>{{ duration }} months</h4>
    <div class="container mx-auto px-4 md:max-w-2xl flex justify-center">
      <schaeffler-rotary-control
        [controlValue]="duration"
        [controlItems]="availableMonths"
        [offsetAngle]="45"
      ></schaeffler-rotary-control>
    </div>
  </div>
  <div>
    <h4 class="text-center mb-4">Other Control Value:<br>{{ otherValue }}</h4>
    <div class="container mx-auto px-4 md:max-w-2xl flex justify-center">
      <schaeffler-rotary-control
        [controlValue]="otherValue"
        [controlItems]="otherValues"
        [rotateScale]="true"
      ></schaeffler-rotary-control>
    </div>
  </div>
  <div>
    <h4 class="text-center mb-4">Changeable Control Value:<br>{{ changeableValue }}</h4>
    <div class="container mx-auto px-4 md:max-w-2xl flex justify-center">
      <schaeffler-rotary-control
        [controlValue]="changeableValue"
        [controlItems]="changeableValues"
        [rotateScale]="false"
        [controlValueChangeable]="true"
        (controlValueChanged)="onChangeableValueChanged($event)"
      ></schaeffler-rotary-control>
    </div>
  </div>
</div>
```

### API

| Type     | Name                   | Description                                                                                              |
|----------|------------------------|----------------------------------------------------------------------------------------------------------|
| @Input   | controlItems           | (RotaryControlItem[]) (default: []) The items that form the scale marks                                  |
| @Input   | controlValue           | (number) The value that is displayed (default: 0)                                                        |
| @Input   | controlValueChangeable | (optional) (boolean) Make the value changeable by the user (default: false)                              |
| @Input   | offsetAngle            | (optional) Angle offset for the first item to create a prominent first scale mark (default: 0)           |
| @Input   | rotateScale            | (optional) (boolean) Instead of the pointer, rotate the scale ring show the value (default: false)       |
| @Output  | controlValueChanged    | (number) Event when the control value changes. The payload is the index of the value in the controlItems |


## Development

### Run Tests

#### Lint

```shell
$ nx lint shared-ui-controls
```

#### Unit Tests

```shell
$ nx test shared-ui-controls
```

### Run build

```shell
$ nx run shared-ui-controls:build
```
