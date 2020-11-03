import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
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
} from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getGreaseInterval, getGreaseSensorId } from '../../selectors';

@Injectable()
export class GreaseStatusEffects {
  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values(BearingRoutePath)
            .filter((route: string) => route !== '' && url.includes(route))
            .shift()
        ),
        filter(
          (currentRoute: string) =>
            currentRoute && currentRoute === BearingRoutePath.GreaseStatusPath
        ),
        tap((currentRoute) =>
          this.store.dispatch(getGreaseStatusId({ source: currentRoute }))
        )
      ),
    { dispatch: false }
  );

  /**
   * Set Interval
   */
  interval$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setGreaseInterval.type),
      map(() =>
        getGreaseStatusId({ source: BearingRoutePath.GreaseStatusPath })
      )
    )
  );

  /**
   * Load Grease Status ID
   */
  greaseStatusId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatusId.type),
      withLatestFrom(this.store.pipe(select(getGreaseSensorId))),
      map(([action, greaseStatusId]: [any, string]) => ({
        greaseStatusId,
        source: action.source,
      })),
      map(({ greaseStatusId, source }) =>
        source === BearingRoutePath.ConditionMonitoringPath
          ? getGreaseStatusLatest({ greaseStatusId })
          : getGreaseStatus({ greaseStatusId })
      )
    )
  );

  /**
   * Load Grease Status
   */
  greaseStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatus.type),
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
   * Load Latest Grease Status
   */
  greaseStatusLatest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatusLatest.type),
      map((action: any) => action.greaseStatusId),
      mergeMap((edmParams) =>
        this.restService.getGreaseStatusLatest(edmParams).pipe(
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
