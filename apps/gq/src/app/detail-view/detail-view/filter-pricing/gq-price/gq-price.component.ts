import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-price',
  templateUrl: './gq-price.component.html',
})
export class GqPriceComponent implements OnInit {
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

  @Output() readonly selectGqPrice = new EventEmitter<UpdatePrice>();

  ngOnInit(): void {
    if (this.quotationDetail) {
      this.gpi = PriceService.calculateMargin(
        this.quotationDetail.recommendedPrice,
        this.quotationDetail.gpc
      );
      this.gpm = PriceService.calculateMargin(
        this.quotationDetail.recommendedPrice,
        this.quotationDetail.sqv
      );
    }
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
