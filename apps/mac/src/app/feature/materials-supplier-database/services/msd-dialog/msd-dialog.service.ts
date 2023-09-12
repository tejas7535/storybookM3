import { Injectable, TemplateRef, Type } from '@angular/core';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { TypedAction } from '@ngrx/store/src/models';

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
import { DataResult } from '@mac/msd/models';

import { MoreInformationDialogComponent } from '../../main-table/more-information-dialog/more-information-dialog.component';
import { openMultiEditDialog } from '../../store/actions/dialog';

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
      isBulkEdit?: boolean;
    }
  ): MatDialogRef<MaterialInputDialogComponent, { action?: TypedAction<any> }> {
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

  public openConfirmDeleteDialog(): MatDialogRef<
    ConfirmDeleteDialogComponent,
    { apply: boolean }
  > {
    return this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px',
      autoFocus: false,
    });
  }

  public openBulkEditDialog(
    selectedRows: any[],
    column?: string
  ): MatDialogRef<MaterialInputDialogComponent, { action?: TypedAction<any> }> {
    const rows = selectedRows.map((node) => node.data);
    const combinedRows = this.combineRows(rows);
    this.dataFacade.dispatch(openMultiEditDialog({ rows, combinedRows }));

    return this.openDialog(false, {
      row: combinedRows,
      column,
      isCopy: false,
      isBulkEdit: true,
    });
  }

  public openInfoDialog(
    title?: string,
    topText?: string,
    imageSrc?: string,
    imageCaption?: string,
    bottomText?: string,
    contact?: string,
    mailToLink?: string,
    bottomTemplate?: TemplateRef<any>
  ): MatDialogRef<MoreInformationDialogComponent> {
    return this.dialog.open(MoreInformationDialogComponent, {
      data: {
        title,
        topText,
        imageSrc,
        imageCaption,
        bottomText,
        contact,
        mailToLink,
        bottomTemplate,
      },
      autoFocus: false,
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

  private __transformValue(data: any): any {
    return Array.isArray(data) ? JSON.stringify(data) : data;
  }

  private combineRows<T>(rows: T[]): T {
    const result: Record<any, any> = {};
    for (const key in rows[0]) {
      const val = rows
        // get list of property keys
        .map((row) => row[key])
        // either all values are equal or undefined
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce(
          (acc, curr) =>
            this.__transformValue(acc) === this.__transformValue(curr)
              ? curr
              : undefined,
          rows[0][key]
        );
      result[key] = val;
    }

    return result;
  }
}
