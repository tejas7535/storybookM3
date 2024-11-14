import { Injectable } from '@angular/core';

import { catchError, filter, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import {
  benchmarkFilterSelected,
  filterSelected,
  timePeriodSelected,
} from '../../../core/store/actions';
import {
  getCurrentBenchmarkFilters,
  getCurrentFilters,
} from '../../../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeesRequest } from '../../../shared/models';
import { updateUserSettingsSuccess } from '../../../user/store/actions/user.action';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  loadComparedLeaversByReason,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class ReasonsAndCounterMeasuresEffects {
  readonly REASONS_AND_COUNTER_MEASURES_URL = `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`;

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        filterSelected,
        timePeriodSelected,
        routerNavigationAction,
        updateUserSettingsSuccess
      ),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(
        ([_action, router]) =>
          router.state.url === this.REASONS_AND_COUNTER_MEASURES_URL
      ),
      map(() => loadReasonsWhyPeopleLeft())
    )
  );

  benchmarkFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        benchmarkFilterSelected,
        timePeriodSelected,
        routerNavigationAction
      ),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(
        ([_action, router]) =>
          router.state.url === this.REASONS_AND_COUNTER_MEASURES_URL
      ),
      map(() => loadComparedReasonsWhyPeopleLeft())
    )
  );

  loadReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReasonsWhyPeopleLeft),
      concatLatestFrom(() => [this.store.select(getCurrentFilters)]),
      filter(([_action, b]) => !!(b.filterDimension && b.timeRange && b.value)),
      map(([_action, request]): EmployeesRequest => request),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService
          .getReasonsWhyPeopleLeft(request)
          .pipe(
            map((data: ReasonForLeavingStats) =>
              loadReasonsWhyPeopleLeftSuccess({ data })
            ),
            catchError((error) =>
              of(
                loadReasonsWhyPeopleLeftFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    )
  );

  loadComparedReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparedReasonsWhyPeopleLeft),
      concatLatestFrom(() => [this.store.select(getCurrentBenchmarkFilters)]),
      filter(([_action, b]) => !!(b.filterDimension && b.timeRange && b.value)),
      map(([_action, request]): EmployeesRequest => request),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService
          .getReasonsWhyPeopleLeft(request)
          .pipe(
            map((data: ReasonForLeavingStats) =>
              loadComparedReasonsWhyPeopleLeftSuccess({ data })
            ),
            catchError((error) =>
              of(
                loadComparedReasonsWhyPeopleLeftFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    )
  );

  loadLeaversByReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLeaversByReason),
      concatLatestFrom(() => [this.store.select(getCurrentFilters)]),
      filter(([_action, b]) => !!(b.filterDimension && b.timeRange && b.value)),
      map(
        ([action, request]): EmployeesRequest => ({
          ...request,
          reasonId: action.reasonId,
          detailedReasonId: action.detailedReasonId,
        })
      ),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService.getLeaversByReason(request).pipe(
          map((data: ExitEntryEmployeesResponse) =>
            loadLeaversByReasonSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadLeaversByReasonFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  loadComparedLeaversByReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparedLeaversByReason),
      concatLatestFrom(() => [this.store.select(getCurrentBenchmarkFilters)]),
      filter(([_action, b]) => !!(b.filterDimension && b.timeRange && b.value)),
      map(
        ([action, request]): EmployeesRequest => ({
          ...request,
          reasonId: action.reasonId,
          detailedReasonId: action.detailedReasonId,
        })
      ),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService.getLeaversByReason(request).pipe(
          map((data: ExitEntryEmployeesResponse) =>
            loadLeaversByReasonSuccess({ data })
          ),
          catchError((error) =>
            of(
              loadLeaversByReasonFailure({
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
    private readonly reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService,
    private readonly store: Store
  ) {}
}
