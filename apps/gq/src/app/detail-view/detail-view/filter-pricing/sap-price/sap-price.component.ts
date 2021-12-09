import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-sap-price',
  templateUrl: './sap-price.component.html',
})
export class SapPriceComponent implements OnInit {
  public gpi: number;
  public gpm: number;
  _isLoading: boolean;
  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() quotationDetail: QuotationDetail;

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Output() readonly selectSapPrice = new EventEmitter<UpdatePrice>();

  ngOnInit(): void {
    if (this.quotationDetail) {
      this.gpi = PriceService.calculateMargin(
        this.quotationDetail.sapPrice,
        this.quotationDetail.gpc
      );
      this.gpm = PriceService.calculateMargin(
        this.quotationDetail.sapPrice,
        this.quotationDetail.sqv
      );
    }
  }

  selectPrice(): void {
    this._isLoading = true;
    this.selectSapPrice.emit(
      new UpdatePrice(
        this.quotationDetail.sapPrice,
        this.quotationDetail.sapPriceCondition === SapPriceCondition.STANDARD
          ? PriceSource.SAP_STANDARD
          : PriceSource.SAP_SPECIAL
      )
    );
  }

  public trackByFn(index: number): number {
    return index;
  }
}
