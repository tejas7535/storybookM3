import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { TranslocoService } from '@ngneat/transloco';
import {
  TranslocoCurrencyPipe,
  TranslocoDatePipe,
  TranslocoDecimalPipe,
  TranslocoPercentPipe,
} from '@ngneat/transloco-locale';

import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import {
  CUSTOM_DATA_PRIVACY,
  PERSON_RESPONSIBLE,
} from '@schaeffler/legal-pages';

import { environment } from '../environments/environment';
import { DEFAULT_CONFIG } from './../feature-config/default-config';
import { AppComponent } from './app.component';
import { AppRoutePath } from './app-route-path.enum';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { responsiblePerson } from './shared/constants/legal-constants';
import { FeatureToggleConfigService } from './shared/services/feature-toggle/feature-toggle-config.service';
import { FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY } from './shared/services/feature-toggle/feature-toggle-config-localstorage-key.injection-token';
import { FEATURE_TOGGLE_DEFAULT_CONFIG } from './shared/services/feature-toggle/feature-toggle-default-config.injection-token';

export function DynamicDataPrivacy(
  translocoService: TranslocoService
): Observable<string> {
  return translocoService.selectTranslate('legal.customDataPrivacy', {
    responsiblePerson,
  });
}

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appScope]),
  ]),
  new MsalGuardConfig(`/${AppRoutePath.ForbiddenPath}`, [environment.appScope])
);

const FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE = 'gq-feature-config';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
  providers: [
    {
      provide: FEATURE_TOGGLE_DEFAULT_CONFIG,
      useValue: DEFAULT_CONFIG,
    },
    {
      provide: FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY,
      useValue: FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (featureToggleService: FeatureToggleConfigService): (() => void) =>
        (): void => {
          featureToggleService.initializeLocalStorage(environment.environment);
        },

      multi: true,
      deps: [FeatureToggleConfigService],
    },
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: CUSTOM_DATA_PRIVACY,
      useFactory: DynamicDataPrivacy,
      deps: [TranslocoService],
    },
    TranslocoCurrencyPipe,
    TranslocoDatePipe,
    TranslocoDecimalPipe,
    TranslocoPercentPipe,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
