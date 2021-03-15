import { Component } from '@angular/core';

import { IStatusPanelParams, RowNode } from '@ag-grid-community/all-modules';

import { MaterialTableItem } from '../../../core/store/models';
import { isDummyData } from '../../../core/store/reducers/create-case/config/dummy-row-data';

@Component({
  selector: 'gq-material-validation-status',
  templateUrl: './material-validation-status.component.html',
  styleUrls: ['./material-validation-status.component.scss'],
})
export class MaterialValidationStatusComponent {
  MAX_NUMBER_OF_QUOTATION_DETAILS = 100;

  invalid = 0;
  combinations = 0;

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
    this.combinations = 0;

    this.params.api.forEachNode((row: RowNode) => {
      const tmpDetail: MaterialTableItem = row.data;

      // skip dummy row data that is initially provided
      if (!isDummyData(tmpDetail)) {
        this.invalid += tmpDetail.info?.valid ? 0 : 1;
        this.combinations += 1;
      }
    });
  }
}
