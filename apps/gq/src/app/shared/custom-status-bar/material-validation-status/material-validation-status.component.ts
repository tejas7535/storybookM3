import { Component } from '@angular/core';

import { IStatusPanelParams, RowNode } from '@ag-grid-community/all-modules';

import { MaterialTableItem } from '../../models/table';

@Component({
  selector: 'gq-material-validation-status',
  templateUrl: './material-validation-status.component.html',
})
export class MaterialValidationStatusComponent {
  invalid = 0;
  amountDetails = 0;

  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener(
      'rowDataChanged',
      this.rowValueChanges.bind(this)
    );
  }

  rowValueChanges(): void {
    this.invalid = 0;
    this.amountDetails = 0;

    this.params.api.forEachNode((row: RowNode) => {
      const tmpDetail: MaterialTableItem = row.data;

      this.invalid += +!tmpDetail.info?.valid;
      this.amountDetails += 1;
    });
  }
}
