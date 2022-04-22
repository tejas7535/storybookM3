import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { SearchAutocompleteOption } from '@schaeffler/search-autocomplete';

import { environment } from '../../../environments/environment';
import { searchBearingExtended } from '../../core/store/actions/bearing/bearing.actions';
import {
  getBearingExtendedSearchParameters,
  getBearingExtendedSearchResultList,
} from '../../core/store/selectors/bearing/bearing.selector';
import { bearingTypes } from '../../shared/constants';
import { ExtendedSearchParameters } from '../../shared/models';
import { dimensionValidators } from './advanced-bearing-constants';

export interface FillDiameterParams {
  parameters: ExtendedSearchParameters;
  key: string;
  potentiallyEmpty: number | undefined;
  reference: number | undefined;
}
@Component({
  selector: 'ga-advanced-bearing',
  templateUrl: './advanced-bearing.component.html',
})
export class AdvancedBearingComponent implements OnInit, OnDestroy {
  localDev = environment.localDev;

  // TODO maybe get localised types from API
  bearingTypes = bearingTypes.map(
    (bearingType) =>
      ({
        ...bearingType,
        text: `bearing.types.${bearingType.id}`,
      } as any as FormControl)
  );

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

  constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bearingExtendedSearchParameters$ = this.store.select(
      getBearingExtendedSearchParameters
    );

    this.bearingResultExtendedSearchList$ = this.store.select(
      getBearingExtendedSearchResultList
    );

    this.handleSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubscriptions(): void {
    this.bearingExtendedSearchParameters$.subscribe((value) => {
      const params = { ...(value as any) };
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined) {
          this.bearingExtendedSearchParametersForm.patchValue({
            [key]: params[key],
          });
        }
      });

      // needed to show validation errors immediately
      Object.keys(this.bearingExtendedSearchParametersForm.controls).forEach(
        (objectKey) =>
          this.bearingExtendedSearchParametersForm.controls[
            objectKey
          ].markAsDirty()
      );
    });

    this.bearingResultExtendedSearchList$
      .pipe(
        distinctUntilChanged((prev, cur) => prev.length === cur.length),
        filter((results) => results.length > 100),
        map((results) =>
          this.snackbar.open(
            translate('bearing.tooManyResults', { amount: results.length }),
            undefined,
            { duration: 3000 }
          )
        )
      )
      .subscribe();

    this.bearingExtendedSearchParametersForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        map((parameters) => this.fillDiameters(parameters)),
        map(
          (parameters) =>
            this.formIsValid() &&
            this.store.dispatch(searchBearingExtended({ parameters }))
        )
      )
      .subscribe();
  }

  fillDiameters(
    parameters: ExtendedSearchParameters
  ): ExtendedSearchParameters {
    const { minDi, maxDi, minDa, maxDa, minB, maxB } = parameters;
    let prefilledDimensions = parameters;

    prefilledDimensions = this.fillDiameterConditionally({
      parameters: prefilledDimensions,
      key: 'minDi',
      potentiallyEmpty: minDi,
      reference: maxDi,
    });
    prefilledDimensions = this.fillDiameterConditionally({
      parameters: prefilledDimensions,
      key: 'maxDi',
      potentiallyEmpty: maxDi,
      reference: minDi,
    });

    prefilledDimensions = this.fillDiameterConditionally({
      parameters: prefilledDimensions,
      key: 'minDa',
      potentiallyEmpty: minDa,
      reference: maxDa,
    });
    prefilledDimensions = this.fillDiameterConditionally({
      parameters: prefilledDimensions,
      key: 'maxDa',
      potentiallyEmpty: maxDa,
      reference: minDa,
    });

    prefilledDimensions = this.fillDiameterConditionally({
      parameters: prefilledDimensions,
      key: 'minB',
      potentiallyEmpty: minB,
      reference: maxB,
    });
    prefilledDimensions = this.fillDiameterConditionally({
      parameters: prefilledDimensions,
      key: 'maxB',
      potentiallyEmpty: maxB,
      reference: minB,
    });

    return prefilledDimensions;
  }

  fillDiameterConditionally({
    parameters,
    key,
    potentiallyEmpty,
    reference,
  }: FillDiameterParams): ExtendedSearchParameters {
    let prefilledDimensions = parameters;

    if ((potentiallyEmpty === null || potentiallyEmpty === null) && reference) {
      prefilledDimensions = {
        ...prefilledDimensions,
        [key]: reference,
      };
    }

    return prefilledDimensions;
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
}
