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

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getEdm,
  getEdmFailure,
  getEdmId,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getEdmInterval } from '../../selectors';

@Injectable()
export class EdmMonitorEffects {
  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values(BearingRoutePath).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter(
        (currentRoute: string) =>
          currentRoute &&
          currentRoute === BearingRoutePath.ConditionMonitoringPath
      ),
      map(() => getEdmId())
    );
  });

  /**
   * Set Interval
   */
  interval$ = createEffect(() => {
    return this.actions$.pipe(ofType(setEdmInterval), map(getEdmId));
  });

  /**
   * Load Edm ID
   */
  edmId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getEdmId),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        getEdm({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Load EDM
   */
  edm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getEdm),
      withLatestFrom(this.store.select(getEdmInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((edmParams) =>
        this.restService.getEdm(edmParams).pipe(
          map((measurements) => getEdmSuccess({ measurements })),
          catchError((_e) => of(getEdmFailure()))
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
