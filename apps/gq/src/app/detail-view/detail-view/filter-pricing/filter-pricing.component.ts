import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ActiveCaseActions,
  activeCaseFeature,
  getIsQuotationActive,
  getQuotationCurrency,
  UpdateQuotationDetail,
} from '@gq/core/store/active-case';
import { RolesFacade } from '@gq/core/store/facades';
import {
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { getPriceUnit } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
})
export class FilterPricingComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;

  public quotationCurrency$: Observable<string>;
  public updateIsLoading$: Observable<boolean>;
  public quotationIsActive$: Observable<boolean>;

  constructor(
    public readonly rolesFacade: RolesFacade,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.updateIsLoading$ = this.store.select(
      activeCaseFeature.selectUpdateLoading
    );
    this.quotationIsActive$ = this.store.select(getIsQuotationActive);
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
