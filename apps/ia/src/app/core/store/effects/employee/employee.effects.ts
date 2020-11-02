import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { InitialFiltersResponse } from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions';

@Injectable()
export class EmployeeEffects implements OnInitEffects {
  /**
   * Receive initial filters
   */
  loadInitialFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInitialFilters.type),
      mergeMap(() =>
        this.employeeService.getInitialFilters().pipe(
          map((filters: InitialFiltersResponse) =>
            loadInitialFiltersSuccess({ filters })
          ),
          catchError((error) =>
            of(loadInitialFiltersFailure({ errorMessage: error.error.message }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService
  ) {}

  /**
   * Load initial filters initially
   */
  ngrxOnInitEffects(): Action {
    return loadInitialFilters();
  }
}
