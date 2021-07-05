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

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getShaftId,
  getShaftLatest,
  getShaftLatestFailure,
  getShaftLatestSuccess,
  stopGetShaftLatest,
} from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class ShaftEffects {
  private isPollingActive = false;

  router$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values({ ...BearingRoutePath, ...AppRoutePath }).find(
            (route: string) => route !== '' && url.includes(route)
          )
        ),
        tap((currentRoute) => {
          if (currentRoute !== BearingRoutePath.ConditionMonitoringPath) {
            this.store.dispatch(stopGetShaftLatest());
          }

          if (currentRoute === BearingRoutePath.ConditionMonitoringPath) {
            this.store.dispatch(getShaftId({ source: currentRoute }));
          }
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Load Shaft Device ID
   */
  shaftId$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(getShaftId),
        filter((_) => !this.isPollingActive),
        withLatestFrom(this.store.select(fromRouter.getRouterState)),
        map(([_action, routerState]) => ({
          deviceId: routerState.state.params.id,
        })),
        tap(({ deviceId }) => {
          this.isPollingActive = true;
          this.store.dispatch(getShaftLatest({ deviceId }));
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Continue Load Shaft Device ID
   */
  continueShaftId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getShaftLatestSuccess, getShaftLatestFailure),
      delay(UPDATE_SETTINGS.shaft.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        getShaftLatest({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Stop Load Shaft Latest
   */
  stopGetShaftLatest$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(stopGetShaftLatest),
        map(() => {
          this.isPollingActive = false;
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Load Shaft Latest
   */
  shaftLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getShaftLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getShaftLatest(deviceId).pipe(
          map(([shaft]) => getShaftLatestSuccess({ shaft })),
          catchError((_e) => of(getShaftLatestFailure()))
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
