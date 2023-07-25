import { Component } from '@angular/core';

import { QuotationStatus } from '@gq/shared/models';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'gq-quotation-status-cell',
  templateUrl: './quotation-status-cell.component.html',
})
export class QuotationStatusCellComponent {
  status: QuotationStatus;
  statusVerified: boolean;

  readonly quotationStatus = QuotationStatus;

  agInit(params: ICellRendererParams): void {
    this.status = params.value;
    this.statusVerified = params.data.statusVerified;
  }
}
