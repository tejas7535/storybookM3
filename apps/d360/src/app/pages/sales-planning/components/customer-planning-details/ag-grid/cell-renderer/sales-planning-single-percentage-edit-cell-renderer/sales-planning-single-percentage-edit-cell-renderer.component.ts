import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { CustomerSalesPlanSinglePercentageEditModalComponent } from '../../../customer-sales-plan-single-percentage-edit-modal/customer-sales-plan-single-percentage-edit-modal.component';
import { SalesPlanningEditButtonComponent } from '../../components/sales-planning-edit-button/sales-planning-edit-button.component';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';

export enum PercentageEditOption {
  SalesDeduction = 'salesDeduction',
  CashDiscount = 'cashDiscount',
}

@Component({
  selector: 'd360-sales-planning-single-percentage-edit-cell-renderer',
  imports: [SharedTranslocoModule, SalesPlanningEditButtonComponent],
  templateUrl:
    './sales-planning-single-percentage-edit-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl:
    './sales-planning-single-percentage-edit-cell-renderer.component.scss',
})
export class SalesPlanningSinglePercentageEditCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  private readonly dialog = inject(MatDialog);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationKeyPrefix =
    'sales_planning.planning_details.edit_modal';

  public isYearlyRow: boolean;

  private customerNumber: string;
  private planningYear: string;
  private planningCurrency: string;
  private percentageValueName: string;
  private percentageEditOption: PercentageEditOption;

  private onReloadData: () => void;

  /**
   * @inheritdoc
   * @override
   */
  public setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number> & {
      percentageValueName: string;
      percentageEditOption: PercentageEditOption;
    }
  ): void {
    this.value = parameters.value;
    this.parameters = parameters;

    this.customerNumber = parameters.data.customerNumber;
    this.percentageValueName = parameters.percentageValueName;
    this.percentageEditOption = parameters.percentageEditOption;
    this.planningYear = parameters.data.planningYear;
    this.planningCurrency = parameters.data.planningCurrency;

    this.onReloadData = parameters.context.reloadData;

    this.isYearlyRow = parameters.node.level === 0;
  }

  public handleEditSinglePercentageValueClicked() {
    this.dialog
      .open(CustomerSalesPlanSinglePercentageEditModalComponent, {
        data: {
          title: `${this.percentageValueName} ${translate('sales_planning.planning_details.edit_modal.for')} ${this.planningYear}`,
          formLabel: this.percentageValueName,
          currentValueLabel: translate(
            `${this.translationKeyPrefix}.${this.percentageEditOption}`
          ),
          previousValueLabel: translate(
            `${this.translationKeyPrefix}.previous_${this.percentageEditOption}`
          ),
          previousValue: this.valueFormatted(),
          referenceValueLabel: translate(
            `${this.translationKeyPrefix}.daily_rolling_sales_plan`
          ),
          previousReferenceValueLabel: translate(
            `${this.translationKeyPrefix}.previous_daily_rolling_sales_plan`
          ),
          referenceValue: this.parameters.data.totalSalesPlanUnconstrained,
          previousReferenceValue: this.parameters.data.salesPlanUnconstrained,
          planningCurrency: this.planningCurrency,
          onDelete: this.onDelete(),
          onSave: this.onSave(),
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
    return () => this.updateAdjustedPercentage(0);
  }

  private onSave() {
    return (adjustedPercentage: number) =>
      this.updateAdjustedPercentage(adjustedPercentage);
  }

  private updateAdjustedPercentage(
    adjustedPercentage: number
  ): Observable<void> {
    return this.percentageEditOption === PercentageEditOption.SalesDeduction
      ? this.salesPlanningService.updateSalesDeductions(
          this.customerNumber,
          this.planningYear,
          adjustedPercentage
        )
      : this.salesPlanningService.updateCashDiscounts(
          this.customerNumber,
          this.planningYear,
          adjustedPercentage
        );
  }
}
