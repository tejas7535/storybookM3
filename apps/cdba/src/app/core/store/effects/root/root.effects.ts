/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';

import { map, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { loginSuccess } from '@schaeffler/azure-auth';

@Injectable()
export class RootEffects {
  public initializeApplicationInsights$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess),
        map((action) => action.accountInfo),
        tap((accountInfo) => {
          this.trackDepartment(accountInfo.department);
        })
      );
    },
    {
      dispatch: false,
    }
  );

  private readonly APPLICATION_INSIGHTS_DEPARTMENT = 'department';

  private trackDepartment(department: string) {
    this.applicationInsightsService.addCustomPropertyToTelemetryData(
      this.APPLICATION_INSIGHTS_DEPARTMENT,
      department || 'Department unavailable'
    );
  }

  public constructor(
    private readonly actions$: Actions,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}
}
