import { Component } from '@angular/core';

import { SAP_ERROR_MESSAGE_CODE } from '@gq/shared/models';
import { CellClassParams } from 'ag-grid-community';

import { VALIDATION_CODE, ValidationDescription } from '../../../models/table';
import { ColumnUtilityService } from '../../services';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
})
export class InfoCellComponent {
  public valid: string;
  public toolTipText: string;
  public isErrorText: boolean;
  isLoading: boolean;

  constructor(private readonly columnUtilityService: ColumnUtilityService) {}

  agInit(params: CellClassParams): void {
    this.isLoading = !!params?.data?.info?.description?.includes(
      ValidationDescription.Not_Validated
    );
    // only SAP Error Codes are relevant for displaying in infoCell
    // other codes will be handled in other cells
    const sapCodes = params?.data?.info?.codes?.filter(
      (code: VALIDATION_CODE) =>
        Object.values(SAP_ERROR_MESSAGE_CODE).includes(
          code as unknown as SAP_ERROR_MESSAGE_CODE
        )
    );
    this.valid = params.value.valid;

    this.toolTipText = this.columnUtilityService.buildMaterialInfoText(
      params.data.info.description,
      sapCodes
    );
    this.isErrorText = sapCodes?.length > 0;
  }
}
