/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaterialInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/services';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { CeramicMaterialForm, DataResult } from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { BaseDialogComponent } from '../../base-dialog/base-dialog.component';
import { Co2ComponentComponent } from '../../components/co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from '../../components/manufacturer-supplier/manufacturer-supplier.component';
import { MaterialDialogBasePartDirective } from '../../components/material-dialog-base-part/material-dialog-base-part.directive';
import { MaterialStandardComponent } from '../../components/material-standard/material-standard.component';

@Component({
  selector: 'mac-ceramic-input-dialog',
  templateUrl: './ceramic-input-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    MaterialStandardComponent,
    ManufacturerSupplierComponent,
    Co2ComponentComponent,
    MaterialDialogBasePartDirective,
    // forms
    ReactiveFormsModule,
    // libs
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  providers: [DialogControlsService],
})
export class CeramicInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public materialClass = MaterialClass.CERAMIC;

  public co2Classification$ = this.dialogFacade.co2Classification$;
  public categories$ = this.dialogFacade.categories$;
  public conditions$ = this.dialogFacade.conditions$;

  public conditionControl =
    this.controlsService.getRequiredControl<StringOption>();

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
    // setup material formular values
    this.createMaterialForm = new FormGroup<CeramicMaterialForm>({
      manufacturerSupplierId: this.manufacturerSupplierIdControl,
      materialStandardId: this.materialStandardIdControl,
      productCategory: this.categoriesControl,
      co2Scope1: this.co2Scope1Control,
      co2Scope2: this.co2Scope2Control,
      co2Scope3: this.co2Scope3Control,
      co2PerTon: this.co2TotalControl,
      co2Classification: this.co2ClassificationControl,
      releaseRestrictions: this.releaseRestrictionsControl,

      // these controls are not used for creating a material, only for materialStandards or manufacturerSuppliers
      standardDocument: this.standardDocumentsControl,
      materialName: this.materialNamesControl,
      supplier: this.supplierControl,
      supplierPlant: this.supplierPlantControl,
      supplierCountry: this.supplierCountryControl,

      // Ceramic specific controls
      condition: this.conditionControl,
    });

    this.createMaterialForm.valueChanges.subscribe((val) => {
      this.dialogFacade.updateCreateMaterialDialogValues(val);
    });
  }
}
