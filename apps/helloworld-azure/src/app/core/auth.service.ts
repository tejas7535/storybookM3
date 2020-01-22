import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import jwtDecode from 'jwt-decode';

import { AccessToken } from './access-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly errorResponsesRequiringUserInteraction = [
    'interaction_required',
    'login_required',
    'account_selection_required',
    'consent_required'
  ];

  private readonly isAuthenticatedSubject$ = new BehaviorSubject<boolean>(
    false
  );
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private readonly isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  private static getDecodedAccessToken(token: string): AccessToken {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return undefined;
    }
  }

  constructor(
    private readonly oauthService: OAuthService,
    private readonly router: Router
  ) {
    this.initConfig();
  }

  public async initAuth(): Promise<void> {
    return this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLogin())
      .then(async () => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }

        return this.silentRefresh();
      })
      .then(() => {
        this.isDoneLoadingSubject$.next(true);

        this.navigateToState();
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }

  public login(targetUrl?: string): void {
    this.oauthService.initImplicitFlow(
      encodeURIComponent(targetUrl || this.router.url)
    );
  }

  public get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public getUserName(): Observable<string> {
    return this.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          return undefined;
        }
        const token = this.accessToken;

        const decodedAccess = AuthService.getDecodedAccessToken(token);

        const username = decodedAccess
          ? `${decodedAccess.given_name} ${decodedAccess.family_name}`
          : undefined;

        return username;
      })
    );
  }

  private initConfig(): void {
    window.addEventListener('storage', event => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );

      if (!this.oauthService.hasValidAccessToken()) {
        this.login();
      }
    });

    this.oauthService.events.subscribe(_ => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(_e => this.router.navigateByUrl(this.oauthService.state));

    this.oauthService.setupAutomaticSilentRefresh();
  }

  private navigateToState(): void {
    if (
      this.oauthService.state &&
      this.oauthService.state !== 'undefined' &&
      this.oauthService.state !== 'null'
    ) {
      this.router.navigateByUrl(this.oauthService.state);
    }
  }

  private async silentRefresh(): Promise<void> {
    return this.oauthService
      .silentRefresh()
      .then(() => Promise.resolve())
      .catch(async result => {
        if (
          result &&
          result.reason &&
          this.errorResponsesRequiringUserInteraction.indexOf(
            result.reason.error
          ) >= 0
        ) {
          this.login();

          return Promise.resolve();
        }

        return Promise.reject();
      });
  }
}
