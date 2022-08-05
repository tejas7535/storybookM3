import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Injectable()
export class DialogControlsService {
  private readonly MATERIAL_NUMBER_PATTERN = '1\\.[0-9]{4}(, 1\\.[0-9]{4})*';

  private readonly MATERIAL_NUMBER_VALIDATOR = Validators.pattern(
    this.MATERIAL_NUMBER_PATTERN
  );
  private readonly MIN_0_VALIDATOR = Validators.min(0);

  public getControl<T>(value?: T, disabled = false) {
    return new FormControl<T>({ value, disabled });
  }

  public getRequiredControl<T>(value?: T, disabled = false) {
    return new FormControl<T>({ value, disabled }, [Validators.required]);
  }

  public getSteelNumberControl(value?: string, disabled = false) {
    return new FormControl<string>({ value, disabled }, [
      this.MATERIAL_NUMBER_VALIDATOR,
    ]);
  }

  public getNumberControl(value?: number, disabled = false) {
    return new FormControl<number>({ value, disabled }, [this.MIN_0_VALIDATOR]);
  }

  public getRequiredNumberControl(value?: number, disabled = false) {
    return new FormControl<number>({ value, disabled }, [
      this.MIN_0_VALIDATOR,
      Validators.required,
    ]);
  }

  public getCo2TotalControl(
    scope1Control: FormControl<number>,
    scope2Control: FormControl<number>,
    scope3Control: FormControl<number>,
    value?: number,
    disabled = false
  ) {
    return new FormControl<number>({ value, disabled }, [
      this.MIN_0_VALIDATOR,
      this.scopeTotalValidatorFn(scope1Control, scope2Control, scope3Control),
    ]);
  }

  private readonly scopeTotalValidatorFn =
    (
      scope1Control: FormControl<number>,
      scope2Control: FormControl<number>,
      scope3Control: FormControl<number>
    ): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const current = (control.value as number) || 0;
        const min =
          Math.max(scope1Control.value || 0, 0) +
          Math.max(scope2Control.value || 0, 0) +
          Math.max(scope3Control.value || 0, 0);

        return min > current
          ? { scopeTotalLowerThanSingleScopes: { min, current } }
          : undefined;
      }

      return undefined;
    };
}
