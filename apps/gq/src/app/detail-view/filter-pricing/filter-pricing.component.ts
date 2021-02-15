import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import {
  getSelectedQuotationDetail,
  getSelectedQuotationDetailId,
  updateQuotationDetails,
} from '../../core/store';
import {
  QuotationDetail,
  UpdateQuotationDetail,
} from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { UserRoles } from '../../shared/roles/user-roles.enum';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
  styleUrls: ['./filter-pricing.component.scss'],
})
export class FilterPricingComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public gqPositionId: string;
  public manualPricePermission$: Observable<boolean>;
  public selectedQuotationDetail$: Observable<QuotationDetail>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.selectedQuotationDetail$ = this.store.pipe(
      select(getSelectedQuotationDetail)
    );
    this.manualPricePermission$ = this.store.pipe(
      select(getRoles),
      map((roles) => roles.includes(UserRoles.MANUAL_PRICE))
    );

    this.subscription.add(
      this.store
        .pipe(select(getSelectedQuotationDetailId))
        .subscribe((id) => (this.gqPositionId = id))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectManualPrice(price: number): void {
    const quotationDetailIDs: UpdateQuotationDetail[] = [
      {
        price,
        gqPositionId: this.gqPositionId,
      },
    ];
    this.store.dispatch(updateQuotationDetails({ quotationDetailIDs }));
  }
}
