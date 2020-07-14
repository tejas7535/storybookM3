import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { from, Observable } from 'rxjs';

import { OAuthService } from 'angular-oauth2-oidc';
import jwtDecode from 'jwt-decode';

import { AccessToken, User } from './models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public readonly oauthService: OAuthService,
    private readonly injector: Injector
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
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLogin())
      .then(async () => {
        // 1) is already logged in?
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }
        // 2) try silent refresh first
        return this.oauthService.silentRefresh().catch(() => {
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

    return from(
      this.oauthService
        .loadDiscoveryDocumentAndTryLogin()
        .then(async () => {
          this.oauthService.setupAutomaticSilentRefresh();

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
}
