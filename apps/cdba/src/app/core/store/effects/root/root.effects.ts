import { Injectable } from '@angular/core';

import { map, take, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { loginSuccess } from '@schaeffler/auth';

@Injectable()
export class RootEffects {
  private readonly APPLICATION_INSIGHTS_DEPARTMENT = 'department';

  initializeApplicationInsights$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess.type),
        take(1),
        map((action: any) => action.user.department),
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

  constructor(
    private readonly actions$: Actions,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}
}
