import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

import { debounceTime, filter, map, Subject, take, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { getCalculationParametersState, SettingsFacade } from '@ga/core/store';
import {
  getDialog,
  getProperties,
  patchParameters,
  resetPreferredGreaseSelection,
  setAutomaticLubrication,
} from '@ga/core/store/actions';
import { CalculationParametersState } from '@ga/core/store/models';
import { initialState } from '@ga/core/store/reducers/calculation-parameters/calculation-parameters.reducer';
import {
  getModelCreationLoading,
  getModelCreationSuccess,
  getSelectedBearing,
} from '@ga/core/store/selectors/bearing-selection/bearing-selection.selector';
import {
  axialLoadPossible,
  getAutomaticLubrication,
  getEnvironmentTemperatures,
  getLoadsInputType,
  getParameterUpdating,
  getPreferredGreaseSelection,
  getSelectedMovementType,
  isApplicationScenarioDisabled,
  radialLoadPossible,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { EnvironmentImpact, Load, Movement } from '@ga/shared/models';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import { GreaseRecommendationMarketingService } from '../grease-recommendation-marketing.service';
import {
  environmentImpactOptions,
  loadRatioOptions,
  loadValidators,
  rotationalSpeedValidators,
  shiftAngleValidators,
  shiftFrequencyValidators,
  typeOptions,
} from './constants';
import {
  APPLICATION_SCENARIO_OPTIONS,
  ApplicationScenario,
} from './constants/application-scenarios.model';
import { CalculationParametersService } from './services';

@Component({
  selector: 'ga-calculation-parameters',
  templateUrl: './calculation-parameters.component.html',
  styles: [
    ':host ::ng-deep .mat-slide-toggle-label .mat-slide-toggle-content { @apply whitespace-normal }',
  ],
})
export class CalculationParametersComponent implements OnInit, OnDestroy {
  public movement = Movement;
  public loadUnit = this.calculationParametersService.loadUnit();
  public loadRatioOptions = loadRatioOptions;

  public radial = new UntypedFormControl(undefined, loadValidators);
  public axial = new UntypedFormControl(undefined, loadValidators);
  public exact = new UntypedFormControl(false);
  public loadRatio = new UntypedFormControl();

  public shouldShowMarketing$ = this.marketingService.shouldShowMarketing$;
  public utmSignupUrl$ = this.marketingService.getUtmSignupUrl('signup-cta');

  public loadsForm = new UntypedFormGroup(
    {
      radial: this.radial,
      axial: this.axial,
      exact: this.exact,
      loadRatio: this.loadRatio,
    },
    this.loadValidator()
  );

  public movementType = new UntypedFormControl(Movement.rotating, [
    Validators.required,
  ]);
  public typeOptions = typeOptions;

  public rotationalSpeed = new UntypedFormControl(
    undefined,
    rotationalSpeedValidators
  );

  public shiftFrequency = new UntypedFormControl(
    undefined,
    shiftFrequencyValidators
  );

  public shiftAngle = new UntypedFormControl(undefined, shiftAngleValidators);

  public movementsForm = new UntypedFormGroup({
    type: this.movementType,
    rotationalSpeed: this.rotationalSpeed,
    shiftFrequency: this.shiftFrequency,
    shiftAngle: this.shiftAngle,
  });

  public temperatureUnit = this.calculationParametersService.temperatureUnit();
  public environmentTemperature =
    this.calculationParametersService.getEnvironmentTemperatureControl();
  public operatingTemperature =
    this.calculationParametersService.getOperatingTemperatureControl();

  public applicationScenarioOptions = APPLICATION_SCENARIO_OPTIONS;
  public sortedApplicationScenarios$ = this.translocoService.langChanges$.pipe(
    map((_) => {
      const translatedOptions = this.applicationScenarioOptions.map(
        (scenario) => ({
          ...scenario,
          text: this.translocoService.translate(scenario.text),
        })
      );

      const sorted = [...translatedOptions].sort((a, b) =>
        a.text < b.text ? -1 : 0
      );

      return [
        translatedOptions[0],
        ...sorted.filter((option) => option.id !== translatedOptions[0].id),
      ];
    })
  );

  public applicationScenario = new UntypedFormControl(undefined);

  public operatingTemperatureErrors: { name: string; message: string }[] = [
    {
      name: 'lowerThanEnvironmentTemperature',
      message: 'lowerThanEnvironmentTemperature',
    },
  ];

  public environmentImpact = new UntypedFormControl(
    EnvironmentImpact.moderate,
    [Validators.required]
  );

  public environmentImpactOptions = environmentImpactOptions;

  public environmentForm = new UntypedFormGroup({
    operatingTemperature: this.operatingTemperature,
    environmentTemperature: this.environmentTemperature,
    environmentImpact: this.environmentImpact,
    applicationScenario: this.applicationScenario,
  });

  form = new UntypedFormGroup({
    loads: this.loadsForm,
    movements: this.movementsForm,
    environment: this.environmentForm,
  });

  public selectedBearing$ = this.store.select(getSelectedBearing);
  public selectedMovementType$ = this.store.select(getSelectedMovementType);
  public parameterUpdating$ = this.store.select(getParameterUpdating);
  public radialLoadPossible$ = this.store.select(radialLoadPossible);
  public axialLoadPossible$ = this.store.select(axialLoadPossible);
  public preferredGreaseSelection$ = this.store.select(
    getPreferredGreaseSelection
  );
  public automaticLubrication$ = this.store.select(getAutomaticLubrication);
  public modelCreationSuccess$ = this.store.select(getModelCreationSuccess);
  public modelCreationLoading$ = this.store.select(getModelCreationLoading);
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public partnerVersion$ = this.settingsFacade.partnerVersion$;

  public applicationScenarioDisabled$ = this.store.select(
    isApplicationScenarioDisabled
  );

  public DEBOUNCE_TIME_DEFAULT = 500;

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly settingsFacade: SettingsFacade,
    private readonly calculationParametersService: CalculationParametersService,
    private readonly marketingService: GreaseRecommendationMarketingService,
    private readonly translocoService: TranslocoService,
    private readonly appAnalyticsService: AppAnalyticsService,
    private readonly appInsightsService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.store
      .select(getCalculationParametersState)
      .pipe(take(1))
      .subscribe((parametersState: CalculationParametersState) => {
        /**
         * the following check looks wrong but is correct since we are only writing
         * to the store from inside this component on form value changes. At that point we
         * have changed the initial state and will receive a new object reference.
         */
        if (parametersState !== initialState) {
          this.form.patchValue(parametersState, {
            onlySelf: false,
            emitEvent: true,
          });
          this.form.markAllAsTouched();
          this.form.updateValueAndValidity({ emitEvent: true });
        }
      });

    this.modelCreationSuccess$.pipe(filter(Boolean)).subscribe(() => {
      this.store.dispatch(getProperties());
      this.store.dispatch(getDialog());
    });

    this.store
      .select(getLoadsInputType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => this.toggleLoadValidators(value));

    // reset the application and grease preselection value because they are
    // disabled when motion is set to oscillating
    this.movementsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((change) => {
        if (change.type === Movement.oscillating) {
          this.applicationScenario.setValue(ApplicationScenario.All);
          this.store.dispatch(resetPreferredGreaseSelection());
        }
      });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME_DEFAULT))
      .subscribe((formValue: CalculationParametersState) => {
        this.store.dispatch(
          patchParameters({
            parameters: { ...formValue, valid: this.form.valid },
          })
        );
        this.form.updateValueAndValidity({ emitEvent: false });
      });

    this.selectedMovementType$
      .pipe(takeUntil(this.destroy$))
      .subscribe((movementType: Movement) =>
        this.toggleMovementValidators(movementType)
      );

    this.store
      .select(getEnvironmentTemperatures)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.operatingTemperature.updateValueAndValidity({ emitEvent: false });
      });

    this.applicationScenarioDisabled$.subscribe((disabled) => {
      if (disabled) {
        this.environmentForm.get('applicationScenario').disable();
      } else {
        this.environmentForm.get('applicationScenario').enable();
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleLoadValidators(value: boolean): void {
    if (value) {
      this.axial.addValidators(loadValidators);
      this.radial.addValidators(loadValidators);
      this.loadRatio.removeValidators(Validators.required);
    } else {
      this.axial.removeValidators(loadValidators);
      this.radial.removeValidators(loadValidators);
      this.loadRatio.addValidators(Validators.required);
    }
    this.axial.updateValueAndValidity();
    this.radial.updateValueAndValidity();
    this.loadRatio.updateValueAndValidity();
  }

  public toggleMovementValidators(movementType: Movement): void {
    if (movementType === Movement.rotating) {
      this.rotationalSpeed.addValidators(rotationalSpeedValidators);
      this.shiftFrequency.removeValidators(shiftFrequencyValidators);
      this.shiftAngle.removeValidators(shiftAngleValidators);
    } else if (movementType === Movement.oscillating) {
      this.rotationalSpeed.removeValidators(rotationalSpeedValidators);
      this.shiftFrequency.addValidators(shiftFrequencyValidators);
      this.shiftAngle.addValidators(shiftAngleValidators);
    }
    this.rotationalSpeed.updateValueAndValidity();
    this.shiftFrequency.updateValueAndValidity();
    this.shiftAngle.updateValueAndValidity();
  }

  public toggleLoadsType(toggleChange: MatSlideToggleChange): void {
    this.exact.patchValue(toggleChange.checked);
  }

  public toggleAutomaticLubrication({
    checked: automaticLubrication,
  }: MatSlideToggleChange): void {
    this.store.dispatch(setAutomaticLubrication({ automaticLubrication }));
  }

  public completeStep(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ResultPath}`,
    ]);
  }

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.BearingPath}`,
    ]);
  }

  public onResetButtonClick(): void {
    this.form.reset(initialState);
    this.store.dispatch(resetPreferredGreaseSelection());
  }

  public trackSignupClick(): void {
    this.appAnalyticsService.logInteractionEvent(
      InteractionEventType.ClickSignupLink
    );
    this.appInsightsService.logEvent('recommendation_click_medias_signup');
  }

  private loadValidator(): any {
    return (group: UntypedFormGroup): void => {
      const { radial, axial } = group.value;

      const anyLoadApplied = radial > 0 || axial > 0;

      if (!anyLoadApplied && this.exact.value) {
        this.setLoadErrors(group, Load.radial);
        this.setLoadErrors(group, Load.axial);
      } else {
        this.removeLoadErrors(group, Load.radial);
        this.removeLoadErrors(group, Load.axial);
      }
    };
  }

  private setLoadErrors(group: UntypedFormGroup, type: Load): void {
    group.controls[type].setErrors({
      ...group.controls[type].errors,
      anyLoad: true,
    });
  }

  private removeLoadErrors(group: UntypedFormGroup, type: Load): void {
    if (group.controls[type]?.errors?.anyLoad) {
      const { anyLoad: _anyLoad, ...otherErrors } = group.controls[type].errors;

      /* eslint-disable-next-line unicorn/no-null */
      group.controls[type].setErrors(otherErrors?.length ? otherErrors : null);
    }
  }
}
