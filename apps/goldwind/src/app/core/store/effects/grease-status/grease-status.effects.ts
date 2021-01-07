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
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  setGreaseInterval,
  stopGetGreaseStatusLatest,
} from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getGreaseInterval, getGreaseSensorId } from '../../selectors';

@Injectable()
export class GreaseStatusEffects {
  private isPollingActive = false;

  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values({ ...BearingRoutePath, ...AppRoutePath })
            .filter((route: string) => route !== '' && url.includes(route))
            .shift()
        ),
        tap((currentRoute) => {
          if (currentRoute !== BearingRoutePath.ConditionMonitoringPath) {
            this.store.dispatch(stopGetGreaseStatusLatest());
          }

          if (
            currentRoute === BearingRoutePath.GreaseStatusPath ||
            currentRoute === BearingRoutePath.ConditionMonitoringPath
          ) {
            this.store.dispatch(getGreaseStatusId({ source: currentRoute }));
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Set Interval
   */
  interval$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setGreaseInterval),
      map(() =>
        getGreaseStatusId({ source: BearingRoutePath.GreaseStatusPath })
      )
    )
  );

  /**
   * Load Grease Status ID
   */
  greaseStatusId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getGreaseStatusId),
        filter((_) => !this.isPollingActive),
        withLatestFrom(this.store.pipe(select(getGreaseSensorId))),
        map(([action, greaseStatusId]: [any, string]) => ({
          greaseStatusId,
          source: action.source,
        })),
        tap(({ greaseStatusId, source }) => {
          if (source === BearingRoutePath.ConditionMonitoringPath) {
            this.isPollingActive = true;
            this.store.dispatch(getGreaseStatusLatest({ greaseStatusId }));
          } else {
            this.store.dispatch(getGreaseStatus({ greaseStatusId }));
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Grease Status
   */
  greaseStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatus),
      withLatestFrom(this.store.pipe(select(getGreaseInterval))),
      map(([action, interval]: [any, Interval]) => ({
        id: action.greaseStatusId,
        ...interval,
      })),
      mergeMap((edmParams) =>
        this.restService.getGreaseStatus(edmParams).pipe(
          map((greaseStatus) => getGreaseStatusSuccess({ greaseStatus })),
          catchError((_e) => of(getGreaseStatusFailure()))
        )
      )
    )
  );

  /**
   * Continue Load Latest Grease Status
   */
  continueGraseId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatusLatestSuccess, getGreaseStatusLatestFailure),
      delay(UPDATE_SETTINGS.grease.refresh * 1000),
      filter(() => this.isPollingActive),
      withLatestFrom(this.store.pipe(select(getGreaseSensorId))),
      map(([_action, greaseStatusId]) =>
        getGreaseStatusLatest({ greaseStatusId })
      )
    )
  );

  /**
   * Stop Load Latest Grease Status
   */
  stopGrease$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopGetGreaseStatusLatest),
        map(() => {
          this.isPollingActive = false;
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Latest Grease Status
   */
  greaseStatusLatest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatusLatest),
      map((action: any) => action.greaseStatusId),
      mergeMap((greaseStatusId) =>
        this.restService.getGreaseStatusLatest(greaseStatusId).pipe(
          map((greaseStatusLatest) =>
            getGreaseStatusLatestSuccess({ greaseStatusLatest })
          ),
          catchError((_e) => of(getGreaseStatusLatestFailure()))
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
