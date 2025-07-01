import { Injectable } from '@angular/core';

import { catchError, filter, map, of, switchMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
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
  loadComparedReasonAnalysis,
  loadComparedReasonAnalysisFailure,
  loadComparedReasonAnalysisSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonAnalysis,
  loadReasonAnalysisFailure,
  loadReasonAnalysisSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';
import {
  getTopBenchmarkReasonsIds,
  getTopReasonsIds,
} from '../selectors/reasons-and-counter-measures.selector';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class ReasonsAndCounterMeasuresEffects {
  readonly REASONS_AND_COUNTER_MEASURES_URL = `/${AppRoutePath.ReasonsForLeavingPath}`;

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
      switchMap(() => [loadReasonsWhyPeopleLeft()])
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

  loadReasonsWhyPeopleLeftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReasonsWhyPeopleLeftSuccess),
      concatLatestFrom(() => [
        this.store.select(getCurrentFilters),
        this.store.select(getTopReasonsIds),
      ]),
      filter(
        ([_action, filters, topReasonIds]) =>
          !!(
            filters.filterDimension &&
            filters.timeRange &&
            filters.value &&
            topReasonIds.length > 0
          )
      ),
      map(([_action, _request, topReasonIds]) => ({
        topReasonIds,
      })),
      switchMap((request) => [
        loadReasonAnalysis({ reasonIds: request.topReasonIds }),
      ])
    )
  );

  loadComparedReasonsWhyPeopleLeftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparedReasonsWhyPeopleLeftSuccess),
      concatLatestFrom(() => [
        this.store.select(getCurrentBenchmarkFilters),
        this.store.select(getTopBenchmarkReasonsIds),
      ]),
      filter(
        ([_action, filters, topReasonIds]) =>
          !!(
            filters.filterDimension &&
            filters.timeRange &&
            filters.value &&
            topReasonIds.length > 0
          )
      ),
      map(([_action, _request, topReasonIds]) => ({
        topReasonIds,
      })),
      switchMap((request) => [
        loadComparedReasonAnalysis({ reasonIds: request.topReasonIds }),
      ])
    )
  );

  loadReasonAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReasonAnalysis),
      concatLatestFrom(() => [this.store.select(getCurrentFilters)]),
      filter(
        ([_action, filters]) =>
          !!(filters.filterDimension && filters.timeRange && filters.value)
      ),
      switchMap(([action, request]) =>
        this.reasonsAndCounterMeasuresService
          .getReasonTextAnalysis(request)
          .pipe(
            map((data) =>
              loadReasonAnalysisSuccess({
                data,
                selectedReasonIds: action.reasonIds,
              })
            ),
            catchError((error) =>
              of(
                loadReasonAnalysisFailure({
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    )
  );

  loadComparedReasonAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparedReasonAnalysis),
      concatLatestFrom(() => [this.store.select(getCurrentBenchmarkFilters)]),
      filter(
        ([_action, filters]) =>
          !!(filters.filterDimension && filters.timeRange && filters.value)
      ),
      switchMap(([action, request]) =>
        this.reasonsAndCounterMeasuresService
          .getReasonTextAnalysis(request)
          .pipe(
            map((data) =>
              loadComparedReasonAnalysisSuccess({
                data,
                selectedReasonIds: action.reasonIds,
              })
            ),
            catchError((error) =>
              of(
                loadComparedReasonAnalysisFailure({
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
