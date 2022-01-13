import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, filter, map, mergeMap, tap } from 'rxjs';
import {
  getLoadDistributionLatest,
  getLoadDistributionLatestFailure,
  getLoadDistributionLatestSuccess,
  stopLoadDistributionGet,
} from '../..';
import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { LiveAPIService } from '../../../http/liveapi.service';

@Injectable()
export class LoadDistributionEffects {
  loadDistributionLatest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoadDistributionLatest),
      tap((action) => (this.currentDeviceId = action.deviceId)),
      tap(() => (this.isPollingActive = true)),
      map((action) => action.deviceId),
      mergeMap((params) =>
        this.liveAPIService.getLoadDistribution(params).pipe(
          map((data) =>
            getLoadDistributionLatestSuccess({
              row1: data.row1,
              row2: data.row2,
              lsp: data.lsps,
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
    private readonly liveAPIService: LiveAPIService
  ) {}
}
