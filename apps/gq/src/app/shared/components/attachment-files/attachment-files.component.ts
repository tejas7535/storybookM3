import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { getIsQuotationStatusActive } from '@gq/core/store/active-case/active-case.selectors';
import { TRANSLOCO_DATE_PIPE_CONFIG } from '@gq/shared/constants/transloco-date-pipe-config';
import { QuotationAttachment } from '@gq/shared/models';
import { Store } from '@ngrx/store';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentDialogData } from '../modal/attachment-files-upload-modal/models/attachment-dialog-data.interface';
import { DeletingAttachmentModalComponent } from '../modal/delete-attachment-modal/delete-attachment-modal.component';
import { DeleteAttachmentDialogData } from '../modal/delete-attachment-modal/models/delete-attachment-dialog-data.interface';
@Component({
  selector: 'gq-attachment-files',
  templateUrl: './attachment-files.component.html',
  standalone: false,
})
export class AttachmentFilesComponent implements OnInit {
  @Input() attachments: QuotationAttachment[];
  @Input() marginBottom = true;
  @Input() modalVersion = false;
  @Input() tooltipText = '';
  @Input() workflowInProgress: boolean;
  @Input() quotationFullyApproved: boolean;

  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly store: Store = inject(Store);
  public readonly activeCaseFacade: ActiveCaseFacade = inject(ActiveCaseFacade);
  quotationActive$: Observable<boolean>;
  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;

  ngOnInit(): void {
    this.quotationActive$ = this.store.select(getIsQuotationStatusActive);
  }

  openAddFileDialog(): void {
    this.dialog.open(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: {
        fileNames: computed(() =>
          this.attachments.map((attachment) => attachment.fileName)
        ),
        upload: this.activeCaseFacade.uploadAttachments.bind(
          this.activeCaseFacade
        ),
        uploading$: this.activeCaseFacade.attachmentsUploading$,
        uploadSuccess$: this.activeCaseFacade.uploadAttachmentsSuccess$,
      } as AttachmentDialogData,
    });
  }

  openConfirmDeleteAttachmentDialog(attachment: QuotationAttachment): void {
    this.dialog.open(DeletingAttachmentModalComponent, {
      width: '634px',
      disableClose: true,
      data: {
        attachment,
        delete: this.activeCaseFacade.deleteAttachment.bind(
          this.activeCaseFacade
        ),
        deleteSuccess$: this.activeCaseFacade.deleteAttachmentSuccess$,
        deleting$: this.activeCaseFacade.deletionAttachmentInProgress$,
      } as DeleteAttachmentDialogData<QuotationAttachment>,
    });
  }

  downloadAttachment(attachment: QuotationAttachment): void {
    this.activeCaseFacade.downloadAttachment(attachment);
  }
}
