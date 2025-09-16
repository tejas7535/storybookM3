import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { debounceTime, filter, Subject, takeUntil } from 'rxjs';

import { CalculationOptionsFacade } from '@mm/core/store/facades/calculation-options/calculation-options.facade';
import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ThermalCalculationOptionsFormData } from '../calculation-selection-step.interface';

@Component({
  selector: 'mm-thermal-heating-calculation-options',
  templateUrl: './thermal-heating-calculation-options.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,

    LoadingSpinnerModule,
    SharedTranslocoModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThermalHeatingCalculationOptionsComponent
  implements OnInit, OnDestroy
{
  private readonly calculationSelectionFacade = inject(
    CalculationSelectionFacade
  );
  private readonly calculationOptionsFacade = inject(CalculationOptionsFacade);
  private readonly calculationResultFacade = inject(CalculationResultFacade);

  private readonly destroy$ = new Subject<void>();
  private readonly thermalOptions =
    this.calculationOptionsFacade.thermalOptions;

  // default tolerance class
  public readonly NONE = 'none';

  public isResultAvailable = toSignal(
    this.calculationResultFacade.isResultAvailable$
  );

  public toleranceClassOptions = this.calculationOptionsFacade.toleranceClasses;

  toleranceClassControl = new FormControl<string>(this.NONE);
  upperDeviationControl = new FormControl<number>(0, Validators.required);
  lowerDeviationControl = new FormControl<number>(0, Validators.required);
  temperatureControl = new FormControl<number>(20, Validators.required);

  public form = new FormGroup({
    toleranceClass: this.toleranceClassControl,
    upperDeviation: this.upperDeviationControl,
    lowerDeviation: this.lowerDeviationControl,
    temperature: this.temperatureControl,
  });

  constructor() {
    effect(() => {
      const options = this.thermalOptions();
      if (
        options &&
        (options.upperDeviation !== this.form.value.upperDeviation ||
          options.lowerDeviation !== this.form.value.lowerDeviation)
      ) {
        this.upperDeviationControl.setValue(options.upperDeviation, {
          onlySelf: true,
        });
        this.lowerDeviationControl.setValue(options.lowerDeviation, {
          onlySelf: true,
        });
      }
    });
  }

  public ngOnInit(): void {
    this.calculationOptionsFacade.updateToleranceClasses();

    this.toleranceClassControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === this.NONE) {
          this.upperDeviationControl.enable();
          this.lowerDeviationControl.enable();
        } else {
          this.upperDeviationControl.disable();
          this.lowerDeviationControl.disable();
        }
      });

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.form.valid),
        debounceTime(300)
      )
      .subscribe((value) => {
        this.calculationOptionsFacade.updateThermalOptionsFromFormData(
          value as ThermalCalculationOptionsFormData
        );
        if (this.form.valid) {
          this.calculationResultFacade.calculateThermalResultFromForm();
        }
      });

    this.form.patchValue(this.thermalOptions() || {});

    this.form.markAsTouched();
    this.form.updateValueAndValidity();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const resultStepIndex = this.calculationSelectionFacade.resultStepIndex();
    this.calculationSelectionFacade.setCurrentStep(resultStepIndex);
  }
}
