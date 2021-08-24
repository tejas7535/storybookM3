import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {
  debounceTime,
  filter,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';

import { Store } from '@ngrx/store';

import {
  searchBearing,
  selectBearing,
} from '../core/store/actions/bearing/bearing.actions';
import {
  getBearingLoading,
  getBearingResultList,
} from '../core/store/selectors/bearing/bearing.selector';
import { getSelectedBearing } from './../core/store/selectors/bearing/bearing.selector';

@Component({
  selector: 'ga-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent implements OnInit, OnDestroy {
  bearingSearchFormControl = new FormControl();
  minimumChars = 2;

  loading$: Observable<boolean> = of(false);
  bearingResultList$: Observable<string[]>;
  destroy$ = new Subject<void>();

  selectedBearing$: Observable<string>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(getBearingLoading);
    this.bearingResultList$ = this.store.select(getBearingResultList);
    this.selectedBearing$ = this.store.select(getSelectedBearing);

    this.bearingSearchFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        filter((value: string) => value.length >= this.minimumChars),
        map((query: string) => this.store.dispatch(searchBearing({ query })))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleBearingSelection(bearing: string) {
    this.store.dispatch(selectBearing({ bearing }));
    if (bearing) {
      this.router.navigate(['/greaseCalculation/parameters']);
    }
  }

  public navigateBack(): void {
    this.router.navigate(['/app']);
  }
}
