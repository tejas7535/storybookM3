import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

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
import { getDataInterval } from '../../selectors';

@Injectable()
export class DataViewEffects {
  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values(BearingRoutePath).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter(
        (currentRoute: string) =>
          currentRoute && currentRoute === BearingRoutePath.DataViewPath
      ),
      map(
        () => getDataId() // will later be dispatched once sensor ids are there
      )
    );
  });

  /**
   * Set Interval
   */
  interval$ = createEffect(() => {
    return this.actions$.pipe(ofType(setDataInterval), map(getDataId));
  });

  /**
   * Load Data ID
   */
  dataId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDataId),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) =>
        getData({ deviceId: routerState.state.params.id })
      )
    );
  });

  /**
   * Load Data
   */
  data$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getData),
      withLatestFrom(this.store.select(getDataInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        start: interval.startDate,
        end: interval.endDate,
      })),
      mergeMap((dataPrams) =>
        this.restService.getData(dataPrams).pipe(
          map((result) => getDataSuccess({ result })),
          catchError((_e) => of(getDataFailure()))
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
