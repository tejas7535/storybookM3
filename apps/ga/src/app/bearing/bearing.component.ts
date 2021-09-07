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

import { AppRoutePath } from '../app-route-path.enum';
import {
  searchBearing,
  selectBearing,
} from '../core/store/actions/bearing/bearing.actions';
import { setCurrentStep } from '../core/store/actions/settings/settings.action';
import {
  getBearingLoading,
  getBearingResultList,
} from '../core/store/selectors/bearing/bearing.selector';
import { updateRouteParams } from './../core/store/actions/bearing/bearing.actions';
import { completeStep } from './../core/store/actions/settings/settings.action';
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
    this.store.dispatch(setCurrentStep({ step: 0 }));
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

    this.store.dispatch(updateRouteParams());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleBearingSelection(bearing: string) {
    this.store.dispatch(selectBearing({ bearing }));
    if (bearing) {
      this.store.dispatch(completeStep());
    }
  }

  public navigateBack(): void {
    this.router.navigate([AppRoutePath.BasePath]);
  }
}
