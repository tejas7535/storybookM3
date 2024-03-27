import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import {
  filterSelected,
  loadFilterDimensionData,
} from '../../../core/store/actions';
import {
  getCurrentDimensionValue,
  getCurrentFilters,
  getLast6MonthsTimeRange,
  getSelectedDimension,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import {
  EmployeesRequest,
  MonthlyFluctuation,
  MonthlyFluctuationOverTime,
} from '../../../shared/models';
import { SharedService } from '../../../shared/shared.service';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import { DimensionFluctuationData } from '../../models';
import {
  DimensionParentResponse,
  OrgChartEmployee,
} from '../../org-chart/models';
import { OrganizationalViewService } from '../../organizational-view.service';
import { CountryDataAttrition } from '../../world-map/models/country-data-attrition.model';
import {
  loadChildAttritionOverTimeForWorldMap,
  loadChildAttritionOverTimeOrgChart,
  loadChildAttritionOverTimeOrgChartFailure,
  loadChildAttritionOverTimeOrgChartSuccess,
  loadOrganizationalViewData,
  loadOrgChart,
  loadOrgChartEmployees,
  loadOrgChartEmployeesFailure,
  loadOrgChartEmployeesSuccess,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentAttritionOverTimeOrgChart,
  loadParentAttritionOverTimeOrgChartFailure,
  loadParentAttritionOverTimeOrgChartSuccess,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/organizational-view.action';
import { getDimensionKeyForWorldMap } from '../selectors/organizational-view.selector';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class OrganizationalViewEffects {
  readonly ORGANIZATIONAL_VIEW_URL = `/${AppRoutePath.DrillDownPath}`;

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, routerNavigationAction, updateUserSettingsSuccess),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(
        ([_action, router]) => router.state.url === this.ORGANIZATIONAL_VIEW_URL
      ),
      map(() => loadOrganizationalViewData())
    )
  );

  loadOrganizationalViewData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrganizationalViewData),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      filter(
        (request: EmployeesRequest) =>
          !!(request.filterDimension && request.value && request.timeRange)
      ),
      concatLatestFrom(() => [this.store.select(getCurrentDimensionValue)]),
      map(([request, dimensionName]) => ({
        request,
        dimensionName,
      })),
      mergeMap((requestWithDimensionName) => [
        loadOrgChart({
          request: requestWithDimensionName.request,
        }),
        loadWorldMap({ request: requestWithDimensionName.request }),
        loadParentAttritionOverTimeOrgChart({
          request: requestWithDimensionName.request,
          dimensionName: requestWithDimensionName.dimensionName,
        }),
      ])
    );
  });

  loadOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgChart),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService.getOrgChart(request).pipe(
          map((data: DimensionFluctuationData[]) =>
            loadOrgChartSuccess({ data })
          ),
          catchError((error) =>
            of(loadOrgChartFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  loadWorldMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWorldMap),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService.getWorldMap(request).pipe(
          map((data: CountryDataAttrition[]) => loadWorldMapSuccess({ data })),
          catchError((error) =>
            of(loadWorldMapFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  loadOrgChartEmployees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgChartEmployees),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      map(([action, timeRange]) => {
        return {
          filterDimension: action.data.filterDimension,
          value: action.data.dimensionKey,
          timeRange: timeRange.id,
        };
      }),
      mergeMap((request: EmployeesRequest) =>
        this.organizationalViewService
          .getOrgChartEmployeesForNode(request)
          .pipe(
            map((employees: OrgChartEmployee[]) =>
              loadOrgChartEmployeesSuccess({ employees })
            ),
            catchError((error) =>
              of(loadOrgChartEmployeesFailure({ errorMessage: error.message }))
            )
          )
      )
    );
  });

  loadParent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadParent),
      concatLatestFrom(() => [
        this.store.select(getSelectedDimension),
        this.store.select(getSelectedTimeRange),
      ]),
      mergeMap(([action, selectedDimension, selectedTimeRange]) =>
        this.organizationalViewService
          .getParentOrgUnit(
            selectedDimension,
            selectedTimeRange.id,
            action.data.parentId
          )
          .pipe(
            map((response: DimensionParentResponse) =>
              loadParentSuccess({ response })
            ),
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
      mergeMap((selectedFilter) => [
        filterSelected({
          filter: {
            idValue: selectedFilter.response.data,
            name: selectedFilter.response.filterDimension,
          },
        }),
        loadFilterDimensionData({
          filterDimension: selectedFilter.response.filterDimension,
        }),
      ])
    );
  });

  loadParentAttritionOverTimeOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadParentAttritionOverTimeOrgChart),
      concatLatestFrom(() => this.store.select(getLast6MonthsTimeRange)),
      map(([action, timeRange]) => ({
        ...action.request,
        timeRange,
        type: [
          MonthlyFluctuationOverTime.UNFORCED_LEAVERS,
          MonthlyFluctuationOverTime.UNFORCED_FLUCTUATION_RATES,
          MonthlyFluctuationOverTime.HEADCOUNTS,
        ],
      })),
      switchMap((request: EmployeesRequest) =>
        this.sharedService.getFluctuationRateChartData(request).pipe(
          map((monthlyFluctuation: MonthlyFluctuation) =>
            loadParentAttritionOverTimeOrgChartSuccess({ monthlyFluctuation })
          ),
          catchError((error) =>
            of(
              loadParentAttritionOverTimeOrgChartFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    );
  });

  loadChildAttritionOverTimeOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadChildAttritionOverTimeOrgChart),
      concatLatestFrom(() => this.store.select(getLast6MonthsTimeRange)),
      map(([action, timeRange]) => {
        return {
          filterDimension: action.filterDimension,
          value: action.dimensionKey,
          timeRange,
          type: [
            MonthlyFluctuationOverTime.UNFORCED_LEAVERS,
            MonthlyFluctuationOverTime.UNFORCED_FLUCTUATION_RATES,
            MonthlyFluctuationOverTime.HEADCOUNTS,
          ],
        };
      }),
      switchMap((request) =>
        this.sharedService.getFluctuationRateChartData(request).pipe(
          map((monthlyFluctuation: MonthlyFluctuation) =>
            loadChildAttritionOverTimeOrgChartSuccess({ monthlyFluctuation })
          ),
          catchError((error) =>
            of(
              loadChildAttritionOverTimeOrgChartFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    );
  });

  loadChildAttritionOverTimeForWorldMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadChildAttritionOverTimeForWorldMap),
      concatLatestFrom((action) =>
        this.store.select(
          getDimensionKeyForWorldMap(
            action.filterDimension,
            action.dimensionName
          )
        )
      ),
      map(([action, dimensionKey]) =>
        loadChildAttritionOverTimeOrgChart({
          dimensionKey,
          dimensionName: action.dimensionName,
          filterDimension: action.filterDimension,
        })
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly organizationalViewService: OrganizationalViewService,
    private readonly sharedService: SharedService,
    private readonly store: Store
  ) {}
}
