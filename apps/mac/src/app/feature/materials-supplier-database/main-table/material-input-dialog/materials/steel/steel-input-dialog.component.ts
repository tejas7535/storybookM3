/* eslint-disable max-lines */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, filter, map, takeUntil, tap } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';
import { SelectComponent } from '@schaeffler/inputs/select';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import {
  DataResult,
  SteelMaterialForm,
  SteelMaterialFormValue,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import * as util from '../../util';
import { ReleaseDateViewMode } from './constants/release-date-view-mode.enum';

@Component({
  selector: 'mac-steel-input-dialog',
  templateUrl: './steel-input-dialog.component.html',
})
export class SteelInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit, AfterViewInit
{
  @ViewChildren('steelMakingProcessSelect', { read: SelectComponent })
  private readonly steelMakingProcessSelectQueryList: QueryList<SelectComponent>;

  public materialClass = MaterialClass.STEEL;

  public castingModes$ = this.dialogFacade.castingModes$;
  public co2Classification$ = this.dialogFacade.co2Classification$;
  public ratings$ = this.dialogFacade.ratings$;
  public categories$ = this.dialogFacade.categories$;
  public steelMakingProcess$ = this.dialogFacade.steelMakingProcess$;
  public castingDiameters$ = this.dialogFacade.castingDiameters$;
  public referenceDocuments$ = this.dialogFacade.referenceDocuments$;

  public steelNumberControl = this.controlsService.getSteelNumberControl();
  public selfCertifiedControl = this.controlsService.getControl<boolean>(false);
  public castingModesControl = this.controlsService.getControl<string>(
    undefined,
    true
  );
  public castingDiameterControl = this.controlsService.getControl<StringOption>(
    undefined,
    true
  );
  public ratingsControl = this.controlsService.getControl<StringOption>();
  public maxDimControl = this.controlsService.getNumberControl();
  public minDimControl = this.controlsService.getNumberControl();
  public releaseMonthControl =
    this.controlsService.getRequiredControl<number>();
  public releaseYearControl = this.controlsService.getRequiredControl<number>();
  public referenceDocumentControl =
    this.controlsService.getControl<StringOption[]>();
  public ratingRemarkControl = this.controlsService.getControl<string>();
  public ratingChangeCommentControl = this.controlsService.getControl<string>(
    undefined,
    true
  );
  public isBlockedControl = this.controlsService.getControl<boolean>(false);
  public steelMakingProcessControl =
    this.controlsService.getControl<StringOption>();
  public minRecyclingRateControl = this.controlsService.getNumberControl(
    undefined,
    false,
    0,
    100
  );
  public maxRecyclingRateControl = this.controlsService.getNumberControl(
    undefined,
    false,
    0,
    100
  );
  public isManufacturerControl = this.controlsService.getControl<boolean>(
    false,
    true
  );

  // steel making processes
  public steelMakingProcessesInUse: string[] = [];

  // releasedate year & month
  public years: number[];
  public months: number[];

  // casting diameter dependencies
  castingDiameterDep: FormGroup<{
    supplierId: FormControl<number>;
    castingMode: FormControl<string>;
  }>;
  private readonly STEEL_MAKING_PROCESS_SEARCH_STRING = 'in use by supplier';

  // co2 dependencies
  private readonly co2ValuesForSupplierSteelMakingProcess$ =
    this.dialogFacade.co2ValuesForSupplierSteelMakingProcess$;

  // autofiller for steelMakingprocess
  private readonly steelMakingProcessesInUse$ =
    this.dialogFacade.steelMakingProcessesInUse$;

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade,
    readonly dataFacade: DataFacade,
    readonly dialogRef: MatDialogRef<MaterialInputDialogComponent>,
    readonly snackbar: MsdSnackbarService,
    readonly cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    readonly dialogData: {
      editDialogInformation?: {
        row: DataResult;
        selectedRows?: DataResult[];
        column: string;
      };
      isResumeDialog: boolean;
    },
    private readonly dialogService: MsdDialogService
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
    this.co2TotalControl.removeValidators(Validators.required);
    super.ngOnInit();
    // setup material formular values
    this.createMaterialForm = new FormGroup<SteelMaterialForm>({
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

      // steel specific controls
      blocked: this.isBlockedControl,
      castingDiameter: this.castingDiameterControl,
      castingMode: this.castingModesControl,
      manufacturer: this.isManufacturerControl,
      materialNumber: this.steelNumberControl,
      maxDimension: this.maxDimControl,
      minDimension: this.minDimControl,
      rating: this.ratingsControl,
      ratingChangeComment: this.ratingChangeCommentControl,
      ratingRemark: this.ratingRemarkControl,
      referenceDoc: this.referenceDocumentControl,
      releaseDateMonth: this.releaseMonthControl,
      releaseDateYear: this.releaseYearControl,
      selfCertified: this.selfCertifiedControl,
      steelMakingProcess: this.steelMakingProcessControl,
      minRecyclingRate: this.minRecyclingRateControl,
      maxRecyclingRate: this.maxRecyclingRateControl,
    });
    // setup static months and year
    this.months = util.getMonths();
    this.years = util.getYears();

    // enable or disable rating comment, if initial value has been modified
    this.ratingsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: StringOption) => {
        if (value?.id === this.dialogData.editDialogInformation?.row?.rating) {
          this.ratingChangeCommentControl.disable({ emitEvent: false });
        } else {
          this.ratingChangeCommentControl.enable({ emitEvent: false });
        }
        // this is needed, otherwise field would not be marked as invalid until touched!
        this.ratingChangeCommentControl.markAsTouched();
      });
    this.ratingChangeCommentControl.addValidators(this.dependencyValidatorFn());

    // "manufacturer"-field only available for new suppliers. For existing suppliers value will be prefilled
    this.supplierPlantControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((supplierPlant) => {
        // disable field for existing suppliers and on empty plant selection
        if (!supplierPlant || !!supplierPlant.data) {
          const isManufacturer = supplierPlant?.data['manufacturer'] || false;
          this.isManufacturerControl.setValue(isManufacturer);
          this.isManufacturerControl.disable();
        } else {
          // enable only for new suppliers
          this.isManufacturerControl.enable();
          this.isManufacturerControl.setValue(false);
        }
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
        // reset steel Making process
        this.dialogFacade.resetSteelMakingProcessInUse();
        if (castingMode) {
          this.castingDiameterControl.enable();
          if (supplierId) {
            this.dialogFacade.fetchCastingDiameters(supplierId, castingMode);
          }
        } else if (!this.isBulkEdit) {
          this.castingDiameterControl.reset();
          this.castingDiameterControl.disable();
        }
        this.createMaterialForm.updateValueAndValidity({
          emitEvent: false,
        });
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
        this.dialogFacade.fetchSteelMakingProcessesInUse(
          supplierId,
          castingMode,
          castingDiameter
        )
      );

    this.steelMakingProcessesInUse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((steelMakingProcessesInUse) => {
        this.steelMakingProcessesInUse = steelMakingProcessesInUse || [];
        const searchVal =
          this.steelMakingProcessesInUse.length > 0
            ? this.STEEL_MAKING_PROCESS_SEARCH_STRING
            : '';
        this.steelMakingProcessSelectQueryList?.first?.searchControl.setValue(
          searchVal,
          { emitEvent: false }
        );
      });

    // co2classification can be ignored here, as it is just available after filling in a co2Value
    const someCo2 = () =>
      this.co2Scope1Control.value ||
      this.co2Scope2Control.value ||
      this.co2Scope3Control.value ||
      this.co2TotalControl.value;
    this.co2ValuesForSupplierSteelMakingProcess$
      .pipe(
        takeUntil(this.destroy$),
        filter(({ co2Values }) => co2Values && !someCo2())
      )
      .subscribe(({ co2Values, otherValues }) => {
        this.co2ClassificationControl.enable({ emitEvent: false });
        this.createMaterialForm.patchValue(co2Values);
        this.snackbar.infoTranslated(
          translate(
            otherValues > 0
              ? 'materialsSupplierDatabase.mainTable.dialog.co2ValuesFilledWithOtherValues'
              : 'materialsSupplierDatabase.mainTable.dialog.co2ValuesFilled',
            otherValues > 0 ? { otherValues } : undefined
          )
        );
      });

    // recyclingRate validation
    this.minRecyclingRateControl.addValidators(
      this.minRecycleRateValidatorFn()
    );
    this.maxRecyclingRateControl.addValidators(
      this.maxRecycleRateValidatorFn()
    );
    // set min rate to 0 if max rate is filled (and min rate is not set)
    this.maxRecyclingRateControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() =>
          this.minRecyclingRateControl.updateValueAndValidity({
            emitEvent: false,
          })
        ),
        filter(Boolean)
      )
      .subscribe(() => {
        if (!this.minRecyclingRateControl.value) {
          this.minRecyclingRateControl.setValue(0);
        }
      });
    // set max rate to 100 if min rate is filled (and max rate is not set)
    this.minRecyclingRateControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() =>
          this.maxRecyclingRateControl.updateValueAndValidity({
            emitEvent: false,
          })
        ),
        filter(Boolean)
      )
      .subscribe(() => {
        if (!this.maxRecyclingRateControl.value) {
          this.maxRecyclingRateControl.setValue(100);
        }
      });

    this.createMaterialForm.valueChanges.subscribe((val) => {
      this.dialogFacade.updateCreateMaterialDialogValues(val);
    });

    if (this.dialogData.editDialogInformation?.selectedRows?.length > 1) {
      this.referenceDocumentControl.disable();
    }
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // setup co2Dependencies
    if (this.isAddDialog()) {
      // skip prefill of co2 values on edited / added items
      this.steelMakingProcessControl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          filter(
            (steelMakingProcess) =>
              !!this.manufacturerSupplierIdControl.value && !!steelMakingProcess
          ),
          map((steelMakingProcess) => ({
            supplierId: this.manufacturerSupplierIdControl.value,
            steelMakingProcess: steelMakingProcess.title,
            productCategory: this.categoriesControl.value.id as string,
          }))
        )
        .subscribe(({ supplierId, steelMakingProcess, productCategory }) => {
          // TODO: remove workaround asap
          this.createMaterialForm.updateValueAndValidity({
            emitEvent: false,
          });
          this.dialogFacade.fetchCo2ValuesForSupplierSteelMakingProcess(
            supplierId,
            steelMakingProcess,
            productCategory
          );
        });
    }
  }

  public selectReleaseDateView() {
    if (!this.isEditDialog() || this.isCopyDialog()) {
      return ReleaseDateViewMode.DEFAULT;
    } else if (
      this.isBulkEditDialog() ||
      (this.releaseMonthControl.value && this.releaseYearControl.value)
    ) {
      return ReleaseDateViewMode.READONLY;
    } else {
      return ReleaseDateViewMode.HISTORIC;
    }
  }

  public addReferenceDocument(referenceDocument: string): void {
    this.dialogFacade.addCustomReferenceDocument(referenceDocument);
  }

  public addCastingDiameter(castingDiameter: string): void {
    this.dialogFacade.addCustomCastingDiameter(castingDiameter);
  }

  public steelMakingProcessFilterFn = (
    option?: StringOption,
    value?: string
  ) => {
    if (value === this.STEEL_MAKING_PROCESS_SEARCH_STRING) {
      return this.steelMakingProcessesInUse.includes(option?.title);
    }

    return util.filterFn(option, value);
  };

  enableEditFields(materialFormValue: Partial<SteelMaterialFormValue>): void {
    super.enableEditFields(materialFormValue);

    if (
      (!materialFormValue.releaseDateMonth ||
        !materialFormValue.releaseDateYear) &&
      !this.isCopyDialog()
    ) {
      this.releaseMonthControl.removeValidators(Validators.required);
      this.releaseYearControl.removeValidators(Validators.required);
    }

    if (this.isBulkEdit) {
      this.selfCertifiedControl.enable();
      this.castingDiameterControl.enable();
      this.co2ClassificationControl.enable();
    }
  }

  openReferenceDocumentBulkEditDialog(): void {
    this.dialogRef.close();
    this.dialogService.openReferenceDocumentBulkEditDialog(
      this.dialogData.editDialogInformation.selectedRows
    );
  }

  // validator for both recycling rate input fields
  private minRecycleRateValidatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // get controls from formgroup
      const minControl = control;
      const maxControl = this.maxRecyclingRateControl;
      // get values of controlls
      const min = minControl.value;
      const max = maxControl.value;
      // check if input fields are filled
      const minFilled = min || min === 0;
      const maxFilled = max || max === 0;

      // if only on field is filled, the other is required
      if (maxFilled && !minFilled) {
        return { dependency: true };
      }

      return undefined;
    };
  }

  // validator for both recycling rate input fields
  private maxRecycleRateValidatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // get controls from formgroup
      const minControl = this.minRecyclingRateControl;
      const maxControl = control;
      // get values of controlls
      const min = minControl.value;
      const max = maxControl.value;
      // check if input fields are filled
      const minFilled = min || min === 0;
      const maxFilled = max || max === 0;

      // if both fields are filled, verify min/max are valid
      if (minFilled && maxFilled && min > max) {
        return { scopeTotalLowerThanSingleScopes: { min, max } };
      }
      // if only on field is filled, the other is required
      else if (minFilled && !maxFilled) {
        return { dependency: true };
      }

      return undefined;
    };
  }

  // validator for a field that is only mandatory depending on input from other fields
  private dependencyValidatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { dependency: true };
      }

      return undefined;
    };
  }
}
