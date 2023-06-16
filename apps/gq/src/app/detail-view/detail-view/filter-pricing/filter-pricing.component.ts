import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ActiveCaseActions,
  activeCaseFeature,
  getIsQuotationActive,
  getQuotationCurrency,
  UpdateQuotationDetail,
} from '@gq/core/store/active-case';
import {
  userHasGPCRole,
  userHasManualPriceRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { UpdatePrice } from '@gq/shared/models/quotation-detail';
import { getPriceUnit } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
})
export class FilterPricingComponent implements OnInit {
  public quotationCurrency$: Observable<string>;
  public userHasManualPriceRole$: Observable<boolean>;
  public userHasGPCRole$: Observable<boolean>;
  public userHasSQVRole$: Observable<boolean>;
  public updateIsLoading$: Observable<boolean>;
  public quotationIsActive$: Observable<boolean>;

  @Input() quotationDetail: QuotationDetail;

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.userHasManualPriceRole$ = this.store.pipe(userHasManualPriceRole);
    this.userHasGPCRole$ = this.store.pipe(userHasGPCRole);
    this.userHasSQVRole$ = this.store.pipe(userHasSQVRole);
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
