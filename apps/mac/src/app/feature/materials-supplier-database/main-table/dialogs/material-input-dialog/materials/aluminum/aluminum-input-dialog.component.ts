import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaterialInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/services';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { AluminumMaterialForm, DataResult } from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { BaseDialogComponent } from '../../base-dialog/base-dialog.component';
import { Co2ComponentComponent } from '../../components/co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from '../../components/manufacturer-supplier/manufacturer-supplier.component';
import { MaterialStandardComponent } from '../../components/material-standard/material-standard.component';
import { RecyclingRateComponent } from '../../components/recycline-rate/recycling-rate.component';

@Component({
  selector: 'mac-aluminum-input-dialog',
  templateUrl: './aluminum-input-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    MaterialStandardComponent,
    ManufacturerSupplierComponent,
    Co2ComponentComponent,
    RecyclingRateComponent,
    // libs
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  providers: [DialogControlsService],
})
export class AluminumInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public materialClass = MaterialClass.ALUMINUM;

  public co2Classification$ = this.dialogFacade.co2Classification$;
  public categories$ = this.dialogFacade.categories$;
  public minRecyclingRateControl = this.controlsService.getNumberControl(
    undefined,
    false
  );
  public maxRecyclingRateControl = this.controlsService.getNumberControl(
    undefined,
    false
  );

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
    this.createMaterialForm = new FormGroup<AluminumMaterialForm>({
      manufacturerSupplierId: this.manufacturerSupplierIdControl,
      materialStandardId: this.materialStandardIdControl,
      productCategory: this.categoriesControl,
      co2Scope1: this.co2Scope1Control,
      co2Scope2: this.co2Scope2Control,
      co2Scope3: this.co2Scope3Control,
      co2PerTon: this.co2TotalControl,
      co2Classification: this.co2ClassificationControl,
      releaseRestrictions: this.releaseRestrictionsControl,
      minRecyclingRate: this.minRecyclingRateControl,
      maxRecyclingRate: this.maxRecyclingRateControl,

      // these controls are not used for creating a material, only for materialStandards or manufacturerSuppliers
      standardDocument: this.standardDocumentsControl,
      materialName: this.materialNamesControl,
      supplier: this.supplierControl,
      supplierPlant: this.supplierPlantControl,
      supplierCountry: this.supplierCountryControl,
    });
    this.createMaterialForm.valueChanges.subscribe((val) => {
      this.dialogFacade.updateCreateMaterialDialogValues(val);
    });
  }
}
