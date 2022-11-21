import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MaterialClass } from '@mac/msd/constants';
import { InputDialogComponent } from '@mac/msd/main-table/input-dialog/input-dialog.component';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { AluminumInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/aluminum/aluminum-input-dialog.component';
import { DataResult, MaterialFormValue } from '@mac/msd/models';

@Injectable()
export class MsdDialogService {
  constructor(private readonly dialog: MatDialog) {}

  public openDialog(
    isResumeDialog?: boolean,
    editDialogInformation?: { row: DataResult; column: string },
    materialClass: MaterialClass = MaterialClass.STEEL
  ): MatDialogRef<
    MaterialInputDialogComponent | InputDialogComponent,
    {
      reload?: boolean;
      minimize?: { id?: number; value: MaterialFormValue };
    }
  > {
    return this.dialog.open(this.getDialogClass(materialClass), {
      width: '863px',
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
      data: { editDialogInformation, isResumeDialog },
    });
  }

  private getDialogClass(
    materialClass: MaterialClass
  ): Type<MaterialInputDialogComponent | InputDialogComponent> {
    switch (materialClass) {
      case MaterialClass.ALUMINUM:
        return AluminumInputDialogComponent;
      case MaterialClass.STEEL:
        return InputDialogComponent;
      default:
        return InputDialogComponent;
    }
  }
}
