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
import { LossOfSkillsService } from '../../loss-of-skills.service';
import { LostJobProfile } from '../../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from '../actions/loss-of-skills.actions';

@Injectable()
export class LossOfSkillsEffects implements OnInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly lossOfSkillsService: LossOfSkillsService,
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
        this.lossOfSkillsService.getLostJobProfiles(request).pipe(
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
