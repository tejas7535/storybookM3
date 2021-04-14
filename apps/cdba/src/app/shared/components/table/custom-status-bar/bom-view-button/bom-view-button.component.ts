import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'cdba-bom-view-button',
  templateUrl: './bom-view-button.component.html',
  styleUrls: ['./bom-view-button.component.scss'],
})
export class BomViewButtonComponent {
  selections: any[] = [];

  private params: IStatusPanelParams;
  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'customSetSelection',
      this.onCustomSetSelection.bind(this)
    );
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onCustomSetSelection(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }
}
