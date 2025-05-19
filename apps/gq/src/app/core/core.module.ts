import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { GlobalSearchBarModule } from '@gq/shared/components/global-search-bar/global-search-bar.module';
import { UserSettingsComponent } from '@gq/shared/components/user-settings/user-settings.component';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '@gq/shared/constants/language';
import { HttpErrorInterceptor } from '@gq/shared/http/http-error.interceptor';
import { HttpHeaderInterceptor } from '@gq/shared/http/http-header.interceptor';
import { provideTranslocoScope } from '@jsverse/transloco';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { ApplicationInsightsModule } from '@schaeffler/application-insights';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MaintenanceModule } from '@schaeffler/empty-states';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { ENV, getEnv } from '../../environments/environments.provider';
import { AppComponent } from '../app.component';
import { StoreModule } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    PushPipe,

    // UI Modules
    AppShellModule,
    UserSettingsComponent,
    MatButtonModule,
    MatSnackBarModule,
    LoadingSpinnerModule,
    MaintenanceModule,
    GlobalSearchBarModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id, // fallback language
      LANGUAGE_STORAGE_KEY, // storage key
      true,
      !environment.localDev
    ),
    // Cookie Tracking
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [
    provideTranslocoPersistLang({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        useValue: localStorage,
      },
    }),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true, autoFocus: true },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: ENV,
      useValue: { ...getEnv() },
    },
    provideTranslocoScope('http'),
  ],
  exports: [AppComponent],
})
export class CoreModule {}
