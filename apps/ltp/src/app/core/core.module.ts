import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
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

import { ApplicationInsightsModule } from '@schaeffler/application-insights';

import { environment } from '../../environments/environment';
import { AuthGuard } from './guards';
import { authConfig } from './guards/auth-config';
import { RoleGuard } from './guards/role.guard';
import { TokenInterceptor } from './interceptors';
import { AuthService, initializer } from './services';

export const storageFactory = (): OAuthStorage => localStorage;

@NgModule({
  imports: [
    OAuthModule.forRoot(),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [AuthGuard, RoleGuard, AuthService],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: AuthConfig, useValue: authConfig },
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        { provide: OAuthStorage, useFactory: storageFactory },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initializer,
          deps: [AuthService],
          multi: true,
        },
      ],
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
