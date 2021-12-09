import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent implements OnInit {
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

  ngOnInit(): void {
    this.dialogRef.updateSize('40%');
  }

  closeDialog(confirm: boolean) {
    this.dialogRef.close(confirm);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
