import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getCustomerCurrency } from '../../../core/store';
import { QuotationDetail } from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
})
export class PricingDetailsComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;
  customerCurrency$: Observable<string>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.customerCurrency$ = this.store.select(getCustomerCurrency);
  }
}
