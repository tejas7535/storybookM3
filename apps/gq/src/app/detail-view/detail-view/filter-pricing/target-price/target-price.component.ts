import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { getIsQuotationActive } from '@gq/core/store/active-case/active-case.selectors';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-target-price',
  templateUrl: './target-price.component.html',
})
export class TargetPriceComponent implements OnInit {
  @Input() isDisabled: boolean;
  @Input() currency: string;

  get quotationDetail(): QuotationDetail {
    return this._quotationDetail;
  }
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
      this.gpmRfq = calculateMargin(
        quotationDetail.targetPrice,
        quotationDetail.rfqData?.sqv
      );
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  @Output() readonly targetPriceSelected = new EventEmitter<UpdatePrice>();

  isQuotationActive$: Observable<boolean>;
  PriceSource = PriceSource;
  gpi: number;
  gpm: number;
  gpmRfq: number;

  private _quotationDetail: QuotationDetail;
  private _isLoading: boolean;

  constructor(
    private readonly store: Store,
    private readonly editingModalService: EditingModalService
  ) {}

  ngOnInit(): void {
    this.isQuotationActive$ = this.store.select(getIsQuotationActive);
  }

  selectTargetPrice(): void {
    this._isLoading = true;
    this.targetPriceSelected.emit(
      new UpdatePrice(
        this.quotationDetail.targetPrice,
        PriceSource.TARGET_PRICE
      )
    );
  }

  openTargetPriceEditingModal(): void {
    this.editingModalService.openEditingModal({
      quotationDetail: this.quotationDetail,
      field: ColumnFields.TARGET_PRICE,
    });
  }
}
