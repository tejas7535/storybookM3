import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { BehaviorSubject } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaterialInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/services';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import {
  DataResult,
  MaterialFormValue,
  MaterialStandard,
  MaterialStandardForm,
  MaterialStandardFormValue,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { BaseDialogComponent } from '../base-dialog/base-dialog.component';
import { MaterialStandardComponent } from '../components/material-standard/material-standard.component';
import { mapProperty } from '../util/form-helpers';

@Component({
  selector: 'mac-material-standard-input-dialog',
  templateUrl: './material-standard-input-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    // angular material
    MatFormFieldModule,
    MaterialStandardComponent,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
  providers: [DialogControlsService],
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
    // enable numberControl only for specific material
    this.materialNumberControl = this.createMaterialNumberControl();
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
    this.dialogFacade.materialStandardDialogOpened();
  }

  patchFields(materialFormValue: Partial<MaterialFormValue>): void {
    const formValue: Partial<MaterialStandardFormValue> = {
      ...materialFormValue,
      id: this.materialId,
    };

    this.createMaterialForm.patchValue(formValue);
  }

  enableEditFields(): void {}

  public getTitle(): string {
    return this.isEditDialog() && !this.isCopyDialog()
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

  public getMaterialNumberTranslationKey(): string {
    switch (this.materialClass) {
      case MaterialClass.STEEL: {
        return 'steelNumber';
      }
      case MaterialClass.COPPER: {
        return 'copperNumber';
      }
      default: {
        return '';
      }
    }
  }

  public getMaterialNumberPlaceholder(): string {
    switch (this.materialClass) {
      case MaterialClass.STEEL: {
        return '1.1234';
      }
      case MaterialClass.COPPER: {
        return '2.1234';
      }
      default: {
        return '';
      }
    }
  }

  public confirmMaterial(createAnother: boolean): void {
    const baseMaterial = this.createMaterialForm
      .value as MaterialStandardFormValue;

    const standard: MaterialStandard = this.buildMaterialStandard(baseMaterial);

    // include stdDoc put logic in effect
    this.dialogFacade.materialStandardDialogConfirmed(standard);
    this.awaitMaterialComplete(createAnother);
  }

  protected buildMaterialStandard(
    baseMaterial: MaterialStandardFormValue
  ): MaterialStandard {
    return {
      id: baseMaterial.id,
      materialName: baseMaterial.materialName.title,
      materialNumber: mapProperty<string>(
        baseMaterial,
        'materialNumber',
        (val) => (val.length > 0 ? val.split(/,\s?/) : undefined)
      ),
      standardDocument: baseMaterial.standardDocument.title,
    };
  }

  private createMaterialNumberControl(): FormControl<string> {
    switch (this.materialClass) {
      case MaterialClass.STEEL: {
        return this.controlsService.getSteelNumberControl();
      }
      case MaterialClass.COPPER: {
        return this.controlsService.getCopperNumberControl();
      }
      default: {
        return this.controlsService.getControl(undefined, true);
      }
    }
  }
}
