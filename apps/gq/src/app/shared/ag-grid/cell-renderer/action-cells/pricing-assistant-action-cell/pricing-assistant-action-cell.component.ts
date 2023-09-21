import { Component } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models';
import { quotationDetailIsFNumber } from '@gq/shared/utils/f-pricing.utils';
import { CellClassParams } from 'ag-grid-community';

@Component({
  selector: 'gq-pricing-assistant-action-cell',
  templateUrl: './pricing-assistant-action-cell.component.html',
})
export class PricingAssistantActionCellComponent {
  params: CellClassParams;
  isFNumber = false;

  agInit(params: CellClassParams): void {
    this.params = params;
    this.isFNumber = quotationDetailIsFNumber(params.data as QuotationDetail);
  }

  openDialog(): void {
    console.log('openDialog');
  }
}
