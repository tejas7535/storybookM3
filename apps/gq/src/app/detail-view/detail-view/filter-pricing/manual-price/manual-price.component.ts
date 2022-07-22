import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../shared/components/modal/editing-modal/editing-modal.component';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
  styleUrls: ['./manual-price.component.scss'],
})
export class ManualPriceComponent implements OnChanges, OnInit {
  price: number;
  gpi: number;
  gpm: number;
  _isLoading: boolean;
  PriceSource = PriceSource;
  ColumnFields = ColumnFields;

  @Input() userHasGPCRole: boolean;
  @Input() userHasSQVRole: boolean;
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
  @Input() userHasManualPriceRole: boolean;

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Output() readonly selectManualPrice = new EventEmitter<UpdatePrice>();

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    // check if price set equals GQ price
    this.setPrice();
  }

  ngOnChanges(): void {
    this.setPrice();
  }

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
      disableClose: true,
    });
  }
}
