import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Quotation, QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ReleaseModalComponent } from './release-modal/release-modal.component';

@Component({
  selector: 'gq-release-button',
  templateUrl: './release-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    ReleaseModalComponent,
    SharedTranslocoModule,
  ],
})
export class ReleaseButtonComponent {
  displayReleaseButton: boolean;
  disableReleaseButton: boolean;

  private _quotation: Quotation;
  constructor(private readonly dialog: MatDialog) {}

  get quotation(): Quotation {
    return this._quotation;
  }
  @Input() set quotation(quotation: Quotation) {
    this._quotation = quotation;
    const isCustomerEnabledForApprovalWorkflow =
      quotation.customer.enabledForApprovalWorkflow;
    const isQuotationActive = quotation.status === QuotationStatus.ACTIVE;
    const isSapQuotation = !!quotation?.sapId;

    // only display release button if quotation matches all criteria
    this.displayReleaseButton =
      isCustomerEnabledForApprovalWorkflow &&
      isQuotationActive &&
      isSapQuotation;

    // disable release button if status is not synced
    this.disableReleaseButton =
      quotation.sapSyncStatus !== SAP_SYNC_STATUS.SYNCED;
  }

  openDialog() {
    this.dialog.open(ReleaseModalComponent, {
      data: this.quotation,
      width: '634px',
      panelClass: 'release-modal',
    });
  }
}
