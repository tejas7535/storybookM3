import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import de from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { HttpErrorInterceptor, HttpModule } from '@schaeffler/http';
import { IconsModule } from '@schaeffler/icons';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import i18nChecksumsJson from '../../i18n-checksums.json';
import { AppComponent } from '../app.component';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { StoreModule } from './store/store.module';

registerLocaleData(de, 'de-DE');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    // UI Modules
    IconsModule,
    HeaderModule,
    FooterModule,
    MatButtonModule,
    LoadingSpinnerModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      i18nChecksumsJson
    ),

    // HTTP
    HttpModule.forRoot({ environment }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // Notifications
    SnackBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  exports: [AppComponent],
})
export class CoreModule {}
