import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { ConfirmDeleteDialogComponent } from '@mac/msd/main-table/confirm-delete-dialog/confirm-delete-dialog.component';
import { ManufacturerSupplierInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-standard/material-standard-input-dialog.component';
import { AluminumInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/aluminum/aluminum-input-dialog.component';
import { CeramicInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/ceramic/ceramic-input-dialog.component';
import { CopperInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/copper/copper-input-dialog.component';
import { SteelInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/steel/steel-input-dialog.component';
import { DataResult, MaterialFormValue } from '@mac/msd/models';

@Injectable()
export class MsdDialogService {
  private dialogType: Type<MaterialInputDialogComponent>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly dataFacade: DataFacade
  ) {
    this.dataFacade.navigation$.subscribe(
      (nav) =>
        (this.dialogType = this.getDialogClass(
          nav.materialClass,
          nav.navigationLevel
        ))
    );
  }

  public openDialog(
    isResumeDialog?: boolean,
    editDialogInformation?: {
      row: DataResult;
      column: string;
      isCopy?: boolean;
    }
  ): MatDialogRef<
    MaterialInputDialogComponent,
    {
      reload?: boolean;
      minimize?: { id?: number; value: MaterialFormValue };
    }
  > {
    return this.dialog.open(this.dialogType, {
      width: '863px',
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
      data: {
        editDialogInformation,
        isResumeDialog,
      },
    });
  }

  private getDialogClass(
    materialClass?: MaterialClass,
    navigationLevel?: NavigationLevel
  ): Type<MaterialInputDialogComponent> {
    switch (navigationLevel) {
      case NavigationLevel.MATERIAL:
        switch (materialClass) {
          case MaterialClass.ALUMINUM:
            return AluminumInputDialogComponent;
          case MaterialClass.STEEL:
            return SteelInputDialogComponent;
          case MaterialClass.COPPER:
            return CopperInputDialogComponent;
          case MaterialClass.CERAMIC:
            return CeramicInputDialogComponent;
          default:
            return SteelInputDialogComponent;
        }
      case NavigationLevel.STANDARD:
        return MaterialStandardInputDialogComponent;
      case NavigationLevel.SUPPLIER:
        return ManufacturerSupplierInputDialogComponent;
      default:
        return SteelInputDialogComponent;
    }
  }

  public openConfirmDeleteDialog(): MatDialogRef<
    ConfirmDeleteDialogComponent,
    { apply: boolean }
  > {
    return this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px',
      autoFocus: false,
    });
  }
}
