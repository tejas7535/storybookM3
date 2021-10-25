import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, filter, forkJoin, map, mergeMap, tap } from 'rxjs';
import {
  getLoadDistributionLatest,
  getLoadDistributionLatestFailure,
  getLoadDistributionLatestSuccess,
  stopLoadDistributionGet,
} from '../..';
import { UPDATE_SETTINGS } from '../../../../shared/constants';

import { RestService } from '../../../http/rest.service';

@Injectable()
export class LoadDistributionEffects {
  loadDistributionLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoadDistributionLatest),
      tap((action) => (this.currentDeviceId = action.deviceId)),
      tap(() => (this.isPollingActive = true)),
      map((action: any) => ({
        deviceId: action.deviceId,
      })),
      mergeMap(({ deviceId }) =>
        forkJoin([
          this.restService.getLoadDistribution(deviceId, 1),
          this.restService.getLoadDistribution(deviceId, 2),
          this.restService.getBearingLoadLatest(deviceId),
        ]).pipe(
          map(([result, result2, _result3]) =>
            getLoadDistributionLatestSuccess({
              row1: result.shift(),
              row2: result2.shift(),
              lsp: _result3.shift(),
            })
          )
        )
      )
    );
  });

  pollingLoadDistribution$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        getLoadDistributionLatestSuccess,
        getLoadDistributionLatestFailure
      ),
      delay(UPDATE_SETTINGS.loaddistribution.refresh * 1000),
      filter(() => this.isPollingActive),
      map(() => getLoadDistributionLatest({ deviceId: this.currentDeviceId }))
    );
  });

  stopPolling$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(stopLoadDistributionGet),
        map(() => (this.isPollingActive = false))
      );
    },
    { dispatch: false }
  );

  isPollingActive = false;
  currentDeviceId: string;

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService
  ) {}
}
