# frontend@schaeffler Stepper Documentation

Uses Material Stepper but streamlines its display for small viewports
## Disclaimer
This lib depends on the [ngneat/https://github.com/ngneat/tailwind](https://github.com/ngneat/tailwind), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [schaeffler-frontend repo](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/master/tailwind.config.js)

It also depends on `@schaeffler/styles` which can be installed with npm:

`npm i @schaeffler/styles`

Also import the tailwind styles in your app
Example `styles.scss`
``` scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import into your project like:

```typescript
// myModule.module.ts

import { ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from '@schaeffler/stepper'

@NgModule({
  ...
  imports: [
    ReactiveFormsModule,
    StepperModule,
    ...
  ]
  ...
})
```

API of HeaderComponent:

```typescript
// Inputs:
@Input() linear = false; // whether or not should the user be able to access steps further ahead without completing the current one first. Needs FormControl to have a required validator set (Validators.required)

@Input() showButtons = false; //whether or not to display next/previous buttons for each step

@Input() FormGroup: FormGroup; // The top level ReactiveForm's FormGroup. The structure should look like this:
const formGroup = new FormGroup({ // top level wrapper
    step1Name: new FormGroup({ // formGroup that will cover a single step
        step1Input1Name: new FormControl(), // formControl responsible for a specific input in the step's template. Has to be bound to the input itself through [formControl]
        step2Input2Name: new FormControl(),
    }),
    step2Name: new FormGroup({
        step2Input2Name: new FormControl() // and so on
    })
})

@Input() steps: Step[]; // a configuration object containing data for each step, explained below

interface Step {
    label: string; // a name that will be displayed in the stepper header
    editable?: boolean; // whether or not can the user go back to this step once they moved further on
    formGroupName: string; // the name of the assigned FormGroup 
    content: TemplateRef<any>; // <ng-template> reference for the content that is supposed to be displayed for this particular step. Note: Each input has to have an assigned [formControl]
}

```

There are also two public methods exposed to control the flow of the stepper:

```typescript
public nextStep(): void {} // progresses the stepper to the next step on the list

public previousStep(): void {} // reverts the stepper back to the previous step on the list
```


Use like:

```html
  <schaeffler-stepper [formGroup]="formGroup" [steps]="steps"></schaeffler-stepper>

  <ng-template #step1><input [formControl]="input1" type="text" /></ng-template>
  <ng-template #step2><input [formControl]="input2" type="text" /></ng-template>
```

```typescript
export class AppComponent {
  @ViewChild("step1", { static: true }) step1: TemplateRef<any>;
  @ViewChild("step2", { static: true }) step2: TemplateRef<any>;

  input1 = new FormControl('pff', Validators.required);
  input2 = new FormControl('wololo');

  formGroup = new FormGroup({
    step1: new FormGroup({
      input1: this.input1,
    }),
    step2: new FormGroup({
      input2: this.input2,
    }),
  })

  get steps(): Step[] {
    return [
      {
        label: 'step 1',
        content: this.step1,
        editable: true,
        formGroupName: 'step1'
      },
      {
        label: 'step 2',
        content: this.step2,
        editable: true,
        formGroupName: 'step2'
      },
    ]
  }
}
```

## Running unit tests

Run `nx test shared-ui-stepper` to execute the unit tests.
