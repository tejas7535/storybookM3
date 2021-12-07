import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { SearchService } from '../../../../search/services/search.service';
import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
} from '../../actions';
import { FilterItem } from '../../reducers/search/models';
import { TOO_MANY_RESULTS_THRESHOLD } from '../../reducers/search/search.reducer';
import {
  getSelectedFilterIdValueOptionsByFilterName,
  getSelectedFilters,
} from '../../selectors';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class SearchEffects {
  /**
   * Receive initial filters
   */
  loadInitialFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadInitialFilters),
      mergeMap(() =>
        this.searchService.getInitialFilters().pipe(
          map((items: FilterItem[]) => loadInitialFiltersSuccess({ items })),
          catchError((errorMessage) =>
            of(loadInitialFiltersFailure({ errorMessage }))
          )
        )
      )
    );
  });

  /**
   * Search
   */
  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(search),
      withLatestFrom(this.store.select(getSelectedFilters)),
      map(([_action, items]) => items),
      mergeMap((items) =>
        this.searchService.search(items).pipe(
          tap((searchResult) => {
            if (
              searchResult.resultCount > 0 &&
              searchResult.resultCount <= TOO_MANY_RESULTS_THRESHOLD
            ) {
              this.router.navigateByUrl(AppRoutePath.ResultsPath);
            }
          }),
          map((searchResult) => searchSuccess({ searchResult })),
          catchError((errorMessage) => of(searchFailure({ errorMessage })))
        )
      )
    );
  });

  /**
   * Text Search
   */
  applyTextSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(applyTextSearch),
      map((action) => action.textSearch),
      mergeMap((textSearch) =>
        this.searchService.textSearch(textSearch).pipe(
          map((searchResult) => applyTextSearchSuccess({ searchResult })),
          catchError((errorMessage) =>
            of(applyTextSearchFailure({ errorMessage }))
          )
        )
      )
    );
  });

  /**
   * Load initial filters due to reset
   *
   */
  resetFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resetFilters),
      map(() => loadInitialFilters())
    );
  });

  /**
   * Get possible values for a form field
   *
   */
  autocomplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autocomplete),
      map((action) => action.textSearch),
      concatLatestFrom((textSearch) =>
        this.store.select(getSelectedFilterIdValueOptionsByFilterName, {
          name: textSearch.field,
        })
      ),
      mergeMap(([textSearch, selectedOptions]) =>
        this.searchService.autocomplete(textSearch, selectedOptions).pipe(
          map((item) => autocompleteSuccess({ item })),
          catchError(() => of(autocompleteFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly store: Store,
    private readonly router: Router
  ) {}
}
