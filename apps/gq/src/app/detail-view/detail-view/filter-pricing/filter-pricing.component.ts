import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  getSelectedQuotationDetail,
  getSelectedQuotationDetailId,
  getUpdateLoading,
  updateQuotationDetails,
  userHasGPCRole,
  userHasManualPriceRole,
} from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import {
  QuotationDetail,
  UpdatePrice,
} from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
})
export class FilterPricingComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public gqPositionId: string;
  public customerCurrency$: Observable<string>;
  public userHasManualPriceRole$: Observable<boolean>;
  public userHasGPCRole$: Observable<boolean>;
  public selectedQuotationDetail$: Observable<QuotationDetail>;
  public updateIsLoading$: Observable<boolean>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.customerCurrency$ = this.store.pipe(select(getCustomerCurrency));
    this.selectedQuotationDetail$ = this.store.pipe(
      select(getSelectedQuotationDetail)
    );
    this.userHasManualPriceRole$ = this.store.pipe(
      select(userHasManualPriceRole)
    );
    this.userHasGPCRole$ = this.store.pipe(select(userHasGPCRole));
    this.updateIsLoading$ = this.store.pipe(select(getUpdateLoading));
    this.subscription.add(
      this.store
        .pipe(select(getSelectedQuotationDetailId))
        .subscribe((id) => (this.gqPositionId = id))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectManualPrice(updatePrice: UpdatePrice): void {
    const { price, priceSource } = updatePrice;
    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        price,
        priceSource,
        gqPositionId: this.gqPositionId,
      },
    ];
    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
}
