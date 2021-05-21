import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { OverviewState } from '..';
import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  TimePeriod,
} from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';
import { EmployeeService } from '../../../shared/services/employee.service';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
} from '../actions/overview.action';

@Injectable()
export class OverviewEffects implements OnInitEffects {
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      withLatestFrom(this.store.pipe(select(getCurrentFiltersAndTime))),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadAttritionOverTimeOverview({ request }),
        loadFluctuationRatesOverview({ request }),
      ])
    )
  );

  loadAttritionOverTimeOverview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAttritionOverTimeOverview),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService
          .getAttritionOverTime(request, TimePeriod.LAST_THREE_YEARS)
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
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getOverviewFluctuationRates(request).pipe(
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

  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly store: Store<OverviewState>
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
