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
  getGreaseStatusId,
  getLoad,
  getLoadFailure,
  getLoadId,
  getLoadSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class ConditionMonitoringEffects {
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
        tap((currentRoute) => {
          this.store.dispatch(getGreaseStatusId({ source: currentRoute }));
          this.store.dispatch(getLoadId());
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Load ID
   */
  loadId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLoadId.type),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) => routerState.state.params.id),
      map((bearingId) => getLoad({ bearingId }))
    )
  );

  /**
   * Load Load
   */
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLoad.type),
      map((action: any) => action.bearingId),
      mergeMap((bearingId) =>
        this.restService.getLoad(bearingId).pipe(
          map(({ id, body }) => getLoadSuccess({ id, body })),
          catchError((_e) => of(getLoadFailure()))
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
