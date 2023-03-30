import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FreeStockCellParams } from './model/free-stock-cell-params.model';

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
