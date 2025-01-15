import { Component } from '@angular/core';

import { QuotationStatus } from '@gq/shared/models';
import { getTagTypeByStatus, TagType } from '@gq/shared/utils/misc.utils';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'gq-quotation-status-cell',
  templateUrl: './quotation-status-cell.component.html',
})
export class QuotationStatusCellComponent {
  protected tagType: TagType;

  status: QuotationStatus;
  statusVerified: boolean;

  readonly quotationStatus = QuotationStatus;

  agInit(params: ICellRendererParams): void {
    this.status = params.value;
    this.statusVerified = params.data.statusVerified;
    this.tagType = getTagTypeByStatus(this.status);
  }
}
