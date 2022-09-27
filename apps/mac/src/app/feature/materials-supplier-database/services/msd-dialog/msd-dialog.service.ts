import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { InputDialogComponent } from '@mac/msd/main-table/input-dialog/input-dialog.component';
import { DataResult, MaterialFormValue } from '@mac/msd/models';

@Injectable()
export class MsdDialogService {
  constructor(private readonly dialog: MatDialog) {}

  public openDialog(
    isResumeDialog?: boolean,
    editDialogInformation?: { row: DataResult; column: string }
  ): MatDialogRef<
    InputDialogComponent,
    {
      reload?: boolean;
      minimize?: { id?: number; value: MaterialFormValue };
    }
  > {
    return this.dialog.open(InputDialogComponent, {
      width: '863px',
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
      data: { editDialogInformation, isResumeDialog },
    });
  }
}
