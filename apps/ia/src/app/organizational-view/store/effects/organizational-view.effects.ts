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

import { filterSelected, triggerLoad } from '../../../core/store/actions';
import {
  getCurrentFilters,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { OrgUnitFluctuationData } from '../../models/org-unit-fluctuation-data.model';
import { OrgUnitFluctuationRate } from '../../org-chart/models';
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
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadOrgChart({ request }),
        loadWorldMap({ request }),
        loadAttritionOverTimeOrgChart({ orgUnit: request.orgUnit }),
      ])
    );
  });

  loadOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrgChart),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.organizationalViewService.getOrgChart(request).pipe(
          map((data: OrgUnitFluctuationData[]) =>
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
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      map(([action, timeRange]) => {
        return {
          orgUnit: action.data.orgUnitKey,
          timeRange: timeRange.id,
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
      switchMap((action) =>
        this.organizationalViewService
          .getParentOrgUnit(action.data.parentId)
          .pipe(
            map((idValue: IdValue) => loadParentSuccess({ idValue })),
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
        idValue: action.idValue,
      })),
      map((selectedFilter: SelectedFilter) =>
        filterSelected({ filter: selectedFilter })
      )
    );
  });

  loadAttritionOverTimeOrgChart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAttritionOverTimeOrgChart),
      map((action) => action.orgUnit),
      switchMap((orgUnit: string) =>
        this.organizationalViewService
          .getAttritionOverTime(orgUnit, TimePeriod.LAST_6_MONTHS)
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
