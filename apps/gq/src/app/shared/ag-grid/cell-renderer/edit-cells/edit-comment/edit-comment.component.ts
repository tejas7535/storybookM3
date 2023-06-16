import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { EditingCommentModalComponent } from '@gq/process-case-view/quotation-details-table/editing-comment-modal/editing-comment-modal.component';
import { CellClassParams } from 'ag-grid-community';

import { QuotationStatus } from '../../../../models';
import { QuotationDetail } from '../../../../models/quotation-detail';

@Component({
  selector: 'gq-edit-comment',
  templateUrl: './edit-comment.component.html',
})
export class EditCommentComponent {
  public detail: QuotationDetail;
  quotationStatus = QuotationStatus;

  constructor(private readonly dialog: MatDialog) {}
  agInit(params: CellClassParams): void {
    this.detail = params.data;
  }
  onIconClick(): void {
    this.dialog.open(EditingCommentModalComponent, {
      width: '684px',
      height: '300px',
      data: this.detail,
    });
  }
}
