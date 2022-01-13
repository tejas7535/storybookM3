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
import {
  getMaintenanceAssessmentDataFailure,
  getMaintenanceAssessmentDataSuccess,
  getMaintenanceAssessmentId,
  setMaintenanceAssessmentInterval,
} from '../../actions';
import * as fromRouter from '../../reducers';
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
   * Load Load Maintenance Id
   */
  maintenanceAssessmentId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getMaintenanceAssessmentId),
      withLatestFrom(this.store.select(getMaintenanceAssessmentInterval)),
      map(actionInterval()),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([action, routerState]) => ({
        id: routerState.state.params.id,
        start: action.start,
        end: action.end,
      })),
      mergeMap((params) =>
        this.restService.getMaintenaceSensors(params).pipe(
          map((data) => getMaintenanceAssessmentDataSuccess({ data })),
          catchError((_e) => of(getMaintenanceAssessmentDataFailure()))
        )
      )
    );
  });
  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
