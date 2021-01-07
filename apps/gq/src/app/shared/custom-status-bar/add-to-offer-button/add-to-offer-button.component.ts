import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { updateQuotationDetailOffer } from '../../../core/store';
import {
  QuotationDetail,
  UpdateQuotationDetail,
} from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-add-to-offer-button',
  templateUrl: './add-to-offer-button.component.html',
  styleUrls: ['./add-to-offer-button.component.scss'],
})
export class AddToOfferButtonComponent {
  selections: QuotationDetail[] = [];

  private params: IStatusPanelParams;

  public constructor(private readonly store: Store<ProcessCaseState>) {}

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
    const quotationDetailIDs: UpdateQuotationDetail[] = this.selections.map(
      (value) => ({ gqPositionId: value.gqPositionId, addedToOffer: true })
    );
    this.store.dispatch(updateQuotationDetailOffer({ quotationDetailIDs }));
  }
}
