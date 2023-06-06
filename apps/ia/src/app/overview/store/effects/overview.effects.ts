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
  getSelectedBenchmarkValueShort,
} from '../../../core/store/selectors';
import { OrganizationalViewService } from '../../../organizational-view/organizational-view.service';
import {
  AttritionOverTime,
  EmployeesRequest,
  TimePeriod,
} from '../../../shared/models';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  FluctuationRatesChartData,
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
      concatLatestFrom(() => this.store.select(getSelectedBenchmarkValueShort)),
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
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService
          .getAttritionOverTime(
            request.filterDimension,
            request.value,
            TimePeriod.LAST_THREE_YEARS
          )
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
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getFluctuationRateChartData(request).pipe(
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

  loadBenchmarkFluctuationRatesChartData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBenchmarkFluctuationRatesChartData),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getFluctuationRateChartData(request).pipe(
          map((data: FluctuationRatesChartData) =>
            loadBenchmarkFluctuationRatesChartDataSuccess({ data })
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
          } as EmployeesRequest)
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
    private readonly organizationalViewService: OrganizationalViewService,
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
