import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getCustomer } from '../../../core/store';
import { Customer } from '../../../shared/models/customer';
import { HelperService } from '../../../shared/services/helper-service/helper-service.service';

@Component({
  selector: 'gq-customer-details-tab',
  templateUrl: './customer-details-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsTabComponent implements OnInit {
  public currentYear: number;
  public lastYear: number;

  customer$: Observable<Customer>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.currentYear = HelperService.getCurrentYear();
    this.lastYear = HelperService.getLastYear();

    this.customer$ = this.store.select(getCustomer);
  }
}
