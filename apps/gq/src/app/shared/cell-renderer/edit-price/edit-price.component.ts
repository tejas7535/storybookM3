import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/core';

import { ColumnFields } from '../../services/column-utility-service/column-fields.enum';

@Component({
  selector: 'gq-edit-price',
  templateUrl: './edit-price.component.html',
})
export class EditPriceComponent {
  public params: CellClassParams;
  public value: string;

  agInit(params: any): void {
    this.params = params;
    this.value = params.valueFormatted;
  }

  onIconClick(): void {
    this.params.api.startEditingCell({
      rowIndex: this.params.rowIndex,
      colKey: ColumnFields.PRICE,
      rowPinned: null,
      charPress: null,
      keyPress: null,
    });
  }
}
