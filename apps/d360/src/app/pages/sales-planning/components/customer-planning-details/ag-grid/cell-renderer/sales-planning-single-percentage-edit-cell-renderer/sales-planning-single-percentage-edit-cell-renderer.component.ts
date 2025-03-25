import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { AbstractBaseCellRendererComponent } from '../../../../../../../shared/components/ag-grid/cell-renderer/abstract-cell-renderer.component';
import { AuthService } from '../../../../../../../shared/utils/auth/auth.service';
import { salesPlanningAllowedEditRoles } from '../../../../../../../shared/utils/auth/roles';
import { CustomerSalesPlanSinglePercentageEditModalComponent } from '../../../customer-sales-plan-single-percentage-edit-modal/customer-sales-plan-single-percentage-edit-modal.component';

export enum PercentageEditOption {
  SalesDeduction = 'salesDeduction',
  CashDiscount = 'cashDiscount',
}

@Component({
  selector: 'd360-sales-planning-single-percentage-edit-cell-renderer',
  imports: [MatIcon, MatIconButton, SharedTranslocoModule, PushPipe],
  templateUrl:
    './sales-planning-single-percentage-edit-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl:
    './sales-planning-single-percentage-edit-cell-renderer.component.scss',
})
export class SalesPlanningSinglePercentageEditCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  public isUserAllowedToEdit$: Observable<boolean>;

  private readonly dialog = inject(MatDialog);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly translationKeyPrefix =
    'sales_planning.planning_details.edit_modal';

  public isYearlyRow: boolean;

  private customerNumber: string;
  private planningYear: string;
  private planningCurrency: string;
  private percentageValueName: string;
  private percentageEditOption: PercentageEditOption;

  private onReloadData: () => void;

  public valueFormatted = signal<string | null>(null);

  /**
   * @inheritdoc
   * @override
   */
  public setValue(
    parameters: ICellRendererParams<any, T> & {
      percentageValueName: string;
      percentageEditOption: PercentageEditOption;
    }
  ): void {
    this.valueFormatted.set(parameters.valueFormatted);

    this.value = parameters.value;
    this.parameters = parameters;

    this.customerNumber = parameters.data.customerNumber;
    this.percentageValueName = parameters.percentageValueName;
    this.percentageEditOption = parameters.percentageEditOption;
    this.planningYear = parameters.data.planningYear;
    this.planningCurrency = parameters.data.planningCurrency;

    this.onReloadData = parameters.context.reloadData;

    this.isYearlyRow = parameters.node.level === 0;
    this.isUserAllowedToEdit$ = this.authService.hasUserAccess(
      salesPlanningAllowedEditRoles
    );
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
