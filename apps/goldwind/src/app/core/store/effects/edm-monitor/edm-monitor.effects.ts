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
import { DataService } from '../../../http/data.service';
import {
  getEdm,
  getEdmFailure,
  getEdmId,
  getEdmSuccess,
  setInterval,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/edm-monitor/models';
import { getInterval, getSensorId } from '../../selectors';

@Injectable()
export class EdmMonitorEffects {
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
            currentRoute &&
            currentRoute === BearingRoutePath.ConditionMonitoringPath
        ),
        tap(
          () => this.store.dispatch(getEdmId()) // will later be dispatched once sensor ids are there
        )
      ),
    { dispatch: false }
  );

  /**
   * Set Interval
   */
  interval$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setInterval.type),
        tap(() => this.store.dispatch(getEdmId()))
      ),
    { dispatch: false }
  );

  /**
   * Load Edm ID
   */
  edmId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getEdmId.type),
        withLatestFrom(this.store.pipe(select(getSensorId))),
        map(([_action, sensorId]) => sensorId),
        tap((sensorId) => {
          this.store.dispatch(getEdm({ sensorId }));
        })
      ),
    { dispatch: false }
  );

  /**
   * Load EDM
   */
  edm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getEdm.type),
      withLatestFrom(this.store.pipe(select(getInterval))),
      map(([action, interval]: [any, Interval]) => ({
        id: action.sensorId,
        ...interval,
      })),
      mergeMap((edmParams) =>
        this.dataService.getEdm(edmParams).pipe(
          map((measurements) => getEdmSuccess({ measurements })),
          catchError((_e) => of(getEdmFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
