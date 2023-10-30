import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-delete-custom-view-modal',
  templateUrl: './delete-custom-view-modal.component.html',
})
export class DeleteCustomViewModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<DeleteCustomViewModalComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close({ delete: false });
  }

  confirm(): void {
    this.dialogRef.close({ delete: true });
  }
}
