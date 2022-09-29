/* eslint-disable max-lines */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  BehaviorSubject,
  filter,
  map,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';
import { SelectComponent } from '@schaeffler/inputs/select';

import { DialogControlsService } from '@mac/msd/main-table/input-dialog/services';
import {
  DataResult,
  ManufacturerSupplier,
  Material,
  MaterialFormValue,
  MaterialStandard,
} from '@mac/msd/models';
import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomReferenceDocument,
  addCustomSupplierName,
  addCustomSupplierPlant,
  DialogFacade,
  fetchCastingDiameters,
  fetchCo2ValuesForSupplierSteelMakingProcess,
  fetchReferenceDocuments,
  fetchSteelMakingProcessesInUse,
  materialDialogConfirmed,
  materialDialogOpened,
  resetSteelMakingProcessInUse,
} from '@mac/msd/store';

import * as util from './util';

@Component({
  selector: 'mac-input-dialog',
  templateUrl: './input-dialog.component.html',
})
export class InputDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  STEEL_MAKING_PROCESS_SEARCH_STRING = 'in use by supplier';

  // mocks
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
  public referenceDocuments$ = this.dialogFacade.referenceDocuments$;
  public referenceDocumentsLoading$ =
    this.dialogFacade.referenceDocumentsLoading$;

  private readonly steelMakingProcessesInUse$ =
    this.dialogFacade.steelMakingProcessesInUse$;
  public steelMakingProcessesInUse: string[] = [];

  public editLoading$: BehaviorSubject<boolean>;

  public dialogError$ = this.dialogFacade.dialogError$;

  private readonly co2ValuesForSupplierSteelMakingProcess$ =
    this.dialogFacade.co2ValuesForSupplierSteelMakingProcess$;

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
  public selfCertifiedControl = this.controlsService.getControl<boolean>(
    false,
    true
  );
  public castingModesControl = this.controlsService.getControl<string>(
    undefined,
    true
  );
  public castingDiameterControl = this.controlsService.getControl<StringOption>(
    undefined,
    true
  );
  public ratingsControl = this.controlsService.getRequiredControl<StringOption>(
    {
      id: undefined,
      title: translate('materialsSupplierDatabase.mainTable.dialog.none'),
    }
  );
  public maxDimControl = this.controlsService.getNumberControl();
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
    selfCertified: FormControl<boolean>;
  }>;

  public filterFn = util.filterFn;
  public materialNameFilterFnFactory = util.materialNameFilterFnFactory;
  public standardDocumentFilterFnFactory = util.standardDocumentFilterFnFactory;
  public valueTitleToOptionKeyFilterFnFactory =
    util.valueTitleToOptionKeyFilterFnFactory;
  public valueOptionKeyToTitleFilterFnFactory =
    util.valueOptionKeyToTitleFilterFnFactory;
  public getErrorMessage = util.getErrorMessage;

  private suppliersDependencies: FormGroup<{
    supplierName: FormControl<StringOption>;
    supplierPlant: FormControl<StringOption>;
    castingMode: FormControl<string>;
  }>;
  private co2Controls: FormArray;
  private co2Dependencies: FormGroup<{
    manufacturerSupplierId: FormControl<number>;
    steelMakingProcess: FormControl<StringOption>;
  }>;

  public defaultRating: string;
  public materialId: number;

  @ViewChildren('dialogControl', { read: ElementRef })
  dialogControlRefs: QueryList<ElementRef>;

  @ViewChildren('steelMakingProcessSelect', { read: SelectComponent })
  steelMakingProcessSelectQueryList: QueryList<SelectComponent>;

  public constructor(
    private readonly dialogFacade: DialogFacade,
    private readonly dialogRef: MatDialogRef<InputDialogComponent>,
    private readonly snackbar: MatSnackBar,
    private readonly controlsService: DialogControlsService,
    private readonly cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    private readonly dialogData: {
      editDialogInformation?: { row: DataResult; column: string };
      isResumeDialog: boolean;
    }
  ) {
    this.editLoading$ = new BehaviorSubject(!!dialogData.editDialogInformation);
  }

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
      selfCertified: this.selfCertifiedControl,
    });

    this.suppliersDependencies = new FormGroup({
      supplierName: this.suppliersControl,
      supplierPlant: this.supplierPlantsControl,
      castingMode: this.castingModesControl,
    });

    this.co2Controls = new FormArray([
      this.co2Scope1Control,
      this.co2Scope2Control,
      this.co2Scope3Control,
      this.co2TotalControl,
      this.co2ClassificationControl,
    ]);

    this.co2Dependencies = new FormGroup({
      manufacturerSupplierId: this.manufacturerSupplierIdControl,
      steelMakingProcess: this.steelMakingProcessControl,
    });

    this.months = util.getMonths();
    this.years = util.getYears();

    this.dialogError$
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error !== undefined),
        take(1)
      )
      .subscribe(() => this.handleDialogError());

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
    this.co2Controls.valueChanges
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
        value?.id !== this.defaultRating
          ? this.ratingChangeCommentControl.enable({ emitEvent: false })
          : this.ratingChangeCommentControl.disable({ emitEvent: false })
      );

    // selfCertified only available for new suppliers. For old suppliers value will be prefilled
    this.supplierPlantsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((supplierPlant) => {
        // enable only for new suppliers
        const isEnabled = supplierPlant?.data === undefined;
        if (isEnabled) {
          this.selfCertifiedControl.enable();
          this.selfCertifiedControl.setValue(false);
        } else {
          // get current value for selected supplier
          const isSelfCertified =
            supplierPlant.data?.['selfCertified'] || false;
          this.selfCertifiedControl.setValue(isSelfCertified);
          this.selfCertifiedControl.disable();
        }
      });

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
                this.castingDiameterControl.reset(undefined, {
                  emitEvent: false,
                });
                this.dialogFacade.dispatch(resetSteelMakingProcessInUse());
                // pull list of available diameters for selected supplier
                this.dialogFacade.dispatch(
                  fetchCastingDiameters({ supplierId, castingMode })
                );
              } else {
                this.disable([this.castingDiameterControl]);
                this.castingDiameterControl.reset(undefined, {
                  emitEvent: false,
                });
                this.dialogFacade.dispatch(resetSteelMakingProcessInUse());
              }
            }
          } else {
            this.disable([
              this.manufacturerSupplierIdControl,
              this.castingModesControl,
              this.castingDiameterControl,
            ]);
            this.castingDiameterControl.reset(undefined, { emitEvent: false });
            this.castingModesControl.reset(undefined, { emitEvent: false });
          }
        } else {
          this.disable([
            this.manufacturerSupplierIdControl,
            this.supplierPlantsControl,
            this.castingModesControl,
            this.castingDiameterControl,
          ]);
          this.supplierPlantsControl.reset(undefined, { emitEvent: false });
          this.castingModesControl.reset(undefined, { emitEvent: false });
          this.castingDiameterControl.reset(undefined, { emitEvent: false });
        }
      });

    this.castingDiameterControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        map((castingDiameter) => ({
          supplierId: this.manufacturerSupplierIdControl.value,
          castingMode: this.castingModesControl.value,
          castingDiameter: castingDiameter?.title,
        })),
        filter(
          ({ supplierId, castingMode, castingDiameter }) =>
            !!supplierId && !!castingMode && !!castingDiameter
        )
      )
      .subscribe(({ supplierId, castingMode, castingDiameter }) =>
        this.dialogFacade.dispatch(
          supplierId && castingMode && castingDiameter
            ? fetchSteelMakingProcessesInUse({
                supplierId,
                castingMode,
                castingDiameter,
              })
            : resetSteelMakingProcessInUse()
        )
      );

    this.co2Dependencies.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ({ manufacturerSupplierId, steelMakingProcess }) =>
            !!manufacturerSupplierId && !!steelMakingProcess
        ),
        map(({ manufacturerSupplierId, steelMakingProcess }) => ({
          supplierId: manufacturerSupplierId,
          steelMakingProcess: steelMakingProcess.title,
        }))
      )
      .subscribe(({ supplierId, steelMakingProcess }) =>
        this.dialogFacade.dispatch(
          fetchCo2ValuesForSupplierSteelMakingProcess({
            supplierId,
            steelMakingProcess,
          })
        )
      );

    this.materialStandardIdControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((id) => !!id)
      )
      .subscribe((id) =>
        this.dialogFacade.dispatch(
          fetchReferenceDocuments({ materialStandardId: id })
        )
      );

    this.steelMakingProcessesInUse$
      .pipe(
        takeUntil(this.destroy$),
        tap((steelMakingProcessesInUse) => {
          this.steelMakingProcessesInUse = steelMakingProcessesInUse || [];
          if (this.steelMakingProcessesInUse.length > 0) {
            this.steelMakingProcessSelectQueryList?.first?.searchControl.setValue(
              this.STEEL_MAKING_PROCESS_SEARCH_STRING,
              { emitEvent: false }
            );
          } else {
            this.steelMakingProcessSelectQueryList?.first?.searchControl.setValue(
              '',
              {
                emitEvent: false,
              }
            );
          }
        })
      )
      .subscribe();

    this.co2ValuesForSupplierSteelMakingProcess$
      .pipe(
        takeUntil(this.destroy$),
        tap(({ co2Values, otherValues }) => {
          let co2ValuesEmpty = true;

          for (const control of this.co2Controls.controls) {
            if (control.value) {
              co2ValuesEmpty = false;
            }
          }

          if (co2ValuesEmpty && co2Values) {
            this.co2ClassificationControl.enable({ emitEvent: false });
            this.createMaterialForm.patchValue(co2Values);
            this.snackbar.open(
              translate(
                otherValues > 0
                  ? 'materialsSupplierDatabase.mainTable.dialog.co2ValuesFilledWithOtherValues'
                  : 'materialsSupplierDatabase.mainTable.dialog.co2ValuesFilled',
                otherValues > 0 ? { otherValues } : undefined
              ),
              translate('materialsSupplierDatabase.mainTable.dialog.close'),
              {
                panelClass: '[&>div>div>simple-snack-bar]:!flex-nowrap',
              }
            );
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngAfterViewInit(): void {
    if (
      this.dialogData.editDialogInformation ||
      this.dialogData.isResumeDialog
    ) {
      this.dialogFacade.resumeDialogData$
        .pipe(
          filter(
            (dialogData) =>
              (!!dialogData.editMaterial &&
                !!dialogData.editMaterial.parsedMaterial) ||
              !!dialogData.minimizedDialog
          ),
          take(1)
        )
        .subscribe((dialogData) => {
          const materialFormValue: Partial<MaterialFormValue> =
            dialogData.minimizedDialog?.value ??
            dialogData.editMaterial?.parsedMaterial;
          this.materialId =
            dialogData.minimizedDialog?.id ?? dialogData.editMaterial?.row?.id;
          this.defaultRating = dialogData.editMaterial?.row?.rating;

          if (materialFormValue) {
            this.dialogFacade.dispatch(
              fetchReferenceDocuments({
                materialStandardId: materialFormValue.materialStandardId,
              })
            );

            if (materialFormValue.supplier) {
              this.supplierPlantsControl.enable({ emitEvent: false });
            }

            if (materialFormValue.supplierPlant) {
              this.castingModesControl.enable({ emitEvent: false });
            }

            if (materialFormValue.castingMode) {
              this.dialogFacade.dispatch(
                fetchCastingDiameters({
                  supplierId: materialFormValue.manufacturerSupplierId,
                  castingMode: materialFormValue.castingMode,
                })
              );
              this.castingDiameterControl.enable({ emitEvent: false });
            }

            this.ratingChangeCommentControl.disable({ emitEvent: false });

            if (materialFormValue.co2PerTon) {
              this.co2ClassificationControl.enable({ emitEvent: false });
            }

            this.createMaterialForm.patchValue(materialFormValue);

            if (this.dialogData.isResumeDialog || this.materialId) {
              this.createMaterialForm.markAllAsTouched();
            }

            this.createMaterialForm.updateValueAndValidity();

            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }

          if (
            !this.dialogData.isResumeDialog &&
            this.dialogData.editDialogInformation
          ) {
            this.dialogControlRefs.changes
              .pipe(takeUntil(this.destroy$))
              .subscribe((changes: QueryList<ElementRef>) =>
                this.focusSelectedElement(
                  changes,
                  this.dialogData.editDialogInformation.column
                )
              );
          }
          this.editLoading$.next(false);
        });
    }

    setTimeout(() => {
      this.dialogFacade.dispatch(materialDialogOpened());
    });
  }

  private focusSelectedElement(changes: QueryList<ElementRef>, column: string) {
    const selectedItem: ElementRef = changes.find((item: ElementRef) =>
      item.nativeElement.name
        ? item.nativeElement.name === column
        : item.nativeElement.outerHTML.includes(`name="${column}"`)
    );

    if (selectedItem.nativeElement.name) {
      selectedItem.nativeElement.focus();
    } else {
      selectedItem.nativeElement.scrollIntoView();
      const matSelect = selectedItem.nativeElement.querySelector('mat-select');
      const input = selectedItem.nativeElement.querySelector('input');
      if (matSelect) {
        matSelect.focus();
      } else if (input) {
        input.focus();
      } else {
        selectedItem.nativeElement.focus();
      }
    }
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
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

  public confirmMaterial(): void {
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
      selfCertified: baseMaterial.selfCertified,
    };

    const material: Material = {
      // TODO: should not be hardcoded later on
      id: this.materialId,
      materialClass: 'st',
      manufacturerSupplierId: baseMaterial.manufacturerSupplierId,
      materialStandardId: baseMaterial.materialStandardId,
      productCategory: baseMaterial.productCategory.id as string,
      referenceDoc: JSON.stringify(
        baseMaterial.referenceDoc?.map((option) => option.title) || []
      ),
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
      materialDialogConfirmed({ standard, supplier, material })
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

  public handleDialogError(): void {
    this.snackbar.open(
      translate('materialsSupplierDatabase.somethingWentWrong'),
      translate('materialsSupplierDatabase.close')
    );
    this.cancelDialog();
  }

  public cancelDialog(): void {
    this.closeDialog(false);
  }

  public closeDialog(reload: boolean): void {
    this.dialogRef.close({ reload });
  }

  public minimizeDialog(): void {
    this.dialogRef.close({
      minimize: { id: this.materialId, value: this.createMaterialForm.value },
    });
  }

  public addReferenceDocument(referenceDocument: string): void {
    this.dialogFacade.dispatch(
      addCustomReferenceDocument({ referenceDocument })
    );
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

  public compareWithId = (option: StringOption, selected: StringOption) =>
    option?.id === selected?.id;

  public steelMakingProcessFilterFn = (
    option?: StringOption,
    value?: string
  ) => {
    if (value === this.STEEL_MAKING_PROCESS_SEARCH_STRING) {
      return this.steelMakingProcessesInUse.includes(option?.title);
    }

    return util.filterFn(option, value);
  };
}
