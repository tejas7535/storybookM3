import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { SearchAutocompleteOption } from '@schaeffler/search-autocomplete';

import { environment } from '../../environments/environment';
import { AppRoutePath } from '../app-route-path.enum';
import {
  searchBearing,
  searchBearingExtended,
  selectBearing,
} from '../core/store/actions/bearing/bearing.actions';
import { setCurrentStep } from '../core/store/actions/settings/settings.actions';
import {
  getBearingExtendedSearchParameters,
  getBearingExtendedSearchResultList,
  getBearingLoading,
  getBearingResultList,
} from '../core/store/selectors/bearing/bearing.selector';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { bearingTypes } from '../shared/constants';
import { ExtendedSearchParameters } from '../shared/models';
import {
  getModelCreationSuccess,
  getSelectedBearing,
} from './../core/store/selectors/bearing/bearing.selector';
import { dimensionValidators } from './bearing-constants';

@Component({
  selector: 'ga-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent implements OnInit, OnDestroy {
  bearingSearchFormControl = new FormControl();
  minimumChars = 2;
  localDev = environment.localDev;
  detailSelection = true;
  bearingTypes = bearingTypes.map(
    (bearingType) =>
      ({
        ...bearingType,
        text: `bearing.types.${bearingType.id}`,
      } as any as FormControl)
  );

  pattern = new FormControl(undefined);
  bearingType = new FormControl(undefined);
  minDi = new FormControl(undefined, dimensionValidators);
  maxDi = new FormControl(undefined, dimensionValidators);
  minDa = new FormControl(undefined, dimensionValidators);
  maxDa = new FormControl(undefined, dimensionValidators);
  minB = new FormControl(undefined, dimensionValidators);
  maxB = new FormControl(undefined, dimensionValidators);

  bearingExtendedSearchParametersForm = new FormGroup(
    {
      pattern: this.pattern,
      bearingType: this.bearingType,
      minDi: this.minDi,
      maxDi: this.maxDi,
      minDa: this.minDa,
      maxDa: this.maxDa,
      minB: this.minB,
      maxB: this.maxB,
    },
    this.consistencyValidator()
  );

  public consistencyErrors: { name: string; message: string }[] = [
    {
      name: 'innerOuterInconsistent',
      message: 'innerOuterInconsistent',
    },
  ];

  loading$: Observable<boolean> = of(false);
  bearingResultList$: Observable<SearchAutocompleteOption[]>;
  bearingExtendedSearchParameters$: Observable<ExtendedSearchParameters>;
  bearingResultExtendedSearchList$: Observable<SearchAutocompleteOption[]>;
  destroy$ = new Subject<void>();

  selectedBearing$: Observable<string>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setCurrentStep({ step: 0 }));
    this.loading$ = this.store.select(getBearingLoading);
    this.bearingExtendedSearchParameters$ = this.store.select(
      getBearingExtendedSearchParameters
    );
    this.bearingExtendedSearchParameters$.subscribe((value) => {
      const params = { ...(value as any) };
      Object.keys(params).forEach(
        (key) =>
          params[key] !== undefined &&
          this.bearingExtendedSearchParametersForm.patchValue({
            key: params[key],
          })
      );
    });
    this.bearingResultList$ = this.store.select(getBearingResultList);
    this.bearingResultExtendedSearchList$ = this.store.select(
      getBearingExtendedSearchResultList
    );
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
    this.selectedBearing$ = this.store.select(getSelectedBearing);
    this.selectedBearing$
      .pipe(
        take(1),
        filter((bearing: string) => !!bearing)
      )
      .subscribe((bearing: string) =>
        this.bearingSearchFormControl.setValue({ id: bearing, title: bearing })
      );

    this.bearingSearchFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        filter((value: string) => value.length >= this.minimumChars),
        map((query: string) => {
          this.store.dispatch(searchBearing({ query }));
        })
      )
      .subscribe();

    this.bearingExtendedSearchParametersForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        map((parameters) => {
          this.store.dispatch(searchBearingExtended({ parameters }));
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleBearingSelection(bearing: string) {
    this.store.dispatch(selectBearing({ bearing }));

    this.store
      .select(getModelCreationSuccess)
      .pipe(
        filter((success: boolean) => success !== undefined),
        take(1)
      )
      .subscribe((success: boolean) => {
        if (success) {
          this.router.navigate([
            `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
          ]);
        } else {
          this.snackbar.open(
            translate('bearing.modelCreationError', { bearing }),
            translate('bearing.close')
          );
        }
      });
  }

  public navigateBack(): void {
    this.router.navigate([AppRoutePath.BasePath]);
  }

  public toggleSelection(): void {
    this.detailSelection = !this.detailSelection;
  }

  private consistencyValidator(): ValidatorFn {
    return (): { [key: string]: boolean } | null => {
      if (
        (this.minDi.value || this.maxDi.value) &&
        (this.minDa.value || this.maxDa.value) &&
        (this.minDi.value || this.maxDi.value) >
          (this.minDa.value || this.maxDa.value)
      ) {
        console.log('huhu');

        return {
          innerOuterInconsistent: true,
        };
      }

      return undefined;
    };
  }
}
