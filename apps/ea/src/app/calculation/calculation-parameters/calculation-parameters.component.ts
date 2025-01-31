/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
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
  CalculationParametersEnergySource,
  CalculationParametersOperationConditions,
  LoadCaseData,
} from '@ea/core/store/models';
import { environment } from '@ea/environments/environment';
import { AppStoreButtonsComponent } from '@ea/shared/app-store-buttons/app-store-buttons.component';
import { Greases } from '@ea/shared/constants/greases';
import { ISOVgClasses } from '@ea/shared/constants/iso-vg-classes';
import { extractNestedErrors } from '@ea/shared/helper/form.helper';
import { FormSelectValidatorSwitcher } from '@ea/shared/helper/form-select-validation-switcher';
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
import { getContaminationOptions } from './contamination.options';
import {
  getElectricityRegionOptions,
  getFossilOriginOptions,
} from './energy-source.options';
import { getEnvironmentalInfluenceOptions } from './environmental-influence.options';
import {
  anyLoadGroupValidator,
  externalHeatFlowValidators,
  increaseInOilTempValidators,
  loadCasesOperatingTimeValidators,
  loadValidators,
  relativeValidatorFactory,
  rotationalSpeedValidators,
  rotationValidator,
  shiftAngleValidators,
  shiftFrequencyValidators,
  viscosityGroupValidators,
} from './form-validators';
import { LoadCaseDataFormGroupModel } from './loadcase-data-form-group.interface';
import { ParameterTemplateDirective } from './parameter-template.directive';

@Component({
  templateUrl: './calculation-parameters.component.html',
  selector: 'ea-calculation-parameters',
  standalone: true,
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
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChildren(ParameterTemplateDirective)
  public templates!: QueryList<ParameterTemplateDirective>;

  @Input()
  public isStandalone: boolean;

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

  public presetChips$: Observable<CalculationChip[]> | undefined;
  public operationConditionsForm = new FormGroup({
    loadCaseData: new FormArray(
      [this.createLoadCaseDataFormGroup('load case')],
      loadCasesOperatingTimeValidators(
        this.calculationParametersFormHelperService
      )
    ),
    lubrication: new FormGroup({
      lubricationSelection: new FormControl<
        'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil'
      >(undefined, [FormSelectValidatorSwitcher()]),
      grease: new FormGroup({
        selection: new FormControl<'typeOfGrease' | 'isoVgClass' | 'viscosity'>(
          'typeOfGrease',
          [FormSelectValidatorSwitcher({ onlyFormGroups: true })]
        ),
        typeOfGrease: new FormGroup({
          typeOfGrease: new FormControl<`LB_${string}`>(undefined, [
            Validators.required,
          ]),
        }),
        environmentalInfluence: new FormControl<
          | 'LB_LOW_AMBIENT_INFLUENCE'
          | 'LB_AVERAGE_AMBIENT_INFLUENCE'
          | 'LB_HIGH_AMBIENT_INFLUENCE'
        >(undefined, []),
        isoVgClass: new FormGroup({
          isoVgClass: new FormControl<number>(undefined, [Validators.required]),
        }),
        viscosity: new FormGroup(
          {
            ny40: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_40')
            ),
            ny100: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_100')
            ),
          },
          viscosityGroupValidators()
        ),
      }),
      oilBath: new FormGroup({
        selection: new FormControl<'isoVgClass' | 'viscosity'>('isoVgClass', [
          FormSelectValidatorSwitcher(),
        ]),
        isoVgClass: new FormGroup({
          isoVgClass: new FormControl<number>(undefined, [Validators.required]),
        }),
        viscosity: new FormGroup(
          {
            ny40: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_40')
            ),
            ny100: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_100')
            ),
          },
          viscosityGroupValidators()
        ),
      }),
      oilMist: new FormGroup({
        selection: new FormControl<'isoVgClass' | 'viscosity'>('isoVgClass', [
          FormSelectValidatorSwitcher(),
        ]),
        isoVgClass: new FormGroup({
          isoVgClass: new FormControl<number>(undefined, [Validators.required]),
        }),
        viscosity: new FormGroup(
          {
            ny40: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_40')
            ),
            ny100: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_100')
            ),
          },
          viscosityGroupValidators()
        ),
      }),
      recirculatingOil: new FormGroup({
        selection: new FormControl<'isoVgClass' | 'viscosity'>('isoVgClass', [
          FormSelectValidatorSwitcher({ onlyFormGroups: true }),
        ]),
        isoVgClass: new FormGroup({
          isoVgClass: new FormControl<number>(undefined, [Validators.required]),
        }),
        viscosity: new FormGroup(
          {
            ny40: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_40')
            ),
            ny100: new FormControl<number>(
              undefined,
              Validators.required,
              this.productSelectionFacade.templateValidator('IDL_NY_100')
            ),
          },
          viscosityGroupValidators()
        ),
        oilFlow: new FormControl<number>(undefined, [
          Validators.required,
          Validators.max(100),
        ]),
        oilTemperatureDifference: new FormControl<number>(
          undefined,
          increaseInOilTempValidators
        ),
        externalHeatFlow: new FormControl<number>(
          undefined,
          externalHeatFlowValidators
        ),
      }),
    }),
    contamination: new FormControl<
      CalculationParametersOperationConditions['contamination']
    >(undefined, [Validators.required]),
    ambientTemperature: new FormControl<number>(
      undefined,
      [Validators.required],
      [this.productSelectionFacade.templateValidator('IDSLC_TEMPERATURE')]
    ),
    time: new FormControl<number>(undefined, [Validators.required]),
    energySource: new FormGroup({
      type: new FormControl<'fossil' | 'electric'>(undefined, [
        FormSelectValidatorSwitcher(),
      ]),
      fossil: new FormGroup({
        fossilOrigin: new FormControl<
          CalculationParametersEnergySource['fossil']['fossilOrigin']
        >(undefined, [Validators.required]),
      }),
      electric: new FormGroup({
        electricityRegion: new FormControl<
          CalculationParametersEnergySource['electric']['electricityRegion']
        >(undefined, [Validators.required]),
      }),
    }),
    conditionOfRotation: new FormControl<
      CalculationParametersOperationConditions['conditionOfRotation']
    >(undefined, [Validators.required]),
  });

  form = new FormGroup({
    operationConditions: this.operationConditionsForm,
  });

  public formErrors$: Observable<ValidationErrors> =
    this.operationConditionsForm.valueChanges.pipe(
      startWith(this.operationConditionsForm.value),
      debounceTime(this.DEBOUNCE_TIME_DEFAULT),
      map(() => extractNestedErrors(this.operationConditionsForm))
    );

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
    private readonly chipsService: CalculationParametersChipsService
  ) {}

  get operatingTemperature(): FormControl {
    return this.operationConditionsForm.controls['loadCaseData'].controls[0]
      .controls.operatingTemperature;
  }

  get isSingleLoadCaseForm(): boolean {
    return (
      this.operationConditionsForm.controls['loadCaseData'].controls.length ===
      1
    );
  }

  get totalOperatingTime(): number {
    return this.calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases(
      this.operationConditionsForm.controls['loadCaseData'].controls
    );
  }

  getLoadCaseTimePortion(loadcasePercentage: number): string {
    return this.calculationParametersFormHelperService.getLocalizedLoadCaseTimePortion(
      this.operationConditionsForm.controls.time.value,
      loadcasePercentage
    );
  }

  ngOnInit() {
    const operatingTmpControl = this.operatingTemperature;

    const ambientTempControl =
      this.operationConditionsForm.get('ambientTemperature');

    ambientTempControl.addValidators(
      relativeValidatorFactory('<', operatingTmpControl, 'tmpBoundViolation')
    );
    operatingTmpControl.addValidators(
      relativeValidatorFactory('>', ambientTempControl, 'tmpBoundViolation')
    );

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
              this.operationConditionsForm.controls['loadCaseData'].push(
                this.createLoadCaseDataFormGroup(
                  loadCaseData.loadCaseName,
                  loadCaseData.operatingTemperature
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
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
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

  ngAfterViewInit() {
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
                changes.loadCaseData.length === 1
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
                  text = value.isoVgClass
                    ? `ISO VG ${value.isoVgClass}`
                    : undefined;
                  break;

                case 'typeOfGrease':
                  text = Greases.find(
                    (g) => g.value === value.typeOfGrease
                  ).label;
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
    const operatingTemperatureValue = 70;
    const loadCaseName =
      this.calculationParametersFormHelperService.getLocalizedLoadCaseName(
        this.loadCaseCount
      );

    this.operationConditionsForm.controls['loadCaseData'].push(
      this.createLoadCaseDataFormGroup(loadCaseName, operatingTemperatureValue)
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
    while (this.operationConditionsForm.controls['loadCaseData'].length > 1) {
      this.removeLoadcase(1);
    }
  }

  private removeLoadcase(index: number): void {
    this.operationConditionsForm.controls['loadCaseData'].removeAt(index);
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
    this.operationConditionsForm.controls[
      'loadCaseData'
    ].controls[0].controls.loadCaseName.setValue(name);
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

  private createLoadCaseDataFormGroup(
    loadCaseName: string,
    operatingTemperatureValue?: number
  ): FormGroup<LoadCaseDataFormGroupModel> {
    return new FormGroup<LoadCaseDataFormGroupModel>({
      load: new FormGroup(
        {
          radialLoad: new FormControl<number>(
            undefined,
            loadValidators,
            this.productSelectionFacade.templateValidator('IDSLC_RADIAL_LOAD')
          ),
          axialLoad: new FormControl<number>(
            undefined,
            loadValidators,
            this.productSelectionFacade.templateValidator('IDSLC_AXIAL_LOAD')
          ),
        },
        [anyLoadGroupValidator()]
      ),
      rotation: new FormGroup(
        {
          typeOfMotion: new FormControl<
            LoadCaseData['rotation']['typeOfMotion']
          >('LB_ROTATING', Validators.required),
          rotationalSpeed: new FormControl<number>(
            undefined,
            rotationalSpeedValidators,
            this.productSelectionFacade.templateValidator('IDLC_SPEED')
          ),
          shiftFrequency: new FormControl<number>(
            undefined,
            shiftFrequencyValidators,
            this.productSelectionFacade.templateValidator(
              'IDSLC_MOVEMENT_FREQUENCY'
            )
          ),
          shiftAngle: new FormControl<number>(undefined, shiftAngleValidators),
        },
        [rotationValidator()]
      ),
      operatingTime: new FormControl<number>(undefined, Validators.max(100)),
      operatingTemperature: new FormControl<number>(
        operatingTemperatureValue,
        [Validators.required],
        [
          this.productSelectionFacade.templateValidator(
            'IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE'
          ),
        ]
      ),
      loadCaseName: new FormControl<string>(loadCaseName),
    });
  }
}
