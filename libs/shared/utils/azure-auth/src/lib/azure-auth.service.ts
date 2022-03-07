import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EMPTY, from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
  MSAL_GUARD_CONFIG,
  MsalGuardAuthRequest,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import {
  AccountInfo as AzureAccountInfo,
  AuthenticationResult,
  InteractionType,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';

import { AccountInfo } from './models';

const GRAPH_PROFILE_IMAGE_ENDPOINT =
  'https://graph.microsoft.com/v1.0/me/photos/64x64/$value';

@Injectable({
  providedIn: 'root',
})
export class AzureAuthService {
  public constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private readonly msalGuardConfig: MsalGuardConfiguration,
    private readonly authService: MsalService,
    private readonly http: HttpClient
  ) {}

  public static createImageFromBlob(image: Blob): Observable<string> {
    const promise: Promise<string> = new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', (_e) =>
        resolve(fileReader.result as string)
      );
      fileReader.readAsDataURL(image);
    });

    return from(promise);
  }

  public static extractDepartmentFromAzureAccountInfo(
    accountInfo: AzureAccountInfo
  ): string {
    if (accountInfo.name) {
      const splittedName = accountInfo.name.split(' ');

      return splittedName.length < 3
        ? undefined
        : splittedName[splittedName.length - 1];
    }

    return undefined;
  }

  public login(): void {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService
          .loginPopup({
            ...this.msalGuardConfig.authRequest,
          } as unknown as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService
          .loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
        } as unknown as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  public logout(): void {
    this.authService.logout();
  }

  public getProfileImage(): Observable<string> {
    return this.http
      .get(GRAPH_PROFILE_IMAGE_ENDPOINT, { responseType: 'blob' })
      .pipe(
        mergeMap((photoBlob) => AzureAuthService.createImageFromBlob(photoBlob))
      );
  }

  public setActiveAccount(acc: AzureAccountInfo): void {
    this.authService.instance.setActiveAccount(acc);
  }

  public handleAccount(): Observable<AccountInfo> {
    let activeAccount = this.authService.instance.getActiveAccount();

    // take first available account -> could be extended by some other logic
    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
      activeAccount = accounts[0];
    }

    if (activeAccount) {
      const department =
        AzureAuthService.extractDepartmentFromAzureAccountInfo(activeAccount);

      return this.authService
        .acquireTokenSilent({
          account: activeAccount,
          scopes: (this.msalGuardConfig.authRequest as MsalGuardAuthRequest)
            .scopes,
        })
        .pipe(
          map((account) => {
            const backendRoles = this.decodeAccessToken(
              account.accessToken
            ).roles;

            return { ...activeAccount, department, backendRoles };
          })
        );
    }

    return EMPTY;
  }

  public decodeAccessToken(accessToken: string): any {
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      [...atob(base64)]
        .map((c) => `%${`00${c.codePointAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
