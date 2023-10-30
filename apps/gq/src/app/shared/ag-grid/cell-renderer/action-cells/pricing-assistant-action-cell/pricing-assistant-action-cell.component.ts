import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PricingAssistantModalComponent } from '@gq/f-pricing/pricing-assistant-modal/pricing-assistant-modal.component';
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

  constructor(private readonly dialog: MatDialog) {}

  agInit(params: CellClassParams): void {
    this.params = params;
    this.isFNumber = quotationDetailIsFNumber(params.data as QuotationDetail);
  }

  openDialog(): void {
    this.dialog.open(PricingAssistantModalComponent, {
      data: this.params.data,
      width: '1000px',
      height: '1000px',
      autoFocus: false,
      panelClass: 'pricing-assistant-modal',
    });
  }
}
