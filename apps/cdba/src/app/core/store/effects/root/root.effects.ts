import { Injectable } from '@angular/core';

import { map, take, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { loginSuccess } from '@schaeffler/azure-auth';

@Injectable()
export class RootEffects {
  initializeApplicationInsights$ = createEffect(
    () =>
      // eslint-disable-next-line ngrx/prefer-effect-callback-in-block-statement
      this.actions$.pipe(
        ofType(loginSuccess),
        take(1),
        map((action) => action.accountInfo.department),
        map((department) => department || 'Department unavailable'),
        tap((department) =>
          this.applicationInsightsService.addCustomPropertyToTelemetryData(
            this.APPLICATION_INSIGHTS_DEPARTMENT,
            department
          )
        )
      ),
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
