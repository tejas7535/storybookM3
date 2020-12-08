import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-delete-accept',
  templateUrl: './delete-accept.component.html',
  styleUrls: ['./delete-accept.component.scss'],
})
export class DeleteAcceptComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteAcceptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
