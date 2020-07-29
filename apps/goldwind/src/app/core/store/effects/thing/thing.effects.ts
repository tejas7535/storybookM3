import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { getAccessToken } from '@schaeffler/auth';

import { DataService } from '../../../http/data.service';
import {
  getStomp,
  getStompStatus,
  getThing,
  getThingFailure,
  getThingId,
  getThingSuccess,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class ThingEffects {
  /**
   * Load Thing ID
   */
  thingId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED, getThingId.type),
        withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
        map(([_action, routerState]) => routerState.state.params.id),
        tap((thingId) => this.store.dispatch(getThing({ thingId })))
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
        this.dataService.getIotThings(thingId).pipe(
          map((thing) => getThingSuccess({ thing })),
          catchError((_e) => of(getThingFailure()))
        )
      )
    )
  );

  /**
   * Establish Websocket Connection
   */
  thingStream$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED, getStomp.type),
      withLatestFrom(this.store.pipe(select(getAccessToken))),
      mergeMap(([_action, accessToken]) =>
        this.dataService.connect(accessToken).pipe(
          map((status) => getStompStatus({ status }))
          // catchError((_e) => of(getThingFailure()))
        )
      )
    )
  );

  /**
   * Subscribe to general Broadcast
   */
  topicBroadcast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED, subscribeBroadcast.type),
      mergeMap(() =>
        this.dataService.getTopicBroadcast().pipe(
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
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
