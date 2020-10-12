import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'gq-add-to-offer--button',
  templateUrl: './add-to-offer-button.component.html',
  styleUrls: ['./add-to-offer-button.component.scss'],
})
export class AddToOfferButtonComponent {
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

  addToOffer(): void {
    console.log('add to offer');
  }
}
