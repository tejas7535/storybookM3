/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
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
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';

import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import moment from 'moment';

import {
  FileUploadComponent,
  Message,
  SelectedFile,
} from '@schaeffler/file-upload';
import { StringOption } from '@schaeffler/inputs';
import { SelectComponent, SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  Co2Classification,
  MaterialClass,
} from '@mac/feature/materials-supplier-database/constants';
import {
  NONE_OPTION,
  SCHAEFFLER_EXPERTS,
  SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
  SCHAEFFLER_EXPERTS_OPTION,
  SCHAEFFLER_EXPERTS_PCF_OPTION,
  THIRD_PARTY_VERIFIED_OPTION,
} from '@mac/feature/materials-supplier-database/constants/co2-classification-options';
import { MaterialInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component';
import {
  DialogControlsService,
  FileService,
} from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/services';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { MsdSnackbarService } from '@mac/feature/materials-supplier-database/services/msd-snackbar';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import {
  DataResult,
  SteelMaterialForm,
  SteelMaterialFormValue,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { BaseDialogComponent } from '../../base-dialog/base-dialog.component';
import { Co2ComponentComponent } from '../../components/co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from '../../components/manufacturer-supplier/manufacturer-supplier.component';
import { MaterialDialogBasePartDirective } from '../../components/material-dialog-base-part/material-dialog-base-part.directive';
import { MaterialStandardComponent } from '../../components/material-standard/material-standard.component';
import { RecyclingRateComponent } from '../../components/recycline-rate/recycling-rate.component';
import * as util from '../../util';
import { ReleaseDateViewMode } from './constants/release-date-view-mode.enum';

const DATE_FORMATS = {
  parse: { dateInput: 'YYYY-MM-DD' },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'YYYY-MM-DD',
  },
};

@Component({
  selector: 'mac-steel-input-dialog',
  templateUrl: './steel-input-dialog.component.html',
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
    MaterialDialogBasePartDirective,
    // angular material
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    // forms
    ReactiveFormsModule,
    // libs
    FileUploadComponent,
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  providers: [DialogControlsService, provideMomentDateAdapter(DATE_FORMATS)],
})
export class SteelInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit, AfterViewInit
{
  @ViewChildren('steelMakingProcessSelect', { read: SelectComponent })
  private readonly steelMakingProcessSelectQueryList: QueryList<SelectComponent>;

  public materialClass = MaterialClass.STEEL;
  public SCHAEFFLER_EXPERTS = SCHAEFFLER_EXPERTS;
  public SCHAEFFLER_EXPERTS_CALCULATION_TOOL: string =
    Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL;

  public castingModes$ = this.dialogFacade.castingModes$;
  public co2Classification$ = this.dialogFacade.co2Classification$;
  public ratings$ = this.dialogFacade.ratings$;
  public categories$ = this.dialogFacade.categories$;
  public steelMakingProcess$ = this.dialogFacade.steelMakingProcess$;
  public castingDiameters$ = this.dialogFacade.castingDiameters$;
  public referenceDocuments$ = this.dialogFacade.referenceDocuments$;
  public productCategoryRules$ = this.dialogFacade.productCategoryRules$;
  public co2Standards$ = this.dialogFacade.co2Standards$;

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

  // new co2 controls
  public co2UpstreamControl = this.controlsService.getNumberControl();
  public co2CoreControl = this.controlsService.getNumberControl();
  public co2ClassificationNewControl =
    this.controlsService.getControl<StringOption>(NONE_OPTION, true);
  public co2ClassificationNewSecondaryControl =
    this.controlsService.getControl<StringOption>(
      SCHAEFFLER_EXPERTS_PCF_OPTION,
      true
    );
  public co2StandardControl = this.controlsService.getControl<StringOption>(
    undefined,
    true
  );
  public productCategoryRuleControl =
    this.controlsService.getControl<StringOption>(undefined, true);
  public reportValidUntilControl = this.controlsService.getControl<
    string | number
  >(undefined, true);
  public reportValidUntilControlMoment =
    this.controlsService.getControl<moment.Moment>(
      moment().add(1, 'year'),
      true
    );
  public dataQualityRatingControl = this.controlsService.getControl<number>(
    undefined,
    true
  );
  public primaryDataShareControl = this.controlsService.getControl<number>(
    undefined,
    true
  );
  public co2UploadFileControl = this.controlsService.getControl<File>(
    undefined,
    true
  );
  public co2UploadFileIdControl = this.controlsService.getControl<number>(
    undefined,
    false
  );
  public co2UploadFileFilenameControl = this.controlsService.getControl<string>(
    undefined,
    true
  );

  public co2CommentControl = this.controlsService.getControl<string>(
    undefined,
    true
  );

  // steel making processes
  public steelMakingProcessesInUse: string[] = [];

  // releasedate year & month
  public years: number[];
  public months: number[];

  // utility for parsing error message
  public readonly getErrorMessage = util.getErrorMessage;

  public readonly uploadMessages$ = new BehaviorSubject<Message[] | undefined>(
    undefined
  );
  public readonly uploadMessagesObs$ = this.uploadMessages$.pipe(
    distinctUntilChanged()
  );

  // casting diameter dependencies
  castingDiameterDep: FormGroup<{
    supplierId: FormControl<number>;
    castingMode: FormControl<string>;
  }>;
  private readonly STEEL_MAKING_PROCESS_SEARCH_STRING = 'in use by supplier';

  // co2 dependencies
  private readonly co2ValuesForSupplierSteelMakingProcess$ =
    this.dialogFacade.co2ValuesForSupplierSteelMakingProcess$;
  private co2Controls: FormArray<FormControl<number>>;

  // autofiller for steelMakingprocess
  private readonly steelMakingProcessesInUse$ =
    this.dialogFacade.steelMakingProcessesInUse$;

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly fileService: FileService,
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

      co2Upstream: this.co2UpstreamControl,
      co2Core: this.co2CoreControl,

      co2PerTon: this.co2TotalControl,
      co2Classification: this.co2ClassificationControl,
      co2ClassificationNew: this.co2ClassificationNewControl,
      co2ClassificationNewSecondary: this.co2ClassificationNewSecondaryControl,
      co2Standard: this.co2StandardControl,
      productCategoryRule: this.productCategoryRuleControl,
      reportValidUntil: this.reportValidUntilControl,
      dataQualityRating: this.dataQualityRatingControl,
      primaryDataShare: this.primaryDataShareControl,
      co2UploadFile: this.co2UploadFileControl,
      co2UploadFileId: this.co2UploadFileIdControl,
      co2UploadFileFilename: this.co2UploadFileFilenameControl,
      co2Comment: this.co2CommentControl,

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

    this.co2Controls = new FormArray([
      this.co2UpstreamControl,
      this.co2CoreControl,
    ]);
    this.co2TotalControl.addValidators(
      this.scopeTotalValidatorFn(this.co2Controls)
    );

    // if co2Total is not required by default, it is required once one of the scope fields is filled out.
    this.co2Controls.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((scopes) => {
        // if any of the scopes is filled, co2Total is required
        if (scopes.some((v) => !!v)) {
          this.co2TotalControl.addValidators(Validators.required);
        } else {
          this.co2TotalControl.removeValidators(Validators.required);
        }
        this.co2TotalControl.updateValueAndValidity();
      });

    this.co2TotalControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        value
          ? this.co2ClassificationNewControl.enable({ emitEvent: false })
          : this.co2ClassificationNewControl.disable({ emitEvent: false })
      );

    // co2 fields enable disable
    this.co2ClassificationNewControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id }) => {
        if (id) {
          this.co2ClassificationNewSecondaryControl.enable();
          this.co2StandardControl.enable();
          this.productCategoryRuleControl.enable();
          this.dataQualityRatingControl.enable();
          this.primaryDataShareControl.enable();
          this.co2CommentControl.enable();
          this.co2UploadFileControl.enable();
        } else {
          this.co2ClassificationNewSecondaryControl.disable();
          this.co2StandardControl.disable();
          this.productCategoryRuleControl.disable();
          this.reportValidUntilControl.disable();
          this.reportValidUntilControlMoment.disable();
          this.dataQualityRatingControl.disable();
          this.primaryDataShareControl.disable();
          this.co2UploadFileControl.disable();
          this.co2CommentControl.disable();
        }
        this.createMaterialForm.updateValueAndValidity({
          emitEvent: false,
        });
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

    this.reportValidUntilControlMoment.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.reportValidUntilControl.setValue(value?.format('YYYY-MM-DD'));
      });

    this.createMaterialForm.valueChanges.subscribe((val) => {
      const cleanedValue = {
        ...val,
        reportValidUntil:
          this.reportValidUntilControlMoment.value?.format('YYYY-MM-DD'),
        co2UploadFile: undefined,
      };

      this.dialogFacade.updateCreateMaterialDialogValues(cleanedValue);
    });

    this.co2UploadFileIdControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        if (id) {
          this.reportValidUntilControl.enable();
          this.reportValidUntilControlMoment.enable();
        } else if (!id && !this.co2UploadFileControl.value) {
          this.reportValidUntilControl.disable();
          this.reportValidUntilControlMoment.disable();
        }
        this.uploadMessages$.next(this.getUploadMessages());
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

    if (this.dialogData.editDialogInformation?.row?.reportValidUntil) {
      this.reportValidUntilControlMoment.setValue(
        moment(this.dialogData.editDialogInformation.row.reportValidUntil)
      );
    }
  }

  public getCo2ClassificationsNew(): StringOption[] {
    return [
      THIRD_PARTY_VERIFIED_OPTION,
      SCHAEFFLER_EXPERTS_OPTION,
      NONE_OPTION,
    ];
  }

  public getCo2ClassificationsNewSecondary(): StringOption[] {
    return [
      SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
      SCHAEFFLER_EXPERTS_PCF_OPTION,
    ];
  }

  public setFile(files: SelectedFile[]): void {
    if (files.length !== 1) {
      this.co2UploadFileControl.reset();
      this.fileService.setCo2UploadFile();
      if (!this.co2UploadFileIdControl.value) {
        this.reportValidUntilControl.disable();
        this.reportValidUntilControlMoment.disable();
      }

      return;
    }
    this.co2UploadFileControl.setValue(files[0].file);
    this.co2UploadFileIdControl.reset();
    this.fileService.setCo2UploadFile(files[0].file);
    this.co2UploadFileControl.markAsTouched();
    this.reportValidUntilControl.enable();
    this.reportValidUntilControlMoment.enable();
  }

  public getUploadMessages(): Message[] {
    return this.co2UploadFileIdControl.value
      ? [
          {
            type: 'info',
            title: translate(
              'materialsSupplierDatabase.mainTable.dialog.fileExists'
            ),
            description: translate(
              'materialsSupplierDatabase.mainTable.dialog.fileExistsDescription',
              {
                filename:
                  this.co2UploadFileFilenameControl.value ||
                  this.dialogData.editDialogInformation?.row
                    ?.co2UploadFileFilename,
                validUntil: moment(this.reportValidUntilControl.value).format(
                  'YYYY-MM-DD'
                ),
              }
            ),
          },
        ]
      : undefined;
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

  public addCo2Standard(co2Standard: string): void {
    this.dialogFacade.addCustomCo2Standard(co2Standard);
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
      this.co2ClassificationNewControl.enable();
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

  // special validator that compares entered scope values with co2total
  private readonly scopeTotalValidatorFn =
    (values: FormArray<FormControl<number>>): ValidatorFn =>
    (control: AbstractControl<number>): ValidationErrors | null => {
      if (control.value) {
        const current = control.value || 0;
        const min = values.value
          // replace unfilled values with 0
          .map((value) => value || 0)
          // create sum of all scope values
          .reduce((sum, value) => sum + value, 0);
        const max = values.value
          // replace unfilled values with MAX
          .map((value) => value || Number.MAX_VALUE)
          // create sum of all scope values
          .reduce((sum, value) => sum + value, 0);

        // return error if total value is less than sum of scopes
        if (current < min) {
          return { scopeTotalLowerThanSingleScopes: { min, current } };
        }
        // return error if total value is more than sum of all 3 scopes (all 3 need to be filled out)
        if (current > max) {
          return { scopeTotalHigherThanSingleScopes: { max, current } };
        }

        return undefined;
      }

      return undefined;
    };
}
