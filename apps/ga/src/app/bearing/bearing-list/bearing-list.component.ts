import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { distinctUntilChanged, filter, map, Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getBearingExtendedSearchResultList } from '../../core/store';

@Component({
  selector: 'ga-bearing-list',
  templateUrl: './bearing-list.component.html',
})
export class BearingListComponent implements OnInit {
  bearingResultExtendedSearchList$: Observable<any[]>;
  manyResults = 100;
  @Output() readonly bearingSelection: EventEmitter<string> =
    new EventEmitter();

  constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bearingResultExtendedSearchList$ = this.store.select(
      getBearingExtendedSearchResultList
    );

    this.handleSubscriptions();
  }

  handleSubscriptions(): void {
    this.bearingResultExtendedSearchList$
      .pipe(
        distinctUntilChanged((prev, cur) => prev?.length === cur?.length),
        filter((results) => results?.length > this.manyResults),
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

  selectBearing(bearing: any): void {
    this.bearingSelection.emit(bearing.id);
  }
}
