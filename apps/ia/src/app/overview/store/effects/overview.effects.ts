import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { OverviewState } from '..';
import { filterSelected, timeRangeSelected } from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest } from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/overview.action';

@Injectable()
export class OverviewEffects {
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected),
      withLatestFrom(this.store.pipe(select(getCurrentFiltersAndTime))),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadOrgChart({ request }),
        loadWorldMap({ request }),
      ])
    )
  );

  loadOrgChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrgChart),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getOrgChart(request).pipe(
          map((employees: OrgChartEmployee[]) =>
            loadOrgChartSuccess({ employees })
          ),
          catchError((error) =>
            of(loadOrgChartFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  loadWorldMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWorldMap),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getWorldMap(request).pipe(
          map((data: CountryData[]) => loadWorldMapSuccess({ data })),
          catchError((error) =>
            of(loadWorldMapFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly store: Store<OverviewState>
  ) {}
}
