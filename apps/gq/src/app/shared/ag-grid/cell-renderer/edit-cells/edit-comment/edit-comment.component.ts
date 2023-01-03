import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CellClassParams } from 'ag-grid-community';

import { EditingCommentModalComponent } from '../../../../../process-case-view/quotation-details-table/editing-comment-modal/editing-comment-modal.component';
import { QuotationDetail } from '../../../../models/quotation-detail';

@Component({
  selector: 'gq-edit-comment',
  templateUrl: './edit-comment.component.html',
})
export class EditCommentComponent {
  public detail: QuotationDetail;

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
