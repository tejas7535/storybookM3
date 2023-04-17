import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { updateQuotationDetails } from '@gq/core/store/actions';
import { UpdateQuotationDetail } from '@gq/core/store/reducers/models';
import {
  getIsQuotationActive,
  getQuotationCurrency,
  getUpdateLoading,
  userHasGPCRole,
  userHasManualPriceRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { getPriceUnit } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

import {
  QuotationDetail,
  UpdatePrice,
} from '../../../shared/models/quotation-detail';

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
    this.updateIsLoading$ = this.store.select(getUpdateLoading);
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
    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
}
