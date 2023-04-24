import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';

@Component({
  selector: 'gq-target-price',
  templateUrl: './target-price.component.html',
})
export class TargetPriceComponent {
  @Input() isDisabled: boolean;
  @Input() currency: string;

  @Input() set quotationDetail(quotationDetail: QuotationDetail) {
    this._quotationDetail = quotationDetail;

    if (quotationDetail) {
      this.gpi = calculateMargin(
        quotationDetail.targetPrice,
        quotationDetail.gpc
      );
      this.gpm = calculateMargin(
        quotationDetail.targetPrice,
        quotationDetail.sqv
      );
    }
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

  @Output() readonly targetPriceSelected = new EventEmitter<UpdatePrice>();

  PriceSource = PriceSource;
  gpi: number;
  gpm: number;

  private _quotationDetail: QuotationDetail;
  private _isLoading: boolean;

  selectTargetPrice(): void {
    this._isLoading = true;
    this.targetPriceSelected.emit(
      new UpdatePrice(
        this.quotationDetail.targetPrice,
        PriceSource.TARGET_PRICE
      )
    );
  }
}
