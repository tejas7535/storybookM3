import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { environment } from '../../../../../environments/environment';
import { AppRoutePath } from '../../../../app-route-path.enum';
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
  styleUrls: ['./gq-price.component.scss'],
})
export class GqPriceComponent implements OnInit {
  public isProduction = environment.production;
  public gpi: number;
  _isLoading: boolean;

  title$: Observable<string>;

  @Input() userHasGPCRole: boolean;
  @Input() currency: string;
  @Input() quotationDetail: QuotationDetail;
  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  @Output() readonly selectManualPrice = new EventEmitter<UpdatePrice>();

  constructor(
    private readonly router: Router,
    private readonly translocoService: TranslocoService
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'filterPricing.gqPrice.title',
      {},
      'detail-view'
    );
  }

  ngOnInit(): void {
    if (this.quotationDetail) {
      this.gpi = PriceService.calculateMargin(
        this.quotationDetail.recommendedPrice,
        this.quotationDetail.gpc
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
    const updatePrice = new UpdatePrice(price, priceSource);
    this.selectManualPrice.emit(updatePrice);
  }

  navigateClick(): void {
    this.router.navigate(
      [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`],
      {
        queryParamsHandling: 'preserve',
      }
    );
  }
}
