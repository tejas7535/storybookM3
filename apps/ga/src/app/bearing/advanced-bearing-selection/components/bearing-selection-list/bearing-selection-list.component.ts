import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { distinctUntilChanged, filter, map, Subject, takeUntil } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getBearingExtendedSearchResultList,
  selectBearing,
} from '@ga/core/store';

@Component({
  selector: 'ga-bearing-selection-list',
  templateUrl: './bearing-selection-list.component.html',
  styleUrls: ['./bearing-selection-list.component.scss'],
})
export class BearingSelectionListComponent implements OnInit, OnDestroy {
  public bearingResultExtendedSearchList$ = this.store.select(
    getBearingExtendedSearchResultList
  );
  public resultsLimit = 100;
  public destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.bearingResultExtendedSearchList$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, cur) => prev?.length === cur?.length),
        filter((results) => results?.length > this.resultsLimit),
        map((results) =>
          this.snackbar.open(
            translate('bearing.tooManyResults', { amount: results.length }),
            undefined,
            { duration: 3000 }
          )
        )
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectBearing(bearing: any): void {
    this.store.dispatch(selectBearing({ bearing: bearing.id }));
  }
}
