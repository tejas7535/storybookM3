import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import {
  createSapQuote,
  getSapId,
  getSimulationModeEnabled,
} from '../../../../core/store';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-upload-quote-to-sap-button',
  templateUrl: './upload-quote-to-sap-button.component.html',
})
export class UploadQuoteToSapButtonComponent {
  public selections: QuotationDetail[] = [];
  public uploadDisabled = true;
  public sapId$: Observable<string>;
  public simulationModeEnabled$: Observable<boolean>;

  private readonly QUOTATION_POSITION_UPLOAD_LIMIT = 50;
  private params: IStatusPanelParams;

  constructor(private readonly store: Store) {}

  public agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.sapId$ = this.store.select(getSapId);
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }

  public onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    this.uploadDisabled =
      this.selections.length === 0 ||
      this.selections.length > this.QUOTATION_POSITION_UPLOAD_LIMIT;
  }

  public uploadCaseToSap(): void {
    const gqPositionIds = this.selections.map(
      (item: QuotationDetail) => item.gqPositionId
    );

    this.store.dispatch(createSapQuote({ gqPositionIds }));
  }
}
