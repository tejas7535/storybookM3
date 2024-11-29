import { Component } from '@angular/core';

import { getTagTypeByStatus, TagType } from '@gq/shared/utils/misc.utils';
import { ICellRendererParams } from 'ag-grid-community';

import { SAP_SYNC_STATUS } from '../../../models/quotation-detail/sap-sync-status.enum';

@Component({
  selector: 'gq-sap-sync-status-cell',
  templateUrl: './sap-sync-status-cell.component.html',
})
export class SapStatusCellComponent {
  protected tagType: TagType;
  syncedStatus: SAP_SYNC_STATUS;

  errorCode: string | undefined;

  syncPending = SAP_SYNC_STATUS.SYNC_PENDING;

  agInit(params: ICellRendererParams): void {
    this.syncedStatus = params.value || SAP_SYNC_STATUS.NOT_SYNCED;
    this.errorCode = params?.data?.sapSyncErrorCode?.code ?? undefined;
    this.tagType = getTagTypeByStatus(this.syncedStatus);
  }
}
