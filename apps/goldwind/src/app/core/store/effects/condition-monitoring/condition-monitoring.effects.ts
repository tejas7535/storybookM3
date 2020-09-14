import { Injectable } from '@angular/core';

import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { getAccessToken } from '@schaeffler/auth';

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { StompService } from '../../../http/stomp.service';
import {
  connectStomp,
  disconnectStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';

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
        })
      ),
    { dispatch: false }
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
    private readonly stompService: StompService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
