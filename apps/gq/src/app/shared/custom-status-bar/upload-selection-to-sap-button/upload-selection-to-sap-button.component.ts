import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { getSapId, uploadSelectionToSap } from '../../../core/store';
import { QuotationDetail } from '../../models/quotation-detail';

@Component({
  selector: 'gq-selection-to-sap',
  templateUrl: './upload-selection-to-sap-button.component.html',
})
export class UploadSelectionToSapButtonComponent {
  public sapId$: Observable<string>;
  public selections: any[] = [];
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

  constructor(private readonly store: Store) {
    this.sapId$ = this.store.select(getSapId);
  }

  uploadSelectionToSap(): void {
    const gqPositionIds = this.selections.map(
      (val: QuotationDetail) => val.gqPositionId
    );

    this.store.dispatch(uploadSelectionToSap({ gqPositionIds }));
  }
}
