import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { translate } from '@jsverse/transloco';
import { addMonths } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationFilter } from '../../../../feature/demand-validation/demand-validation-filters';
import {
  KpiDateRanges,
  SelectedKpis,
} from '../../../../feature/demand-validation/model';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
  fillGapBetweenRanges,
} from '../../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompletePreLoadedComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { toNativeDate } from '../../../../shared/utils/date-format';
import { DateRangePeriod } from '../../../../shared/utils/date-range';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { ExportDemandValidationService } from '../../services/export-demand-validation.service';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationLoadingModalComponent } from '../demand-validation-loading-modal/demand-validation-loading-modal.component';

export interface DemandValidationExportModalProps {
  customerData: CustomerEntry[];
  dateRanges: KpiDateRanges;
  demandValidationFilters: DemandValidationFilter;
}

@Component({
  selector: 'd360-demand-validation-export-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatSlideToggle,
    MatDialogModule,
    MatDivider,
    MatIcon,
    MatDialogActions,
    MatButton,
    MatFormField,
    ReactiveFormsModule,
    SingleAutocompletePreLoadedComponent,
    DemandValidationDatePickerComponent,
  ],
  templateUrl: './demand-validation-export-modal.component.html',
})
export class DemandValidationExportModalComponent {
  private readonly dialog = inject(MatDialog);

  private readonly exportDemandValidationService = inject(
    ExportDemandValidationService
  );

  protected readonly dialogRef: MatDialogRef<DemandValidationExportModalComponent> =
    inject(MatDialogRef<DemandValidationExportModalComponent>);

  protected readonly data: DemandValidationExportModalProps =
    inject(MAT_DIALOG_DATA);

  protected kpiFormGroup: FormGroup = new FormGroup({
    activeAndPredecessor: new FormControl(false),
    deliveries: new FormControl(true),
    firmBusiness: new FormControl(true),
    opportunities: new FormControl(true),
    forecastProposal: new FormControl(true),
    forecastProposalDemandPlanner: new FormControl(true),
    validatedForecast: new FormControl(true),
    indicativeDemandPlan: new FormControl(false),
    currentDemandPlan: new FormControl(true),
    confirmedDeliveries: new FormControl(false),
    confirmedFirmBusiness: new FormControl(false),
    confirmedDemandPlan: new FormControl(false),
  });

  protected periodTypeOptions = defaultPeriodTypes;

  protected dateSelectionFormGroup = new FormGroup(
    {
      startDatePeriod1: new FormControl(this.data.dateRanges.range1.from, {
        validators: [Validators.required],
      }),
      endDatePeriod1: new FormControl(this.data.dateRanges.range1.to, {
        validators: [Validators.required],
      }),
      periodType1: new FormControl<SelectableValue>(
        this.periodTypeOptions.find(
          (periodType) => periodType.id === this.data.dateRanges.range1.period
        ) && defaultMonthlyPeriodTypeOption
      ),
      startDatePeriod2: new FormControl(
        this.data.dateRanges.range2?.from ||
          addMonths(this.data.dateRanges.range1.to, 1)
      ),
      endDatePeriod2: new FormControl(this.data.dateRanges.range2?.to),
      periodType2: new FormControl<SelectableValue>(
        this.periodTypeOptions.find(
          (periodType) =>
            periodType.id === (this.data.dateRanges.range2?.period || 'MONTHLY')
        ) && defaultMonthlyPeriodTypeOption
      ),
    },
    {
      validators: [
        this.crossFieldValidator('startDatePeriod1', 'endDatePeriod1'),
        this.crossFieldValidator('startDatePeriod2', 'endDatePeriod2'),
      ],
    }
  );

  protected requestedToggleTypes = [
    'deliveries',
    'firmBusiness',
    'opportunities',
    'forecastProposal',
    'forecastProposalDemandPlanner',
    'validatedForecast',
    'currentDemandPlan',
  ];
  protected confirmedToggleTypes = [
    'confirmedDeliveries',
    'confirmedFirmBusiness',
    'confirmedDemandPlan',
  ];

  protected handleExcelExport() {
    if (this.demandValidationDatePickerHasError()) {
      return;
    }

    const selectedKpis: SelectedKpis = this.kpiFormGroup.getRawValue();

    const filledRange = fillGapBetweenRanges(
      {
        from: toNativeDate(
          this.dateSelectionFormGroup.controls.startDatePeriod1.value
        ),
        to: toNativeDate(
          this.dateSelectionFormGroup.controls.endDatePeriod1.value
        ),
        period: this.dateSelectionFormGroup.controls.periodType1.value
          .id as DateRangePeriod,
      },
      {
        from: toNativeDate(
          this.dateSelectionFormGroup.controls.startDatePeriod2.value
        ),
        to: toNativeDate(
          this.dateSelectionFormGroup.controls.endDatePeriod2.value
        ),
        period: this.dateSelectionFormGroup.controls.periodType2.value
          .id as DateRangePeriod,
      }
    );

    if (filledRange) {
      this.dialog.open(DemandValidationLoadingModalComponent, {
        data: {
          onInit: () =>
            this.triggerExport(
              selectedKpis,
              filledRange,
              this.data.demandValidationFilters
            ),
          onClose: () => this.dialogRef.close(),
          textWhileLoading: translate('material_customer.export.in_progress'),
        },
        disableClose: true,
        autoFocus: false,
      });
    }
  }

  protected triggerExport(
    selectedKpis: SelectedKpis,
    filledRange: KpiDateRanges,
    demandValidationFilters: DemandValidationFilter
  ) {
    return this.exportDemandValidationService.triggerExport(
      selectedKpis,
      filledRange,
      demandValidationFilters
    );
  }

  protected onClose() {
    this.dialogRef.close();
  }

  protected demandValidationDatePickerHasError() {
    return this.dateSelectionFormGroup.invalid;
  }

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

  /**
   * Removes the prefix "confirmed" from the input string and transforms the remaining string.
   *
   * @param {string} confirmedToggleType - The input string starting with "confirmed".
   * @returns {string} - The transformed string without the prefix.
   *
   * @example
   *
   * removeConfirmedPrefix("confirmedBusiness"); // returns "business"
   */
  protected translateConfirmedToggleType(confirmedToggleType: string): string {
    const prefix = 'confirmed';
    const withoutPrefix = confirmedToggleType.slice(prefix.length);

    // Convert the first character of the remaining string to lowercase
    const firstChar = withoutPrefix.charAt(0).toLowerCase();
    const remainingChars = withoutPrefix.slice(1);

    const translationKey = firstChar + remainingChars;

    return translate(`validation_of_demand.menu_item.${translationKey}`);
  }
}
