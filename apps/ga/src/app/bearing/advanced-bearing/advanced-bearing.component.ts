import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MtxSliderChange } from '@ng-matero/extensions/slider';

import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { Store } from '@ngrx/store';

import { SearchAutocompleteOption } from '@schaeffler/search-autocomplete';

import { environment } from '../../../environments/environment';
import { searchBearingExtended } from '../../core/store/actions/bearing/bearing.actions';
import { getBearingExtendedSearchParameters } from '../../core/store/selectors/bearing/bearing.selector';
import { bearingTypes } from '../../shared/constants';
import { ExtendedSearchParameters } from '../../shared/models';
import { dimensionValidators } from './advanced-bearing-constants';
import { fillDiameters } from './helpers';

@Component({
  selector: 'ga-advanced-bearing',
  templateUrl: './advanced-bearing.component.html',
})
export class AdvancedBearingComponent implements OnInit, OnDestroy {
  localDev = environment.localDev;
  extendedSearchParameters: ExtendedSearchParameters;

  // TODO maybe get localised types from API
  bearingTypes = bearingTypes.map((bearingType) => ({
    ...bearingType,
    text: `bearing.types.${bearingType.id}`,
  }));

  sliderValue = new FormControl(undefined);
  sliderMin = 0;
  sliderMax = 9999;

  pattern = new FormControl(undefined);
  bearingType = new FormControl(undefined);
  minDi = new FormControl(undefined, [
    ...dimensionValidators,
    this.innerOuterValidator(),
    this.minMaxDiValidator(),
  ]);
  maxDi = new FormControl(undefined, [
    ...dimensionValidators,
    this.innerOuterValidator(),
    this.minMaxDiValidator(),
  ]);
  minDa = new FormControl(undefined, [
    ...dimensionValidators,
    this.innerOuterValidator(),
    this.minMaxDaValidator(),
  ]);
  maxDa = new FormControl(undefined, [
    ...dimensionValidators,
    this.innerOuterValidator(),
    this.minMaxDaValidator(),
  ]);
  minB = new FormControl(undefined, [
    ...dimensionValidators,
    this.minMaxBValidator(),
  ]);
  maxB = new FormControl(undefined, [
    ...dimensionValidators,
    this.minMaxBValidator(),
  ]);

  bearingExtendedSearchParametersForm = new FormGroup({
    pattern: this.pattern,
    bearingType: this.bearingType,
    minDi: this.minDi,
    maxDi: this.maxDi,
    minDa: this.minDa,
    maxDa: this.maxDa,
    minB: this.minB,
    maxB: this.maxB,
  });

  consistencyErrors: { name: string; message: string }[] = [
    {
      name: 'innerOuterInconsistent',
      message: 'innerOuterInconsistent',
    },
    {
      name: 'minMaxInconsistent',
      message: 'minMaxInconsistent',
    },
  ];

  bearingExtendedSearchParameters$: Observable<ExtendedSearchParameters>;
  bearingResultExtendedSearchList$: Observable<SearchAutocompleteOption[]>;
  destroy$ = new Subject<void>();

  selectedBearing$: Observable<string>;

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if (this.formIsValid()) {
      this.store.dispatch(
        searchBearingExtended({
          parameters: this.extendedSearchParameters,
        })
      );
    }
    // eslint-disable-next-line no-plusplus
    this.step++;
  }

  prevStep() {
    // eslint-disable-next-line no-plusplus
    this.step--;
  }

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.bearingExtendedSearchParameters$ = this.store.select(
      getBearingExtendedSearchParameters
    );

    this.handleSubscriptions();

    this.sliderValue.setValue([this.sliderMin, 9999]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubscriptions(): void {
    this.bearingExtendedSearchParameters$.subscribe((params) => {
      for (const key in params) {
        if (params[key] !== undefined) {
          this.bearingExtendedSearchParametersForm.patchValue({
            [key]: params[key],
          });
        }
      }

      // needed to show validation errors immediately
      Object.keys(this.bearingExtendedSearchParametersForm.controls).forEach(
        (objectKey) =>
          this.bearingExtendedSearchParametersForm.controls[
            objectKey
          ].markAsDirty()
      );
    });

    this.bearingExtendedSearchParametersForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        map((parameters) => fillDiameters(parameters)),
        map((parameters) => {
          Object.keys(
            this.bearingExtendedSearchParametersForm.controls
          ).forEach((objectKey) =>
            this.bearingExtendedSearchParametersForm.controls[
              objectKey
            ].updateValueAndValidity()
          );

          this.extendedSearchParameters = parameters;
        })
      )
      .subscribe();
  }

  innerOuterValidator(): ValidatorFn {
    return (): { [key: string]: boolean } | null => {
      if (
        (this.minDi?.value > 0 || this.maxDi?.value > 0) &&
        (this.minDa?.value > 0 || this.maxDa?.value > 0) &&
        Math.max(this.minDi?.value, this.maxDi?.value) >
          Math.min(
            ...[this.minDa?.value, this.maxDa?.value].filter(
              (entry) => entry > 0
            )
          )
      ) {
        return {
          innerOuterInconsistent: true,
        };
      }

      return undefined;
    };
  }

  minMaxDiValidator(): ValidatorFn {
    return (): { [key: string]: boolean } | null => {
      if (this.invalidMinMax(this.minDi?.value, this.maxDi?.value)) {
        return {
          minMaxInconsistent: true,
        };
      }

      return undefined;
    };
  }

  minMaxDaValidator(): ValidatorFn {
    return (): { [key: string]: boolean } | null => {
      if (this.invalidMinMax(this.minDa?.value, this.maxDa?.value)) {
        return {
          minMaxInconsistent: true,
        };
      }

      return undefined;
    };
  }

  minMaxBValidator(): ValidatorFn {
    return (): { [key: string]: boolean } | null => {
      if (this.invalidMinMax(this.minB?.value, this.maxB?.value)) {
        return {
          minMaxInconsistent: true,
        };
      }

      return undefined;
    };
  }

  invalidMinMax(min: number, max: number): boolean {
    return min && max && min > max;
  }

  formIsValid(): boolean {
    return (
      Object.keys(this.bearingExtendedSearchParametersForm.controls).filter(
        (objectKey) =>
          this.bearingExtendedSearchParametersForm.controls[objectKey].invalid
      ).length === 0
    );
  }

  deleteDimension(firstDimension: string, secondDimension: string): void {
    this.bearingExtendedSearchParametersForm.controls[
      firstDimension
      // eslint-disable-next-line unicorn/no-null
    ].patchValue(null);
    this.bearingExtendedSearchParametersForm.controls[
      secondDimension
      // eslint-disable-next-line unicorn/no-null
    ].patchValue(null);
  }

  setSliderMinValue(val: number): void {
    const currentSliderMaxValue = this.sliderValue.value[1];

    this.sliderValue.patchValue([
      val,
      val >= currentSliderMaxValue ? val + 1 : currentSliderMaxValue,
    ]);
  }

  setSliderMaxValue(val: number): void {
    const currentSliderMinValue = this.sliderValue.value[0];

    this.sliderValue.patchValue([
      val <= currentSliderMinValue ? val - 1 : currentSliderMinValue,
      val,
    ]);
  }

  onSliderChange(sliderChange: MtxSliderChange): void {
    console.log('onSliderChange, new value:', sliderChange.value);
  }
}
