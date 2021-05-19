/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';

import { map, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { loginSuccess } from '@schaeffler/azure-auth';

@Injectable()
export class RootEffects {
  initializeApplicationInsights$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess),
        map((action) => action.accountInfo.department),
        map((department) => department || 'Department unavailable'),
        tap((department) =>
          this.applicationInsightsService.addCustomPropertyToTelemetryData(
            this.APPLICATION_INSIGHTS_DEPARTMENT,
            department
          )
        )
      );
    },
    {
      dispatch: false,
    }
  );

  private readonly APPLICATION_INSIGHTS_DEPARTMENT = 'department';

  constructor(
    private readonly actions$: Actions,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}
}
