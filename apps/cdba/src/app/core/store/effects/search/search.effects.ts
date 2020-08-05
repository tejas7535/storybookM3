import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

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
  shareSearchResult,
} from '../../actions';
import { FilterItem } from '../../reducers/search/models';
import { SearchState } from '../../reducers/search/search.reducer';
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
  loadInitialFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInitialFilters.type),
      mergeMap(() =>
        this.searchService.getInitialFilters().pipe(
          map((items: FilterItem[]) => loadInitialFiltersSuccess({ items })),
          catchError((errorMessage) =>
            of(loadInitialFiltersFailure({ errorMessage }))
          )
        )
      )
    )
  );

  /**
   * Search
   */
  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(search.type),
      withLatestFrom(this.store.pipe(select(getSelectedFilters))),
      map(([_action, items]) => items),
      mergeMap((items) =>
        this.searchService.search(items).pipe(
          map((searchResult) => searchSuccess({ searchResult })),
          catchError((errorMessage) => of(searchFailure({ errorMessage })))
        )
      )
    )
  );

  /**
   * Text Search
   */
  applyTextSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyTextSearch),
      map((action: any) => action.textSearch),
      mergeMap((textSearch) =>
        this.searchService.textSearch(textSearch).pipe(
          map((searchResult) => applyTextSearchSuccess({ searchResult })),
          catchError((errorMessage) =>
            of(applyTextSearchFailure({ errorMessage }))
          )
        )
      )
    )
  );

  /**
   * Load initial filters due to reset
   *
   */
  resetFilters$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetFilters.type),
        tap(() => this.store.dispatch(loadInitialFilters()))
      ),
    { dispatch: false }
  );

  /**
   * Share current search result
   *
   */
  shareSearchResult$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(shareSearchResult.type),
        tap(() => console.log('TODO: Share Search Result'))
      ),
    { dispatch: false }
  );

  /**
   * Get possible values for a form field
   *
   */
  autocomplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autocomplete.type),
      mergeMap((action: any) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(
              select(getSelectedFilterIdValueOptionsByFilterName, {
                name: action.textSearch.field,
              })
            )
          )
        )
      ),
      mergeMap(([action, selectedOptions]) =>
        this.searchService
          .autocomplete(action.textSearch, selectedOptions)
          .pipe(
            map((item) => autocompleteSuccess({ item })),
            catchError((_e) => of(autocompleteFailure()))
          )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly store: Store<SearchState>
  ) {}

  /**
   * Load initial filters initially
   */
  ngrxOnInitEffects(): Action {
    return loadInitialFilters();
  }
}
