import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { PriceService } from '../../../../shared/services/price/price.service';
import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-sap-price',
  templateUrl: './sap-price.component.html',
})
export class SapPriceComponent implements OnInit, OnChanges {
  public gpi: number;
  public gpm: number;
  public isSelected: boolean;
  _isLoading: boolean;
  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() quotationDetail: QuotationDetail;
  @Input() isDisabled: boolean;

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
  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).includes('quotationDetail')) {
      this.isSelected = [
        PriceSource.SAP_STANDARD,
        PriceSource.SAP_SPECIAL,
        PriceSource.CAP_PRICE,
      ].includes(this.quotationDetail.priceSource);
    }
  }
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
