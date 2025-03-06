import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'd360-confirmation-dialog',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  public constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string;
      title?: string;
      hint?: string;
      buttonNo?: string;
      buttonYes?: string;
    },
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {}

  protected onClick(trueOrFalse: boolean): void {
    this.dialogRef.close(trueOrFalse);
  }
}
