import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  debounceTime,
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

import { AppRoutePath } from '../app-route-path.enum';
import {
  searchBearing,
  selectBearing,
} from '../core/store/actions/bearing/bearing.actions';
import { setCurrentStep } from '../core/store/actions/settings/settings.actions';
import {
  getBearingLoading,
  getBearingResultList,
} from '../core/store/selectors/bearing/bearing.selector';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import {
  getModelCreationSuccess,
  getSelectedBearing,
} from './../core/store/selectors/bearing/bearing.selector';

@Component({
  selector: 'ga-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent implements OnInit, OnDestroy {
  bearingSearchFormControl = new FormControl();
  minimumChars = 2;
  detailSelection = false;

  loading$: Observable<boolean> = of(false);
  bearingResultList$: Observable<SearchAutocompleteOption[]>;
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

    this.bearingResultList$ = this.store.select(getBearingResultList);

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
}
