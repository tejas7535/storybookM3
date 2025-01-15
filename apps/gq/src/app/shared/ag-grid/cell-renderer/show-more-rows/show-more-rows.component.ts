import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'gq-show-more-rows',
  templateUrl: './show-more-rows.component.html',
})
export class ShowMoreRowsComponent {
  value: string;
  params: ICellRendererParams;
  amountToAdd: number;

  agInit(params: ICellRendererParams & { amountToAdd: number }): void {
    this.params = params;
    this.value = params.data?.parentMaterialDescription;
    this.amountToAdd = params.amountToAdd;
  }

  clickShowMoreRows(event: MouseEvent): void {
    event.preventDefault();
    this.params.context.componentParent.showMoreRowsClicked(this.value);
  }
}
