import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { HealthCheckService } from '../../../../shared/services/rest-services/health-check-service/health-check.service';
import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from '../../actions/health-check/health-check.actions';

@Injectable()
export class HealthCheckEffects implements OnInitEffects {
  healthCheck$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(pingHealthCheck.type),
      mergeMap(() =>
        this.healthCheckService.pingHealthCheck().pipe(
          map(() => pingHealthCheckSuccess()),
          catchError((errorMessage) => of(pingHealthCheckFailure(errorMessage)))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly healthCheckService: HealthCheckService
  ) {}

  ngrxOnInitEffects(): Action {
    return pingHealthCheck();
  }
}
