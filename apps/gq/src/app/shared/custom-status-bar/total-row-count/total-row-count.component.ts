import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'gq-total-row-count',
  templateUrl: './total-row-count.component.html',
})
export class TotalRowCountComponent {
  totalRowCount: number;
  selectedRowCount = 0;
  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onGridReady(): void {
    this.totalRowCount = this.params.api.getDisplayedRowCount();
  }
  onSelectionChange(): void {
    this.selectedRowCount = this.params.api.getSelectedRows().length;
  }
}
