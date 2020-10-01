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

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DataService } from '../../../http/data.service';
import {
  getBearing,
  getBearingFailure,
  getBearingId,
  getBearingSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class BearingEffects {
  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values(AppRoutePath)
            .filter((route: string) => route !== '' && url.includes(route))
            .shift()
        ),
        filter(
          (currentRoute: string) =>
            currentRoute && currentRoute === AppRoutePath.BearingPath
        ),
        tap(() => this.store.dispatch(getBearingId()))
      ),
    { dispatch: false }
  );

  /**
   * Load Bearing ID
   */
  bearingId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBearingId.type),
      withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
      map(([_action, routerState]) => routerState.state.params.id),
      map((bearingId) => getBearing({ bearingId }))
    )
  );

  /**
   * Load Bearing
   */
  bearing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBearing.type),
      map((action: any) => action.bearingId),
      mergeMap((bearingId) =>
        this.dataService.getBearing(bearingId).pipe(
          map((bearing) => getBearingSuccess({ bearing })),
          catchError((_e) => of(getBearingFailure()))
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
