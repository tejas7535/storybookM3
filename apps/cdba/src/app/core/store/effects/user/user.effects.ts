import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@schaeffler/shared/auth';

import * as userActions from '../../actions/';

@Injectable()
export class UserEffects {
  public login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.login),
        tap(() => {
          let targetUrl = '/';

          if (location.hash && location.hash.indexOf('#/') === 0) {
            targetUrl = location.hash.substr(2);
          }
          this.authService.login(targetUrl);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService
  ) {}
}
