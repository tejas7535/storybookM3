import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { IStatusPanelParams, RowNode } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  userHasGPCRole,
  userHasSQVRole,
} from '../../../core/store';
import { QuotationDetail } from '../../models/quotation-detail';
import { PriceService } from '../../services/price-service/price.service';

@Component({
  selector: 'gq-quotation-details-status',
  templateUrl: './quotation-details-status.component.html',
})
export class QuotationDetailsStatusComponent implements OnInit {
  showGPI$: Observable<boolean>;
  showGPM$: Observable<boolean>;
  customerCurrency$: Observable<string>;
  totalNetValue = 0;
  totalAverageGPI = 0;
  totalAverageGPM = 0;
  selectedNetValue = 0;
  selectedAverageGPI = 0;
  selectedAverageGPM = 0;
  selections: QuotationDetail[] = [];
  private params: IStatusPanelParams;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.showGPI$ = this.store.select(userHasGPCRole);
    this.showGPM$ = this.store.select(userHasSQVRole);

    this.customerCurrency$ = this.store.select(getCustomerCurrency);
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'rowDataChanged',
      this.rowValueChanges.bind(this)
    );
  }

  rowValueChanges(): void {
    this.onSelectionChange();

    const details: QuotationDetail[] = [];
    this.params.api.forEachNode((row: RowNode) => details.push(row.data));
    const allRows = PriceService.calculateStatusBarValues(details);
    this.totalNetValue = allRows.totalNetValue;
    this.totalAverageGPI = allRows.totalWeightedGPI;
    this.totalAverageGPM = allRows.totalWeightedGPM;
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    const selectedDetails = PriceService.calculateStatusBarValues(
      this.selections
    );

    this.selectedNetValue = selectedDetails.totalNetValue;
    this.selectedAverageGPI = selectedDetails.totalWeightedGPI;
    this.selectedAverageGPM = selectedDetails.totalWeightedGPM;
  }
}
