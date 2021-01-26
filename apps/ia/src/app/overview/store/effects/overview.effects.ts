import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { OverviewState } from '..';
import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  FilterKey,
  SelectedFilter,
} from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadAttritionOverTime,
  loadAttritionOverTimeFailure,
  loadAttritionOverTimeSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/overview.action';

@Injectable()
export class OverviewEffects implements OnInitEffects {
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      withLatestFrom(this.store.pipe(select(getCurrentFiltersAndTime))),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadAttritionOverTime({ request }),
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

  loadParent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadParent),
      map((action) => action.employee.employeeId),
      mergeMap((childEmployeeId: string) =>
        this.employeeService.getParentEmployee(childEmployeeId).pipe(
          map((employee: OrgChartEmployee) => loadParentSuccess({ employee })),
          catchError((error) =>
            of(loadParentFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  loadParentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadParentSuccess),
      map((action) => ({
        name: FilterKey.ORG_UNIT,
        value: action.employee.orgUnit,
      })),
      map((selectedFilter: SelectedFilter) =>
        filterSelected({ filter: selectedFilter })
      )
    )
  );

  loadAttritionOverTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAttritionOverTime),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getAttritionOverTime(request).pipe(
          map((data: AttritionOverTime) =>
            loadAttritionOverTimeSuccess({ data })
          ),
          catchError((error) =>
            of(loadAttritionOverTimeFailure({ errorMessage: error.message }))
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

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
