import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FilterService } from '../../../../filter-section/filter.service';
import { IdValue } from '../../../../shared/models';
import {
  loadOrgUnits,
  loadOrgUnitsFailure,
  loadOrgUnitsSuccess,
} from '../../actions';
import { getSelectedTimeRange } from '../../selectors';
@Injectable()
export class FilterEffects {
  loadOrgUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgUnits),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.filterService.getOrgUnits(action.searchFor, timeRange).pipe(
          map((items: IdValue[]) => loadOrgUnitsSuccess({ items })),
          catchError((error) =>
            of(loadOrgUnitsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
