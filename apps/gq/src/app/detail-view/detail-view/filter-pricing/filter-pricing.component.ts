import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getIsQuotationStatusActive,
  getQuotationCurrency,
} from '@gq/core/store/active-case/active-case.selectors';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { RolesFacade } from '@gq/core/store/facades';
import {
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { isFNumber } from '@gq/shared/utils/f-pricing.utils';
import { getPriceUnit } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
})
export class FilterPricingComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;

  readonly #isFNumber: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public quotationCurrency$: Observable<string>;
  public updateIsLoading$: Observable<boolean>;
  public quotationIsActive$: Observable<boolean>;
  public isDetailsLinkVisible$: Observable<boolean> = combineLatest([
    this.rolesFacade.userHasAccessToComparableTransactions$,
    this.#isFNumber,
  ]).pipe(
    map(
      ([hasAccess, isFNumberValue]) =>
        hasAccess && !isFNumberValue && !this.quotationDetail?.strategicPrice
    )
  );

  constructor(
    public readonly rolesFacade: RolesFacade,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.updateIsLoading$ = this.store.select(
      activeCaseFeature.selectUpdateLoading
    );
    this.quotationIsActive$ = this.store.select(getIsQuotationStatusActive);
    this.#isFNumber.next(isFNumber(this.quotationDetail));
  }

  selectPrice(updatePrice: UpdatePrice): void {
    const { priceSource } = updatePrice;

    const priceUnit = getPriceUnit(this.quotationDetail);
    const price = updatePrice.price / priceUnit;

    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        price,
        priceSource,
        gqPositionId: this.quotationDetail.gqPositionId,
      },
    ];
    this.store.dispatch(
      ActiveCaseActions.updateQuotationDetails({ updateQuotationDetailList })
    );
  }
}
