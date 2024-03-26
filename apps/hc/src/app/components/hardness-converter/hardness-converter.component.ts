import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { HardnessConverterApiService } from '@hc/services/hardness-converter-api.service';
import { TranslocoService } from '@ngneat/transloco';

import { MPA, ONE_DIGIT_UNITS } from '../../constants';
import {
  HardnessConversionFormValue,
  HardnessConversionResponse,
} from '../../models';

@Component({
  templateUrl: './hardness-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HardnessConverterComponent implements OnInit, OnDestroy {
  @ViewChild('defaultInputValue')
  public defaultInputElement: ElementRef<HTMLInputElement>;

  public MPA = MPA;

  public tables$ = new ReplaySubject<string[]>();
  public units$ = new ReplaySubject<string[]>();
  public enabled$ = new ReplaySubject<string[]>();
  public version$ = new ReplaySubject<string>();

  public inputTable = new FormControl<string>(undefined);
  public inputUnit = new FormControl<string>(undefined);
  public inputValue = this.createInputFormControl();

  public initialInput = new UntypedFormGroup({
    inputTable: this.inputTable,
    inputValue: this.inputValue,
    inputUnit: this.inputUnit,
  });

  public additionalInputs = new UntypedFormArray([]);

  public conversionForm = new UntypedFormGroup({
    initialInput: this.initialInput,
    additionalInput: this.additionalInputs,
  });

  public multipleValues$ = new ReplaySubject<boolean>();
  public average$ = new ReplaySubject<number>();
  public standardDeviation$ = new ReplaySubject<number>();
  public activeConversion$ = new BehaviorSubject<{
    value: number;
    unit: string;
  }>({ value: undefined, unit: undefined });

  public conversionResult$ = new ReplaySubject<HardnessConversionResponse>();
  public resultLoading$ = new BehaviorSubject<boolean>(false);

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly hardnessService: HardnessConverterApiService,
    private readonly translocoService: TranslocoService
  ) {}

  public get step(): string {
    return ONE_DIGIT_UNITS.includes(this.initialInput.get('inputUnit').value)
      ? '.1'
      : '1';
  }

  public ngOnInit(): void {
    this.fetchInfo();

    this.inputTable.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((conversionTable) => {
        this.fetchAvailableUnits(conversionTable);
      });

    this.conversionForm.valueChanges
      .pipe(
        debounceTime(250),
        takeUntil(this.destroy$),
        tap((value: HardnessConversionFormValue) =>
          this.activeConversion$.next({
            value: undefined,
            unit: value.initialInput.inputUnit,
          })
        ),
        map((value: HardnessConversionFormValue) => {
          const values = [];
          if (value.initialInput.inputValue) {
            values.push(value.initialInput.inputValue);
          }

          const additionalInputValues = value.additionalInput.flatMap(
            (row: { [0]: number; [1]: number }) =>
              [row[0], row[1]].filter((fieldValue) => !!fieldValue)
          );

          values.push(...additionalInputValues);

          return { values, unit: value.initialInput.inputUnit };
        }),
        filter(({ values }) => values.length > 0)
      )
      .subscribe(({ values, unit }) => {
        if (!this.conversionForm.valid) {
          this.resetResult();
        } else if (values.length > 1) {
          this.calculateValues(values);
        } else {
          this.multipleValues$.next(false);
          this.convertValue(this.inputTable.value, values[0], unit);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getPrecision(unit: string): number {
    return ONE_DIGIT_UNITS.includes(unit) ? 1 : 0;
  }

  public onAddButtonClick(): void {
    const newInputs = new UntypedFormGroup({
      [0]: this.createInputFormControl(),
      [1]: this.createInputFormControl(),
    });
    this.additionalInputs.push(newInputs, { emitEvent: false });
    this.conversionForm.markAsTouched();
    this.conversionForm.markAsDirty();
  }

  public onResetButtonClick(): void {
    this.additionalInputs.clear();
    this.conversionForm.reset();
    this.fetchInfo();
    this.average$ = new ReplaySubject<number>();
    this.standardDeviation$ = new ReplaySubject<number>();
    this.conversionResult$ = new ReplaySubject<HardnessConversionResponse>();
    this.multipleValues$.next(false);
    this.conversionForm.markAsUntouched();
    this.conversionForm.markAsPristine();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public getTooltip(unit: string): string | undefined {
    return unit === MPA
      ? this.translocoService.translate('utsTooltip')
      : undefined;
  }

  private fetchInfo(): void {
    this.hardnessService
      .getInfo()
      .pipe(take(1))
      .subscribe((info) => {
        this.tables$.next(info.conversionTables);
        this.units$.next(info.units);
        this.version$.next(info.version);
        this.inputTable.setValue(info.conversionTables[0] ?? undefined);
      });
  }

  private fetchAvailableUnits(conversionTable: string): void {
    this.hardnessService
      .getUnits({ conversionTable })
      .pipe(take(1))
      .subscribe(({ enabled }) => {
        this.enabled$.next(enabled);
        if (!enabled.includes(this.inputUnit.value)) {
          this.inputUnit.setValue(enabled[0]);
          this.activeConversion$.next({ value: undefined, unit: enabled[0] });
        }
      });
  }

  private calculateValues(values: number[]): void {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const distances = values.map((value) => Math.pow(value - average, 2));
    const standardDeviation = Math.sqrt(
      distances.reduce((a, b) => a + b, 0) / distances.length
    );
    const deviation =
      Math.abs(Math.max(...values)) - Math.abs(Math.min(...values));

    this.multipleValues$.next(true);
    this.average$.next(average);
    this.standardDeviation$.next(standardDeviation);
    this.convertValue(
      this.inputTable.value,
      average,
      this.inputUnit.value,
      deviation
    );
  }

  private convertValue(
    conversionTable: string,
    value: number,
    unit: string,
    deviation?: number
  ): void {
    this.activeConversion$.next({ value, unit });
    this.resultLoading$.next(true);
    this.hardnessService
      .getConversion({ conversionTable, unit, value, deviation })
      .pipe(take(1))
      .subscribe((result) => {
        this.resultLoading$.next(false);
        this.conversionResult$.next(result);
      });
  }

  private createInputFormControl() {
    return new FormControl<number>(undefined, Validators.min(0));
  }

  private resetResult() {
    // eslint-disable-next-line unicorn/no-useless-undefined
    this.conversionResult$.next(undefined);
    this.multipleValues$.next(false);
  }
}
