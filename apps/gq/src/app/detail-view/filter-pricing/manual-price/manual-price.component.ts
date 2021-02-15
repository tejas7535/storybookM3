import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KeyName } from '@ag-grid-community/all-modules';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
  styleUrls: ['./manual-price.component.scss'],
})
export class ManualPriceComponent {
  manualPriceFormControl: FormControl;
  disableInput: boolean;

  @Input() currentPrice: number;

  @Input() set manualPricePermission(value: boolean) {
    this.manualPriceFormControl = new FormControl({
      value: '',
      disabled: !value,
    });
    this.disableInput = !value;
  }
  @Output() readonly selectManualPrice = new EventEmitter<number>();

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
    this.selectManualPrice.emit(this.manualPriceFormControl.value);
  }
}
