import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';

import { ConfirmationModalData } from './models/confirmation-modal-data.model';
@Component({
  selector: 'gq-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  hostDirectives: [DragDialogDirective],
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmationModalData
  ) {}

  closeDialog(confirm: boolean) {
    this.dialogRef.close(confirm);
  }
}
