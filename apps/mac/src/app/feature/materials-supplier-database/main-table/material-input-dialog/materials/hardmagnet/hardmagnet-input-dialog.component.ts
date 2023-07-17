/* eslint-disable max-lines */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { BehaviorSubject } from 'rxjs';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { HardmagnetMaterialForm } from '@mac/feature/materials-supplier-database/models/data/hardmagnet';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { addCustomMaterialStandardName } from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import { DataResult } from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-hardmagnet-input-dialog',
  templateUrl: './hardmagnet-input-dialog.component.html',
})
export class HardmagnetInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit, AfterViewInit
{
  public materialClass = MaterialClass.HARDMAGNET;

  public co2Classification$ = this.dialogFacade.co2Classification$;
  public categories$ = this.dialogFacade.categories$;
  public coatings$ = this.dialogFacade.coatings$;
  public productionProcesses$ = this.dialogFacade.productionProcesses$;
  public readonly materialNames$ = this.dialogFacade.materialNames$;

  public coatingControl =
    this.controlsService.getRequiredControl<StringOption>();
  public productionProcessControl =
    this.controlsService.getRequiredControl<StringOption>();
  public materialGradeControl = this.controlsService.getControl<string>();

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
    this.standardDocumentsControl.removeValidators(Validators.required);
    this.categoriesControl.removeValidators(Validators.required);
    // after removing the validator the control needs to be reset / updated to lose 'invalid' state
    this.categoriesControl.reset();
  }

  ngOnInit(): void {
    super.ngOnInit();
    // setup material formular values
    this.createMaterialForm = new FormGroup<HardmagnetMaterialForm>({
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

      // Hardmagnet specific controls
      coating: this.coatingControl,
      productionProcess: this.productionProcessControl,
      grade: this.materialGradeControl,
    });
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // as only materialname is available, generate a stdDoc name and set the ID on updates
    this.materialNamesControl.valueChanges.subscribe((so) => {
      const id = so?.id as number;
      const title: string = so ? `stdDoc for ${so.title}` : undefined;
      const stdDoc: StringOption = so ? { id, title } : undefined;

      this.standardDocumentsControl.setValue(stdDoc);
      this.materialStandardIdControl.setValue(id);
    });
  }

  // callback function for schaeffler-select (material name)
  public addMaterialName(materialName: string): void {
    this.dialogFacade.dispatch(addCustomMaterialStandardName({ materialName }));
  }
}
