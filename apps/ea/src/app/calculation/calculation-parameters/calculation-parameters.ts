import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { debounceTime, filter, Subject, takeUntil } from 'rxjs';

import { CalculationParametersFacade } from '@ea/core/store';
import {
  operatingParameters,
  resetCalculationParameters,
} from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { FormFieldModule } from '@ea/shared/form-field';
import { LetModule, PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';
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
    MatDialogModule,
    LetModule,
    PushModule,
    SharedTranslocoModule,
    CalculationResultPreviewComponent,
  ],
})
export class CalculationParametersComponent implements OnInit, OnDestroy {
  public DEBOUNCE_TIME_DEFAULT = 200;
  private readonly destroy$ = new Subject<void>();

  public operationConditions$ =
    this.calculationParametersFacade.operationConditions$;

  public readonly bearingDesignation$ =
    this.productSelectionFacade.bearingDesignation$;

  public radialLoad = new FormControl<number>(undefined, Validators.required);
  public axialLoad = new FormControl<number>(undefined, Validators.required);
  public rotationalSpeed = new FormControl<number>(
    undefined,
    Validators.required
  );

  public operationConditionsForm = new FormGroup(
    {
      radialLoad: this.radialLoad,
      axialLoad: this.axialLoad,
      rotationalSpeed: this.rotationalSpeed,
    },
    this.loadValidator()
  );

  form = new FormGroup({
    operationConditions: this.operationConditionsForm,
  });

  constructor(
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.operationConditions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((parametersState) => {
        this.form.patchValue(
          { operationConditions: parametersState },
          {
            onlySelf: true,
            emitEvent: false,
          }
        );
      });

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.DEBOUNCE_TIME_DEFAULT),
        filter(() => this.form.valid)
      )
      .subscribe((formValue) => {
        this.calculationParametersFacade.dispatch(
          operatingParameters({
            ...formValue,
            operationConditions: formValue.operationConditions,
          })
        );
        this.operationConditionsForm.updateValueAndValidity({
          emitEvent: false,
        });
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadValidator(): any {
    return (group: UntypedFormGroup): void => {
      const { radialLoad, axialLoad, rotationalSpeed } = group.value;

      const anyLoadApplied =
        radialLoad > 0 || axialLoad > 0 || rotationalSpeed > 1;

      if (!anyLoadApplied) {
        this.setLoadErrors(group, 'radialLoad');
        this.setLoadErrors(group, 'axialLoad');
      } else {
        this.removeLoadErrors(group, 'radialLoad');
        this.removeLoadErrors(group, 'axialLoad');
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
    this.operationConditionsForm.reset();
    this.calculationParametersFacade.dispatch(resetCalculationParameters());
  }

  public onShowBasicFrequenciesDialogClick(): void {
    this.matDialog.open(BasicFrequenciesComponent);
  }
}
