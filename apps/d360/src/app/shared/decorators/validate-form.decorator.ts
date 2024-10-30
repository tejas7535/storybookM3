import { FormGroup } from '@angular/forms';

/**
 * Function to auto "activate" all FormFields for validation.
 *
 * @export
 * @param {string} formName
 * @return
 */
export function ValidateForm(formName: string) {
  return function (_target: any, _key: any, descriptor: any) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const originalMethod: Function = descriptor.value;

    descriptor.value = function (this, ...args: any[]) {
      const formGroup: FormGroup = this[formName];

      if (activateFormForValidation(formGroup)) {
        originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}

/**
 * The function which we will execute in the FormGroup variable
 *
 * @param {FormGroup} form
 * @return {boolean}
 */
function activateFormForValidation(form: FormGroup): boolean {
  if (form.valid) {
    return true;
  } else {
    form.markAllAsTouched();

    return false;
  }
}
