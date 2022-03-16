import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { loginSuccess } from '@schaeffler/azure-auth';

import { FilterService } from '../../../../filter-section/filter-service.service';
import { InitialFiltersResponse } from '../../../../filter-section/models/initial-filters-response.model';
import {
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions';
import { getSelectedTimeRange } from '../../selectors';

@Injectable()
export class FilterEffects {
  loadInitialFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadInitialFilters),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      map(([_action, timeRange]) => timeRange),
      mergeMap((timeRange: string) =>
        this.filterService.getInitialFilters(timeRange).pipe(
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

  // setInitialFilters$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(loadInitialFiltersSuccess),

  //     mergeMap(() =>
  //       this.filterService.getInitialFilters().pipe(
  //         map((filters) =>
  //           filterSelected({
  //             filter: {
  //               name: FilterKey.ORG_UNIT,
  //               value:
  //                 filters?.orgUnits.find(
  //                   (elem: IdValue) => elem.value === 'Schaeffler_IT'
  //                 )?.value ?? filters?.orgUnits[0]?.value,
  //             },
  //           })
  //         )
  //       )
  //     )
  //   );
  // });

  loginSuccessful$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess.type),
      take(1),
      map(loadInitialFilters)
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly filterService: FilterService,
    private readonly store: Store
  ) {}
}
