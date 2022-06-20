import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getMaterialComparableCostsLoading,
  getMaterialSalesOrgLoading,
  getQuotationCurrency,
} from '../../../core/store';
import { QuotationDetail } from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
})
export class PricingDetailsComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;
  quotationCurrency$: Observable<string>;
  materialComparableCostsLoading$: Observable<boolean>;
  materialSalesOrgLoading$: Observable<boolean>;
  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.materialComparableCostsLoading$ = this.store.select(
      getMaterialComparableCostsLoading
    );
    this.materialSalesOrgLoading$ = this.store.select(
      getMaterialSalesOrgLoading
    );
  }
}
