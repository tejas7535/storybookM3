import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subject, takeUntil } from 'rxjs';

import { PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogFacade } from '@mac/msd/store/facades/dialog';

import * as util from '../../util';

@Component({
  selector: 'mac-co2-component',
  templateUrl: './co2-component.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    // forms
    ReactiveFormsModule,
    // libs
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
})
export class Co2ComponentComponent implements OnInit, OnDestroy {
  @ViewChildren('dialogControl', { read: ElementRef })
  dialogControlRefs: QueryList<ElementRef>;

  @Input()
  public co2Scope1Control: FormControl<number>;
  @Input()
  public co2Scope2Control: FormControl<number>;
  @Input()
  public co2Scope3Control: FormControl<number>;
  @Input()
  public co2TotalControl: FormControl<number>;
  @Input()
  public co2ClassificationControl: FormControl<StringOption>;
  @Input()
  public releaseRestrictionsControl: FormControl<string>;
  @Input()
  public co2Scope1Hint: string;
  @Input()
  public co2Scope2Hint: string;
  @Input()
  public co2Scope3Hint: string;
  @Input()
  public co2TotalHint: string;
  @Input()
  public co2ClassificationHint: string;
  @Input()
  public releaseRestrictionsHint: string;

  // list of classifications
  public co2Classification$ = this.dialogFacade.co2Classification$;

  // util for filtering select
  public filterFn = util.filterFn;
  // utility for parsing error message
  public readonly getErrorMessage = util.getErrorMessage;

  private co2Controls: FormArray<FormControl<number>>;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly dialogFacade: DialogFacade) {}

  ngOnInit(): void {
    this.co2Controls = new FormArray([
      this.co2Scope1Control,
      this.co2Scope2Control,
      this.co2Scope3Control,
    ]);
    this.co2TotalControl.addValidators(
      this.scopeTotalValidatorFn(this.co2Controls)
    );

    // if co2Total is not required by default, it is required once one of the scope fields is filled out.
    if (!this.co2TotalControl.hasValidator(Validators.required)) {
      this.co2Controls.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((scopes) => {
          // if any of the scopes is filled, co2Total is required
          if (scopes.some((v) => !!v)) {
            this.co2TotalControl.addValidators(Validators.required);
          } else {
            this.co2TotalControl.removeValidators(Validators.required);
          }
          this.co2TotalControl.updateValueAndValidity();
        });
    }
    // enable / disable classification field
    this.co2TotalControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        value
          ? this.co2ClassificationControl.enable({ emitEvent: false })
          : this.co2ClassificationControl.disable({ emitEvent: false })
      );
    this.co2Controls.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.co2TotalControl.updateValueAndValidity());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // special validator that compares entered scope values with co2total
  private readonly scopeTotalValidatorFn =
    (values: FormArray<FormControl<number>>): ValidatorFn =>
    (control: AbstractControl<number>): ValidationErrors | null => {
      if (control.value) {
        const current = control.value || 0;
        const min = values.value
          // replace unfilled values with 0
          .map((value) => value || 0)
          // create sum of all scope values
          .reduce((sum, value) => sum + value);
        const max = values.value
          // replace unfilled values with MAX
          .map((value) => value || Number.MAX_VALUE)
          // create sum of all scope values
          .reduce((sum, value) => sum + value);

        // return error if total value is less than sum of scopes
        if (current < min) {
          return { scopeTotalLowerThanSingleScopes: { min, current } };
        }
        // return error if total value is more than sum of all 3 scopes (all 3 need to be filled out)
        if (current > max) {
          return { scopeTotalHigherThanSingleScopes: { max, current } };
        }

        return undefined;
      }

      return undefined;
    };
}
