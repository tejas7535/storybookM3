import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import {
  AuthConfig,
  OAuthModule,
  OAuthStorage,
  ValidationHandler,
} from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

import { getAuthConfig } from './auth-config';
import { AuthService } from './auth.service';
import { AzureConfig, FlowType } from './models';
import { StoreModule } from './store/store.module';
import { TokenInterceptor } from './token.interceptor';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  imports: [OAuthModule.forRoot(), StoreModule],
  providers: [AuthService],
})
export class SharedAuthModule {
  static forRoot(
    azureConfig: AzureConfig
  ): ModuleWithProviders<SharedAuthModule> {
    return {
      ngModule: SharedAuthModule,
      providers: [
        { provide: AuthConfig, useValue: getAuthConfig(azureConfig) },
        { provide: OAuthStorage, useFactory: storageFactory },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        ...(azureConfig.flow === FlowType.IMPLICIT_FLOW
          ? [{ provide: ValidationHandler, useClass: JwksValidationHandler }]
          : []),
      ],
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
