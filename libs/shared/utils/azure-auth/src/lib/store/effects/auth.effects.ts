import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';

import { MsalBroadcastService } from '@azure/msal-angular';
import {
  AccountInfo,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AzureAuthService } from '../../azure-auth.service';
import {
  loadProfileImage,
  loadProfileImageFailure,
  loadProfileImageSuccess,
  login,
  loginSuccess,
  logout,
} from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
        tap(() => this.authService.login())
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

  profileImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProfileImage),
      mergeMap(() =>
        this.authService.getProfileImage().pipe(
          map((url) =>
            loadProfileImageSuccess({
              url,
            })
          ),
          catchError((errorMessage: string) =>
            of(loadProfileImageFailure({ errorMessage }))
          )
        )
      )
    )
  );

  eventLoginSuccess$ = createEffect(() =>
    this.msalBroadcastService.msalSubject$.pipe(
      filter(
        (msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS &&
          msg.payload?.account !== undefined
      ),
      map((result: EventMessage) => result.payload.account),
      tap((accountInfo: AccountInfo) =>
        this.authService.setActiveAccount(accountInfo)
      ),
      mergeMap((accountInfo: AccountInfo) => [
        loginSuccess({ accountInfo }),
        loadProfileImage(),
      ])
    )
  );

  inProgress$ = createEffect(() =>
    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      map(() => this.authService.handleAccount()),
      filter((accountInfo: AccountInfo) => accountInfo !== undefined),
      distinctUntilChanged((old: AccountInfo, current: AccountInfo) => {
        // TODO: better approach?
        return (
          (old.idTokenClaims as any)?.nonce ===
          (current.idTokenClaims as any)?.nonce
        );
      }),
      mergeMap((accountInfo: AccountInfo) => [
        loginSuccess({ accountInfo }),
        loadProfileImage(),
      ])
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AzureAuthService,
    private readonly msalBroadcastService: MsalBroadcastService
  ) {}
}
