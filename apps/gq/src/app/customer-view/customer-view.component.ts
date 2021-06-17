import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getCustomer, isCustomerLoading } from '../core/store';
import { Customer } from '../shared/models/customer';

@Component({
  selector: 'gq-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent implements OnInit {
  public customer$: Observable<Customer>;
  public isCustomerLoading$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.customer$ = this.store.select(getCustomer);
    this.isCustomerLoading$ = this.store.select(isCustomerLoading);
  }
}
