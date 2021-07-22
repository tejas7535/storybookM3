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
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  stopGetGreaseStatusLatest,
} from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class GreaseStatusEffects {
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
          ? getGreaseStatusId({ source: currentRoute })
          : stopGetGreaseStatusLatest()
      )
    );
  });

  /**
   * Load Grease Status ID
   */
  greaseStatusId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getGreaseStatusId),
      filter((_) => !this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([action, routerState]) => ({
        deviceId: routerState.state.params.id,
        source: action.source,
      })),
      filter(
        ({ source }) => source === BearingRoutePath.ConditionMonitoringPath
      ),
      map(({ deviceId }) => {
        this.isPollingActive = true;

        return getGreaseStatusLatest({ deviceId });
      })
    );
  });

  /**
   * Continue Load Latest Grease Status
   */
  continueGraseId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getGreaseStatusLatestSuccess, getGreaseStatusLatestFailure),
      delay(UPDATE_SETTINGS.grease.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        getGreaseStatusLatest({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Stop Load Latest Grease Status
   */
  stopGrease$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(stopGetGreaseStatusLatest),
        map(() => {
          this.isPollingActive = false;
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Load Latest Grease Status
   */
  greaseStatusLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getGreaseStatusLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.restService.getGreaseStatusLatest(deviceId).pipe(
          map(([greaseStatusLatest]) =>
            getGreaseStatusLatestSuccess({ greaseStatusLatest })
          ),
          catchError((_e) => of(getGreaseStatusLatestFailure()))
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
