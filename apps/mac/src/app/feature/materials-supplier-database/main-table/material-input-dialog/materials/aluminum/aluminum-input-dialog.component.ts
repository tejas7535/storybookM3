import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject } from 'rxjs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import { AluminumMaterialForm, DataResult } from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-aluminum-input-dialog',
  templateUrl: './aluminum-input-dialog.component.html',
})
export class AluminumInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public materialClass = MaterialClass.ALUMINUM;

  public co2Classification$ = this.dialogFacade.co2Classification$;
  public categories$ = this.dialogFacade.categories$;

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade,
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
      dialogRef,
      snackbar,
      cdRef,
      dialogData
    );
    this.editLoading$ = new BehaviorSubject(!!dialogData.editDialogInformation);
  }

  ngOnInit(): void {
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

      // these controls are not used for creating a material, only for materialStandards or manufacturerSuppliers
      standardDocument: this.standardDocumentsControl,
      materialName: this.materialNamesControl,
      supplier: this.supplierControl,
      supplierPlant: this.supplierPlantControl,
      supplierCountry: this.supplierCountryControl,
    });
  }
}
