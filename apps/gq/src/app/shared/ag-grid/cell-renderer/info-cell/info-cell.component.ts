import { Component } from '@angular/core';

import { CellClassParams } from 'ag-grid-community';

import { ValidationDescription } from '../../../models/table';
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
    this.valid = params.value.valid;
    this.toolTipText = this.columnUtilityService.buildMaterialInfoTooltipText(
      params.data.info.description,
      params.data.info.errorCodes
    );
    this.isErrorText = params?.data?.info?.errorCodes?.length > 0;
  }
}
