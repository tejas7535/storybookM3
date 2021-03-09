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
import { UPDATE_SETTINGS } from '../../../../shared/constants/update-settings';
import { RestService } from '../../../http/rest.service';
import {
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadSuccess,
  getLoadId,
  stopGetLoad,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { LoadSense } from '../../reducers/load-sense/models';

@Injectable()
export class BearingLoadEffects {
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
            this.store.dispatch(getLoadId());
          } else {
            this.store.dispatch(stopGetLoad());
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Load ID
   */
  loadId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLoadId),
      filter((_) => !this.isPollingActive),
      map(() => (this.isPollingActive = true)),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) => routerState.state.params.id),
      map((deviceId) => getBearingLoadLatest({ deviceId }))
    )
  );

  /**
   * Continue Load Shaft Device ID
   */
  continueLoadId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBearingLoadSuccess, getBearingLoadFailure),
      delay(UPDATE_SETTINGS.bearingLoad.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) =>
        getBearingLoadLatest({ deviceId: routerState.state.params.id })
      )
    )
  );

  /**
   * Stop Load Shaft
   */
  stopLoad$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopGetLoad),
        map(() => {
          this.isPollingActive = false;
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Load
   */
  bearingLoadLatest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBearingLoadLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getBearingLoadLatest(deviceId).pipe(
          map((bearingLoadLatest: LoadSense) =>
            getBearingLoadSuccess({ bearingLoadLatest })
          ),
          catchError((_e) => of(getBearingLoadFailure()))
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
