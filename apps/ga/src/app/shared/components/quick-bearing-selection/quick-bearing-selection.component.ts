import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { debounceTime, filter, map, Subject, take, takeUntil } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getBearingSelectionLoading,
  getQuickBearingSelectionResultList,
  getSelectedBearing,
  resetBearing,
  searchBearing,
  selectBearing,
} from '@ga/core/store';

@Component({
  selector: 'ga-quick-bearing-selection',
  templateUrl: './quick-bearing-selection.component.html',
})
export class QuickBearingSelectionComponent implements OnInit, OnDestroy {
  @Input() resetOnInit = false;

  public bearingSearchFormControl = new UntypedFormControl();
  public minimumChars = 2;
  public loading$ = this.store.select(getBearingSelectionLoading);
  public bearingResultList$ = this.store.select(
    getQuickBearingSelectionResultList
  );

  private readonly selectedBearing$ = this.store.select(getSelectedBearing);
  private readonly destroy$ = new Subject<void>();
  private currentLanguage: string;

  public constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.resetOnInit) {
      this.resetBearingSelection();
    }

    this.currentLanguage = this.transloco.getActiveLang();
    this.transloco.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        if (language !== this.currentLanguage) {
          this.currentLanguage = language;
          this.resetBearingSelection();
          this.bearingSearchFormControl.reset();
        }
      });

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
        filter((value: string) => value?.length >= this.minimumChars),
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

  public handleBearingSelection(bearing: string): void {
    this.store.dispatch(selectBearing({ bearing }));
  }

  private resetBearingSelection(): void {
    this.store.dispatch(resetBearing());
  }
}
