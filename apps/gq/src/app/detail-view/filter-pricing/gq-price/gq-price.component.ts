import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import { getCustomerCurrency } from '../../../core/store';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { PriceService } from '../../../shared/services/price-service/price.service';

@Component({
  selector: 'gq-price',
  templateUrl: './gq-price.component.html',
  styleUrls: ['./gq-price.component.scss'],
})
export class GqPriceComponent implements OnInit {
  public customerCurrency$: Observable<string>;

  public gpi: number;
  _isLoading: boolean;

  title$: Observable<string>;

  @Input() quotationDetail: QuotationDetail;
  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  @Output() readonly selectManualPrice = new EventEmitter<UpdatePrice>();

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly translocoService: TranslocoService
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'filterPricing.gqPrice.title',
      {},
      'detail-view'
    );
  }

  ngOnInit(): void {
    this.customerCurrency$ = this.store.pipe(select(getCustomerCurrency));
    if (this.quotationDetail) {
      this.gpi = PriceService.calculateGPI(
        this.quotationDetail.recommendedPrice,
        this.quotationDetail.gpc
      );
    }
  }

  selectPrice(): void {
    this._isLoading = true;
    const priceSource = this.quotationDetail.fixedPrice
      ? PriceSource.FIXED
      : PriceSource.GQ;
    const price =
      this.quotationDetail.fixedPrice ?? this.quotationDetail.recommendedPrice;
    const updatePrice = new UpdatePrice(price, priceSource);
    this.selectManualPrice.emit(updatePrice);
  }
}
