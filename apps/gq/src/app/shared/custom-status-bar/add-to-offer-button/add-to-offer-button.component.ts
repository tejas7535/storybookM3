import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { updateQuotationDetails } from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { QuotationDetail } from '../../models/quotation-detail';

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
    const updateQuotationDetailList: UpdateQuotationDetail[] =
      this.selections.map((value) => ({
        gqPositionId: value.gqPositionId,
        addedToOffer: true,
      }));
    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
}
