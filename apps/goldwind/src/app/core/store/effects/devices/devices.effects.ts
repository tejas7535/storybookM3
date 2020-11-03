import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getDevices,
  getDevicesFailure,
  getDevicesSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';

@Injectable()
export class DevicesEffects {
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
            currentRoute && currentRoute === AppRoutePath.OverviewPath
        ),
        tap(() => this.store.dispatch(getDevices()))
      ),
    { dispatch: false }
  );

  /**
   * Load Devices
   */
  devices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDevices.type),
      mergeMap(() =>
        this.restService.getDevices().pipe(
          map((devices) => getDevicesSuccess({ devices })),
          catchError((_e) => of(getDevicesFailure()))
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
