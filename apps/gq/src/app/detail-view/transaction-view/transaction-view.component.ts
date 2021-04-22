import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  getGqPriceOfSelectedQuotationDetail,
} from '../../core/store';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent implements OnInit {
  gqPrice$: Observable<number>;
  currency$: Observable<string>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.gqPrice$ = this.store.select(getGqPriceOfSelectedQuotationDetail);
    this.currency$ = this.store.select(getCustomerCurrency);
  }
}
