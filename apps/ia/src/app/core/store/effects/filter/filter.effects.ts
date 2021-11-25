import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { loginSuccess } from '@schaeffler/azure-auth';

import { FilterService } from '../../../../filter-section/filter-service.service';
import { InitialFiltersResponse } from '../../../../filter-section/models/initial-filters-response.model';
import { FilterKey, IdValue } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions';

@Injectable()
export class FilterEffects {
  loadInitialFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadInitialFilters),
      mergeMap(() =>
        this.filterService.getInitialFilters().pipe(
          map((filters: InitialFiltersResponse) =>
            loadInitialFiltersSuccess({ filters })
          ),
          catchError((error) =>
            of(loadInitialFiltersFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  setInitialFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadInitialFiltersSuccess),
      mergeMap(() =>
        this.filterService.getInitialFilters().pipe(
          map((filters) =>
            filterSelected({
              filter: {
                name: FilterKey.ORG_UNIT,
                value:
                  filters?.orgUnits.find(
                    (elem: IdValue) => elem.value === 'Schaeffler_IT'
                  )?.value ?? filters?.orgUnits[0]?.value,
              },
            })
          )
        )
      )
    );
  });

  loginSuccessful$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess.type),
      // eslint-disable-next-line rxjs/no-unsafe-first
      take(1),
      map(loadInitialFilters)
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly filterService: FilterService
  ) {}
}
