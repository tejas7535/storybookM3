import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { TranslocoDirective } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';

@Component({
  selector: 'd360-sales-planning-sync-cell-renderer',
  imports: [MatIcon, MatTooltip, TranslocoDirective],
  templateUrl: './sales-planning-sync-cell-renderer.component.html',
})
export class SalesPlanningSyncCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  protected infoIcon: string;
  protected setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number>
  ): void {
    this.infoIcon = parameters.data?.infoIcon;
  }
}
