import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
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

    this.disableReleaseButtonTooltipTranslationKey = null;
    // disable release button if status is not synced
    if (quotation.sapSyncStatus !== SAP_SYNC_STATUS.SYNCED) {
      this.disableReleaseButton = true;
      this.disableReleaseButtonTooltipTranslationKey = 'releaseButtonTooltip';
    }

    if (quotation.sapSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING) {
      this.disableReleaseButton = true;
      this.disableReleaseButtonTooltipTranslationKey =
        'disabledForSyncPendingTooltip';
    }

    // Reset disable button state when status is synced.
    // It is required due to async sap status refresh in the background
    if (quotation.sapSyncStatus === SAP_SYNC_STATUS.SYNCED) {
      this.disableReleaseButton = false;
    }
  }

  get quotation(): Quotation {
    return this._quotation;
  }

  private readonly dialog: MatDialog = inject(MatDialog);
  private _quotation: Quotation;

  displayReleaseButton: boolean;
  disableReleaseButton = false;
  disableReleaseButtonTooltipTranslationKey: string = null;

  openDialog() {
    this.dialog.open(ReleaseModalComponent, {
      data: this.quotation,
      width: '634px',
      panelClass: 'release-modal',
    });
  }
}
