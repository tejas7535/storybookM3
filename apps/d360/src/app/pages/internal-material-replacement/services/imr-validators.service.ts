import { Injectable, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { isAfter, isBefore, isEqual } from 'date-fns';

import { getDateOrNull } from '../../../shared/utils/date-format';
import { ValidationHelper } from '../../../shared/utils/validation/validation-helper';

@Injectable({
  providedIn: 'root',
})
export class IMRValidatorsService {
  public readonly MAX_DATE = new Date(9999, 11, 31);
  public readonly TODAY = new Date();

  public constructor(
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  /**
   * Validator to ensure materials match on packaging change
   */
  public keepMaterialOnPackagingChange(
    opponent: string,
    materialCustomErrorMessage: WritableSignal<string | null>
  ): ValidatorFn {
    return (materialControl: AbstractControl) => {
      const type = materialControl?.parent
        ?.get('replacementType')
        ?.getRawValue()?.id;
      const material = materialControl?.getRawValue()?.id;
      const opponentMaterialControl = materialControl?.parent?.get(opponent);
      const opponentMaterial = opponentMaterialControl?.getRawValue()?.id;

      const getMaterialNumber13 = (value: string) => {
        let cleaned = String(value).replaceAll('-', '');

        if (cleaned.trim().length > 13) {
          cleaned = cleaned.slice(0, 13);
        }

        return cleaned;
      };

      if (
        type === 'PACKAGING_CHANGE' &&
        material &&
        opponentMaterial &&
        getMaterialNumber13(material) !== getMaterialNumber13(opponentMaterial)
      ) {
        materialCustomErrorMessage.set(
          translate('sap_message./SGD/SCM_SOP_SALES.107')
        );

        return { keepMaterialOnPackagingChange: true };
      }
      materialCustomErrorMessage.set(null);

      return null;
    };
  }

  /**
   * Validator to ensure cutover date is before start of production
   */
  public cutoverDateBeforeSOP(
    startOfProductionCustomErrorMessage: WritableSignal<string | null>
  ): ValidatorFn {
    return this.createDateRangeValidator(
      'cutoverDate',
      'startOfProduction',
      startOfProductionCustomErrorMessage,
      'internal_material_replacement.error.startOfProductionBeforeCutoverDate'
    );
  }

  /**
   * Validator to ensure replacement date is before cutover date
   */
  public replacementBeforeCutoverDate(
    replacementDateCustomErrorMessage: WritableSignal<string | null>
  ): ValidatorFn {
    return this.createDateRangeValidator(
      'cutoverDate',
      'replacementDate',
      replacementDateCustomErrorMessage,
      'internal_material_replacement.error.substitutionBeforeCutoverDate'
    );
  }

  /**
   * Validator to check date ranges against existing values when editing
   */
  public validateAgainstExistingDate(
    preFilledValue: any,
    errorMessage: WritableSignal<string | null>
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate: Date | null = getDateOrNull(control.value);
      const preFilledDate: Date | null = getDateOrNull(preFilledValue);

      if (errorMessage) {
        errorMessage.set(null);
      }

      if (!currentDate || isEqual(currentDate, preFilledDate)) {
        return null;
      }

      if (isBefore(currentDate, this.TODAY)) {
        errorMessage.set(
          translate('error.date.beforeMinEditingExistingRecord', {
            existingDate:
              this.translocoLocaleService.localizeDate(preFilledValue),
            earliestPossibleDate: this.translocoLocaleService.localizeDate(
              this.TODAY
            ),
          })
        );

        return { customDatepickerMin: true };
      }

      if (isAfter(currentDate, this.MAX_DATE)) {
        errorMessage.set(
          translate('error.date.afterMaxEditingExistingRecord', {
            existingDate:
              this.translocoLocaleService.localizeDate(preFilledValue),
            latestPossibleDate: this.translocoLocaleService.localizeDate(
              this.MAX_DATE
            ),
          })
        );

        return { customDatepickerMax: true };
      }

      return null;
    };
  }

  /**
   * Helper method to set or remove required validator
   */
  public setOrRemoveRequired(
    required: boolean,
    control: AbstractControl
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    required
      ? control?.addValidators(Validators.required)
      : control?.removeValidators(Validators.required);

    control?.updateValueAndValidity({ emitEvent: true });
  }

  private createDateRangeValidator(
    startFieldName: string,
    endFieldName: string,
    errorMessage: WritableSignal<string | null>,
    translationKey: string
  ): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const errors = ValidationHelper.getStartEndDateValidationErrors(
        formGroup as FormGroup,
        false,
        startFieldName,
        endFieldName,
        false
      );

      if (errors?.['endDate']) {
        errorMessage.set(translate(translationKey));
        const fg = formGroup as FormGroup;
        fg.get(startFieldName)?.markAsTouched();
        fg.get(endFieldName)?.markAsTouched();
      } else {
        errorMessage.set(null);
      }

      return errors;
    };
  }
}
