import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { HealthCheckService } from '@gq/shared/services/rest/health-check/health-check.service';
import { createEffect, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { HealthCheckActions } from './health-check.actions';

@Injectable()
export class HealthCheckEffects implements OnInitEffects {
  healthCheck$ = createEffect(() => {
    return this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      mergeMap(() =>
        this.healthCheckService.pingHealthCheck().pipe(
          map(() => HealthCheckActions.pingHealthCheckSuccess()),
          catchError((error) =>
            of(HealthCheckActions.pingHealthCheckFailure(error))
          )
        )
      )
    );
  });

  constructor(
    private readonly msalBroadcastService: MsalBroadcastService,
    private readonly healthCheckService: HealthCheckService
  ) {}

  ngrxOnInitEffects(): Action {
    return HealthCheckActions.pingHealthCheck();
  }
}
