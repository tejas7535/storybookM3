import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { AuthState } from '..';
import { AuthService } from '../../auth.service';
import * as authActions from '../actions/auth.actions';
import { getIsLoggedIn } from '../selectors/auth.selectors';

@Injectable()
export class AuthEffects {
  public startLoginFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.startLoginFlow),
      withLatestFrom(this.store.pipe(select(getIsLoggedIn))),
      filter(([_action, isLoggedIn]) => !isLoggedIn),
      mergeMap(() =>
        // try to login automatically
        this.authService.tryAutomaticLogin().pipe(
          map((isLoggedIn) => {
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

  public loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSuccess),
      map(() => {
        const accessToken = this.authService.accessToken;
        const token = AuthService.getDecodedAccessToken(accessToken);

        return authActions.setToken({ token, accessToken });
      })
    )
  );

  public tokenChange$ = createEffect(() =>
    this.authService.oauthService.events.pipe(
      filter((e) =>
        ['silently_refreshed', 'token_received', 'token_refreshed'].includes(
          e.type
        )
      ),
      tap((e) => {
        if (e.type === 'token_received') {
          this.router.navigateByUrl(
            String(this.authService.oauthService.state)
          );
        }
      }),
      mergeMap(() => {
        const user = this.authService.getUser();
        const accessToken = this.authService.accessToken;
        const token = AuthService.getDecodedAccessToken(accessToken);

        return [
          authActions.setToken({
            token,
            accessToken,
          }),
          authActions.loginSuccess({ user }),
        ];
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly store: Store<AuthState>,
    private readonly router: Router
  ) {}
}
