import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { NumberWithoutFractionDigitsPipe } from '../../../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { CustomerSalesPlanNumberAndPercentageEditModalComponent } from '../../../customer-sales-plan-number-and-percentage-edit-modal/customer-sales-plan-number-and-percentage-edit-modal.component';
import { SalesPlanningEditButtonComponent } from '../../components/sales-planning-edit-button/sales-planning-edit-button.component';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';

@Component({
  selector: 'd360-sales-planning-adjusted-total-cell-renderer',
  imports: [SharedTranslocoModule, SalesPlanningEditButtonComponent],
  templateUrl: './sales-planning-adjusted-total-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sales-planning-adjusted-total-cell-renderer.component.scss',
})
export class SalesPlanningAdjustedTotalCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  private readonly dialog = inject(MatDialog);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly numberWithoutFractionDigitsPipe = inject(
    NumberWithoutFractionDigitsPipe
  );
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationKeyPrefix =
    'sales_planning.planning_details.edit_modal';

  private isPlanningMaterialRow: boolean;

  private customerNumber: string;
  private planningYear: string;
  private planningMonth: string;
  private planningMaterial: string;
  private planningCurrency: string;
  private planningLevelMaterialType: string;
  private planningMaterialText: string;
  private minValidationValue: number;
  private onReloadData: () => void;

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number>
  ): void {
    this.value = parameters.value;
    this.isPlanningMaterialRow = parameters.node.level === 1;
    this.parameters = parameters;

    this.onReloadData = parameters.context.reloadData;

    this.customerNumber = this.parameters.data.customerNumber;
    this.planningYear = this.parameters.data.planningYear;
    this.planningMonth = this.parameters.data.planningMonth;
    this.planningMaterial = this.parameters.data.planningMaterial;
    this.planningCurrency = this.parameters.data.planningCurrency;
    this.planningLevelMaterialType =
      this.parameters.data.planningLevelMaterialType;
    this.planningMaterialText = this.parameters.data.planningMaterialText;

    this.minValidationValue =
      this.parameters.data.firmBusiness +
      this.parameters.data.firmBusinessServices +
      this.parameters.data.openPlannedValueDemand360 +
      this.parameters.data.opportunitiesDemandRelevant +
      this.parameters.data.opportunitiesForecastRelevant;
  }

  private readonly SAP_MAGIC_NUMBER_VALUE_NOT_ENTERED: number = -1;

  public handleEditCustomerSalesPlanNumberClicked() {
    this.dialog
      .open(CustomerSalesPlanNumberAndPercentageEditModalComponent, {
        data: {
          title: this.isPlanningMaterialRow
            ? this.getPlanningMaterialText()
            : this.planningYear,
          formLabel: translate(`${this.translationKeyPrefix}.yearly_total`),
          currentValueLabel: translate(
            `${this.translationKeyPrefix}.adjusted_yearly_total`
          ),
          previousValueLabel: translate(
            `${this.translationKeyPrefix}.previous_adjusted_yearly_total`
          ),
          planningCurrency: this.planningCurrency,
          previousValue:
            this.value === this.SAP_MAGIC_NUMBER_VALUE_NOT_ENTERED
              ? this.parameters.data.totalSalesPlanUnconstrained
              : this.value,
          onDelete: this.onDelete(),
          onSave: this.onSave(),
          inputValidatorFn: this.validateEnteredAdjustedYearlyTotal.bind(this),
          inputValidatorErrorMessage: translate(
            `${this.translationKeyPrefix}.adjusted_yearly_total_error_message`,
            {
              min_value: `${this.numberWithoutFractionDigitsPipe.transform(this.minValidationValue)} ${this.planningCurrency}`,
            }
          ),
        },
        autoFocus: false,
        disableClose: true,
        width: '600px',
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((newValue: number | null) => {
          if (newValue !== null) {
            this.onReloadData();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private onDelete() {
    return () =>
      this.salesPlanningService.deleteDetailedCustomerSalesPlan(
        this.customerNumber,
        this.planningYear,
        this.planningMonth,
        this.isPlanningMaterialRow ? this.planningMaterial : null
      );
  }

  private onSave() {
    return (adjustedValue: number) =>
      this.salesPlanningService.updateDetailedCustomerSalesPlan(
        this.customerNumber,
        {
          planningYear: this.planningYear,
          planningCurrency: this.planningCurrency,
          planningMonth: this.planningMonth,
          planningMaterial: this.planningMaterial,
          planningLevelMaterialType: this.planningLevelMaterialType,
          adjustedValue,
        }
      );
  }

  private validateEnteredAdjustedYearlyTotal(
    adjustedYearlyTotal: number
  ): ValidationErrors | null {
    if (adjustedYearlyTotal === null) {
      return null;
    }

    return adjustedYearlyTotal >= this.minValidationValue
      ? null
      : { invalid: true };
  }

  private getPlanningMaterialText() {
    return `${this.planningMaterial} - ${this.planningMaterialText}`;
  }

  public isEditPossible() {
    const currentYear = new Date().getFullYear();
    const yearOfDataSet = Number.parseInt(this.planningYear, 10);

    return this.isPlanningMaterialRow ? currentYear + 2 >= yearOfDataSet : true;
  }
}
