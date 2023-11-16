import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { QuotationStatus } from '@gq/shared/models';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { getPriceUnit } from '@gq/shared/utils/pricing.utils';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
})
export class ManualPriceComponent {
  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() userHasManualPriceRole: boolean;

  @Output() readonly selectManualPrice = new EventEmitter<UpdatePrice>();

  price: number;
  priceUnit: number;
  gpi: number;
  gpm: number;
  gpmRfq: number;

  PriceSource = PriceSource;
  ColumnFields = ColumnFields;
  quotationStatus = QuotationStatus;

  private _isLoading: boolean;
  private _quotationDetail: QuotationDetail;

  constructor(private readonly editingModalService: EditingModalService) {}

  get quotationDetail(): QuotationDetail {
    return this._quotationDetail;
  }

  @Input() set quotationDetail(quotationDetail: QuotationDetail) {
    this._quotationDetail = quotationDetail;

    this.priceUnit = getPriceUnit(quotationDetail);
    // check if price set equals GQ price
    this.setPrice();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  setPrice(): void {
    if (this.quotationDetail.priceSource === PriceSource.MANUAL) {
      this.price = this.quotationDetail.price;
      this.gpm = this.quotationDetail.gpm;
      this.gpmRfq = this.quotationDetail.gpmRfq;
      this.gpi = this.quotationDetail.gpi;
    } else {
      this.price = undefined;
      this.gpm = undefined;
      this.gpmRfq = undefined;
      this.gpi = undefined;
    }
  }

  openEditing(field: ColumnFields): void {
    this.editingModalService.openEditingModal({
      quotationDetail: this.quotationDetail,
      field,
    });
  }
}
