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
  filterDimensionSelected,
  filterSelected,
  triggerLoad,
} from '../../../core/store/actions';
import {
  getCurrentFilters,
  getSelectedDimension,
  getSelectedTimeRangeWithDimension,
} from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  TimePeriod,
} from '../../../shared/models';
import { DimensionFluctuationData } from '../../models/dimension-fluctuation-data.model';
import {
  DimensionParentResponse,
  OrgUnitFluctuationRate,
} from '../../org-chart/models';
import { OrganizationalViewService } from '../../organizational-view.service';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadOrgUnitFluctuationMeta,
  loadOrgUnitFluctuationRate,
  loadOrgUnitFluctuationRateFailure,
  loadOrgUnitFluctuationRateSuccess,
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
      ofType(filterSelected, triggerLoad),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      filter((request) => !!request.timeRange),
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

  loadOrgUnitFluctuationMeta$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgUnitFluctuationMeta),
      concatLatestFrom(() =>
        this.store.select(getSelectedTimeRangeWithDimension)
      ),
      map(([action, filterWithDimension]) => {
        return {
          filterDimension: filterWithDimension.dimension,
          value: action.data.dimensionKey,
          timeRange: filterWithDimension.timeRange.id,
        };
      }),
      switchMap((request: EmployeesRequest) =>
        of(loadOrgUnitFluctuationRate({ request }))
      )
    );
  });

  loadOrgUnitFluctuationRate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgUnitFluctuationRate),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService.getOrgUnitFluctuationRate(request).pipe(
          map((rate: OrgUnitFluctuationRate) =>
            loadOrgUnitFluctuationRateSuccess({ rate })
          ),
          catchError((error) =>
            of(
              loadOrgUnitFluctuationRateFailure({ errorMessage: error.message })
            )
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
      concatLatestFrom(() => this.store.select(getSelectedDimension)),
      mergeMap(([action, selectedDimension]) =>
        this.organizationalViewService
          .getParentOrgUnit(selectedDimension, action.data.parentId)
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
      map((selectedFilter) =>
        filterDimensionSelected({
          filterDimension: selectedFilter.response.filterDimension,
          filter: {
            idValue: selectedFilter.response.data,
            name: selectedFilter.response.filterDimension,
          },
        })
      )
    );
  });

  loadAttritionOverTimeOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAttritionOverTimeOrgChart),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService
          .getAttritionOverTime(
            request.filterDimension,
            request.value,
            TimePeriod.LAST_6_MONTHS
          )
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
