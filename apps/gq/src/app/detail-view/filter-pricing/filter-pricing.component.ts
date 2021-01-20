import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import { AppState } from '../../core/store';
import { UserRoles } from '../../shared/roles/user-roles.enum';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
  styleUrls: ['./filter-pricing.component.scss'],
})
export class FilterPricingComponent implements OnInit {
  public manualPricePermission$: Observable<boolean>;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.manualPricePermission$ = this.store.pipe(
      select(getRoles),
      map((roles) => roles.includes(UserRoles.MANUAL_PRICE_ROLE))
    );
  }
}
