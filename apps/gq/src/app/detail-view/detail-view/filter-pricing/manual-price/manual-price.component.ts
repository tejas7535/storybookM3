import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../shared/components/modal/editing-modal/editing-modal.component';
import { QuotationStatus } from '../../../../shared/models';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
})
export class ManualPriceComponent {
  private _isLoading: boolean;
  private _quotationDetail: QuotationDetail;

  price: number;
  gpi: number;
  gpm: number;
  PriceSource = PriceSource;
  ColumnFields = ColumnFields;
  quotationStatus = QuotationStatus;

  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() currency: string;
  @Input() userHasManualPriceRole: boolean;

  @Input() set quotationDetail(quotationDetail: QuotationDetail) {
    this._quotationDetail = quotationDetail;

    // check if price set equals GQ price
    this.setPrice();
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

  @Output() readonly selectManualPrice = new EventEmitter<UpdatePrice>();

  constructor(private readonly dialog: MatDialog) {}

  setPrice(): void {
    if (this.quotationDetail.priceSource === PriceSource.MANUAL) {
      this.price = this.quotationDetail.price;
      this.gpm = this.quotationDetail.gpm;
      this.gpi = this.quotationDetail.gpi;
    } else {
      this.price = undefined;
      this.gpm = undefined;
      this.gpi = undefined;
    }
  }

  openEditing(columnField: ColumnFields): void {
    this.dialog.open(EditingModalComponent, {
      width: '684px',
      data: {
        quotationDetail: this.quotationDetail,
        field: columnField,
      },
    });
  }
}
