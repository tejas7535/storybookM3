import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getDevices,
  getDevicesFailure,
  getDevicesSuccess,
} from '../../actions';

@Injectable()
export class DevicesEffects {
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
          currentRoute && currentRoute === AppRoutePath.OverviewPath
      ),
      map(() => getDevices())
    );
  });

  /**
   * Load Devices
   */
  devices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDevices),
      mergeMap(() =>
        this.restService.getDevices().pipe(
          map((devices) => getDevicesSuccess({ devices })),
          catchError((_e) => of(getDevicesFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService
  ) {}
}
