import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { filter, Subject, takeUntil, tap } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ErrorMessagePipe } from '@mac/feature/materials-supplier-database/main-table/pipes/error-message-pipe/error-message.pipe';

@Component({
  selector: 'mac-recycling-rate',
  templateUrl: './recycling-rate.component.html',
  imports: [
    // default
    CommonModule,
    // angular material
    MatFormFieldModule,
    MatInputModule,
    // forms
    ReactiveFormsModule,
    // libs
    SharedTranslocoModule,
    // pipes
    ErrorMessagePipe,
  ],
})
export class RecyclingRateComponent implements OnInit, OnDestroy {
  @Input()
  public minRecyclingRateControl: FormControl<number>;
  @Input()
  public maxRecyclingRateControl: FormControl<number>;
  @Input()
  public minRecyclingRateHint: string;
  @Input()
  public maxRecyclingRateHint: string;

  public destroy$ = new Subject<void>();

  ngOnInit(): void {
    // recyclingRate validation
    this.minRecyclingRateControl.addValidators([
      this.minRecycleRateValidatorFn(),
      Validators.min(0),
      Validators.max(100),
    ]);
    this.maxRecyclingRateControl.addValidators([
      this.maxRecycleRateValidatorFn(),
      Validators.min(0),
      Validators.max(100),
    ]);
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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
}
