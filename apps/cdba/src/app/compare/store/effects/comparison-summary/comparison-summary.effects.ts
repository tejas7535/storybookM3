/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { ComparisonService } from '@cdba/compare/comparison-summary-tab/service/comparison.service';
import { Comparison } from '@cdba/shared/models/comparison.model';

import {
  areBomIdentifiersForSelectedBomItemsLoaded,
  loadBomSuccess,
  loadComparisonSummary,
  loadComparisonSummaryFailure,
  loadComparisonSummarySuccess,
} from '../..';
import { getBomIdentifiersForSelectedBomItems } from '../../selectors';

@Injectable()
export class ComparisonSummaryEffects {
  loadComparisonSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparisonSummary),
      concatLatestFrom(() =>
        this.store.select(getBomIdentifiersForSelectedBomItems)
      ),
      mergeMap(([_action, identifiers]) => {
        return this.comparisonService.getComparison(identifiers).pipe(
          map((comparison: Comparison) =>
            loadComparisonSummarySuccess({ comparison })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              loadComparisonSummaryFailure({
                errorMessage: error.error?.detail ?? error.message,
                statusCode: error.status,
              })
            )
          )
        );
      })
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBomSuccess),
      concatLatestFrom(() =>
        this.store.select(areBomIdentifiersForSelectedBomItemsLoaded)
      ),
      filter(([_action, areLoaded]) => areLoaded),
      map(() => loadComparisonSummary())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly comparisonService: ComparisonService,
    private readonly store: Store
  ) {}
}
