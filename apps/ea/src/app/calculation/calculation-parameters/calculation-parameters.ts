/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  isDevMode,
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
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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

import { CalculationParametersFacade } from '@ea/core/store';
import { CalculationParametersActions } from '@ea/core/store/actions';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import {
  CalculationParameterGroup,
  CalculationParametersEnergySource,
  CalculationParametersOperationConditions,
} from '@ea/core/store/models';
import { Greases } from '@ea/shared/constants/greases';
import { ISOVgClasses } from '@ea/shared/constants/iso-vg-classes';
import { extractNestedErrors } from '@ea/shared/helper/form.helper';
import {
  FormGroupDisabledValidator,
  FormSelectValidatorSwitcher,
} from '@ea/shared/helper/form-select-validation-switcher';
import { InfoBannerComponent } from '@ea/shared/info-banner/info-banner.component';
import { InputGroupComponent } from '@ea/shared/input-group/input-group.component';
import { InputNumberComponent } from '@ea/shared/input-number/input-number.component';
import { InputSelectComponent } from '@ea/shared/input-select/input-select.component';
import { OptionTemplateDirective } from '@ea/shared/tabbed-options/option-template.directive';
import { TabbedOptionsComponent } from '@ea/shared/tabbed-options/tabbed-options.component';
import { TabbedSuboptionComponent } from '@ea/shared/tabbed-suboption/tabbed-suboption.component';
import { TranslocoService } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';
import { getContaminationOptions } from './contamination.options';
import {
  getElectricityRegionOptions,
  getFossilOriginOptions,
} from './energy-source.options';
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
    LetDirective,
    PushPipe,
    InfoBannerComponent,
    SharedTranslocoModule,
  ],
})
export class CalculationParametersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChildren(ParameterTemplateDirective)
  public templates!: QueryList<ParameterTemplateDirective>;

  public DEBOUNCE_TIME_DEFAULT = 200;

  public readonly isDev = isDevMode();

  public parameterTemplates$:
    | Observable<{
        mandatory: TemplateRef<unknown>[];
        preset: TemplateRef<unknown>[];
      }>
    | undefined;

  public operationConditions$ =
    this.calculationParametersFacade.operationConditions$;

  public readonly bearingDesignation$ =
    this.productSelectionFacade.bearingDesignation$;

  public readonly isDownstreamUnavailable$ =
    this.productSelectionFacade.calcualtionModuleInfo$.pipe(
      map((res) => res && !res.frictionCalculation)
    );

  public operationConditionsForm = new FormGroup({
    load: new FormGroup(
      {
        radialLoad: new FormControl<number>(undefined, Validators.required),
        axialLoad: new FormControl<number>(undefined, Validators.required),
      },
      [this.loadValidator()]
    ),
    rotation: new FormGroup({
      rotationalSpeed: new FormControl<number>(undefined, Validators.required),
      typeOfMovement: new FormControl<
        CalculationParametersOperationConditions['rotation']['typeOfMovement']
      >('LB_ROTATING'),
    }),
    lubrication: new FormGroup({
      lubricationSelection: new FormControl<
        'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil'
      >(undefined, [FormSelectValidatorSwitcher()]),
      grease: new FormGroup({
        selection: new FormControl<'typeOfGrease' | 'isoVgClass' | 'viscosity'>(
          'typeOfGrease',
          [FormSelectValidatorSwitcher()]
        ),
        typeOfGrease: new FormGroup({
          typeOfGrease: new FormControl<`LB_${string}`>(undefined, [
            Validators.required,
          ]),
        }),
        isoVgClass: new FormGroup({
          isoVgClass: new FormControl<number>(undefined, [Validators.required]),
        }),
        viscosity: new FormGroup(
          {
            ny40: new FormControl<number>(undefined, [Validators.required]),
            ny100: new FormControl<number>(undefined, [Validators.required]),
          },
          [FormGroupDisabledValidator()]
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
            ny40: new FormControl<number>(undefined, [Validators.required]),
            ny100: new FormControl<number>(undefined, [Validators.required]),
          },
          FormGroupDisabledValidator()
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
            ny40: new FormControl<number>(undefined, [Validators.required]),
            ny100: new FormControl<number>(undefined, [Validators.required]),
          },
          FormGroupDisabledValidator()
        ),
      }),
      recirculatingOil: new FormGroup({
        selection: new FormControl<'isoVgClass' | 'viscosity'>('isoVgClass', [
          FormSelectValidatorSwitcher(),
        ]),
        isoVgClass: new FormGroup({
          isoVgClass: new FormControl<number>(undefined, [Validators.required]),
        }),
        viscosity: new FormGroup(
          {
            ny40: new FormControl<number>(undefined, [Validators.required]),
            ny100: new FormControl<number>(undefined, [Validators.required]),
          },
          FormGroupDisabledValidator()
        ),
      }),
    }),
    contamination: new FormControl<
      CalculationParametersOperationConditions['contamination']
    >(undefined, [Validators.required]),
    ambientTemperature: new FormControl<number>(undefined, [
      Validators.required,
    ]),
    operatingTemperature: new FormControl<number>(undefined, [
      Validators.required,
    ]),
    externalHeatflow: new FormControl<number>(undefined, []),
    operatingTime: new FormControl<number>(undefined, [Validators.required]),
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
  public contaminationOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;
  public fossilOriginOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;
  public electricityRegionOptions$:
    | Observable<{ label: string; value: string }[]>
    | undefined;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly matDialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit() {
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

        return { mandatory, preset };
      })
    );

    this.contaminationOptions$ = getContaminationOptions(this.translocoService);
    this.electricityRegionOptions$ = getElectricityRegionOptions(
      this.translocoService
    );
    this.fossilOriginOptions$ = getFossilOriginOptions(this.translocoService);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onResetButtonClick(): void {
    this.calculationParametersFacade.dispatch(
      CalculationParametersActions.resetCalculationParameters()
    );
  }

  public onShowBasicFrequenciesDialogClick(): void {
    this.matDialog.open(BasicFrequenciesComponent);
  }

  public onShowCalculationTypesClick(): void {
    this.matDialog.open(CalculationTypesSelectionComponent);
  }

  private loadValidator(): any {
    return (group: UntypedFormGroup): void => {
      const { radialLoad, axialLoad } = group.value;
      const { axialLoad: axialLoadControl, radialLoad: radialLoadControl } =
        group.controls;

      const anyLoadApplied = radialLoad > 0 || axialLoad > 0;

      if (anyLoadApplied) {
        // remove required validator on other field
        if (radialLoad > 0) {
          axialLoadControl.clearValidators();
        } else {
          radialLoadControl.clearValidators();
        }
        this.removeLoadErrors(group, 'radialLoad');
        this.removeLoadErrors(group, 'axialLoad');
      } else {
        this.setLoadErrors(group, 'radialLoad');
        this.setLoadErrors(group, 'axialLoad');

        // set both fields as required
        radialLoadControl.setValidators([Validators.required]);
        axialLoadControl.setValidators([Validators.required]);
      }
    };
  }

  private setLoadErrors(group: UntypedFormGroup, type: string): void {
    group.controls[type].setErrors({
      ...group.controls[type].errors,
      anyLoad: true,
    });
  }

  private removeLoadErrors(group: UntypedFormGroup, type: string): void {
    if (group.controls[type]?.errors?.anyLoad) {
      const { anyLoad: _anyLoad, ...otherErrors } = group.controls[type].errors;
      /* eslint-disable unicorn/no-null */
      group.controls[type].setErrors(otherErrors?.length ? otherErrors : null);
    }
  }
}
