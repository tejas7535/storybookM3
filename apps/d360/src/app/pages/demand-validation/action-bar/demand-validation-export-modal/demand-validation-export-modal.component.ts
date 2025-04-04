import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
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
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { translate } from '@jsverse/transloco';
import { addMonths } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { DemandValidationFilter } from '../../../../feature/demand-validation/demand-validation-filters';
import {
  KpiDateRanges,
  KpiType,
  SelectedKpis,
} from '../../../../feature/demand-validation/model';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
  fillGapBetweenRanges,
} from '../../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { toNativeDate } from '../../../../shared/utils/date-format';
import {
  DateRangePeriod,
  DateRangePeriodType,
} from '../../../../shared/utils/date-range';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationLoadingModalComponent } from '../demand-validation-loading-modal/demand-validation-loading-modal.component';

export interface DemandValidationExportModalProps {
  customerData: CustomerEntry[];
  dateRanges: KpiDateRanges;
  demandValidationFilters: DemandValidationFilter;
}

@Component({
  selector: 'd360-demand-validation-export-modal',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatSlideToggle,
    MatDialogModule,
    MatDivider,
    MatDialogActions,
    MatButton,
    ReactiveFormsModule,
    DemandValidationDatePickerComponent,
  ],
  templateUrl: './demand-validation-export-modal.component.html',
})
export class DemandValidationExportModalComponent {
  private readonly dialog = inject(MatDialog);

  private readonly demandValidationService = inject(DemandValidationService);

  protected readonly dialogRef: MatDialogRef<DemandValidationExportModalComponent> =
    inject(MatDialogRef<DemandValidationExportModalComponent>);

  protected readonly data: DemandValidationExportModalProps =
    inject(MAT_DIALOG_DATA);

  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  protected kpiFormGroup: FormGroup = this.formBuilder.group<SelectedKpis>({
    [KpiType.ActiveAndPredecessor]: false,
    [KpiType.Deliveries]: true,
    [KpiType.FirmBusiness]: true,
    [KpiType.Opportunities]: true,
    [KpiType.ForecastProposal]: true,
    [KpiType.ForecastProposalDemandPlanner]: true,
    [KpiType.ValidatedForecast]: true,
    [KpiType.DemandRelevantSales]: true,
    [KpiType.OnTopOrder]: true,
    [KpiType.OnTopCapacityForecast]: true,
    [KpiType.SalesAmbition]: true,
    [KpiType.SalesPlan]: true,
    [KpiType.ConfirmedDeliveries]: false,
    [KpiType.ConfirmedFirmBusiness]: false,
    [KpiType.ConfirmedDemandRelevantSales]: false,
    [KpiType.ConfirmedOnTopOrder]: false,
    [KpiType.ConfirmedOnTopCapacityForecast]: false,
    [KpiType.ConfirmedSalesAmbition]: false,
    [KpiType.ConfirmedSalesPlan]: false,
    [KpiType.ConfirmedOpportunities]: false,
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
            periodType.id ===
            (this.data.dateRanges.range2?.period || DateRangePeriod.Monthly)
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

  protected requestedToggleTypes: KpiType[] = [
    KpiType.Deliveries,
    KpiType.FirmBusiness,
    KpiType.ForecastProposal,
    KpiType.ForecastProposalDemandPlanner,
    KpiType.ValidatedForecast,
    KpiType.DemandRelevantSales,
    KpiType.OnTopOrder,
    KpiType.OnTopCapacityForecast,
    KpiType.SalesAmbition,
    KpiType.Opportunities,
    KpiType.SalesPlan,
  ];
  protected confirmedToggleTypes: KpiType[] = [
    KpiType.ConfirmedDeliveries,
    KpiType.ConfirmedFirmBusiness,
    KpiType.ConfirmedDemandRelevantSales,
    KpiType.ConfirmedOnTopOrder,
    KpiType.ConfirmedOnTopCapacityForecast,
    KpiType.ConfirmedSalesAmbition,
    KpiType.ConfirmedOpportunities,
    KpiType.ConfirmedSalesPlan,
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
          .id as DateRangePeriodType,
      },
      {
        from: toNativeDate(
          this.dateSelectionFormGroup.controls.startDatePeriod2.value
        ),
        to: toNativeDate(
          this.dateSelectionFormGroup.controls.endDatePeriod2.value
        ),
        period: this.dateSelectionFormGroup.controls.periodType2.value
          .id as DateRangePeriodType,
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
    return this.demandValidationService.triggerExport(
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
