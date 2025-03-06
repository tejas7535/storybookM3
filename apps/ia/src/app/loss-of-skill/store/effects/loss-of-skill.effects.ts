import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import { filterSelected } from '../../../core/store/actions';
import {
  getCurrentDimensionValue,
  getCurrentFilters,
} from '../../../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { isFeatureEnabled } from '../../../shared/guards/is-feature-enabled';
import { EmployeesRequest } from '../../../shared/models';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import { LossOfSkillService } from '../../loss-of-skill.service';
import {
  LostJobProfilesResponse,
  PmgmDataDtoResponse,
  WorkforceResponse,
} from '../../models';
import { PmgmMapperService } from '../../pmgm/pmgm-mapper.service';
import {
  clearLossOfSkillDimensionData,
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
  loadPmgmData,
  loadPmgmDataFailure,
  loadPmgmDataSuccess,
} from '../actions/loss-of-skill.actions';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class LossOfSkillEffects {
  readonly LOSS_OF_SKILL_URL = `/${AppRoutePath.LostPerformancePath}`;

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, routerNavigationAction, updateUserSettingsSuccess),
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
        loadPmgmData({ request }),
      ])
    );
  });

  // clear dimension's data when user changed the dimension during the loading
  clearDimensionDataOnDimensionChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadJobProfilesSuccess,
        loadLossOfSkillWorkforceSuccess,
        loadLossOfSkillLeaversSuccess
      ),
      concatLatestFrom(() => this.store.select(getCurrentDimensionValue)),
      filter(([_action, dimensionFilter]) => !dimensionFilter),
      map(() => clearLossOfSkillDimensionData())
    )
  );

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

  loadLossOfSkillWorkforce$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLossOfSkillWorkforce),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([action, request]) => ({
        ...request,
        jobKey: action.jobKey,
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
        jobKey: action.jobKey,
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

  loadPmgmData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPmgmData),
      filter(() => isFeatureEnabled()),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.lossOfSkillService.getPmgmData(request).pipe(
          map((data: PmgmDataDtoResponse) =>
            loadPmgmDataSuccess({
              data: {
                pmgmData: this.pmgmMapperService.mapPmgmDataResponseToPmgmData(
                  data.pmgmData
                ),
                responseModified: data.responseModified,
              },
            })
          ),
          catchError((error) =>
            of(loadPmgmDataFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly lossOfSkillService: LossOfSkillService,
    private readonly pmgmMapperService: PmgmMapperService,
    private readonly store: Store
  ) {}
}
