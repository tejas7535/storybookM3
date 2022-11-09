import { Injectable } from '@angular/core';

import { catchError, EMPTY, filter, map, mergeMap, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { selectRouterState } from '../../../core/store';
import { filterSelected, triggerLoad } from '../../../core/store/actions';
import {
  getCurrentFilters,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { FilterService } from '../../../filter-section/filter.service';
import {
  EmployeesRequest,
  FilterDimension,
  IdValue,
  SelectedFilter,
} from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  comparedFilterDimensionSelected,
  comparedFilterSelected,
  loadComparedFilterDimensionData,
  loadComparedFilterDimensionDataFailure,
  loadComparedFilterDimensionDataSuccess,
  loadComparedOrgUnits,
  loadComparedOrgUnitsFailure,
  loadComparedOrgUnitsSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsAndCounterMeasuresData,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';
import {
  getComparedSelectedBusinessArea,
  getComparedSelectedTimeRange,
  getCurrentComparedFilters,
} from '../selectors/reasons-and-counter-measures.selector';

/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
@Injectable()
export class ReasonsAndCounterMeasuresEffects {
  readonly REASONS_AND_COUNTER_MEASURES_URL = `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`;

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, routerNavigationAction),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      filter(
        ([_action, router]) =>
          router.state.url === this.REASONS_AND_COUNTER_MEASURES_URL
      ),
      map(() => loadReasonsAndCounterMeasuresData())
    )
  );

  loadReasonsAndCounterMeasuresData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, triggerLoad),
      concatLatestFrom(() => [this.store.select(getCurrentFilters)]),
      filter(([_action, b]) => !!(b.filterDimension && b.timeRange && b.value)),
      map(([_action, request]): EmployeesRequest => request),
      mergeMap((request: EmployeesRequest) => [
        loadReasonsWhyPeopleLeft({ request }),
      ])
    )
  );

  loadReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReasonsWhyPeopleLeft),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService
          .getReasonsWhyPeopleLeft(request)
          .pipe(
            map((data: ReasonForLeavingStats[]) =>
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

  comparedFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(comparedFilterSelected),
      concatLatestFrom(() => this.store.select(getCurrentComparedFilters)),
      filter(
        ([action, request]) =>
          action.filter.idValue.id &&
          Object.values(FilterDimension).find(
            (fd: string) => fd === action.filter.name
          ) &&
          request.timeRange
      ),
      map(
        ([action, request]): EmployeesRequest => ({
          filterDimension: action.filter.name as FilterDimension,
          timeRange: request.timeRange,
          value: action.filter.idValue.id,
        })
      ),
      mergeMap((request: EmployeesRequest) => [
        loadComparedReasonsWhyPeopleLeft({ request }),
      ])
    )
  );

  loadComparedReasonsWhyPeopleLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparedReasonsWhyPeopleLeft),
      map((action) => action.request),
      switchMap((request: EmployeesRequest) =>
        this.reasonsAndCounterMeasuresService
          .getReasonsWhyPeopleLeft(request)
          .pipe(
            map((data: ReasonForLeavingStats[]) =>
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

  loadComparedOrgUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadComparedOrgUnits),
      concatLatestFrom(() => this.store.select(getComparedSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.filterService.getOrgUnits(action.searchFor, timeRange.id).pipe(
          map((items: IdValue[]) =>
            loadComparedOrgUnitsSuccess({
              items,
            })
          ),
          catchError((error) =>
            of(
              loadComparedOrgUnitsFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    );
  });

  loadFilterDimensionData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadComparedFilterDimensionData),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.filterService
          .getDataForFilterDimension(
            action.filterDimension,
            action.searchFor,
            timeRange.id
          )
          .pipe(
            map((items: IdValue[]) =>
              loadComparedFilterDimensionDataSuccess({
                filterDimension: action.filterDimension,
                items,
              })
            ),
            catchError((error) =>
              of(
                loadComparedFilterDimensionDataFailure({
                  filterDimension: action.filterDimension,
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    );
  });

  loadComparedFilterDimensionDataSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadComparedFilterDimensionDataSuccess),
      concatLatestFrom(() =>
        this.store.select(getComparedSelectedBusinessArea)
      ),
      mergeMap(([action, selectedBusinessArea]) => {
        return selectedBusinessArea
          ? of(
              comparedFilterSelected({
                filter: {
                  name: action.filterDimension,
                  idValue: selectedBusinessArea,
                } as SelectedFilter,
              })
            )
          : EMPTY;
      })
    );
  });

  comparedFilterDimensionSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(comparedFilterDimensionSelected),
      map((selectedFilter) =>
        comparedFilterSelected({ filter: selectedFilter.filter })
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
