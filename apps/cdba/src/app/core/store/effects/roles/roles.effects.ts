import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { getIsLoggedIn } from '@schaeffler/azure-auth';

import { RoleDescriptions } from '../../../auth/models/roles.models';
import { RoleDescriptionsService } from '../../../auth/services/role-descriptions.service';
import {
  loadRoleDescriptions,
  loadRoleDescriptionsFailure,
  loadRoleDescriptionsSuccess,
} from '../../actions';

@Injectable()
export class RolesEffects implements OnInitEffects {
  loadRoleDescriptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadRoleDescriptions),
      mergeMap(() =>
        this.roleDescriptionsService.getRoleDescriptions().pipe(
          map((roleDescriptions: RoleDescriptions) =>
            loadRoleDescriptionsSuccess({ roleDescriptions })
          ),
          catchError((errorMessage) =>
            of(loadRoleDescriptionsFailure({ errorMessage }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly roleDescriptionsService: RoleDescriptionsService,
    private readonly store: Store
  ) {}

  /**
   * Initially load role descriptions when logged in
   */
  ngrxOnInitEffects(): Action {
    this.store
      .select(getIsLoggedIn)
      .pipe(
        filter((isLoggedIn) => isLoggedIn),
        take(1),
        tap(() => this.store.dispatch(loadRoleDescriptions()))
      )
      .subscribe();

    return { type: 'NO_ACTION' };
  }
}
