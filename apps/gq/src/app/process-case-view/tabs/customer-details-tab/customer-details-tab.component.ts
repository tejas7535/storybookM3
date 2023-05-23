import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getCurrentYear, getLastYear } from '@gq/shared/utils/misc.utils';
import { Store } from '@ngrx/store';

import { Customer } from '../../../shared/models/customer';

@Component({
  selector: 'gq-customer-details-tab',
  templateUrl: './customer-details-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsTabComponent implements OnInit {
  currentYear: number;
  lastYear: number;

  customer$: Observable<Customer>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.currentYear = getCurrentYear();
    this.lastYear = getLastYear();

    this.customer$ = this.store.select(activeCaseFeature.selectCustomer);
  }
}
