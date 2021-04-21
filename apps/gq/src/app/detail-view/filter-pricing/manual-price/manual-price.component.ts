import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { KeyName } from '@ag-grid-community/all-modules';
import { TranslocoService } from '@ngneat/transloco';

import {
  PriceSource,
  UpdatePrice,
} from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
  styleUrls: ['./manual-price.component.scss'],
})
export class ManualPriceComponent {
  manualPriceFormControl: FormControl;
  disableInput: boolean;
  _isLoading: boolean;

  title$: Observable<string>;

  @Input() currentPrice: number;

  @Input() set manualPricePermission(value: boolean) {
    this.manualPriceFormControl = new FormControl({
      value: '',
      disabled: !value,
    });
    this.disableInput = !value;
  }

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
    const updatePrice = new UpdatePrice(
      this.manualPriceFormControl.value,
      PriceSource.MANUAL
    );
    this.selectManualPrice.emit(updatePrice);
  }
}
