import { Injectable } from '@angular/core';

import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { AuthService } from '../../auth.service';
import * as authActions from '../actions/auth.actions';
import { getIsLoggedIn } from '../selectors/auth.selectors';

@Injectable()
export class AuthEffects {
  public loginImplicitFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginImplicitFlow),
      withLatestFrom(this.store.pipe(select(getIsLoggedIn))),
      filter(([_action, isLoggedIn]) => !isLoggedIn),
      mergeMap(() =>
        // try to login automatically
        this.authService.tryAutomaticLogin().pipe(
          map(isLoggedIn => {
            let action;

            if (isLoggedIn) {
              const user = this.authService.getUser();
              action = authActions.loginSuccess({ user });
              this.authService.navigateToState();
            } else {
              // could not login automatically -> login
              action = authActions.login();
            }

            return action;
          })
        )
      )
    )
  );

  public login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.login),
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

  public logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          this.authService.logout();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly store: Store
  ) {}
}
