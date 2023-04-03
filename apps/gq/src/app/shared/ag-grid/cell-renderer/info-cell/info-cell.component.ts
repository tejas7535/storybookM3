import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { CellClassParams } from 'ag-grid-community';

import { ValidationDescription } from '../../../models/table';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
})
export class InfoCellComponent {
  public valid: string;
  public toolTipText: string;
  public isErrorText: boolean;
  isLoading: boolean;

  agInit(params: CellClassParams): void {
    this.isLoading = !!params?.data?.info?.description?.includes(
      ValidationDescription.Not_Validated
    );
    this.valid = params.value.valid;
    this.toolTipText = this.setToolTipText(
      params.data.info.description,
      params.data.info.errorCode
    );
    this.isErrorText = params?.data?.info?.errorCode ? true : false;
  }
  setToolTipText(
    description: ValidationDescription[],
    errorCode?: string
  ): string {
    let text = '';

    // show either errorCode Message or DescriptionMessages, No mixes
    if (errorCode) {
      text += `${translate(
        `shared.sapStatusLabels.errorCodes.${errorCode}`
      )}\n`;
    } else {
      description.forEach((item) => {
        text += `${translate(
          `shared.caseMaterial.table.info.status.${item}`
        )}\n`;
      });
    }

    return text;
  }
}
