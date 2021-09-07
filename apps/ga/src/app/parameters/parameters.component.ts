import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { patchParameters } from './../core/store/actions/parameters/parameters.action';
import { previousStep } from './../core/store/actions/settings/settings.action';
import { ParameterState } from './../core/store/reducers/parameter/parameter.reducer';
import { getSelectedBearing } from './../core/store/selectors/bearing/bearing.selector';
import { getSelectedMovementType } from './../core/store/selectors/parameter/parameter.selector';
import { Movement } from './../shared/models/parameters/movement.model';

@Component({
  selector: 'ga-parameters',
  templateUrl: './parameters.component.html',
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

  public loadsForm = new FormGroup({
    radial: this.radial,
    axial: this.axial,
  });

  public type = new FormControl(Movement.rotating, [Validators.required]);
  public typeOptions: any[] = [
    {
      id: Movement.rotating,
      text: translate('parameters.rotating'),
      default: true,
    },
    {
      id: Movement.oscillating,
      text: translate('parameters.oscillating'),
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

  form = new FormGroup({
    loads: this.loadsForm,
    movements: this.movementsForm,
  });

  public selectedBearing$: Observable<string>;
  public selectedMovementType$: Observable<string>;

  private readonly destroy$ = new Subject<void>();

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.selectedBearing$ = this.store.select(getSelectedBearing);
    this.selectedMovementType$ = this.store.select(getSelectedMovementType);

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formValue: ParameterState) => {
        this.store.dispatch(
          patchParameters({
            parameters: { ...formValue, valid: this.form.valid },
          })
        );
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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateBack(): void {
    this.store.dispatch(previousStep());
  }
}
