import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      displayText: string;
      confirmButton: string;
      cancelButton: string;
      list?: { id: string; value: string }[];
    }
  ) {}

  closeDialog(confirm: boolean) {
    this.dialogRef.close(confirm);
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
