import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getCustomer, getOffer } from '../core/store';
import { Customer } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducers';

@Component({
  selector: 'gq-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent implements OnInit {
  offer$: any;
  customer$: Observable<Customer>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
  }
  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
