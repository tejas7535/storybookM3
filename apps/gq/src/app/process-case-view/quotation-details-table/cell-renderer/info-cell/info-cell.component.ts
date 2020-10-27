import { Component } from '@angular/core';

import { QuotationInfoEnum } from '../../../../core/store/models';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
  styleUrls: ['./info-cell.component.scss'],
})
export class InfoCellComponent {
  public addToOffer: boolean;

  agInit(params: any): void {
    this.addToOffer = params.value === QuotationInfoEnum.AddedToOffer;
  }
}
