import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, filter, map, Subject, take, takeUntil } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getBearingSelectionLoading,
  getQuickBearingSelectionResultList,
  getSelectedBearing,
  searchBearing,
  selectBearing,
} from '@ga/core/store';

@Component({
  selector: 'ga-quick-bearing-selection',
  templateUrl: './quick-bearing-selection.component.html',
})
export class QuickBearingSelectionComponent implements OnInit, OnDestroy {
  bearingSearchFormControl = new FormControl();
  minimumChars = 2;

  loading$ = this.store.select(getBearingSelectionLoading);
  bearingResultList$ = this.store.select(getQuickBearingSelectionResultList);
  selectedBearing$ = this.store.select(getSelectedBearing);

  destroy$ = new Subject<void>();

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
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
  }
}
