import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getIsQuotationActive,
  getQuotationCurrency,
  getUpdateLoading,
  updateQuotationDetails,
  userHasGPCRole,
  userHasManualPriceRole,
  userHasSQVRole,
} from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
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
    const { priceUnit } = this.quotationDetail.material;

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
