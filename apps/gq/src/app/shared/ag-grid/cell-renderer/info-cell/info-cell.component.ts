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
  isLoading: boolean;

  agInit(params: CellClassParams): void {
    this.isLoading = !!params?.data?.info?.description?.includes(
      ValidationDescription.Not_Validated
    );
    this.valid = params.value.valid;
    this.toolTipText = this.setToolTipText(params.data.info.description);
  }
  setToolTipText(description: ValidationDescription[]): string {
    let text = `Status:\n`;
    description.forEach((item) => {
      text += `${translate(`shared.caseMaterial.table.info.status.${item}`)}\n`;
    });

    return text;
  }
}
