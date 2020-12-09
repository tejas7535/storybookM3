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
  getData,
  getDataFailure,
  getDataId,
  getDataSuccess,
  setDataInterval,
} from '../../actions/data-view/data-view.actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getDataInterval, getDeviceId } from '../../selectors';

@Injectable()
export class DataViewEffects {
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
            currentRoute && currentRoute === BearingRoutePath.DataViewPath
        ),
        tap(
          () => this.store.dispatch(getDataId()) // will later be dispatched once sensor ids are there
        )
      ),
    { dispatch: false }
  );

  /**
   * Set Interval
   */
  interval$ = createEffect(() =>
    this.actions$.pipe(ofType(setDataInterval), map(getDataId))
  );

  /**
   * Load Data ID
   */
  dataId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDataId),
      withLatestFrom(this.store.pipe(select(getDeviceId))),
      map(([_action, deviceId]) => deviceId),
      map((deviceId) => getData({ deviceId }))
    )
  );

  /**
   * Load Data
   */
  data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getData),
      withLatestFrom(this.store.pipe(select(getDataInterval))),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((dataPrams) =>
        this.restService.getData(dataPrams).pipe(
          map((result) => getDataSuccess({ result })),
          catchError((_e) => of(getDataFailure()))
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
