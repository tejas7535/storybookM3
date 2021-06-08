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
  getShaftLatest,
  getShaftLatestFailure,
  getShaftLatestSuccess,
  getShaftSuccess,
  stopGetShaftLatest,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getGreaseInterval } from '../../selectors';

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
          if (currentRoute !== BearingRoutePath.ConditionMonitoringPath) {
            this.store.dispatch(stopGetShaftLatest());
          }

          if (
            currentRoute === BearingRoutePath.GreaseStatusPath ||
            currentRoute === BearingRoutePath.ConditionMonitoringPath
          ) {
            this.store.dispatch(getShaftId({ source: currentRoute }));
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Shaft Device ID
   */
  shaftId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getShaftId),
        filter((_) => !this.isPollingActive),
        withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
        map(([action, routerState]) => ({
          deviceId: routerState.state.params.id,
          source: action.source,
        })),
        tap(({ deviceId, source }) => {
          if (source === BearingRoutePath.ConditionMonitoringPath) {
            this.isPollingActive = true;
            this.store.dispatch(getShaftLatest({ deviceId }));
          } else {
            this.store.dispatch(getShaft({ deviceId }));
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Continue Load Shaft Device ID
   */
  continueShaftId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShaftLatestSuccess, getShaftLatestFailure),
      delay(UPDATE_SETTINGS.shaft.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) =>
        getShaftLatest({ deviceId: routerState.state.params.id })
      )
    )
  );

  /**
   * Stop Load Shaft Latest
   */
  stopGetShaftLatest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopGetShaftLatest),
        map(() => {
          this.isPollingActive = false;
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Shaft Latest
   */
  shaftLatest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShaftLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getShaftLatest(deviceId).pipe(
          map(([shaft]) => getShaftLatestSuccess({ shaft })),
          catchError((_e) => of(getShaftLatestFailure()))
        )
      )
    )
  );

  /**
   * Load Shaft
   */
  shaft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShaft),
      withLatestFrom(this.store.pipe(select(getGreaseInterval))),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((deviceId) =>
        this.restService.getShaft(deviceId).pipe(
          map((shaft) => getShaftSuccess({ shaft })),
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
