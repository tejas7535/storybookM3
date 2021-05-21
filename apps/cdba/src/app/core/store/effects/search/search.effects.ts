/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { getIsLoggedIn } from '@schaeffler/azure-auth';

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
import {
  getSelectedFilterIdValueOptionsByFilterName,
  getSelectedFilters,
} from '../../selectors';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class SearchEffects implements OnInitEffects {
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
    private readonly store: Store
  ) {}

  /**
   * Load initial filters initially
   */
  ngrxOnInitEffects(): Action {
    this.store
      .select(getIsLoggedIn)
      .pipe(
        filter((isLoggedIn) => isLoggedIn),
        take(1),
        tap(() => this.store.dispatch(loadInitialFilters()))
      )
      .subscribe();

    return { type: 'NO_ACTION' };
  }
}
