import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EditingCommentModalComponent } from '@gq/process-case-view/quotation-details-table/editing-comment-modal/editing-comment-modal.component';
import { CellClassParams } from 'ag-grid-enterprise';

import { QuotationStatus } from '../../../../models';
import {
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '../../../../models/quotation-detail';

@Component({
  selector: 'gq-edit-comment',
  templateUrl: './edit-comment.component.html',
})
export class EditCommentComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  readonly quotationStatusEnum = QuotationStatus;

  detail: QuotationDetail;
  quotationStatus: QuotationStatus;
  sapSyncStatus: SAP_SYNC_STATUS;
  sapSyncStatusEnum = SAP_SYNC_STATUS;

  agInit(params: CellClassParams): void {
    this.quotationStatus = params?.context?.quotation?.status;
    this.sapSyncStatus = params?.context?.quotation?.sapSyncStatus;

    this.detail = params.data;
  }
  onIconClick(): void {
    this.dialog.open(EditingCommentModalComponent, {
      width: '684px',
      data: this.detail,
    });
  }
}
