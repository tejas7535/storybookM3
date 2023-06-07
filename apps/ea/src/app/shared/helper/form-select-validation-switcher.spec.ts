import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormSelectValidatorSwitcher } from './form-select-validation-switcher';

const getFormGroup = () =>
  new FormGroup({
    selection: new FormControl('subGroup1', [Validators.required]),
    subGroup1: new FormGroup({
      control1: new FormControl(undefined, [Validators.required]),
      control2: new FormControl(undefined, [Validators.required]),
    }),
    subGroup2: new FormGroup({
      control1: new FormControl(undefined, [Validators.required]),
      control2: new FormControl(undefined, [Validators.required]),
      nestedGroup: new FormGroup({
        nestedControl1: new FormControl(undefined, [Validators.required]),
        nestedControl2: new FormControl(undefined, []),
      }),
    }),
  });

describe('FormSelectValidationSwitcher', () => {
  it('should enable the selected form group and disable others and the form validity should change accordingly', () => {
    const formGroup = getFormGroup();
    const selectionControl = formGroup.get('selection') as FormControl;
    selectionControl.setValidators(FormSelectValidatorSwitcher());
    selectionControl.updateValueAndValidity();

    const subGroup1 = formGroup.get('subGroup1') as FormGroup;
    const subGroup2 = formGroup.get('subGroup2') as FormGroup;

    expect(subGroup1.enabled).toBe(true);
    expect(subGroup2.enabled).toBe(false);

    // since subGroup1 is empty and has required fields, the form should be invalid
    expect(formGroup.valid).toBe(false);

    // fill subGroup1 fields
    subGroup1.setValue({
      control1: 'test value',
      control2: 'test value',
    });
    // now the form should be valid
    expect(formGroup.valid).toBe(true);

    // change selection to subGroup2
    selectionControl.setValue('subGroup2');
    selectionControl.updateValueAndValidity();

    expect(subGroup1.enabled).toBe(false);
    expect(subGroup2.enabled).toBe(true);

    // since subGroup2 is empty and has required fields, the form should be invalid again
    expect(formGroup.valid).toBe(false);
  });

  it('should not change the enabled status of form groups if the form group is disabled', () => {
    const formGroup = getFormGroup();
    formGroup.disable();
    const selectionControl = formGroup.get('selection') as FormControl;
    selectionControl.setValidators(FormSelectValidatorSwitcher());
    selectionControl.updateValueAndValidity();

    const subGroup1 = formGroup.get('subGroup1') as FormGroup;
    const subGroup2 = formGroup.get('subGroup2') as FormGroup;

    expect(subGroup1.enabled).toBe(false);
    expect(subGroup2.enabled).toBe(false);

    formGroup.enable();
    selectionControl.setValue('subGroup2');
    selectionControl.updateValueAndValidity();

    expect(subGroup1.enabled).toBe(false);
    expect(subGroup2.enabled).toBe(true);
  });
});
