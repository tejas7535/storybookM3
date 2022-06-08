import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { ColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../shared/components/modal/editing-modal/editing-modal.component';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { HelperService } from '../../../../shared/services/helper-service/helper-service.service';
import { PriceService } from '../../../../shared/services/price-service/price.service';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
  styleUrls: ['./manual-price.component.scss'],
})
export class ManualPriceComponent implements OnChanges, OnInit, OnDestroy {
  manualPriceFormControl: UntypedFormControl;
  editMode = false;
  gpi: number;
  gpm: number;
  price: number;
  _isLoading: boolean;
  PriceSource = PriceSource;

  private readonly subscription: Subscription = new Subscription();

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
    this.manualPriceFormControl = new UntypedFormControl(
      this.price?.toString()
    );
    this.setGpi();
    this.setGpm();

    this.addSubscriptions();
  }

  ngOnChanges(): void {
    this.setPrice();
    if (this.manualPriceFormControl) {
      this.manualPriceFormControl.setValue(this.price?.toString());
      this.setGpi();
      this.setGpm();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addSubscriptions(): void {
    this.subscription.add(
      this.manualPriceFormControl.valueChanges.subscribe(() => {
        this.setGpi();
        this.setGpm();
      })
    );
  }
  setPrice(): void {
    this.price =
      this.quotationDetail.priceSource === PriceSource.MANUAL
        ? this.quotationDetail.price
        : undefined;
  }

  setGpi(): void {
    this.gpi = PriceService.calculateMargin(
      this.manualPriceFormControl.value,
      this.quotationDetail.gpc
    );
  }
  setGpm(): void {
    this.gpm = PriceService.calculateMargin(
      this.manualPriceFormControl.value,
      this.quotationDetail.sqv
    );
  }

  openMarginEditing(gpi: boolean): void {
    this.dialog.open(EditingModalComponent, {
      width: '684px',
      data: {
        quotationDetail: this.quotationDetail,
        field: gpi ? ColumnFields.GPI : ColumnFields.GPM,
      },
      disableClose: true,
    });
  }

  openEditing(): void {
    this.editMode = true;
  }

  onKeyPress(event: KeyboardEvent, manualPriceInput: HTMLInputElement): void {
    HelperService.validateAbsolutePriceInputKeyPress(event, manualPriceInput);
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateNumberInputPaste(
      event,
      this.manualPriceFormControl,
      false
    );
  }

  selectPrice(): void {
    this._isLoading = true;
    this.editMode = false;
    const updatePrice = new UpdatePrice(
      this.manualPriceFormControl.value,
      PriceSource.MANUAL
    );
    this.selectManualPrice.emit(updatePrice);
  }
}
