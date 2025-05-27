/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
  tap,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import moment, { Moment } from 'moment';

import {
  FileUploadComponent,
  Message,
  SelectedFile,
} from '@schaeffler/file-upload';
import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
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
import { ErrorMessagePipe } from '@mac/feature/materials-supplier-database/main-table/pipes/error-message-pipe/error-message.pipe';
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
import { IronTechnologyComponent } from '../../components/iron-technology-component/iron-technology.component';
import { ManufacturerSupplierComponent } from '../../components/manufacturer-supplier/manufacturer-supplier.component';
import { MaterialDialogBasePartDirective } from '../../components/material-dialog-base-part/material-dialog-base-part.directive';
import { MaterialStandardComponent } from '../../components/material-standard/material-standard.component';

const DATE_FORMATS = {
  parse: { dateInput: 'DD.MM.YYYY' },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'DD.MM.YYYY',
  },
};

@Component({
  selector: 'mac-steel-input-dialog',
  templateUrl: './steel-input-dialog.component.html',
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    MaterialStandardComponent,
    ManufacturerSupplierComponent,
    MaterialDialogBasePartDirective,
    ErrorMessagePipe,
    IronTechnologyComponent,
    // angular material
    MatAutocompleteModule,
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
    MatDatepickerModule,
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
  public readonly co2ClassificationsNew: StringOption[] = [
    THIRD_PARTY_VERIFIED_OPTION,
    SCHAEFFLER_EXPERTS_OPTION,
    NONE_OPTION,
  ];
  public readonly co2ClassificationsNewSecondary: StringOption[] = [
    SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
    SCHAEFFLER_EXPERTS_PCF_OPTION,
  ];

  public materialClass = MaterialClass.STEEL;
  public SCHAEFFLER_EXPERTS = SCHAEFFLER_EXPERTS;
  public SCHAEFFLER_EXPERTS_CALCULATION_TOOL: string =
    Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL;

  public castingModes$ = this.dialogFacade.castingModes$;
  public co2Classification$ = this.dialogFacade.co2Classification$;
  public ratings$ = this.dialogFacade.ratings$;
  public categories$ = this.dialogFacade.categories$;
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
  public referenceDocumentControl =
    this.controlsService.getControl<StringOption[]>();
  public ratingRemarkControl = this.controlsService.getControl<string>();
  public ratingChangeCommentControl = this.controlsService.getControl<string>();
  public isBlockedControl = this.controlsService.getControl<boolean>(false);
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

  public supplierIronSteelManufacturerControl =
    this.controlsService.getControl<boolean>(false);
  public ironTechnologyGroup = new FormGroup({});
  public steelTechnologyControl = this.controlsService.getControl<string>();
  public steelTechnologyCommentControl =
    this.controlsService.getControl<string>();

  // release controls - MomentJs is not allowed in the formControl, so we need to two controls and transfer the data
  public releaseDateControl = this.controlsService.getRequiredNumberControl();
  public releaseDateControlMoment =
    this.controlsService.getRequiredControl<Moment>();
  public isHistoricSupplierControl =
    this.controlsService.getControl<boolean>(false);

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

  // calendar will only allow years between past and next year
  private readonly CALENDAR_FILTER_MIN_YEAR = 2020;
  private readonly CALENDAR_FILTER_MAX_YEAR = moment().year() + 1;

  // co2 dependencies
  private co2Controls: FormArray<FormControl<number>>;

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
      manufacturer: this.supplierIronSteelManufacturerControl,
      materialNumber: this.steelNumberControl,
      maxDimension: this.maxDimControl,
      minDimension: this.minDimControl,
      rating: this.ratingsControl,
      ratingChangeComment: this.ratingChangeCommentControl,
      ratingRemark: this.ratingRemarkControl,
      referenceDoc: this.referenceDocumentControl,
      releaseDate: this.releaseDateControl,
      selfCertified: this.selfCertifiedControl,
      minRecyclingRate: this.minRecyclingRateControl,
      maxRecyclingRate: this.maxRecyclingRateControl,
      processTechnology: this.steelTechnologyControl,
      processTechnologyComment: this.steelTechnologyCommentControl,
      processJson: this.ironTechnologyGroup,
    });

    // "manufacturer"-field only available for new suppliers. For existing suppliers value will be prefilled
    this.supplierPlantControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((supplierPlant) => {
        // disable field for existing suppliers and on empty plant selection
        if (!supplierPlant || !!supplierPlant.data) {
          const isManufacturer = supplierPlant?.data['manufacturer'] || false;
          this.supplierIronSteelManufacturerControl.setValue(isManufacturer);
          this.supplierIronSteelManufacturerControl.disable();
        } else {
          // enable only for new suppliers
          this.supplierIronSteelManufacturerControl.enable();
          this.supplierIronSteelManufacturerControl.setValue(false);
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
        if (castingMode) {
          this.castingDiameterControl.enable();
          if (supplierId) {
            this.dialogFacade.fetchCastingDiameters(supplierId, castingMode);
          }
        } else if (!this.isBulkEditDialog()) {
          this.castingDiameterControl.reset();
          this.castingDiameterControl.disable();
        }
        this.createMaterialForm.updateValueAndValidity({
          emitEvent: false,
        });
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

    this.createMaterialForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        // debounce to prevent slowdown of app while typing long comments
        debounceTime(500)
      )
      .subscribe((val) => {
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

    // releaseDate config
    this.isHistoricSupplierControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((setAsHistoric) => {
        if (setAsHistoric) {
          // if historic is set, reset release date fields and remove 'required' validators
          this.releaseDateControl.removeValidators(Validators.required);
          this.releaseDateControlMoment.disable({ emitEvent: false });
          this.releaseDateControlMoment.removeValidators(Validators.required);
          this.releaseDateControlMoment.reset();
        } else {
          // if historic is unset, set release date fields and add 'required' validators
          this.releaseDateControl.addValidators(Validators.required);
          this.releaseDateControlMoment.enable({ emitEvent: false });
          this.releaseDateControlMoment.addValidators(Validators.required);
          this.releaseDateControlMoment.setValue(moment());
        }
      });

    this.releaseDateControlMoment.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((momentVal: Moment) => {
        if (momentVal) {
          const nbr = Number.parseInt(momentVal.format('YYYYMMDD'), 10);
          this.releaseDateControl.setValue(nbr);
        } else {
          this.releaseDateControl.reset();
        }
      });

    if (this.dialogData.editDialogInformation?.selectedRows?.length > 1) {
      this.referenceDocumentControl.disable();
    }
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (this.dialogData.editDialogInformation?.row?.reportValidUntil) {
      this.reportValidUntilControlMoment.setValue(
        moment(this.dialogData.editDialogInformation.row.reportValidUntil)
      );
    }
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

  public addReferenceDocument(referenceDocument: string): void {
    this.dialogFacade.addCustomReferenceDocument(referenceDocument);
  }

  public addCastingDiameter(castingDiameter: string): void {
    this.dialogFacade.addCustomCastingDiameter(castingDiameter);
  }

  public addCo2Standard(co2Standard: string): void {
    this.dialogFacade.addCustomCo2Standard(co2Standard);
  }

  patchFields(materialFormValue: Partial<SteelMaterialFormValue>): void {
    super.patchFields(materialFormValue);

    if (materialFormValue.processJson) {
      Object.keys(materialFormValue.processJson).forEach((key) => {
        this.ironTechnologyGroup.addControl(
          key,
          this.controlsService.getControl(materialFormValue.processJson[key])
        );
      });
    }

    if (materialFormValue.releaseDate) {
      this.releaseDateControlMoment.setValue(
        moment(materialFormValue.releaseDate, 'YYYYMMDD')
      );
    } else if (!this.isBulkEditDialog()) {
      this.isHistoricSupplierControl.setValue(true);
    }
  }

  enableEditFields(materialFormValue: Partial<SteelMaterialFormValue>): void {
    super.enableEditFields(materialFormValue);

    if (this.isBulkEditDialog()) {
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

  calendarYearFilter = (m: Moment | null): boolean => {
    const year = (m || moment()).year();

    return (
      year >= this.CALENDAR_FILTER_MIN_YEAR &&
      year <= this.CALENDAR_FILTER_MAX_YEAR
    );
  };

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
