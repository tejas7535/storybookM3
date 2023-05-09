import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ActiveCaseActions,
  getIsQuotationActive,
  getSapId,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-upload-quote-to-sap-button',
  templateUrl: './upload-quote-to-sap-button.component.html',
})
export class UploadQuoteToSapButtonComponent {
  selections: QuotationDetail[] = [];
  uploadDisabled = true;
  sapId$: Observable<string>;
  simulationModeEnabled$: Observable<boolean>;
  quotationActive$: Observable<boolean>;

  private params: IStatusPanelParams;
  private readonly QUOTATION_POSITION_UPLOAD_LIMIT = 1000;

  constructor(private readonly store: Store) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.sapId$ = this.store.select(getSapId);
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
    this.quotationActive$ = this.store.select(getIsQuotationActive);
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    this.uploadDisabled =
      this.selections.length === 0 ||
      this.selections.length > this.QUOTATION_POSITION_UPLOAD_LIMIT;
  }

  uploadCaseToSap(): void {
    const gqPositionIds = this.selections.map(
      (item: QuotationDetail) => item.gqPositionId
    );

    this.store.dispatch(ActiveCaseActions.createSapQuote({ gqPositionIds }));
  }
}
