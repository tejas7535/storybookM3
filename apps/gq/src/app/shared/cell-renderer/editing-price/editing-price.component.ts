import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { ICellEditorParams } from '@ag-grid-community/all-modules';

import { HelperService } from '../../services/helper-service/helper-service.service';

@Component({
  selector: 'gq-editing-price',
  templateUrl: './editing-price.component.html',
})
export class EditingPriceComponent implements AfterViewChecked {
  @ViewChild('manualPrice') inputElement: ElementRef;
  manualPriceFormControl = new FormControl();
  params: ICellEditorParams;

  agInit(params: ICellEditorParams): void {
    this.params = params;
  }
  ngAfterViewChecked(): void {
    this.inputElement.nativeElement.focus();
  }
  stopEditing(cancel: boolean): void {
    this.params.api.stopEditing(cancel);
  }
  getValue(): number {
    return this.manualPriceFormControl.value;
  }

  onKeyPress(event: KeyboardEvent, manualPriceInput: HTMLInputElement): void {
    HelperService.validateNumberInputKeyPress(event, manualPriceInput);
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateNumberInputPaste(event, this.manualPriceFormControl);
  }
}
