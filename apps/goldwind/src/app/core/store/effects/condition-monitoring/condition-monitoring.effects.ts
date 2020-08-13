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

import { getAccessToken } from '@schaeffler/auth';

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { DataService } from '../../../http/data.service';
import { StompService } from '../../../http/stomp.service';
import {
  connectStomp,
  disconnectStomp,
  getEdm,
  getEdmFailure,
  getEdmId,
  getEdmSuccess,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { getSensorId } from '../../selectors';

@Injectable()
export class ConditionMonitoringEffects {
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
        tap(() => {
          this.store.dispatch(connectStomp());
          this.store.dispatch(subscribeBroadcast());
          this.store.dispatch(getEdmId()); // will later be dispatched once sensor ids are there
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Edm ID
   */
  edmId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getEdmId.type),
        withLatestFrom(this.store.pipe(select(getSensorId))),
        map(([_action, sensorId]) => sensorId),
        tap((sensorId) => {
          this.store.dispatch(getEdm({ sensorId }));
        })
      ),
    { dispatch: false }
  );

  /**
   * Load EDM
   */
  edm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getEdm.type),
      map((action: any) => action.sensorId),
      mergeMap((sensorId) =>
        this.dataService.getEdm(`${sensorId}`).pipe(
          map((measurements) => getEdmSuccess({ measurements })),
          catchError((_e) => of(getEdmFailure()))
        )
      )
    )
  );

  /**
   * Establish Websocket Connection
   */
  stream$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectStomp.type),
      withLatestFrom(this.store.pipe(select(getAccessToken))),
      mergeMap(([_action, accessToken]) =>
        this.stompService
          .connect(accessToken)
          .pipe(map((status) => getStompStatus({ status })))
      )
    )
  );

  /**
   * End Websocket Connection
   */
  streamEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(disconnectStomp.type),
      mergeMap(() =>
        this.stompService
          .disconnect()
          .pipe(map((status) => getStompStatus({ status })))
      )
    )
  );

  /**
   * Subscribe to general Broadcast
   */
  topicBroadcast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subscribeBroadcast.type),
      mergeMap(() =>
        this.stompService.getTopicBroadcast().pipe(
          map(
            (message) => {
              const id = message.headers['message-id'];
              const body = message.body;

              return subscribeBroadcastSuccess({ id, body });
            }
            // catchError((_e) => of(subscribeBroadcastFailure()))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    private readonly stompService: StompService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
