import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';

import {
  AuthConfig,
  OAuthModule,
  OAuthStorage,
  ValidationHandler
} from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

import { AuthService } from './auth.service';

import { TokenInterceptor } from './token.interceptor';

import { getAuthConfig } from './auth-config';
import { AzureConfig } from './models';

export const storageFactory = (): OAuthStorage => localStorage;

@NgModule({
  imports: [OAuthModule.forRoot()],
  providers: [AuthService]
})
export class SharedAuthModule {
  static forRoot(
    azureConfig: AzureConfig
  ): ModuleWithProviders<SharedAuthModule> {
    return {
      ngModule: SharedAuthModule,
      providers: [
        { provide: AuthConfig, useValue: getAuthConfig(azureConfig) },
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        { provide: OAuthStorage, useFactory: storageFactory },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: SharedAuthModule) {
    if (parentModule) {
      throw new Error(
        'SharedAuthModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
