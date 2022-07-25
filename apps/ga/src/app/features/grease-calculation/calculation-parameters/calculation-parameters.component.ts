import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

import { debounceTime, filter, Subject, take, takeUntil } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import {
  getDialog,
  getProperties,
  patchParameters,
  resetPreferredGreaseSelection,
} from '@ga/core/store/actions';
import { getCalculationParametersState, SettingsFacade } from '@ga/core/store';
import { CalculationParametersState } from '@ga/core/store/models';
import { initialState } from '@ga/core/store/reducers/calculation-parameters/calculation-parameters.reducer';
import {
  getModelCreationLoading,
  getModelCreationSuccess,
  getSelectedBearing,
} from '@ga/core/store/selectors/bearing-selection/bearing-selection.selector';
import {
  axialLoadPossible,
  getEnvironmentTemperatures,
  getLoadsInputType,
  getParameterUpdating,
  getPreferredGreaseSelection,
  getSelectedMovementType,
  radialLoadPossible,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { EnvironmentImpact, Load, Movement } from '@ga/shared/models';

import {
  environmentImpactOptions,
  loadRatioOptions,
  loadValidators,
  rotationalSpeedValidators,
  shiftAngleValidators,
  shiftFrequencyValidators,
  typeOptions,
} from './calculation-parameters-constants';

@Component({
  selector: 'ga-calculation-parameters',
  templateUrl: './calculation-parameters.component.html',
})
export class CalculationParametersComponent implements OnInit, OnDestroy {
  public movement = Movement;
  public loadRatioOptions = loadRatioOptions;

  public radial = new UntypedFormControl(undefined, loadValidators);
  public axial = new UntypedFormControl(undefined, loadValidators);
  public exact = new UntypedFormControl(false);
  public loadRatio = new UntypedFormControl();

  public loadsForm = new UntypedFormGroup(
    {
      radial: this.radial,
      axial: this.axial,
      exact: this.exact,
      loadRatio: this.loadRatio,
    },
    this.loadValidator()
  );

  public type = new UntypedFormControl(Movement.rotating, [
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
    type: this.type,
    rotationalSpeed: this.rotationalSpeed,
    shiftFrequency: this.shiftFrequency,
    shiftAngle: this.shiftAngle,
  });

  public environmentTemperature = new UntypedFormControl(20, [
    Validators.required,
    Validators.max(300),
    Validators.min(-100),
  ]);

  public operatingTemperature = new UntypedFormControl(70, [
    Validators.required,
    Validators.max(230),
    Validators.min(-40),
    this.operatingTemperatureValidator(),
  ]);

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
  public modelCreationSuccess$ = this.store.select(getModelCreationSuccess);
  public modelCreationLoading$ = this.store.select(getModelCreationLoading);
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;

  private readonly destroy$ = new Subject<void>();
  public DEBOUNCE_TIME_DEFAULT = 500;

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly settingsFacade: SettingsFacade
  ) {}

  public ngOnInit(): void {
    this.modelCreationSuccess$.pipe(filter(Boolean)).subscribe(() => {
      this.store.dispatch(getProperties());
      this.store.dispatch(getDialog());
    });

    this.store
      .select(getCalculationParametersState)
      .pipe(take(1))
      .subscribe((value: CalculationParametersState) => {
        if (value !== initialState) {
          this.form.patchValue(value, { onlySelf: false, emitEvent: true });
          this.form.markAllAsTouched();
          this.form.updateValueAndValidity({ emitEvent: true });
        }
      });

    this.store
      .select(getLoadsInputType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => this.toggleLoadValidators(value));

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

  private operatingTemperatureValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        control.value &&
        this.environmentTemperature.value &&
        control.value < this.environmentTemperature.value
      ) {
        return {
          lowerThanEnvironmentTemperature: true,
        };
      }

      return undefined;
    };
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

      /* eslint-disable unicorn/no-null */
      group.controls[type].setErrors(otherErrors?.length ? otherErrors : null);
      /* eslint-enable unicorn/no-null */
    }
  }
}
