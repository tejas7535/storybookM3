/* eslint-disable max-lines */
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, takeUntil } from 'rxjs';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  addCustomCastingDiameter,
  addCustomReferenceDocument,
  fetchCastingDiameters,
  fetchReferenceDocuments,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import { CopperMaterialForm, DataResult } from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-copper-input-dialog',
  templateUrl: './copper-input-dialog.component.html',
})
export class CopperInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit
{
  public materialClass = MaterialClass.COPPER;

  public castingModes$ = this.dialogFacade.castingModes$;
  public co2Classification$ = this.dialogFacade.co2Classification$;
  public categories$ = this.dialogFacade.categories$;
  public productionProcesses$ = this.dialogFacade.productionProcesses$;
  public castingDiameters$ = this.dialogFacade.castingDiameters$;
  public referenceDocuments$ = this.dialogFacade.referenceDocuments$;

  public materialNumberControl = this.controlsService.getSteelNumberControl();
  public castingModesControl = this.controlsService.getRequiredControl<string>(
    undefined,
    true
  );
  public castingDiameterControl = this.controlsService.getControl<StringOption>(
    undefined,
    true
  );
  public maxDimControl = this.controlsService.getNumberControl();
  public referenceDocumentControl =
    this.controlsService.getControl<StringOption[]>();
  public productionProcessControl =
    this.controlsService.getControl<StringOption>();

  // casting diameter dependencies
  castingDiameterDep: FormGroup<{
    supplierId: FormControl<number>;
    castingMode: FormControl<string>;
  }>;

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
    // setup material formular values
    this.createMaterialForm = new FormGroup<CopperMaterialForm>({
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

      // copper specific controls
      castingDiameter: this.castingDiameterControl,
      castingMode: this.castingModesControl,
      materialNumber: this.materialNumberControl,
      maxDimension: this.maxDimControl,
      referenceDoc: this.referenceDocumentControl,
      productionProcess: this.productionProcessControl,
    });

    // only enable casting mode after supplier is selected
    this.supplierCountryControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((country) => {
        if (country) {
          this.castingModesControl.enable();
        } else {
          this.castingModesControl.disable();
        }
      });

    // fetch casting diameters from selected supplier
    this.castingDiameterDep = new FormGroup({
      supplierId: this.manufacturerSupplierIdControl,
      castingMode: this.castingModesControl,
    });
    this.castingDiameterDep.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ supplierId, castingMode }) => {
        if (castingMode) {
          this.castingDiameterControl.enable();
          if (supplierId) {
            this.dialogFacade.dispatch(
              fetchCastingDiameters({ supplierId, castingMode })
            );
          }
        } else {
          this.castingDiameterControl.reset();
          this.castingDiameterControl.disable();
        }
      });

    this.materialStandardIdControl.valueChanges
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((id) =>
        this.dialogFacade.dispatch(
          fetchReferenceDocuments({ materialStandardId: id })
        )
      );
  }

  public addReferenceDocument(referenceDocument: string): void {
    this.dialogFacade.dispatch(
      addCustomReferenceDocument({ referenceDocument })
    );
  }

  public addCastingDiameter(castingDiameter: string): void {
    this.dialogFacade.dispatch(addCustomCastingDiameter({ castingDiameter }));
  }
}
