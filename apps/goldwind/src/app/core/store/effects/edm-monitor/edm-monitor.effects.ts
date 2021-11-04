import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  map,
  mergeMap,
  tap,
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
import {
  getEdmHistogram,
  getEdmHistogramFailure,
  getEdmHistogramSuccess,
  stopEdmHistogramPolling,
} from '../../actions';
import { UPDATE_SETTINGS } from '../../../../shared/constants';

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

  edmHistogram$ = createEffect(() => {
    // eslint-disable-next-line ngrx/avoid-cyclic-effects
    return this.actions$.pipe(
      ofType(getEdmHistogram),
      tap((action) => (this.currentDeviceId = action.deviceId)),
      tap((action) => (this.currentChannel = action.channel)),
      withLatestFrom(this.store.select(getEdmInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        channel: action.channel,
        start: interval.startDate,
        end: interval.endDate,
      })),
      mergeMap((edmParams) =>
        this.restService.getEdmHistogram(edmParams, edmParams.channel).pipe(
          map((histogram) => getEdmHistogramSuccess({ histogram })),
          tap(() => (this.isPolling = true)),
          catchError((_e) => of(getEdmHistogramFailure()))
        )
      )
    );
  });
  pollingEDMHistogram$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getEdmHistogramSuccess),
      delay(UPDATE_SETTINGS.edmhistorgram.refresh * 1000),
      filter(() => this.isPolling),
      map(() =>
        getEdmHistogram({
          deviceId: this.currentDeviceId,
          channel: this.currentChannel,
        })
      )
    );
  });
  stopEdmHistogram$ = createEffect(
    () => {
      // eslint-disable-next-line ngrx/avoid-cyclic-effects
      return this.actions$.pipe(
        ofType(stopEdmHistogramPolling),
        map(() => (this.isPolling = false))
      );
    },
    { dispatch: false }
  );

  isPolling = false;
  currentDeviceId: string;
  currentChannel: string;

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
