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
import { InteractionStatus } from '@azure/msal-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AzureAuthService } from '../../azure-auth.service';
import { AccountInfo, LoadProfileImageError } from '../../models';
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
  public login$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(login),
        tap(() => this.authService.login())
      );
    },
    { dispatch: false }
  );

  public logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        tap(() => this.authService.logout())
      );
    },
    { dispatch: false }
  );

  public profileImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadProfileImage),
      mergeMap(() =>
        this.authService.getProfileImage().pipe(
          map((url) =>
            loadProfileImageSuccess({
              url,
            })
          ),
          catchError((errorMessage: LoadProfileImageError) =>
            of(
              loadProfileImageFailure({
                errorMessage: errorMessage.message,
              })
            )
          )
        )
      )
    );
  });

  public inProgress$ = createEffect(() => {
    return this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      mergeMap(() => this.authService.handleAccount()),
      filter((accountInfo: AccountInfo) => accountInfo !== undefined),
      distinctUntilChanged((old: AccountInfo, current: AccountInfo) => {
        return (
          (old.idTokenClaims as any)?.nonce ===
          (current.idTokenClaims as any)?.nonce
        );
      }),
      mergeMap((accountInfo: AccountInfo) => [
        loginSuccess({ accountInfo }),
        loadProfileImage(),
      ])
    );
  });

  public constructor(
    private readonly actions$: Actions,
    private readonly authService: AzureAuthService,
    private readonly msalBroadcastService: MsalBroadcastService
  ) {}
}
