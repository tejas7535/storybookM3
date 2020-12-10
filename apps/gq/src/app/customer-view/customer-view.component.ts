import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getCustomer, getOffer, isCustomerLoading } from '../core/store';
import { Customer, QuotationDetail } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent implements OnInit {
  public offer$: Observable<QuotationDetail[]>;
  public customer$: Observable<Customer>;
  public isCustomerLoading$: Observable<boolean>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
    this.isCustomerLoading$ = this.store.pipe(select(isCustomerLoading));
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
