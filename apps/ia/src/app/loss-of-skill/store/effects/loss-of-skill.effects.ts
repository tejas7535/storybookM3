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
import { Action, Store } from '@ngrx/store';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest } from '../../../shared/models';
import { LossOfSkillService } from '../../loss-of-skill.service';
import { LostJobProfile } from '../../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from '../actions/loss-of-skill.actions';

@Injectable()
export class LossOfSkillEffects implements OnInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly lossOfSkillService: LossOfSkillService,
    private readonly store: Store
  ) {}

  filterChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterSelected, timeRangeSelected, triggerLoad),
      withLatestFrom(this.store.select(getCurrentFiltersAndTime)),
      map(([_action, request]) => request),
      filter((request) => request.orgUnit),
      mergeMap((request: EmployeesRequest) => [
        loadLostJobProfiles({ request }),
      ])
    );
  });

  loadLostJobProfiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadLostJobProfiles),
      map((action) => action.request),
      mergeMap((request: EmployeesRequest) =>
        this.lossOfSkillService.getLostJobProfiles(request).pipe(
          map((lostJobProfiles: LostJobProfile[]) =>
            loadLostJobProfilesSuccess({ lostJobProfiles })
          ),
          catchError((error) =>
            of(loadLostJobProfilesFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
