import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { debounceTime, Subject, takeUntil } from 'rxjs';

import { CalculationParametersFacade } from '@ea/core/store';
import {
  operatingParameters,
  resetCalculationParams,
} from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { CalculationParametersState } from '@ea/core/store/models';
import { initialState } from '@ea/core/store/reducers/calculation-parameters/calculation-parameters.reducer';
import { FormFieldModule } from '@ea/shared/form-field';
import { CalculationParameters } from '@ea/shared/models';
import { LetModule, PushModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewComponent } from '../calculation-result-preview/calculation-result-preview';

@Component({
  templateUrl: './calculation-parameters.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    LetModule,
    PushModule,
    SharedTranslocoModule,
    CalculationResultPreviewComponent,
  ],
})
export class CalculationParametersComponent implements OnInit, OnDestroy {
  public DEBOUNCE_TIME_DEFAULT = 200;
  private readonly destroy$ = new Subject<void>();

  public calculationParameters$ =
    this.calculationParametersFacade.calculationParameters$;

  public radial = new UntypedFormControl(undefined, Validators.required);
  public axial = new UntypedFormControl(undefined, Validators.required);
  public rotation = new UntypedFormControl(undefined, Validators.required);

  public loadsForm = new UntypedFormGroup(
    {
      radial: this.radial,
      axial: this.axial,
      rotation: this.rotation,
    },
    this.loadValidator()
  );

  form = new UntypedFormGroup({
    operationConditions: this.loadsForm,
  });

  constructor(
    private readonly store: Store,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}

  ngOnInit() {
    this.calculationParameters$
      .pipe(takeUntil(this.destroy$))
      .subscribe((parametersState: CalculationParameters) => {
        this.form.patchValue(parametersState, {
          onlySelf: true,
          emitEvent: false,
        });
      });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME_DEFAULT))
      .subscribe((formValue: CalculationParametersState) => {
        this.store.dispatch(
          operatingParameters({
            parameters: { ...formValue },
          })
        );
        this.loadsForm.updateValueAndValidity({ emitEvent: false });
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadValidator(): any {
    return (group: UntypedFormGroup): void => {
      const { radial, axial, rotation } = group.value;

      const anyLoadApplied = radial > 0 || axial > 0 || rotation > 1;

      if (!anyLoadApplied) {
        this.setLoadErrors(group, 'radial');
        this.setLoadErrors(group, 'axial');
      } else {
        this.removeLoadErrors(group, 'radial');
        this.removeLoadErrors(group, 'axial');
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

  public onResetButtonClick(): void {
    this.loadsForm.reset(initialState);
    this.store.dispatch(resetCalculationParams());
  }
}
