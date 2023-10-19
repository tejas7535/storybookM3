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
  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() isDisabled: boolean;
  @Input() isDetailsButtonVisible: boolean;
  @Output() readonly selectGqPrice = new EventEmitter<UpdatePrice>();

  gpi: number;
  gpm: number;
  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  private _quotationDetail: QuotationDetail;
  private _isLoading: boolean;

  get quotationDetail(): QuotationDetail {
    return this._quotationDetail;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
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

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

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
