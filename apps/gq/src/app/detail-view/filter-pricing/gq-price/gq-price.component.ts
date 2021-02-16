import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getCustomerCurrency } from '../../../core/store';
import { QuotationDetail } from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { PriceService } from '../../../shared/services/price-service/price.service';

@Component({
  selector: 'gq-price',
  templateUrl: './gq-price.component.html',
  styleUrls: ['./gq-price.component.scss'],
})
export class GqPriceComponent implements OnInit {
  public customerCurrency$: Observable<string>;

  public gpi: number;

  @Input() quotationDetail: QuotationDetail;
  @Output() readonly selectManualPrice = new EventEmitter<number>();

  constructor(private readonly store: Store<ProcessCaseState>) {}

  ngOnInit(): void {
    this.customerCurrency$ = this.store.pipe(select(getCustomerCurrency));
    if (this.quotationDetail) {
      this.gpi = PriceService.calculateGPI(
        this.quotationDetail.recommendedPrice,
        this.quotationDetail.gpc
      );
    }
  }

  selectPrice(): void {
    this.selectManualPrice.emit(this.quotationDetail.recommendedPrice);
  }
}
