import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { loginSuccess } from '@schaeffler/auth';

import { InitialFiltersResponse } from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions';

@Injectable()
export class FilterEffects {
  loadInitialFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInitialFilters),
      mergeMap(() =>
        this.employeeService.getInitialFilters().pipe(
          map((filters: InitialFiltersResponse) =>
            loadInitialFiltersSuccess({ filters })
          ),
          catchError((error) =>
            of(loadInitialFiltersFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  loginSuccessful$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess.type),
      take(1),
      map(loadInitialFilters)
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService
  ) {}
}
