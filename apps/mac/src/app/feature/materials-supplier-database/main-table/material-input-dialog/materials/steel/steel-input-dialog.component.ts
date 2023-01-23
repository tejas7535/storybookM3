/* eslint-disable max-lines */
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, map, takeUntil } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';
import { SelectComponent } from '@schaeffler/inputs/select';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  addCustomCastingDiameter,
  addCustomReferenceDocument,
  fetchCastingDiameters,
  fetchCo2ValuesForSupplierSteelMakingProcess,
  fetchReferenceDocuments,
  fetchSteelMakingProcessesInUse,
  resetSteelMakingProcessInUse,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
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
  implements OnInit
{
  private readonly STEEL_MAKING_PROCESS_SEARCH_STRING = 'in use by supplier';

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
  public ratingChangeCommentControl =
    this.controlsService.getRequiredControl<string>(undefined, true);
  public isBlockedControl = this.controlsService.getControl<boolean>(false);
  public steelMakingProcessControl =
    this.controlsService.getControl<StringOption>();
  public isManufacturerControl = this.controlsService.getControl<boolean>(
    false,
    true
  );

  // co2 dependencies
  private co2Controls: FormArray<FormControl<number>>;
  private readonly co2ValuesForSupplierSteelMakingProcess$ =
    this.dialogFacade.co2ValuesForSupplierSteelMakingProcess$;

  // steel making processes
  public steelMakingProcessesInUse: string[] = [];
  @ViewChildren('steelMakingProcessSelect', { read: SelectComponent })
  private readonly steelMakingProcessSelectQueryList: QueryList<SelectComponent>;
  // autofiller for steelMakingprocess
  private readonly steelMakingProcessesInUse$ =
    this.dialogFacade.steelMakingProcessesInUse$;

  // releasedate year & month
  public years: number[];
  public months: number[];

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
    });
    // setup static months and year
    this.months = util.getMonths();
    this.years = util.getYears();

    // enable or disable rating comment, if initial value has been modified
    this.ratingsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: StringOption) =>
        value?.id !== this.dialogData.editDialogInformation?.row?.rating
          ? this.ratingChangeCommentControl.enable({ emitEvent: false })
          : this.ratingChangeCommentControl.disable({ emitEvent: false })
      );

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
        this.dialogFacade.dispatch(resetSteelMakingProcessInUse());
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
          fetchSteelMakingProcessesInUse({
            supplierId,
            castingMode,
            castingDiameter,
          })
        )
      );

    // setup co2Dependencies
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
        }))
      )
      .subscribe(({ supplierId, steelMakingProcess }) => {
        // TODO: remove workaround asap
        this.createMaterialForm.updateValueAndValidity();
        this.dialogFacade.dispatch(
          fetchCo2ValuesForSupplierSteelMakingProcess({
            supplierId,
            steelMakingProcess,
          })
        );
      });

    this.materialStandardIdControl.valueChanges
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((id) =>
        this.dialogFacade.dispatch(
          fetchReferenceDocuments({ materialStandardId: id })
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
    this.co2Controls = new FormArray([
      this.co2Scope1Control,
      this.co2Scope2Control,
      this.co2Scope3Control,
      this.co2TotalControl,
    ]);
    this.co2ValuesForSupplierSteelMakingProcess$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ({ co2Values }) => co2Values && !this.co2Controls.value.some(Boolean)
        )
      )
      .subscribe(({ co2Values, otherValues }) => {
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
      });
  }

  public selectReleaseDateView() {
    if (!this.isEditDialog() || this.isCopyDialog()) {
      return ReleaseDateViewMode.DEFAULT;
    } else if (
      this.releaseMonthControl.value &&
      this.releaseYearControl.value
    ) {
      return ReleaseDateViewMode.READONLY;
    } else {
      return ReleaseDateViewMode.HISTORIC;
    }
  }

  public addReferenceDocument(referenceDocument: string): void {
    this.dialogFacade.dispatch(
      addCustomReferenceDocument({ referenceDocument })
    );
  }

  public addCastingDiameter(castingDiameter: string): void {
    this.dialogFacade.dispatch(addCustomCastingDiameter({ castingDiameter }));
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
  }
}
