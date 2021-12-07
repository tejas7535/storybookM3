import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  map,
  mergeMap,
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
  getStaticSafetyId,
  getStaticSafetyLatest,
  getStaticSafetyLatestFailure,
  stopGetStaticSafetyLatest,
} from '../..';
import { getStaticSafetyLatestSuccess } from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class StaticSafetyEffects {
  private isPollingActive = false;

  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values({ ...BearingRoutePath, ...AppRoutePath }).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      map((currentRoute) =>
        currentRoute !== BearingRoutePath.ConditionMonitoringPath
          ? stopGetStaticSafetyLatest()
          : getStaticSafetyId({ source: currentRoute })
      )
    );
  });

  /**
   * Load Static Safety Device ID
   */
  staticSafetyId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getStaticSafetyId),
      filter((_) => !this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) => ({
        deviceId: routerState.state.params.id,
      })),
      map(({ deviceId }) => {
        this.isPollingActive = true;

        return getStaticSafetyLatest({ deviceId });
      })
    );
  });

  /**
   * Continue Load Static Safety Device ID
   */
  continueStaticSafetyId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getStaticSafetyLatestSuccess, getStaticSafetyLatestFailure),
      delay(UPDATE_SETTINGS.staticSafety.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        getStaticSafetyLatest({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Stop Load Static Safety Latest
   */
  stopGetStaticSafetyLatest$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(stopGetStaticSafetyLatest),
        map(() => {
          this.isPollingActive = false;
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Load Static Safety Latest
   */
  staticsafetyLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getStaticSafetyLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getStaticSafety(deviceId).pipe(
          map(([result]) => getStaticSafetyLatestSuccess({ result })),
          catchError((_e) => of(getStaticSafetyLatestFailure()))
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
