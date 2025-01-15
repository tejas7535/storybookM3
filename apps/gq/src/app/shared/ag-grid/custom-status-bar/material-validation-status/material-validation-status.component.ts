import { Component } from '@angular/core';

import { IRowNode, IStatusPanelParams } from 'ag-grid-enterprise';

import { ValidationDescription } from '../../../models/table';

@Component({
  selector: 'gq-material-validation-status',
  templateUrl: './material-validation-status.component.html',
})
export class MaterialValidationStatusComponent {
  invalid = 0;
  total = 0;

  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener(
      'rowDataUpdated',
      this.rowValueChanges.bind(this)
    );
  }

  rowValueChanges(): void {
    this.invalid = 0;
    this.total = 0;

    this.params.api.forEachNode((row: IRowNode) => {
      if (
        row?.data?.info?.description?.includes(
          ValidationDescription.Not_Validated
        )
      ) {
        return;
      }
      this.invalid += +!row.data.info?.valid;
      this.total += 1;
    });
  }
}
