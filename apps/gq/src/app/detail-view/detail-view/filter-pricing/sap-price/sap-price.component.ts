import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';

import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-sap-price',
  templateUrl: './sap-price.component.html',
})
export class SapPriceComponent {
  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() isDisabled: boolean;

  get quotationDetail(): QuotationDetail {
    return this._quotationDetail;
  }

  @Input() set quotationDetail(quotationDetail: QuotationDetail) {
    if (quotationDetail) {
      this.gpi = calculateMargin(quotationDetail.sapPrice, quotationDetail.gpc);
      this.gpm = calculateMargin(quotationDetail.sapPrice, quotationDetail.sqv);
      this.gpmRfq = calculateMargin(
        quotationDetail.sapPrice,
        quotationDetail.rfqData?.sqv
      );
      this.isSelected = [
        PriceSource.SAP_STANDARD,
        PriceSource.SAP_SPECIAL,
        PriceSource.CAP_PRICE,
      ].includes(quotationDetail.priceSource);
    }
    this._quotationDetail = quotationDetail;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  @Output() readonly selectSapPrice = new EventEmitter<UpdatePrice>();

  gpi: number;
  gpm: number;
  gpmRfq: number;
  isSelected: boolean;

  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  private _isLoading: boolean;
  private _quotationDetail: QuotationDetail;

  selectPrice(): void {
    this._isLoading = true;
    this.selectSapPrice.emit(
      new UpdatePrice(
        this.quotationDetail.sapPrice,
        this.getSapPriceSource(this.quotationDetail.sapPriceCondition)
      )
    );
  }

  public trackByFn(index: number): number {
    return index;
  }

  private getSapPriceSource(sapPriceCondition: SapPriceCondition): PriceSource {
    if (sapPriceCondition === SapPriceCondition.STANDARD) {
      return PriceSource.SAP_STANDARD;
    }
    if (sapPriceCondition === SapPriceCondition.CAP_PRICE) {
      return PriceSource.CAP_PRICE;
    }

    return PriceSource.SAP_SPECIAL;
  }
}
