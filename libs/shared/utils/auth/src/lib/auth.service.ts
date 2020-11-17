import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { from, Observable } from 'rxjs';

import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import jwtDecode from 'jwt-decode';

import { AccessToken, User } from './models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public readonly oauthService: OAuthService,
    private readonly injector: Injector,
    private readonly authConfig: AuthConfig
  ) {}

  public static getDecodedAccessToken(token: string): AccessToken {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return undefined;
    }
  }

  public async login(targetUrl?: string): Promise<void> {
    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(async () => {
        if (this.oauthService.hasValidAccessToken()) {
          // 1) is already logged in?
          return Promise.resolve();
        }

        // 2) try refresh first
        const refresh = this.authConfig.useSilentRefresh
          ? () => this.oauthService.silentRefresh()
          : () => this.oauthService.refreshToken();

        return (refresh as any)().catch(() => {
          // 3) silent refresh not possible -> login via implicit flow / code flow
          this.oauthService.initLoginFlow(targetUrl || '/');
        });
      })
      .then(() => {
        this.navigateToState();
        Promise.resolve();
      });
  }

  public tryAutomaticLogin(): Observable<boolean> {
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.setupAutomaticSilentRefresh();

    return from(
      this.oauthService
        .loadDiscoveryDocumentAndTryLogin()
        .then(async () => {
          if (this.oauthService.hasValidAccessToken()) {
            return Promise.resolve(true);
          }

          return Promise.resolve(false);
        })
        .catch(async () => {
          return Promise.resolve(false);
        })
    );
  }

  public hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public getUser(): User {
    if (!this.hasValidAccessToken()) {
      return undefined;
    }

    const token = this.accessToken;

    const decodedAccess = AuthService.getDecodedAccessToken(token);

    if (!decodedAccess) {
      return undefined;
    }

    const username = `${decodedAccess.given_name} ${decodedAccess.family_name}`;

    return { username };
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  public navigateToState(): void {
    const oauthServiceState = this.oauthService.state;
    const state =
      oauthServiceState &&
      oauthServiceState !== 'undefined' &&
      oauthServiceState !== 'null'
        ? decodeURIComponent(oauthServiceState)
        : undefined;

    if (state) {
      this.injector.get<Router>(Router).navigateByUrl(state);
    } else {
      this.injector.get<Router>(Router).initialNavigation();
    }
  }
}
