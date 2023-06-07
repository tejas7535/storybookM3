import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { debounceTime, Subject, takeUntil } from 'rxjs';

import { CalculationParametersFacade } from '@ea/core/store';
import { CalculationParametersActions } from '@ea/core/store/actions';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { Greases } from '@ea/shared/constants/greases';
import { ISOVgClasses } from '@ea/shared/constants/iso-vg-classes';
import {
  FormGroupDisabledValidator,
  FormSelectValidatorSwitcher,
} from '@ea/shared/helper/form-select-validation-switcher';
import { InputGroupComponent } from '@ea/shared/input-group/input-group.component';
import { InputNumberComponent } from '@ea/shared/input-number/input-number.component';
import { InputSelectComponent } from '@ea/shared/input-select/input-select.component';
import { OptionTemplateDirective } from '@ea/shared/tabbed-options/option-template.directive';
import { TabbedOptionsComponent } from '@ea/shared/tabbed-options/tabbed-options.component';
import { TabbedSuboptionComponent } from '@ea/shared/tabbed-suboption/tabbed-suboption.component';
import { LetModule, PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';

@Component({
  templateUrl: './calculation-parameters.html',
  selector: 'ea-calculation-parameters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    InputNumberComponent,
    InputSelectComponent,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    LetModule,
    PushModule,
    ReactiveFormsModule,
    InputGroupComponent,
    TabbedOptionsComponent,
    TabbedSuboptionComponent,
    OptionTemplateDirective,
    SharedTranslocoModule,
  ],
})
export class CalculationParametersComponent implements OnInit, OnDestroy {
  public DEBOUNCE_TIME_DEFAULT = 200;
  private readonly destroy$ = new Subject<void>();

  public operationConditions$ =
    this.calculationParametersFacade.operationConditions$;

  public readonly bearingDesignation$ =
    this.productSelectionFacade.bearingDesignation$;

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
      typeOfMovement: new FormControl<'LB_ROTATING'>('LB_ROTATING'),
    }),
    lubrication: new FormGroup({
      lubricationSelection: new FormControl<
        'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil'
      >(undefined, [FormSelectValidatorSwitcher()]),
      grease: new FormGroup({
        greaseSelection: new FormControl<
          'typeOfGrease' | 'isoVgClass' | 'viscosity'
        >('typeOfGrease', [FormSelectValidatorSwitcher()]),
        typeOfGrease: new FormGroup(
          {
            typeOfGrease: new FormControl<string>(undefined, [
              Validators.required,
            ]),
          },
          [FormGroupDisabledValidator()]
        ),
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
        oilBathSelection: new FormControl<'isoVgClass' | 'viscosity'>(
          'isoVgClass',
          [FormSelectValidatorSwitcher()]
        ),
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
        oilMistSelection: new FormControl<'isoVgClass' | 'viscosity'>(
          'isoVgClass',
          [FormSelectValidatorSwitcher()]
        ),
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
        recirculatingOilSelection: new FormControl<'isoVgClass' | 'viscosity'>(
          'isoVgClass',
          [FormSelectValidatorSwitcher()]
        ),
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
  });

  form = new FormGroup({
    operationConditions: this.operationConditionsForm,
  });

  public readonly isoVgClasses = ISOVgClasses;
  public readonly greases = Greases;

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
      .pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME_DEFAULT))
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

  public onResetButtonClick(): void {
    this.operationConditionsForm.reset();
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
}
