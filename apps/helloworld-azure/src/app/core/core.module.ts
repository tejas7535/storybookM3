import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';

import {
  AuthConfig,
  JwksValidationHandler,
  OAuthModule,
  OAuthStorage,
  ValidationHandler
} from 'angular-oauth2-oidc';

import { AuthService } from './auth.service';

import { TokenInterceptor } from './token.interceptor';

import { authConfig } from './auth-config';
import { AuthGuard } from './auth.guard';

export const storageFactory = (): OAuthStorage => localStorage;

@NgModule({
  imports: [OAuthModule.forRoot()],
  providers: [AuthGuard, AuthService]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: AuthConfig, useValue: authConfig },
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

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
