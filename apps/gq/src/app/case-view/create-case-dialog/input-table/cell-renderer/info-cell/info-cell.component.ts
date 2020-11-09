import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { ValidationDescription } from '../../../../../core/store/models';
import { isDummyData } from '../../../../../core/store/reducers/create-case/config/dummy-row-data';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
  styleUrls: ['./info-cell.component.scss'],
})
export class InfoCellComponent {
  public valid: string;
  public isDummy: boolean;
  public toolTipText: string;

  agInit(params: any): void {
    this.valid = params.value.valid;
    this.isDummy = isDummyData(params.data);
    this.toolTipText = this.setToolTipText(params.data.info.description);
  }
  setToolTipText(description: ValidationDescription[]): string {
    let text = `Status:\n`;
    description.forEach((item) => {
      text += `${translate(
        `caseView.createCaseDialog.customer.table.info.status.${item}`
      )}\n`;
    });

    return text;
  }
}
