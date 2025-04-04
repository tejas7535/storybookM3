import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { filter, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { CustomerSalesPlanShareEditModalComponent } from '../../../customer-sales-plan-share-edit-modal/customer-sales-plan-share-edit-modal.component';
import { SalesPlanningEditButtonComponent } from '../../components/sales-planning-edit-button/sales-planning-edit-button.component';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';

@Component({
  selector: 'd360-sales-planning-share-edit-cell-renderer',
  imports: [TranslocoDirective, SalesPlanningEditButtonComponent],
  templateUrl: './sales-planning-share-edit-cell-renderer.component.html',
  styleUrl: './sales-planning-share-edit-cell-renderer.component.scss',
})
export class SalesPlanningShareEditCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private reloadData: () => void;
  protected isYearlyRow: boolean;

  protected setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number>
  ): void {
    this.value = parameters.value;
    this.parameters = parameters;
    this.reloadData = parameters.context.reloadData;
    this.isYearlyRow = parameters.node.level === 0;
  }

  public handleEditShareValueClicked() {
    this.dialog
      .open(CustomerSalesPlanShareEditModalComponent, {
        data: this.parameters.data,
      })
      .afterClosed()
      .pipe(
        filter((reload) => reload),
        tap(() => this.reloadData?.()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
