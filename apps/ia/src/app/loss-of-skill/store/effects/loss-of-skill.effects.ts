import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

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
import { EmployeesRequest } from '../../../shared/models';
import { LossOfSkillService } from '../../loss-of-skill.service';
import { LostJobProfilesResponse, OpenPosition } from '../../models';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
} from '../actions/loss-of-skill.actions';

@Injectable()
export class LossOfSkillEffects implements OnInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly lossOfSkillService: LossOfSkillService,
    private readonly store: Store
  ) {}

  filterChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterSelected, triggerLoad),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      filter((request) => !!(request.timeRange && request.value)),
      mergeMap((request: EmployeesRequest) => [
        loadJobProfiles({ request }),
        loadOpenPositions({ request }),
      ])
    );
  });

  loadJobProfiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadJobProfiles),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.lossOfSkillService.getJobProfiles(request).pipe(
          map((lostJobProfilesResponse: LostJobProfilesResponse) =>
            loadJobProfilesSuccess({ lostJobProfilesResponse })
          ),
          catchError((error) =>
            of(loadJobProfilesFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  loadOpenPositions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOpenPositions),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.lossOfSkillService.getOpenPositions(request).pipe(
          map((openPositions: OpenPosition[]) =>
            loadOpenPositionsSuccess({ openPositions })
          ),
          catchError((error) =>
            of(loadOpenPositionsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
