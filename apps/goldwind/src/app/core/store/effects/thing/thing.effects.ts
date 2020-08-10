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

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DataService } from '../../../http/data.service';
import { StompService } from '../../../http/stomp.service';
import {
  connectStomp,
  disconnectStomp,
  getStompStatus,
  getThing,
  getThingEdm,
  getThingEdmFailure,
  getThingEdmId,
  getThingEdmSuccess,
  getThingFailure,
  getThingId,
  getThingSuccess,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { getThingSensorId } from '../../selectors';

@Injectable()
export class ThingEffects {
  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values(AppRoutePath)
            .filter((route: string) => route !== '' && url.includes(route))
            .shift()
        ),
        filter(
          (currentRoute: string) =>
            currentRoute && currentRoute === AppRoutePath.BearingPath
        ),
        tap(() => {
          this.store.dispatch(getThingId());
          this.store.dispatch(connectStomp());
          this.store.dispatch(subscribeBroadcast());
          this.store.dispatch(getThingEdmId()); // will later be dispatched once sensor ids are there
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Thing ID
   */
  thingId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getThingId.type),
        withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
        map(([_action, routerState]) => routerState.state.params.id),
        tap((thingId) => {
          this.store.dispatch(getThing({ thingId }));
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Thing
   */
  thing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getThing.type),
      map((action: any) => action.thingId),
      mergeMap((thingId) =>
        this.dataService.getThing(thingId).pipe(
          map((thing) => getThingSuccess({ thing })),
          catchError((_e) => of(getThingFailure()))
        )
      )
    )
  );

  /**
   * Load Thing Edm ID
   */
  thingEdmId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getThingEdmId.type),
        withLatestFrom(this.store.pipe(select(getThingSensorId))),
        map(([_action, sensorId]) => sensorId),
        tap((sensorId) => {
          this.store.dispatch(getThingEdm({ sensorId }));
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Thing EDM
   */
  thingEdm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getThingEdm.type),
      map((action: any) => action.sensorId),
      mergeMap((sensorId) =>
        this.dataService.getEdm(`${sensorId}`).pipe(
          map((measurements) => getThingEdmSuccess({ measurements })),
          catchError((_e) => of(getThingEdmFailure()))
        )
      )
    )
  );

  /**
   * Establish Websocket Connection
   */
  thingStream$ = createEffect(() =>
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
  thingStreamEnd$ = createEffect(() =>
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
