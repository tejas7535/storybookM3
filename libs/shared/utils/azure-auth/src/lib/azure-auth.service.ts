import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  MSAL_GUARD_CONFIG,
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
  'https://graph.microsoft.com/v1.0/me/photos/48x48/$value';

@Injectable({
  providedIn: 'root',
})
export class AzureAuthService {
  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private readonly msalGuardConfig: MsalGuardConfiguration,
    private readonly authService: MsalService,
    private readonly http: HttpClient
  ) {}

  static createImageFromBlob(image: Blob): Observable<string> {
    const promise: Promise<string> = new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (_e) => resolve(fileReader.result as string);
      fileReader.readAsDataURL(image);
    });

    return from(promise);
  }

  static extractDepartmentFromAzureAccountInfo(
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

  login(): void {
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

  logout(): void {
    this.authService.logout();
  }

  getProfileImage(): Observable<string> {
    return this.http
      .get(GRAPH_PROFILE_IMAGE_ENDPOINT, { responseType: 'blob' })
      .pipe(
        mergeMap((photoBlob) => {
          return AzureAuthService.createImageFromBlob(photoBlob);
        })
      );
  }

  setActiveAccount(acc: AzureAccountInfo): void {
    this.authService.instance.setActiveAccount(acc);
  }

  handleAccount(): AccountInfo {
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

    const department =
      AzureAuthService.extractDepartmentFromAzureAccountInfo(activeAccount);

    return { ...activeAccount, department };
  }
}
