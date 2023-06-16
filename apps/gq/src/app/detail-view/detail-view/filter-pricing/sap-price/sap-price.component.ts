import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PriceSource } from '@gq/shared/models/quotation-detail';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { SapPriceCondition } from '@gq/shared/models/quotation-detail';
import { UpdatePrice } from '@gq/shared/models/quotation-detail';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';

import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-sap-price',
  templateUrl: './sap-price.component.html',
})
export class SapPriceComponent {
  private _isLoading: boolean;
  private _quotationDetail: QuotationDetail;

  gpi: number;
  gpm: number;
  isSelected: boolean;

  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() isDisabled: boolean;

  @Input() set quotationDetail(quotationDetail: QuotationDetail) {
    if (quotationDetail) {
      this.gpi = calculateMargin(quotationDetail.sapPrice, quotationDetail.gpc);
      this.gpm = calculateMargin(quotationDetail.sapPrice, quotationDetail.sqv);
      this.isSelected = [
        PriceSource.SAP_STANDARD,
        PriceSource.SAP_SPECIAL,
        PriceSource.CAP_PRICE,
      ].includes(quotationDetail.priceSource);
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

  @Output() readonly selectSapPrice = new EventEmitter<UpdatePrice>();

  selectPrice(): void {
    this._isLoading = true;
    this.selectSapPrice.emit(
      new UpdatePrice(
        this.quotationDetail.sapPrice,
        this.getSapPriceSource(this.quotationDetail.sapPriceCondition)
      )
    );
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
  public trackByFn(index: number): number {
    return index;
  }
}
