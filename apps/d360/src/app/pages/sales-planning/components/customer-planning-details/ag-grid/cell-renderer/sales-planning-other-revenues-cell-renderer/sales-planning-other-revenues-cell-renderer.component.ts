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
import { CustomerSalesPlanNumberEditModalComponent } from '../../../customer-sales-plan-number-edit-modal/customer-sales-plan-number-edit-modal.component';

@Component({
  selector: 'd360-sales-planning-other-revenues-cell-renderer',
  imports: [MatIcon, MatIconButton, SharedTranslocoModule, PushPipe],
  templateUrl: './sales-planning-other-revenues-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sales-planning-other-revenues-cell-renderer.component.scss',
})
export class SalesPlanningOtherRevenuesCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  public onClickAction: () => void;
  public isUserAllowedToEdit$: Observable<boolean>;

  private readonly dialog = inject(MatDialog);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly translationKeyPrefix =
    'sales_planning.planning_details.edit_modal';

  private customerNumber: string;
  private planningYear: string;
  private planningCurrency: string;
  private isYearlyRow: boolean;

  private onReloadData: () => void;

  protected valueFormatted = signal<string | null>(null);

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(
    parameters: ICellRendererParams<any, T> & {
      onRefresh: () => void;
    }
  ): void {
    this.valueFormatted.set(parameters.valueFormatted);

    this.value = parameters.value;
    this.isYearlyRow = parameters.node.level === 0;
    this.parameters = parameters;
    this.isUserAllowedToEdit$ = this.authService.hasUserAccess(
      salesPlanningAllowedEditRoles
    );

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
