import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

import { SAP_SYNC_STATUS } from '../../../models/quotation-detail/sap-sync-status.enum';

export type SapStatusCellComponentParams = ICellRendererParams & {
  syncedText: string;
  notSyncedText: string;
  partiallySyncedText: string;
};

@Component({
  selector: 'gq-sap-sync-status-cell',
  templateUrl: './sap-sync-status-cell.component.html',
})
export class SapStatusCellComponent {
  params: SapStatusCellComponentParams;
  syncedStatus: SAP_SYNC_STATUS;

  synced = SAP_SYNC_STATUS.SYNCED;
  notSynced = SAP_SYNC_STATUS.NOT_SYNCED;
  partiallySynced = SAP_SYNC_STATUS.PARTIALLY_SYNCED;

  agInit(params: SapStatusCellComponentParams): void {
    this.syncedStatus =
      Number.parseInt(params.valueFormatted, 10) || SAP_SYNC_STATUS.NOT_SYNCED;
    this.params = params;
  }
}
