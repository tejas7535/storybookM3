import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TranslocoDirective } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { CustomerSalesPlanShareEditModalComponent } from '../../../customer-sales-plan-share-edit-modal/customer-sales-plan-share-edit-modal.component';
import { SalesPlanningEditButtonComponent } from '../../components/sales-planning-edit-button/sales-planning-edit-button.component';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';
import { DetailedCustomerSalesPlan } from './../../../../../../../feature/sales-planning/model';

@Component({
  selector: 'd360-sales-planning-share-edit-cell-renderer',
  imports: [TranslocoDirective, SalesPlanningEditButtonComponent],
  templateUrl: './sales-planning-share-edit-cell-renderer.component.html',
  styleUrl: './sales-planning-share-edit-cell-renderer.component.scss',
})
export class SalesPlanningShareEditCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  private readonly dialog: MatDialog = inject(MatDialog);

  protected setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number>
  ): void {
    this.value = parameters.value;
  }

  public handleEditShareValueClicked() {
    this.dialog.open(CustomerSalesPlanShareEditModalComponent);
  }
}
