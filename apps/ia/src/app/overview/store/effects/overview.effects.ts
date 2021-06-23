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
import { Action, Store } from '@ngrx/store';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  FluctuationRatesChartData,
  TimePeriod,
} from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';
import { EmployeeService } from '../../../shared/services/employee.service';
import { ResignedEmployee } from '../../models';
import { OverviewService } from '../../overview.service';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadUnforcedFluctuationRatesChartData,
  loadUnforcedFluctuationRatesChartDataFailure,
  loadUnforcedFluctuationRatesChartDataSuccess,
} from '../actions/overview.action';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class OverviewEffects implements OnInitEffects {
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      withLatestFrom(this.store.select(getCurrentFiltersAndTime)),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadAttritionOverTimeOverview({ request }),
        loadFluctuationRatesOverview({ request }),
        loadFluctuationRatesChartData({ request }),
        loadUnforcedFluctuationRatesChartData({ request }),
        loadResignedEmployees({ orgUnit: request.orgUnit }),
      ])
    )
  );

  loadAttritionOverTimeOverview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAttritionOverTimeOverview),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService
          .getAttritionOverTime(request, TimePeriod.LAST_THREE_YEARS)
          .pipe(
            map((data: AttritionOverTime) =>
              loadAttritionOverTimeOverviewSuccess({ data })
            ),
            catchError((error) =>
              of(
                loadAttritionOverTimeOverviewFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    )
  );

  loadOverviewFluctuationRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFluctuationRatesOverview),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getOverviewFluctuationRates(request).pipe(
          map((data: OverviewFluctuationRates) =>
            loadFluctuationRatesOverviewSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadFluctuationRatesOverviewFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadFluctuationRatesChartData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFluctuationRatesChartData),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getFluctuationRateChartData(request).pipe(
          map((data: FluctuationRatesChartData) =>
            loadFluctuationRatesChartDataSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadFluctuationRatesChartDataFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadUnforcedFluctuationRatesChartData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUnforcedFluctuationRatesChartData),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getUnforcedFluctuationRateChartData(request).pipe(
          map((data: FluctuationRatesChartData) =>
            loadUnforcedFluctuationRatesChartDataSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadUnforcedFluctuationRatesChartDataFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadResignedEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadResignedEmployees),
      map((action) => action.orgUnit),
      mergeMap((orgUnit: string) =>
        this.overviewService.getResignedEmployees(orgUnit).pipe(
          map((data: ResignedEmployee[]) =>
            loadResignedEmployeesSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadResignedEmployeesFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly overviewService: OverviewService,
    private readonly store: Store
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
