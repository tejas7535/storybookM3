import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { CustomMissingTranslationHandler } from '@gq/shared/custom-missing-translation-handler';
import {
  TRANSLOCO_MISSING_HANDLER,
  TranslocoService,
} from '@jsverse/transloco';
import {
  TranslocoCurrencyPipe,
  TranslocoDatePipe,
  TranslocoDecimalPipe,
  TranslocoPercentPipe,
} from '@jsverse/transloco-locale';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';

import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
// eslint-disable-next-line @nx/enforce-module-boundaries
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
import { AgGridStateService } from './shared/services/ag-grid-state/ag-grid-state.service';
import { FeatureToggleConfigService } from './shared/services/feature-toggle/feature-toggle-config.service';
import { FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY } from './shared/services/feature-toggle/feature-toggle-config-localstorage-key.injection-token';
import { FEATURE_TOGGLE_DEFAULT_CONFIG } from './shared/services/feature-toggle/feature-toggle-default-config.injection-token';
import { UserSettingsService } from './shared/services/rest/user-settings/user-settings.service';
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
    new ProtectedResource('https://graph.microsoft.com/v1.0/users', [
      'User.ReadBasic.All',
    ]),
  ]),
  new MsalGuardConfig(`/${AppRoutePath.ForbiddenPath}`, [environment.appScope])
);

const FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE = 'gq-feature-config';

@NgModule({
  bootstrap: [AppComponent, MsalRedirectComponent],
  imports: [
    HttpCacheInterceptorModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
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
    provideAppInitializer(() => {
      const initializerFn = (
        (
          featureToggleService: FeatureToggleConfigService,
          agGridStateService: AgGridStateService,
          userSettings: UserSettingsService
        ): (() => void) =>
        (): void => {
          featureToggleService.initializeLocalStorage(environment.environment);
          userSettings.initializeUserSettings();
          agGridStateService.renameQuotationIdToActionItemForProcessCaseState();
        }
      )(
        inject(FeatureToggleConfigService),
        inject(AgGridStateService),
        inject(UserSettingsService)
      );

      return initializerFn();
    }),
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: CUSTOM_DATA_PRIVACY,
      useFactory: DynamicDataPrivacy,
      deps: [TranslocoService],
    },
    {
      provide: TRANSLOCO_MISSING_HANDLER,
      useClass: CustomMissingTranslationHandler,
    },
    TranslocoCurrencyPipe,
    TranslocoDatePipe,
    TranslocoDecimalPipe,
    TranslocoPercentPipe,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
