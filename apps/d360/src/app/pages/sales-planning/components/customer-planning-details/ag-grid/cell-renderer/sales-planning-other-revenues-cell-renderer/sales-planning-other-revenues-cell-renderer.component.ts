import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { CustomerSalesPlanNumberEditModalComponent } from '../../../customer-sales-plan-number-edit-modal/customer-sales-plan-number-edit-modal.component';
import { SalesPlanningEditButtonComponent } from '../../components/sales-planning-edit-button/sales-planning-edit-button.component';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';

@Component({
  selector: 'd360-sales-planning-other-revenues-cell-renderer',
  imports: [SharedTranslocoModule, SalesPlanningEditButtonComponent],
  templateUrl: './sales-planning-other-revenues-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sales-planning-other-revenues-cell-renderer.component.scss',
})
export class SalesPlanningOtherRevenuesCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  public onClickAction: () => void;

  private readonly dialog = inject(MatDialog);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationKeyPrefix =
    'sales_planning.planning_details.edit_modal';

  private customerNumber: string;
  private planningYear: string;
  private planningCurrency: string;
  private isYearlyRow: boolean;

  private onReloadData: () => void;

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number> & {
      onRefresh: () => void;
    }
  ): void {
    this.value = parameters.value;
    this.isYearlyRow = parameters.node.level === 0;
    this.parameters = parameters;

    this.customerNumber = parameters.data.customerNumber;
    this.planningYear = parameters.data.planningYear;
    this.planningCurrency = parameters.data.planningCurrency;

    this.onReloadData = parameters.context.reloadData;
  }

  public handleEditOtherRevenuesClicked() {
    this.dialog
      .open(CustomerSalesPlanNumberEditModalComponent, {
        data: {
          title: `${translate(`${this.translationKeyPrefix}.otherRevenues`)} ${translate('sales_planning.planning_details.edit_modal.for')} ${this.planningYear}`,
          formLabel: translate(`${this.translationKeyPrefix}.otherRevenues`),
          currentValueLabel: translate(
            `${this.translationKeyPrefix}.otherRevenues`
          ),
          previousValueLabel: translate(
            `${this.translationKeyPrefix}.previous_otherRevenues`
          ),
          planningCurrency: this.planningCurrency,
          previousValue: this.value,
          referenceValueLabel: translate(
            `${this.translationKeyPrefix}.daily_rolling_sales_plan`
          ),
          previousReferenceValueLabel: translate(
            `${this.translationKeyPrefix}.previous_daily_rolling_sales_plan`
          ),
          referenceValue: this.parameters.data.totalSalesPlanUnconstrained,
          previousReferenceValue: this.parameters.data.salesPlanUnconstrained,
          onDelete: this.onDelete(),
          onSave: this.onSave(),
          calculateReferenceValue: this.calculateReferenceValue(),
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
      this.salesPlanningService.updateOtherRevenues(
        this.customerNumber,
        this.planningYear,
        this.planningCurrency,
        0
      );
  }

  private onSave() {
    return (adjustedValue: number) =>
      this.salesPlanningService.updateOtherRevenues(
        this.customerNumber,
        this.planningYear,
        this.planningCurrency,
        adjustedValue
      );
  }

  public isEditPossible(): boolean {
    return this.isYearlyRow;
  }

  private calculateReferenceValue() {
    return (newValue: number) =>
      this.parameters.data.totalSalesPlanUnconstrained *
        ((100 -
          this.parameters.data.cashDiscount -
          this.parameters.data.salesDeduction) /
          100) +
      newValue;
  }
}
