import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { MsalInterceptor } from '@azure/msal-angular';
import { TranslocoService } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
} from '@schaeffler/application-insights';
import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PERSON_RESPONSIBLE, PURPOSE } from '@schaeffler/legal-pages';
import {
  sharedTranslocoLocaleConfig,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { AppRoutePath } from './app.routes.enum';
import {
  dateFormatFactory,
  getDefaultLocale,
} from './shared/constants/available-locales';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from './shared/constants/language';
import { responsiblePerson } from './shared/constants/legal-constants';
import { HeadersInterceptor } from './shared/interceptors/headers.interceptor';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { TranslatedPageTitleStrategyService } from './shared/services/translated-page-title-strategy.service';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    environment.enableMsalLogger && !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appScope]),
  ]),
  new MsalGuardConfig(`/${AppRoutePath.ForbiddenPage}`, [environment.appScope])
);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ApplicationInsightsModule.forRoot(environment.applicationInsights)
    ),
    provideAppInitializer(() => {
      const applicationInsightsService = inject(ApplicationInsightsService);

      applicationInsightsService.addCustomPropertyToTelemetryData(
        'application',
        '[d360 - Planning360]'
      );
      applicationInsightsService.startTracking(true);
    }),
    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(
      SharedTranslocoModule.forRoot(
        isDevMode(),
        AVAILABLE_LANGUAGES,
        undefined,
        FALLBACK_LANGUAGE.id,
        LANGUAGE_STORAGE_KEY,
        true,
        !isDevMode()
      )
    ),
    provideTranslocoLocale({
      ...sharedTranslocoLocaleConfig,
      defaultLocale: getDefaultLocale().id,
    }),
    provideTranslocoPersistLang({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        useValue: localStorage,
      },
    }),
    provideTranslocoMessageformat(),
    importProvidersFrom(
      SharedAzureAuthModule.forRoot(azureConfig),
      StoreModule.forRoot({}),
      EffectsModule.forRoot(),
      NgxEchartsModule.forRoot({ echarts })
    ),
    provideRouter(
      [
        appRoutes.root,
        appRoutes.todos,
        ...appRoutes.functions.salesSuite,
        ...appRoutes.functions.demandSuite,
        ...appRoutes.functions.general,
        ...appRoutes.others,
      ],
      withEnabledBlockingInitialNavigation()
    ),
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },

    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },

    provideDateFnsAdapter(),
    {
      provide: MAT_DATE_FORMATS,
      useFactory: dateFormatFactory,
      deps: [DateAdapter],
    },
    provideAnimations(),
    {
      provide: TitleStrategy,
      useClass: TranslatedPageTitleStrategyService,
    },
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true,
    }),
  ],
};
