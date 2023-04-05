import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject } from 'rxjs';

import { translate } from '@ngneat/transloco';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  addCustomSupplierSapId,
  manufacturerSupplierDialogConfirmed,
  manufacturerSupplierDialogOpened,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import {
  DataResult,
  ManufacturerSupplier,
  ManufacturerSupplierForm,
  ManufacturerSupplierFormValue,
  MaterialFormValue,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { findProperty } from '../util/form-helpers';

@Component({
  selector: 'mac-manufacturersupplier-input-dialog',
  templateUrl: './manufacturersupplier-input-dialog.component.html',
})
export class ManufacturerSupplierInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public isManufacturerControl: FormControl<boolean>;
  public supplierSapIdsControl = this.controlsService.getSapSupplierIdControl();
  public supplierSapIds$ = this.dialogFacade.supplierSapIds$;

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
    super.ngOnInit();
    // enable manufacturerControl only for specific material
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
      sapSupplierIds: this.supplierSapIdsControl,
    });
  }

  public dispatchDialogOpenEvent(): void {
    this.dialogFacade.dispatch(manufacturerSupplierDialogOpened());
  }

  patchFields(materialFormValue: Partial<MaterialFormValue>): void {
    super.patchFields(materialFormValue);
    const formValue: Partial<ManufacturerSupplierFormValue> = {
      id: this.materialId,
      name: materialFormValue.supplier,
      plant: materialFormValue.supplierPlant,
      country: materialFormValue.supplierCountry,
      manufacturer: findProperty(materialFormValue, 'manufacturer'),
      sapSupplierIds: materialFormValue.sapSupplierIds,
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
    return this.isEditDialog() && !this.isCopyDialog()
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

  public minimizeDialog(): void {
    const formValue = this.createMaterialForm.getRawValue();
    this.dialogRef.close({
      minimize: {
        id: this.materialId,
        value: {
          supplier: formValue.name,
          supplierPlant: formValue.plant,
          supplierCountry: formValue.country,
          manufacturer: formValue.manufacturer,
          sapSupplierIds: formValue.sapSupplierIds,
        },
        isCopy: this.isCopy,
      },
    });
  }

  public confirmMaterial(createAnother: boolean): void {
    // needs getRawValue as country-field is sometimes disabled
    const baseMaterial =
      this.createMaterialForm.getRawValue() as ManufacturerSupplierFormValue;

    const supplier: ManufacturerSupplier = {
      id: baseMaterial.id,
      country: baseMaterial.country.title,
      name: baseMaterial.name.title,
      plant: baseMaterial.plant.title,
      sapIds: baseMaterial.sapSupplierIds?.map((so) => so.title as string),
      manufacturer: findProperty(baseMaterial, 'manufacturer'),
    };

    // include supplier put logic in effect
    this.dialogFacade.dispatch(
      manufacturerSupplierDialogConfirmed({ supplier })
    );
    this.awaitMaterialComplete(createAnother, NavigationLevel.SUPPLIER);
  }

  public addSupplierSapId(supplierSapId: string): void {
    this.dialogFacade.dispatch(addCustomSupplierSapId({ supplierSapId }));
  }
}
