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
import { UPDATE_SETTINGS } from '../../../../shared/constants/update-settings';
import {
  getBearingLoadLatest,
  getBearingLoadLatestFailure,
  getBearingLoadLatestSuccess,
  getLoadId,
  stopGetLoad,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { LegacyAPIService } from '../../../http/legacy.service';

@Injectable()
export class BearingLoadEffects {
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
        currentRoute === BearingRoutePath.ConditionMonitoringPath
          ? getLoadId()
          : stopGetLoad()
      )
    );
  });

  /**
   * Load Load ID
   */
  loadId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoadId),
      filter((_) => !this.isPollingActive),
      map(() => (this.isPollingActive = true)),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) => routerState.state.params.id),
      map((deviceId) => getBearingLoadLatest({ deviceId }))
    );
  });

  /**
   * Continue Load Shaft Device ID
   */
  continueLoadId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getBearingLoadLatestSuccess, getBearingLoadLatestFailure),
      delay(UPDATE_SETTINGS.bearingLoad.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        getBearingLoadLatest({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Stop Load Shaft
   */
  stopLoad$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(stopGetLoad),
        map(() => {
          this.isPollingActive = false;
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Load Load Latest
   */
  bearingLoadLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getBearingLoadLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.legacyAPIService.getBearingLoadLatest(deviceId).pipe(
          map(([bearingLoadLatest]) =>
            getBearingLoadLatestSuccess({ bearingLoadLatest })
          ),
          catchError((_e) => of(getBearingLoadLatestFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly legacyAPIService: LegacyAPIService,
    private readonly store: Store
  ) {}
}
