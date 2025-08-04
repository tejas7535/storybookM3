/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { AppRoutePath } from '@ea/app-route-path.enum';
import { LocalStorageService } from '@ea/core/local-storage';
import { getAssetsPath } from '@ea/core/services/assets-path-resolver/assets-path-resolver.helper';
import {
  CalculationChip,
  CalculationParametersChipsService,
  ElectricityRegionOption,
  FossilOriginOption,
  SelectOption,
} from '@ea/core/services/calculation-parameters';
import { CalculationParametersFormHelperService } from '@ea/core/services/calculation-parameters-form-helper.service';
import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import {
  CalculationParametersFacade,
  CalculationResultFacade,
} from '@ea/core/store';
import {
  CalculationParametersActions,
  CatalogCalculationResultActions,
  CO2DownstreamCalculationActions,
} from '@ea/core/store/actions';
import { setSelectedLoadcase } from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import {
  CalculationParameterGroup,
  CalculationParametersOperationConditions,
  LoadCaseData,
} from '@ea/core/store/models';
import { environment } from '@ea/environments/environment';
import { AppStoreButtonsComponent } from '@ea/shared/app-store-buttons/app-store-buttons.component';
import { Greases } from '@ea/shared/constants/greases';
import { ISOVgClasses } from '@ea/shared/constants/iso-vg-classes';
import { SLEWING_BEARING_TYPE } from '@ea/shared/constants/products';
import { InfoBannerComponent } from '@ea/shared/info-banner/info-banner.component';
import { InfoButtonComponent } from '@ea/shared/info-button/info-button.component';
import { InputGroupComponent } from '@ea/shared/input-group/input-group.component';
import { InputNumberComponent } from '@ea/shared/input-number/input-number.component';
import { InputSelectComponent } from '@ea/shared/input-select/input-select.component';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { OptionTemplateDirective } from '@ea/shared/tabbed-options/option-template.directive';
import { TabbedOptionsComponent } from '@ea/shared/tabbed-options/tabbed-options.component';
import { TabbedSuboptionComponent } from '@ea/shared/tabbed-suboption/tabbed-suboption.component';
import { TranslocoService } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';
import { CalculationParametersFormDevDebugComponent } from '../calculation-parameters-form-dev-debug/calculation-parameters-form-dev-debug.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection.component';
import { CalculationParametersFormFactory } from './calculation-parameters-form.factory';
import { getContaminationOptions } from './contamination.options';
import {
  getElectricityRegionOptions,
  getFossilOriginOptions,
} from './energy-source.options';
import { getEnvironmentalInfluenceOptions } from './environmental-influence.options';
import { relativeValidatorFactory } from './form-validators';
import { LoadCaseDataFormGroupModel } from './loadcase-data-form-group.interface';
import { ParameterTemplateDirective } from './parameter-template.directive';

@Component({
  templateUrl: './calculation-parameters.component.html',
  selector: 'ea-calculation-parameters',
  imports: [
    CommonModule,
    MatIconModule,
    InputNumberComponent,
    InputSelectComponent,
    ParameterTemplateDirective,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    InputGroupComponent,
    MatSlideToggleModule,
    TabbedOptionsComponent,
    TabbedSuboptionComponent,
    OptionTemplateDirective,
    PushPipe,
    InfoBannerComponent,
    QualtricsInfoBannerComponent,
    SharedTranslocoModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    CalculationParametersFormDevDebugComponent,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    InfoButtonComponent,
    MatTooltipModule,
    SubheaderModule,
    LetDirective,
    AppStoreButtonsComponent,
    MatCardModule,
  ],
})
export class CalculationParametersComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChildren(ParameterTemplateDirective)
  public templates!: QueryList<ParameterTemplateDirective>;

  @Input()
  public isStandalone: boolean;

  public readonly bearingClass = input.required<CatalogServiceProductClass>();

  public readonly isSlewingBearing = computed(
    () => this.bearingClass() === SLEWING_BEARING_TYPE
  );

  public readonly shouldShowOperatingTemperature = computed(
    () => !this.isSlewingBearing()
  );

  public readonly defaultOperatingTemperature = computed(() =>
    this.isSlewingBearing() ? undefined : 70
  );

  public DEBOUNCE_TIME_DEFAULT = 200;
  public readonly isProduction = environment.production;
  public showPresetParameters = false;

  public readonly downstreamImagePath = `${getAssetsPath()}/images/downstream-coming-soon.png`;

  public parameterTemplates$:
    | Observable<{
        mandatory: TemplateRef<unknown>[];
        preset: TemplateRef<unknown>[];
        loadCases: TemplateRef<unknown>[];
      }>
    | undefined;

  public parameterTemplates:
    | {
        mandatory: TemplateRef<unknown>[];
        preset: TemplateRef<unknown>[];
        loadCases: TemplateRef<unknown>[];
      }
    | undefined;

  public operationConditions$ =
    this.calculationParametersFacade.operationConditions$;

  public readonly bearingDesignation$ =
    this.productSelectionFacade.bearingDesignation$;

  public readonly hasSelection$ =
    this.calculationParametersFacade.hasCalculation$;

  public readonly loadAvailable$ = this.productSelectionFacade.availableLoads$;

  public readonly lubricationMethodsAvailable$ =
    this.productSelectionFacade.availableLubricationMethods$;

  public readonly isCo2DownstreamCalculationPossible$ =
    this.productSelectionFacade.isCo2DownstreamCalculationPossible$;

  public forceAvailable = toSignal(this.productSelectionFacade.availableForce$);
  public momentAvailable = toSignal(
    this.productSelectionFacade.availableMoment$
  );

  public presetChips$: Observable<CalculationChip[]> | undefined;

  // Initialize form as undefined, will be created in ngOnChanges
  public operationConditionsForm: FormGroup | undefined;

  form: FormGroup | undefined;

  public formErrors$: Observable<ValidationErrors> | undefined;

  public readonly isoVgClasses = ISOVgClasses;
  public readonly greases = Greases;
  public typeOfMotionsAvailable$:
    | Observable<LoadCaseData['rotation']['typeOfMotion'][]>
    | undefined;
  public contaminationOptions$: Observable<SelectOption[]> | undefined;
  public fossilOriginOptions$: Observable<FossilOriginOption[]> | undefined;
  public electricityRegionOptions$:
    | Observable<ElectricityRegionOption[]>
    | undefined;

  public environmentalInfluenceOptions$: Observable<SelectOption[]> | undefined;

  public readonly hasCalculationSelected$ =
    this.calculationParametersFacade.hasCalculation$;

  private readonly templates$ = this.productSelectionFacade.templates$;

  private readonly destroy$ = new Subject<void>();

  // Getter methods for properly typed form controls access in template
  get lubricationFormGroup(): FormGroup | undefined {
    return this.operationConditionsForm?.controls['lubrication'] as FormGroup;
  }

  get energySourceFormGroup(): FormGroup | undefined {
    return this.operationConditionsForm?.controls['energySource'] as FormGroup;
  }

  get loadCaseDataFormArray(): FormArray | undefined {
    return this.operationConditionsForm?.controls['loadCaseData'] as FormArray;
  }

  get ambientTemperatureControl(): FormControl | undefined {
    return this.operationConditionsForm?.controls[
      'ambientTemperature'
    ] as FormControl;
  }

  get contaminationControl(): FormControl | undefined {
    return this.operationConditionsForm?.controls[
      'contamination'
    ] as FormControl;
  }

  get timeControl(): FormControl | undefined {
    return this.operationConditionsForm?.controls['time'] as FormControl;
  }

  get conditionOfRotationControl(): FormControl | undefined {
    return this.operationConditionsForm?.controls[
      'conditionOfRotation'
    ] as FormControl;
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  asFormControl(control: any): FormControl {
    return control as FormControl;
  }

  private loadCaseCount = 1;

  constructor(
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    public readonly matDialog: MatDialog,
    private readonly translocoService: TranslocoService,
    private readonly calculationParametersFormHelperService: CalculationParametersFormHelperService,
    private readonly router: Router,
    private readonly analyticsService: TrackingService,
    private readonly changeDetectionRef: ChangeDetectorRef,
    private readonly localStorageService: LocalStorageService,
    private readonly chipsService: CalculationParametersChipsService,
    private readonly formFactory: CalculationParametersFormFactory
  ) {}

  get operatingTemperature(): FormControl | undefined {
    if (!this.operationConditionsForm) {
      return undefined;
    }

    // For slewing bearings, operating temperature is not part of load cases
    if (this.isSlewingBearing()) {
      return undefined;
    }

    const loadCaseArray = this.operationConditionsForm.controls[
      'loadCaseData'
    ] as FormArray;

    return loadCaseArray?.controls[0]?.get(
      'operatingTemperature'
    ) as FormControl;
  }

  get isSingleLoadCaseForm(): boolean {
    if (!this.operationConditionsForm) {
      return true;
    }

    const loadCaseArray = this.operationConditionsForm.controls[
      'loadCaseData'
    ] as FormArray;

    return loadCaseArray?.controls.length === 1;
  }

  get totalOperatingTime(): number {
    if (!this.operationConditionsForm) {
      return 0;
    }

    const loadCaseArray = this.operationConditionsForm.controls[
      'loadCaseData'
    ] as FormArray;

    return this.calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases(
      loadCaseArray?.controls as FormGroup<LoadCaseDataFormGroupModel>[]
    );
  }

  getLoadCaseTimePortion(loadcasePercentage: number): string {
    return this.calculationParametersFormHelperService.getLocalizedLoadCaseTimePortion(
      this.operationConditionsForm.controls.time.value,
      loadcasePercentage
    );
  }

  ngOnChanges(_changes: SimpleChanges) {
    // Note: bearingClass is now a signal, so we don't need to check for changes
    // The signal will automatically trigger updates when the input changes
    if (this.bearingClass()) {
      this.initializeForm();
      // Re-setup template observables after form is created
      if (this.templates) {
        this.setupTemplateObservables();
      }
    }
  }

  ngOnInit() {
    // If bearingClass is already available, initialize form
    if (this.bearingClass()) {
      this.initializeForm();
    }

    // Only setup form subscriptions if form exists
    if (this.form && this.operationConditionsForm) {
      this.setupFormSubscriptions();
    }
  }

  private initializeForm() {
    const formResult = this.formFactory.createForm(
      this.bearingClass(),
      this.DEBOUNCE_TIME_DEFAULT
    );

    this.operationConditionsForm = formResult.operationConditionsForm;
    this.form = formResult.form;
    this.formErrors$ = formResult.formErrors$;

    this.setupFormValidation();
    this.setupFormSubscriptions();
  }

  private setupFormValidation() {
    if (!this.operationConditionsForm) {
      return;
    }

    const operatingTmpControl = this.operatingTemperature;
    const ambientTempControl =
      this.operationConditionsForm.get('ambientTemperature');

    if (ambientTempControl && operatingTmpControl) {
      ambientTempControl.addValidators(
        relativeValidatorFactory('<', operatingTmpControl, 'tmpBoundViolation')
      );
      operatingTmpControl.addValidators(
        relativeValidatorFactory('>', ambientTempControl, 'tmpBoundViolation')
      );
    }
  }

  private setupFormSubscriptions() {
    if (!this.form || !this.operationConditionsForm) {
      return;
    }

    // update form from store
    this.operationConditions$
      .pipe(
        takeUntil(this.destroy$),
        map((operationConditions) => {
          const {
            selectedLoadcase: _,
            ...operationConditionsWithoutSelectedLoadcase
          } = operationConditions;

          return operationConditionsWithoutSelectedLoadcase;
        }),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current)
        ),
        tap((operationConditions) => {
          if (
            this.form.getRawValue().operationConditions.loadCaseData.length <
            operationConditions.loadCaseData.length
          ) {
            for (const loadCaseData of operationConditions.loadCaseData.slice(
              1
            )) {
              const loadCaseArray = this.operationConditionsForm.controls[
                'loadCaseData'
              ] as FormArray;

              const operatingTemp = this.isSlewingBearing()
                ? undefined
                : loadCaseData.operatingTemperature;

              loadCaseArray.push(
                this.formFactory.createLoadCaseDataFormGroup(
                  loadCaseData.loadCaseName,
                  operatingTemp,
                  this.bearingClass()
                )
              );
            }
            this.loadCaseCount = operationConditions.loadCaseData.length;
          }
        })
      )
      .subscribe((parametersState) => {
        this.form.patchValue({ operationConditions: parametersState });
      });

    // update store from form
    combineLatest([this.form.valueChanges, this.form.statusChanges])
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.DEBOUNCE_TIME_DEFAULT),
        map(([formValue, _status]) => formValue),
        distinctUntilChanged((a, b) => {
          const result =
            this.calculationParametersFormHelperService.updateResultsToHandleNegativeValues(
              a.operationConditions as Partial<CalculationParametersOperationConditions>,
              b.operationConditions as Partial<CalculationParametersOperationConditions>
            );

          a.operationConditions = result.previous;
          b.operationConditions = result.new;

          return JSON.stringify(a) === JSON.stringify(b);
        })
      )
      .subscribe((formValue) => {
        this.calculationParametersFacade.dispatch(
          CalculationParametersActions.operatingParameters({
            ...formValue,
            operationConditions: this.form.getRawValue().operationConditions,
            isValid: this.form.valid,
          })
        );

        if (!this.form.valid) {
          this.resetCatalogCalculationResults();
          this.resetDownstreamCalculationResults();
        }
      });

    this.form.statusChanges
      .pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME_DEFAULT))
      .subscribe(() => {
        this.calculationParametersFacade.dispatch(
          CalculationParametersActions.setIsInputInvalid({
            isInputInvalid: !this.form.valid,
          })
        );
      });

    combineLatest([
      this.calculationParametersFacade.getCalculationTypes$,
      this.templates$,
    ])
      .pipe(
        distinctUntilChanged(
          (
            [_calculationTypesOld, templatesOld],
            [_calculationTypesNew, templatesNew]
          ) => JSON.stringify(templatesOld) === JSON.stringify(templatesNew)
        ),
        filter(
          ([calculationTypes, templates]) =>
            !!calculationTypes &&
            !!templates.loadcaseTemplate &&
            !!templates.operatingConditionsTemplate
        ),
        take(1)
      )
      .subscribe(([calculationTypes, templates]) =>
        this.localStorageService.restoreStoredSession(
          calculationTypes,
          templates.loadcaseTemplate,
          templates.operatingConditionsTemplate
        )
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  ngAfterViewInit() {
    // Wait for templates to be available
    this.setupTemplateObservables();
    this.setupStaticObservables();
  }

  private setupTemplateObservables() {
    if (!this.templates) {
      return;
    }

    // at this point templateRefs are available so we can setup the observable
    this.parameterTemplates$ = combineLatest([
      this.calculationParametersFacade.getCalculationFieldsConfig$,
      this.templates.changes.pipe(startWith(this.templates)),
    ]).pipe(
      map(([fieldConfig, templates]) => {
        const convertConfig = (item: CalculationParameterGroup) => {
          const templateRef = (templates as typeof this.templates)?.find(
            (template) =>
              typeof template.name === 'string'
                ? template.name === item
                : template.name.includes(item)
          );
          if (!templateRef) {
            throw new Error(`Template for ${item} not found`);
          }

          return templateRef.template;
        };

        const operatingTimeAndTemperature: CalculationParameterGroup =
          'operatingTimeAndTemperature';

        const loadTemplatesFields = new Set([
          operatingTimeAndTemperature,
          'load',
          'rotatingCondition',
          'force',
          'moment',
        ]);

        const mandatory: TemplateRef<unknown>[] = fieldConfig.required
          .filter((element) => !loadTemplatesFields.has(element))
          .map((element) => convertConfig(element))
          .filter((value, index, self) => self.indexOf(value) === index);

        const preset: TemplateRef<unknown>[] = fieldConfig.preset
          .map((element) => convertConfig(element))
          .filter((value, index, self) => self.indexOf(value) === index);

        const loadCases: TemplateRef<unknown>[] = [
          operatingTimeAndTemperature,
          ...fieldConfig.required,
        ]
          .filter((element) => loadTemplatesFields.has(element))
          .map((element) => convertConfig(element))
          .filter((value, index, self) => self.indexOf(value) === index);

        this.changeDetectionRef.detectChanges();

        return { mandatory, preset, loadCases };
      })
    );

    this.parameterTemplates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((templates) => {
        this.parameterTemplates = templates;
        this.changeDetectionRef.detectChanges();
      });

    // Setup preset chips only if form is available
    if (this.operationConditionsForm) {
      this.setupPresetChips();
    }
  }

  private setupStaticObservables() {
    this.contaminationOptions$ = getContaminationOptions(this.translocoService);
    this.electricityRegionOptions$ = getElectricityRegionOptions(
      this.translocoService
    );
    this.fossilOriginOptions$ = getFossilOriginOptions(this.translocoService);

    this.environmentalInfluenceOptions$ = getEnvironmentalInfluenceOptions(
      this.translocoService
    );

    this.typeOfMotionsAvailable$ = this.productSelectionFacade
      .getTemplateItem('IDSLC_TYPE_OF_MOVEMENT')
      .pipe(
        map((template) =>
          (template?.options || []).map(
            ({ value }) => value as LoadCaseData['rotation']['typeOfMotion']
          )
        )
      );
  }

  private setupPresetChips() {
    if (!this.operationConditionsForm) {
      return;
    }

    this.presetChips$ = combineLatest([
      this.operationConditionsForm.valueChanges.pipe(
        startWith(this.operationConditionsForm.value)
      ),
      this.calculationParametersFacade.getCalculationFieldsConfig$,
      this.contaminationOptions$,
      this.fossilOriginOptions$,
      this.electricityRegionOptions$,
    ]).pipe(
      takeUntil(this.destroy$),
      map(
        ([
          changes,
          { preset },
          contaminationOptions,
          fossilOriginOptions,
          electricityRegionOptions,
        ]) => {
          const chips = [...preset];
          if (preset.includes('operatingTemperature')) {
            chips.push('ambientTemperature');
          }

          const valueMappers: { [Key: string]: () => CalculationChip } = {
            contamination: () =>
              this.chipsService.getContaminationChip(
                contaminationOptions,
                changes.contamination
              ),
            energySource: () =>
              this.chipsService.getEnergySourceChip(
                changes.energySource.type,
                changes.energySource?.fossil?.fossilOrigin,
                changes.energySource?.electric?.electricityRegion,
                fossilOriginOptions,
                electricityRegionOptions
              ),
            time: () => this.chipsService.getTimeChip(changes.time),
            conditionOfRotation: () => ({
              text: this.translocoService.translate(
                `operatingConditions.rotatingCondition.options.${changes.conditionOfRotation}`
              ),
              icon: 'flip_camera_android',
            }),
            ambientTemperature: () => ({
              text: `${changes.ambientTemperature}°C`,
              label: this.translocoService.translate(
                'operationConditions.temperature.ambientTemperature.label'
              ),
              icon: 'device_thermostat',
            }),
            operatingTemperature: () => ({
              label: this.translocoService.translate(
                'operationConditions.temperature.operatingTemperature.label'
              ),
              text:
                changes.loadCaseData.length === 1 &&
                changes.loadCaseData[0].operatingTemperature !== undefined
                  ? `${changes.loadCaseData[0].operatingTemperature}°C`
                  : undefined,
              icon: 'device_thermostat',
            }),
            lubrication: () => {
              let text;
              const data = changes.lubrication;
              const sel = changes.lubrication.lubricationSelection;
              const greasing = data[sel];
              const greaseSelection = greasing.selection;

              const [title, value] = Object.entries(greasing).find(
                ([key, _]) => key === greaseSelection
              );

              const label = this.translocoService.translate(
                `operationConditions.lubrication.options.${sel}`
              );

              // eslint-disable-next-line default-case
              switch (title) {
                case 'viscosity':
                  text = 'Custom viscosity';
                  break;

                case 'isoVgClass':
                  text = (value as any)?.isoVgClass
                    ? `ISO VG ${(value as any).isoVgClass}`
                    : undefined;
                  break;

                case 'typeOfGrease':
                  text = Greases.find(
                    (g) => g.value === (value as any)?.typeOfGrease
                  )?.label;
                  break;
              }

              return { text, label, icon: 'water_drop' };
            },
          };

          return chips
            .map((key) => ({ key, func: valueMappers[key] }))
            .filter((obj) => obj.func)
            .map((b) => ({ ...b.func() }))
            .filter((a) => a.text) as {
            text: string;
            label: string;
            icon: string;
          }[];
        }
      )
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateBack(): void {
    this.router.navigate([`${AppRoutePath.HomePath}`]);
  }

  public onResetButtonClick(): void {
    this.resetLoadcasesArray();
    this.calculationParametersFacade.dispatch(
      CalculationParametersActions.resetCalculationParameters()
    );
    this.resetCatalogCalculationResults();
    this.resetDownstreamCalculationResults();
  }

  public onShowBasicFrequenciesDialogClick(): void {
    this.matDialog.open(BasicFrequenciesComponent);
  }

  public onRemoveLoadCaseClick(index: number): void {
    const dialogRef =
      this.calculationParametersFormHelperService.openConfirmDeleteDialog();
    dialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.removeLoadcase(index);
      });
  }

  public onShowCalculationTypesClick(): void {
    this.matDialog.open(CalculationTypesSelectionComponent);
  }

  public onAddLoadCaseClick(): void {
    this.updateFirstLoadCaseName();
    this.loadCaseCount += 1;
    this.analyticsService.logLoadcaseEvent('Added', this.loadCaseCount);

    // Only set operating temperature for non-slewing bearings
    const operatingTemperatureValue = this.defaultOperatingTemperature();

    const loadCaseName =
      this.calculationParametersFormHelperService.getLocalizedLoadCaseName(
        this.loadCaseCount
      );

    const loadCaseArray = this.operationConditionsForm?.controls[
      'loadCaseData'
    ] as FormArray;
    loadCaseArray?.push(
      this.formFactory.createLoadCaseDataFormGroup(
        loadCaseName,
        operatingTemperatureValue,
        this.bearingClass()
      )
    );
  }

  public onSelectedLoadCaseChange(selectedLoadcase: number): void {
    this.calculationParametersFacade.dispatch(
      setSelectedLoadcase({ selectedLoadcase })
    );
  }

  sendClickEvent(storeName: string) {
    this.analyticsService.logAppStoreClick(storeName, 'calculation-parameters');
  }

  private resetLoadcasesArray(): void {
    const loadCaseArray = this.operationConditionsForm?.controls[
      'loadCaseData'
    ] as FormArray;
    while (loadCaseArray && loadCaseArray.length > 1) {
      this.removeLoadcase(1);
    }
  }

  private removeLoadcase(index: number): void {
    const loadCaseArray = this.operationConditionsForm?.controls[
      'loadCaseData'
    ] as FormArray;
    loadCaseArray?.removeAt(index);
    this.loadCaseCount -= 1;
    this.analyticsService.logLoadcaseEvent('Removed', this.loadCaseCount);
    if (this.isSingleLoadCaseForm) {
      this.calculationParametersFacade.dispatch(
        setSelectedLoadcase({ selectedLoadcase: 0 })
      );

      this.setFirstLoadcaseName('');
    }
  }

  private updateFirstLoadCaseName(): void {
    if (this.isSingleLoadCaseForm) {
      this.loadCaseCount = 1;
      const firstLoadCaseName =
        this.calculationParametersFormHelperService.getLocalizedLoadCaseName(
          this.loadCaseCount
        );

      this.setFirstLoadcaseName(firstLoadCaseName);
    }
  }

  private setFirstLoadcaseName(name: string): void {
    const loadCaseArray = this.operationConditionsForm?.controls[
      'loadCaseData'
    ] as FormArray;
    const firstLoadCase = loadCaseArray?.controls[0] as FormGroup;
    firstLoadCase?.get('loadCaseName')?.setValue(name);
  }

  private resetCatalogCalculationResults(): void {
    this.calculationResultFacade.dispatch(
      CatalogCalculationResultActions.resetCalculationResult()
    );
  }

  private resetDownstreamCalculationResults(): void {
    this.calculationResultFacade.dispatch(
      CO2DownstreamCalculationActions.resetDownstreamCalculation()
    );
  }
}
