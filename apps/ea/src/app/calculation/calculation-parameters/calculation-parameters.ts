/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

import {
  CalculationParametersFacade,
  CalculationResultFacade,
} from '@ea/core/store';
import {
  CalculationParametersActions,
  CatalogCalculationResultActions,
} from '@ea/core/store/actions';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import {
  CalculationParameterGroup,
  CalculationParametersOperationConditions,
} from '@ea/core/store/models';
import { environment } from '@ea/environments/environment';
import { Greases } from '@ea/shared/constants/greases';
import { ISOVgClasses } from '@ea/shared/constants/iso-vg-classes';
import { extractNestedErrors } from '@ea/shared/helper/form.helper';
import { FormSelectValidatorSwitcher } from '@ea/shared/helper/form-select-validation-switcher';
import { InfoBannerComponent } from '@ea/shared/info-banner/info-banner.component';
import { InputGroupComponent } from '@ea/shared/input-group/input-group.component';
import { InputNumberComponent } from '@ea/shared/input-number/input-number.component';
import { InputSelectComponent } from '@ea/shared/input-select/input-select.component';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { OptionTemplateDirective } from '@ea/shared/tabbed-options/option-template.directive';
import { TabbedOptionsComponent } from '@ea/shared/tabbed-options/tabbed-options.component';
import { TabbedSuboptionComponent } from '@ea/shared/tabbed-suboption/tabbed-suboption.component';
import { TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';
import { CalculationParametersFormDevDebugComponent } from '../calculation-parameters-form-dev-debug/calculation-parameters-form-dev-debug.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';
import { getContaminationOptions } from './contamination.options';
import { getEnvironmentalInfluenceOptions } from './environmental-influence.options';
import {
  anyLoadGroupValidator,
  increaseInOilTempValidators,
  loadValidators,
  relativeValidatorFactory,
  rotationalSpeedValidators,
  rotationValidator,
  shiftAngleValidators,
  shiftFrequencyValidators,
  viscosityGroupValidators,
} from './form-validators';
import { ParameterTemplateDirective } from './parameter-template.directive';

@Component({
  templateUrl: './calculation-parameters.html',
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
    CalculationParametersFormDevDebugComponent,
  ],
})
export class CalculationParametersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChildren(ParameterTemplateDirective)
  public templates!: QueryList<ParameterTemplateDirective>;

  public DEBOUNCE_TIME_DEFAULT = 200;
  public readonly isProduction = environment.production;

  public parameterTemplates$:
    | Observable<{
        mandatory: TemplateRef<unknown>[];
        preset: TemplateRef<unknown>[];
      }>
    | undefined;

  public parameterTemplates:
    | {
        mandatory: TemplateRef<unknown>[];
        preset: TemplateRef<unknown>[];
      }
    | undefined;

  public operationConditions$ =
    this.calculationParametersFacade.operationConditions$;

  public readonly bearingDesignation$ =
    this.productSelectionFacade.bearingDesignation$;

  public readonly loadAvailable$ = this.productSelectionFacade.availableLoads$;
  public readonly lubricationMethodsAvailable$ =
    this.productSelectionFacade.availableLubricationMethods$;

  public operationConditionsForm = new FormGroup({
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
          CalculationParametersOperationConditions['rotation']['typeOfMotion']
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
        oilFlow: new FormControl<number>(undefined, [Validators.required]),
        oilTemperatureDifference: new FormControl<number>(
          undefined,
          increaseInOilTempValidators
        ),
        externalHeatFlow: new FormControl<number>(undefined, [
          Validators.required,
        ]),
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
    operatingTemperature: new FormControl<number>(
      undefined,
      [Validators.required],
      [
        this.productSelectionFacade.templateValidator(
          'IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE'
        ),
      ]
    ),
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
    | Observable<
        CalculationParametersOperationConditions['rotation']['typeOfMotion'][]
      >
    | undefined;
  public contaminationOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;
  public fossilOriginOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;
  public electricityRegionOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;

  public environmentalInfluenceOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    public readonly matDialog: MatDialog,
    private readonly translocoService: TranslocoService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const operatingTmpControl = this.operationConditionsForm.get(
      'operatingTemperature'
    );

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
      .pipe(takeUntil(this.destroy$))
      .subscribe((parametersState) => {
        this.form.patchValue({ operationConditions: parametersState });
      });

    // update store from form
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.DEBOUNCE_TIME_DEFAULT),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((formValue) => {
        if (this.form.valid) {
          this.calculationParametersFacade.dispatch(
            CalculationParametersActions.operatingParameters({
              ...formValue,
              operationConditions: this.form.getRawValue().operationConditions,
            })
          );
        } else {
          this.resetCatalogCalculationResults();
          this.calculationParametersFacade.dispatch(
            CalculationParametersActions.setIsInputInvalid({
              isInputInvalid: true,
            })
          );
        }
      });
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

        const mandatory: TemplateRef<unknown>[] = fieldConfig.required
          .map((element) => convertConfig(element))
          .filter((value, index, self) => self.indexOf(value) === index);

        const preset: TemplateRef<unknown>[] = fieldConfig.preset
          .map((element) => convertConfig(element))
          .filter((value, index, self) => self.indexOf(value) === index);

        this.changeDetectionRef.detectChanges();

        return { mandatory, preset };
      })
    );

    this.parameterTemplates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((templates) => {
        this.parameterTemplates = templates;
        this.changeDetectionRef.detectChanges();
      });

    this.contaminationOptions$ = getContaminationOptions(this.translocoService);
    this.environmentalInfluenceOptions$ = getEnvironmentalInfluenceOptions(
      this.translocoService
    );
    this.typeOfMotionsAvailable$ = this.productSelectionFacade
      .getTemplateItem('IDSLC_TYPE_OF_MOVEMENT')
      .pipe(
        map((template) =>
          (template?.options || []).map(
            ({ value }) =>
              value as CalculationParametersOperationConditions['rotation']['typeOfMotion']
          )
        )
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onResetButtonClick(): void {
    this.calculationParametersFacade.dispatch(
      CalculationParametersActions.resetCalculationParameters()
    );
    this.resetCatalogCalculationResults();
  }

  public onShowBasicFrequenciesDialogClick(): void {
    this.matDialog.open(BasicFrequenciesComponent);
  }

  public onShowCalculationTypesClick(): void {
    this.matDialog.open(CalculationTypesSelectionComponent);
  }

  private resetCatalogCalculationResults(): void {
    this.calculationResultFacade.dispatch(
      CatalogCalculationResultActions.resetCalculationResult()
    );
  }
}
