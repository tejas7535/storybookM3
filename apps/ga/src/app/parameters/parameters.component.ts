import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject, take, takeUntil } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../app-route-path.enum';
import { getParameterState } from '../core/store';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { patchParameters } from './../core/store/actions/parameters/parameters.actions';
import {
  initialState,
  ParameterState,
} from './../core/store/reducers/parameter/parameter.reducer';
import { getSelectedBearing } from './../core/store/selectors/bearing/bearing.selector';
import {
  getEnvironmentTemperatures,
  getLoadsInputType,
  getSelectedMovementType,
} from './../core/store/selectors/parameter/parameter.selector';
import { EnvironmentImpact } from './../shared/models/parameters/environment-impact.model';
import { Movement } from './../shared/models/parameters/movement.model';

@Component({
  selector: 'ga-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit, OnDestroy {
  public movement = Movement;

  public radial = new FormControl(0, [
    Validators.max(1_000_000_000),
    Validators.min(0),
    Validators.required,
  ]);
  public axial = new FormControl(0, [
    Validators.max(1_000_000_000),
    Validators.min(0),
    Validators.required,
  ]);
  // TODO: fill with values
  public exact = new FormControl(true);
  public loadRatio = new FormControl();
  public loadRatioOptions: any[] = [];

  public loadsForm = new FormGroup({
    radial: this.radial,
    axial: this.axial,
    exact: this.exact,
    loadRatio: this.loadRatio,
  });

  public type = new FormControl(Movement.rotating, [Validators.required]);
  public typeOptions: any[] = [
    {
      id: Movement.rotating,
      text: 'parameters.rotating',
      default: true,
    },
    {
      id: Movement.oscillating,
      text: 'parameters.oscillating',
    },
  ];
  public rotationalSpeed = new FormControl(undefined, [
    Validators.required,
    Validators.min(0),
    Validators.max(1_000_000),
  ]);
  public shiftFrequency = new FormControl(undefined, [
    Validators.min(0),
    Validators.max(1_000_000),
  ]);
  public shiftAngle = new FormControl(undefined, [
    Validators.min(0),
    Validators.max(10_000),
  ]);

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
  public environmentImpactOptions: any[] = [
    {
      id: EnvironmentImpact.low,
      text: 'parameters.low',
    },
    {
      id: EnvironmentImpact.moderate,
      text: 'parameters.moderate',
      default: true,
    },
    {
      id: EnvironmentImpact.high,
      text: 'parameters.high',
    },
  ];

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
  public selectedMovementType$: Observable<string>;
  public loadsInputType$: Observable<boolean>;

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.selectedBearing$ = this.store.select(getSelectedBearing);
    this.selectedMovementType$ = this.store.select(getSelectedMovementType);
    this.loadsInputType$ = this.store.select(getLoadsInputType);

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

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
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
      .subscribe((movementType: string) => {
        if (movementType === Movement.rotating) {
          this.rotationalSpeed.addValidators([Validators.required]);
          this.shiftFrequency.removeValidators([Validators.required]);
          this.shiftAngle.removeValidators([Validators.required]);
        } else if (movementType === Movement.oscillating) {
          this.rotationalSpeed.removeValidators([Validators.required]);
          this.shiftFrequency.addValidators([Validators.required]);
          this.shiftAngle.addValidators([Validators.required]);
        }
        this.rotationalSpeed.updateValueAndValidity();
        this.shiftFrequency.updateValueAndValidity();
        this.shiftAngle.updateValueAndValidity();
      });

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
    // TODO: change when defaults come from API
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
}
