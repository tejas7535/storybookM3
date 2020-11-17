import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { OAuthService } from 'angular-oauth2-oidc';
import jwtDecode from 'jwt-decode';

import { AccessToken } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isAuthenticatedSubject$ = new BehaviorSubject<boolean>(
    false
  );
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private readonly isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  constructor(
    private readonly oauthService: OAuthService,
    private readonly injector: Injector
  ) {
    this.initConfig();
  }

  private static getDecodedAccessToken(token: string): AccessToken {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return undefined;
    }
  }

  public async login(_targetUrl?: string): Promise<void> {
    return this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLogin())
      .then(async () => {
        if (this.oauthService.hasValidAccessToken()) {
          this.isAuthenticatedSubject$.next(true);
        }

        return this.silentRefresh(_targetUrl);
      })
      .then(() => {
        this.navigateToState();
      });
  }

  public logout(noRedirectToLogoutUrl: boolean = true): void {
    this.oauthService.logOut(noRedirectToLogoutUrl);
  }

  public async silentRefresh(targetUrl?: string): Promise<boolean> {
    return this.oauthService
      .silentRefresh()
      .then(() => true)
      .catch(async (_result) => {
        this.oauthService.initImplicitFlow(targetUrl || '/');

        return true;
      });
  }

  public async configureImplicitFlow(): Promise<void> {
    this.oauthService.setStorage(sessionStorage);

    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.navigateToState();
        }
        this.isDoneLoadingSubject$.next(true);
        this.oauthService.setupAutomaticSilentRefresh();
      })
      .catch(() => {
        this.isDoneLoadingSubject$.next(true);
      });
  }

  public hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public getUserName(): Observable<string> {
    return this.isAuthenticated$.pipe(
      map((isAuthenticated) => {
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

  public getAppRoles(): string[] {
    if (!this.hasValidAccessToken()) {
      return [];
    }
    const token = this.accessToken;

    const decodedAccess = AuthService.getDecodedAccessToken(token);

    const roles = decodedAccess.roles;

    return roles;
  }

  private navigateToState(): void {
    if (
      this.oauthService.state &&
      this.oauthService.state !== 'undefined' &&
      this.oauthService.state !== 'null'
    ) {
      this.injector.get<Router>(Router).navigateByUrl(this.oauthService.state);
    } else {
      this.injector.get<Router>(Router).initialNavigation();
    }
  }

  private initConfig(): void {
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );

      if (!this.oauthService.hasValidAccessToken()) {
        this.login();
      }
    });

    this.oauthService.events.subscribe((_event) => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events
      .pipe(filter((e) => ['token_received'].includes(e.type)))
      .subscribe((_e) => {
        this.injector
          .get<Router>(Router)
          .navigateByUrl(String(this.oauthService.state));
      });

    this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
  }
}

/**
 * Use this Function as factory to provide an APP_INITIALIZER in order to be able to
 * perform a login as soon as the application starts
 */
export const initializer: Function = (
  authService: AuthService
) => async (): Promise<void> => {
  await authService.configureImplicitFlow();
  if (!authService.hasValidAccessToken()) {
    await authService.login('/');
  }
};
