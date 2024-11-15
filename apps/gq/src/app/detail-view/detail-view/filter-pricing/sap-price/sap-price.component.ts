import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { getSapStandardPriceSource } from '@gq/shared/utils/price-source.utils';
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
        PriceSource.SECTOR_DISCOUNT,
        PriceSource.END_CUSTOMER_DISCOUNT,
        PriceSource.ZKI1,
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
  SapConditionType = SapConditionType;
  DetailRoutePath = DetailRoutePath;

  private _isLoading: boolean;
  private _quotationDetail: QuotationDetail;

  selectPrice(): void {
    this._isLoading = true;
    this.selectSapPrice.emit(
      new UpdatePrice(
        this.quotationDetail.sapPrice,
        this.getSapPriceSource(this.quotationDetail)
      )
    );
  }

  public trackByFn(index: number): number {
    return index;
  }

  private getSapPriceSource(quotationDetail: QuotationDetail): PriceSource {
    const sapPriceCondition = quotationDetail.sapPriceCondition;
    if (sapPriceCondition === SapPriceCondition.STANDARD) {
      // When price condition is Standard check for special SAP conditions
      // before update price source to send proper type of SAP_STANDARD
      return getSapStandardPriceSource(quotationDetail);
    }
    if (sapPriceCondition === SapPriceCondition.CAP_PRICE) {
      return PriceSource.CAP_PRICE;
    }

    return PriceSource.SAP_SPECIAL;
  }
}
