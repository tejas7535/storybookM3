import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class ReasonsAndCounterMeasuresEffects implements OnInitEffects {
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      concatLatestFrom(() => this.store.select(getCurrentFiltersAndTime)),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit && request.timeRange),
      mergeMap((request: EmployeesRequest) => [
        loadReasonsWhyPeopleLeft({ request }),
      ])
    )
  );

  loadReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReasonsWhyPeopleLeft),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
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

  constructor(
    private readonly actions$: Actions,
    private readonly reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService,
    private readonly store: Store
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
