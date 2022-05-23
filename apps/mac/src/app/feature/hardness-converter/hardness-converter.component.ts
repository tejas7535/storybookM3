import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, filter, map, take, takeUntil } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { changeFavicon } from '../../shared/change-favicon';
import { HV, MPA, ONE_DIGIT_UNITS } from './constants';
import {
  HardnessConversionFormValue,
  HardnessConversionResponse,
  HardnessUnitsResponse,
} from './models';
import { HardnessConverterApiService } from './services/hardness-converter-api.service';

@Component({
  selector: 'mac-hardness-converter',
  templateUrl: './hardness-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HardnessConverterComponent implements OnInit, OnDestroy {
  public title = 'Hardness Converter';

  public breadcrumbs: Breadcrumb[] = [
    { label: 'Materials App Center', url: '/overview' },
    {
      label: this.title,
    },
  ];

  private readonly destroy$ = new Subject<void>();
  public MPA = MPA;

  public units$ = new ReplaySubject<string[]>();
  public version$ = new ReplaySubject<string>();

  public inputValue = new FormControl(undefined);
  public inputUnit = new FormControl(HV);

  public initialInput = new FormGroup({
    inputValue: this.inputValue,
    inputUnit: this.inputUnit,
  });

  public additionalInputs = new FormArray([]);

  public conversionForm = new FormGroup({
    initialInput: this.initialInput,
    additionalInput: this.additionalInputs,
  });

  public multipleValues$ = new ReplaySubject<boolean>();
  public average$ = new ReplaySubject<number>();
  public standardDeviation$ = new ReplaySubject<number>();

  public utsTooltip = 'Ultimate tensile strength';

  public conversionResult$ = new ReplaySubject<HardnessConversionResponse>();
  public resultLoading$ = new BehaviorSubject<boolean>(false);

  public constructor(
    private readonly hardnessService: HardnessConverterApiService,
    private readonly applicationInsightService: ApplicationInsightsService,
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - HC] opened');
    changeFavicon(
      'assets/favicons/hardness-converter.ico',
      'Hardness Converter'
    );
    this.setupUnitList();
    this.conversionForm.valueChanges
      .pipe(
        debounceTime(250),
        takeUntil(this.destroy$),
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
        if (values.length > 1) {
          this.calculateValues(values);
        } else {
          this.multipleValues$.next(false);
          this.convertValue(values[0], unit);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupUnitList(): void {
    this.hardnessService
      .getUnits()
      .subscribe((response: HardnessUnitsResponse) => {
        this.units$.next(response.units);
        this.version$.next(response.version);
      });
  }

  private calculateValues(values: number[]): void {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const distances = values.map((value) => Math.pow(value - average, 2));
    const standardDeviation = Math.sqrt(
      distances.reduce((a, b) => a + b, 0) / distances.length
    );
    const deviation = Math.max(
      ...values.map((value) => Math.abs(value - average))
    );

    this.multipleValues$.next(true);
    this.average$.next(average);
    this.standardDeviation$.next(standardDeviation);
    this.convertValue(average, this.inputUnit.value, deviation);
  }

  private convertValue(value: number, unit: string, deviation?: number): void {
    this.resultLoading$.next(true);
    this.hardnessService
      .getConversionResult(unit, value, deviation)
      .pipe(take(1))
      .subscribe((result) => {
        this.resultLoading$.next(false);
        this.conversionResult$.next(result);
      });
  }

  public get step(): string {
    return ONE_DIGIT_UNITS.includes(this.initialInput.get('inputUnit').value)
      ? '.1'
      : '1';
  }

  public getPrecision(unit: string): number {
    return ONE_DIGIT_UNITS.includes(unit) ? 1 : 0;
  }

  public onAddButtonClick(): void {
    const newInputs = new FormGroup({
      [0]: new FormControl(),
      [1]: new FormControl(),
    });
    this.additionalInputs.push(newInputs, { emitEvent: false });
    this.conversionForm.markAsTouched();
    this.conversionForm.markAsDirty();
  }

  public onResetButtonClick(): void {
    this.additionalInputs.clear();
    this.conversionForm.reset({
      initialInput: {
        inputUnit: HV,
      },
    });
    this.average$ = new ReplaySubject<number>();
    this.standardDeviation$ = new ReplaySubject<number>();
    this.conversionResult$ = new ReplaySubject<HardnessConversionResponse>();
    this.multipleValues$.next(false);
    this.conversionForm.markAsUntouched();
    this.conversionForm.markAsPristine();
  }

  public onShareButtonClick(): void {
    this.clipboard.copy(window.location.href);
    this.snackbar.open('Url copied to clipboard', 'Close', { duration: 5000 });
  }

  public trackByFn(index: number): number {
    return index;
  }
}
