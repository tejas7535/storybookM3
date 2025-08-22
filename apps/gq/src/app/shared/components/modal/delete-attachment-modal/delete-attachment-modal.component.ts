import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { DeleteAttachmentDialogData } from './models/delete-attachment-dialog-data.interface';

@Component({
  selector: 'gq-delete-attachment-modal',
  templateUrl: './delete-attachment-modal.component.html',
  imports: [
    CommonModule,
    PushPipe,
    MatButtonModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
  ],
})
export class DeletingAttachmentModalComponent<T extends Attachment> {
  modalData: DeleteAttachmentDialogData<T> = inject(MAT_DIALOG_DATA);
  private readonly dialogRef: MatDialogRef<
    DeletingAttachmentModalComponent<T>
  > = inject(MatDialogRef);

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.modalData.delete(this.modalData.attachment);

    this.modalData.deleteSuccess$.pipe(take(1)).subscribe(() => {
      this.closeDialog();
    });
  }
}
