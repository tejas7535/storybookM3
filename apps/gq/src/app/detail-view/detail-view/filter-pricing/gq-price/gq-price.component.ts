import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';

import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-price',
  templateUrl: './gq-price.component.html',
})
export class GqPriceComponent {
  private _isLoading: boolean;
  private _quotationDetail: QuotationDetail;

  gpi: number;
  gpm: number;
  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() isDisabled: boolean;

  @Input() set quotationDetail(quotationDetail: QuotationDetail) {
    if (quotationDetail) {
      this.gpi = calculateMargin(
        quotationDetail.recommendedPrice,
        quotationDetail.gpc
      );
      this.gpm = calculateMargin(
        quotationDetail.recommendedPrice,
        quotationDetail.sqv
      );
    }
    this._quotationDetail = quotationDetail;
  }

  get quotationDetail(): QuotationDetail {
    return this._quotationDetail;
  }

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Output() readonly selectGqPrice = new EventEmitter<UpdatePrice>();

  selectPrice(): void {
    this._isLoading = true;
    const priceSource = this.quotationDetail.strategicPrice
      ? PriceSource.STRATEGIC
      : PriceSource.GQ;
    const price =
      this.quotationDetail.strategicPrice ??
      this.quotationDetail.recommendedPrice;
    this.selectGqPrice.emit(new UpdatePrice(price, priceSource));
  }

  public trackByFn(index: number): number {
    return index;
  }
}
