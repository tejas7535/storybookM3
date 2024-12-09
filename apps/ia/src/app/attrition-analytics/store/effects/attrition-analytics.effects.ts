import { Injectable, isDevMode } from '@angular/core';

import { catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';

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
import { EmployeesRequest } from '../../../shared/models';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { EmployeeCluster } from '../../models';
import {
  loadAvailableClusters,
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
} from '../actions/attrition-analytics.action';

@Injectable()
export class AttritionAnalyticsEffects {
  readonly FLUCTUATION_ANALYTICS_URL = `/${AppRoutePath.FluctuationAnalyticsPath}`;

  filterChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        filterSelected,
        timePeriodSelected,
        routerNavigationAction,
        updateUserSettingsSuccess
      ),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(
        ([_action, router]) =>
          router.state.url === this.FLUCTUATION_ANALYTICS_URL
      ),
      mergeMap(() => [loadAvailableClusters()])
    );
  });

  loadAvailableClusters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAvailableClusters),
      filter(() => isDevMode()),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      map(([_action, request]) => request),
      filter((request) => !!(request.timeRange && request.value)),
      switchMap((request: EmployeesRequest) =>
        this.attritionAnalyticsService.getAvailableClusters(request).pipe(
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

  constructor(
    private readonly store: Store,
    private readonly attritionAnalyticsService: AttritionAnalyticsService,
    private readonly actions$: Actions
  ) {}
}
