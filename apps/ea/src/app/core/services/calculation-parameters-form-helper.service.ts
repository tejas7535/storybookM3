import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoadCaseDataFormGroupModel } from '@ea/calculation/calculation-parameters/loadcase-data-form-group.interface';
import { ConfirmationDialogComponent } from '@ea/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@ea/shared/confirmation-dialog/confirmation-dialog-data.interface';
import { TranslocoService } from '@jsverse/transloco';

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
