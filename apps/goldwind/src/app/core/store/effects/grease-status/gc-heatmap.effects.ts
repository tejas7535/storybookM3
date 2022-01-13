/* eslint-disable ngrx/avoid-mapping-selectors */
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
import * as A2 from '../../actions/grease-status/gc-heatmap.actions';
import * as A from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import { RestService } from '../../../http/rest.service';
import { getMaintenanceAssessmentInterval } from '../../selectors/maintenance-assessment/maintenance-assessment.selector';

@Injectable()
export class HeatmapStatusEffects {
  private isPollingActive = false;

  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values({ ...BearingRoutePath, ...AppRoutePath }).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      map((currentRoute) =>
        currentRoute === BearingRoutePath.MaintenanceAsseesmentPath
          ? A.getGreaseStatusId({ source: currentRoute })
          : A.stopGetGreaseStatusLatest()
      )
    );
  });

  greaseStatusId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A.getGreaseStatusId),
      filter((_) => !this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([action, routerState]) => ({
        deviceId: routerState.state.params.id,
        source: action.source,
      })),
      filter(
        ({ source }) => source === BearingRoutePath.MaintenanceAsseesmentPath
      ),
      map(({ deviceId, source }) => {
        this.isPollingActive = true;

        return source === BearingRoutePath.MaintenanceAsseesmentPath
          ? A2.getGreaseHeatMapLatest({ deviceId })
          : A.stopGetGreaseStatusLatest();
      })
    );
  });
  heatmapLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A2.getGreaseHeatMapLatest),
      withLatestFrom(this.store.select(getMaintenanceAssessmentInterval)),
      map(([{ deviceId }, interval]) => ({
        deviceId,
        interval: { startDate: interval.startDate },
      })),
      mergeMap(({ deviceId, interval }) =>
        this.restService
          .getGreaseHeatMap({
            deviceId,
            start: interval.startDate,
          })
          .pipe(
            map((gcmheatmap) => A2.getGreaseHeatMapSuccess({ gcmheatmap })),
            catchError((_e) => of(A2.getGreaseHeatMapFailure()))
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
