import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  PriceSource,
  QuotationDetail,
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

  constructor(private readonly router: Router) {}

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
        this.isSpecialPriceCondition()
          ? PriceSource.SAP_SPECIAL
          : PriceSource.SAP_STANDARD
      )
    );
  }

  navigateClick(): void {
    this.router.navigate(
      [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`],
      {
        queryParamsHandling: 'preserve',
      }
    );
  }

  public trackByFn(index: number): number {
    return index;
  }

  isSpecialPriceCondition(): boolean {
    return (
      this.quotationDetail.sapPriceCondition === 'ZP05' ||
      this.quotationDetail.sapPriceCondition === 'ZP17'
    );
  }
}
