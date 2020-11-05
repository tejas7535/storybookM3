import { Component } from '@angular/core';

import { isDummyData } from '../../../../../core/store/reducers/create-case/config/dummy-row-data';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
  styleUrls: ['./info-cell.component.scss'],
})
export class InfoCellComponent {
  public valid: string;
  public isDummy: boolean;

  agInit(params: any): void {
    this.valid = params.value;
    this.isDummy = isDummyData(params.data);
  }
}
