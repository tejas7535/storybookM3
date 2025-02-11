import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoadCaseDataFormGroupModel } from '@ea/calculation/calculation-parameters/loadcase-data-form-group.interface';
import { ConfirmationDialogComponent } from '@ea/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@ea/shared/confirmation-dialog/confirmation-dialog-data.interface';
import { TranslocoService } from '@jsverse/transloco';

import { CalculationParametersOperationConditions } from '../store/models';

@Injectable({ providedIn: 'root' })
export class CalculationParametersFormHelperService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly dialog: MatDialog
  ) {}
  public getTotalOperatingTimeForLoadcases(
    loadcaseFormGroup: FormGroup<LoadCaseDataFormGroupModel>[]
  ): number {
    // eslint-disable-next-line unicorn/no-array-reduce
    const totalOperatingTime = loadcaseFormGroup.reduce((acc, current) => {
      const sum = current.controls.operatingTime.value
        ? acc + current.controls.operatingTime.value
        : acc;

      return sum;
    }, 0);

    return totalOperatingTime;
  }

  public getLocalizedLoadCaseName(loadCaseNumber: number): string {
    return this.translocoService.translate('operationConditions.loadCaseName', {
      number: loadCaseNumber,
    });
  }

  public openConfirmDeleteDialog(): MatDialogRef<
    ConfirmationDialogComponent,
    { apply: boolean }
  > {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: this.prepareDialogData(),
      width: '500px',
      autoFocus: false,
    });
  }

  public getLocalizedLoadCaseTimePortion(
    operatingTimeInHours: number | undefined,
    loadcasePercentage: number | undefined
  ): string {
    if (!operatingTimeInHours || !loadcasePercentage) {
      return '';
    }

    const percentageOfOperatingTime =
      (loadcasePercentage / 100) * operatingTimeInHours;

    const loadcaseTime = Math.round(percentageOfOperatingTime);

    return this.translocoService.translate(
      'operationConditions.loadCaseTimePortion',
      {
        loadcasePercentage,
        totalTime: operatingTimeInHours,
        loadcaseTime,
      }
    );
  }

  /**
   * When you enter '-' sign in empty numeric field, value is converted into null,
   * which causing change detection to be triggered, to keep using numeric input type convert desired null values with undefined,
   * to avoid detection on such instances to allow user entering negative value
   * other solution is to use inputType='text' but it will lose stepper indication and validation of the field.
   */
  public replaceNullValuesWithUndefined(
    calculationParameters: Partial<CalculationParametersOperationConditions>
  ): Partial<CalculationParametersOperationConditions> {
    const parameters: Partial<CalculationParametersOperationConditions> = {
      ...calculationParameters,
    };

    if (calculationParameters.ambientTemperature === null) {
      parameters.ambientTemperature = undefined;
    }

    parameters.loadCaseData = calculationParameters.loadCaseData.map(
      (loadcase) => {
        const newData = { ...loadcase };
        if (newData.operatingTemperature === null) {
          newData.operatingTemperature = undefined;
        }

        return newData;
      }
    );

    return parameters;
  }

  private prepareDialogData(): ConfirmationDialogData {
    return {
      title: this.getDialogTranslationForKey('title'),
      description: this.getDialogTranslationForKey('description'),
      cancelActionText: this.getDialogTranslationForKey('cancelAction'),
      confirmActionText: this.getDialogTranslationForKey('confirmationAction'),
    };
  }

  private getDialogTranslationForKey(key: string): string {
    return this.translocoService.translate(
      `operationConditions.confirmationDialog.${key}`
    );
  }
}
