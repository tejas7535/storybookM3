/* eslint-disable max-lines */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, Observable, Subject, take, takeUntil, tap } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { Material } from '../../models';
import {
  getAddMaterialDialogCastingDiametersLoading,
  getAddMaterialDialogCastingDiameterStringOptions,
  getAddMaterialDialogCastingModes,
  getAddMaterialDialogCo2Classifications,
  getAddMaterialDialogOptionsLoading,
  getAddMaterialDialogRatings,
  getAddMaterialDialogSteelMakingProcesses,
  getCreateMaterialLoading,
  getCreateMaterialSuccess,
  getMaterialNameStringOptionsMerged,
  getMaterialStandardDocumentStringOptionsMerged,
  getProductCategoryOptions,
  getStringOptions,
  getSupplierPlantStringOptions,
  getSupplierStringOptions,
  getUniqueStringOptions,
} from '../../store';
import {
  addCustomCastingDiameter,
  addMaterialDialogConfirmed,
  fetchCastingDiameters,
} from './../../store/actions/data.actions';

@Component({
  selector: 'mac-input-dialog',
  templateUrl: './input-dialog.component.html',
})
export class InputDialogComponent implements OnInit, OnDestroy {
  // mocks
  public referenceDocument: StringOption[] = [];
  //  observables
  public standardDocuments$: Observable<StringOption[]>;
  public materialNames$: Observable<StringOption[]>;
  public suppliers$: Observable<StringOption[]>;
  public supplierPlants$: Observable<StringOption[]>;
  public castingModes$: Observable<string[]>;
  public co2Classification$: Observable<StringOption[]>;
  public ratings$: Observable<StringOption[]>;
  public categories$: Observable<StringOption[]>;
  public steelMakingProcess$: Observable<StringOption[]>;
  public dialogLoading$: Observable<boolean>;
  public createMaterialLoading$: Observable<boolean>;
  public castingDiameters$: Observable<StringOption[]>;
  public castingDiametersLoading$: Observable<boolean>;

  private readonly MATERIAL_NUMBER_PATTERN = '1\\.[0-9]{4}(, 1\\.[0-9]{4})*';

  public destroy$ = new Subject<void>();

  public manufacturerSupplierIdControl: FormControl<number>;
  public materialStandardIdControl: FormControl<number>;
  public standardDocumentsControl: FormControl<StringOption>;
  public materialNamesControl: FormControl<StringOption>;
  public steelNumberControl: FormControl<string>;
  public suppliersControl: FormControl<StringOption>;
  public supplierPlantsControl: FormControl<StringOption>;
  public castingModesControl: FormControl<string>;
  public castingDiameterControl: FormControl<StringOption>;
  public ratingsControl: FormControl<StringOption>;
  public maxDimControl: FormControl<number>;
  public minDimControl: FormControl<number>;
  public categoriesControl: FormControl<StringOption>;
  public co2Scope1Control: FormControl<number>;
  public co2Scope2Control: FormControl<number>;
  public co2Scope3Control: FormControl<number>;
  public co2TotalControl: FormControl<number>;
  public co2ClassificationControl: FormControl<StringOption>;
  public releaseMonthControl: FormControl<number>;
  public releaseYearControl: FormControl<number>;
  public referenceDocumentControl: FormControl<StringOption[]>;
  public ratingRemarkControl: FormControl<string>;
  public releaseRestrictionsControl: FormControl<string>;
  public isBlockedControl: FormControl<boolean>;
  public steelMakingProcessControl: FormControl<StringOption>;

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

    standardDocument: FormControl<StringOption>;
    materialName: FormControl<StringOption>;
    supplier: FormControl<StringOption>;
    supplierPlant: FormControl<StringOption>;
  }>;

  private scopesControls: FormArray;

  public constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<InputDialogComponent>,
    private readonly snackbar: MatSnackBar
  ) {}

  public years: number[];
  public months: number[];

  public ngOnInit(): void {
    this.manufacturerSupplierIdControl = new FormControl<number>(undefined, [
      Validators.required,
    ]);
    this.materialStandardIdControl = new FormControl<number>(undefined, [
      Validators.required,
    ]);
    this.standardDocumentsControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.materialNamesControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.steelNumberControl = new FormControl<string>(
      undefined,
      Validators.pattern(this.MATERIAL_NUMBER_PATTERN)
    );
    this.suppliersControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.supplierPlantsControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.castingModesControl = new FormControl<string>(
      undefined,
      Validators.required
    );
    this.castingDiameterControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.ratingsControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.maxDimControl = new FormControl<number>(undefined, [
      Validators.required,
      Validators.min(0),
    ]);
    this.minDimControl = new FormControl<number>(undefined, Validators.min(0));
    this.categoriesControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.co2Scope1Control = new FormControl<number>(
      undefined,
      Validators.min(0)
    );
    this.co2Scope2Control = new FormControl<number>(
      undefined,
      Validators.min(0)
    );
    this.co2Scope3Control = new FormControl<number>(
      undefined,
      Validators.min(0)
    );
    this.co2TotalControl = new FormControl<number>(undefined, [
      Validators.min(0),
      this.scopeTotalValidatorFn(),
    ]);
    this.co2ClassificationControl = new FormControl<StringOption>(
      undefined,
      Validators.required
    );
    this.releaseMonthControl = new FormControl<number>(
      undefined,
      Validators.required
    );
    this.releaseYearControl = new FormControl<number>(
      undefined,
      Validators.required
    );
    this.referenceDocumentControl = new FormControl<StringOption[]>(undefined);
    this.ratingRemarkControl = new FormControl<string>('');
    this.releaseRestrictionsControl = new FormControl<string>('');
    this.isBlockedControl = new FormControl<boolean>(false);
    this.steelMakingProcessControl = new FormControl<StringOption>(undefined);

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

      // these controls are not used for creating a material, only for materialStandards or manufacturerSuppliers
      standardDocument: this.standardDocumentsControl,
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

    // create an array of months
    this.months = Array.from({ length: 12 }, (_, i) => i + 1);

    // create a list of years from 2000 to current
    const curYear = new Date().getFullYear();
    this.years = Array.from(
      { length: curYear - 2000 + 1 },
      (_, i) => curYear - i
    );

    this.dialogLoading$ = this.store.select(getAddMaterialDialogOptionsLoading);
    this.createMaterialLoading$ = this.store.select(getCreateMaterialLoading);

    this.standardDocuments$ = this.store.select(
      getUniqueStringOptions(getMaterialStandardDocumentStringOptionsMerged)
    );

    this.materialNames$ = this.store.select(
      getUniqueStringOptions(getMaterialNameStringOptionsMerged)
    );
    this.suppliers$ = this.store.select(
      getUniqueStringOptions(getSupplierStringOptions)
    );
    this.supplierPlants$ = this.store.select(getSupplierPlantStringOptions);
    this.castingModes$ = this.store.select(getAddMaterialDialogCastingModes);
    this.co2Classification$ = this.store.select(
      getAddMaterialDialogCo2Classifications
    );
    this.ratings$ = this.store.select(
      getStringOptions(getAddMaterialDialogRatings, [
        {
          id: undefined,
          title: translate('materialsSupplierDatabase.mainTable.dialog.none'),
        },
      ])
    );
    this.steelMakingProcess$ = this.store.select(
      getStringOptions(getAddMaterialDialogSteelMakingProcesses)
    );
    this.categories$ = this.store.select(
      getUniqueStringOptions(getProductCategoryOptions)
    );

    this.standardDocumentsControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
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
      .subscribe((standardDocument: StringOption) => {
        if (this.createMaterialForm.get('materialName').value) {
          const mappedSelection = standardDocument.data.materialNames.find(
            ({ materialName }: { id: number; materialName: string }) =>
              materialName ===
              this.createMaterialForm.get('materialName').value.title
          );
          if (mappedSelection) {
            this.createMaterialForm.patchValue({
              materialStandardId: mappedSelection.id,
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
      .subscribe((materialName: StringOption) => {
        if (this.createMaterialForm.get('standardDocument').value) {
          const mappedSelection = materialName.data.standardDocuments.find(
            ({ standardDocument }: { id: number; standardDocument: string }) =>
              standardDocument ===
              this.createMaterialForm.get('standardDocument').value.title
          );
          if (mappedSelection) {
            this.createMaterialForm.patchValue({
              materialStandardId: mappedSelection.id,
            });
          } else {
            this.createMaterialForm
              .get('standardDocument')
              .reset(undefined, { emitEvent: false });
          }
        }
      });

    this.suppliersControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value) =>
          value
            ? this.supplierPlantsControl.enable()
            : this.supplierPlantsControl.disable()
        )
      )
      .subscribe((supplier: StringOption) => {
        if (
          !supplier ||
          (this.supplierPlantsControl.value &&
            this.supplierPlantsControl.value.data['supplierName'] !==
              supplier.title)
        ) {
          this.supplierPlantsControl.reset();
        }
      });

    this.supplierPlantsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((plant: StringOption) => {
        this.createMaterialForm.patchValue({
          manufacturerSupplierId: plant?.data['supplierId'],
        });
      });

    this.supplierPlantsControl.disable();
    this.scopesControls.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.co2TotalControl.updateValueAndValidity({ onlySelf: true });
      });
    this.co2TotalControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        value
          ? this.co2ClassificationControl.enable()
          : this.co2ClassificationControl.disable()
      );
    this.co2ClassificationControl.disable();

    this.castingDiameters$ = this.store.select(
      getAddMaterialDialogCastingDiameterStringOptions
    );
    this.castingDiametersLoading$ = this.store.select(
      getAddMaterialDialogCastingDiametersLoading
    );
    this.manufacturerSupplierIdControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.store.dispatch(fetchCastingDiameters({ supplierId: value }))
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // pass a custom filter function
  public filterFn(option?: StringOption, value?: string) {
    if (!value) {
      return true;
    }

    return option?.title
      ?.toLowerCase()
      .trim()
      .includes(value.toLowerCase().trim());
  }

  public materialNameFilterFnFactory =
    () => (option?: StringOption, value?: string) => {
      if (
        this.standardDocumentsControl.value &&
        this.standardDocumentsControl.value.data &&
        !this.standardDocumentsControl.value.data['materialNames'].some(
          ({ materialName }: { materialName: string }) =>
            materialName === option.title
        )
      ) {
        return false;
      }

      return this.filterFn(option, value);
    };

  public standardDocumentFilterFnFactory =
    () => (option?: StringOption, value?: string) => {
      if (
        this.materialNamesControl.value &&
        this.materialNamesControl.value.data &&
        !this.materialNamesControl.value.data['standardDocuments'].some(
          ({ standardDocument }: { standardDocument: string }) =>
            standardDocument === option.title
        )
      ) {
        return false;
      }

      return this.filterFn(option, value);
    };

  public valueTitleToOptionKeyFilterFnFactory =
    (control: FormControl<StringOption>, dataKey: string) =>
    (option?: StringOption, value?: string) => {
      if (
        control.value &&
        control.value.title &&
        control.value.title !== option.data[dataKey]
      ) {
        return false;
      }

      return this.filterFn(option, value);
    };

  public valueOptionKeyToTitleFilterFnFactory =
    (control: FormControl<StringOption>, dataKey: string) =>
    (option?: StringOption, value?: string) => {
      if (
        control.value &&
        control.value.data &&
        control.value.data[dataKey] !== option.title
      ) {
        return false;
      }

      return this.filterFn(option, value);
    };

  public addMaterial(): void {
    const baseMaterial = this.createMaterialForm.value;
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
      // attachments: '',
    };

    this.store.dispatch(addMaterialDialogConfirmed({ material }));

    this.store
      .select(getCreateMaterialSuccess)
      .pipe(
        filter((success) => success !== undefined),
        take(1)
      )
      .subscribe((success) => {
        if (success) {
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
    this.store.dispatch(addCustomCastingDiameter({ castingDiameter }));
  }

  public getErrorMessage(errors: { [key: string]: any }): string {
    if (errors.required) {
      return this.getTranslatedError('required');
    }
    if (errors.min) {
      return this.getTranslatedError('min', { min: errors.min.min });
    }
    if (errors.scopeTotalLowerThanSingleScopes) {
      return this.getTranslatedError('co2TooLowShort', {
        min: errors.scopeTotalLowerThanSingleScopes.min,
      });
    }

    return this.getTranslatedError('generic');
  }

  private getTranslatedError(key: string, params = {}): string {
    return translate(
      `materialsSupplierDatabase.mainTable.dialog.error.${key}`,
      params
    );
  }

  private readonly scopeTotalValidatorFn =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const current = (control.value as number) || 0;
        const min =
          Math.max(this.co2Scope1Control.value || 0, 0) +
          Math.max(this.co2Scope2Control.value || 0, 0) +
          Math.max(this.co2Scope3Control.value || 0, 0);

        return min > current
          ? { scopeTotalLowerThanSingleScopes: { min, current } }
          : undefined;
      }

      return undefined;
    };
}
