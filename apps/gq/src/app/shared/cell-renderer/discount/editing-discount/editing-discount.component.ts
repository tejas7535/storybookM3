import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { ICellEditorParams } from '@ag-grid-community/all-modules';

import { HelperService } from '../../../services/helper-service/helper-service.service';

@Component({
  selector: 'gq-editing-discount',
  templateUrl: './editing-discount.component.html',
})
export class EditingDiscountComponent implements AfterViewChecked {
  @ViewChild('discount') inputElement: ElementRef;
  discountFormControl = new FormControl();
  params: ICellEditorParams;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.discountFormControl.setValue(params.value);
  }

  ngAfterViewChecked(): void {
    this.inputElement.nativeElement.focus();
  }
  stopEditing(cancel: boolean): void {
    this.params.api.stopEditing(cancel);
  }
  getValue(): number {
    return this.discountFormControl.value;
  }
  onKeyPress(event: KeyboardEvent, manualPriceInput: HTMLInputElement): void {
    HelperService.validateNumberInputKeyPress(event, manualPriceInput);
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateNumberInputPaste(event, this.discountFormControl);
  }
}
