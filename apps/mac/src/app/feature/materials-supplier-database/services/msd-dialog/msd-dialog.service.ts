import { Injectable, TemplateRef, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TypedAction } from '@ngrx/store/src/models';

import { ManufacturerSupplierInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-standard/material-standard-input-dialog.component';
import { AluminumInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/materials/aluminum/aluminum-input-dialog.component';
import { CeramicInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/materials/ceramic/ceramic-input-dialog.component';
import { CopperInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/materials/copper/copper-input-dialog.component';
import { SteelInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/materials/steel/steel-input-dialog.component';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataResult } from '@mac/msd/models';

import { ConfirmDeleteDialogComponent } from '../../main-table/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDisclaimerDialogComponent } from '../../main-table/dialogs/confirm-disclaimer-dialog/confirm-disclaimer-dialog.component';
import { ContactDialogComponent } from '../../main-table/dialogs/contact-dialog/contact-dialog.component';
import { SapMaterialsUploadDialogComponent } from '../../main-table/dialogs/material-input-dialog/materials/sap/sap-materials-upload-dialog.component';
import { SapMaterialsUploadStatusDialogComponent } from '../../main-table/dialogs/material-input-dialog/materials/sap/sap-materials-upload-status-dialog/sap-materials-upload-status-dialog.component';
import { ReferenceDocumentBulkEditDialogComponent } from '../../main-table/dialogs/material-input-dialog/materials/steel/reference-document-bulk-edit-dialog/reference-document-bulk-edit-dialog.component';
import { MoreInformationDialogComponent } from '../../main-table/dialogs/more-information-dialog/more-information-dialog.component';
import { PdfViewerComponent } from '../../main-table/dialogs/pdf-viewer/pdf-viewer.component';

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

  openDialog(
    isResumeDialog?: boolean,
    editDialogInformation?: {
      row: DataResult;
      selectedRows?: DataResult[];
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

  openConfirmDeleteDialog(): MatDialogRef<
    ConfirmDeleteDialogComponent,
    { apply: boolean }
  > {
    return this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px',
      autoFocus: false,
    });
  }

  openBulkEditDialog(
    selectedRows: any[],
    column?: string
  ): MatDialogRef<MaterialInputDialogComponent, { action?: TypedAction<any> }> {
    const rows = selectedRows.map((node) => node.data);
    const combinedRows = this.combineRows(rows);
    this.dataFacade.openMultiEditDialog(rows, combinedRows);

    return this.openDialog(false, {
      row: combinedRows,
      selectedRows: rows,
      column,
      isCopy: false,
      isBulkEdit: true,
    });
  }

  openReferenceDocumentBulkEditDialog(selectedRows: DataResult[]): void {
    this.dialog.open(ReferenceDocumentBulkEditDialogComponent, {
      width: '863px',
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
      data: {
        selectedRows,
      },
    });
  }

  openInfoDialog(
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

  openSapMaterialsUploadDialog(): MatDialogRef<SapMaterialsUploadDialogComponent> {
    return this.dialog.open(SapMaterialsUploadDialogComponent, {
      width: '700px',
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
    });
  }

  openSapMaterialsUploadStatusDialog(): MatDialogRef<SapMaterialsUploadStatusDialogComponent> {
    return this.dialog.open(SapMaterialsUploadStatusDialogComponent, {
      width: '710px',
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
    });
  }

  openContactDialog(): MatDialogRef<ContactDialogComponent> {
    return this.dialog.open(ContactDialogComponent, {
      width: '600px',
      autoFocus: false,
    });
  }

  openDisclaimerDialog(): MatDialogRef<ConfirmDisclaimerDialogComponent> {
    return this.dialog.open(ConfirmDisclaimerDialogComponent, {
      width: '450px',
      autoFocus: true,
      closeOnNavigation: false,
      disableClose: true,
      hasBackdrop: true,
    });
  }

  openPdfDialog(id: number): MatDialogRef<PdfViewerComponent> {
    return this.dialog.open(PdfViewerComponent, {
      data: id,
      width: '70%',
      height: '90%',
      autoFocus: false,
    });
  }

  private getDialogClass(
    materialClass?: MaterialClass,
    navigationLevel?: NavigationLevel
  ): Type<MaterialInputDialogComponent> {
    switch (navigationLevel) {
      case NavigationLevel.MATERIAL: {
        switch (materialClass) {
          case MaterialClass.ALUMINUM: {
            return AluminumInputDialogComponent;
          }
          case MaterialClass.STEEL: {
            return SteelInputDialogComponent;
          }
          case MaterialClass.COPPER: {
            return CopperInputDialogComponent;
          }
          case MaterialClass.CERAMIC: {
            return CeramicInputDialogComponent;
          }
          default: {
            return SteelInputDialogComponent;
          }
        }
      }
      case NavigationLevel.STANDARD: {
        return MaterialStandardInputDialogComponent;
      }
      case NavigationLevel.SUPPLIER: {
        return ManufacturerSupplierInputDialogComponent;
      }
      default: {
        return SteelInputDialogComponent;
      }
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
