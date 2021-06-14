import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ICellEditorParams } from '@ag-grid-community/all-modules';

import { HelperService } from '../../services/helper-service/helper-service.service';

@Component({
  selector: 'gq-editing-quantity',
  templateUrl: './editing-quantity.component.html',
})
export class EditingQuantityComponent {
  @ViewChild('quantity') inputElement: ElementRef;
  quantityFormControl = new FormControl();
  params: ICellEditorParams;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.quantityFormControl.setValue(params.value);
  }
  ngAfterViewChecked(): void {
    this.inputElement.nativeElement.focus();
  }
  stopEditing(cancel: boolean): void {
    this.params.api.stopEditing(cancel);
  }
  getValue(): number {
    return this.quantityFormControl.value;
  }

  onKeyPress(event: KeyboardEvent): void {
    HelperService.validateQuantityInputKeyPress(event);
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateQuantityInputPaste(event);
  }
}
