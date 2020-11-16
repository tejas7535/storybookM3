import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { loginSuccess } from '@schaeffler/auth';

import {
  Employee,
  EmployeesRequest,
  InitialFiltersResponse,
} from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  filterSelected,
  loadEmployees,
  loadEmployeesFailure,
  loadEmployeesSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timeRangeSelected,
} from '../../actions';
import { EmployeeState } from '../../reducers/employee/employee.reducer';
import { getCurrentFiltersAndTime } from '../../selectors';

@Injectable()
export class EmployeeEffects {
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

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected),
      withLatestFrom(this.store.pipe(select(getCurrentFiltersAndTime))),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      map((request: EmployeesRequest) => loadEmployees({ request }))
    )
  );

  // TODO: when having another chart with different employees -> rename to loadOrgChart and adapt store
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEmployees),
      map((action: any) => action.request),
      map((request) => {
        // remove region/subregion/country/hrlocation if available
        const { orgUnit, timeRange } = request;

        return ({ orgUnit, timeRange } as unknown) as EmployeesRequest;
      }),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getEmployees(request).pipe(
          map((employees: Employee[]) => loadEmployeesSuccess({ employees })),
          catchError((error) =>
            of(loadEmployeesFailure({ errorMessage: error.message }))
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
    private readonly employeeService: EmployeeService,
    private readonly store: Store<EmployeeState>
  ) {}
}
