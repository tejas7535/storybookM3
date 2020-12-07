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
  changeShowAreaFiltersSetting,
  filterSelected,
  timeRangeSelected,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest } from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import { ChartType } from '../../models/chart-type.enum';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  chartTypeSelected,
  initOverview,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/overview.action';
import { getSelectedChartType } from '../selectors/overview.selector';

@Injectable()
export class OverviewEffects implements OnInitEffects {
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
      map((action) => {
        // TODO: remove this part when area filters are completely removed
        // remove region/subregion/country/hrlocation if available
        const { orgUnit, timeRange } = action.request;

        return ({ orgUnit, timeRange } as unknown) as EmployeesRequest;
      }),
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

  changeChartType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chartTypeSelected),
      map((action) => action.chartType),
      map((chartType: ChartType) =>
        OverviewEffects.handleShowAreaFilter(chartType)
      )
    )
  );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initOverview),
      withLatestFrom(this.store.pipe(select(getSelectedChartType))),
      map(([_action, chartType]) => chartType),
      map((chartType: ChartType) =>
        OverviewEffects.handleShowAreaFilter(chartType)
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly store: Store<OverviewState>
  ) {}

  public static handleShowAreaFilter(chartType: ChartType): Action {
    const show = chartType === ChartType.WORLD_MAP;

    return changeShowAreaFiltersSetting({ show });
  }

  ngrxOnInitEffects(): Action {
    return initOverview();
  }
}
