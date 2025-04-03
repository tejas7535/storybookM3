import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { take } from 'rxjs/operators';

import { RfqSqvCheckAttachmentFacade } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.facade';
import { RfqSqvCheckAttachmentModule } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.module';
import { AttachmentFilesUploadModalComponent } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentDialogData } from '@gq/shared/components/modal/attachment-files-upload-modal/models/attachment-dialog-data.interface';
import { TagType } from '@gq/shared/models';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { translate } from '@jsverse/transloco';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-sqv-approval-status-cell',
  templateUrl: './sqv-approval-status-cell.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TagComponent,
    MatIconModule,
    SharedTranslocoModule,
    MatTooltipModule,
    RfqSqvCheckAttachmentModule,
  ],
})
export class SqvApprovalStatusCellComponent {
  protected tagType: TagType = TagType.NEUTRAL;
  protected sqvApprovalStatus: SqvApprovalStatus;
  protected gqPositionId: string;
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly attachmentFacade: RfqSqvCheckAttachmentFacade = inject(
    RfqSqvCheckAttachmentFacade
  );
  private dialogRef: MatDialogRef<AttachmentFilesUploadModalComponent>;

  agInit(params: ICellRendererParams): void {
    this.sqvApprovalStatus = params.value;
    this.gqPositionId = params.data.gqPositionId;
  }

  onTagClick(): void {
    // depending on the sqvApprovalStatus different actions are performed
    if (this.sqvApprovalStatus === SqvApprovalStatus.APPROVAL_NEEDED) {
      this.openUploadDialog();
    }
    if (this.sqvApprovalStatus === SqvApprovalStatus.APPROVED) {
      this.attachmentFacade.downloadAttachments(this.gqPositionId);
    }
  }

  private openUploadDialog(): void {
    this.attachmentFacade.setGqPositionId(this.gqPositionId);
    this.dialogRef = this.dialog.open(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: {
        fileNames: [],
        dialogTitle: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.title'
        ),
        dialogSubtitle: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.subtitle'
        ),
        showWarning: true,
        warningMessage: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.warning'
        ),
        uploadButtonCaption: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.approveButton'
        ),
        upload: this.attachmentFacade.uploadAttachments.bind(
          this.attachmentFacade
        ),
        uploading$: this.attachmentFacade.attachmentsUploading$,
        uploadSuccess$: this.attachmentFacade.uploadAttachmentsSuccess$,
      } as AttachmentDialogData,
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.attachmentFacade.resetGqPositionId();
      });
  }
}
