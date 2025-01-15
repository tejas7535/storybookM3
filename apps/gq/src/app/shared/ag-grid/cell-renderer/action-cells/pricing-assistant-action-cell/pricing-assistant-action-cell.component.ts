import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PricingAssistantModalComponent } from '@gq/f-pricing/pricing-assistant-modal/pricing-assistant-modal.component';
import { QuotationDetail, SAP_SYNC_STATUS } from '@gq/shared/models';
import { isFNumber } from '@gq/shared/utils/f-pricing.utils';
import { CellClassParams } from 'ag-grid-enterprise';

@Component({
  selector: 'gq-pricing-assistant-action-cell',
  templateUrl: './pricing-assistant-action-cell.component.html',
})
export class PricingAssistantActionCellComponent {
  params: CellClassParams;
  isFNumber = false;
  canDisplay = false;

  constructor(private readonly dialog: MatDialog) {}

  agInit(params: CellClassParams): void {
    this.params = params;
    this.canDisplay =
      this.params.context?.quotation?.sapSyncStatus !==
      SAP_SYNC_STATUS.SYNC_PENDING;
    this.isFNumber = isFNumber(params.data as QuotationDetail);
  }

  openDialog(): void {
    this.dialog.open(PricingAssistantModalComponent, {
      data: this.params.data,
      width: '1000px',
      autoFocus: false,
      panelClass: 'pricing-assistant-modal',
    });
  }
}
