/* eslint-disable ngrx/avoid-mapping-selectors */
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import * as A from '../../actions/grease-status/grease-status.actions';

@Injectable()
export class HeatmapStatusEffects {
  private readonly isPollingActive = false;

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

  heatmapLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A.getGreaseHeatMapLatest),
      map((action) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getGreaseHeatMap({ deviceId }).pipe(
          map((gcmheatmap) => A.getGreaseHeatMapSuccess({ gcmheatmap })),
          catchError((_e) => of(A.getGreaseHeatMapFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService
  ) {}
}
