import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import {
  AuthConfig,
  OAuthModule,
  OAuthStorage,
  ValidationHandler
} from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

import { getAuthConfig } from './auth-config';
import { AuthService } from './auth.service';
import { AzureConfig } from './models';
import { loginSuccess } from './store';
import { StoreModule } from './store/store.module';
import { TokenInterceptor } from './token.interceptor';

export const storageFactory = (): OAuthStorage => localStorage;

export const loginStatusFactory: Function = (
  authService: AuthService,
  store: Store
) => (): Observable<boolean> => {
  return authService.tryAutomaticLogin().pipe(
    tap(isLoggedin => {
      if (isLoggedin) {
        const user = authService.getUser();
        store.dispatch(loginSuccess({ user }));
        authService.navigateToState();
      }
    })
  );
};

export const initializer = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: loginStatusFactory,
  deps: [AuthService, Store]
};

@NgModule({
  imports: [OAuthModule.forRoot(), StoreModule],
  providers: [AuthService, initializer]
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
