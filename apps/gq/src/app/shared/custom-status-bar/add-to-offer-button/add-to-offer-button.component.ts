import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { addQuotationDetailToOffer } from '../../../core/store';
import { QuotationDetail } from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducers';

@Component({
  selector: 'gq-add-to-offer--button',
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
    const quotationDetailIDs = this.selections.map(
      (value) => value.gqPositionId
    );
    this.store.dispatch(addQuotationDetailToOffer({ quotationDetailIDs }));
  }
}
