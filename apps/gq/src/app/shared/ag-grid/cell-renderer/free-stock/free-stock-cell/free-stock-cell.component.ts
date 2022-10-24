import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

export type FreeStockCellParams = ICellRendererParams & {
  uom: string;
};

@Component({
  selector: 'gq-free-stock-cell',
  templateUrl: './free-stock-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeStockCellComponent {
  params: FreeStockCellParams;

  agInit(params: FreeStockCellParams): void {
    this.params = params;
  }
}
