import { Component, inject, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { QuotationStatus } from '@gq/shared/models';

import { Customer } from './../../../models/customer/';
import { SAP_SYNC_STATUS } from './../../../models/quotation-detail/sap-sync-status.enum';

@Component({
  selector: 'gq-status-customer-info-header',
  templateUrl: './status-customer-info-header.component.html',
})
export class StatusCustomerInfoHeaderComponent {
  @Input() customer: Customer;
  @Input() sapStatus$: Observable<SAP_SYNC_STATUS>;
  @Input() statusOfQuotation: QuotationStatus;
  @Input() errorCode = '';
  @Input() showStatus = false;

  quotationStatusTranslation: string;

  readonly isLatestApprovalEventVerified$: Observable<boolean> =
    inject(ApprovalFacade).isLatestApprovalEventVerified$;

  readonly sapSyncStatus: typeof SAP_SYNC_STATUS = SAP_SYNC_STATUS;
  readonly quotationStatus: typeof QuotationStatus = QuotationStatus;
}
