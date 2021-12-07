import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import { getLoadAssessmentInterval } from '../..';
import {
  getEdmFailure,
  getEdmMainteance,
  getEdmSuccess,
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusSuccess,
  getMaintenanceAssessmentId,
  getShaft,
  getShaftFailure,
  getShaftSuccess,
  setMaintenanceAssessmentInterval,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getMaintenanceAssessmentInterval } from '../../selectors/maintenance-assessment/maintenance-assessment.selector';
import { actionInterval } from '../utils';

@Injectable()
export class MaintenanceAssessmentEffects {
  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values({ ...BearingRoutePath, ...AppRoutePath }).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter(
        (currentRoute) =>
          currentRoute === BearingRoutePath.MaintenanceAsseesmentPath
      ),
      map(() => getMaintenanceAssessmentId())
    );
  });

  /**
   * Set Interval
   */
  interval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setMaintenanceAssessmentInterval),
      map(() => getMaintenanceAssessmentId())
    );
  });
  /**
   * Load Grease Status
   */
  greaseStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getGreaseStatus),
      withLatestFrom(this.store.select(getMaintenanceAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        start: interval.startDate,
        end: interval.endDate,
      })),
      mergeMap((greaseParams) =>
        this.restService.getGreaseStatus(greaseParams).pipe(
          map((gcmStatus) => getGreaseStatusSuccess({ gcmStatus })),
          catchError((_e) => of(getGreaseStatusFailure()))
        )
      )
    );
  });

  edm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getEdmMainteance),
      withLatestFrom(this.store.select(getMaintenanceAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        start: interval.startDate,
        end: interval.endDate,
      })),
      mergeMap((edmParams) =>
        this.restService.getEdm(edmParams).pipe(
          map((measurements) => getEdmSuccess({ measurements })),
          catchError((_e) => of(getEdmFailure()))
        )
      )
    );
  });

  /**
   * Load Shaft
   */
  shaft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getShaft),
      withLatestFrom(this.store.select(getMaintenanceAssessmentInterval)),
      map(actionInterval()),
      mergeMap((deviceId) =>
        this.restService.getShaft(deviceId).pipe(
          map((shaft) => getShaftSuccess({ shaft })),
          catchError((_e) => of(getShaftFailure()))
        )
      )
    );
  });
  /**
   * Load Load Maintenance Id
   */
  maintenanceAssessmentId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getMaintenanceAssessmentId),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) => ({
        deviceId: routerState.state.params.id,
      })),
      mergeMap(({ deviceId }) => [
        getGreaseStatus({ deviceId }),
        getEdmMainteance({ deviceId }),
        getShaft({ deviceId }),
      ])
    );
  });
  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
