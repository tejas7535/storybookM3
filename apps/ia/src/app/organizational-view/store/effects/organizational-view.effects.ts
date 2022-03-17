import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  Employee,
  EmployeesRequest,
  FilterKey,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { OrganizationalViewService } from '../../organizational-view.service';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/organizational-view.action';

@Injectable()
export class OrganizationalViewEffects implements OnInitEffects {
  filterChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      concatLatestFrom(() => this.store.select(getCurrentFiltersAndTime)),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadOrgChart({ request }),
        loadWorldMap({ request }),
        loadAttritionOverTimeOrgChart({ request }),
      ])
    );
  });

  loadOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgChart),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService.getOrgChart(request).pipe(
          map((employees: Employee[]) => loadOrgChartSuccess({ employees })),
          catchError((error) =>
            of(loadOrgChartFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  loadWorldMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadWorldMap),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService.getWorldMap(request).pipe(
          map((data: CountryData[]) => loadWorldMapSuccess({ data })),
          catchError((error) =>
            of(loadWorldMapFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  loadParent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadParent),
      map((action) => action.employee),
      switchMap((childEmployee: Employee) =>
        this.organizationalViewService
          .getParentEmployee(childEmployee.employeeId, childEmployee.reportDate)
          .pipe(
            map((employee: Employee) => loadParentSuccess({ employee })),
            catchError((error) =>
              of(loadParentFailure({ errorMessage: error.message }))
            )
          )
      )
    );
  });

  loadParentSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadParentSuccess),
      map((action) => ({
        name: FilterKey.ORG_UNIT,
        id: action.employee.orgUnit,
      })),
      map((selectedFilter: SelectedFilter) =>
        filterSelected({ filter: selectedFilter })
      )
    );
  });

  loadAttritionOverTimeOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAttritionOverTimeOrgChart),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService
          .getAttritionOverTime(request, TimePeriod.PLUS_MINUS_THREE_MONTHS)
          .pipe(
            map((data: AttritionOverTime) =>
              loadAttritionOverTimeOrgChartSuccess({ data })
            ),
            catchError((error) =>
              of(
                loadAttritionOverTimeOrgChartFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly organizationalViewService: OrganizationalViewService,
    private readonly store: Store
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
