import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, take } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  materialstandardDialogConfirmed,
  materialstandardDialogOpened,
  resetMaterialRecord,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import {
  DataResult,
  MaterialFormValueV2,
  MaterialStandardForm,
  MaterialStandardFormValue,
  MaterialStandardV2,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-material-standard-input-dialog',
  templateUrl: './material-standard-input-dialog.component.html',
})
export class MaterialStandardInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public materialNumberControl: FormControl<string>;

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade,
    readonly dataFacade: DataFacade,
    readonly dialogRef: MatDialogRef<MaterialInputDialogComponent>,
    readonly snackbar: MatSnackBar,
    readonly cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    readonly dialogData: {
      editDialogInformation?: { row: DataResult; column: string };
      isResumeDialog: boolean;
    }
  ) {
    super(
      controlsService,
      dialogFacade,
      dataFacade,
      dialogRef,
      snackbar,
      cdRef,
      dialogData
    );
    this.editLoading$ = new BehaviorSubject(!!dialogData.editDialogInformation);
  }

  ngOnInit(): void {
    // enable numberControl only for specific material
    this.materialNumberControl =
      this.materialClass === MaterialClass.STEEL
        ? this.controlsService.getSteelNumberControl()
        : this.controlsService.getControl(undefined, true);
    this.createMaterialForm = new FormGroup<MaterialStandardForm>({
      id: this.materialStandardIdControl,
      materialName: this.materialNamesControl,
      standardDocument: this.standardDocumentsControl,
      materialNumber: this.materialNumberControl,
    });
  }

  public showMaterialNumber() {
    return this.materialNumberControl.enabled;
  }

  public dispatchDialogOpenEvent(): void {
    this.dialogFacade.dispatch(materialstandardDialogOpened());
  }

  patchFields(materialFormValue: Partial<MaterialFormValueV2>): void {
    const formValue: Partial<MaterialStandardFormValue> = {
      ...materialFormValue,
      id: this.materialId,
    };

    this.createMaterialForm.patchValue(formValue);
  }

  enableEditFields(): void {}

  public getTitle(): string {
    return this.isEditDialog()
      ? translate(
          'materialsSupplierDatabase.mainTable.dialog.updateMaterialStandardTitle',
          {
            class: translate(
              `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
            ),
          }
        )
      : translate(
          'materialsSupplierDatabase.mainTable.dialog.addMaterialStandardTitle',
          {
            class: translate(
              `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
            ),
          }
        );
  }

  public confirmMaterial(): void {
    const baseMaterial = this.createMaterialForm
      .value as MaterialStandardFormValue;

    const standard: MaterialStandardV2 = {
      id: baseMaterial.id,
      materialName: baseMaterial.materialName.title,
      materialNumber:
        'materialNumber' in baseMaterial
          ? baseMaterial.materialNumber?.split(',')
          : undefined,
      standardDocument: baseMaterial.standardDocument.title,
    };

    // include stdDoc put logic in effect
    this.dialogFacade.dispatch(materialstandardDialogConfirmed({ standard }));

    this.dialogFacade.createMaterialRecord$
      .pipe(filter(Boolean), take(1))
      .subscribe((record) => {
        let msgKey;
        if (!record.error) {
          this.closeDialog(true);
          msgKey =
            'materialsSupplierDatabase.mainTable.dialog.createMaterialStandardSuccess';
        } else {
          msgKey =
            'materialsSupplierDatabase.mainTable.dialog.createMaterialStandardFailure';
        }
        this.showInSnackbar(
          translate(msgKey),
          translate('materialsSupplierDatabase.mainTable.dialog.close'),
          { duration: 5000 }
        );
        this.dialogFacade.dispatch(
          resetMaterialRecord({ closeDialog: !record.error })
        );
      });
  }
}
