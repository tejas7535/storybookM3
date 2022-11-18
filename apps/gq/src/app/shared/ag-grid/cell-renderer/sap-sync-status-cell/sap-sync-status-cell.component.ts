import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

import { SAP_SYNC_STATUS } from '../../../models/quotation-detail/sap-sync-status.enum';

@Component({
  selector: 'gq-sap-sync-status-cell',
  templateUrl: './sap-sync-status-cell.component.html',
})
export class SapStatusCellComponent {
  syncedStatus: SAP_SYNC_STATUS;

  errorCode: string | undefined;

  synced = SAP_SYNC_STATUS.SYNCED;
  notSynced = SAP_SYNC_STATUS.NOT_SYNCED;
  partiallySynced = SAP_SYNC_STATUS.PARTIALLY_SYNCED;
  syncFailed = SAP_SYNC_STATUS.SYNC_FAILED;

  agInit(params: ICellRendererParams): void {
    this.syncedStatus =
      Number.parseInt(params.value, 10) || SAP_SYNC_STATUS.NOT_SYNCED;

    this.errorCode =
      params?.data?.sapSyncErrorCode && !params.data?.syncInSap
        ? params.data.sapSyncErrorCode
        : undefined;
  }
}
