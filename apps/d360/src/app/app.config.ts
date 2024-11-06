import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/pt';
import 'moment/locale/zh-cn';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
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
import { getDefaultLocale } from './shared/constants/available-locales';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from './shared/constants/language';
import { responsiblePerson } from './shared/constants/legal-constants';
import { HeadersInterceptor } from './shared/interceptors/headers.interceptor';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';

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
  new MsalGuardConfig(`/${AppRoutePath.ForbiddenPath}`, [environment.appScope])
);

export const appConfig: ApplicationConfig = {
  providers: [
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
        appRoutes.startPage,
        appRoutes.tasks,
        ...appRoutes.functions,
        ...appRoutes.others,
      ],
      withEnabledBlockingInitialNavigation()
    ),
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    // TODO check if all legal injection points are covered and working
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    {
      provide: MomentDateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    importProvidersFrom(MatMomentDateModule),
    provideAnimations(),
  ],
};
