import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import { filterSelected } from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import { OrganizationalViewService } from '../../../organizational-view/organizational-view.service';
import {
  AttritionOverTime,
  EmployeesRequest,
  TimePeriod,
} from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewExitEntryEmployeesResponse,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
} from '../../models';
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
  loadOpenApplications,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewData,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
} from '../actions/overview.action';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class OverviewEffects {
  readonly OVERVIEW_URL = `/${AppRoutePath.OverviewPath}`;

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, routerNavigationAction),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(([_action, router]) => router.state.url === this.OVERVIEW_URL),
      map(() => loadOverviewData())
    )
  );

  loadOverviewData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOverviewData),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      filter(
        (request) =>
          !!(request.filterDimension && request.value && request.timeRange)
      ),
      mergeMap((request: EmployeesRequest) => [
        loadAttritionOverTimeOverview({ request }),
        loadFluctuationRatesOverview({ request }),
        loadFluctuationRatesChartData({ request }),
        loadResignedEmployees({ request }),
        loadOpenApplications({ orgUnit: request.value }),
      ])
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

  loadOverviewFluctuationRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFluctuationRatesOverview),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService.getOverviewFluctuationRates(request).pipe(
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

  loadResignedEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadResignedEmployees),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.overviewService
          .getResignedEmployees(request.filterDimension, request.value)
          .pipe(
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
      map((action) => action.orgUnit),
      switchMap((orgUnit: string) =>
        this.overviewService.getOpenApplications(orgUnit).pipe(
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
          map((data: OverviewExitEntryEmployeesResponse) =>
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
          map((data: OverviewExitEntryEmployeesResponse) =>
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

  constructor(
    private readonly actions$: Actions,
    private readonly overviewService: OverviewService,
    private readonly organizationalViewService: OrganizationalViewService,
    private readonly store: Store
  ) {}
}
