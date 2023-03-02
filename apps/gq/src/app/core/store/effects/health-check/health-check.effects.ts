import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { createEffect, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { HealthCheckService } from '../../../../shared/services/rest-services/health-check-service/health-check.service';
import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from '../../actions';

@Injectable()
export class HealthCheckEffects implements OnInitEffects {
  healthCheck$ = createEffect(() => {
    return this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      mergeMap(() =>
        this.healthCheckService.pingHealthCheck().pipe(
          map(() => pingHealthCheckSuccess()),
          catchError((errorMessage) => of(pingHealthCheckFailure(errorMessage)))
        )
      )
    );
  });

  constructor(
    private readonly msalBroadcastService: MsalBroadcastService,
    private readonly healthCheckService: HealthCheckService
  ) {}

  ngrxOnInitEffects(): Action {
    return pingHealthCheck();
  }
}
