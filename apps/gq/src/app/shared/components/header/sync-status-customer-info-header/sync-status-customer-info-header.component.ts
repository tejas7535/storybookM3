import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Customer } from './../../../models/customer/';
import { SAP_SYNC_STATUS } from './../../../models/quotation-detail/sap-sync-status.enum';

@Component({
  selector: 'gq-sync-status-customer-info-header',
  templateUrl: './sync-status-customer-info-header.component.html',
})
export class SyncStatusCustomerInfoHeaderComponent {
  @Input() customer: Customer;
  @Input() sapStatus$: Observable<SAP_SYNC_STATUS>;
  @Input() showSyncStatus = false;

  public readonly sapSyncStatus: typeof SAP_SYNC_STATUS = SAP_SYNC_STATUS;
}
