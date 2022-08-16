/* eslint-disable max-lines */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, Subject, take, takeUntil, tap } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import { DialogControlsService } from '@mac/msd/main-table/input-dialog/services';
import {
  ManufacturerSupplier,
  Material,
  MaterialStandard,
} from '@mac/msd/models';
import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomSupplierName,
  addCustomSupplierPlant,
  addMaterialDialogConfirmed,
  DialogFacade,
  fetchCastingDiameters,
} from '@mac/msd/store';

import * as util from './util';

@Component({
  selector: 'mac-input-dialog',
  templateUrl: './input-dialog.component.html',
})
export class InputDialogComponent implements OnInit, OnDestroy {
  // mocks
  public referenceDocument: StringOption[] = [];
  //  observables
  public standardDocuments$ = this.dialogFacade.standardDocuments$;
  public materialNames$ = this.dialogFacade.materialNames$;
  public suppliers$ = this.dialogFacade.suppliers$;
  public supplierPlants$ = this.dialogFacade.supplierPlants$;
  public castingModes$ = this.dialogFacade.castingModes$;
  public co2Classification$ = this.dialogFacade.co2Classification$;
  public ratings$ = this.dialogFacade.ratings$;
  public categories$ = this.dialogFacade.categories$;
  public steelMakingProcess$ = this.dialogFacade.steelMakingProcess$;
  public dialogLoading$ = this.dialogFacade.dialogLoading$;
  public createMaterialLoading$ = this.dialogFacade.createMaterialLoading$;
  public castingDiameters$ = this.dialogFacade.castingDiameters$;
  public castingDiametersLoading$ = this.dialogFacade.castingDiametersLoading$;

  public destroy$ = new Subject<void>();

  public manufacturerSupplierIdControl =
    this.controlsService.getControl<number>();
  public materialStandardIdControl = this.controlsService.getControl<number>();
  public standardDocumentsControl =
    this.controlsService.getRequiredControl<StringOption>();
  public materialNamesControl =
    this.controlsService.getRequiredControl<StringOption>();
  public steelNumberControl = this.controlsService.getSteelNumberControl();
  public suppliersControl =
    this.controlsService.getRequiredControl<StringOption>();
  public supplierPlantsControl =
    this.controlsService.getRequiredControl<StringOption>(undefined, true);
  public castingModesControl = this.controlsService.getRequiredControl<string>(
    undefined,
    true
  );
  public castingDiameterControl =
    this.controlsService.getRequiredControl<StringOption>(undefined, true);
  public ratingsControl =
    this.controlsService.getRequiredControl<StringOption>();
  public maxDimControl = this.controlsService.getRequiredNumberControl();
  public minDimControl = this.controlsService.getNumberControl();
  public categoriesControl =
    this.controlsService.getRequiredControl<StringOption>();
  public co2Scope1Control = this.controlsService.getNumberControl();
  public co2Scope2Control = this.controlsService.getNumberControl();
  public co2Scope3Control = this.controlsService.getNumberControl();
  public co2TotalControl = this.controlsService.getCo2TotalControl(
    this.co2Scope1Control,
    this.co2Scope2Control,
    this.co2Scope3Control
  );
  public co2ClassificationControl =
    this.controlsService.getRequiredControl<StringOption>(undefined, true);
  public releaseMonthControl =
    this.controlsService.getRequiredControl<number>();
  public releaseYearControl = this.controlsService.getRequiredControl<number>();
  public referenceDocumentControl =
    this.controlsService.getControl<StringOption[]>();
  public ratingRemarkControl = this.controlsService.getControl<string>();
  public ratingChangeCommentControl =
    this.controlsService.getRequiredControl<string>(undefined, true);
  public releaseRestrictionsControl = this.controlsService.getControl<string>();
  public isBlockedControl = this.controlsService.getControl<boolean>(false);
  public steelMakingProcessControl =
    this.controlsService.getControl<StringOption>();

  public createMaterialForm: FormGroup<{
    manufacturerSupplierId: FormControl<number>;
    materialStandardId: FormControl<number>;
    productCategory: FormControl<StringOption>;
    referenceDoc: FormControl<StringOption[]>;
    co2Scope1: FormControl<number>;
    co2Scope2: FormControl<number>;
    co2Scope3: FormControl<number>;
    co2PerTon: FormControl<number>;
    co2Classification: FormControl<StringOption>;
    releaseDateYear: FormControl<number>;
    releaseDateMonth: FormControl<number>;
    releaseRestrictions: FormControl<string>;
    blocked: FormControl<boolean>;
    castingMode: FormControl<string>;
    castingDiameter: FormControl<StringOption>;
    maxDimension: FormControl<number>;
    minDimension: FormControl<number>;
    steelMakingProcess: FormControl<StringOption>;
    rating: FormControl<StringOption>;
    ratingRemark: FormControl<string>;
    ratingChangeComment: FormControl<string>;

    standardDocument: FormControl<StringOption>;
    materialNumber: FormControl<string>;
    materialName: FormControl<StringOption>;
    supplier: FormControl<StringOption>;
    supplierPlant: FormControl<StringOption>;
  }>;

  private scopesControls: FormArray;

  public filterFn = util.filterFn;
  public materialNameFilterFnFactory = util.materialNameFilterFnFactory;
  public standardDocumentFilterFnFactory = util.standardDocumentFilterFnFactory;
  public valueTitleToOptionKeyFilterFnFactory =
    util.valueTitleToOptionKeyFilterFnFactory;
  public valueOptionKeyToTitleFilterFnFactory =
    util.valueOptionKeyToTitleFilterFnFactory;
  public getErrorMessage = util.getErrorMessage;
  suppliersDependencies: FormGroup<{
    supplierName: FormControl<StringOption>;
    supplierPlant: FormControl<StringOption>;
    castingMode: FormControl<string>;
  }>;

  public constructor(
    private readonly dialogFacade: DialogFacade,
    private readonly dialogRef: MatDialogRef<InputDialogComponent>,
    private readonly snackbar: MatSnackBar,
    private readonly controlsService: DialogControlsService
  ) {}

  public years: number[];
  public months: number[];

  public ngOnInit(): void {
    this.createMaterialForm = new FormGroup({
      manufacturerSupplierId: this.manufacturerSupplierIdControl,
      materialStandardId: this.materialStandardIdControl,
      productCategory: this.categoriesControl,
      referenceDoc: this.referenceDocumentControl,
      co2Scope1: this.co2Scope1Control,
      co2Scope2: this.co2Scope2Control,
      co2Scope3: this.co2Scope3Control,
      co2PerTon: this.co2TotalControl,
      co2Classification: this.co2ClassificationControl,
      releaseDateYear: this.releaseYearControl,
      releaseDateMonth: this.releaseMonthControl,
      releaseRestrictions: this.releaseRestrictionsControl,
      blocked: this.isBlockedControl,
      castingMode: this.castingModesControl,
      castingDiameter: this.castingDiameterControl,
      maxDimension: this.maxDimControl,
      minDimension: this.minDimControl,
      steelMakingProcess: this.steelMakingProcessControl,
      rating: this.ratingsControl,
      ratingRemark: this.ratingRemarkControl,
      ratingChangeComment: this.ratingChangeCommentControl,

      // these controls are not used for creating a material, only for materialStandards or manufacturerSuppliers
      standardDocument: this.standardDocumentsControl,
      materialNumber: this.steelNumberControl,
      materialName: this.materialNamesControl,
      supplier: this.suppliersControl,
      supplierPlant: this.supplierPlantsControl,
    });

    this.scopesControls = new FormArray([
      this.co2Scope1Control,
      this.co2Scope2Control,
      this.co2Scope3Control,
      this.co2TotalControl,
    ]);

    this.suppliersDependencies = new FormGroup({
      supplierName: this.suppliersControl,
      supplierPlant: this.supplierPlantsControl,
      castingMode: this.castingModesControl,
    });

    this.months = util.getMonths();
    this.years = util.getYears();

    this.standardDocumentsControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        // reset material name if stdDoc has been reseted
        tap((standardDocument) => {
          if (!standardDocument) {
            this.createMaterialForm
              .get('materialName')
              .reset(undefined, { emitEvent: false });
            this.createMaterialForm
              .get('materialStandardId')
              .reset(undefined, { emitEvent: false });
          }
        }),
        filter((standardDocument) => !!standardDocument)
      )
      /* Detect changes of stdDoc and reset material name if value from matName does
         not fit to selected value */
      .subscribe((standardDocument: StringOption) => {
        if (this.createMaterialForm.get('materialName').value) {
          const mappedSelection = standardDocument.data?.materialNames.find(
            ({ materialName }: { id: number; materialName: string }) =>
              materialName ===
              this.createMaterialForm.get('materialName').value.title
          );
          if (mappedSelection) {
            this.createMaterialForm.patchValue({
              materialStandardId: mappedSelection.id,
            });
          }
          // special rule for selecting custom added entries
          else if (
            !standardDocument.id ||
            !this.createMaterialForm.get('materialName').value.id
          ) {
            this.createMaterialForm.patchValue({
              materialStandardId: undefined,
            });
          } else {
            this.createMaterialForm
              .get('materialName')
              .reset(undefined, { emitEvent: false });
          }
        }
      });

    this.materialNamesControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        // reset stdDoc if field has been reseted
        tap((materialName) => {
          if (!materialName) {
            this.createMaterialForm
              .get('standardDocument')
              .reset(undefined, { emitEvent: false });
            this.createMaterialForm
              .get('materialStandardId')
              .reset(undefined, { emitEvent: false });
          }
        }),
        filter((materialName) => !!materialName)
      )
      /* Detect changes of field and reset stdDoc if value from stdDoc does
         not fit to selected value */
      .subscribe((materialName: StringOption) => {
        if (this.createMaterialForm.get('standardDocument').value) {
          const mappedSelection = materialName.data?.standardDocuments.find(
            ({ standardDocument }: { id: number; standardDocument: string }) =>
              standardDocument ===
              this.createMaterialForm.get('standardDocument').value.title
          );
          if (mappedSelection) {
            this.createMaterialForm.patchValue({
              materialStandardId: mappedSelection.id,
            });
          }
          // special rule for new created custom entries
          else if (
            !materialName.id ||
            !this.createMaterialForm.get('standardDocument').value.id
          ) {
            this.createMaterialForm.patchValue({
              materialStandardId: undefined,
            });
          } else {
            this.createMaterialForm
              .get('standardDocument')
              .reset(undefined, { emitEvent: false });
          }
        }
      });

    // detect changes of the co2Scope fields
    this.scopesControls.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.co2TotalControl.updateValueAndValidity({ onlySelf: true });
      });
    this.co2TotalControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        value
          ? this.co2ClassificationControl.enable({ emitEvent: false })
          : this.co2ClassificationControl.disable({ emitEvent: false })
      );

    this.ratingsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: StringOption) =>
        value && value?.id
          ? this.ratingChangeCommentControl.enable({ emitEvent: false })
          : this.ratingChangeCommentControl.disable({ emitEvent: false })
      );

    this.suppliersDependencies.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ supplierName, supplierPlant, castingMode }) => {
        // all supplier fields depend on the selection of a supplier
        if (supplierName) {
          this.supplierPlantsControl.enable({ emitEvent: false });
          if (supplierPlant) {
            // verify selected plant is available for selected supplier name (special case for created items)
            if (
              supplierName.id && // new custom supplier has been selected
              supplierPlant.id && // new custom plant has been selected
              supplierPlant.data['supplierName'] !== supplierName.title
            ) {
              this.supplierPlantsControl.reset();
            } else {
              // enable casting mode and store supplier id (not available for created entries)
              const supplierId = supplierPlant?.data?.['supplierId'];
              this.manufacturerSupplierIdControl.patchValue(supplierId);
              this.castingModesControl.enable({ emitEvent: false });
              if (castingMode) {
                // enable casting diameter selection
                this.castingDiameterControl.enable({ emitEvent: false });
                // pull list of available diameters for selected supplier
                this.dialogFacade.dispatch(
                  fetchCastingDiameters({ supplierId, castingMode })
                );
              } else {
                this.disable([this.castingDiameterControl]);
              }
            }
          } else {
            this.disable([
              this.manufacturerSupplierIdControl,
              this.castingModesControl,
              this.castingDiameterControl,
            ]);
          }
        } else {
          this.disable([
            this.manufacturerSupplierIdControl,
            this.supplierPlantsControl,
            this.castingModesControl,
            this.castingDiameterControl,
          ]);
        }
      });
  }

  private disable(controls: AbstractControl[]): void {
    controls.forEach((control) => {
      switch (control) {
        case this.manufacturerSupplierIdControl:
          this.manufacturerSupplierIdControl.reset();
          break;
        case this.supplierPlantsControl:
          this.supplierPlantsControl.disable({ emitEvent: false });
          this.supplierPlantsControl.reset(
            { value: undefined, disabled: true },
            { emitEvent: false }
          );
          break;
        case this.castingModesControl:
          this.castingModesControl.reset(
            { value: undefined, disabled: true },
            { emitEvent: false }
          );
          break;
        case this.castingDiameterControl:
          this.castingDiameterControl.disable({ emitEvent: false });
          break;
        default:
          break;
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addMaterial(): void {
    const baseMaterial = this.createMaterialForm.value;

    const standard: MaterialStandard = {
      id: baseMaterial.materialStandardId,
      materialName: baseMaterial.materialName.title,
      materialNumber: baseMaterial.materialNumber,
      standardDocument: baseMaterial.standardDocument.title,
    };

    const supplier: ManufacturerSupplier = {
      id: baseMaterial.manufacturerSupplierId,
      name: baseMaterial.supplier.title,
      plant: baseMaterial.supplierPlant.title,
    };

    const material: Material = {
      // TODO: should not be hardcoded later on
      materialClass: 'st',
      manufacturerSupplierId: baseMaterial.manufacturerSupplierId,
      materialStandardId: baseMaterial.materialStandardId,
      productCategory: baseMaterial.productCategory.id as string,
      referenceDoc: baseMaterial.referenceDoc
        ?.map((option) => option.title)
        ?.toString(),
      co2Scope1: baseMaterial.co2Scope1,
      co2Scope2: baseMaterial.co2Scope2,
      co2Scope3: baseMaterial.co2Scope3,
      co2PerTon: baseMaterial.co2PerTon,
      co2Classification: baseMaterial.co2Classification?.id as string,
      releaseDateYear: baseMaterial.releaseDateYear,
      releaseDateMonth: baseMaterial.releaseDateMonth,
      releaseRestrictions: baseMaterial.releaseRestrictions,
      blocked: baseMaterial.blocked,
      castingMode: baseMaterial.castingMode,
      castingDiameter: baseMaterial.castingDiameter.title,
      maxDimension: baseMaterial.maxDimension,
      minDimension: baseMaterial.minDimension,
      steelMakingProcess: baseMaterial.steelMakingProcess?.id as string,
      rating: baseMaterial.rating.id as string,
      ratingRemark: baseMaterial.ratingRemark,
      ratingChangeComment: baseMaterial.ratingChangeComment,
      // attachments: '',
    };

    // include material, stdDoc and supplier put logic in effect
    this.dialogFacade.dispatch(
      addMaterialDialogConfirmed({ standard, supplier, material })
    );

    // rename to createMaterialComplete, return object instead of
    this.dialogFacade.createMaterialRecord$
      .pipe(
        filter((record) => !!record),
        take(1)
      )
      .subscribe((record) => {
        if (!record.error) {
          this.snackbar.open(
            translate(
              'materialsSupplierDatabase.mainTable.dialog.createMaterialSuccess'
            ),
            translate('materialsSupplierDatabase.mainTable.dialog.close'),
            { duration: 5000 }
          );
          this.closeDialog(true);
        } else {
          this.snackbar.open(
            translate(
              'materialsSupplierDatabase.mainTable.dialog.createMaterialFailure'
            ),
            translate('materialsSupplierDatabase.mainTable.dialog.close'),
            { duration: 5000 }
          );
        }
      });
  }

  public closeDialog(result?: any): void {
    this.dialogRef.close(result);
  }

  public addReferenceDocument(value: string): void {
    this.referenceDocument.push({ id: value, title: value });
  }

  public addCastingDiameter(castingDiameter: string): void {
    this.dialogFacade.dispatch(addCustomCastingDiameter({ castingDiameter }));
  }

  public addStandardDocument(standardDocument: string): void {
    this.dialogFacade.dispatch(
      addCustomMaterialStandardDocument({ standardDocument })
    );
  }

  public addMaterialName(materialName: string): void {
    this.dialogFacade.dispatch(addCustomMaterialStandardName({ materialName }));
  }

  public addSupplierName(supplierName: string): void {
    this.dialogFacade.dispatch(addCustomSupplierName({ supplierName }));
  }

  public addSupplierPlant(supplierPlant: string): void {
    this.dialogFacade.dispatch(addCustomSupplierPlant({ supplierPlant }));
  }
}
