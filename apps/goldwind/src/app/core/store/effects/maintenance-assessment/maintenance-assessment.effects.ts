import { Injectable } from '@angular/core';

import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import * as fromRouter from '../../reducers';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusSuccess,
  getMaintenanceAssessmentId,
  setMaintenanceAssessmentInterval,
} from '../../actions';
import { of } from 'rxjs';
import { Interval } from '../../reducers/shared/models';
import { getMaintenanceAssessmentInterval } from '../../selectors/maintenance-assessment/maintenance-assessment.selector';
// import * as fromRouter from '../../reducers';

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
        ...interval,
      })),
      mergeMap((greaseParams) =>
        this.restService.getGreaseStatus(greaseParams).pipe(
          map((gcmStatus) => getGreaseStatusSuccess({ gcmStatus })),
          catchError((_e) => of(getGreaseStatusFailure()))
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
      mergeMap(({ deviceId }) => [getGreaseStatus({ deviceId })])
    );
  });
  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
