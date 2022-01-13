/* eslint-disable ngrx/avoid-mapping-selectors */
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
import * as A from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import { LiveAPIService } from '../../../http/liveapi.service';

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
          ? A.getGreaseStatusId({ source: currentRoute })
          : A.stopGetGreaseStatusLatest()
      )
    );
  });

  /**
   * Load Grease Status ID
   */
  greaseStatusId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A.getGreaseStatusId),
      filter((_) => !this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([action, routerState]) => ({
        deviceId: routerState.state.params.id,
        source: action.source,
      })),
      filter(
        ({ source }) => source === BearingRoutePath.ConditionMonitoringPath
      ),
      map(({ deviceId, source }) => {
        this.isPollingActive = true;

        return source === BearingRoutePath.ConditionMonitoringPath
          ? A.getGreaseStatusLatest({ deviceId })
          : A.stopGetGreaseStatusLatest();
      })
    );
  });

  /**
   * Continue Load Latest Grease Status
   */
  continueGraseId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A.getGreaseStatusLatestSuccess, A.getGreaseStatusLatestFailure),
      delay(UPDATE_SETTINGS.grease.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        A.getGreaseStatusLatest({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Stop Load Latest Grease Status
   */
  stopGrease$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(A.stopGetGreaseStatusLatest),
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
      ofType(A.getGreaseStatusLatest),
      map((action: any) => action.deviceId),
      mergeMap((deviceId) =>
        this.liveAPIService.getGcmProcessed(deviceId).pipe(
          map((greaseStatusLatest) =>
            A.getGreaseStatusLatestSuccess({ greaseStatusLatest })
          ),
          catchError((_e) => of(A.getGreaseStatusLatestFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly liveAPIService: LiveAPIService,
    private readonly store: Store
  ) {}
}
