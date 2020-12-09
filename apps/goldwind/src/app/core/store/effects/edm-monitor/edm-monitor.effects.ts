import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

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
import { getEdmInterval, getSensorId } from '../../selectors';

@Injectable()
export class EdmMonitorEffects {
  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values(BearingRoutePath)
            .filter((route: string) => route !== '' && url.includes(route))
            .shift()
        ),
        filter(
          (currentRoute: string) =>
            currentRoute &&
            currentRoute === BearingRoutePath.ConditionMonitoringPath
        ),
        tap(
          () => this.store.dispatch(getEdmId()) // will later be dispatched once sensor ids are there
        )
      ),
    { dispatch: false }
  );

  /**
   * Set Interval
   */
  interval$ = createEffect(() =>
    this.actions$.pipe(ofType(setEdmInterval), map(getEdmId))
  );

  /**
   * Load Edm ID
   */
  edmId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getEdmId),
      withLatestFrom(this.store.pipe(select(getSensorId))),
      map(([_action, sensorId]) => getEdm({ sensorId }))
    )
  );

  /**
   * Load EDM
   */
  edm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getEdm),
      withLatestFrom(this.store.pipe(select(getEdmInterval))),
      map(([action, interval]: [any, Interval]) => ({
        id: action.sensorId,
        ...interval,
      })),
      mergeMap((edmParams) =>
        this.restService.getEdm(edmParams).pipe(
          map((measurements) => getEdmSuccess({ measurements })),
          catchError((_e) => of(getEdmFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
