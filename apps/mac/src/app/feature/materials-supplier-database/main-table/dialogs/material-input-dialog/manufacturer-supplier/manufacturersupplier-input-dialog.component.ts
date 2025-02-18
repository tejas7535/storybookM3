import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BehaviorSubject } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaterialInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/services';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import {
  DataResult,
  ManufacturerSupplier,
  ManufacturerSupplierForm,
  ManufacturerSupplierFormValue,
  MaterialFormValue,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { ErrorMessagePipe } from '../../../pipes/error-message-pipe/error-message.pipe';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';
import { ManufacturerSupplierComponent } from '../components/manufacturer-supplier/manufacturer-supplier.component';
import { findProperty } from '../util/form-helpers';

@Component({
  selector: 'mac-manufacturersupplier-input-dialog',
  templateUrl: './manufacturersupplier-input-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    ManufacturerSupplierComponent,
    ErrorMessagePipe,
    // angular material
    MatCheckboxModule,
    MatFormFieldModule,
    // libs
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
  providers: [DialogControlsService],
})
export class ManufacturerSupplierInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public isManufacturerControl: FormControl<boolean>;
  public supplierBusinessPartnerIdsControl =
    this.controlsService.getSupplierBusinessPartnerIdControl();
  public businessPartnerIds$ = this.dialogFacade.businessPartnerIds$;

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade,
    readonly dataFacade: DataFacade,
    readonly dialogRef: MatDialogRef<MaterialInputDialogComponent>,
    readonly snackbar: MsdSnackbarService,
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
      businessPartnerIds: this.supplierBusinessPartnerIdsControl,
    });
  }

  public dispatchDialogOpenEvent(): void {
    this.dialogFacade.manufacturerSupplierDialogOpened();
  }

  patchFields(materialFormValue: Partial<MaterialFormValue>): void {
    super.patchFields(materialFormValue);
    const formValue: Partial<ManufacturerSupplierFormValue> = {
      id: this.materialId,
      name: materialFormValue.supplier,
      plant: materialFormValue.supplierPlant,
      country: materialFormValue.supplierCountry,
      manufacturer: findProperty(materialFormValue, 'manufacturer'),
      businessPartnerIds: materialFormValue.businessPartnerIds,
    };

    this.createMaterialForm.patchValue(formValue);
  }

  enableEditFields(): void {
    this.supplierPlantControl.enable({ emitEvent: false });
    this.supplierCountryControl.enable({ emitEvent: false });
  }

  // TO DO replace with Pipe or attribute!!!!
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
          businessPartnerIds: formValue.businessPartnerIds,
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
      country: baseMaterial.country.id as string,
      name: baseMaterial.name.title,
      plant: baseMaterial.plant.title,
      businessPartnerIds: baseMaterial.businessPartnerIds?.map((so) =>
        Number.parseInt(so.title, 10)
      ),
      manufacturer: findProperty(baseMaterial, 'manufacturer'),
    };

    // include supplier put logic in effect
    this.dialogFacade.manufacturerSupplierDialogConfirmed(supplier);
    this.awaitMaterialComplete(createAnother);
  }

  public addSupplierBusinessPartnerId(supplierBusinessPartnerId: number): void {
    this.dialogFacade.addCustomSupplierBusinessPartnerId(
      supplierBusinessPartnerId
    );
  }
}
