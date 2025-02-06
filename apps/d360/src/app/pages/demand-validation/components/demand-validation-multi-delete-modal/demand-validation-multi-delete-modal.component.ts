import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { catchError, EMPTY, switchMap, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import {
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  formatISO,
  FormatISOOptions,
  startOfMonth,
  startOfWeek,
  StartOfWeekOptions,
} from 'date-fns';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { firstEditableDate } from '../../../../feature/demand-validation/limits';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
} from '../../../../feature/demand-validation/time-range';
import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { OnTypeAutocompleteWithMultiselectComponent } from '../../../../shared/components/global-selection-criteria/on-type-autocomplete-with-multiselect/on-type-autocomplete-with-multiselect.component';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../../shared/components/inputs/display-functions.utils';
import { toNativeDate } from '../../../../shared/utils/date-format';
import { DateRangePeriod } from '../../../../shared/utils/date-range';
import { errorsFromSAPtoMessage } from '../../../../shared/utils/error-handling';
import { getErrorMessage } from '../../../../shared/utils/errors';
import { SnackbarService } from '../../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationLoadingModalComponent } from '../demand-validation-loading-modal/demand-validation-loading-modal.component';

export interface DemandValidationMultiDeleteModalProps {
  customerName: string;
  customerNumber: string;
  onSave: () => void;
}

@Component({
  selector: 'd360-demand-validation-multi-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButton,
    DemandValidationDatePickerComponent,
    SharedTranslocoModule,
    OnTypeAutocompleteWithMultiselectComponent,
    LoadingSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './demand-validation-multi-delete-modal.component.html',
})
export class DemandValidationMultiDeleteModalComponent {
  protected readonly data: DemandValidationMultiDeleteModalProps =
    inject(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(
    MatDialogRef<DemandValidationMultiDeleteModalComponent>
  );

  private readonly dialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);
  private readonly demandValidationService = inject(DemandValidationService);

  private readonly startOfLastMonthOfNextYear = startOfMonth(
    endOfYear(addYears(new Date(), 1))
  );

  protected readonly globalSelectionHelperService = inject(
    GlobalSelectionHelperService
  );

  protected readonly periodTypeOptions = defaultPeriodTypes;

  protected readonly formGroup = new FormGroup(
    {
      materialNumbers: new FormControl<SelectableValue[]>([]),
      startDate: new FormControl<Date>(new Date(), Validators.required),
      endDate: new FormControl<Date>(
        this.startOfLastMonthOfNextYear,
        Validators.required
      ),
      periodType: new FormControl<SelectableValue>(
        defaultMonthlyPeriodTypeOption
      ),
    },
    {
      validators: [this.crossFieldValidator('startDate', 'endDate')],
    }
  );

  protected readonly firstEditableDate = firstEditableDate(
    (this.formGroup.controls.periodType.getRawValue()?.id as DateRangePeriod) ||
      'MONTHLY'
  );

  protected readonly DisplayFunctions = DisplayFunctions;

  protected isFormInvalid() {
    return this.formGroup.invalid;
  }

  private readonly destroyRef = inject(DestroyRef);

  private crossFieldValidator(
    startDateControlName: string,
    endDateControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl) =>
      ValidationHelper.getStartEndDateValidationErrors(
        formGroup as FormGroup,
        true,
        startDateControlName,
        endDateControlName
      );
  }

  protected onClose() {
    this.dialogRef.close();
  }

  protected deleteOnConfirmation() {
    if (
      this.formGroup.invalid ||
      this.formGroup.controls.materialNumbers.getRawValue().length === 0
    ) {
      this.snackbarService.openSnackBar(
        translate('validation_of_demand.deletion_modal.selection_not_complete')
      );

      return;
    }

    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          description: translate(
            'validation_of_demand.deletion_modal.confirm_deletion'
          ),
        },
        disableClose: true,
        autoFocus: false,
        width: '600px',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((wasConfirmed: boolean) => {
          if (!wasConfirmed) {
            return EMPTY;
          }

          return this.dialog
            .open(DemandValidationLoadingModalComponent, {
              data: {
                onInit: () => this.deleteDemandBatch(),
              },
              disableClose: true,
              autoFocus: false,
            })
            .afterClosed();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected deleteDemandBatch() {
    const selectedPeriodType = this.formGroup.controls.periodType.getRawValue()
      .id as DateRangePeriod;

    const startDate = toNativeDate(
      this.formGroup.controls.startDate.getRawValue()
    );
    const endDate = toNativeDate(this.formGroup.controls.endDate.getRawValue());
    const materialNumbers = this.formGroup.controls.materialNumbers
      .getRawValue()
      .map((value) => value.id);

    const isWeekly = selectedPeriodType === 'WEEKLY';
    const weekOptions = { weekStartsOn: 1 } as StartOfWeekOptions;
    const formatOptions = { representation: 'date' } as FormatISOOptions;

    const fromDate = isWeekly
      ? formatISO(startOfWeek(startDate, weekOptions), formatOptions)
      : formatISO(startOfMonth(startDate), formatOptions);

    const toDate = isWeekly
      ? formatISO(endOfWeek(endDate, weekOptions), formatOptions)
      : formatISO(endOfMonth(endDate), formatOptions);

    const dryRun = false;

    return this.demandValidationService
      .deleteValidatedDemandBatch(
        {
          customerNumber: this.data.customerNumber,
          materialNumbers,
          fromDate,
          toDate,
        },
        dryRun
      )
      .pipe(
        tap((result) => {
          if (result.result.messageType === 'ERROR') {
            throw new Error(errorsFromSAPtoMessage(result.result));
          }
        }),
        tap((result) => {
          const materialsWithError = result.results.filter(
            (res) => res.result.messageType === 'ERROR'
          );

          if (materialsWithError.length > 0) {
            const errorMessagesToDisplay: string[] = [];
            materialsWithError.forEach((entry) => {
              errorMessagesToDisplay.push(
                `${entry.materialNumber}: ${errorsFromSAPtoMessage(entry.result)}`
              );
            });

            this.snackbarService.openSnackBar(
              errorMessagesToDisplay.join('\n')
            );
          } else {
            this.snackbarService.openSnackBar(
              translate('validation_of_demand.deletion_modal.deletion_success')
            );

            this.data.onSave();
            this.onClose();
          }
        }),
        catchError((e) => {
          this.snackbarService.openSnackBar(getErrorMessage(e));

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
