import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  Signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { Subject } from 'rxjs';

import { AccessibleByEnum } from '@gq/calculator/rfq-4-detail-view/models/accessibly-by.enum';
import { RecalculateSqvStatus } from '@gq/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import {
  FileAccessUpdate,
  RfqCalculatorAttachment,
} from '@gq/calculator/rfq-4-detail-view/models/rfq-calculator-attachments.interface';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { AttachmentsComponent } from '@gq/shared/components/attachments/attachments.component';
import { AttachmentFilesUploadModalComponent } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentDialogData } from '@gq/shared/components/modal/attachment-files-upload-modal/models/attachment-dialog-data.interface';
import { DeletingAttachmentModalComponent } from '@gq/shared/components/modal/delete-attachment-modal/delete-attachment-modal.component';
import { DeleteAttachmentDialogData } from '@gq/shared/components/modal/delete-attachment-modal/models/delete-attachment-dialog-data.interface';
import { translate } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-recalculation-attachments',
  templateUrl: './recalculation-attachments.component.html',
  imports: [
    CommonModule,
    AttachmentsComponent,
    LoadingSpinnerModule,
    MatIconModule,
    SharedTranslocoModule,
    MatFormField,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class RecalculationAttachmentsComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly store = inject(Rfq4DetailViewStore);
  private readonly injector = inject(Injector);

  accessibleByOptions = Object.entries(AccessibleByEnum).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  private readonly recalculationStatus: Signal<RecalculateSqvStatus> =
    this.store.getRecalculationStatus;

  readonly isLoggedUserAssignedToRfq = computed(() =>
    this.store.isLoggedUserAssignedToRfq()
  );

  // Check if the user can upload or delete attachments and change attachments access type
  readonly canHandleAttachments = computed(
    () =>
      this.recalculationStatus() === RecalculateSqvStatus.IN_PROGRESS &&
      this.isLoggedUserAssignedToRfq()
  );

  readonly attachments = computed<RfqCalculatorAttachment[]>(
    () => this.store.attachments() || []
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly uploadSuccessfulSubject: Subject<void> = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly deleteSuccessfulSubject: Subject<void> = new Subject<void>();

  attachmentLoading = this.store.attachmentsLoading;

  ngOnInit(): void {
    effect(
      () => {
        if (this.store.isAttachmentUploadSuccess()) {
          this.uploadSuccessfulSubject.next();
        }
      },
      { injector: this.injector }
    );

    effect(
      () => {
        if (this.store.isAttachmentDeleteSuccess()) {
          this.deleteSuccessfulSubject.next();
        }
      },
      { injector: this.injector }
    );
  }

  onAccessChange(
    attachment: RfqCalculatorAttachment,
    access: AccessibleByEnum
  ): void {
    const fileToUpdate: FileAccessUpdate = {
      fileName: attachment.fileName,
      accessibleBy: access,
    };
    this.store.switchAttachmentAccess(fileToUpdate);
  }

  openAddFileDialog(): void {
    this.dialog.open(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: {
        fileNames: this.attachments().map(
          (attachment: RfqCalculatorAttachment) => attachment.fileName
        ),

        upload: this.store.uploadCalculatorAttachments.bind(this.store),
        dialogTitle: translate(
          'calculator.rfq4DetailView.recalculation.attachments.addAttachmentDialogTitle'
        ),
        uploading$: toObservable(this.store.attachmentsLoading, {
          injector: this.injector,
        }),
        uploadSuccess$: this.uploadSuccessfulSubject.asObservable(),
      } as AttachmentDialogData,
    });
  }

  downloadAttachment(attachment: RfqCalculatorAttachment): void {
    this.store.downloadCalculatorAttachment(attachment);
  }

  openConfirmDeleteAttachmentDialog(attachment: RfqCalculatorAttachment): void {
    this.dialog.open(DeletingAttachmentModalComponent, {
      width: '634px',
      disableClose: true,
      data: {
        attachment,
        delete: this.store.deleteCalculatorAttachment.bind(this.store),

        deleting$: toObservable(this.store.attachmentsLoading, {
          injector: this.injector,
        }),
        deleteSuccess$: this.deleteSuccessfulSubject.asObservable(),
      } as DeleteAttachmentDialogData<RfqCalculatorAttachment>,
    });
  }
}
