import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/core';

@Component({
  selector: 'cdba-detail-view-button',
  templateUrl: './detail-view-button.component.html',
  styleUrls: ['./detail-view-button.component.scss'],
})
export class DetailViewButtonComponent {
  selections: any[] = [];

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
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  showDetailView(): void {
    console.log('Show detail view');
  }
}
