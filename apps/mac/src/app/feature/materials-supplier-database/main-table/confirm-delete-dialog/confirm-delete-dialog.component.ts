import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-confirm-delete-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    PushPipe,
    MatButtonModule,
    ReactiveFormsModule,
    LetDirective,
    SharedTranslocoModule,
  ],
  templateUrl: './confirm-delete-dialog.component.html',
})
export class ConfirmDeleteDialogComponent {
  public navigation$;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    public dataFacade: DataFacade
  ) {
    this.navigation$ = dataFacade.navigation$;
  }

  // on cancel dialog
  closeDialog(): void {
    this.dialogRef.close(false);
  }

  // on apply dialog
  applyDialog(): void {
    this.dialogRef.close(true);
  }
}
