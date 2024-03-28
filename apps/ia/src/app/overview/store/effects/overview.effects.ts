/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import {
  benchmarkFilterSelected,
  filterSelected,
} from '../../../core/store/actions';
import {
  getCurrentBenchmarkFilters,
  getCurrentDimensionValue,
  getCurrentFilters,
  getLast6MonthsTimeRange,
  getSelectedBenchmarkValue,
  getTimeRangeForAllAvailableData,
} from '../../../core/store/selectors';
import { DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS } from '../../../shared/constants';
import {
  EmployeesRequest,
  MonthlyFluctuation,
  MonthlyFluctuationOverTime,
} from '../../../shared/models';
import { SharedService } from '../../../shared/shared.service';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
  ResignedEmployeesResponse,
} from '../../models';
import { OverviewService } from '../../overview.service';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadBenchmarkFluctuationRates,
  loadBenchmarkFluctuationRatesChartData,
  loadBenchmarkFluctuationRatesChartDataFailure,
  loadBenchmarkFluctuationRatesChartDataSuccess,
  loadBenchmarkFluctuationRatesFailure,
  loadBenchmarkFluctuationRatesSuccess,
  loadFluctuationRates,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesFailure,
  loadFluctuationRatesSuccess,
  loadOpenApplications,
  loadOpenApplicationsCount,
  loadOpenApplicationsCountFailure,
  loadOpenApplicationsCountSuccess,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewBenchmarkData,
  loadOverviewDimensionData,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadWorkforceBalanceMeta,
  loadWorkforceBalanceMetaFailure,
  loadWorkforceBalanceMetaSuccess,
} from '../actions/overview.action';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class OverviewEffects {
  readonly OVERVIEW_URL = `/${AppRoutePath.OverviewPath}`;

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, routerNavigationAction, updateUserSettingsSuccess),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(([_action, router]) => router.state.url === this.OVERVIEW_URL),
      mergeMap(() => [loadOverviewDimensionData()])
    )
  );

  benchmarkFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(benchmarkFilterSelected, routerNavigationAction),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(([_action, router]) => router.state.url === this.OVERVIEW_URL),
      map(() => loadOverviewBenchmarkData())
    )
  );

  loadOverviewDimensionData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOverviewDimensionData),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      filter(
        (request: EmployeesRequest) =>
          !!(request.filterDimension && request.value)
      ),
      mergeMap((request: EmployeesRequest) => [
        loadFluctuationRates({
          request,
        }),
        loadAttritionOverTimeOverview({
          request,
        }),
        loadWorkforceBalanceMeta({ request }),
        loadFluctuationRatesChartData({
          request,
        }),
        loadResignedEmployees(),
        loadOpenApplicationsCount({
          request,
        }),
      ])
    )
  );

  loadOverviewBenchmarkData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOverviewBenchmarkData),
      concatLatestFrom(() => this.store.select(getCurrentBenchmarkFilters)),
      map(([_action, request]) => request),
      filter(
        (request: EmployeesRequest) =>
          !!(request.filterDimension && request.value)
      ),
      mergeMap((request: EmployeesRequest) => [
        loadBenchmarkFluctuationRates({ request }),
        loadBenchmarkFluctuationRatesChartData({
          request,
        }),
      ])
    )
  );

  // clear dimension's data when user changed the dimension during the loading
  clearDimensionDataOnDimensionChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadFluctuationRatesSuccess,
        loadAttritionOverTimeOverviewSuccess,
        loadWorkforceBalanceMetaSuccess,
        loadFluctuationRatesChartDataSuccess,
        loadResignedEmployeesSuccess,
        loadOpenApplicationsCountSuccess
      ),
      concatLatestFrom(() => this.store.select(getCurrentDimensionValue)),
      filter(([_action, dimensionFilter]) => !dimensionFilter),
      map(() => clearOverviewDimensionData())
    )
  );

  // clear benchmark's data when user changed the dimension during the loading
  clearBenchmarkDataOnBenchmarkChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadBenchmarkFluctuationRatesChartDataSuccess,
        loadBenchmarkFluctuationRatesSuccess
      ),
      concatLatestFrom(() => this.store.select(getSelectedBenchmarkValue)),
      filter(([_action, dimensionFilter]) => !dimensionFilter),
      map(() => clearOverviewBenchmarkData())
    )
  );

  loadFluctuationRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFluctuationRates),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getFluctuationRates(request).pipe(
          map((data: FluctuationRate) => loadFluctuationRatesSuccess({ data })),
          catchError((error) =>
            of(
              loadFluctuationRatesFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadBenchmarkFluctuationRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBenchmarkFluctuationRates),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getFluctuationRates(request).pipe(
          map((data: FluctuationRate) =>
            loadBenchmarkFluctuationRatesSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadBenchmarkFluctuationRatesFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadAttritionOverTimeOverview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAttritionOverTimeOverview),
      concatLatestFrom(() =>
        this.store.select(getTimeRangeForAllAvailableData)
      ),
      map(([action, timeRange]) => ({
        ...action.request,
        timeRange,
        type: [MonthlyFluctuationOverTime.UNFORCED_LEAVERS],
      })),
      switchMap((request: EmployeesRequest) =>
        this.sharedService.getFluctuationRateChartData(request).pipe(
          map((monthlyFluctuation: MonthlyFluctuation) =>
            loadAttritionOverTimeOverviewSuccess({ monthlyFluctuation })
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

  loadWorkforceBalanceMeta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWorkforceBalanceMeta),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getOverviewWorkforceBalanceMeta(request).pipe(
          map((data: OverviewWorkforceBalanceMeta) =>
            loadWorkforceBalanceMetaSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadWorkforceBalanceMetaFailure({
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
      concatLatestFrom(() => this.store.select(getLast6MonthsTimeRange)),
      map(([action, timeRange]) => ({
        ...action.request,
        timeRange,
        type: [
          MonthlyFluctuationOverTime.FLUCTUATION_RATES,
          MonthlyFluctuationOverTime.UNFORCED_FLUCTUATION_RATES,
        ],
      })),
      switchMap((request: EmployeesRequest) =>
        this.sharedService.getFluctuationRateChartData(request).pipe(
          map((monthlyFluctuation: MonthlyFluctuation) =>
            loadFluctuationRatesChartDataSuccess({ monthlyFluctuation })
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

  loadBenchmarkFluctuationRatesChartData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBenchmarkFluctuationRatesChartData),
      concatLatestFrom(() => this.store.select(getLast6MonthsTimeRange)),
      map(([action, timeRange]) => ({
        ...action.request,
        timeRange,
        type: [
          MonthlyFluctuationOverTime.FLUCTUATION_RATES,
          MonthlyFluctuationOverTime.UNFORCED_FLUCTUATION_RATES,
        ],
      })),
      switchMap((request: EmployeesRequest) =>
        this.sharedService.getFluctuationRateChartData(request).pipe(
          map((monthlyFluctuation: MonthlyFluctuation) =>
            loadBenchmarkFluctuationRatesChartDataSuccess({
              monthlyFluctuation,
            })
          ),
          catchError((error) =>
            of(
              loadBenchmarkFluctuationRatesChartDataFailure({
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
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(
        ([_action, request]) =>
          ({
            filterDimension: request.filterDimension,
            value: request.value,
          }) as EmployeesRequest
      ),
      mergeMap((request: EmployeesRequest) =>
        this.overviewService.getResignedEmployees(request).pipe(
          map((data: ResignedEmployeesResponse) =>
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

  loadOpenApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOpenApplications),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      switchMap(([_action, request]) =>
        this.overviewService.getOpenApplications(request).pipe(
          map((data: OpenApplication[]) =>
            loadOpenApplicationsSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadOpenApplicationsFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadOverviewExitEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOverviewExitEmployees),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getOverviewExitEmployees(request).pipe(
          map((data: ExitEntryEmployeesResponse) =>
            loadOverviewExitEmployeesSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadOverviewExitEmployeesFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadOverviewEntryEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOverviewEntryEmployees),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getOverviewEntryEmployees(request).pipe(
          map((data: ExitEntryEmployeesResponse) =>
            loadOverviewEntryEmployeesSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadOverviewEntryEmployeesFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadOpenApplicationsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOpenApplicationsCount),
      map((action) => action.request),
      filter(
        (request) =>
          !DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS.includes(
            request.filterDimension
          )
      ),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getOpenApplicationsCount(request).pipe(
          map((openApplicationsCount) =>
            loadOpenApplicationsCountSuccess({ openApplicationsCount })
          ),
          catchError((error) =>
            of(
              loadOpenApplicationsCountFailure({ errorMessage: error.message })
            )
          )
        )
      )
    );
  });

  loadAttritionOverTimeEmployees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAttritionOverTimeEmployees),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(
        ([action, request]) =>
          new EmployeesRequest(
            request.filterDimension,
            request.value,
            action.timeRange
          )
      ),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getAttritionOverTimeEmployees(request).pipe(
          map((data: ExitEntryEmployeesResponse) =>
            loadAttritionOverTimeEmployeesSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadAttritionOverTimeEmployeesFailure({
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
    private readonly overviewService: OverviewService,
    private readonly sharedService: SharedService,
    private readonly store: Store
  ) {}

  areRquiredFieldsDefined(requests: EmployeesRequests): boolean {
    return !!(
      requests.selectedFilterRequest.filterDimension &&
      requests.selectedFilterRequest.value &&
      requests.selectedFilterRequest.timeRange &&
      requests.benchmarkRequest.filterDimension &&
      requests.benchmarkRequest.value &&
      requests.benchmarkRequest.timeRange
    );
  }
}

export interface EmployeesRequests {
  selectedFilterRequest: EmployeesRequest;
  benchmarkRequest: EmployeesRequest;
}
