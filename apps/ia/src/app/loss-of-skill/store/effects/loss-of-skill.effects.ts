import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import { filterSelected } from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeesRequest } from '../../../shared/models';
import { LossOfSkillService } from '../../loss-of-skill.service';
import {
  LostJobProfilesResponse,
  OpenPosition,
  WorkforceResponse,
} from '../../models';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadLossOfSkillData,
  loadLossOfSkillLeavers,
  loadLossOfSkillLeaversFailure,
  loadLossOfSkillLeaversSuccess,
  loadLossOfSkillWorkforce,
  loadLossOfSkillWorkforceFailure,
  loadLossOfSkillWorkforceSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
} from '../actions/loss-of-skill.actions';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class LossOfSkillEffects {
  readonly LOSS_OF_SKILL_URL = `/${AppRoutePath.LossOfSkillPath}`;

  constructor(
    private readonly actions$: Actions,
    private readonly lossOfSkillService: LossOfSkillService,
    private readonly store: Store
  ) {}

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, routerNavigationAction),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(
        ([_action, router]) => router.state.url === this.LOSS_OF_SKILL_URL
      ),
      map(() => loadLossOfSkillData())
    )
  );

  loadLossOfSkillData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadLossOfSkillData),
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

  loadLossOfSkillWorkforce$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLossOfSkillWorkforce),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([action, request]) => ({
        ...request,
        positionDescription: action.positionDescription,
      })),
      switchMap((request: EmployeesRequest) =>
        this.lossOfSkillService.getWorkforce(request).pipe(
          map((data: WorkforceResponse) =>
            loadLossOfSkillWorkforceSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadLossOfSkillWorkforceFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadLossOfSkillLeavers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLossOfSkillLeavers),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([action, request]) => ({
        ...request,
        positionDescription: action.positionDescription,
      })),
      switchMap((request: EmployeesRequest) =>
        this.lossOfSkillService.getLeavers(request).pipe(
          map((data: ExitEntryEmployeesResponse) =>
            loadLossOfSkillLeaversSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadLossOfSkillLeaversFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );
}
