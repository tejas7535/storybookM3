import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { removeQuotationDetailFromOffer } from '../../../core/store/actions';
import {
  QuotationDetail,
  UpdateQuotationDetail,
} from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-remove-from-offer',
  templateUrl: './remove-from-offer-button.component.html',
  styleUrls: ['./remove-from-offer-button.component.scss'],
})
export class RemoveFromOfferButtonComponent {
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

  removeFromOffer(): void {
    const quotationDetailIDs: UpdateQuotationDetail[] = this.selections.map(
      (value) => ({ gqPositionId: value.gqPositionId, addedToOffer: false })
    );
    this.store.dispatch(removeQuotationDetailFromOffer({ quotationDetailIDs }));
  }
}
