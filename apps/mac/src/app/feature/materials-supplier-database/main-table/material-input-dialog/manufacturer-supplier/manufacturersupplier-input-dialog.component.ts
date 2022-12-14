import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, take } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  manufacturerSupplierDialogConfirmed,
  manufacturerSupplierDialogOpened,
  resetMaterialRecord,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import {
  DataResult,
  ManufacturerSupplierForm,
  ManufacturerSupplierFormValue,
  ManufacturerSupplierV2,
  MaterialFormValueV2,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-manufacturersupplier-input-dialog',
  templateUrl: './manufacturersupplier-input-dialog.component.html',
})
export class ManufacturerSupplierInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public isManufacturerControl: FormControl<boolean>;

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
    this.isManufacturerControl =
      this.materialClass === MaterialClass.STEEL
        ? this.controlsService.getControl<boolean>()
        : this.controlsService.getControl<boolean>(undefined, true);

    this.createMaterialForm = new FormGroup<ManufacturerSupplierForm>({
      id: this.manufacturerSupplierIdControl,
      name: this.supplierControl,
      plant: this.supplierPlantControl,
      country: this.supplierCountryControl,
      manufacturer: this.isManufacturerControl,
    });
  }

  public dispatchDialogOpenEvent(): void {
    this.dialogFacade.dispatch(manufacturerSupplierDialogOpened());
  }

  patchFields(materialFormValue: Partial<MaterialFormValueV2>): void {
    const formValue: Partial<ManufacturerSupplierFormValue> = {
      id: this.materialId,
      name: materialFormValue.supplier,
      plant: materialFormValue.supplierPlant,
      country: materialFormValue.supplierCountry,
      manufacturer:
        'manufacturer' in materialFormValue
          ? materialFormValue.manufacturer
          : undefined,
    };

    this.createMaterialForm.patchValue(formValue);
  }

  enableEditFields(): void {
    this.supplierPlantControl.enable({ emitEvent: false });
    this.supplierCountryControl.enable({ emitEvent: false });
  }

  public showIsManufacturer(): boolean {
    return this.isManufacturerControl.enabled;
  }

  public getTitle(): string {
    return this.isEditDialog()
      ? translate(
          'materialsSupplierDatabase.mainTable.dialog.updateManufacturerSupplierTitle',
          {
            class: translate(
              `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
            ),
          }
        )
      : translate(
          'materialsSupplierDatabase.mainTable.dialog.addManufacturerSupplierTitle',
          {
            class: translate(
              `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
            ),
          }
        );
  }

  public confirmMaterial(): void {
    const baseMaterial = this.createMaterialForm
      .value as ManufacturerSupplierFormValue;

    const supplier: ManufacturerSupplierV2 = {
      id: baseMaterial.id,
      country: baseMaterial.country.title,
      name: baseMaterial.name.title,
      plant: baseMaterial.plant.title,
      sapData: undefined,
      manufacturer:
        'manufacturer' in baseMaterial ? baseMaterial.manufacturer : undefined,
    };

    // include supplier put logic in effect
    this.dialogFacade.dispatch(
      manufacturerSupplierDialogConfirmed({ supplier })
    );

    this.dialogFacade.createMaterialRecord$
      .pipe(filter(Boolean), take(1))
      .subscribe((record) => {
        let msgKey;
        if (!record.error) {
          this.closeDialog(true);
          msgKey =
            'materialsSupplierDatabase.mainTable.dialog.createManufacturerSupplierSuccess';
        } else {
          msgKey =
            'materialsSupplierDatabase.mainTable.dialog.createManufacturerSupplierFailure';
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
