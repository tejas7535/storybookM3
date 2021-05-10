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
import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
  stopGetShaft,
} from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class ShaftEffects {
  private isPollingActive = false;

  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map(
          (url: string) =>
            Object.values({ ...BearingRoutePath, ...AppRoutePath })
              .filter((route: string) => route !== '' && url.includes(route))
              .shift() // only passes routes that are part of the route enums
        ),
        tap((currentRoute) => {
          if (
            currentRoute &&
            currentRoute === BearingRoutePath.ConditionMonitoringPath
          ) {
            this.store.dispatch(getShaftId());
          } else {
            this.store.dispatch(stopGetShaft());
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Shaft Device ID
   */
  shaftId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShaftId),
      filter((_) => !this.isPollingActive),
      map(() => (this.isPollingActive = true)),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) =>
        getShaft({ deviceId: routerState.state.params.id })
      )
    )
  );

  /**
   * Continue Load Shaft Device ID
   */
  continueShaftId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShaftSuccess, getShaftFailure),
      delay(UPDATE_SETTINGS.shaft.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) =>
        getShaft({ deviceId: routerState.state.params.id })
      )
    )
  );

  /**
   * Stop Load Shaft
   */
  stopShaft$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopGetShaft),
        map(() => {
          this.isPollingActive = false;
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Shaft
   */
  shaft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShaft),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getShaftLatest(deviceId).pipe(
          map(([shaft]) => getShaftSuccess({ shaft })),
          catchError((_e) => of(getShaftFailure()))
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
