import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  pairwise,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  getBearing,
  getBearingFailure,
  getBearingId,
  getBearingSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { RestService } from '../../../http/rest.service';

@Injectable()
export class BearingEffects {
  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values(AppRoutePath).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter(
        (currentRoute: string) =>
          currentRoute && currentRoute === AppRoutePath.BearingPath
      ),
      map(() => getBearingId())
    );
  });

  /**
   * Load Bearing ID
   */
  bearingId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getBearingId),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) => routerState.state.params.id),
      startWith('0'),
      pairwise(),
      filter(([prevId, currentId]) => prevId !== currentId),
      map(([_prevId, currentId]) => getBearing({ bearingId: currentId }))
    );
  });

  /**
   * Load Bearing
   */
  bearing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getBearing),
      map((action: any) => action.bearingId),
      mergeMap((bearingId) =>
        this.restService.getBearing(bearingId).pipe(
          map((bearing) => getBearingSuccess({ bearing })),
          catchError((_e) => of(getBearingFailure()))
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
