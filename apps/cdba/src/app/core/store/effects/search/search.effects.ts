import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';

import { SearchService } from '../../../../search/services/search.service';
import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  changePaginationVisibility,
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
  getFiltersForSearchRequest,
  getTooManyResultsThreshold,
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
      concatLatestFrom(() => [
        this.store.select(getFiltersForSearchRequest),
        this.store.select(getTooManyResultsThreshold),
      ]),
      map(([_action, items, threshold]) => ({ items, threshold })),
      mergeMap(({ items, threshold }) =>
        this.searchService.search(items).pipe(
          tap((searchResult) => {
            if (searchResult.count > 0 && searchResult.count <= threshold) {
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
      mergeMap((action) =>
        this.searchService
          .autocomplete(action.searchFor, action.filter.name)
          .pipe(
            map((item) => autocompleteSuccess({ item })),
            catchError(() => of(autocompleteFailure({ item: action.filter })))
          )
      )
    );
  });

  /**
   * Set the pagination visibility to false when navigating to the search page
   */
  resetPaginationVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (action: any) =>
          action.payload.event.id !== 1 &&
          action.payload.event.urlAfterRedirects === '/search'
      ),
      map(() => changePaginationVisibility({ isVisible: false }))
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly store: Store,
    private readonly router: Router
  ) {}
}
