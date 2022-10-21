import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

export type SapStatusCellComponentParams = ICellRendererParams & {
  syncedText: string;
  notSyncedText: string;
};

@Component({
  selector: 'gq-sap-sync-status-cell',
  templateUrl: './sap-sync-status-cell.component.html',
})
export class SapStatusCellComponent {
  params: SapStatusCellComponentParams;
  syncedInSap: boolean;

  agInit(params: SapStatusCellComponentParams): void {
    this.syncedInSap = params.value || false;
    this.params = params;
  }
}
