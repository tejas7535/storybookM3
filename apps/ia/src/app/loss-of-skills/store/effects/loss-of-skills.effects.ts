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

import { LossOfSkillsState } from '..';
import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest, LostJobProfile } from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from '../actions/loss-of-skills.actions';

@Injectable()
export class LossOfSkillsEffects implements OnInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly store: Store<LossOfSkillsState>
  ) {}

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      withLatestFrom(this.store.pipe(select(getCurrentFiltersAndTime))),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadLostJobProfiles({ request }),
      ])
    )
  );

  loadLostJobProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLostJobProfiles),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.employeeService.getLostJobProfiles(request).pipe(
          map((lostJobProfiles: LostJobProfile[]) =>
            loadLostJobProfilesSuccess({ lostJobProfiles })
          ),
          catchError((error) =>
            of(loadLostJobProfilesFailure({ errorMessage: error.message }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
