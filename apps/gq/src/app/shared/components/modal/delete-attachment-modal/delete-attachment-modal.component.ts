import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationAttachment } from '@gq/shared/models';

@Component({
  selector: 'gq-delete-attachment-modal',
  templateUrl: './delete-attachment-modal.component.html',
})
export class DeletingAttachmentModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      attachment: QuotationAttachment;
    },
    private readonly dialogRef: MatDialogRef<DeletingAttachmentModalComponent>,
    public readonly activeCaseFacade: ActiveCaseFacade
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.activeCaseFacade.deleteAttachment(this.modalData.attachment);

    this.activeCaseFacade.deleteAttachmentSuccess$
      .pipe(take(1))
      .subscribe(() => {
        this.closeDialog();
      });
  }
}
