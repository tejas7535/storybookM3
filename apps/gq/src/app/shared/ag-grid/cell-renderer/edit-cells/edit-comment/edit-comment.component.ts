import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EditingCommentModalComponent } from '@gq/process-case-view/quotation-details-table/editing-comment-modal/editing-comment-modal.component';
import { CellClassParams } from 'ag-grid-community';

import { QuotationStatus } from '../../../../models';
import { QuotationDetail } from '../../../../models/quotation-detail';

@Component({
  selector: 'gq-edit-comment',
  templateUrl: './edit-comment.component.html',
})
export class EditCommentComponent {
  detail: QuotationDetail;
  quotationStatus: QuotationStatus;

  readonly quotationStatusEnum = QuotationStatus;

  constructor(private readonly dialog: MatDialog) {}
  agInit(params: CellClassParams): void {
    this.quotationStatus = params?.context?.quotation?.status;
    this.detail = params.data;
  }
  onIconClick(): void {
    this.dialog.open(EditingCommentModalComponent, {
      width: '684px',
      data: this.detail,
    });
  }
}
