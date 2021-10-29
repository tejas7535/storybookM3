import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/all-modules';

import { ColumnFields } from '../../../services/column-utility-service/column-fields.enum';

@Component({
  selector: 'gq-edit-discount',
  templateUrl: './edit-discount.component.html',
})
export class EditDiscountComponent {
  public value: string;
  public sapGrossPrice: string;
  public params: CellClassParams;

  agInit(params: any): void {
    this.params = params;
    this.value = params.valueFormatted;
    this.sapGrossPrice = params.data.sapGrossPrice;
  }
  onIconClick(): void {
    this.params.api.startEditingCell({
      rowIndex: this.params.rowIndex,
      colKey: ColumnFields.DISCOUNT,
      rowPinned: undefined,
      charPress: undefined,
      keyPress: undefined,
    });
  }
}
