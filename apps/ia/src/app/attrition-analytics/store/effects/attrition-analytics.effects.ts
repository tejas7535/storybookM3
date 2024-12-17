import { Injectable } from '@angular/core';

import { catchError, filter, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import {
  filterSelected,
  timePeriodSelected,
} from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import { isFeatureEnabled } from '../../../shared/guards/is-feature-enabled';
import { EmployeesRequest } from '../../../shared/models';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { EmployeeAnalytics, EmployeeCluster } from '../../models';
import {
  loadAvailableClusters,
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
  selectCluster,
} from '../actions/attrition-analytics.action';
import { getSelectedCluster } from '../selectors/attrition-analytics.selector';

@Injectable()
export class AttritionAnalyticsEffects {
  readonly FLUCTUATION_ANALYTICS_URL = `/${AppRoutePath.FluctuationAnalyticsPath}`;

  routeChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigationAction, updateUserSettingsSuccess),
      concatLatestFrom(() => [this.store.select(selectRouterState)]),
      filter(
        ([_action, router]) =>
          router.state.url === this.FLUCTUATION_ANALYTICS_URL
      ),
      map(() => loadAvailableClusters())
    );
  });

  filterChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterSelected, timePeriodSelected),
      concatLatestFrom(() => [this.store.select(getCurrentFilters)]),
      filter(([_action, filters]) => !!(filters.timeRange && filters.value)),
      map(() => loadEmployeeAnalytics())
    );
  });

  loadAvailableClusters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAvailableClusters),
      filter(() => isFeatureEnabled()),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      switchMap(() =>
        this.attritionAnalyticsService.getAvailableClusters().pipe(
          map((data: EmployeeCluster[]) =>
            loadAvailableClustersSuccess({ data })
          ),
          catchError((error) =>
            of(loadAvailableClustersFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  selectCluster$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectCluster, loadAvailableClustersSuccess),
      map(() => loadEmployeeAnalytics())
    );
  });

  loadEmployeeAnalytics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadEmployeeAnalytics),
      concatLatestFrom(() => [
        this.store.select(getCurrentFilters),
        this.store.select(getSelectedCluster),
      ]),
      map(([_action, request, cluster]) => ({ ...request, cluster })),
      filter((request) => !!request.cluster),
      switchMap((request: EmployeesRequest) =>
        this.attritionAnalyticsService.getEmployeeAnalytics(request).pipe(
          map((data: EmployeeAnalytics[]) =>
            loadEmployeeAnalyticsSuccess({ data })
          ),
          catchError((error) =>
            of(loadEmployeeAnalyticsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly attritionAnalyticsService: AttritionAnalyticsService,
    private readonly actions$: Actions
  ) {}
}
