import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { KeyName } from '@ag-grid-community/all-modules';
import { TranslocoService } from '@ngneat/transloco';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { PriceService } from '../../../../shared/services/price-service/price.service';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
  styleUrls: ['./manual-price.component.scss'],
})
export class ManualPriceComponent implements OnChanges, OnInit, OnDestroy {
  manualPriceFormControl: FormControl;
  editMode = false;
  gpi: number;
  price: number;
  _isLoading: boolean;

  title$: Observable<string>;
  private readonly subscription: Subscription = new Subscription();

  @Input() userHasGPCRole: boolean;
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

  constructor(private readonly translocoService: TranslocoService) {
    this.title$ = this.translocoService.selectTranslate(
      'filterPricing.manualPrice.title',
      {},
      'detail-view'
    );
  }

  ngOnInit(): void {
    // check if price set equals GQ price
    this.setPrice();
    // init form control
    this.manualPriceFormControl = new FormControl(this.price);
    // set gpi
    this.setGpi();

    this.addSubscriptions();
  }

  ngOnChanges(): void {
    this.setPrice();
    if (this.manualPriceFormControl) {
      this.manualPriceFormControl.setValue(this.price);
      this.setGpi();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addSubscriptions(): void {
    // add subscription for value changes on formControl
    this.subscription.add(
      this.manualPriceFormControl.valueChanges.subscribe(() => {
        this.setGpi();
      })
    );
  }
  setPrice(): void {
    this.price =
      this.quotationDetail.price === this.quotationDetail.recommendedPrice
        ? undefined
        : this.quotationDetail.price;
  }

  setGpi(): void {
    this.gpi = PriceService.calculateMargin(
      this.manualPriceFormControl.value,
      this.quotationDetail.gpc
    );
  }

  openEditing(): void {
    this.editMode = true;
  }

  onKeyPress(event: KeyboardEvent, manualPriceInput: any): void {
    const parsedInput = parseInt(event.key, 10);
    const isValidNumber = parsedInput === 0 || !isNaN(parsedInput);

    if (
      isValidNumber &&
      event.key !== KeyName.BACKSPACE &&
      event.key !== KeyName.DELETE
    ) {
      const value: number = manualPriceInput.value;
      // get all decimal digits for the input value
      const decimalDigits = value ? value.toString().split('.') : [];

      // prevent user from entering a third decimal place
      if (decimalDigits[1]?.length > 1) {
        event.preventDefault();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const price =
      Math.round(parseFloat(event.clipboardData.getData('text')) * 100) / 100;

    if (price) {
      this.manualPriceFormControl.setValue(price);
    }
  }

  selectPrice(): void {
    this._isLoading = true;
    this.editMode = false;
    const price = PriceService.roundToTwoDecimals(
      this.manualPriceFormControl.value /
        this.quotationDetail.material.priceUnit
    );
    const updatePrice = new UpdatePrice(price, PriceSource.MANUAL);
    this.selectManualPrice.emit(updatePrice);
  }
}
