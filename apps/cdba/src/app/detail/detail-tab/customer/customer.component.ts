import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../../../core/store/reducers/detail/detail.reducer';
import { getCustomerDetails } from '../../../core/store/selectors';
import { CustomerDetails } from './model/customer.details.model';

@Component({
  selector: 'cdba-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  public customerDetails$: Observable<CustomerDetails>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.customerDetails$ = this.store.pipe(select(getCustomerDetails));
  }
}
