import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';

import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { filterSelected, triggerLoad } from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import { FilterService } from '../../../filter-section/filter.service';
import { EmployeesRequest, IdValue } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  comparedFilterSelected,
  loadComparedOrgUnits,
  loadComparedOrgUnitsFailure,
  loadComparedOrgUnitsSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';
import {
  getComparedSelectedTimeRange,
  getCurrentComparedFilters,
} from '../selectors/reasons-and-counter-measures.selector';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class ReasonsAndCounterMeasuresEffects implements OnInitEffects {
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, triggerLoad),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, selectedFilters]) => selectedFilters),
      filter((request) => !!request.timeRange),
      mergeMap((request: EmployeesRequest) => [
        loadReasonsWhyPeopleLeft({ request }),
      ])
    )
  );

  loadReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReasonsWhyPeopleLeft),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService
          .getReasonsWhyPeopleLeft(request)
          .pipe(
            map((data: ReasonForLeavingStats[]) =>
              loadReasonsWhyPeopleLeftSuccess({ data })
            ),
            catchError((error) =>
              of(
                loadReasonsWhyPeopleLeftFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    )
  );

  comparedFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(comparedFilterSelected),
      concatLatestFrom(() => this.store.select(getCurrentComparedFilters)),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit && request.timeRange),
      mergeMap((request: EmployeesRequest) => [
        loadComparedReasonsWhyPeopleLeft({ request }),
      ])
    )
  );

  loadComparedReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparedReasonsWhyPeopleLeft),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService
          .getReasonsWhyPeopleLeft(request)
          .pipe(
            map((data: ReasonForLeavingStats[]) =>
              loadComparedReasonsWhyPeopleLeftSuccess({ data })
            ),
            catchError((error) =>
              of(
                loadComparedReasonsWhyPeopleLeftFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    )
  );

  loadComparedOrgUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadComparedOrgUnits),
      concatLatestFrom(() => this.store.select(getComparedSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.filterService.getOrgUnits(action.searchFor, timeRange.id).pipe(
          map((items: IdValue[]) => loadComparedOrgUnitsSuccess({ items })),
          catchError((error) =>
            of(loadComparedOrgUnitsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
