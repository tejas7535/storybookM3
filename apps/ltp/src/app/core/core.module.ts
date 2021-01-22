import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import {
  OAuthModule,
  OAuthStorage,
  ValidationHandler,
} from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';

import { environment } from '../../environments/environment';
import { RoleGuard } from './guards/role.guard';

export const storageFactory = (): OAuthStorage => localStorage;

@NgModule({
  imports: [
    OAuthModule.forRoot(),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [RoleGuard],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        { provide: OAuthStorage, useFactory: storageFactory },
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
