import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { RfqSqvCheckAttachmentFacade } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.facade';
import { RfqSqvCheckAttachmentModule } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.module';
import { AttachmentsComponent } from '@gq/shared/components/attachments/attachments.component';
import { AttachmentFilesUploadModalComponent } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentDialogData } from '@gq/shared/components/modal/attachment-files-upload-modal/models/attachment-dialog-data.interface';
import { TagType } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost/rfq-4-status.enum';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
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
    AttachmentsComponent,
    PushPipe,
    LoadingSpinnerModule,
  ],
})
export class SqvApprovalStatusCellComponent {
  protected tagType: TagType = TagType.NEUTRAL;
  protected sqvApprovalStatus: SqvApprovalStatus;

  protected showLockedIcon = false;
  protected gqPositionId: string;

  private rfq4Status: Rfq4Status;
  @ViewChild('existingFilesTemplate', { static: true })
  private readonly existingFilesTemplate!: TemplateRef<any>;
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly attachmentFacade: RfqSqvCheckAttachmentFacade = inject(
    RfqSqvCheckAttachmentFacade
  );
  private dialogRef: MatDialogRef<AttachmentFilesUploadModalComponent>;

  private fileNamesToDelete: string[] = [];
  private readonly attachmentsToDelete$$: BehaviorSubject<string[]> =
    new BehaviorSubject<string[]>([]);
  protected existingAttachmentsToDisplay$: Observable<Attachment[]> =
    combineLatest([
      this.attachmentFacade.attachments$,
      this.attachmentsToDelete$$.asObservable(),
    ]).pipe(
      map(([attachments, attachmentsToDelete]) =>
        attachments.filter(
          (attachment) => !attachmentsToDelete.includes(attachment.fileName)
        )
      )
    );
  protected attachmentsSignal: Signal<Attachment[]> = toSignal(
    this.attachmentFacade.attachments$
  );
  protected attachmentsLoading$ = this.attachmentFacade.attachmentsLoading$;

  agInit(params: ICellRendererParams): void {
    this.sqvApprovalStatus = params.value;
    this.gqPositionId = params.data.gqPositionId;
    this.rfq4Status = params.data.rfq4?.rfq4Status;
    this.showLockedIcon = this.getShowLockedIcon(this.rfq4Status);
  }

  onTagClick(): void {
    // depending on the sqvApprovalStatus different actions are performed
    if (this.sqvApprovalStatus === SqvApprovalStatus.APPROVAL_NEEDED) {
      this.openUploadDialog(true);
    }

    if (this.sqvApprovalStatus === SqvApprovalStatus.APPROVED) {
      if (this.showLockedIcon) {
        this.attachmentFacade.downloadAttachments(this.gqPositionId);

        return;
      }

      this.openUploadDialog();
    }
  }

  setFileToBeDeleted(data: Attachment): void {
    this.fileNamesToDelete.push(data.fileName);
    this.attachmentsToDelete$$.next(this.fileNamesToDelete);
  }

  downloadAttachment(data: Attachment): void {
    this.attachmentFacade.downloadAttachments(this.gqPositionId, data);
  }

  private openUploadDialog(uploadOnly = false): void {
    this.attachmentFacade.setGqPositionId(this.gqPositionId);

    this.dialogRef = this.dialog.open(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: {
        fileNames: uploadOnly
          ? computed(() => [] as string[])
          : computed(() => this.attachmentsSignal().map((a) => a.fileName)),
        dialogTitle: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.title'
        ),
        dialogSubtitle: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.subtitle'
        ),
        showWarning: false,
        uploadButtonCaption: translate(
          'shared.uploadDialog.rfqSqvCheckApproval.uploadAttachments.approveButton'
        ),
        upload: (filesToUpload: File[]) =>
          uploadOnly
            ? this.attachmentFacade.uploadAttachments(filesToUpload)
            : this.attachmentFacade.updateAttachments(
                filesToUpload,
                this.fileNamesToDelete
              ),
        uploading$: this.attachmentFacade.attachmentsUploading$,
        uploadSuccess$: this.attachmentFacade.uploadAttachmentsSuccess$,
        displayFileNames: false,
        templateRef: uploadOnly ? null : this.existingFilesTemplate,
        additionalDisableUploadButtonCondition: uploadOnly
          ? null
          : this.attachmentsToDelete$$
              .asObservable()
              .pipe(
                map((attachmentsToDelete) => attachmentsToDelete.length === 0)
              ),
      } as AttachmentDialogData,
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.attachmentFacade.resetGqPositionId();
        this.attachmentFacade.resetAttachments();
        this.fileNamesToDelete = [];
        this.attachmentsToDelete$$.next([]);
      });
  }

  private getShowLockedIcon(status: Rfq4Status): boolean {
    switch (status) {
      case Rfq4Status.IN_PROGRESS:
      case Rfq4Status.CONFIRMED: {
        return true;
      }
      default: {
        return false;
      }
    }
  }
}
