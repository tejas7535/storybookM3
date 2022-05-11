import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { debounceTime, Observable, Subject, take, takeUntil } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../app-route-path.enum';
import { getParameterState } from '../core/store';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { Load } from '../shared/models';
import {
  getProperties,
  patchParameters,
} from './../core/store/actions/parameters/parameters.actions';
import {
  initialState,
  ParameterState,
} from './../core/store/reducers/parameter/parameter.reducer';
import { getSelectedBearing } from './../core/store/selectors/bearing/bearing.selector';
import {
  axialLoadPossible,
  getEnvironmentTemperatures,
  getLoadsInputType,
  getParameterUpdating,
  getSelectedMovementType,
  radialLoadPossible,
} from './../core/store/selectors/parameter/parameter.selector';
import { EnvironmentImpact } from './../shared/models/parameters/environment-impact.model';
import { Movement } from './../shared/models/parameters/movement.model';
import {
  environmentImpactOptions,
  loadRatioOptions,
  loadValidators,
  rotationalSpeedValidators,
  shiftAngleValidators,
  shiftFrequencyValidators,
  typeOptions,
} from './parameter-constants';

@Component({
  selector: 'ga-parameters',
  templateUrl: './parameters.component.html',
})
export class ParametersComponent implements OnInit, OnDestroy {
  public movement = Movement;

  public radial = new FormControl(undefined, loadValidators);
  public axial = new FormControl(undefined, loadValidators);

  public exact = new FormControl(false);
  public loadRatio = new FormControl();
  public loadRatioOptions = loadRatioOptions;

  public loadsForm = new FormGroup(
    {
      radial: this.radial,
      axial: this.axial,
      exact: this.exact,
      loadRatio: this.loadRatio,
    },
    this.loadValidator()
  );

  public type = new FormControl(Movement.rotating, [Validators.required]);
  public typeOptions = typeOptions;

  public rotationalSpeed = new FormControl(
    undefined,
    rotationalSpeedValidators
  );

  public shiftFrequency = new FormControl(undefined, shiftFrequencyValidators);

  public shiftAngle = new FormControl(undefined, shiftAngleValidators);

  public movementsForm = new FormGroup({
    type: this.type,
    rotationalSpeed: this.rotationalSpeed,
    shiftFrequency: this.shiftFrequency,
    shiftAngle: this.shiftAngle,
  });

  public environmentTemperature = new FormControl(20, [
    Validators.required,
    Validators.max(300),
    Validators.min(-100),
  ]);

  public operatingTemperature = new FormControl(70, [
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

  public environmentImpact = new FormControl(EnvironmentImpact.moderate, [
    Validators.required,
  ]);

  public environmentImpactOptions = environmentImpactOptions;

  public environmentForm = new FormGroup({
    operatingTemperature: this.operatingTemperature,
    environmentTemperature: this.environmentTemperature,
    environmentImpact: this.environmentImpact,
  });

  form = new FormGroup({
    loads: this.loadsForm,
    movements: this.movementsForm,
    environment: this.environmentForm,
  });

  public selectedBearing$: Observable<string>;
  public selectedMovementType$: Observable<Movement>;
  public loadsInputType$: Observable<boolean>;
  public parameterUpdating$: Observable<boolean>;
  public radialLoadPossible$: Observable<boolean>;
  public axialLoadPossible$: Observable<boolean>;

  private readonly destroy$ = new Subject<void>();
  public DEBOUNCE_TIME_DEFAULT = 500;

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(getProperties());
    this.selectedBearing$ = this.store.select(getSelectedBearing);
    this.selectedMovementType$ = this.store.select(getSelectedMovementType);
    this.parameterUpdating$ = this.store.select(getParameterUpdating);
    this.radialLoadPossible$ = this.store.select(radialLoadPossible);
    this.axialLoadPossible$ = this.store.select(axialLoadPossible);

    this.store
      .select(getParameterState)
      .pipe(take(1))
      .subscribe((value: ParameterState) => {
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
      .subscribe((formValue: ParameterState) => {
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

  public toggleLoadsType(): void {
    this.exact.patchValue(!this.exact.value);
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

  public resetForm(): void {
    this.form.reset(initialState);
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
    return (group: FormGroup): void => {
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

  private setLoadErrors(group: FormGroup, type: Load): void {
    group.controls[type].setErrors({
      ...group.controls[type].errors,
      anyLoad: true,
    });
  }

  private removeLoadErrors(group: FormGroup, type: Load): void {
    if (group.controls[type]?.errors?.anyLoad) {
      const { anyLoad: _anyLoad, ...otherErrors } = group.controls[type].errors;

      /* eslint-disable unicorn/no-null */
      group.controls[type].setErrors(otherErrors?.length ? otherErrors : null);
      /* eslint-enable unicorn/no-null */
    }
  }
}
