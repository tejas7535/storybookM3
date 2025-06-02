import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ValidateForm } from './validate-form.decorator';

describe('ValidateForm Decorator', () => {
  // Test class that uses the decorator
  class TestComponent {
    validForm = new FormGroup({
      name: new FormControl('Test', Validators.required),
      email: new FormControl('test@example.com', [
        Validators.required,
        Validators.email,
      ]),
    });

    invalidForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('invalid-email', [
        Validators.required,
        Validators.email,
      ]),
    });

    methodCalled = false;

    @ValidateForm('validForm')
    submitValidForm(): void {
      this.methodCalled = true;
    }

    @ValidateForm('invalidForm')
    submitInvalidForm(): void {
      this.methodCalled = true;
    }
  }

  let component: TestComponent;

  beforeEach(() => {
    component = new TestComponent();
    component.methodCalled = false;
  });

  it('should execute the decorated method when form is valid', () => {
    component.submitValidForm();

    expect(component.methodCalled).toBe(true);
  });

  it('should not execute the decorated method when form is invalid', () => {
    component.submitInvalidForm();

    expect(component.methodCalled).toBe(false);
  });

  it('should mark all controls as touched when form is invalid', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.invalidForm,
      'markAllAsTouched'
    );

    component.submitInvalidForm();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should not mark controls as touched when form is valid', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.validForm,
      'markAllAsTouched'
    );

    component.submitValidForm();

    expect(markAllAsTouchedSpy).not.toHaveBeenCalled();
  });

  describe('activateFormForValidation function', () => {
    it('should return true for valid form', () => {
      // We're testing a private function indirectly through the decorator
      component.submitValidForm();
      expect(component.methodCalled).toBe(true);
    });

    it('should return false for invalid form', () => {
      // We're testing a private function indirectly through the decorator
      component.submitInvalidForm();
      expect(component.methodCalled).toBe(false);
    });

    it('should properly handle form state changes', () => {
      // Initial state - form is invalid
      component.submitInvalidForm();
      expect(component.methodCalled).toBe(false);

      // Fix the form
      component.invalidForm.controls['name'].setValue('Fixed Name');
      component.invalidForm.controls['email'].setValue('fixed@example.com');

      // Reset the flag
      component.methodCalled = false;

      // Should work now
      component.submitInvalidForm();
      expect(component.methodCalled).toBe(true);
    });
  });
});
