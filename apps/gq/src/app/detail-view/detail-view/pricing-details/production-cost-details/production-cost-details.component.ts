import { Component, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

import { UpdateCostsConfirmModalComponent } from './update-costs-confirm-modal/update-costs-confirm-modal.component';
@Component({
  selector: 'gq-production-cost-details',
  templateUrl: './production-cost-details.component.html',
})
export class ProductionCostDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
  @Input() materialCostUpdateAvl: boolean;

  constructor(private readonly matDialog: MatDialog) {}

  updateCosts(): void {
    this.matDialog.open(UpdateCostsConfirmModalComponent, {
      width: '550px',
      autoFocus: false,
      data: {
        gqPosId: this.quotationDetail.gqPositionId,
      },
    });
  }
}
