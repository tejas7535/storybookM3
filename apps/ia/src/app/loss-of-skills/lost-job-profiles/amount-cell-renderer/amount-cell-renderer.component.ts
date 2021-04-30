import { Component } from '@angular/core';

import { ICellRendererParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'ia-amount-cell-renderer',
  templateUrl: './amount-cell-renderer.component.html',
})
export class AmountCellRendererComponent {
  public amount: number;
  agInit(params: ICellRendererParams): void {
    this.amount = params.value;
  }
}
