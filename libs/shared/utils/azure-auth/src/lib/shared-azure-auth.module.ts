import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
} from '@azure/msal-angular';

import {
  getMsalGuardConfig,
  getMsalInstanceConfig,
  getMsalInterceptorConfig,
} from './auth-config';
import { AzureAuthService } from './azure-auth.service';
import { AzureConfig } from './models';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [MsalModule, StoreModule],
  providers: [AzureAuthService, MsalService, MsalGuard, MsalBroadcastService],
  bootstrap: [MsalRedirectComponent],
})
export class SharedAzureAuthModule {
  public constructor(
    @Optional() @SkipSelf() parentModule: SharedAzureAuthModule
  ) {
    if (parentModule) {
      throw new Error(
        'SharedAzureAuthModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  public static forRoot(
    azureConfig: AzureConfig
  ): ModuleWithProviders<SharedAzureAuthModule> {
    return {
      ngModule: SharedAzureAuthModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        },
        {
          provide: MSAL_INSTANCE,
          useValue: getMsalInstanceConfig(azureConfig.msalInstance),
        },
        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          useValue: getMsalInterceptorConfig(azureConfig.msalInterceptor),
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useValue: getMsalGuardConfig(azureConfig.msalGuard),
        },
      ],
    };
  }
}
