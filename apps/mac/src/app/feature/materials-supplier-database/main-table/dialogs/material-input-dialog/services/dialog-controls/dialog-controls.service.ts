import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { createSupplierBusinessPartnerIdValidator } from '../../util';

@Injectable()
export class DialogControlsService {
  private readonly STEEL_MATERIAL_NUMBER_PATTERN =
    '1\\.[0-9]{4}(, ?1\\.[0-9]{4})*';
  private readonly COPPER_MATERIAL_NUMBER_PATTERN =
    '2\\.[0-9]{4}(, ?2\\.[0-9]{4})*';
  private readonly SUPPLIER_BUSINESS_PARTNER_ID_PATTERN = '^\\d{5,9}$';

  private readonly STEEL_MATERIAL_NUMBER_VALIDATOR = Validators.pattern(
    this.STEEL_MATERIAL_NUMBER_PATTERN
  );
  private readonly COPPER_MATERIAL_NUMBER_VALIDATOR = Validators.pattern(
    this.COPPER_MATERIAL_NUMBER_PATTERN
  );
  private readonly SUPPLIER_BUSINESS_PARTNER_ID_Validator =
    createSupplierBusinessPartnerIdValidator(
      this.SUPPLIER_BUSINESS_PARTNER_ID_PATTERN
    );

  public getControl<T>(value?: T, disabled = false) {
    return new FormControl<T>({ value, disabled });
  }

  public getRequiredControl<T>(value?: T, disabled = false) {
    return new FormControl<T>({ value, disabled }, [Validators.required]);
  }

  public getSteelNumberControl(value?: string, disabled = false) {
    return new FormControl<string>({ value, disabled }, [
      this.STEEL_MATERIAL_NUMBER_VALIDATOR,
    ]);
  }

  public getCopperNumberControl(value?: string, disabled = false) {
    return new FormControl<string>({ value, disabled }, [
      this.COPPER_MATERIAL_NUMBER_VALIDATOR,
    ]);
  }

  public getNumberControl(
    value?: number,
    disabled = false,
    start: number = 0,
    max: number = Number.MAX_VALUE
  ) {
    return new FormControl<number>({ value, disabled }, [
      Validators.min(start),
      Validators.max(max),
    ]);
  }

  public getRequiredNumberControl(
    value?: number,
    disabled = false,
    start: number = 0
  ) {
    return new FormControl<number>({ value, disabled }, [
      Validators.min(start),
      Validators.required,
    ]);
  }

  public getSupplierBusinessPartnerIdControl() {
    return new FormControl<StringOption[]>(undefined, [
      this.SUPPLIER_BUSINESS_PARTNER_ID_Validator,
    ]);
  }
}
